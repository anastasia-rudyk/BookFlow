// ============================================================
// BookCard.jsx — Картка книги з прогресом і діями
// Критерій 5: CRUD — Update (прогрес), Delete, Toggle favorite
// ============================================================

import React, { useState } from 'react';

const STATUS_LABELS = {
  reading:   'Читаю',
  completed: 'Завершено',
  planned:   'В планах',
  favorite:  '❤️ Обрана',
};

export default function BookCard({ book, onUpdate, onDelete, onEdit }) {
  const [editing,   setEditing]   = useState(false);
  const [pagesInput, setPagesInput] = useState(String(book.pagesRead || 0));

  const pagesRead  = parseInt(book.pagesRead)  || 0;
  const pagesTotal = parseInt(book.pagesTotal) || 1;
  const percent    = Math.min(100, Math.round((pagesRead / pagesTotal) * 100));

  const stars = '★'.repeat(parseInt(book.rating) || 0) + '☆'.repeat(5 - (parseInt(book.rating) || 0));

  // ── Оновлення прогресу читання ───────────────────────────────
  async function saveProgress() {
    const val = Math.min(pagesTotal, Math.max(0, parseInt(pagesInput) || 0));
    await onUpdate(book.id, { pagesRead: val });
    setEditing(false);
  }

  // ── Переключення улюбленого ──────────────────────────────────
  async function toggleFavorite() {
    await onUpdate(book.id, { favorite: !book.favorite });
  }

  return (
    <article className="book-card" aria-label={`Книга: ${book.title}`}>
      <div className="book-card-header">
        <div style={{ flex: 1 }}>
          <span className={`book-status-badge status-${book.status}`}>
            {STATUS_LABELS[book.status] || book.status}
          </span>
        </div>
        <button
          className={`btn-icon favorite ${book.favorite ? 'active' : ''}`}
          onClick={toggleFavorite}
          aria-label={book.favorite ? 'Видалити з обраних' : 'Додати в обрані'}
          title={book.favorite ? 'Видалити з обраних' : 'Додати в обрані'}
        >
          <i className={`${book.favorite ? 'fas' : 'far'} fa-heart`} aria-hidden="true" />
        </button>
      </div>

      <h3>{book.title}</h3>
      <p className="author">{book.author}</p>

      {/* Прогрес-бар */}
      <div className="progress-bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="progress-label">{pagesRead} / {pagesTotal} стор. — {percent}%</p>

      {/* Мета-інфо */}
      <div className="book-meta">
        {book.genre && <span className="book-meta-tag">{book.genre}</span>}
        {book.mood  && <span className="book-meta-tag">{book.mood}</span>}
        {book.rating > 0 && (
          <span style={{ color: 'var(--accent)', fontSize: '0.85rem' }} title={`Оцінка: ${book.rating}/5`}>
            {stars}
          </span>
        )}
      </div>

      {/* Оновити прогрес */}
      {editing ? (
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, alignItems: 'center' }}>
          <input
            type="number"
            min="0"
            max={pagesTotal}
            value={pagesInput}
            onChange={e => setPagesInput(e.target.value)}
            style={{
              width: 80,
              padding: '6px 8px',
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
            }}
            aria-label="Кількість прочитаних сторінок"
            autoFocus
          />
          <button className="btn-primary btn-sm" onClick={saveProgress}>
            <i className="fas fa-check" aria-hidden="true" /> OK
          </button>
          <button className="btn-secondary btn-sm" onClick={() => setEditing(false)}>
            Скасувати
          </button>
        </div>
      ) : null}

      {/* Дії картки */}
      <div className="book-card-actions">
        <button
          className="btn-secondary btn-sm"
          onClick={() => { setEditing(true); setPagesInput(String(pagesRead)); }}
          aria-label="Оновити прогрес"
          title="Оновити прогрес"
        >
          <i className="fas fa-pen-to-square" aria-hidden="true" /> Прогрес
        </button>
        <button
          className="btn-secondary btn-sm"
          onClick={() => onEdit(book)}
          aria-label="Редагувати книгу"
          title="Редагувати книгу"
        >
          <i className="fas fa-edit" aria-hidden="true" /> Ред.
        </button>
        <button
          className="btn-icon"
          onClick={() => onDelete(book.id)}
          aria-label={`Видалити книгу ${book.title}`}
          title="Видалити книгу"
        >
          <i className="fas fa-trash" aria-hidden="true" />
        </button>
      </div>

      {/* Нотатка */}
      {book.note && (
        <blockquote style={{
          marginTop: 12,
          padding: '8px 12px',
          borderLeft: '3px solid var(--accent)',
          background: 'var(--accent-light)',
          borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
          fontSize: '0.78rem',
          color: 'var(--text2)',
          fontStyle: 'italic',
          lineHeight: 1.5,
        }}>
          {book.note}
        </blockquote>
      )}
    </article>
  );
}