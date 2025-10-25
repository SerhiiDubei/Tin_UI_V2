import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { contentAPI } from '../services/api';
import { CONTENT_TYPES, getModelsForType, getDefaultModel } from '../config/models';
import Button from '../components/Button';
import Card from '../components/Card';
import Loading from '../components/Loading';
import './GeneratePage.css';

function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState('image');
  const [modelKey, setModelKey] = useState('seedream-4');
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [myContent, setMyContent] = useState([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const { user } = useAuth();
  const navigate = useNavigate();

  const availableModels = getModelsForType(contentType);

  // Update model when content type changes
  useEffect(() => {
    const defaultModel = getDefaultModel(contentType);
    if (defaultModel) {
      setModelKey(defaultModel);
    }
  }, [contentType]);

  useEffect(() => {
    loadMyContent();
  }, []);

  const loadMyContent = async () => {
    try {
      setLoadingContent(true);
      const response = await contentAPI.list({ userId: user.id, limit: 10 });
      if (response.success && response.content) {
        setMyContent(response.content);
      }
    } catch (err) {
      console.error('Failed to load content:', err);
    } finally {
      setLoadingContent(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Будь ласка, введіть prompt');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setBatchProgress({ current: 0, total: count });

    try {
      const response = await contentAPI.generate(
        prompt, 
        user.id, 
        null, // templateId
        contentType,
        modelKey,
        count
      );
      
      if (response.success) {
        setResult(response);
        setPrompt('');
        await loadMyContent();
      } else {
        throw new Error('Генерація не вдалася');
      }
    } catch (err) {
      setError(err.message || 'Помилка генерації');
    } finally {
      setLoading(false);
      setBatchProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="generate-page">
      <div className="generate-container">
        <div className="generate-header">
          <h1>🎨 Генерація контенту</h1>
          <p>Створюйте AI-контент для оцінки та покращення системи</p>
        </div>

        <Card title="✨ Створити новий контент" className="generate-card">
          {/* Content Type Selector */}
          <div className="form-section">
            <label className="form-label">Тип контенту</label>
            <div className="content-type-grid">
              {CONTENT_TYPES.map(type => (
                <button
                  key={type.value}
                  className={`content-type-btn ${contentType === type.value ? 'active' : ''}`}
                  onClick={() => setContentType(type.value)}
                  disabled={loading}
                >
                  <span className="content-type-icon">{type.icon}</span>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Model Selector */}
          <div className="form-section">
            <label className="form-label">Модель</label>
            <select 
              value={modelKey} 
              onChange={(e) => setModelKey(e.target.value)}
              className="model-select"
              disabled={loading}
            >
              {Object.entries(availableModels).map(([key, model]) => (
                <option key={key} value={key}>
                  {model.name} - {model.speed} ({model.price})
                  {model.isDefault ? ' ⭐' : ''}
                </option>
              ))}
            </select>
            {availableModels[modelKey] && (
              <p className="model-description">
                {availableModels[modelKey].description}
              </p>
            )}
          </div>

          {/* Count Selector */}
          <div className="form-section">
            <label className="form-label">Кількість генерацій</label>
            <div className="count-selector">
              <input
                type="number"
                min="1"
                max="10"
                value={count}
                onChange={(e) => setCount(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                className="count-input"
                disabled={loading}
              />
              <div className="count-buttons">
                {[1, 2, 3, 5].map(num => (
                  <button
                    key={num}
                    className={`count-btn ${count === num ? 'active' : ''}`}
                    onClick={() => setCount(num)}
                    disabled={loading}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            <p className="count-hint">
              💡 Генерація {count} {count === 1 ? 'елемента' : count < 5 ? 'елементів' : 'елементів'}
              {count > 1 && ` (~${count * 60} секунд)`}
            </p>
          </div>

          {/* Prompt Input */}
          <div className="form-section">
            <label className="form-label">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Опишіть що ви хочете згенерувати...

Приклад для зображення: "Красивий захід сонця над горами з яскравими кольорами"
Приклад для відео: "Кіт грається з клубком"
Приклад для аудіо: "Спокійна фонова музика для роботи"`}
              rows={5}
              className="prompt-input"
              disabled={loading}
            />
          </div>

          <div className="generate-actions">
            <Button 
              onClick={handleGenerate} 
              disabled={loading || !prompt.trim()}
              size="large"
            >
              {loading ? `🔄 Генерація... ${batchProgress.current}/${batchProgress.total}` : '🚀 Згенерувати'}
            </Button>
          </div>

          {loading && (
            <div className="generation-progress">
              <Loading text={`Генерація ${contentType}... Це займе ${count > 1 ? `~${count} хвилин` : '30-60 секунд'}`} />
              {count > 1 && (
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="generation-error">
              <strong>❌ Помилка генерації</strong>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="generation-result">
              <h3>✅ Успішно згенеровано!</h3>
              {result.batch ? (
                <p>Створено {result.successful} з {result.total} елементів</p>
              ) : (
                <p>Ваш контент готовий до оцінки</p>
              )}
              <div className="result-actions">
                <Button onClick={() => navigate('/swipe')} variant="success">
                  Перейти до Swipe →
                </Button>
                <Button variant="secondary" onClick={() => setResult(null)}>
                  Згенерувати ще
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* My Content */}
        <Card title="📚 Мій контент" className="my-content-card">
          {loadingContent ? (
            <Loading text="Завантаження..." />
          ) : myContent.length === 0 ? (
            <div className="empty-content">
              <p>🎭 Ви ще не створили контент</p>
            </div>
          ) : (
            <div className="content-grid">
              {myContent.map((item) => (
                <div key={item.id} className="content-item">
                  {item.media_type === 'image' && (
                    <img src={item.url} alt={item.original_prompt} className="content-thumbnail" />
                  )}
                  {item.media_type === 'video' && (
                    <video src={item.url} className="content-thumbnail" controls />
                  )}
                  {item.media_type === 'audio' && (
                    <div className="audio-thumbnail">
                      <span>🎵</span>
                      <audio src={item.url} controls style={{width: '100%', marginTop: '10px'}} />
                    </div>
                  )}
                  <div className="content-item-info">
                    <p className="content-prompt">{item.original_prompt}</p>
                    <p className="content-type-badge">{item.media_type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default GeneratePage;
