import React from 'react';
import { useApp } from '../../context/AppContext';

export default function TopBar({ searchQuery, onSearch }) {
  const { user, sidebarOpen, setSidebarOpen } = useApp();

  // Логіка визначення імені з твого script.js
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Гість';

  return (
    <header className="top-bar">
      {/* Кнопка бургер-меню (мобільна) */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-controls="sidebar"
        aria-expanded={sidebarOpen}
        aria-label="Відкрити меню"
        type="button"
      >
        <i className={`fas ${sidebarOpen ? 'fa-xmark' : 'fa-bars'}`} aria-hidden="true" />
      </button>

      {/* Пошук */}
      <label className="search-container" htmlFor="search-input">
        <i className="fas fa-search" aria-hidden="true" />
        <span className="visually-hidden">Пошук книги або автора</span>
        <input
          type="search"
          id="search-input"
          placeholder="Знайти книгу чи автора..."
          value={searchQuery}
          onChange={e => onSearch(e.target.value)}
          autoComplete="off"
        />
      </label>

      {/* Інформація про користувача */}
      <div className="user-info" aria-label="Поточний користувач">
        <div className="user-text-details">
          <p className="user-label">Користувач</p>
          <h4>{displayName}</h4>
        </div>
        {/* Аватарка з градієнтом, згенерована на основі імені (як у твоєму коді) */}
        <div
          className="avatar"
          aria-hidden="true"
          style={{
            background: `linear-gradient(135deg, hsl(${(displayName.charCodeAt(0) * 15) % 360},60%,55%), hsl(${(displayName.charCodeAt(0) * 15 + 40) % 360},60%,65%))`
          }}
        />
      </div>
    </header>
  );
}