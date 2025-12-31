import { useEffect, useState } from 'react'

export default function Authors() {
  const [authors, setAuthors] = useState([])
  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editCountry, setEditCountry] = useState('')

  useEffect(() => {
    fetch('/api/authors')
      .then(r => r.json())
      .then(setAuthors)
  }, [])

  async function add() {
    const res = await fetch('/api/authors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, country })
    })
    const created = await res.json()
    setAuthors(prev => [...prev, created])
    setName('')
    setCountry('')
  }

  function startEdit(a) {
    setEditingId(a.id)
    setEditName(a.name)
    setEditCountry(a.country)
  }

  async function saveEdit() {
    if (!editingId) return
    const payload = { id: editingId, name: editName, country: editCountry }
    await fetch(`/api/authors/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setAuthors(prev => prev.map(x => x.id === editingId ? { ...x, name: editName, country: editCountry } : x))
    cancelEdit()
  }

  function cancelEdit() {
    setEditingId(null)
    setEditName('')
    setEditCountry('')
  }

  async function remove(id) {
    if (!confirm('Удалить автора?')) return
    await fetch(`/api/authors/${id}`, { method: 'DELETE' })
    setAuthors(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Авторы</h2>
      </div>

      <div className="card form">
        <div className="form-row">
          <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Имя автора" />
          <input className="input" value={country} onChange={e => setCountry(e.target.value)} placeholder="Страна" />
          <button className="btn" onClick={add}>Добавить</button>
        </div>
      </div>

      {editingId && (
        <div className="card" style={{ marginTop: 12 }}>
          <h3>Изменить автора</h3>
          <div className="form-row">
            <input className="input" value={editName} onChange={e => setEditName(e.target.value)} />
            <input className="input" value={editCountry} onChange={e => setEditCountry(e.target.value)} />
            <button className="btn" onClick={saveEdit}>Сохранить</button>
            <button className="nav-button" onClick={cancelEdit}>Отмена</button>
          </div>
        </div>
      )}

      <ul className="list">
        {authors.map(a => (
          <li key={a.id} className="list-item">
            <div>
              <div className="item-title">{a.name}</div>
              <div className="item-meta">{a.country}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-edit" onClick={() => startEdit(a)}>Изменить</button>
              <button className="btn-delete" onClick={() => remove(a.id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
