/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { ChatInterface } from './components/Chat/ChatInterface.tsx';
import { DocumentManagementPage } from './pages/DocumentManagementPage.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { StudentDashboard } from './pages/StudentDashboard.tsx';
import { FacultyDashboard } from './pages/FacultyDashboard.tsx';
import { AnalyticsPage } from './pages/AnalyticsPage.tsx';
import { UserProfilePage } from './pages/UserProfilePage.tsx';
import { DatasetBenchmarkPage } from './pages/DatasetBenchmarkPage.tsx';
import { DocumentViewerModal } from './components/DocumentViewer/DocumentViewerModal.tsx';
import { DocumentUploadModal } from './components/Admin/DocumentUploadModal.tsx';

function MainApp() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedTestQuery, setSelectedTestQuery] = useState<string>('');
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [viewerDoc, setViewerDoc] = useState<{
    id: string;
    page: number;
    highlight?: string;
  } | null>(null);

  const handleOpenViewer = (docId: string, pageNumber: number = 1, highlight?: string) => {
    setViewerDoc({ id: docId, page: pageNumber, highlight });
  };

  const handleStartAsking = () => {
    setActiveTab('chat');
  };

  const handleSelectTestQuery = (query: string) => {
    setSelectedTestQuery(query);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Universal Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setUploadModalOpen(true)}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <LandingPage
            onStartAsking={handleStartAsking}
            onExploreLibrary={() => setActiveTab('documents')}
            onSelectTestQuery={handleSelectTestQuery}
            onNavigateToBenchmark={() => setActiveTab('dataset-benchmark')}
          />
        )}

        {activeTab === 'chat' && (
          <ChatInterface
            initialQuery={selectedTestQuery}
            onOpenDocumentViewer={handleOpenViewer}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentManagementPage
            onOpenUpload={() => setUploadModalOpen(true)}
            onOpenViewer={handleOpenViewer}
          />
        )}

        {activeTab === 'admin-dashboard' && (
          <AdminDashboard
            onOpenUpload={() => setUploadModalOpen(true)}
            onNavigateToDocuments={() => setActiveTab('documents')}
            onOpenViewer={handleOpenViewer}
          />
        )}

        {activeTab === 'student-portal' && (
          <StudentDashboard
            onNavigateToChat={(prefill) => {
              setActiveTab('chat');
            }}
            onOpenViewer={handleOpenViewer}
          />
        )}

        {activeTab === 'faculty-portal' && (
          <FacultyDashboard
            onNavigateToChat={(prefill) => {
              setActiveTab('chat');
            }}
            onOpenViewer={handleOpenViewer}
          />
        )}

        {activeTab === 'analytics' && <AnalyticsPage />}

        {activeTab === 'dataset-benchmark' && (
          <DatasetBenchmarkPage
            onSelectQueryForChat={(query) => {
              setSelectedTestQuery(query);
              setActiveTab('chat');
            }}
            onOpenDocViewer={(docId) => handleOpenViewer(docId, 1)}
          />
        )}

        {activeTab === 'profile' && <UserProfilePage />}
      </main>

      {/* Global Document Viewer Modal */}
      {viewerDoc && (
        <DocumentViewerModal
          documentId={viewerDoc.id}
          targetPage={viewerDoc.page}
          highlightText={viewerDoc.highlight}
          onClose={() => setViewerDoc(null)}
        />
      )}

      {/* Global Admin Document Upload Modal */}
      {uploadModalOpen && (
        <DocumentUploadModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUploadSuccess={() => {
            setActiveTab('documents');
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
