import { useEffect, useState } from 'react'

export default function Authors() {
  const [authors, setAuthors] = useState([])
  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editCountry, setEditCountry] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetch('/api/authors')
      .then(r => r.json())
      .then(setAuthors)
  }, [])

  async function add() {
    if (!name.trim()) {
      alert('Введите имя автора')
      return
    }
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
    await fetch(`/api/authors/${editingId}`, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(payload) 
    })
    setAuthors(prev => prev.map(x => x.id === editingId ? { ...x, name: editName, country: editCountry } : x))
    cancelEdit()
  }

  function cancelEdit() {
    setEditingId(null)
    setEditName('')
    setEditCountry('')
  }

  async function remove(id) {
    if (!confirm('Вы уверены? Это действие нельзя отменить')) return
    await fetch(`/api/authors/${id}`, { method: 'DELETE' })
    setAuthors(prev => prev.filter(a => a.id !== id))
  }

  const filteredAuthors = authors.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.country && a.country.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>✍️ Авторы</h2>
      </div>

      <div className="card form">
        <h3 className="form-title">Добавить нового автора</h3>
        <div className="form-row">
          <div className="form-group">
            <input 
              className="input" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Имя автора"
              onKeyPress={e => e.key === 'Enter' && add()}
            />
          </div>
          <div className="form-group">
            <input 
              className="input" 
              value={country} 
              onChange={e => setCountry(e.target.value)} 
              placeholder="Страна"
              onKeyPress={e => e.key === 'Enter' && add()}
            />
          </div>
          <button className="btn btn-primary" onClick={add}>➕ Добавить</button>
        </div>
      </div>

      {editingId && (
        <div className="card edit-form">
          <h3 className="form-title">✏️ Редактирование автора</h3>
          <div className="form-row">
            <div className="form-group">
              <input 
                className="input" 
                value={editName} 
                onChange={e => setEditName(e.target.value)} 
                placeholder="Имя"
              />
            </div>
            <div className="form-group">
              <input 
                className="input" 
                value={editCountry} 
                onChange={e => setEditCountry(e.target.value)} 
                placeholder="Страна"
              />
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={saveEdit}>✓ Сохранить</button>
              <button className="btn btn-secondary" onClick={cancelEdit}>✕ Отмена</button>
            </div>
          </div>
        </div>
      )}

      {authors.length > 0 && (
        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Поиск по имени или стране..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <div className="search-stats">
            <span className="badge">Всего: {authors.length}</span>
            {searchQuery && <span className="badge badge-info">Найдено: {filteredAuthors.length}</span>}
          </div>
        </div>
      )}

      <div className="authors-grid">
        {authors.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✍️</div>
            <p className="empty-text">Авторы не найдены</p>
            <p className="empty-hint">Добавьте первого автора, используя форму выше</p>
          </div>
        ) : filteredAuthors.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p className="empty-text">Авторы не найдены</p>
            <p className="empty-hint">Попробуйте другой поисковый запрос</p>
          </div>
        ) : (
          <ul className="list">
            {filteredAuthors.map(a => (
              <li key={a.id} className="list-item author-item">
                <div className="item-content">
                  <div className="item-icon">👤</div>
                  <div className="item-info">
                    <div className="item-title">{a.name}</div>
                    <div className="item-meta">{a.country || 'Страна не указана'}</div>
                  </div>
                </div>
                <div className="item-actions">
                  <button className="btn-icon btn-edit" onClick={() => startEdit(a)} title="Редактировать">✏️</button>
                  <button className="btn-icon btn-delete" onClick={() => remove(a.id)} title="Удалить">🗑️</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}