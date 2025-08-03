import React, { useEffect, useState } from 'react';
import type { Loan } from '../types/api';
import { apiService } from '../utils/api';
import './StudentLoans.css';

interface StudentLoansProps {
  onActiveLoansChange?: (count: number) => void;
}

export const StudentLoans: React.FC<StudentLoansProps> = ({ onActiveLoansChange }) => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'returned'>('all');

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      setLoading(true);
      setError('');
      const loansData = await apiService.getLoans();
      setLoans(loansData);
      
      // Calcular préstamos activos
      const activeLoansCount = loansData.filter(loan => !loan.is_returned).length;
      onActiveLoansChange?.(activeLoansCount);
      
      console.log('Préstamos:', loansData.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar préstamos');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredLoans = () => {
    switch (filter) {
      case 'active':
        return loans.filter(loan => !loan.is_returned);
      case 'returned':
        return loans.filter(loan => loan.is_returned);
      default:
        return loans;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDaysRemaining = (borrowedDate: string) => {
    const borrowed = new Date(borrowedDate);
    const dueDate = new Date(borrowed);
    dueDate.setDate(dueDate.getDate() + 14); // 14 days loan period
    
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      daysRemaining: diffDays,
      dueDate: dueDate,
      isOverdue: diffDays < 0,
    };
  };

  const filteredLoans = getFilteredLoans();
  const activeLoans = loans.filter(loan => !loan.is_returned).length;
  const totalLoans = loans.length;

  return (
    <div className="student-loans">
      <div className="loans-header">
        <div className="header-content">
          <h2>Mis Préstamos</h2>
          <p className="header-subtitle">
            Gestiona tus préstamos de libros y consulta tu historial
          </p>
        </div>

        <div className="loans-stats">
          <div className="stat-card">
            <div className="stat-number">{activeLoans}</div>
            <div className="stat-label">Préstamos Activos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{totalLoans}</div>
            <div className="stat-label">Total de Préstamos</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todos ({loans.length})
        </button>
        <button
          className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Activos ({activeLoans})
        </button>
        <button
          className={`filter-tab ${filter === 'returned' ? 'active' : ''}`}
          onClick={() => setFilter('returned')}
        >
          Devueltos ({loans.length - activeLoans})
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Loans List */}
      <div className="loans-list">
        {loading && loans.length === 0 ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando préstamos...</p>
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>
              {filter === 'all' 
                ? 'No tienes préstamos' 
                : filter === 'active' 
                ? 'No tienes préstamos activos'
                : 'No tienes préstamos devueltos'}
            </h3>
            <p>
              {filter === 'all' 
                ? 'Aún no has solicitado ningún préstamo. Explora el catálogo para encontrar libros interesantes.'
                : filter === 'active'
                ? 'Todos tus préstamos han sido devueltos.'
                : 'No has devuelto ningún libro aún.'}
            </p>
          </div>
        ) : (
          <div className="loans-grid">
            {filteredLoans.map((loan) => {
              const dueInfo = !loan.is_returned ? getDaysRemaining(loan.borrowed_at) : null;
              
              return (
                <div key={loan.id} className={`loan-card ${loan.is_returned ? 'returned' : 'active'}`}>
                  <div className="loan-card-header">
                    <h3 className="book-title">{loan.book.title}</h3>
                    <div className={`loan-status ${loan.is_returned ? 'returned' : 'active'}`}>
                      {loan.is_returned ? (
                        <>
                          <span className="status-icon">✅</span>
                          <span>Devuelto</span>
                        </>
                      ) : (
                        <>
                          <span className="status-icon">📖</span>
                          <span>Activo</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="loan-card-content">
                    <div className="book-info">
                      <p className="book-author">
                        <strong>Autor:</strong> {loan.book.author_name}
                      </p>
                      <p className="book-genre">
                        <strong>Género:</strong> {loan.book.genre_name}
                      </p>
                    </div>

                    <div className="loan-dates">
                      <div className="date-item">
                        <label>Fecha de Préstamo</label>
                        <span>{formatDate(loan.borrowed_at)}</span>
                      </div>

                      {loan.is_returned ? (
                        <div className="date-item returned">
                          <label>Fecha de Devolución</label>
                          <span>{loan.returned_at ? formatDate(loan.returned_at) : 'N/A'}</span>
                        </div>
                      ) : dueInfo && (
                        <div className="date-item due">
                          <label>Fecha de Vencimiento</label>
                          <span className={dueInfo.isOverdue ? 'overdue' : ''}>
                            {formatDate(dueInfo.dueDate.toISOString())}
                          </span>
                        </div>
                      )}
                    </div>

                    {!loan.is_returned && dueInfo && (
                      <div className={`due-notice ${dueInfo.isOverdue ? 'overdue' : dueInfo.daysRemaining <= 3 ? 'warning' : 'normal'}`}>
                        {dueInfo.isOverdue ? (
                          <>
                            <span className="notice-icon">⚠️</span>
                            <span>Vencido hace {Math.abs(dueInfo.daysRemaining)} día{Math.abs(dueInfo.daysRemaining) !== 1 ? 's' : ''}</span>
                          </>
                        ) : dueInfo.daysRemaining <= 3 ? (
                          <>
                            <span className="notice-icon">⏰</span>
                            <span>Vence en {dueInfo.daysRemaining} día{dueInfo.daysRemaining !== 1 ? 's' : ''}</span>
                          </>
                        ) : (
                          <>
                            <span className="notice-icon">📅</span>
                            <span>{dueInfo.daysRemaining} días restantes</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="loan-card-footer">
                    <div className="loan-id">
                      <span>Préstamo #{loan.id}</span>
                    </div>
                    <div className="loan-timestamp">
                      <span>{formatDateTime(loan.borrowed_at)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Loan Information */}
      {loans.length > 0 && (
        <div className="loan-info-section">
          <div className="info-card">
            <h3>Información sobre Préstamos</h3>
            <div className="info-list">
              <div className="info-item">
                <span className="info-icon">📅</span>
                <div>
                  <strong>Duración del préstamo:</strong>
                  <p>14 días desde la fecha de préstamo</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">🔄</span>
                <div>
                  <strong>Renovaciones:</strong>
                  <p>Puedes renovar hasta 2 veces si no hay reservas</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">💰</span>
                <div>
                  <strong>Multas:</strong>
                  <p>$1.00 por día de retraso después del vencimiento</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📚</span>
                <div>
                  <strong>Límite:</strong>
                  <p>Máximo 3 libros prestados simultáneamente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};