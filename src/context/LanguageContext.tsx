import React, { createContext, useContext, useState } from 'react';
import { LanguageCode } from '../types/index.ts';

interface Translations {
  appName: string;
  tagline: string;
  askAnything: string;
  askSubtitle: string;
  inputPlaceholder: string;
  send: string;
  clearChat: string;
  sources: string;
  page: string;
  publishedOn: string;
  effectiveFrom: string;
  viewDocument: string;
  confidentialDoc: string;
  policyUpdateDetected: string;
  refusalTitle: string;
  refusalDesc: string;
  submitToRegistrar: string;
  roleStudent: string;
  roleFaculty: string;
  roleAdmin: string;
  switchRole: string;
  navChat: string;
  navDocuments: string;
  navDashboard: string;
  navAnalytics: string;
  navProfile: string;
  uploadDocument: string;
  approved: string;
  pending: string;
  rejected: string;
  searchDocs: string;
  filterCategory: string;
}

const DICTIONARY: Record<LanguageCode, Translations> = {
  en: {
    appName: 'NexusDoc AI',
    tagline: "Your Institution's Knowledge Assistant",
    askAnything: 'Ask anything about your institution.',
    askSubtitle: 'Get trusted answers directly from official institutional documents.',
    inputPlaceholder: 'Ask a question in English, हिन्दी, or తెలుగు...',
    send: 'Ask Assistant',
    clearChat: 'Clear Conversation',
    sources: 'Verified Document Sources',
    page: 'Page',
    publishedOn: 'Published',
    effectiveFrom: 'Effective',
    viewDocument: 'View Original Document',
    confidentialDoc: 'Restricted Confidential Document',
    policyUpdateDetected: 'Policy Update Detected',
    refusalTitle: 'Not found in the document.',
    refusalDesc: 'The approved institutional documents do not contain sufficient information to answer this question.',
    submitToRegistrar: 'Submit Query to Registrar',
    roleStudent: 'Student',
    roleFaculty: 'Faculty & Staff',
    roleAdmin: 'Administrator',
    switchRole: 'Switch Role',
    navChat: 'Knowledge Chat',
    navDocuments: 'Document Library',
    navDashboard: 'Dashboard',
    navAnalytics: 'Audit & Analytics',
    navProfile: 'Profile',
    uploadDocument: 'Upload Official Document',
    approved: 'Approved',
    pending: 'Pending Review',
    rejected: 'Rejected',
    searchDocs: 'Search institutional documents...',
    filterCategory: 'All Categories',
  },
  hi: {
    appName: 'नेक्सस-डॉक एआई',
    tagline: 'आपके संस्थान का आधिकारिक ज्ञान सहायक',
    askAnything: 'अपने संस्थान के बारे में कुछ भी पूछें।',
    askSubtitle: 'आधिकारिक संस्थागत दस्तावेज़ों से सीधे सत्यापित उत्तर प्राप्त करें।',
    inputPlaceholder: 'हिन्दी, English या తెలుగు में अपना प्रश्न पूछें...',
    send: 'प्रश्न पूछें',
    clearChat: 'बातचीत साफ़ करें',
    sources: 'सत्यापित दस्तावेज़ स्रोत',
    page: 'पृष्ठ',
    publishedOn: 'प्रकाशित',
    effectiveFrom: 'प्रभावी तिथि',
    viewDocument: 'मूल दस्तावेज़ देखें',
    confidentialDoc: 'गोपनीय प्रतिबंधित दस्तावेज़',
    policyUpdateDetected: 'नीति संशोधन / अद्यतन का पता चला',
    refusalTitle: 'दस्तावेज़ में जानकारी नहीं मिली।',
    refusalDesc: 'स्वीकृत संस्थागत दस्तावेज़ों में इस प्रश्न का उत्तर देने के लिए पर्याप्त जानकारी नहीं है।',
    submitToRegistrar: 'कुलसचिव को प्रश्न अग्रेषित करें',
    roleStudent: 'छात्र (Student)',
    roleFaculty: 'शिक्षक / कर्मचारी (Faculty)',
    roleAdmin: 'प्रशासक (Admin)',
    switchRole: 'भूमिका बदलें',
    navChat: 'संवाद सहायक',
    navDocuments: 'दस्तावेज़ पुस्तकालय',
    navDashboard: 'डैशबोर्ड',
    navAnalytics: 'विश्लेषण एवं ऑडिट',
    navProfile: 'उपयोगकर्ता प्रोफ़ाइल',
    uploadDocument: 'आधिकारिक दस्तावेज़ अपलोड करें',
    approved: 'स्वीकृत',
    pending: 'समीक्षाधीन',
    rejected: 'अस्वीकृत',
    searchDocs: 'संस्थागत दस्तावेज़ खोजें...',
    filterCategory: 'सभी श्रेणियां',
  },
  te: {
    appName: 'నెక్సస్-డాక్ AI',
    tagline: 'మీ విద్యాసంస్థ అధికారిక నాలెడ్జ్ అసిస్టెంట్',
    askAnything: 'మీ విద్యాసంస్థ గురించి ఏదైనా అడగండి.',
    askSubtitle: 'అధికారిక సంస్థాగత పత్రాల నుండి నేరుగా ధృవీకరించబడిన సమాధానాలను పొందండి.',
    inputPlaceholder: 'తెలుగు, English లేదా हिन्दी లో మీ ప్రశ్నను అడగండి...',
    send: 'ప్రశ్న అడగండి',
    clearChat: 'సంభాషణను తొలగించండి',
    sources: 'ధృవీకరించబడిన పత్ర ఆధారాలు',
    page: 'పేజీ',
    publishedOn: 'ప్రచురణ తేదీ',
    effectiveFrom: 'అమలు తేదీ',
    viewDocument: 'అసలు పత్రాన్ని చూడండి',
    confidentialDoc: 'రహస్య అధికారిక పత్రం',
    policyUpdateDetected: 'పాలసీ అప్‌డేట్ గుర్తించబడింది',
    refusalTitle: 'ఈ సమాచారం పత్రంలో కనుగొనబడలేదు.',
    refusalDesc: 'ఆమోదించబడిన సంస్థాగత పత్రాలలో ఈ ప్రశ్నకు సమాధానం ఇవ్వడానికి తగినంత సమాచారం లేదు.',
    submitToRegistrar: 'రిజిస్ట్రార్‌కు ఈ ప్రశ్నను పంపండి',
    roleStudent: 'విద్యార్థి (Student)',
    roleFaculty: 'బోధనా సిబ్బంది (Faculty)',
    roleAdmin: 'అడ్మినిస్ట్రేటర్ (Admin)',
    switchRole: 'పాత్రను మార్చండి',
    navChat: 'నాలెడ్జ్ చాట్',
    navDocuments: 'డాక్యుమెంట్ లైబ్రరీ',
    navDashboard: 'డ్యాష్‌బోర్డ్',
    navAnalytics: 'ఆడిట్ & విశ్లేషణ',
    navProfile: 'ప్రొఫైల్',
    uploadDocument: 'అధికారిక పత్రాన్ని అప్‌లోడ్ చేయండి',
    approved: 'ఆమోదించబడింది',
    pending: 'పరిశీలనలో ఉంది',
    rejected: 'తిరస్కరించబడింది',
    searchDocs: 'సంస్థాగత పత్రాలను శోధించండి...',
    filterCategory: 'అన్ని విభాగాలు',
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('en');

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: DICTIONARY[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
