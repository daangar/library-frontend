import React, { useState } from 'react';
import { BookCatalog } from './BookCatalog';
import './StudentDashboard.css';
import { StudentLoans } from './StudentLoans';

type ActiveTab = 'catalog' | 'loans';

export const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('catalog');
  const [activeLoansCount, setActiveLoansCount] = useState<number>(0);

  return (
    <div className="student-dashboard">
      <nav className="dashboard-nav">
        <button
          className={`nav-button ${activeTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          <span className="nav-icon">📚</span>
          <span>Catálogo de Libros</span>
        </button>
        <button
          className={`nav-button ${activeTab === 'loans' ? 'active' : ''}`}
          onClick={() => setActiveTab('loans')}
        >
          <span className="nav-icon">📋</span>
          <span>Mis Préstamos</span>
          {activeLoansCount > 0 && (
            <span className="nav-badge">{activeLoansCount}</span>
          )}
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'catalog' && <BookCatalog />}
        {activeTab === 'loans' && (
          <StudentLoans onActiveLoansChange={setActiveLoansCount} />
        )}
      </main>
    </div>
  );
};