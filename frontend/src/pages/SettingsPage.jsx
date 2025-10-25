import React, { useState, useEffect } from 'react';
import { insightsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';
import Loading from '../components/Loading';
import './SettingsPage.css';

function SettingsPage() {
  const { user } = useAuth();
  const [userId] = useState(user?.id || 'demo-user-123');
  const [userInsights, setUserInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserInsights();
  }, [userId]);

  const loadUserInsights = async () => {
    try {
      setLoading(true);
      const response = await insightsAPI.getUser(userId);
      setUserInsights(response.data);
    } catch (err) {
      console.error('Failed to load user insights:', err);
    } finally {
      setLoading(false);
    }
  };



  const handleResetInsights = async () => {
    if (!window.confirm('Are you sure you want to reset your insights? This will clear all your preferences.')) {
      return;
    }

    try {
      setLoading(true);
      // In a real implementation, you'd call an API endpoint to clear insights
      alert('Insights reset functionality would be implemented here');
      await loadUserInsights();
    } catch (err) {
      console.error('Failed to reset insights:', err);
      alert('Failed to reset insights');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    const data = {
      userId,
      userInsights,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tinder-ai-data-${userId}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1>⚙️ Settings</h1>

        {/* User Profile */}
        <Card title="👤 User Profile" className="settings-card">
          <div className="setting-group">
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>User ID:</strong> <code>{userId}</code></p>
          </div>
        </Card>

        {/* Insights Summary */}
        <Card title="💡 Your Insights Summary" className="settings-card">
          {loading ? (
            <Loading size="small" text="Loading insights..." />
          ) : userInsights ? (
            <div className="insights-summary">
              <div className="insight-stat">
                <span className="stat-label">Total Swipes:</span>
                <span className="stat-value">{userInsights.totalSwipes || 0}</span>
              </div>
              <div className="insight-stat">
                <span className="stat-label">Likes Tracked:</span>
                <span className="stat-value">{userInsights.likes?.length || 0}</span>
              </div>
              <div className="insight-stat">
                <span className="stat-label">Dislikes Tracked:</span>
                <span className="stat-value">{userInsights.dislikes?.length || 0}</span>
              </div>
              <div className="insight-stat">
                <span className="stat-label">Last Updated:</span>
                <span className="stat-value">
                  {userInsights.updatedAt
                    ? new Date(userInsights.updatedAt).toLocaleString()
                    : 'Never'}
                </span>
              </div>
            </div>
          ) : (
            <p className="empty-message">No insights available yet. Start swiping to build your profile!</p>
          )}
        </Card>

        {/* Data Management */}
        <Card title="📊 Data Management" className="settings-card">
          <div className="setting-group">
            <div className="action-buttons">
              <Button 
                variant="secondary" 
                onClick={handleExportData}
                disabled={!userInsights}
              >
                📥 Export My Data
              </Button>
              <Button 
                variant="danger" 
                onClick={handleResetInsights}
                disabled={!userInsights}
              >
                🗑️ Reset Insights
              </Button>
            </div>
            <p className="setting-description">
              Export your data to save a backup, or reset your insights to start fresh with new preferences.
            </p>
          </div>
        </Card>

        {/* About */}
        <Card title="ℹ️ About" className="settings-card">
          <div className="about-content">
            <h3>Tinder AI Feedback Platform</h3>
            <p>
              An AI-powered platform that learns your preferences through Tinder-style swipes
              and generates personalized content based on your feedback.
            </p>
            <div className="tech-stack">
              <h4>Tech Stack:</h4>
              <ul>
                <li>Frontend: React 18</li>
                <li>Backend: Node.js + Express</li>
                <li>Database: PostgreSQL (Supabase)</li>
                <li>AI: OpenAI GPT-4o + Replicate</li>
              </ul>
            </div>
            <div className="version-info">
              <p><strong>Version:</strong> 1.0.0</p>
              <p><strong>Repository:</strong> <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">GitHub</a></p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default SettingsPage;
