import React, { useState } from 'react';

export default function LibraryPage({ 
  books = [], 
  stats, 
  updateBook, 
  deleteBook, 
  searchQuery, 
  onAddBook 
}) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredBooks = books.filter(book => {
    const q = (searchQuery || '').toLowerCase();
    const matchesSearch = 
      book.title.toLowerCase().includes(q) || 
      book.author.toLowerCase().includes(q);
    
    // ЛОГІКА ВИЗНАЧЕННЯ АКТУАЛЬНОГО СТАТУСУ
    // Якщо прочитано 0 — це завжди 'planned'
    let currentStatus = book.status;
    if (Number(book.pagesRead) === 0) {
      currentStatus = 'planned';
    }

    const matchesTab = activeTab === 'all' || currentStatus === activeTab;
    return matchesSearch && matchesTab;
  });

  const translateStatus = (status, pagesRead = null) => {
    // Якщо ми передаємо кількість сторінок, перевіряємо на "0" для відображення
    if (pagesRead !== null && Number(pagesRead) === 0) return 'В планах';
    
    switch(status) {
      case 'reading': return 'Читаю';
      case 'completed': return 'Завершено';
      case 'planned': return 'В планах';
      default: return status;
    }
  };

  const handleEditPages = (book) => {
    const value = prompt('Скільки сторінок прочитано?', book.pagesRead);
    if (value === null) return;

    const parsed = parseInt(value);
    if (isNaN(parsed) || parsed < 0) {
      alert('Введіть коректне число');
      return;
    }

    if (parsed > book.pagesTotal) {
      alert('Число прочитаних сторінок не може бути більшим за загальну кількість');
      return;
    }

    let newStatus = 'reading';
    if (parsed === 0) newStatus = 'planned';
    if (parsed >= book.pagesTotal && book.pagesTotal > 0) newStatus = 'completed';

    updateBook(book.id, { pagesRead: parsed, status: newStatus });
  };

  const handleDelete = (id) => {
    if (window.confirm('Видалити книгу з вашої бібліотеки?')) {
      deleteBook(id);
    }
  };

  return (
    <div className="library-page">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow"><span></span> Твій простір для читання</p>
          <h1>Моя бібліотека</h1>
          <p className="subtitle">Організуй книги, відстежуй прогрес і читай комфортно.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={onAddBook}>
              <i className="fas fa-plus"></i> Нова книга
            </button>
          </div>
        </div>
      </section>

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
          <span>{books.length > 0 ? Math.round(((stats?.completed || 0) / books.length) * 100) : 0}%</span>
          <small>загальний прогрес</small>
        </article>
      </div>

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

      <div className="book-grid" id="book-grid">
        {filteredBooks.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-book-open"></i>
            <h2>Тут поки пусто</h2>
            <p>Додайте вашу першу книгу, щоб почати відстеження.</p>
          </div>
        ) : (
          filteredBooks.map(book => {
            const percent = Math.round((book.pagesRead / book.pagesTotal) * 100) || 0;
            // Визначаємо клас для бейджика статусу
            const displayStatusClass = Number(book.pagesRead) === 0 ? 'planned' : book.status;

            return (
              <article key={book.id} className="book-card animate-fade-in">
                <div className="book-card-cover">
                  <div className="cover-monogram">{book.title.charAt(0)}</div>
                  <div className="card-actions">
                    <span className={`card-status ${displayStatusClass}`}>
                      {translateStatus(book.status, book.pagesRead)}
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
                  <p className="pages-text">{book.pagesRead} / {book.pagesTotal} стор.</p>
                  <div className="card-bottom">
                    <div className="rating">⭐ {book.rating}/5</div>
                    <button className="btn-primary" onClick={() => handleEditPages(book)}>Оновити</button>
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