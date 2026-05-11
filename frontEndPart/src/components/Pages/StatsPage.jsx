import React from 'react';

export default function StatsPage({ stats, books }) {
  // Розумна підказка, яка змінюється залежно від кількості книг
  const readingInsight = books.length > 0 
    ? "Ти чудово справляєшся! Твій прогрес стабільний. Спробуй почитати ще 15 хвилин сьогодні, щоб не втратити темп." 
    : "Додай свою першу книгу в Бібліотеці, щоб ШІ міг згенерувати для тебе персональну пораду.";

  return (
    <div className="stats-page animate-fade-in">
      <div className="section-header">
        <div>
          <p className="eyebrow"><span></span> Аналітика</p>
          <h1>Статистика</h1>
          <p className="subtitle">Твій прогрес, досягнення та персональна підказка.</p>
        </div>
      </div>

      <div className="stats-container">
        <article className="stat-box">
          <i className="fas fa-book"></i>
          <div>
            <h2>{stats?.total || 0}</h2>
            <p>Книг у бібліотеці</p>
          </div>
        </article>
        
        <article className="stat-box">
          <i className="fas fa-file-lines"></i>
          <div>
            <h2>{stats?.pages || 0}</h2>
            <p>Прочитаних сторінок</p>
          </div>
        </article>

        <article className="stat-box">
          <i className="fas fa-star"></i>
          <div>
            <h2>{stats?.avgRating || 0}</h2>
            <p>Середня оцінка</p>
          </div>
        </article>

        <article className="stat-box">
          <i className="fas fa-fire"></i>
          <div>
            <h2>{books.length > 0 ? 1 : 0}</h2>
            <p>Днів активності</p>
          </div>
        </article>
      </div>

      <div className="insight-panel">
        <h2>Розумна підказка</h2>
        <p>{readingInsight}</p>
      </div>

      <section className="achievements-panel">
        <div className="section-header compact">
          <div>
            <p className="eyebrow"><span></span> Gamification</p>
            <h2>Досягнення</h2>
          </div>
        </div>
        
        {/* Сітка досягнень (автоматично розблоковуються на основі статистики) */}
        <div className="badge-grid">
          <div className={`badge-card ${books.length >= 1 ? 'unlocked' : 'locked'}`}>
            <i className="fas fa-seedling"></i>
            <h3>Перший крок</h3>
            <p>Додано першу книгу</p>
          </div>
          
          <div className={`badge-card ${stats?.completed >= 1 ? 'unlocked' : 'locked'}`}>
            <i className="fas fa-check-double"></i>
            <h3>Фінішер</h3>
            <p>Прочитано книгу до кінця</p>
          </div>
          
          <div className={`badge-card ${stats?.pages >= 500 ? 'unlocked' : 'locked'}`}>
            <i className="fas fa-glasses"></i>
            <h3>Книжковий черв'як</h3>
            <p>Прочитано 500 сторінок</p>
          </div>

          <div className={`badge-card ${stats?.avgRating >= 4 ? 'unlocked' : 'locked'}`}>
            <i className="fas fa-heart"></i>
            <h3>Поціновувач</h3>
            <p>Висока середня оцінка</p>
          </div>
        </div>
      </section>
    </div>
  );
}