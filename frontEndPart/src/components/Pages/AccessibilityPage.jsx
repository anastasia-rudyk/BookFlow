// ============================================================
// AccessibilityPage.jsx — Налаштування доступності
// ============================================================

import React, { useState } from 'react';

export default function AccessibilityPage() {
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText:    false,
    lessMotion:   false,
  });

  function toggle(key) {
    setSettings(s => {
      const next = { ...s, [key]: !s[key] };
      // Застосовуємо до document
      document.documentElement.classList.toggle('high-contrast', next.highContrast);
      document.documentElement.classList.toggle('large-text',    next.largeText);
      document.documentElement.classList.toggle('less-motion',   next.lessMotion);
      return next;
    });
  }

  return (
    <>
      <div className="section-header">
        <p className="eyebrow"><span /> Inclusive design</p>
        <h1>Доступність</h1>
        <p className="subtitle">Налаштуй інтерфейс під зір, слух і спосіб керування.</p>
      </div>

      <div className="accessibility-grid">
        <article className="access-card">
          <i className="fas fa-eye" aria-hidden="true" />
          <h2>Для слабозорих і сліпих</h2>
          <p>Підтримка скрінрідерів, видимий фокус, зрозумілі підписи, live‑повідомлення та керування з клавіатури.</p>
        </article>

        <article className="access-card">
          <i className="fas fa-ear-deaf" aria-hidden="true" />
          <h2>Для глухих користувачів</h2>
          <p>Усі сповіщення дублюються текстом і візуально. Немає важливих аудіосигналів без текстової альтернативи.</p>
        </article>

        <article className="access-card">
          <h2>Швидкі налаштування</h2>
          {[
            { key: 'highContrast', label: 'Високий контраст' },
            { key: 'largeText',    label: 'Збільшений текст' },
            { key: 'lessMotion',   label: 'Менше анімацій' },
          ].map(({ key, label }) => (
            <label key={key} className="check-row">
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={() => toggle(key)}
              />
              {label}
            </label>
          ))}
        </article>
      </div>

      <div className="shortcuts-card">
        <h2>Клавіатурні скорочення</h2>
        <p>
          <kbd>Tab</kbd> — перейти між елементами &nbsp;·&nbsp;
          <kbd>Enter</kbd> / <kbd>Space</kbd> — активувати &nbsp;·&nbsp;
          <kbd>Esc</kbd> — закрити вікно &nbsp;·&nbsp;
          <kbd>/</kbd> — фокус на пошук &nbsp;·&nbsp;
          Всі кнопки мають ARIA-підписи для скрінрідерів.
        </p>
      </div>
    </>
  );
}