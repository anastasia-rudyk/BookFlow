import React from 'react';

export default function StatsPage({ books = [] }) {
  // Розраховуємо статистику прямо з масиву книг, який приходить з Firebase
  const totalBooks = books.length;
  const totalPages = books.reduce((acc, book) => acc + (Number(book.pagesRead) || 0), 0);
  
  const ratedBooks = books.filter(b => b.rating > 0);
  const avgRating = ratedBooks.length > 0 
    ? (ratedBooks.reduce((acc, b) => acc + Number(b.rating), 0) / ratedBooks.length).toFixed(1) 
    : 0;

  // Рахуємо дні активності (можна базувати на даті створення книг)
  const activityDays = totalBooks > 0 ? 1 : 0; 

  return (
    <div className="stats-page">
      <header className="stats-header">
        <p className="eyebrow">Аналітика</p>
        <h1>Статистика</h1>
        <p className="subtitle">Твій прогрес читання та персональна підказка.</p>
      </header>

      <div className="stats-grid">
        {/* Картка: Кількість книг */}
        <article className="stat-card">
          <div className="stat-value">{totalBooks}</div>
          <div className="stat-label">Книг у бібліотеці</div>
        </article>

        {/* Картка: Прочитані сторінки */}
        <article className="stat-card">
          <div className="stat-value">{totalPages}</div>
          <div className="stat-label">Прочитаних сторінок</div>
        </article>

        {/* Картка: Середня оцінка */}
        <article className="stat-card">
          <div className="stat-value">{avgRating}</div>
          <div className="stat-label">Середня оцінка</div>
        </article>

        {/* Картка: Дні активності */}
        <article className="stat-card">
          <div className="stat-value">{activityDays}</div>
          <div className="stat-label">Днів активності</div>
        </article>
      </div>

      {/* Можна додати прогрес по жанрах або статусах нижче */}
    </div>
  );
}