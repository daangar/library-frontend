import React, { useState } from 'react';
import { BookManagement } from './BookManagement';
import './LibrarianDashboard.css';
import { LoanManagement } from './LoanManagement';
import { UserManagement } from './UserManagement';

type ActiveTab = 'users' | 'books' | 'loans';

export const LibrarianDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('users');

  return (
    <div className="dashboard-container">

      <nav className="dashboard-nav">
        <div className="nav-container">
          <button
            className={`nav-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="nav-icon">👥</span>
            <span>Gestión de Usuarios</span>
          </button>
          <button
            className={`nav-button ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            <span className="nav-icon">📚</span>
            <span>Gestión de Libros</span>
          </button>
          <button
            className={`nav-button ${activeTab === 'loans' ? 'active' : ''}`}
            onClick={() => setActiveTab('loans')}
          >
            <span className="nav-icon">📋</span>
            <span>Gestión de Préstamos</span>
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'books' && <BookManagement />}
        {activeTab === 'loans' && <LoanManagement />}
      </main>
    </div>
  );
};
