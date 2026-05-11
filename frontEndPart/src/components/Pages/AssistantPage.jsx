// ============================================================
// AssistantPage.jsx — ШІ-асистент читання (Критерій 7: інновація)
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const QUICK_PROMPTS = [
  { icon: 'fa-chart-simple', text: 'Прочитати статистику',    prompt: 'прочитай статистику' },
  { icon: 'fa-compass',      text: 'Порадити книгу',          prompt: 'що мені читати далі?' },
  { icon: 'fa-circle-info',  text: 'Пояснити сайт',          prompt: 'поясни як користуватись сайтом' },
  { icon: 'fa-pen-nib',      text: 'Ідея для нотатки',        prompt: 'допоможи з нотаткою' },
];

const BOT_ANSWERS = {
  'прочитай статистику':          (_, stats) => `Твоя статистика: ${stats.total} книг, ${stats.pages} сторінок, завершено ${stats.completed}. Середня оцінка — ${stats.avgRating} ⭐`,
  'що мені читати далі?':         (books)    => books.length ? `Рекомендую продовжити «${books.find(b=>b.status==='reading')?.title || books[0].title}» — найближча до завершення. Удачі!` : 'Додай книги до бібліотеки, і я допоможу з вибором.',
  'поясни як користуватись сайтом': ()       => 'BookFlow: Бібліотека — твої книги. Статистика — прогрес. Фокус — таймер сесій. Ідеї — розумні поради. Просто клікай по розділах у меню!',
  'допоможи з нотаткою':          (books)    => books.length ? `Структура нотатки до «${books[0].title}»: 1) Головна думка. 2) Цитата, що зачепила. 3) Де застосую у житті.` : 'Додай книгу, і я згенерую структуру нотатки.',
};

export default function AssistantPage({ books, stats }) {
  const { showToast } = useApp();
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Привіт! Я BookFlow AI. Задай запитання про книги або попроси пораду щодо читання 📚' }
  ]);
  const [input, setInput] = useState('');
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages]);

  function getAnswer(q) {
    const key = Object.keys(BOT_ANSWERS).find(k => q.toLowerCase().includes(k.toLowerCase().slice(0, 10)));
    if (key) return BOT_ANSWERS[key](books, stats);
    if (q.includes('книг') || q.includes('читат')) return books.length ? `У твоїй бібліотеці ${books.length} книг. Найближча до завершення — «${books.find(b=>b.status==='reading')?.title || 'немає активних'}».` : 'Поки бібліотека порожня. Додай першу книгу!';
    return 'Цікаве питання! Я поки навчаюсь. Спробуй запитати про книги, статистику або рекомендації 🤖';
  }

  function send(text) {
    const q = (text || input).trim();
    if (!q) return;
    setMessages(m => [...m, { role: 'user', text: q }]);
    setInput('');
    setTimeout(() => {
      setMessages(m => [...m, { role: 'bot', text: getAnswer(q) }]);
    }, 700);
  }

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <p className="eyebrow"><span /> Voice-first AI</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>ШІ-асистент</h1>
        <p className="subtitle" style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: 6 }}>
          Запитуй про книги, отримуй поради і допомогу з читацьким щоденником.
        </p>
      </div>

      <div className="assistant-layout">
        <section className="assistant-panel">
          <div className="assistant-panel-header">
            <h2>Чат з асистентом</h2>
            <p>Напиши запит, наприклад: «що мені читати далі?»</p>
          </div>

          <div className="chat-log" ref={logRef} role="log" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`chat-message ${m.role}`}>
                <strong>{m.role === 'bot' ? 'BookFlow AI' : 'Ти'}</strong>
                <p style={{ margin: 0 }}>{m.text}</p>
              </div>
            ))}
          </div>

          <div className="assistant-form-area">
            <textarea
              rows="2"
              placeholder="Напиши запит до асистента..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              aria-label="Запит до асистента"
            />
            <div className="assistant-actions">
              <button className="btn-primary btn-sm" onClick={() => send()} type="button">
                <i className="fas fa-paper-plane" aria-hidden="true" /> Надіслати
              </button>
            </div>
          </div>
        </section>

        <aside className="voice-tools">
          <h2>Швидкі команди</h2>
          {QUICK_PROMPTS.map(p => (
            <button key={p.text} className="voice-card" onClick={() => send(p.prompt)} type="button">
              <i className={`fas ${p.icon}`} aria-hidden="true" />
              <span>{p.text}</span>
            </button>
          ))}
          <p style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 8, lineHeight: 1.6 }}>
            Натисни швидку команду або напиши власний запит.
          </p>
        </aside>
      </div>
    </>
  );
}