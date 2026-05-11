import { useState, useEffect } from 'react';
import { db } from '../firebase'; // Імпортуємо твій конфиг
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';

export function useBooks(userId) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Отримання даних в реальному часі
  useEffect(() => {
    // Якщо юзер не залогінився — нічого не вантажимо
    if (!userId || userId === 'guest_mode') {
      setBooks([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Створюємо запит: колекція 'books', де userId збігається
    const q = query(
      collection(db, 'books'),
      where('userId', '==', userId)
    );

    // onSnapshot сам оновлює стейт, коли щось змінюється в базі
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setBooks(data);
      setLoading(false);
    }, (error) => {
      console.error("Помилка Firestore:", error);
      setLoading(false);
    });

    return () => unsubscribe(); // Відписуємось при виході
  }, [userId]);

  // 2. Додавання книги
  const addBook = async (data) => {
    if (!userId || userId === 'guest_mode') {
      throw new Error('Потрібна авторизація');
    }
    
    try {
      await addDoc(collection(db, 'books'), {
        ...data,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Error adding doc:", e);
      throw e;
    }
  };

  // 3. Видалення книги
  const deleteBook = async (id) => {
    try {
      await deleteDoc(doc(db, 'books', id));
    } catch (e) {
      console.error("Error deleting doc:", e);
    }
  };

  // 4. Оновлення книги
  const updateBook = async (id, data) => {
    try {
      const bookRef = doc(db, 'books', id);
      await updateDoc(bookRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Error updating doc:", e);
    }
  };

  // 5. Статистика (залишаємо як була)
  const stats = {
    total: books.length,
    reading: books.filter(b => b.status === 'reading').length,
    completed: books.filter(b => b.status === 'completed').length,
    pages: books.reduce((acc, b) => acc + (Number(b.pagesRead) || 0), 0),
    avgRating: books.length > 0
      ? (books.reduce((acc, b) => acc + (Number(b.rating) || 0), 0) / books.length).toFixed(1)
      : 0,
  };

  return { books, loading, stats, addBook, deleteBook, updateBook };
}