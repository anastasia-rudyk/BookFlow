import { useState } from 'react';
import { searchGoogleBooks } from '../../services/googleBooks';

export default function SearchPage({ addBook, user }) {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);

  const handleSearch = async () => {
    const result = await searchGoogleBooks(query);
    setBooks(result);
  };

  const handleAdd = async (book) => {
    await addBook({
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors?.[0] || 'Unknown',
      description: book.volumeInfo.description || '',
      cover: book.volumeInfo.imageLinks?.thumbnail || '',
      googleBookId: book.id,
      isCustom: false,
      ownerId: user.uid
    });

    alert('Book added');
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Search Books</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search books"
      />

      <button onClick={handleSearch}>
        Search
      </button>

      <div>
        {books.map(book => (
          <div
            key={book.id}
            style={{
                 border: '1px solid gray',
              marginTop: 20,
              padding: 20
            }}
          >
            <h3>{book.volumeInfo.title}</h3>

            <p>
              {book.volumeInfo.authors?.join(', ')}
            </p>

            <button onClick={() => handleAdd(book)}>
              Add Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}