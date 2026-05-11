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

  return (
    <>
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
        <div>
          <div className="sidebar-logo">
            <div className="logo-icon"><i className="fas fa-book-open"></i></div>
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
                onClick={(e) => { e.preventDefault(); navigate(item.id); }}
              >
                <i className={'fas ' + item.icon} aria-hidden="true" />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="sidebar-tools">
  {/* ПЕРЕМИКАЧ ТЕМИ (Theme Toggle) */}
  <button 
    className="tool-btn theme-toggle" 
    onClick={() => setDarkMode(!darkMode)}
    title={darkMode ? "Увімкнути світлу тему" : "Увімкнути темну тему"}
  >
    <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
    <span>{darkMode ? 'Світла тема' : 'Темна тема'}</span>
  </button>

  {/* КНОПКА ВИХОДУ */}
  <button className="logout-btn" onClick={logout}>
    <i className="fas fa-right-from-bracket" /> 
    <span>Вийти</span>
  </button>
</div>
      </aside>
    </>
  );
}