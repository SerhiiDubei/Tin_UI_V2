import express from 'express';
import contentRoutes from './content.routes.js';
import ratingsRoutes from './ratings.routes.js';
import insightsRoutes from './insights.routes.js';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Tinder AI Feedback API'
  });
});

// Mount routes
router.use('/content', contentRoutes);
router.use('/ratings', ratingsRoutes);
router.use('/insights', insightsRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

export default router;
