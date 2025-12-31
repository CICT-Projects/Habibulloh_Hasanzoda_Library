import { useEffect, useState } from 'react'

export default function Books() {
  const [books, setBooks] = useState([])
  const [title, setTitle] = useState('')
  const [year, setYear] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editYear, setEditYear] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetch('/api/books')
      .then(r => r.json())
      .then(setBooks)
  }, [])

  async function add() {
    if (!title.trim()) {
      alert('Введите название книги')
      return
    }
    const payload = { title, year: parseInt(year || '0') }
    const res = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const created = await res.json()
    setBooks(prev => [...prev, created])
    setTitle('')
    setYear('')
  }

  function startEdit(book) {
    setEditingId(book.id)
    setEditTitle(book.title)
    setEditYear(String(book.year || ''))
  }

  async function saveEdit() {
    if (!editingId) return
    const payload = { id: editingId, title: editTitle, year: parseInt(editYear || '0') }
    await fetch(`/api/books/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    setBooks(prev => prev.map(b => b.id === editingId ? { ...b, title: editTitle, year: parseInt(editYear || '0') } : b))
    cancelEdit()
  }

  function cancelEdit() {
    setEditingId(null)
    setEditTitle('')
    setEditYear('')
  }

  async function remove(id) {
    if (!confirm('Вы уверены? Это действие нельзя отменить')) return
    await fetch(`/api/books/${id}`, { method: 'DELETE' })
    setBooks(prev => prev.filter(b => b.id !== id))
  }

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(b.year).includes(searchQuery)
  )

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>📖 Книги</h2>
      </div>

      <div className="card form">
        <h3 className="form-title">Добавить новую книгу</h3>
        <div className="form-row">
          <div className="form-group">
            <input 
              className="input" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Название книги"
              onKeyPress={e => e.key === 'Enter' && add()}
            />
          </div>
          <div className="form-group">
            <input 
              className="input" 
              value={year} 
              onChange={e => setYear(e.target.value)} 
              placeholder="Год"
              type="number"
              onKeyPress={e => e.key === 'Enter' && add()}
            />
          </div>
          <button className="btn btn-primary" onClick={add}>➕ Добавить</button>
        </div>
      </div>

      {editingId && (
        <div className="card edit-form">
          <h3 className="form-title">✏️ Редактирование книги</h3>
          <div className="form-row">
            <div className="form-group">
              <input 
                className="input" 
                value={editTitle} 
                onChange={e => setEditTitle(e.target.value)} 
                placeholder="Название"
              />
            </div>
            <div className="form-group">
              <input 
                className="input" 
                value={editYear} 
                onChange={e => setEditYear(e.target.value)} 
                placeholder="Год"
                type="number"
              />
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={saveEdit}>✓ Сохранить</button>
              <button className="btn btn-secondary" onClick={cancelEdit}>✕ Отмена</button>
            </div>
          </div>
        </div>
      )}

      {books.length > 0 && (
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Поиск по названию или году..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <div className="search-stats">
            <span className="badge">Всего: {books.length}</span>
            {searchQuery && <span className="badge badge-info">Найдено: {filteredBooks.length}</span>}
          </div>
        </div>
      )}

      <div className="books-grid">
        {books.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <p className="empty-text">Книги не найдены</p>
            <p className="empty-hint">Добавьте первую книгу, используя форму выше</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p className="empty-text">Книги не найдены</p>
            <p className="empty-hint">Попробуйте другой поисковый запрос</p>
          </div>
        ) : (
          <ul className="list">
            {filteredBooks.map(b => (
              <li key={b.id} className="list-item book-item">
                <div className="item-content">
                  <div className="item-icon">📕</div>
                  <div className="item-info">
                    <div className="item-title">{b.title}</div>
                    <div className="item-meta">Год: {b.year || '—'}</div>
                  </div>
                </div>
                <div className="item-actions">
                  <button className="btn-icon btn-edit" onClick={() => startEdit(b)} title="Редактировать">✏️</button>
                  <button className="btn-icon btn-delete" onClick={() => remove(b.id)} title="Удалить">🗑️</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}