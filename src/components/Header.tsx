import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user?.first_name) {
      return user.first_name.slice(0, 2).toUpperCase();
    }
    if (user?.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.first_name) {
      return user.first_name;
    }
    return user?.username || 'Usuario';
  };

  const getRoleDisplayName = () => {
    switch (user?.role) {
      case 'librarian':
        return 'Bibliotecario';
      case 'student':
        return 'Estudiante';
      default:
        return 'Usuario';
    }
  };

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Logo / Brand */}
        <div className="header-brand">
          <div className="brand-icon">📚</div>
          <div className="brand-text">
            <h1>Sistema de Biblioteca</h1>
            <span className="brand-subtitle">Gestión Digital</span>
          </div>
        </div>

        {/* User Section */}
        <div className="header-user">
          <div className="user-greeting">
            <span className="greeting-text">¡Hola!</span>
            <span className="user-name">{getUserDisplayName()}</span>
          </div>

          <div className="user-menu-container">
            <button
              className="user-menu-trigger"
              onClick={toggleUserMenu}
              aria-label="Menú de usuario"
            >
              <div className="user-avatar">
                <span className="avatar-initials">{getUserInitials()}</span>
              </div>
              <div className="user-details">
                <span className="user-display-name">{getUserDisplayName()}</span>
                <span className="user-role">{getRoleDisplayName()}</span>
              </div>
              <div className="dropdown-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className={showUserMenu ? 'rotated' : ''}
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </div>
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    <span className="avatar-initials">{getUserInitials()}</span>
                  </div>
                  <div className="dropdown-user-info">
                    <div className="dropdown-name">{getUserDisplayName()}</div>
                    <div className="dropdown-email">{user?.email}</div>
                    <div className="dropdown-role">{getRoleDisplayName()}</div>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <div className="dropdown-actions">
                  <button className="dropdown-item profile-item" disabled>
                    <span className="item-icon">👤</span>
                    <span>Ver Perfil</span>
                    <span className="item-badge">Próximamente</span>
                  </button>

                  <button className="dropdown-item settings-item" disabled>
                    <span className="item-icon">⚙️</span>
                    <span>Configuración</span>
                    <span className="item-badge">Próximamente</span>
                  </button>

                  <div className="dropdown-divider"></div>

                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <span className="item-icon">🚪</span>
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click overlay to close dropdown */}
      {showUserMenu && (
        <div className="dropdown-overlay" onClick={() => setShowUserMenu(false)} />
      )}
    </header>
  );
};