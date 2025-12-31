import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/authors';

export default function AuthorsManager() {
  const [authors, setAuthors] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: '', country: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setAuthors(response.data);
      setError(null);
    } catch (err) {
      setError('Ошибка загрузки авторов');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.country.trim()) {
      setError('Заполните все поля');
      return;
    }

    try {
      if (editingId) {
        // Update
        await axios.put(`${API_URL}/${editingId}`, {
          id: editingId,
          name: formData.name,
          country: formData.country
        });
        setAuthors(authors.map(a => a.id === editingId ? { id: editingId, name: formData.name, country: formData.country } : a));
      } else {
        // Create
        const response = await axios.post(API_URL, {
          name: formData.name,
          country: formData.country
        });
        setAuthors([...authors, response.data]);
      }
      resetForm();
      setError(null);
    } catch (err) {
      setError(editingId ? 'Ошибка обновления автора' : 'Ошибка добавления автора');
      console.error('Submit error:', err);
    }
  };

  const handleEdit = (author) => {
    setFormData({ id: author.id, name: author.name, country: author.country });
    setEditingId(author.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setAuthors(authors.filter(author => author.id !== id));
      setError(null);
    } catch (err) {
      setError('Ошибка удаления автора');
      console.error('Delete error:', err);
    }
  };

  const resetForm = () => {
    setFormData({ id: null, name: '', country: '' });
    setEditingId(null);
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div style={styles.container}>
      <h1>Управление Авторами</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Имя:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Введите имя автора"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Страна:</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            placeholder="Введите страну"
            style={styles.input}
          />
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.button}>
            {editingId ? 'Обновить' : 'Добавить'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} style={styles.cancelButton}>
              Отмена
            </button>
          )}
        </div>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      <hr style={styles.separator} />

      <h2>Список авторов ({authors.length})</h2>
      {authors.length === 0 ? (
        <p>Нет авторов</p>
      ) : (
        <ul style={styles.list}>
          {authors.map(author => (
            <li key={author.id} style={styles.listItem}>
              <div>
                <strong>{author.name}</strong> - {author.country}
              </div>
              <div style={styles.actions}>
                <button
                  onClick={() => handleEdit(author)}
                  style={styles.editButton}
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(author.id)}
                  style={styles.deleteButton}
                >
                  ✕
                </button>
              </div>
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
  buttonGroup: {
    display: 'flex',
    gap: '10px',
  },
  button: {
    flex: 1,
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#757575',
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
  actions: {
    display: 'flex',
    gap: '5px',
  },
  editButton: {
    padding: '5px 10px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
};
