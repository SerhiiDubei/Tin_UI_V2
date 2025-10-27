import express from 'express';
import { supabase } from '../db/supabase.js';
import { migrateExistingUrls } from '../services/storage.service.js';

const router = express.Router();

/**
 * GET /api/admin/users
 * Get all users (admin only)
 */
router.get('/users', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, full_name, role, is_active, created_at, updated_at, last_login_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/stats
 * Get system statistics
 */
router.get('/stats', async (req, res, next) => {
  try {
    const [usersCount, contentCount, ratingsCount] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('content').select('id', { count: 'exact', head: true }),
      supabase.from('ratings').select('id', { count: 'exact', head: true })
    ]);

    res.json({
      success: true,
      data: {
        users: usersCount.count || 0,
        content: contentCount.count || 0,
        ratings: ratingsCount.count || 0
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/admin/migrate-urls
 * Migrate existing temporary Replicate URLs to permanent Supabase Storage
 * This fixes the issue where URLs expire after 24-48 hours
 */
router.post('/migrate-urls', async (req, res, next) => {
  try {
    console.log('🔄 Starting URL migration...');
    
    const result = await migrateExistingUrls();
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }
    
    res.json({
      success: true,
      message: 'URL migration completed',
      data: {
        total: result.total,
        migrated: result.migrated,
        failed: result.failed
      }
    });
  } catch (error) {
    console.error('Migration error:', error);
    next(error);
  }
});

export default router;
