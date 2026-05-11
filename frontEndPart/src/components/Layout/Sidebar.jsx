import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { id: 'library',       icon: 'fa-book',                 label: 'Бібліотека' },
  { id: 'stats',         icon: 'fa-chart-line',           label: 'Статистика', protected: true },
  { id: 'focus',         icon: 'fa-bolt',                 label: 'Фокус-читання', protected: true },
  { id: 'assistant',     icon: 'fa-robot',                label: 'ШІ-асистент', protected: true },
  { id: 'discover',      icon: 'fa-wand-magic-sparkles',  label: 'Ідеї' },
  { id: 'accessibility', icon: 'fa-universal-access',     label: 'Доступність' },
];

export default function Sidebar() {
  const { 
    user, 
    route, 
    setRoute, 
    darkMode, 
    setDarkMode, 
    logout, 
    sidebarOpen, 
    setSidebarOpen 
  } = useApp();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isGuest = !user;

  const goToAuth = () => {
    setRoute('auth');
    setSidebarOpen(false);
  };

  function navigate(item) {
    if (item.protected && isGuest) {
      goToAuth();
      return;
    }
    setRoute(item.id);
    setSidebarOpen(false);
  }

  const confirmLogout = () => {
    logout();
    setRoute('library');
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-top-content">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <i className="fas fa-book-open"></i>
            </div>
            <div>
              <h2>BookFlow</h2>
              <p>Accessible Reading Tracker</p>
            </div>
          </div>

          <nav className="nav-menu">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={'#' + item.id}
                className={'nav-item' + (route === item.id ? ' active' : '')}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item);
                }}
              >
                <i className={'fas ' + item.icon} />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-section-label">
            <span>Налаштування теми</span>
          </div>

          <div className="theme-switch-wrapper">
            <i className="fas fa-sun" />
            <label className="theme-switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <span className="slider" />
            </label>
            <i className="fas fa-moon" />
          </div>

          {isGuest ? (
            <button
              className="logout-btn login-mode"
              onClick={goToAuth}
              style={{ background: 'var(--primary)', color: '#fff', marginTop: '15px' }}
            >
              <i className="fas fa-right-to-bracket" />
              <span>Увійти</span>
            </button>
          ) : (
            <button
              className="logout-btn"
              onClick={() => setShowLogoutConfirm(true)}
              style={{ marginTop: '15px' }}
            >
              <i className="fas fa-right-from-bracket" />
              <span>Вийти</span>
            </button>
          )}
        </div>
      </aside>

      {showLogoutConfirm && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-card logout-modal">
            <h2>Вихід з акаунта</h2>
            <p>Ви впевнені, що хочете вийти?</p>

            <div className="modal-actions">
              <button onClick={() => setShowLogoutConfirm(false)}>
                Скасувати
              </button>
              <button onClick={confirmLogout}>
                Так, вийти
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}