import { DocumentChunk, DocumentPage, LanguageCode } from '../src/types/index.ts';

/**
 * Detect script / language of text
 */
export function detectLanguage(text: string): LanguageCode {
  const teluguRegex = /[\u0C00-\u0C7F]/;
  const hindiRegex = /[\u0900-\u097F]/;

  let teluguCount = 0;
  let hindiCount = 0;

  for (const char of text) {
    if (teluguRegex.test(char)) teluguCount++;
    if (hindiRegex.test(char)) hindiCount++;
  }

  if (teluguCount > 2) return 'te';
  if (hindiCount > 2) return 'hi';
  return 'en';
}

/**
 * Parse date from text (English, Hindi, Telugu representations)
 */
export function extractDocumentDate(text: string): string | null {
  // ISO date YYYY-MM-DD
  const isoMatch = text.match(/\b(20\d{2})[-/.](0[1-9]|1[0-2])[-/.](0[1-9]|[12]\d|3[01])\b/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;

  // English: 15 March 2026 or March 15, 2026
  const enMatch = text.match(/\b(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(20\d{2})\b/i);
  if (enMatch) {
    const months: Record<string, string> = {
      january: '01', february: '02', march: '03', april: '04',
      may: '05', june: '06', july: '07', august: '08',
      september: '09', october: '10', november: '11', december: '12',
    };
    const day = enMatch[1].padStart(2, '0');
    const month = months[enMatch[2].toLowerCase()] || '01';
    const year = enMatch[3];
    return `${year}-${month}-${day}`;
  }

  // Hindi: 18 अक्टूबर 2025
  const hiMatch = text.match(/(\d{1,2})\s+(जनवरी|फरवरी|मार्च|अप्रैल|मई|जून|जुलाई|अगस्त|सितंबर|अक्टूबर|नवंबर|दिसंबर)\s+(20\d{2})/);
  if (hiMatch) {
    const hiMonths: Record<string, string> = {
      'जनवरी': '01', 'फरवरी': '02', 'मार्च': '03', 'अप्रैल': '04',
      'मई': '05', 'जून': '06', 'जुलाई': '07', 'अगस्त': '08',
      'सितंबर': '09', 'अक्टूबर': '10', 'नवंबर': '11', 'दिसंबर': '12',
    };
    const day = hiMatch[1].padStart(2, '0');
    const month = hiMonths[hiMatch[2]] || '01';
    return `${hiMatch[3]}-${month}-${day}`;
  }

  // Telugu: 12 నవంబర్ 2025
  const teMatch = text.match(/(\d{1,2})\s+(జనవరి|ఫిబ్రవరి|మార్చి|ఏప్రిల్|మే|జూన్|జూలై|ఆగస్టు|సెప్టెంబర్|అక్టోబర్|నవంబర్|డిసెంబర్)\s+(20\d{2})/);
  if (teMatch) {
    const teMonths: Record<string, string> = {
      'జనవరి': '01', 'ఫిబ్రవరి': '02', 'మార్చి': '03', 'ఏప్రిల్': '04',
      'మే': '05', 'జూన్': '06', 'జూలై': '07', 'ఆగస్టు': '08',
      'సెప్టెంబర్': '09', 'అక్టోబర్': '10', 'నవంబర్': '11', 'డిసెంబర్': '12',
    };
    const day = teMatch[1].padStart(2, '0');
    const month = teMonths[teMatch[2]] || '01';
    return `${teMatch[3]}-${month}-${day}`;
  }

  return null;
}

/**
 * Intelligent text chunker that preserves page numbers and headings
 */
export function chunkDocumentPages(
  documentId: string,
  pages: DocumentPage[]
): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  let chunkIndex = 0;

  for (const page of pages) {
    const pageText = page.text.trim();
    if (!pageText) continue;

    // Split page into logical paragraphs or sections (double newlines or bullet points)
    const paragraphs = pageText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 20);

    if (paragraphs.length === 0) {
      // Small or single block
      chunks.push({
        id: `chunk-${documentId}-p${page.pageNumber}-${chunkIndex++}`,
        documentId,
        pageNumber: page.pageNumber,
        chunkIndex,
        text: pageText,
        language: detectLanguage(pageText),
        heading: `Page ${page.pageNumber} Excerpt`,
      });
      continue;
    }

    for (let i = 0; i < paragraphs.length; i++) {
      const para = paragraphs[i];
      // Try to determine a title or section heading from the first line
      const lines = para.split('\n');
      const firstLine = lines[0].replace(/^[0-9#.*-\s]+/, '').trim();
      const heading = firstLine.length > 5 && firstLine.length < 80 ? firstLine : `Page ${page.pageNumber} Section ${i + 1}`;

      chunks.push({
        id: `chunk-${documentId}-p${page.pageNumber}-${chunkIndex++}`,
        documentId,
        pageNumber: page.pageNumber,
        chunkIndex,
        text: para,
        language: detectLanguage(para),
        heading,
      });
    }
  }

  return chunks;
}
