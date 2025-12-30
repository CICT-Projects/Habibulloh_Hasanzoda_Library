import { useState } from 'react'
import BooksManager from './BooksManager'
import AuthorsManager from './AuthorsManager'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('books')

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <h1>Библиотека</h1>
        <nav style={styles.nav}>
          <button 
            onClick={() => setActiveTab('books')}
            style={{
              ...styles.navButton,
              backgroundColor: activeTab === 'books' ? '#4CAF50' : '#ccc'
            }}
          >
            Книги
          </button>
          <button 
            onClick={() => setActiveTab('authors')}
            style={{
              ...styles.navButton,
              backgroundColor: activeTab === 'authors' ? '#4CAF50' : '#ccc'
            }}
          >
            Авторы
          </button>
        </nav>
      </header>

      <main style={styles.main}>
        {activeTab === 'books' && <BooksManager />}
        {activeTab === 'authors' && <AuthorsManager />}
      </main>
    </div>
  )
}

const styles = {
  appContainer: {
    minHeight: '100vh',
    backgroundColor: '#fafafa',
  },
  header: {
    backgroundColor: '#333',
    color: 'white',
    padding: '20px',
    textAlign: 'center',
  },
  nav: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  navButton: {
    padding: '10px 20px',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  main: {
    padding: '20px',
  },
}

export default App
