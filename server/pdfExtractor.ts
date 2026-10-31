import { PDFParse } from 'pdf-parse';
import { GoogleGenAI } from '@google/genai';
import { extractDocumentDate } from './ocrEngine.ts';

export interface ExtractedPdfResult {
  text: string;
  pages: { pageNumber: number; text: string }[];
  pageCount: number;
  detectedTitle?: string;
  detectedDate?: string;
  method: 'pdf-parse' | 'gemini-multimodal' | 'plain-text';
}

/**
 * Robust server-side PDF text extractor.
 * 1. Uses fast PDFParse for vector-text PDFs.
 * 2. Falls back to Gemini Multimodal OCR if PDF is image/scanned or Telugu/Hindi script without embedded fonts.
 */
export async function extractTextFromPdfBuffer(
  buffer: Buffer,
  fileName?: string
): Promise<ExtractedPdfResult> {
  let pages: { pageNumber: number; text: string }[] = [];
  let method: 'pdf-parse' | 'gemini-multimodal' | 'plain-text' = 'pdf-parse';

  try {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();

    if (result && Array.isArray(result.pages) && result.pages.length > 0) {
      pages = result.pages
        .map((p, idx) => ({
          pageNumber: p.num || idx + 1,
          text: (p.text || '').replace(/\r\n/g, '\n').trim(),
        }))
        .filter((p) => p.text.length > 0);
    }
  } catch (err) {
    console.warn('PDFParse extraction note:', err);
  }

  const totalExtractedLength = pages.reduce((acc, p) => acc + p.text.length, 0);

  // If PDFParse yielded very little text (e.g., scanned PDF or embedded images), try Gemini Multimodal OCR
  if (totalExtractedLength < 50 && process.env.GEMINI_API_KEY) {
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      const base64 = buffer.toString('base64');
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: base64,
            },
          },
          {
            text: 'Extract the full text of this institutional academic/administrative document page-by-page. Separate each page with "---PAGE---". Preserve all official headings, dates, percentages, numbers, course codes, and terms verbatim.',
          },
        ],
      });

      const extracted = response.text ? response.text.trim() : '';
      if (extracted.length > 50) {
        method = 'gemini-multimodal';
        const rawPages = extracted.split('---PAGE---');
        pages = rawPages.map((pt, idx) => ({
          pageNumber: idx + 1,
          text: pt.trim(),
        })).filter((p) => p.text.length > 0);
      }
    } catch (geminiErr) {
      console.warn('Gemini multimodal PDF OCR fallback note:', geminiErr);
    }
  }

  // If still empty, provide graceful fallback
  if (pages.length === 0) {
    pages = [
      {
        pageNumber: 1,
        text: fileName
          ? `Document: ${fileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}\nOfficial Institutional Record.`
          : 'Official Institutional Document',
      },
    ];
  }

  const combinedText = pages.map((p) => p.text).join('\n\n---PAGE---\n\n');
  const detectedDate = extractDocumentDate(combinedText) || undefined;

  // Suggest document title
  let detectedTitle: string | undefined;
  if (fileName) {
    detectedTitle = fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]+/g, ' ')
      .trim();
  }
  const firstLine = pages[0]?.text.split('\n')[0]?.trim();
  if (firstLine && firstLine.length > 6 && firstLine.length < 90 && !firstLine.startsWith('%PDF')) {
    detectedTitle = firstLine;
  }

  return {
    text: combinedText,
    pages,
    pageCount: pages.length,
    detectedTitle,
    detectedDate,
    method,
  };
}
