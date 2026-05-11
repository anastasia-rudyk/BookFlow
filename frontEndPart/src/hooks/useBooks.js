import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '/api/books';

export function useBooks(userId) {
  const [books, setBooks]     = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    if (!userId || userId === 'guest_mode') {
      setBooks([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/${userId}`);
      if (!res.ok) throw new Error('Сервер не відповідає');
      const data = await res.json();
      setBooks(data);
    } catch (e) {
      console.error("Помилка зв'язку з бекендом:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, [userId]);

  const addBook = async (data) => {
    if (!userId || userId === 'guest_mode') {
      throw new Error('Потрібна авторизація для додавання книг');
    }
    const res = await fetch(API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ...data, userId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Помилка сервера при додаванні книги');
    }
    await fetchBooks();
  };

  const deleteBook = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Помилка при видаленні книги');
    await fetchBooks();
  };

  const updateBook = async (id, data) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Помилка при оновленні книги');
    await fetchBooks();
  };

  const stats = {
    total:     books.length,
    reading:   books.filter(b => b.status === 'reading').length,
    completed: books.filter(b => b.status === 'completed').length,
    pages:     books.reduce((acc, b) => acc + (Number(b.pagesRead) || 0), 0),
    avgRating: books.length > 0
      ? (books.reduce((acc, b) => acc + (Number(b.rating) || 0), 0) / books.length).toFixed(1)
      : 0,
  };

  return { books, loading, stats, addBook, deleteBook, updateBook };
}