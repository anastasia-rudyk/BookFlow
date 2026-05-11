import React from 'react';
import { useApp } from '../../context/AppContext';

export default function TopBar({ searchQuery, onSearch }) {
  const { user, sidebarOpen, setSidebarOpen } = useApp();

  // Визначаємо ім'я: пріоритет на displayName, потім пошта, потім Гість
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Гість';

  // Генерація кольору для аватарки (щоб не було помилки, якщо displayName раптом пустий)
  const charCode = displayName.charCodeAt(0) || 0;
  const avatarStyle = {
    background: `linear-gradient(135deg, 
      hsl(${(charCode * 15) % 360}, 65%, 55%), 
      hsl(${(charCode * 15 + 40) % 360}, 65%, 65%))`
  };

  return (
    <header className="top-bar">
      {/* Кнопка бургер-меню для мобільних пристроїв */}
      <button
        className={`mobile-menu-btn ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? "Закрити меню" : "Відкрити меню"}
        type="button"
      >
        <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden="true" />
      </button>

      {/* Контейнер пошуку */}
      <div className="search-container">
        <i className="fas fa-search" aria-hidden="true" />
        <input
          type="text" 
          id="search-input"
          placeholder="Знайти книгу чи автора..."
          value={searchQuery || ''} 
          onChange={(e) => onSearch(e.target.value)}
          autoComplete="off"
        />
      </div>

      {/* Профіль користувача */}
      <div className="user-info">
        <div className="user-text-details">
          <span className="user-label">Користувач</span>
          <h4 title={displayName}>{displayName}</h4>
        </div>
        
        {/* Аватарка з літерним індексом або просто градієнтом */}
        <div
          className="avatar"
          aria-hidden="true"
          style={avatarStyle}
        >
          {displayName.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}