import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { returnLoan, selectLoansError, selectLoansLoading } from '../store/loansSlice';
import type { Loan } from '../types/api';
import './LoanDetail.css';

interface LoanDetailProps {
  loan: Loan;
  onClose: () => void;
}

export const LoanDetail: React.FC<LoanDetailProps> = ({ loan, onClose }) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoansLoading);
  const error = useAppSelector(selectLoansError);
  const [showReturnConfirm, setShowReturnConfirm] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDaysLoaned = () => {
    const borrowedDate = new Date(loan.borrowed_at);
    const endDate = loan.returned_at ? new Date(loan.returned_at) : new Date();
    const diffTime = Math.abs(endDate.getTime() - borrowedDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleReturnBook = async () => {
    try {
      await dispatch(returnLoan(loan.id)).unwrap();
      setShowReturnConfirm(false);
      // No cerrar automáticamente
    } catch (err) {
      // Error manejado por Redux
              console.log('Error devolviendo libro:', err);
    }
  };

  const getStatusDisplay = () => {
    if (loan.is_returned) {
      return {
        badge: <span className="status-badge returned">Devuelto</span>,
        message: '✅ Este libro ha sido devuelto exitosamente',
        class: 'returned'
      };
    } else {
      return {
        badge: <span className="status-badge active">Activo</span>,
        message: '📖 Préstamo activo - Esperando devolución',
        class: 'active'
      };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className="loan-detail-overlay">
      <div className="loan-detail-modal">
        <div className="modal-header">
          <div className="header-content">
            <h2>Detalle del Préstamo</h2>
            <span className="loan-id">ID: {loan.id}</span>
          </div>
          <button onClick={onClose} className="close-button" aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <div className="loan-status-section">
            <div className="status-header">
              {status.badge}
              <p className="status-message">{status.message}</p>
            </div>
          </div>

          <div className="loan-sections">
            <section className="book-section">
              <h3>📚 Información del Libro</h3>
              <div className="info-card">
                <div className="book-cover">
                  <span className="book-icon">📖</span>
                </div>
                <div className="book-details">
                  <h4>{loan.book.title}</h4>
                  <p className="book-author">por {loan.book.author_name}</p>
                  <p className="book-genre">{loan.book.genre_name}</p>
                  <div className="book-meta">
                    <span className="meta-item">Año: {loan.book.published_year}</span>
                    <span className="meta-item">Stock: {loan.book.stock}</span>
                    <span className={`meta-item ${loan.book.is_available ? 'available' : 'unavailable'}`}>
                      {loan.book.is_available ? '✅ Disponible' : '❌ No disponible'}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="student-section">
              <h3>👤 Información del Estudiante</h3>
              <div className="info-card">
                <div className="student-avatar">
                  <span className="avatar-icon">👤</span>
                </div>
                <div className="student-details">
                  <h4>{loan.student.first_name} {loan.student.last_name}</h4>
                  <p className="student-username">@{loan.student.username}</p>
                  <p className="student-email">{loan.student.email}</p>
                  <span className="student-role">Estudiante</span>
                </div>
              </div>
            </section>

            <section className="loan-timeline">
              <h3>📅 Cronología del Préstamo</h3>
              <div className="timeline">
                <div className="timeline-item completed">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h5>Libro Prestado</h5>
                    <p>{formatDate(loan.borrowed_at)}</p>
                    <small>{formatDateTime(loan.borrowed_at)}</small>
                  </div>
                </div>
                
                <div className={`timeline-item ${loan.is_returned ? 'completed' : 'pending'}`}>
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h5>{loan.is_returned ? 'Libro Devuelto' : 'Esperando Devolución'}</h5>
                    {loan.returned_at ? (
                      <>
                        <p>{formatDate(loan.returned_at)}</p>
                        <small>{formatDateTime(loan.returned_at)}</small>
                      </>
                    ) : (
                      <p>Pendiente de devolución</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="loan-stats">
              <h3>📊 Estadísticas</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value">{calculateDaysLoaned()}</span>
                  <span className="stat-label">
                    {loan.is_returned ? 'Días prestado' : 'Días activo'}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{loan.is_returned ? '✅' : '⏳'}</span>
                  <span className="stat-label">Estado</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="secondary-button">
            Cerrar
          </button>

          {!loan.is_returned && (
            <div className="return-actions">
              {!showReturnConfirm ? (
                <button
                  onClick={() => setShowReturnConfirm(true)}
                  className="return-button"
                  disabled={loading}
                >
                  <span className="return-icon">📥</span>
                  Marcar como Devuelto
                </button>
              ) : (
                <div className="return-confirm">
                  <p>¿Confirmar devolución del libro?</p>
                  <div className="confirm-actions">
                    <button
                      onClick={() => setShowReturnConfirm(false)}
                      className="cancel-button"
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleReturnBook}
                      className="confirm-button"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="loading-spinner-small"></span>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <span className="confirm-icon">✅</span>
                          Confirmar Devolución
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};