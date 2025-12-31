import { useState } from 'react'
import BooksManager from './components/Books'
import AuthorsManager from './components/Authors'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('books')

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-inner">
          <h1 className="brand">📚 Библиотека</h1>
          <nav className="nav">
            <button 
              className={`nav-button ${activeTab === 'books' ? 'active' : ''}`} 
              onClick={() => setActiveTab('books')}
            >
              📖 Книги
            </button>
            <button 
              className={`nav-button ${activeTab === 'authors' ? 'active' : ''}`} 
              onClick={() => setActiveTab('authors')}
            >
              ✍️ Авторы
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <div className="content">
          {activeTab === 'books' && <BooksManager />}
          {activeTab === 'authors' && <AuthorsManager />}
        </div>
      </main>
    </div>
  )
}

export default App
