import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/books';

export function useBooks(userId) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    if (!userId || userId === "guest_mode") {
      setBooks([]);
      setLoading(false);
      return;
    }
    try {
      // КЛИЧЕМО ТВІЙ БЕКЕНД
      const res = await fetch(`${API_URL}/${userId}`);
      if (!res.ok) throw new Error("Сервер не відповідає");
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
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, userId })
    });
    fetchBooks();
  };

  const deleteBook = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchBooks();
  };

  const updateBook = async (id, data) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    fetchBooks();
  };

  const stats = {
    total: books.length,
    reading: books.filter(b => b.status === 'reading').length,
    completed: books.filter(b => b.status === 'completed').length,
    pages: books.reduce((acc, b) => acc + (Number(b.pagesRead) || 0), 0),
    avgRating: books.length > 0 ? (books.reduce((acc, b) => acc + (Number(b.rating) || 0), 0) / books.length).toFixed(1) : 0
  };

  return { books, loading, stats, addBook, deleteBook, updateBook };
}