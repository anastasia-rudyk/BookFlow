import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { useBooks } from './hooks/useBooks';

// Layout
import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';
import AuthScreen from './components/Auth/AuthScreen';
import AddBookModal from './components/Books/AddBookModal';

// Pages
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
    setRoute,
    toast,
    showToast,
    sidebarOpen,
    setSidebarOpen,
  } = useApp();

  // Визначаємо UID: якщо юзер не залогінений, використовуємо 'guest_mode'
  const currentUserUid = user ? user.uid : 'guest_mode';

  // Отримуємо дані та методи з нашого хука (вже з Firestore)
  const {
    books,
    loading: booksLoading,
    stats,
    addBook,
    updateBook,
    deleteBook,
  } = useBooks(currentUserUid);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [forceAuth, setForceAuth] = useState(false);

  // Обробка натискання на "Додати книгу"
  const handleAddButtonClick = () => {
    if (!user) {
      setForceAuth(true);
    } else {
      setShowAddModal(true);
    }
  };

  // Функція для повернення з екрана авторизації
  const handleBackToLibrary = () => {
    setForceAuth(false);
    setRoute('library');
  };

  // 1. Екран завантаження авторизації
  if (authLoading) {
    return (
      <div className="loading-center" style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <i className="fas fa-spinner fa-spin fa-3x" style={{ color: 'var(--primary)' }}></i>
      </div>
    );
  }

if ((forceAuth && !user) || (route === 'auth' && !user)) {
  return (
    <div className="auth-force-wrapper">
      <button
        className="back-button-auth"
        onClick={handleBackToLibrary}
      >
        <i className="fas fa-arrow-left"></i>
        <span>Назад до бібліотеки</span>
      </button>
      <AuthScreen />
    </div>
  );
}
  // 3. Роутинг сторінок
  const renderPage = () => {
    const commonProps = { books, stats, updateBook, deleteBook };
    
    switch (route) {
      case 'library':
        return (
          <LibraryPage 
            {...commonProps} 
            searchQuery={searchQuery} 
            onAddBook={handleAddButtonClick} 
          />
        );
      case 'stats':
        return <StatsPage books={books} stats={stats} />;
      case 'focus':
        return <FocusPage books={books} stats={stats} />;
      case 'assistant':
        return <AssistantPage books={books} stats={stats} />;
      case 'discover':
        return <DiscoverPage books={books} stats={stats} />;
      case 'accessibility':
        return <AccessibilityPage />;
      default:
        return (
          <LibraryPage 
            {...commonProps} 
            searchQuery={searchQuery} 
            onAddBook={handleAddButtonClick} 
          />
        );
    }
  };

  return (
    <>
      {/* Декоративні елементи фону */}
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
                <p style={{ marginTop: '15px', opacity: 0.7 }}>Завантаження вашої бібліотеки...</p>
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
            try {
              await addBook(data);
              showToast('Книгу додано ✓');
              setShowAddModal(false);
            } catch (err) {
              console.error(err);
              showToast('Помилка при додаванні');
            }
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