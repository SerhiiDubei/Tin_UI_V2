import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Loading from '../components/Loading';
import './AdminPage.css';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [allContent, setAllContent] = useState([]);
  const [allRatings, setAllRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // users, content, ratings
  const { user } = useAuth();

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

      // Load all data
      const [usersRes, contentRes, ratingsRes] = await Promise.all([
        fetch(`${API_URL}/admin/users`).then(r => r.json()),
        fetch(`${API_URL}/content`).then(r => r.json()),
        fetch(`${API_URL}/ratings`).then(r => r.json())
      ]);

      if (usersRes.success) setUsers(usersRes.data || []);
      if (contentRes.success) setAllContent(contentRes.data || []);
      if (ratingsRes.success) setAllRatings(ratingsRes.data || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const getUserStats = (userId) => {
    const userContent = allContent.filter(c => c.user_id === userId);
    const userRatings = allRatings.filter(r => r.user_id === userId);
    return {
      contentCount: userContent.length,
      ratingsCount: userRatings.length,
      likes: userRatings.filter(r => r.direction === 'right').length,
      dislikes: userRatings.filter(r => r.direction === 'left').length
    };
  };

  if (loading) {
    return (
      <div className="admin-page">
        <Loading fullScreen text="Loading admin data..." />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h1>👑 Admin Dashboard</h1>
          <p>Manage users and monitor system activity</p>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview">
          <Card className="stat-card-admin">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{users.length}</div>
            <div className="stat-label">Total Users</div>
          </Card>
          <Card className="stat-card-admin">
            <div className="stat-icon">🖼️</div>
            <div className="stat-value">{allContent.length}</div>
            <div className="stat-label">Total Content</div>
          </Card>
          <Card className="stat-card-admin">
            <div className="stat-icon">⭐</div>
            <div className="stat-value">{allRatings.length}</div>
            <div className="stat-label">Total Ratings</div>
          </Card>
          <Card className="stat-card-admin">
            <div className="stat-icon">📊</div>
            <div className="stat-value">
              {allRatings.length > 0 
                ? `${((allRatings.filter(r => r.direction === 'right').length / allRatings.length) * 100).toFixed(1)}%`
                : '0%'
              }
            </div>
            <div className="stat-label">Like Rate</div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users ({users.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            🖼️ Content ({allContent.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'ratings' ? 'active' : ''}`}
            onClick={() => setActiveTab('ratings')}
          >
            ⭐ Ratings ({allRatings.length})
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card title="👥 Users Management" className="data-card">
            {users.length === 0 ? (
              <p className="empty-message">No users found</p>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Content</th>
                      <th>Ratings</th>
                      <th>Like Rate</th>
                      <th>Created</th>
                      <th>Last Login</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const stats = getUserStats(u.id);
                      const likeRate = stats.ratingsCount > 0 
                        ? ((stats.likes / stats.ratingsCount) * 100).toFixed(1) 
                        : '0';
                      return (
                        <tr key={u.id}>
                          <td>
                            <strong>{u.username}</strong>
                            {u.id === user?.id && <span className="badge me">You</span>}
                          </td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td>{stats.contentCount}</td>
                          <td>{stats.ratingsCount}</td>
                          <td>{likeRate}%</td>
                          <td>{formatDate(u.created_at)}</td>
                          <td>{formatDate(u.last_login_at)}</td>
                          <td>
                            <span className={`badge ${u.is_active ? 'badge-active' : 'badge-inactive'}`}>
                              {u.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <Card title="🖼️ All Generated Content" className="data-card">
            {allContent.length === 0 ? (
              <p className="empty-message">No content generated yet</p>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Preview</th>
                      <th>Prompt</th>
                      <th>User</th>
                      <th>Type</th>
                      <th>Likes</th>
                      <th>Dislikes</th>
                      <th>Superlikes</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allContent.slice(0, 50).map((c) => {
                      const contentUser = users.find(u => u.id === c.user_id);
                      return (
                        <tr key={c.id}>
                          <td>
                            <img 
                              src={c.url} 
                              alt="preview" 
                              className="content-preview"
                            />
                          </td>
                          <td className="prompt-cell">
                            {c.original_prompt || 'N/A'}
                          </td>
                          <td>{contentUser?.username || 'Unknown'}</td>
                          <td>{c.media_type}</td>
                          <td>{c.like_count || 0}</td>
                          <td>{c.dislike_count || 0}</td>
                          <td>{c.superlike_count || 0}</td>
                          <td>{formatDate(c.created_at)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* Ratings Tab */}
        {activeTab === 'ratings' && (
          <Card title="⭐ All Ratings" className="data-card">
            {allRatings.length === 0 ? (
              <p className="empty-message">No ratings yet</p>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Content</th>
                      <th>Direction</th>
                      <th>Comment</th>
                      <th>Latency</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allRatings.slice(0, 100).map((r) => {
                      const ratingUser = users.find(u => u.id === r.user_id);
                      const content = allContent.find(c => c.id === r.content_id);
                      return (
                        <tr key={r.id}>
                          <td>{ratingUser?.username || 'Unknown'}</td>
                          <td className="prompt-cell">
                            {content?.original_prompt || 'N/A'}
                          </td>
                          <td>
                            <span className={`direction-badge direction-${r.direction}`}>
                              {r.direction === 'right' && '👍 Like'}
                              {r.direction === 'left' && '👎 Reject'}
                              {r.direction === 'up' && '⭐ Superlike'}
                              {r.direction === 'down' && '🔄 Reroll'}
                            </span>
                          </td>
                          <td className="comment-cell">
                            {r.comment || '-'}
                          </td>
                          <td>{r.latency_ms ? `${r.latency_ms}ms` : '-'}</td>
                          <td>{formatDate(r.created_at)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
