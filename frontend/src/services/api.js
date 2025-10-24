const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Base fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Content API
 */
export const contentAPI = {
  // Generate new content
  generate: (prompt, userId, templateId = null) => {
    return fetchAPI('/content/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, userId, templateId })
    });
  },
  
  // Get content by ID
  getById: (id) => {
    return fetchAPI(`/content/${id}`);
  },
  
  // Get random content for swipe
  getRandom: (userId, excludeIds = []) => {
    const params = new URLSearchParams({ userId });
    if (excludeIds.length > 0) {
      params.append('excludeIds', excludeIds.join(','));
    }
    return fetchAPI(`/content/random/next?${params}`);
  },
  
  // Get content list
  list: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return fetchAPI(`/content?${params}`);
  }
};

/**
 * Ratings API
 */
export const ratingsAPI = {
  // Create rating (swipe)
  create: (contentId, userId, direction, comment = null, latencyMs = null) => {
    return fetchAPI('/ratings', {
      method: 'POST',
      body: JSON.stringify({
        contentId,
        userId,
        direction,
        comment,
        latencyMs
      })
    });
  },
  
  // Get ratings list
  list: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return fetchAPI(`/ratings?${params}`);
  },
  
  // Get rating statistics
  getStats: (userId = null, contentId = null) => {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (contentId) params.append('contentId', contentId);
    return fetchAPI(`/ratings/stats?${params}`);
  }
};

/**
 * Insights API
 */
export const insightsAPI = {
  // Get user insights
  getUser: (userId) => {
    return fetchAPI(`/insights/user/${userId}`);
  },
  
  // Update user insights
  updateUser: (userId) => {
    return fetchAPI(`/insights/user/${userId}/update`, {
      method: 'POST'
    });
  },
  
  // Get dashboard data
  getDashboard: () => {
    return fetchAPI('/insights/dashboard');
  }
};

export default {
  contentAPI,
  ratingsAPI,
  insightsAPI
};
