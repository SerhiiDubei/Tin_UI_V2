import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import GeneratePage from './pages/GeneratePage';
import SwipePage from './pages/SwipePage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import './App.css';

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/generate" replace />;
  }

  return children;
}

function Navigation() {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Don't show nav on login page
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <nav className="app-navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <span className="logo-icon">🔥</span>
          <span className="logo-text">AI Feedback</span>
        </Link>

        <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
          <Link
            to="/generate"
            className={`nav-link ${isActive('/generate') ? 'nav-link-active' : ''}`}
            onClick={closeMenu}
          >
            <span className="nav-icon">🎨</span>
            <span>Generate</span>
          </Link>
          <Link
            to="/swipe"
            className={`nav-link ${isActive('/swipe') ? 'nav-link-active' : ''}`}
            onClick={closeMenu}
          >
            <span className="nav-icon">👆</span>
            <span>Swipe</span>
          </Link>
          <Link
            to="/dashboard"
            className={`nav-link ${isActive('/dashboard') ? 'nav-link-active' : ''}`}
            onClick={closeMenu}
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>
          {isAdmin() && (
            <Link
              to="/admin"
              className={`nav-link ${isActive('/admin') ? 'nav-link-active' : ''}`}
              onClick={closeMenu}
            >
              <span className="nav-icon">👑</span>
              <span>Admin</span>
            </Link>
          )}
          <Link
            to="/settings"
            className={`nav-link ${isActive('/settings') ? 'nav-link-active' : ''}`}
            onClick={closeMenu}
          >
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </Link>
          <button
            className="nav-link logout-link"
            onClick={() => {
              logout();
              closeMenu();
            }}
          >
            <span className="nav-icon">🚪</span>
            <span>Logout ({user?.username})</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <div className="app">
      <Navigation />
      <main className="app-main">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/generate" replace />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/generate"
            element={
              <ProtectedRoute>
                <GeneratePage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/swipe"
            element={
              <ProtectedRoute>
                <SwipePage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
