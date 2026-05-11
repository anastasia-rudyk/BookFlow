import { useState, useEffect } from 'react';
import { db } from '../firebase'; // Переконайся, що шлях правильний
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';

export function useBooks(userId) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || userId === 'guest_mode') {
      setBooks([]);
      setLoading(false);
      return;
    }

    // Слухаємо базу даних в реальному часі
    const q = query(collection(db, 'books'), where('userId', '==', userId));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBooks(booksData);
      setLoading(false);
    }, (error) => {
      console.error("Firebase error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const addBook = async (data) => {
    if (!userId || userId === 'guest_mode') return;
    // Додаємо документ прямо в Firebase
    await addDoc(collection(db, 'books'), {
      ...data,
      userId,
      createdAt: serverTimestamp()
    });
  };

  const deleteBook = async (id) => {
    await deleteDoc(doc(db, 'books', id));
  };

  const updateBook = async (id, data) => {
    const bookRef = doc(db, 'books', id);
    await updateDoc(bookRef, data);
  };

  const stats = {
    reading: books.filter(b => b.status === 'reading').length,
    completed: books.filter(b => b.status === 'completed').length,
    planned: books.filter(b => b.status === 'planned').length
  };

  return { books, loading, stats, addBook, deleteBook, updateBook };
}