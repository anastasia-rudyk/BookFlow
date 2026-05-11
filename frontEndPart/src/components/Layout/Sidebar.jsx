import React from 'react';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { id: 'library',       icon: 'fa-book',                label: 'Бібліотека' },
  { id: 'stats',         icon: 'fa-chart-line',          label: 'Статистика' },
  { id: 'focus',         icon: 'fa-bolt',                label: 'Фокус-читання' },
  { id: 'assistant',     icon: 'fa-robot',               label: 'ШІ-асистент' },
  { id: 'discover',      icon: 'fa-wand-magic-sparkles', label: 'Ідеї' },
  { id: 'accessibility', icon: 'fa-universal-access',    label: 'Доступність' },
];

export default function Sidebar() {
  const { user, route, setRoute, darkMode, setDarkMode, logout, sidebarOpen, setSidebarOpen } = useApp();

  function navigate(id) {
    setRoute(id);
    setSidebarOpen(false);
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
  }

  return (
    <>
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        id="sidebar"
        aria-label="Головне меню"
      >
        <div>
          <div className="sidebar-logo">
            <div className="logo-icon" aria-hidden="true">
              <i className="fas fa-book-open"></i>
            </div>
            <div>
              <h2>BookFlow</h2>
              <p>Accessible Reading Tracker</p>
            </div>
          </div>

          <nav className="nav-menu" aria-label="Навігація сайтом">
            {NAV_ITEMS.map(function(item) {
              return (
                <a
                  key={item.id}
                  href={'#' + item.id}
                  className={'nav-item' + (route === item.id ? ' active' : '')}
                  onClick={function(e) { 
                    e.preventDefault(); 
                    navigate(item.id); 
                  }}
                  aria-current={route === item.id ? 'page' : undefined}
                >
                  <i className={'fas ' + item.icon} aria-hidden="true" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-tools" aria-label="Налаштування сайту">
          <div className="theme-title">
            <i className="fas fa-palette" aria-hidden="true" />
            <span>Змінити тему</span>
          </div>

          <div className="theme-switch-wrapper" aria-label="Перемикач теми">
            <i className="fas fa-sun" aria-hidden="true" />
            <label className="theme-switch">
              <span className="visually-hidden">Темна тема</span>
              <input
                type="checkbox"
                id="theme-toggle"
                checked={darkMode}
                onChange={function() { setDarkMode(!darkMode); }}
              />
              <span className="slider" aria-hidden="true" />
            </label>
            <i className="fas fa-moon" aria-hidden="true" />
          </div>

          {user && (
            <button
              className="logout-btn"
              id="logout-btn"
              type="button"
              onClick={handleLogout}
            >
              <i className="fas fa-right-from-bracket" aria-hidden="true" /> Вийти
            </button>
          )}
        </div>
      </aside>
    </>
  );
}