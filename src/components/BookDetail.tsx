import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { Book } from '../types/api';
import { apiService } from '../utils/api';
import './BookDetail.css';

interface BookDetailProps {
  book: Book;
  onClose: () => void;
  onLoanCreated?: () => void;
}

export const BookDetail: React.FC<BookDetailProps> = ({
  book,
  onClose,
  onLoanCreated,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateLoan = async () => {
    if (!book.is_available || book.stock <= 0) {
      setError('Este libro no está disponible para préstamo');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await apiService.createLoan({
        book_id: book.id,
      });

      setSuccess('¡Préstamo creado exitosamente! Puedes ver tus préstamos en "Mis Préstamos".');
      
      // Call the callback after successful loan creation
      setTimeout(() => {
        if (onLoanCreated) {
          onLoanCreated();
        }
      }, 2000);

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'No se pudo crear el préstamo';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const canCreateLoan = user?.role === 'student' && book.is_available && book.stock > 0;

  return (
    <div className="book-detail-overlay">
      <div className="book-detail-modal">
        <div className="book-detail-header">
          <button className="close-button" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="book-detail-content">
          <div className="book-detail-main">
            <div className="book-cover-placeholder">
              <div className="book-icon">📖</div>
              <div className="book-cover-text">
                {book.title.split(' ').slice(0, 3).join(' ')}
              </div>
            </div>

            <div className="book-info-section">
              <div className="book-title-section">
                <h1 className="book-title">{book.title}</h1>
                <div className={`availability-status ${book.is_available ? 'available' : 'unavailable'}`}>
                  {book.is_available ? (
                    <>
                      <span className="status-icon">✅</span>
                      <span>Disponible</span>
                    </>
                  ) : (
                    <>
                      <span className="status-icon">❌</span>
                      <span>No disponible</span>
                    </>
                  )}
                </div>
              </div>

              <div className="book-details-grid">
                <div className="detail-item">
                  <label>Autor</label>
                  <span>{book.author_name}</span>
                </div>

                <div className="detail-item">
                  <label>Género</label>
                  <span>{book.genre_name}</span>
                </div>

                <div className="detail-item">
                  <label>Año de Publicación</label>
                  <span>{book.published_year}</span>
                </div>

                <div className="detail-item">
                  <label>Copias Disponibles</label>
                  <span className={`stock-value ${book.stock > 0 ? 'positive' : 'zero'}`}>
                    {book.stock} {book.stock === 1 ? 'copia' : 'copias'}
                  </span>
                </div>
              </div>

              {/* Status Messages */}
              {error && (
                <div className="message error-message">
                  <span className="message-icon">⚠️</span>
                  {error}
                </div>
              )}

              {success && (
                <div className="message success-message">
                  <span className="message-icon">✅</span>
                  {success}
                </div>
              )}

              {/* Action Section */}
              <div className="book-actions">
                {user?.role === 'student' ? (
                  <>
                    {canCreateLoan ? (
                      <button
                        className="loan-button primary"
                        onClick={handleCreateLoan}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="loading-spinner small"></span>
                            Procesando...
                          </>
                        ) : (
                          <>
                            <span className="button-icon">📚</span>
                            Solicitar Préstamo
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="unavailable-notice">
                        <span className="notice-icon">ℹ️</span>
                        <div>
                          <strong>No disponible para préstamo</strong>
                          <p>
                            {book.stock === 0
                              ? 'No hay copias disponibles en este momento.'
                              : 'Este libro no está disponible para préstamo.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="role-notice">
                    <span className="notice-icon">👤</span>
                    <div>
                      <strong>Acceso de Bibliotecario</strong>
                      <p>Los bibliotecarios pueden ver la información del libro pero no realizar préstamos.</p>
                    </div>
                  </div>
                )}

                <button className="secondary-button" onClick={onClose}>
                  Volver al Catálogo
                </button>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="additional-info">
            <div className="info-card">
              <h3>Información del Libro</h3>
              <div className="info-content">
                <div className="info-row">
                  <span className="info-label">ID del Libro:</span>
                  <span className="info-value">#{book.id}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Estado:</span>
                  <span className={`info-value status ${book.is_available ? 'available' : 'unavailable'}`}>
                    {book.is_available ? 'Disponible para préstamo' : 'No disponible'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Stock Total:</span>
                  <span className="info-value">{book.stock} {book.stock === 1 ? 'ejemplar' : 'ejemplares'}</span>
                </div>
              </div>
            </div>

            {user?.role === 'student' && (
              <div className="info-card">
                <h3>Información del Préstamo</h3>
                <div className="info-content">
                  <div className="info-row">
                    <span className="info-label">Duración:</span>
                    <span className="info-value">14 días</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Renovaciones:</span>
                    <span className="info-value">Hasta 2 renovaciones</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Multa por retraso:</span>
                    <span className="info-value">$1.00 por día</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};