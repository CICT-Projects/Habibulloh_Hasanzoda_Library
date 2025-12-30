import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/books';

export default function BooksManager() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({ title: '', year: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка книг при старте
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setBooks(response.data);
      setError(null);
    } catch (err) {
      setError('Ошибка загрузки книг');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) || '' : value
    }));
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.year) {
      setError('Заполните все поля');
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        title: formData.title,
        year: formData.year
      });
      setBooks([...books, response.data]);
      setFormData({ title: '', year: '' });
      setError(null);
    } catch (err) {
      setError('Ошибка добавления книги');
      console.error(err);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setBooks(books.filter(book => book.id !== id));
      setError(null);
    } catch (err) {
      setError('Ошибка удаления книги');
      console.error(err);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div style={styles.container}>
      <h1>Управление Книгами</h1>

      <form onSubmit={handleAddBook} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Название:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Введите название"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Год:</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            placeholder="Введите год"
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>Добавить книгу</button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      <hr style={styles.separator} />

      <h2>Список книг</h2>
      {books.length === 0 ? (
        <p>Нет книг</p>
      ) : (
        <ul style={styles.list}>
          {books.map(book => (
            <li key={book.id} style={styles.listItem}>
              <div>
                <strong>{book.title}</strong> ({book.year})
              </div>
              <button
                onClick={() => handleDeleteBook(book.id)}
                style={styles.deleteButton}
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '5px',
  },
  formGroup: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '8px',
    marginTop: '5px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  error: {
    color: '#d32f2f',
    marginBottom: '10px',
  },
  separator: {
    margin: '20px 0',
    border: '1px solid #ddd',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    border: '1px solid #eee',
  },
  deleteButton: {
    padding: '5px 15px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
};
