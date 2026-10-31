import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { ChatMessage, Citation, LanguageCode, RAGQueryResponse } from '../../types/index.ts';
import { CitationCard } from './CitationCard.tsx';
import { ConflictWarningCard } from './ConflictWarningCard.tsx';
import { RefusalCard } from './RefusalCard.tsx';
import {
  Send,
  Mic,
  MicOff,
  Trash2,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  HelpCircle,
  ChevronRight,
  Globe,
  FileSearch,
} from 'lucide-react';

interface ChatInterfaceProps {
  onOpenDocumentViewer: (docId: string, pageNumber: number, highlight?: string) => void;
  initialQuery?: string;
}

const INITIAL_SUGGESTIONS = [
  {
    en: 'What is the minimum attendance requirement?',
    hi: 'न्यूनतम उपस्थिति कितनी होनी चाहिए?',
    te: 'కనీస హాజరు ఎంత ఉండాలి?',
    category: 'Academic Regulations',
  },
  {
    en: 'What is the examination fee?',
    hi: 'परीक्षा शुल्क कितना है?',
    te: 'పరీక్ష ఫీజు ఎంత?',
    category: 'Fee & Superseded Circular',
  },
  {
    en: 'What are the hostel timings?',
    hi: 'हॉस्टल के प्रवेश समय क्या हैं?',
    te: 'హాస్టల్ ప్రవేశ సమయాలు ఏమిటి?',
    category: 'Hostel Rules & Timings',
  },
  {
    en: 'What is the procedure for applying for leave?',
    hi: 'अवकाश या नाइट पास आवेदन की प्रक्रिया क्या है?',
    te: 'సెలవు లేదా నైట్ పాస్ దరఖాస్తు విధానం ఏమిటి?',
    category: 'Leave Policies',
  },
  {
    en: 'What is the scholarship eligibility criteria?',
    hi: 'छात्रवृत्ति की पात्रता शर्तें क्या हैं?',
    te: 'స్కాలర్‌షిప్ అర్హత ప్రమాణాలు ఏమిటి?',
    category: 'Scholarship Policies',
  },
  {
    en: 'When is the last date for fee payment?',
    hi: 'परीक्षा शुल्क भुगतान की अंतिम तिथि क्या है?',
    te: 'పరీక్ష ఫీజు చెల్లించడానికి చివరి తేదీ ఎప్పుడు?',
    category: 'Deadlines',
  },
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onOpenDocumentViewer, initialQuery }) => {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [inputQuery, setInputQuery] = useState(initialQuery || '');

  useEffect(() => {
    if (initialQuery) {
      setInputQuery(initialQuery);
    }
  }, [initialQuery]);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Initial welcome message
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text:
          language === 'te'
            ? 'నమస్కారం! నేను నెక్సస్-డాక్ (NexusDoc) AI. మీ విద్యాసంస్థ అధికారిక ఆమోదిత పత్రాల నుండి విశ్వసనీయ సమాధానాలను అందించడానికి సిద్ధంగా ఉన్నాను. హాజరు నిబంధనలు, పరీక్ష ఫీజులు, హాస్టల్ వేళలు లేదా స్కాలర్‌షిప్‌ల గురించి ఏదైనా అడగండి.'
            : language === 'hi'
            ? 'नमस्ते! मैं नेक्सस-डॉक (NexusDoc) एआई हूँ। आपके संस्थान के अनुमोदित आधिकारिक दस्तावेज़ों से सीधे सत्यापित उत्तर प्रदान करने के लिए तैयार हूँ। उपस्थिति, परीक्षा शुल्क, हॉस्टल नियम अथवा छात्रवृत्ति के संबंध में कोई भी प्रश्न पूछें।'
            : 'Welcome to NexusDoc AI! I am your institution\'s verified document assistant. Ask anything regarding academic regulations, examination fees, hostel timings, attendance policies, or scholarships—all answers are strictly backed by approved official institutional documents.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        detectedLanguage: language,
      },
    ];
  });

  const [loading, setLoading] = useState(false);
  const [queryLanguage, setQueryLanguage] = useState<LanguageCode | 'auto'>('auto');
  const [isRecording, setIsRecording] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Voice speech-to-text integration using Web Speech API
  const handleVoiceToggle = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please type your question.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      // Select speech recognition language
      if (queryLanguage === 'te' || language === 'te') {
        recognition.lang = 'te-IN';
      } else if (queryLanguage === 'hi' || language === 'hi') {
        recognition.lang = 'hi-IN';
      } else {
        recognition.lang = 'en-IN';
      }

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  const handleSendQuery = async (customQuery?: string) => {
    const queryToSend = (customQuery || inputQuery).trim();
    if (!queryToSend || loading) return;

    setInputQuery('');

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: queryToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch('/api/rag/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: queryToSend,
          userRole: user.role,
          preferredLanguage: queryLanguage,
        }),
      });

      const data: RAGQueryResponse = await res.json();

      const assistantMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        detectedLanguage: data.detectedLanguage,
        isRefusal: data.isRefusal,
        refusalReason: data.refusalReason,
        citations: data.citations,
        conflicts: data.conflicts,
        processingTimeMs: data.processingTimeMs,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'An error occurred while connecting to the institutional repository. Please verify your connection.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRefusal: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-6xl mx-auto px-3 sm:px-6 py-4">
      {/* Main Header */}
      <div className="text-center mb-4 shrink-0">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold mb-2 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Multilingual Strict RAG • English • हिन्दी • తెలుగు</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.askAnything}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl mx-auto">
          {t.askSubtitle}
        </p>
      </div>

      {/* Suggested Question Chips (Scrollable) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 shrink-0 no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Suggested:
        </span>
        {INITIAL_SUGGESTIONS.map((item, idx) => {
          const chipLabel =
            language === 'te' ? item.te : language === 'hi' ? item.hi : item.en;
          return (
            <button
              key={idx}
              onClick={() => handleSendQuery(chipLabel)}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 text-xs font-medium whitespace-nowrap shadow-2xs transition-colors shrink-0 flex items-center gap-1"
            >
              <span>{chipLabel}</span>
              <ChevronRight className="w-3 h-3 opacity-50" />
            </button>
          );
        })}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto rounded-2xl bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 mb-3 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 sm:gap-4 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {/* Assistant Avatar */}
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            {/* Message Bubble & Cards */}
            <div
              className={`max-w-[90%] sm:max-w-[85%] ${
                msg.sender === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              {/* User or Assistant Message Box */}
              <div
                className={`inline-block p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-xs shadow-md shadow-blue-500/10'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200/80 dark:border-slate-800 shadow-sm'
                }`}
              >
                {/* Assistant Answer Text */}
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Processing Meta */}
                <div
                  className={`mt-2 flex items-center gap-2 text-[10px] ${
                    msg.sender === 'user'
                      ? 'text-blue-200 justify-end'
                      : 'text-slate-400 justify-between'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.processingTimeMs && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{msg.processingTimeMs}ms</span>
                    </span>
                  )}
                  {msg.detectedLanguage && (
                    <span className="uppercase font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1 py-0.2 rounded font-bold">
                      {msg.detectedLanguage}
                    </span>
                  )}
                </div>
              </div>

              {/* Policy Conflict Warning (if newer vs older policy conflict detected) */}
              {msg.conflicts && msg.conflicts.length > 0 && (
                <div className="mt-3">
                  {msg.conflicts.map((conf, cIdx) => (
                    <ConflictWarningCard key={cIdx} conflict={conf} />
                  ))}
                </div>
              )}

              {/* Refusal / Missing Info Box */}
              {msg.isRefusal && (
                <div className="mt-3">
                  <RefusalCard
                    question={messages.find((m, idx) => messages[idx + 1]?.id === msg.id)?.text || ''}
                    refusalText={msg.text}
                    reason={msg.refusalReason}
                  />
                </div>
              )}

              {/* Verified Sources & Citations Section */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <FileSearch className="w-3.5 h-3.5 text-blue-600" />
                      <span>{t.sources} ({msg.citations.length})</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Strict Page-Level Verification
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {msg.citations.map((cit, citIdx) => (
                      <CitationCard
                        key={citIdx}
                        citation={cit}
                        index={citIdx}
                        onViewDocument={(docId, page) =>
                          onOpenDocumentViewer(docId, page, cit.sourcePassage)
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            {msg.sender === 'user' && (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-xl object-cover shrink-0 mt-0.5 border border-slate-200 dark:border-slate-700 shadow-xs"
              />
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-3 items-start animate-in fade-in duration-200">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-xs p-4 shadow-sm text-xs text-slate-600 dark:text-slate-400 flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="font-medium">
                Searching approved institutional repository & verifying citations...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar & Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-700 p-2 shadow-lg shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="flex items-center gap-2"
        >
          {/* Query Language Selector */}
          <div className="relative shrink-0">
            <select
              value={queryLanguage}
              onChange={(e) => setQueryLanguage(e.target.value as any)}
              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              title="Target Query Language"
            >
              <option value="auto">Auto-Detect</option>
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </div>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={t.inputPlaceholder}
            disabled={loading}
            className="flex-1 bg-transparent px-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />

          {/* Voice Input Mic Button */}
          <button
            type="button"
            onClick={handleVoiceToggle}
            className={`p-2 rounded-xl transition-all ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isRecording ? 'Listening (Click to stop)' : 'Voice Input (English, Hindi, Telugu)'}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Clear Conversation */}
          {messages.length > 1 && (
            <button
              type="button"
              onClick={handleClearChat}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors hidden sm:block"
              title={t.clearChat}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <span>{t.send}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
