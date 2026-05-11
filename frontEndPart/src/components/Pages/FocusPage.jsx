// ============================================================
// FocusPage.jsx — Сторінка фокус-читання з таймером
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

export default function FocusPage({ books, updateBook }) {
  const { showToast }  = useApp();
  const [minutes,     setMinutes]     = useState(25);
  const [seconds,     setSeconds]     = useState(0);
  const [running,     setRunning]     = useState(false);
  const [selectedMin, setSelectedMin] = useState(25);
  const [bookId,      setBookId]      = useState('');
  const [pagesInput,  setPagesInput]  = useState('10');
  const [sessionsTotal, setSessionsTotal] = useState(0);
  const [minutesTotal,  setMinutesTotal]  = useState(0);
  const intervalRef = useRef(null);

  // ── Таймер ──────────────────────────────────────────────────
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s === 0) {
            setMinutes(m => {
              if (m === 0) {
                clearInterval(intervalRef.current);
                setRunning(false);
                setSessionsTotal(t => t + 1);
                setMinutesTotal(t => t + selectedMin);
                showToast('⏰ Сесію завершено! Чудова робота!');
                return selectedMin;
              }
              return m - 1;
            });
            return 59;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function start()  { setRunning(true); }
  function pause()  { setRunning(false); }

  function finish() {
    setRunning(false);
    clearInterval(intervalRef.current);
    setMinutes(selectedMin);
    setSeconds(0);
    setSessionsTotal(t => t + 1);
    setMinutesTotal(t => t + (selectedMin - minutes));
    // Зараховуємо сторінки
    if (bookId) {
      const book  = books.find(b => b.id === bookId);
      const pages = parseInt(pagesInput) || 0;
      if (book && pages > 0) {
        const newRead = Math.min((parseInt(book.pagesRead)||0) + pages, book.pagesTotal);
        updateBook(bookId, { pagesRead: newRead });
        showToast(`+${pages} сторінок зараховано до «${book.title}» ✓`);
      }
    } else {
      showToast('Сесію завершено ✓');
    }
  }

  function selectPreset(min) {
    setSelectedMin(min);
    setMinutes(min);
    setSeconds(0);
    setRunning(false);
  }

  const pad = n => String(n).padStart(2, '0');

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <p className="eyebrow"><span /> Deep reading mode</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>
          Фокус-читання
        </h1>
        <p className="subtitle" style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: 6 }}>
          Запускай читальні сесії, зараховуй сторінки й отримуй досягнення.
        </p>
      </div>

      <div className="focus-layout">
        {/* Таймер */}
        <section className="timer-card" aria-labelledby="timer-title">
          <h2 id="timer-title">Таймер сесії</h2>

          <div
            className="timer-display"
            role="timer"
            aria-live="polite"
            aria-label={`Час: ${pad(minutes)} хвилин ${pad(seconds)} секунд`}
          >
            {pad(minutes)}:{pad(seconds)}
          </div>

          <div className="timer-presets" role="group" aria-label="Тривалість сесії">
            {[15, 25, 45].map(m => (
              <button
                key={m}
                className={`filter-pill ${selectedMin === m ? 'active' : ''}`}
                onClick={() => selectPreset(m)}
                aria-pressed={selectedMin === m}
              >
                {m} хв
              </button>
            ))}
          </div>

          <div className="form-group" style={{ marginTop: 20 }}>
            <label htmlFor="focus-book">Книга для сесії</label>
            <select
              id="focus-book"
              value={bookId}
              onChange={e => setBookId(e.target.value)}
            >
              <option value="">— обери книгу —</option>
              {books.filter(b => b.status !== 'completed').map(b => (
                <option key={b.id} value={b.id}>{b.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="session-pages">Сторінок зарахувати після сесії</label>
            <input
              id="session-pages"
              type="number"
              min="0"
              value={pagesInput}
              onChange={e => setPagesInput(e.target.value)}
            />
          </div>

          <div className="focus-actions">
            <button className="btn-primary" onClick={start} disabled={running} type="button">
              <i className="fas fa-play" aria-hidden="true" /> Старт
            </button>
            <button className="btn-secondary" onClick={pause} disabled={!running} type="button">
              <i className="fas fa-pause" aria-hidden="true" /> Пауза
            </button>
            <button className="btn-secondary" onClick={finish} type="button">
              <i className="fas fa-flag-checkered" aria-hidden="true" /> Завершити
            </button>
          </div>
        </section>

        {/* Бічна панель */}
        <aside className="focus-side">
          <article className="focus-mini-card">
            <i className="fas fa-stopwatch" aria-hidden="true" />
            <h2>{minutesTotal} хв</h2>
            <p>усього у фокусі</p>
          </article>
          <article className="focus-mini-card">
            <i className="fas fa-trophy" aria-hidden="true" />
            <h2>{sessionsTotal}</h2>
            <p>завершених сесій</p>
          </article>
          <article className="focus-tip">
            <h2>Режим без відволікань</h2>
            <p>
              Після натискання «Старт» зосередься лише на книзі. Пауза зупиняє таймер.
              «Завершити» — зараховує сторінки і додає результат до статистики.
            </p>
          </article>
        </aside>
      </div>
    </>
  );
}