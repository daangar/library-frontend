import React, { useEffect, useState } from 'react';
import type { Book, CreateBookRequest } from '../types/api';
import { apiService } from '../utils/api';
import './BookManagement.css';

export const BookManagement: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateBookRequest>({
    title: '',
    author_name: '',
    genre_name: '',
    published_year: new Date().getFullYear(),
    stock: 1,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      // Cargar libros
      const booksData = await apiService.getBooks();
      setBooks(booksData);
      // console.log('Books loaded:', booksData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar libros');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('El título es requerido');
      return;
    }

    if (!formData.author_name.trim()) {
      setError('El nombre del autor es requerido');
      return;
    }

    if (!formData.genre_name.trim()) {
      setError('El nombre del género es requerido');
      return;
    }

    if (formData.published_year < 1 || formData.published_year > new Date().getFullYear()) {
      setError('El año de publicación debe ser válido');
      return;
    }

    try {
      setLoading(true);
      await apiService.createBook(formData);

              // Limpiar form y recargar
      setFormData({
        title: '',
        author_name: '',
        genre_name: '',
        published_year: new Date().getFullYear(),
        stock: 1,
      });
      setShowCreateForm(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear libro');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'published_year' || name === 'stock'
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleDelete = async (bookId: number, title: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el libro "${title}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await apiService.deleteBook(bookId);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar libro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-management">
      <div className="section-header">
        <h2>Gestión de Libros</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="create-button"
          disabled={loading}
        >
          {showCreateForm ? 'Cancelar' : '+ Nuevo Libro'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showCreateForm && (
        <div className="create-form-container">
          <h3>Crear Nuevo Libro</h3>
          <form onSubmit={handleSubmit} className="create-form">
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="title">Título *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Título del libro"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="author_name">Autor *</label>
                <input
                  type="text"
                  id="author_name"
                  name="author_name"
                  value={formData.author_name}
                  onChange={handleInputChange}
                  placeholder="Nombre del autor"
                  required
                  disabled={loading}
                />
                <small className="form-hint">
                  Ejemplo: Gabriel García Márquez, Mario Vargas Llosa
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="genre_name">Género *</label>
                <input
                  type="text"
                  id="genre_name"
                  name="genre_name"
                  value={formData.genre_name}
                  onChange={handleInputChange}
                  placeholder="Género literario"
                  required
                  disabled={loading}
                />
                <small className="form-hint">
                  Ejemplo: Novela, Ciencia Ficción, Poesía, Historia
                </small>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="published_year">Año de Publicación *</label>
                <input
                  type="number"
                  id="published_year"
                  name="published_year"
                  value={formData.published_year}
                  onChange={handleInputChange}
                  min="1"
                  max={new Date().getFullYear()}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="cancel-button"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Creando...' : 'Crear Libro'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="books-list">
        {loading && books.length === 0 ? (
          <div className="loading">Cargando libros...</div>
        ) : (
          <div className="books-grid">
            {books.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-header">
                  <h4 className="book-title">{book.title}</h4>
                  <div className="book-actions">
                    <button
                      onClick={() => handleDelete(book.id, book.title)}
                      className="delete-button"
                      disabled={loading}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="book-details">
                  <p>
                    <strong>Autor:</strong> {book.author_name}
                  </p>
                  <p>
                    <strong>Género:</strong> {book.genre_name}
                  </p>
                  <p>
                    <strong>Año:</strong> {book.published_year}
                  </p>
                  <div className="book-stock">
                    <span
                      className={`stock-badge ${book.is_available ? 'available' : 'unavailable'}`}
                    >
                      Stock: {book.stock}
                    </span>
                    {book.is_available ? (
                      <span className="availability-badge available">Disponible</span>
                    ) : (
                      <span className="availability-badge unavailable">Agotado</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {books.length === 0 && !loading && (
              <div className="empty-state">No hay libros registrados</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
