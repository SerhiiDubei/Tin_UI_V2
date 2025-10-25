import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { contentAPI } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Loading from '../components/Loading';
import './GeneratePage.css';

function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [myContent, setMyContent] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadMyContent();
  }, []);

  const loadMyContent = async () => {
    try {
      setLoadingContent(true);
      const response = await contentAPI.list({ userId: user.id, limit: 10 });
      if (response.success && response.data) {
        setMyContent(response.data);
      }
    } catch (err) {
      console.error('Failed to load content:', err);
    } finally {
      setLoadingContent(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await contentAPI.generate(prompt, user.id);
      if (response.success && response.content) {
        setResult(response.content);
        setPrompt('');
        // Reload my content
        await loadMyContent();
      } else {
        throw new Error('Generation failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey && !loading) {
      handleGenerate();
    }
  };

  return (
    <div className="generate-page">
      <div className="generate-container">
        <div className="generate-header">
          <h1>🎨 Generate Content</h1>
          <p>Create AI-generated images to rate and improve the system</p>
        </div>

        {/* Generation Form */}
        <Card title="✨ Create New Content" className="generate-card">
          <div className="generate-form">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe what you want to generate...&#10;&#10;Example: 'A beautiful sunset over mountains with vibrant colors'&#10;&#10;Press Ctrl+Enter to generate"
              rows={5}
              className="prompt-input"
              disabled={loading}
            />
            
            <div className="generate-actions">
              <Button 
                onClick={handleGenerate} 
                disabled={loading || !prompt.trim()}
                size="large"
              >
                {loading ? '🔄 Generating...' : '🚀 Generate'}
              </Button>
              {prompt && !loading && (
                <Button 
                  variant="ghost" 
                  onClick={() => setPrompt('')}
                >
                  Clear
                </Button>
              )}
            </div>

            <p className="generate-hint">
              💡 Tip: Be specific! Include details about colors, style, mood, and composition.
            </p>
          </div>

          {loading && (
            <div className="generation-progress">
              <Loading text="Generating your content... This may take 30-60 seconds" />
              <p className="progress-info">
                The AI is creating your image based on your prompt. Please wait...
              </p>
            </div>
          )}

          {error && (
            <div className="generation-error">
              <strong>❌ Generation Failed</strong>
              <p>{error}</p>
              <Button variant="secondary" onClick={() => setError(null)}>
                Dismiss
              </Button>
            </div>
          )}

          {result && (
            <div className="generation-result">
              <h3>✅ Generated Successfully!</h3>
              <div className="result-preview">
                <img 
                  src={result.url} 
                  alt="Generated content"
                  className="result-image"
                />
              </div>
              <div className="result-info">
                <p><strong>Prompt:</strong> {result.enhanced_prompt || result.original_prompt}</p>
                <p><strong>Model:</strong> {result.model || 'N/A'}</p>
                <p><strong>ID:</strong> {result.id}</p>
              </div>
              <div className="result-actions">
                <Button 
                  onClick={() => navigate('/swipe')}
                  variant="success"
                >
                  Go to Swipe Page →
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => setResult(null)}
                >
                  Generate Another
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* My Generated Content */}
        <Card title="📚 My Generated Content" className="my-content-card">
          {loadingContent ? (
            <Loading text="Loading your content..." />
          ) : myContent.length === 0 ? (
            <div className="empty-content">
              <p>🎭 You haven't generated any content yet</p>
              <p className="empty-hint">Use the form above to create your first AI-generated image!</p>
            </div>
          ) : (
            <div className="content-grid">
              {myContent.map((item) => (
                <div key={item.id} className="content-item">
                  <img 
                    src={item.url} 
                    alt={item.original_prompt}
                    className="content-thumbnail"
                  />
                  <div className="content-item-info">
                    <p className="content-prompt">{item.original_prompt}</p>
                    <div className="content-stats">
                      <span>❤️ {item.like_count || 0}</span>
                      <span>💔 {item.dislike_count || 0}</span>
                      <span>⭐ {item.superlike_count || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Tips */}
        <Card title="💡 Tips for Better Results" className="tips-card">
          <ul className="tips-list">
            <li>🎯 <strong>Be specific:</strong> Include details about what you want</li>
            <li>🎨 <strong>Describe style:</strong> Mention art styles, photography types, etc.</li>
            <li>🌈 <strong>Colors matter:</strong> Specify color palettes or moods</li>
            <li>📸 <strong>Add context:</strong> Describe lighting, time of day, weather</li>
            <li>✨ <strong>Quality keywords:</strong> Use "high quality", "detailed", "professional"</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

export default GeneratePage;
