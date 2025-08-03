import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    clearError,
    fetchLoans,
    selectFilteredLoans,
    selectLoansError,
    selectLoansFilter,
    selectLoansLoading,
    setFilter,
    setSelectedLoan,
} from '../store/loansSlice';
import type { User } from '../types/api';
import { apiService } from '../utils/api';
import { LoanDetail } from './LoanDetail';
import './LoanManagement.css';

export const LoanManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const loans = useAppSelector(selectFilteredLoans);
  const loading = useAppSelector(selectLoansLoading);
  const error = useAppSelector(selectLoansError);
  const filter = useAppSelector(selectLoansFilter);
  const selectedLoan = useAppSelector(state => state.loans.selectedLoan);

  const [students, setStudents] = useState<User[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchLoans());
    loadStudents();
  }, [dispatch]);

  const loadStudents = async () => {
    try {
      setStudentsLoading(true);
      const users = await apiService.getUsers();
      const studentUsers = users.filter(user => user.role === 'student');
      setStudents(studentUsers);
    } catch (err) {
              console.log('No se pudieron cargar estudiantes:', err);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleStatusFilterChange = (status: 'all' | 'active' | 'returned') => {
    dispatch(setFilter({ status }));
  };

  const handleStudentFilterChange = (studentId: number | null) => {
    dispatch(setFilter({ studentId }));
  };

  const handleLoanClick = (loanId: number) => {
    const loan = loans.find(l => l.id === loanId);
    if (loan) {
      dispatch(setSelectedLoan(loan));
    }
  };

  const handleCloseDetail = () => {
    dispatch(setSelectedLoan(null));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (isReturned: boolean) => {
    return (
      <span className={`status-badge ${isReturned ? 'returned' : 'active'}`}>
        {isReturned ? 'Devuelto' : 'Activo'}
      </span>
    );
  };

  if (error) {
    return (
      <div className="loan-management">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => dispatch(clearError())} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (selectedLoan) {
    return <LoanDetail loan={selectedLoan} onClose={handleCloseDetail} />;
  }

  return (
    <div className="loan-management">
      <div className="loan-management-header">
        <h2>Gestión de Préstamos</h2>
        <p className="subtitle">
          Administra todos los préstamos activos y el historial de devoluciones
        </p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="status-filter">Estado:</label>
          <select
            id="status-filter"
            value={filter.status}
            onChange={(e) => handleStatusFilterChange(e.target.value as 'all' | 'active' | 'returned')}
            className="filter-select"
          >
            <option value="all">Todos los préstamos</option>
            <option value="active">Préstamos activos</option>
            <option value="returned">Préstamos devueltos</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="student-filter">Estudiante:</label>
          <select
            id="student-filter"
            value={filter.studentId || ''}
            onChange={(e) => handleStudentFilterChange(e.target.value ? Number(e.target.value) : null)}
            className="filter-select"
            disabled={studentsLoading}
          >
            <option value="">Todos los estudiantes</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.first_name} {student.last_name} ({student.username})
              </option>
            ))}
          </select>
        </div>

        <div className="filter-stats">
          <span className="stats-item">
            Total: <strong>{loans.length}</strong>
          </span>
          <span className="stats-item">
            Activos: <strong>{loans.filter(loan => !loan.is_returned).length}</strong>
          </span>
          <span className="stats-item">
            Devueltos: <strong>{loans.filter(loan => loan.is_returned).length}</strong>
          </span>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Cargando préstamos...</p>
        </div>
      ) : (
        <div className="loans-grid">
          {loans.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <h3>No hay préstamos</h3>
              <p>
                {filter.status === 'active' 
                  ? 'No hay préstamos activos en este momento.'
                  : filter.status === 'returned'
                  ? 'No hay préstamos devueltos.'
                  : 'No se encontraron préstamos que coincidan con los filtros.'}
              </p>
            </div>
          ) : (
            loans.map(loan => (
              <div
                key={loan.id}
                className="loan-card"
                onClick={() => handleLoanClick(loan.id)}
              >
                <div className="loan-card-header">
                  <div className="loan-book-info">
                    <h4>{loan.book.title}</h4>
                    <p className="book-author">por {loan.book.author_name}</p>
                  </div>
                  {getStatusBadge(loan.is_returned)}
                </div>

                <div className="loan-student-info">
                  <span className="student-name">
                    {loan.student.first_name} {loan.student.last_name}
                  </span>
                  <span className="student-username">@{loan.student.username}</span>
                </div>

                <div className="loan-dates">
                  <div className="date-item">
                    <span className="date-label">Prestado:</span>
                    <span className="date-value">{formatDate(loan.borrowed_at)}</span>
                  </div>
                  {loan.returned_at && (
                    <div className="date-item">
                      <span className="date-label">Devuelto:</span>
                      <span className="date-value">{formatDate(loan.returned_at)}</span>
                    </div>
                  )}
                </div>

                <div className="loan-card-footer">
                  <span className="loan-id">ID: {loan.id}</span>
                  <span className="click-hint">Click para ver detalles →</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};