import React, { useEffect, useState } from 'react';
import type { CreateUserRequest, User } from '../types/api';
import { apiService } from '../utils/api';
import './UserManagement.css';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'student',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const usersData = await apiService.getUsers();
      setUsers(usersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim() || !formData.email.trim()) {
      setError('Usuario y email son requeridos');
      return;
    }

    if (!formData.password.trim()) {
      setError('La contraseña es requerida');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      await apiService.createUser(formData);

      // Limpiar formulario y recargar
      setFormData({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'student',
      });
      setShowCreateForm(false);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async (userId: number, username: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar al usuario "${username}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await apiService.deleteUser(userId);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-management">
      <div className="section-header">
        <h2>Gestión de Usuarios</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="create-button"
          disabled={loading}
        >
          {showCreateForm ? 'Cancelar' : '+ Nuevo Usuario'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showCreateForm && (
        <div className="create-form-container">
          <h3>Crear Nuevo Usuario</h3>
          <form onSubmit={handleSubmit} className="create-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Usuario *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Nombre de usuario"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="correo@ejemplo.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Contraseña *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                  disabled={loading}
                  minLength={6}
                />
                <small className="form-hint">
                  La contraseña debe tener al menos 6 caracteres
                </small>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">Nombre</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="Nombre"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="last_name">Apellido</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Apellido"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="role">Rol</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="student">Estudiante</option>
                  <option value="librarian">Bibliotecario</option>
                </select>
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
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Usuario'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="users-list">
        {loading && users.length === 0 ? (
          <div className="loading">Cargando usuarios...</div>
        ) : (
          <div className="users-table">
            <div className="table-header">
              <div className="table-cell">Usuario</div>
              <div className="table-cell">Nombre</div>
              <div className="table-cell">Email</div>
              <div className="table-cell">Rol</div>
              <div className="table-cell">Acciones</div>
            </div>

            {users.map((user) => (
              <div key={user.id} className="table-row">
                <div className="table-cell">
                  <strong>{user.username}</strong>
                </div>
                <div className="table-cell">
                  {user.first_name || user.last_name
                    ? `${user.first_name} ${user.last_name}`.trim()
                    : '-'}
                </div>
                <div className="table-cell">{user.email}</div>
                <div className="table-cell">
                  <span className={`role-badge ${user.role}`}>
                    {user.role === 'student' ? 'Estudiante' : 'Bibliotecario'}
                  </span>
                </div>
                <div className="table-cell">
                  <button
                    onClick={() => handleDelete(user.id, user.username)}
                    className="delete-button"
                    disabled={loading}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            {users.length === 0 && !loading && (
              <div className="empty-state">No hay usuarios registrados</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
