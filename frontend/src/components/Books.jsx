import { useEffect, useState } from 'react'

export default function Books() {
  const [books, setBooks] = useState([])
  const [title, setTitle] = useState('')
  const [year, setYear] = useState('')
  const [editingId, setEditingId] = useState(null)

  // Local edit fields (when editing existing item)
  const [editTitle, setEditTitle] = useState('')
  const [editYear, setEditYear] = useState('')

  useEffect(() => {
    fetch('/api/books')
      .then(r => r.json())
      .then(setBooks)
    // no author relations needed
  }, [])

  async function add() {
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
    if (!confirm('Удалить запись?')) return
    await fetch(`/api/books/${id}`, { method: 'DELETE' })
    setBooks(prev => prev.filter(b => b.id !== id))
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Книги</h2>
      </div>

      <div className="card form">
        <div className="form-row">
          <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Название" />
          <input className="input input-small" value={year} onChange={e => setYear(e.target.value)} placeholder="Год" />
          <button className="btn" onClick={add}>Добавить</button>
        </div>
      </div>

      {editingId && (
        <div className="card" style={{ marginTop: 12 }}>
          <h3>Изменить книгу</h3>
          <div className="form-row">
            <input className="input" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
            <input className="input input-small" value={editYear} onChange={e => setEditYear(e.target.value)} />
            <button className="btn" onClick={saveEdit}>Сохранить</button>
            <button className="nav-button" onClick={cancelEdit}>Отмена</button>
          </div>
        </div>
      )}

      <ul className="list">
        {books.map(b => (
          <li key={b.id} className="list-item">
            <div>
              <div className="item-title">{b.title}</div>
              <div className="item-meta">{b.year}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-edit" onClick={() => startEdit(b)}>Изменить</button>
              <button className="btn-delete" onClick={() => remove(b.id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
