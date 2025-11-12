import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save user data
      login(data.user);

      // Redirect based on role
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/generate');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Quick login buttons for testing
  const quickLogin = async (role) => {
    const credentials = role === 'admin' 
      ? { username: 'admin', password: 'admin123' }
      : { username: 'testuser', password: 'test123' };
    
    setUsername(credentials.username);
    setPassword(credentials.password);
    
    // Auto-submit after setting values
    setTimeout(() => {
      const form = document.getElementById('login-form');
      if (form) form.requestSubmit();
    }, 100);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>🔥 AI Feedback Platform</h1>
          <p>Login to start generating and rating content</p>
        </div>

        <Card className="login-card">
          <form id="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="error-message">
                ❌ {error}
              </div>
            )}

            <Button 
              type="submit" 
              fullWidth 
              disabled={loading || !username || !password}
            >
              {loading ? '🔄 Logging in...' : '🚀 Login'}
            </Button>
          </form>

          <div className="quick-login-section">
            <p className="quick-login-title">Quick Login (for testing):</p>
            <div className="quick-login-buttons">
              <Button 
                variant="secondary" 
                size="small"
                onClick={() => quickLogin('user')}
                disabled={loading}
              >
                👤 Login as User
              </Button>
              <Button 
                variant="warning" 
                size="small"
                onClick={() => quickLogin('admin')}
                disabled={loading}
              >
                👑 Login as Admin
              </Button>
            </div>
          </div>
        </Card>

        <div className="login-info">
          <h3>Default Accounts:</h3>
          <ul>
            <li><strong>Admin:</strong> username: <code>admin</code>, password: <code>admin123</code></li>
            <li><strong>User:</strong> username: <code>testuser</code>, password: <code>test123</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
