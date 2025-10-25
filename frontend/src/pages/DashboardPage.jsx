import React, { useState, useEffect } from 'react';
import { insightsAPI, ratingsAPI, contentAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './DashboardPage.css';

function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [stats, setStats] = useState(null);
  const [topContent, setTopContent] = useState([]);
  const [userInsights, setUserInsights] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [myContent, setMyContent] = useState([]);
  const [loadingMyContent, setLoadingMyContent] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [loadingRating, setLoadingRating] = useState(false);

  const userId = user?.id || 'demo-user-123';

  useEffect(() => {
    loadDashboardData();
    loadMyContent();
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

  const loadMyContent = async () => {
    try {
      setLoadingMyContent(true);
      const response = await contentAPI.list({ userId: userId, limit: 50 });
      if (response.success && response.content) {
        setMyContent(response.content);
      }
    } catch (err) {
      console.error('Failed to load my content:', err);
    } finally {
      setLoadingMyContent(false);
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

  const handleContentClick = async (content) => {
    setSelectedContent(content);
    setShowContentModal(true);
    setUserRating(null);
    
    // Load user's rating for this content
    try {
      setLoadingRating(true);
      const response = await ratingsAPI.list({ userId: userId, contentId: content.id, limit: 1 });
      if (response.success && response.ratings && response.ratings.length > 0) {
        setUserRating(response.ratings[0]);
      }
    } catch (err) {
      console.error('Failed to load user rating:', err);
    } finally {
      setLoadingRating(false);
    }
  };

  const handleCloseModal = () => {
    setShowContentModal(false);
    setSelectedContent(null);
    setUserRating(null);
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

      {/* My Content Section */}
      <section className="dashboard-section">
        <h2>📚 Мій контент</h2>
        {loadingMyContent ? (
          <div className="dashboard-loading">
            <div className="spinner"></div>
            <p>Завантаження контенту...</p>
          </div>
        ) : myContent.length === 0 ? (
          <div className="empty-content" style={{ textAlign: 'center', padding: '2rem' }}>
            <p>🎭 Ви ще не створили контент</p>
            <p style={{ marginTop: '0.5rem', color: '#666' }}>Перейдіть на сторінку генерації, щоб створити свій перший контент</p>
          </div>
        ) : (
          <div className="content-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '1rem',
            marginTop: '1rem'
          }}>
            {myContent.map((item) => (
              <div 
                key={item.id} 
                className="content-item"
                onClick={() => handleContentClick(item)}
                style={{
                  cursor: 'pointer',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  backgroundColor: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {(item.type === 'image' || item.media_type === 'image') && (
                  <img 
                    src={item.url} 
                    alt={item.original_prompt} 
                    style={{ 
                      width: '100%', 
                      height: '200px', 
                      objectFit: 'cover' 
                    }} 
                  />
                )}
                {(item.type === 'video' || item.media_type === 'video') && (
                  <video 
                    src={item.url} 
                    style={{ 
                      width: '100%', 
                      height: '200px', 
                      objectFit: 'cover' 
                    }} 
                  />
                )}
                {(item.type === 'audio' || item.media_type === 'audio') && (
                  <div style={{ 
                    width: '100%', 
                    height: '200px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                    fontSize: '3rem'
                  }}>
                    🎵
                  </div>
                )}
                <div style={{ padding: '0.75rem' }}>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    color: '#333'
                  }}>
                    {item.original_prompt || item.prompt}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginTop: '0.5rem',
                    fontSize: '0.75rem',
                    color: '#666'
                  }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#667eea',
                      color: 'white',
                      borderRadius: '4px'
                    }}>
                      {item.type || item.media_type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Content Modal */}
      {showContentModal && selectedContent && (
        <div 
          className="modal-overlay"
          onClick={handleCloseModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}
          >
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1
              }}
            >
              ×
            </button>
            
            <div style={{ padding: '2rem' }}>
              {(selectedContent.type === 'image' || selectedContent.media_type === 'image') && (
                <img 
                  src={selectedContent.url} 
                  alt={selectedContent.original_prompt}
                  style={{ 
                    width: '100%', 
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}
                />
              )}
              {(selectedContent.type === 'video' || selectedContent.media_type === 'video') && (
                <video 
                  src={selectedContent.url} 
                  controls
                  style={{ 
                    width: '100%', 
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}
                />
              )}
              {(selectedContent.type === 'audio' || selectedContent.media_type === 'audio') && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ 
                    padding: '2rem',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontSize: '4rem',
                    marginBottom: '1rem'
                  }}>
                    🎵
                  </div>
                  <audio src={selectedContent.url} controls style={{ width: '100%' }} />
                </div>
              )}
              
              <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Prompt</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>
                {selectedContent.original_prompt || selectedContent.prompt}
              </p>
              
              {selectedContent.enhanced_prompt && (
                <>
                  <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Enhanced Prompt</h3>
                  <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.9rem' }}>
                    {selectedContent.enhanced_prompt}
                  </p>
                </>
              )}
              
              {/* User's Rating */}
              {loadingRating ? (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  backgroundColor: '#f0f0f0',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: 0, color: '#666' }}>Завантаження вашого рейтингу...</p>
                </div>
              ) : userRating ? (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  backgroundColor: userRating.direction === 'right' || userRating.direction === 'up' ? '#e8f5e9' : '#ffebee',
                  borderRadius: '8px',
                  border: `2px solid ${userRating.direction === 'right' || userRating.direction === 'up' ? '#4caf50' : '#f44336'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>
                      {userRating.direction === 'right' && '👍'}
                      {userRating.direction === 'left' && '👎'}
                      {userRating.direction === 'up' && '⭐'}
                      {userRating.direction === 'down' && '🔄'}
                    </span>
                    <strong style={{ color: '#333' }}>
                      Ваша оцінка: {' '}
                      {userRating.direction === 'right' && 'Лайк'}
                      {userRating.direction === 'left' && 'Дизлайк'}
                      {userRating.direction === 'up' && 'Суперлайк'}
                      {userRating.direction === 'down' && 'Reroll'}
                    </strong>
                  </div>
                  {userRating.comment && (
                    <p style={{ 
                      marginTop: '0.5rem', 
                      marginBottom: 0,
                      fontSize: '0.875rem', 
                      color: '#666',
                      fontStyle: 'italic'
                    }}>
                      💬 "{userRating.comment}"
                    </p>
                  )}
                </div>
              ) : (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  backgroundColor: '#fff3e0',
                  borderRadius: '8px',
                  border: '2px dashed #ff9800',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: 0, color: '#666' }}>
                    ℹ️ Ви ще не оцінили цей контент
                  </p>
                </div>
              )}
            
              
              {selectedContent.created_at && (
                <p style={{ 
                  marginTop: '1rem', 
                  fontSize: '0.875rem', 
                  color: '#999',
                  textAlign: 'center'
                }}>
                  Created: {new Date(selectedContent.created_at).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
