import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import SwipePage from './pages/SwipePage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import { ROUTES } from './utils/constants';
import './App.css';

function Navigation() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="app-navigation">
      <div className="nav-container">
        <Link to={ROUTES.HOME} className="nav-logo" onClick={closeMenu}>
          <span className="logo-icon">🔥</span>
          <span className="logo-text">AI Feedback</span>
        </Link>

        <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
          <Link
            to={ROUTES.SWIPE}
            className={`nav-link ${isActive(ROUTES.SWIPE) ? 'nav-link-active' : ''}`}
            onClick={closeMenu}
          >
            <span className="nav-icon">👆</span>
            <span>Swipe</span>
          </Link>
          <Link
            to={ROUTES.DASHBOARD}
            className={`nav-link ${isActive(ROUTES.DASHBOARD) ? 'nav-link-active' : ''}`}
            onClick={closeMenu}
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link
            to={ROUTES.SETTINGS}
            className={`nav-link ${isActive(ROUTES.SETTINGS) ? 'nav-link-active' : ''}`}
            onClick={closeMenu}
          >
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="app-main">
          <Routes>
            <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.SWIPE} replace />} />
            <Route path={ROUTES.SWIPE} element={<SwipePage />} />
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
            <Route path="*" element={<Navigate to={ROUTES.SWIPE} replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
