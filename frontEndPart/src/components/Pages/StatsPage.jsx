import React from 'react';

export default function StatsPage({ books = [] }) {
  const totalBooks = books.length;
  const totalPages = books.reduce((acc, book) => acc + (Number(book.pagesRead) || 0), 0);
  
  const ratedBooks = books.filter(b => b.rating > 0);
  const avgRating = ratedBooks.length > 0 
    ? (ratedBooks.reduce((acc, b) => acc + Number(b.rating), 0) / ratedBooks.length).toFixed(1) 
    : '—';

  const activityDays = totalBooks > 0 ? 1 : 0;

  const stats = [
    { icon: 'fa-book-open',      value: totalBooks,   label: 'Книг у бібліотеці'    },
    { icon: 'fa-file-alt',       value: totalPages,   label: 'Прочитаних сторінок'  },
    { icon: 'fa-star',           value: avgRating,    label: 'Середня оцінка'        },
    { icon: 'fa-calendar-check', value: activityDays, label: 'Днів активності'       },
  ];

  return (
    <div className="stats-page">
      <header className="stats-header">
        <p className="eyebrow"><span></span>Аналітика</p>
        <h1>Статистика</h1>
        <p className="subtitle">Твій прогрес читання та персональна підказка.</p>
      </header>

      <div className="stats-grid">
        {stats.map(({ icon, value, label }) => (
          <article className="stat-card" key={label}>
            <div className="stat-card-icon">
              <i className={`fas ${icon}`}></i>
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
          </article>
        ))}
      </div>
    </div>
  );
}