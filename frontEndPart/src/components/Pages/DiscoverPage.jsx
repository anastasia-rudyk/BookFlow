// ============================================================
// DiscoverPage.jsx — Розумні фічі для читання
// ============================================================

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function DiscoverPage({ books }) {
  const { showToast } = useApp();
  const [plan,  setPlan]  = useState('');
  const [note,  setNote]  = useState('');
  const [chall, setChall] = useState('');

  const radar = books.length
    ? `Ти читаєш ${books.filter(b=>b.status==='reading').length} книг. Рекомендую зосередитись на «${books.find(b=>b.status==='reading')?.title || books[0].title}» — ти вже на ${Math.round((books[0].pagesRead/books[0].pagesTotal)*100)||0}%.`
    : 'Додай книги, щоб отримати персональні підказки.';

  function smartPick() {
    const candidates = books.filter(b => b.status !== 'completed');
    if (!candidates.length) { showToast('Немає книг для вибору 📚'); return; }
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    showToast(`📖 Сьогодні читай: «${pick.title}»`);
  }

  function genPlan() {
    const active = books.find(b => b.status === 'reading');
    if (!active) { setPlan('Додай книгу, щоб отримати план.'); return; }
    const left = active.pagesTotal - active.pagesRead;
    const daily = Math.ceil(left / 7);
    setPlan(`«${active.title}»: залишилось ${left} сторінок. По ${daily} стор./день — завершиш за тиждень!`);
  }

  function genNote() {
    const b = books.find(b => b.status === 'reading') || books[0];
    if (!b) { setNote('Додай книгу.'); return; }
    setNote(`Нотатка до «${b.title}»:\n1. Що мене найбільше зачепило?\n2. Улюблена цитата.\n3. Як застосую ці ідеї?`);
  }

  function startChallenge() {
    const active = books.find(b => b.status === 'reading');
    if (!active) { showToast('Спочатку вибери книгу для читання'); return; }
    const daily = Math.ceil((active.pagesTotal - active.pagesRead) / 7);
    setChall(`7-денний челендж для «${active.title}»: читай по ${daily} стор. на день!`);
    showToast('Челендж розпочато! 🔥');
  }

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <p className="eyebrow"><span /> Smart reading lab</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>Ідеї для читання</h1>
        <p className="subtitle" style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: 6 }}>
          Розумний план, рулетка, генератор нотаток і 7-денний челендж.
        </p>
      </div>

      <div className="smart-grid">
        <article className="smart-card spotlight">
          <p className="eyebrow"><span /> AI radar</p>
          <h2>Книжковий радар</h2>
          <p>{radar}</p>
          <div className="smart-actions">
            <button className="btn-primary" onClick={smartPick} type="button">
              <i className="fas fa-dice" aria-hidden="true" /> Розумна рулетка
            </button>
          </div>
        </article>

        <article className="smart-card">
          <i className="fas fa-calendar-days smart-icon" aria-hidden="true" />
          <h2>План на 7 днів</h2>
          <p>{plan || 'Натисни кнопку — отримаєш план на тиждень.'}</p>
          <button className="btn-secondary" onClick={genPlan} type="button">Згенерувати план</button>
        </article>

        <article className="smart-card">
          <i className="fas fa-lightbulb smart-icon" aria-hidden="true" />
          <h2>Генератор нотатки</h2>
          <p style={{ whiteSpace: 'pre-line' }}>{note || 'Натисни кнопку — отримаєш структуру нотатки.'}</p>
          <button className="btn-secondary" onClick={genNote} type="button">Згенерувати нотатку</button>
        </article>

        <article className="smart-card">
          <i className="fas fa-fire-flame-curved smart-icon" aria-hidden="true" />
          <h2>7-денний челендж</h2>
          <p>{chall || 'Почни міні-марафон з персональним темпом читання.'}</p>
          <button className="btn-secondary" onClick={startChallenge} type="button">Стартувати челендж 🔥</button>
        </article>
      </div>
    </>
  );
}