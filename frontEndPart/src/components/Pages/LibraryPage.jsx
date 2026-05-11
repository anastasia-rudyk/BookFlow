import React, { useState } from 'react';

export default function LibraryPage({ 
  books = [], 
  stats, 
  updateBook, 
  deleteBook, 
  searchQuery, 
  onAddBook 
}) {
  // Стан для вкладок (з твого script.js: state.filter)
  const [activeTab, setActiveTab] = useState('all');

  // Фільтрація книг за вкладкою та пошуком (як у твоєму коді)
  const filteredBooks = books.filter(book => {
    const q = (searchQuery || '').toLowerCase();
    const matchesSearch = 
      book.title.toLowerCase().includes(q) || 
      book.author.toLowerCase().includes(q);
    
    const matchesTab = activeTab === 'all' || book.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  // Логіка перекладу статусу (як у твоїй функції translateStatus)
  const translateStatus = (status) => {
    switch(status) {
      case 'reading': return 'Читаю';
      case 'completed': return 'Завершено';
      case 'planned': return 'В планах';
      default: return status;
    }
  };

  // Функція оновлення прогресу через prompt (як у твоєму script.js: window.editPages)
  const handleEditPages = (book) => {
    const value = prompt('Скільки сторінок прочитано?', book.pagesRead);
    if (value === null) return;

    const parsed = parseInt(value);
    if (isNaN(parsed)) {
      alert('Введіть число');
      return;
    }

    if (parsed > book.pagesTotal) {
      alert('Забагато сторінок');
      return;
    }

    // Розрахунок нового статусу (як у твоїй функції calculateStatus)
    let newStatus = 'reading';
    if (parsed <= 0) newStatus = 'planned';
    if (parsed >= book.pagesTotal) newStatus = 'completed';

    updateBook(book.id, { pagesRead: parsed, status: newStatus });
  };

  // Видалення з підтвердженням (як у твоєму script.js: window.deleteBook)
  const handleDelete = (id) => {
    if (window.confirm('Видалити книгу?')) {
      deleteBook(id);
    }
  };

  return (
    <div className="library-page">
      {/* Hero-блок з твого index.html */}
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow"><span></span> Твій простір для читання</p>
          <h1>Моя бібліотека</h1>
          <p className="subtitle">Організуй книги, відстежуй прогрес і читай комфортно.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={onAddBook}>
              <i className="fas fa-plus"></i> Нова книга
            </button>
            <button className="btn-ghost" onClick={() => document.getElementById('book-grid').scrollIntoView({behavior: 'smooth'})}>
              <i className="fas fa-list"></i> Список книг
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-book book-a"><span></span><span></span><span></span></div>
          <div className="floating-book book-b"><span></span><span></span><span></span></div>
          <div className="orbital-ring"></div>
          <div className="hero-badge">
            <i className="fas fa-wand-magic-sparkles"></i>
            <strong>AI-порада</strong>
            <small>розумний темп читання</small>
          </div>
        </div>
      </section>

      {/* Міні-статистика з твого index.html */}
      <div className="quick-stats">
        <article className="mini-stat">
          <i className="fas fa-book-open-reader"></i>
          <span>{stats?.reading || 0}</span>
          <small>читаю зараз</small>
        </article>
        <article className="mini-stat">
          <i className="fas fa-circle-check"></i>
          <span>{stats?.completed || 0}</span>
          <small>завершено</small>
        </article>
        <article className="mini-stat">
          <i className="fas fa-bullseye"></i>
          <span>{books.length > 0 ? Math.round((stats.completed / books.length) * 100) : 0}%</span>
          <small>загальний прогрес</small>
        </article>
      </div>

      {/* Панель фільтрів (Toolbar) */}
      <div className="toolbar-row">
        <div className="filter-bar">
          {['all', 'reading', 'completed', 'planned'].map(filter => (
            <button 
              key={filter}
              className={`filter-pill ${activeTab === filter ? 'active' : ''}`}
              onClick={() => setActiveTab(filter)}
            >
              {filter === 'all' ? 'Всі' : translateStatus(filter)}
            </button>
          ))}
        </div>
      </div>

      {/* Сітка книг (Book Grid) */}
      <div className="book-grid" id="book-grid">
        {filteredBooks.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-book-open"></i>
            <h2>Тут поки пусто</h2>
            <p>Додай першу книгу ✨</p>
          </div>
        ) : (
          filteredBooks.map(book => {
            const percent = Math.round((book.pagesRead / book.pagesTotal) * 100) || 0;
            
            return (
              <article key={book.id} className="book-card animate-fade-in">
                <div className="book-card-cover">
                  <div className="cover-monogram">{book.title.charAt(0)}</div>
                  <div className="card-actions">
                    <span className={`card-status ${book.status}`}>
                      {translateStatus(book.status)}
                    </span>
                    <button className="icon-btn delete-btn" onClick={() => handleDelete(book.id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                <div className="book-card-body">
                  <h3>{book.title}</h3>
                  <p className="author">{book.author}</p>

                  <div className="progress-info">
                    <span>Прогрес</span>
                    <span>{percent}%</span>
                  </div>

                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${percent}%` }}></div>
                  </div>

                  <p className="pages-text">
                    {book.pagesRead} / {book.pagesTotal} стор.
                  </p>

                  <div className="card-bottom">
                    <div className="rating">⭐ {book.rating}/5</div>
                    <button 
                      className="btn-primary" 
                      style={{ width: 'auto', padding: '10px 16px' }}
                      onClick={() => handleEditPages(book)}
                    >
                      Оновити
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}