// ============================================================
// AddBookModal.jsx — Модальне вікно для додавання/редагування книги
// Bug Fix: при відкритті блокуємо прокручування body
// Критерій 5: Firestore CRUD — Create / Update
// ============================================================

import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_FORM = {
  title:       '',
  author:      '',
  pagesTotal:  '',
  pagesRead:   '0',
  rating:      '5',
  genre:       'Художня',
  mood:        'спокійна',
  note:        '',
  monthlyGoal: '300',
};

export default function AddBookModal({ book, onSave, onClose }) {
  const [form,    setForm]    = useState(book ? {
    title:       book.title       || '',
    author:      book.author      || '',
    pagesTotal:  book.pagesTotal  || '',
    pagesRead:   book.pagesRead   || '0',
    rating:      book.rating      || '5',
    genre:       book.genre       || 'Художня',
    mood:        book.mood        || 'спокійна',
    note:        book.note        || '',
    monthlyGoal: book.monthlyGoal || '300',
  } : DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const firstInputRef = useRef(null);

  // ── Блокуємо скрол body при відкритті (Bug Fix) ──────────────
  useEffect(() => {
    document.body.classList.add('modal-open');
    firstInputRef.current?.focus();
    return () => document.body.classList.remove('modal-open');
  }, []);

  // ── Закриття по Esc ──────────────────────────────────────────
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  function change(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!form.title.trim() || !form.author.trim() || !form.pagesTotal) return;
    
    setLoading(true);
    
    const dataToSave = {
      ...form,
      pagesTotal:  Number(form.pagesTotal),
      pagesRead:   Number(form.pagesRead) || 0,
      rating:      Number(form.rating) || 5,
      monthlyGoal: Number(form.monthlyGoal) || 0,
      status:      Number(form.pagesRead) >= Number(form.pagesTotal) ? 'completed' : 'reading',
      updatedAt:   new Date().toISOString()
    };

    try {
      await onSave(dataToSave);
      onClose();
    } catch (err) {
      console.error("Помилка при збереженні книги:", err);
      alert("Не вдалося зберегти книгу. Перевірте з'єднання.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-card">
        <div className="modal-head">
          <h2 id="modal-title">
            {book ? 'Редагувати книгу' : 'Додати книгу'}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Закрити вікно">
            <i className="fas fa-xmark" aria-hidden="true" />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Назва книги *</label>
            <input
              ref={firstInputRef}
              id="title"
              type="text"
              value={form.title}
              onChange={e => change('title', e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Автор *</label>
            <input
              id="author"
              type="text"
              value={form.author}
              onChange={e => change('author', e.target.value)}
              required
              autoComplete="off"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pagesTotal">Всього сторінок *</label>
              <input
                id="pagesTotal"
                type="number"
                min="1"
                value={form.pagesTotal}
                onChange={e => change('pagesTotal', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="pagesRead">Прочитано</label>
              <input
                id="pagesRead"
                type="number"
                min="0"
                value={form.pagesRead}
                onChange={e => change('pagesRead', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rating">Оцінка (1–5)</label>
              <input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={form.rating}
                onChange={e => change('rating', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="monthlyGoal">Ціль сторінок / міс.</label>
              <input
                id="monthlyGoal"
                type="number"
                min="0"
                value={form.monthlyGoal}
                onChange={e => change('monthlyGoal', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="genre">Жанр</label>
              <select id="genre" value={form.genre} onChange={e => change('genre', e.target.value)}>
                {['Художня','Нонфікшн','Фентезі','Детектив','Саморозвиток','Навчальна'].map(g => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="mood">Настрій книги</label>
              <select id="mood" value={form.mood} onChange={e => change('mood', e.target.value)}>
                {['спокійна','драйвова','глибока','надихаюча','темна'].map(m => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="note">Нотатка або цитата</label>
            <textarea
              id="note"
              rows="3"
              placeholder="Улюблена цитата або думка після читання..."
              value={form.note}
              onChange={e => change('note', e.target.value)}
            />
          </div>

          <button className="btn-submit" type="submit" disabled={loading}>
            {loading
              ? <><i className="fas fa-spinner fa-spin" /> Збереження...</>
              : <><i className="fas fa-floppy-disk" /> Зберегти книгу</>}
          </button>
        </form>
      </div>
    </div>
  );
}