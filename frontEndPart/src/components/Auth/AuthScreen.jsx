import React, { useState } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from '../../../../server/firebase';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Мінімальна валідація, щоб Firebase не видавав помилку
    if (password.length < 6) {
      setError('Пароль має містити щонайменше 6 символів');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Вхід існуючого користувача
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Реєстрація нового користувача
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error("Помилка авторизації:", err);
      // Робимо помилки Firebase зрозумілими для користувача
      if (err.code === 'auth/email-already-in-use') {
        setError('Цей Email вже зареєстровано. Спробуйте увійти.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Неправильний Email або пароль.');
      } else {
        setError('Сталася помилка. Перевірте дані.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-icon">
            <i className="fas fa-book-open"></i>
          </div>
          <h2>{isLogin ? 'З поверненням!' : 'Створити акаунт'}</h2>
          <p>{isLogin ? 'Увійдіть, щоб продовжити читання' : 'Приєднуйтесь до BookFlow'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              placeholder="ваша@пошта.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input 
              id="password"
              type="password" 
              placeholder="Мін. 6 символів" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          {error && <div className="auth-error" style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '10px' }}>{error}</div>}

          <button type="submit" className="btn-primary auth-submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? <i className="fas fa-spinner fa-spin"></i> : (isLogin ? 'Увійти' : 'Зареєструватися')}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
          <p>
            {isLogin ? 'Ще немає акаунту? ' : 'Вже маєте акаунт? '}
            <button 
              type="button" 
              className="btn-text" 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {isLogin ? 'Зареєструватися' : 'Увійти'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}