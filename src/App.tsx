import React from 'react';
import { Provider } from 'react-redux';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { Layout } from './components/Layout';
import { LibrarianDashboard } from './components/LibrarianDashboard';
import { Login } from './components/Login';
import { StudentDashboard } from './components/StudentDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { store } from './store';

// Protected Route component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: 'student' | 'librarian';
}> = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="unauthorized-container">
        <h2>Acceso No Autorizado</h2>
        <p>No tienes permisos para acceder a esta página.</p>
        <p>Tu rol: {user.role === 'student' ? 'Estudiante' : 'Bibliotecario'}</p>
      </div>
    );
  }

  return <>{children}</>;
};

// App Routes component
const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />

            <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              {user?.role === 'librarian' ? (
                <LibrarianDashboard />
              ) : (
                <Navigate to="/student" replace />
              )}
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/librarian"
        element={
          <ProtectedRoute requiredRole="librarian">
            <Layout>
              <LibrarianDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/student"
        element={
          <ProtectedRoute requiredRole="student">
            <Layout>
              <StudentDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <div className="app">
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
