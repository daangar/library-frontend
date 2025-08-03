import React, { useEffect, useState } from 'react';
import type { Book } from '../types/api';
import { apiService } from '../utils/api';
import './BookCatalog.css';
import { BookDetail } from './BookDetail';

interface BookFilters {
  title: string;
  author_name: string;
  genre_name: string;
  available?: boolean;
}

export const BookCatalog: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [filters, setFilters] = useState<BookFilters>({
    title: '',
    author_name: '',
    genre_name: '',
    available: undefined,
  });

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    // Apply filters locally for better user experience
    let filtered = books;

    if (filters.title.trim()) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }

    if (filters.author_name.trim()) {
      filtered = filtered.filter(book =>
        book.author_name.toLowerCase().includes(filters.author_name.toLowerCase())
      );
    }

    if (filters.genre_name.trim()) {
      filtered = filtered.filter(book =>
        book.genre_name.toLowerCase().includes(filters.genre_name.toLowerCase())
      );
    }

    if (filters.available !== undefined) {
      filtered = filtered.filter(book => book.is_available === filters.available);
    }

    setFilteredBooks(filtered);
  }, [books, filters]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError('');
      const booksData = await apiService.getBooks();
      setBooks(booksData);
      console.log('Libros cargados:', booksData.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar libros');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: name === 'available' ? (value === '' ? undefined : value === 'true') : value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      title: '',
      author_name: '',
      genre_name: '',
      available: undefined,
    });
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
  };

  const handleCloseDetail = () => {
    setSelectedBook(null);
    // Reload books to get updated availability
    loadBooks();
  };

  if (selectedBook) {
    return (
      <BookDetail
        book={selectedBook}
        onClose={handleCloseDetail}
        onLoanCreated={handleCloseDetail}
      />
    );
  }

  return (
    <div className="book-catalog">
      <div className="catalog-header">
        <div className="header-content">
          <h2>Catálogo de Libros</h2>
          <p className="header-subtitle">
            Explora nuestra colección y encuentra tu próxima lectura
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="title">📖 Título</label>
            <input
              type="text"
              id="title"
              name="title"
              value={filters.title}
              onChange={handleFilterChange}
              placeholder="Buscar por título..."
            />
          </div>

          <div className="filter-group">
            <label htmlFor="author_name">✍️ Autor</label>
            <input
              type="text"
              id="author_name"
              name="author_name"
              value={filters.author_name}
              onChange={handleFilterChange}
              placeholder="Buscar por autor..."
            />
          </div>

          <div className="filter-group">
            <label htmlFor="genre_name">🎭 Género</label>
            <input
              type="text"
              id="genre_name"
              name="genre_name"
              value={filters.genre_name}
              onChange={handleFilterChange}
              placeholder="Buscar por género..."
            />
          </div>

          <div className="filter-group">
            <label htmlFor="available">📊 Estado</label>
            <select
              id="available"
              name="available"
              value={filters.available === undefined ? '' : filters.available.toString()}
              onChange={handleFilterChange}
            >
              <option value="">Todos</option>
              <option value="true">Disponibles</option>
              <option value="false">Prestados</option>
            </select>
          </div>

          <div className="filter-actions">
            <button
              type="button"
              onClick={clearFilters}
              className="clear-filters-button"
              title="Limpiar todos los filtros"
            >
              <span className="clear-icon">🗑️</span>
              <span className="clear-text">Limpiar</span>
            </button>
          </div>
        </div>

        <div className="results-info">
          <span className="results-count">
            <span className="results-number">{filteredBooks.length}</span>
            libro{filteredBooks.length !== 1 ? 's' : ''} encontrado{filteredBooks.length !== 1 ? 's' : ''}
          </span>
          {(filters.title || filters.author_name || filters.genre_name || filters.available !== undefined) && (
            <span className="active-filters-indicator">
              Filtros activos
            </span>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Books Grid */}
      <div className="books-grid">
        {loading && books.length === 0 ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando catálogo de libros...</p>
          </div>
        ) : filteredBooks.length === 0 && !loading ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No se encontraron libros</h3>
            <p>
              {books.length === 0
                ? 'No hay libros en el catálogo aún.'
                : 'Intenta modificar los filtros de búsqueda.'}
            </p>
            {books.length > 0 && (
              <button onClick={clearFilters} className="clear-filters-button">
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-card" onClick={() => handleBookSelect(book)}>
              <div className="book-card-header">
                <h3 className="book-title">{book.title}</h3>
                <div className={`availability-badge ${book.is_available ? 'available' : 'unavailable'}`}>
                  {book.is_available ? '✅ Disponible' : '❌ No disponible'}
                </div>
              </div>

              <div className="book-card-content">
                <div className="book-info">
                  <p className="book-author">
                    <strong>Autor:</strong> {book.author_name}
                  </p>
                  <p className="book-genre">
                    <strong>Género:</strong> {book.genre_name}
                  </p>
                  <p className="book-year">
                    <strong>Año:</strong> {book.published_year}
                  </p>
                </div>

                <div className="book-stock">
                  <span className={`stock-info ${book.is_available ? 'available' : 'unavailable'}`}>
                    {book.stock} {book.stock === 1 ? 'copia' : 'copias'} disponible{book.stock !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="book-card-footer">
                <button className="view-detail-button">
                  Ver detalles
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};