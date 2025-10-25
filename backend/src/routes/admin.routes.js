import express from 'express';
import { supabase } from '../db/supabase.js';

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

export default router;
