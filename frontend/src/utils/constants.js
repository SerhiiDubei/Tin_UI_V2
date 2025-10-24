// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const DEFAULT_USER_ID = process.env.REACT_APP_DEFAULT_USER_ID || 'demo-user-123';

// Swipe Directions
export const SWIPE_DIRECTIONS = {
  LEFT: 'left',      // Dislike
  RIGHT: 'right',    // Like
  UP: 'up',          // Superlike
  DOWN: 'down'       // Reroll/Skip
};

// Swipe Direction Labels
export const SWIPE_LABELS = {
  [SWIPE_DIRECTIONS.LEFT]: 'Dislike',
  [SWIPE_DIRECTIONS.RIGHT]: 'Like',
  [SWIPE_DIRECTIONS.UP]: 'Superlike',
  [SWIPE_DIRECTIONS.DOWN]: 'Skip'
};

// Swipe Direction Emojis
export const SWIPE_EMOJIS = {
  [SWIPE_DIRECTIONS.LEFT]: '👈',
  [SWIPE_DIRECTIONS.RIGHT]: '👉',
  [SWIPE_DIRECTIONS.UP]: '👆',
  [SWIPE_DIRECTIONS.DOWN]: '👇'
};

// Media Types
export const MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video'
};

// Insight Update Frequency
export const INSIGHTS_UPDATE_INTERVAL = 10; // Update insights every 10 swipes

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_ID: 'userId',
  THEME: 'theme',
  LAST_VISIT: 'lastVisit'
};

// Routes
export const ROUTES = {
  HOME: '/',
  SWIPE: '/swipe',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NO_CONTENT: 'No more content available.',
  LOAD_FAILED: 'Failed to load data.',
  SAVE_FAILED: 'Failed to save data.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SWIPE_RECORDED: 'Your feedback has been recorded!',
  INSIGHTS_UPDATED: 'Your preferences have been updated!',
  SETTINGS_SAVED: 'Settings saved successfully!'
};
