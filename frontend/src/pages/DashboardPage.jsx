import React, { useState, useEffect } from 'react';
import { insightsAPI, ratingsAPI, contentAPI } from '../services/api';
import './DashboardPage.css';

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [stats, setStats] = useState(null);
  const [topContent, setTopContent] = useState([]);
  const [userInsights, setUserInsights] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const userId = process.env.REACT_APP_DEFAULT_USER_ID || 'demo-user-123';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all dashboard data in parallel
      const [dashboardRes, statsRes, userInsightsRes] = await Promise.all([
        insightsAPI.getDashboard(),
        ratingsAPI.getStats(userId),
        insightsAPI.getUser(userId)
      ]);

      setDashboardData(dashboardRes.data);
      setStats(statsRes.data);
      setUserInsights(userInsightsRes.data);

      // Load top content
      if (dashboardRes.data?.topContent) {
        const contentPromises = dashboardRes.data.topContent.map(item =>
          contentAPI.getById(item.id)
        );
        const contentResults = await Promise.all(contentPromises);
        setTopContent(contentResults.map(res => res.data));
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshInsights = async () => {
    try {
      setRefreshing(true);
      await insightsAPI.updateUser(userId);
      await loadDashboardData();
    } catch (err) {
      console.error('Failed to refresh insights:', err);
      alert('Failed to refresh insights');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <p>{error}</p>
          <button onClick={loadDashboardData}>Retry</button>
        </div>
      </div>
    );
  }

  const likeRate = stats?.likeRate || 0;
  const totalRatings = stats?.totalRatings || 0;
  const totalLikes = Math.round((totalRatings * likeRate) / 100);
  const totalDislikes = totalRatings - totalLikes;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <button 
          className="refresh-button" 
          onClick={handleRefreshInsights}
          disabled={refreshing}
        >
          {refreshing ? '🔄 Refreshing...' : '🔄 Refresh Insights'}
        </button>
      </div>

      {/* Overall Statistics */}
      <section className="dashboard-section">
        <h2>📈 Overall Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🖼️</div>
            <div className="stat-value">{dashboardData?.totalContent || 0}</div>
            <div className="stat-label">Total Content</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👆</div>
            <div className="stat-value">{totalRatings}</div>
            <div className="stat-label">Total Swipes</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❤️</div>
            <div className="stat-value">{totalLikes}</div>
            <div className="stat-label">Total Likes</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💔</div>
            <div className="stat-value">{totalDislikes}</div>
            <div className="stat-label">Total Dislikes</div>
          </div>
          <div className="stat-card highlight">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{likeRate.toFixed(1)}%</div>
            <div className="stat-label">Like Rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value">
              {stats?.avgLatency ? `${(stats.avgLatency / 1000).toFixed(1)}s` : 'N/A'}
            </div>
            <div className="stat-label">Avg Response Time</div>
          </div>
        </div>
      </section>

      {/* User Insights */}
      {userInsights && (
        <section className="dashboard-section">
          <h2>💡 Your Preferences</h2>
          <div className="insights-container">
            <div className="insight-category">
              <h3>👍 You Like</h3>
              <div className="keyword-list">
                {userInsights.likes?.slice(0, 10).map((keyword, idx) => (
                  <span key={idx} className="keyword positive">{keyword}</span>
                )) || <p className="empty-text">No likes yet</p>}
              </div>
            </div>
            <div className="insight-category">
              <h3>👎 You Dislike</h3>
              <div className="keyword-list">
                {userInsights.dislikes?.slice(0, 10).map((keyword, idx) => (
                  <span key={idx} className="keyword negative">{keyword}</span>
                )) || <p className="empty-text">No dislikes yet</p>}
              </div>
            </div>
            <div className="insight-category">
              <h3>💭 Suggestions</h3>
              <div className="keyword-list">
                {userInsights.suggestions?.slice(0, 10).map((keyword, idx) => (
                  <span key={idx} className="keyword neutral">{keyword}</span>
                )) || <p className="empty-text">No suggestions yet</p>}
              </div>
            </div>
          </div>
          <div className="insights-meta">
            <p>
              <strong>Insights based on:</strong> {userInsights.totalSwipes || 0} swipes
            </p>
            <p>
              <strong>Last updated:</strong>{' '}
              {userInsights.updatedAt
                ? new Date(userInsights.updatedAt).toLocaleString()
                : 'Never'}
            </p>
          </div>
        </section>
      )}

      {/* Top Performing Content */}
      {topContent.length > 0 && (
        <section className="dashboard-section">
          <h2>🏆 Top Performing Content</h2>
          <div className="top-content-grid">
            {topContent.map((content) => (
              <div key={content.id} className="content-card">
                <div className="content-image-wrapper">
                  {content.mediaType === 'image' ? (
                    <img src={content.url} alt="Top content" />
                  ) : (
                    <video src={content.url} controls />
                  )}
                </div>
                <div className="content-stats">
                  <div className="content-stat">
                    <span className="stat-emoji">❤️</span>
                    <span>{content.likeCount || 0}</span>
                  </div>
                  <div className="content-stat">
                    <span className="stat-emoji">💔</span>
                    <span>{content.dislikeCount || 0}</span>
                  </div>
                  <div className="content-stat">
                    <span className="stat-emoji">⭐</span>
                    <span>{content.superlikeCount || 0}</span>
                  </div>
                  <div className="content-stat">
                    <span className="stat-emoji">📊</span>
                    <span>
                      {content.totalRatings > 0
                        ? `${((content.likeCount / content.totalRatings) * 100).toFixed(0)}%`
                        : '0%'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Active Templates */}
      {dashboardData?.templates && dashboardData.templates.length > 0 && (
        <section className="dashboard-section">
          <h2>📝 Active Templates</h2>
          <div className="templates-list">
            {dashboardData.templates.map((template) => (
              <div key={template.id} className="template-card">
                <h3>{template.name}</h3>
                <p className="template-description">{template.description}</p>
                <div className="template-stats">
                  <span>📊 {template.contentCount || 0} content items</span>
                  <span>⏱️ Updated {new Date(template.updatedAt).toLocaleDateString()}</span>
                </div>
                {template.likes && template.likes.length > 0 && (
                  <div className="template-insights">
                    <p><strong>Top patterns:</strong></p>
                    <div className="keyword-list">
                      {template.likes.slice(0, 5).map((keyword, idx) => (
                        <span key={idx} className="keyword mini">{keyword}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default DashboardPage;
