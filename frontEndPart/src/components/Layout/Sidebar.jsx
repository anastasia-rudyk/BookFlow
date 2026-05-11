import React from 'react';
import { useApp } from '../../context/AppContext';

// Точні іконки та назви з твого оригінального index.html
const NAV_ITEMS = [
  { id: 'library',       icon: 'fa-book',               label: 'Бібліотека' },
  { id: 'stats',         icon: 'fa-chart-line',         label: 'Статистика' },
  { id: 'focus',         icon: 'fa-bolt',               label: 'Фокус-читання' },
  { id: 'assistant',     icon: 'fa-robot',              label: 'ШІ-асистент' },
  { id: 'discover',      icon: 'fa-wand-magic-sparkles',label: 'Ідеї' },
  { id: 'accessibility', icon: 'fa-universal-access',   label: 'Доступність' },
];

export default function Sidebar() {
  const { route, setRoute, darkMode, setDarkMode, logout, sidebarOpen, setSidebarOpen } = useApp();

  function navigate(id) {
    setRoute(id);
    setSidebarOpen(false); // Ховаємо меню на мобільних після кліку
  }

  return (
    <>
      <div 
        className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`} 
        onClick={() => setSidebarOpen(false)} 
        aria-hidden="true"
      />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar" aria-label="Головне меню">
        <div>
          <div className="sidebar-logo">
            <div className="logo-icon" aria-hidden="true"><i className="fas fa-book-open"></i></div>
            <div>
              <h2>BookFlow</h2>
              <p>Accessible Reading Tracker</p>
            </div>
          </div>

          <nav className="nav-menu" aria-label="Навігація сайтом">
            {NAV_ITEMS.map(item => (
              // Повертаємо тег <a>, як було в оригіналі, щоб CSS працював ідеально
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-item ${route === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.id);
                }}
                aria-current={route === item.id ? 'page' : undefined}
              >
                <i className={`fas ${item.icon}`} aria-hidden="true" />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Точний список нижніх кнопок з твого index.html */}
        <div className="sidebar-tools" aria-label="Швидкі дії">
          <button className="tool-btn" id="random-btn" type="button" onClick={() => navigate('discover')}>
            <i className="fas fa-wand-magic-sparkles" aria-hidden="true" /> Що почитати?
          </button>
          
          <button className="tool-btn" id="read-page-btn" type="button">
            <i className="fas fa-volume-high" aria-hidden="true" /> Озвучити сторінку
          </button>
          
          <button className="tool-btn" id="open-command-btn" type="button">
            <i className="fas fa-command" aria-hidden="true" /> Командний центр
          </button>
          
          <button className="tool-btn" id="focus-shortcut-btn" type="button" onClick={() => navigate('focus')}>
            <i className="fas fa-stopwatch" aria-hidden="true" /> Фокус-сесія
          </button>

          <div className="theme-switch-wrapper" aria-label="Перемикач теми">
            <i className="fas fa-sun" aria-hidden="true" />
            <label className="theme-switch">
              <span className="visually-hidden">Темна тема</span>
              <input 
                type="checkbox" 
                id="theme-toggle"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <span className="slider" aria-hidden="true" />
            </label>
            <i className="fas fa-moon" aria-hidden="true" />
          </div>

          <button className="logout-btn" id="logout-btn" type="button" onClick={logout}>
            <i className="fas fa-right-from-bracket" aria-hidden="true" /> Вийти
          </button>
        </div>
      </aside>
    </>
  );
}