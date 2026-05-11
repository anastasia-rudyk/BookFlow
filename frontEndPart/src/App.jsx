import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { useBooks } from './hooks/useBooks';

import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';
import AuthScreen from './components/Auth/AuthScreen';
import AddBookModal from './components/Books/AddBookModal';

import LibraryPage from './components/Pages/LibraryPage';
import StatsPage from './components/Pages/StatsPage';
import FocusPage from './components/Pages/FocusPage';
import AssistantPage from './components/Pages/AssistantPage';
import DiscoverPage from './components/Pages/DiscoverPage';
import AccessibilityPage from './components/Pages/AccessibilityPage';

function InnerApp() {
  const {
    user,
    authLoading,
    route,
    toast,
    showToast,
    sidebarOpen,
    setSidebarOpen,
  } = useApp();

  const currentUser = user || { uid: 'guest_mode', displayName: 'Гість' };

  const {
    books,
    loading: booksLoading,
    stats,
    addBook,
    updateBook,
    deleteBook,
  } = useBooks(currentUser.uid);

  const [searchQuery,  setSearchQuery]  = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [forceAuth,    setForceAuth]    = useState(false);

  const handleAddButtonClick = () => {
    if (!user) {
      setForceAuth(true);
    } else {
      setShowAddModal(true);
    }
  };

  if (authLoading) {
    return (
      <div className="loading-center" style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <i className="fas fa-spinner fa-spin fa-3x" style={{ color: 'var(--primary)' }}></i>
      </div>
    );
  }

  if (forceAuth && !user) {
    return (
      <div className="auth-force-wrapper">
        <button
          className="btn-ghost"
          onClick={() => setForceAuth(false)}
          style={{ position: 'fixed', top: '24px', left: '24px', zIndex: 3000 }}
        >
          <i className="fas fa-arrow-left"></i> Назад до бібліотеки
        </button>
        <AuthScreen />
      </div>
    );
  }

  const renderPage = () => {
    const commonProps = { books, stats, updateBook, deleteBook };
    switch (route) {
      case 'library':
        return <LibraryPage {...commonProps} searchQuery={searchQuery} onAddBook={handleAddButtonClick} />;
      case 'stats':
        return <StatsPage {...commonProps} />;
      case 'focus':
        return <FocusPage {...commonProps} />;
      case 'assistant':
        return <AssistantPage {...commonProps} />;
      case 'discover':
        return <DiscoverPage {...commonProps} />;
      case 'accessibility':
        return <AccessibilityPage />;
      default:
        return <LibraryPage {...commonProps} searchQuery={searchQuery} onAddBook={handleAddButtonClick} />;
    }
  };

  return (
    <>
      <div className="background-blur blur-1" aria-hidden="true"></div>
      <div className="background-blur blur-2" aria-hidden="true"></div>
      <div className="background-blur blur-3" aria-hidden="true"></div>
      <div className="grain-layer" aria-hidden="true"></div>

      <div className={`app-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Sidebar onAddBook={handleAddButtonClick} />

        <main className="workspace" id="main-content" tabIndex="-1">
          <TopBar
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          <div className="content-area">
            {booksLoading && user ? (
              <div style={{ textAlign: 'center', padding: '100px' }}>
                <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--primary)' }}></i>
              </div>
            ) : (
              renderPage()
            )}
          </div>
        </main>
      </div>

      {showAddModal && (
        <AddBookModal
          onClose={() => setShowAddModal(false)}
          onSave={async (data) => {
            await addBook(data);
            showToast('Книгу додано ✓');
            setShowAddModal(false);
          }}
        />
      )}

      <div id="toast" className={toast ? 'show' : ''}>
        {toast}
      </div>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <InnerApp />
    </AppProvider>
  );
}