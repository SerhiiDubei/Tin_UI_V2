import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import { testConnection } from './db/supabase.js';

const app = express();

// Middleware
app.use(cors({
  origin: config.cors.origins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Tinder AI Feedback API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      content: '/api/content',
      ratings: '/api/ratings',
      insights: '/api/insights'
    }
  });
});

// Error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Test database connection
    console.log('🔌 Testing database connection...');
    const connected = await testConnection();
    
    if (!connected) {
      console.error('❌ Failed to connect to database. Check your SUPABASE credentials.');
      process.exit(1);
    }
    
    // Start listening
    app.listen(config.port, () => {
      console.log('');
      console.log('🚀 Server started successfully!');
      console.log('');
      console.log(`📡 API running on: http://localhost:${config.port}`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
      console.log(`📊 CORS origins: ${config.cors.origins.join(', ')}`);
      console.log('');
      console.log('Available endpoints:');
      console.log(`  - Health: http://localhost:${config.port}/api/health`);
      console.log(`  - Content: http://localhost:${config.port}/api/content`);
      console.log(`  - Ratings: http://localhost:${config.port}/api/ratings`);
      console.log(`  - Insights: http://localhost:${config.port}/api/insights`);
      console.log('');
      console.log('Press Ctrl+C to stop');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
