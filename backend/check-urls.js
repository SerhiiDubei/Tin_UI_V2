#!/usr/bin/env node

/**
 * Check URLs in database - see which are temporary vs permanent
 */

import supabase from './src/db/supabase.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function checkUrls() {
  console.log('');
  console.log('🔍 Checking URLs in database...');
  console.log('================================');
  console.log('');
  
  try {
    // Get all content
    const { data: contents, error } = await supabase
      .from('content')
      .select('id, url, type, created_at')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (!contents || contents.length === 0) {
      console.log('No content found in database.');
      return;
    }
    
    // Categorize URLs
    const replicateUrls = contents.filter(c => c.url.includes('replicate.delivery'));
    const supabaseUrls = contents.filter(c => c.url.includes('supabase.co/storage'));
    const otherUrls = contents.filter(c => 
      !c.url.includes('replicate.delivery') && 
      !c.url.includes('supabase.co/storage')
    );
    
    console.log(`📊 Total content items: ${contents.length}`);
    console.log('');
    console.log(`⚠️  Temporary URLs (Replicate): ${replicateUrls.length}`);
    console.log(`✅ Permanent URLs (Supabase): ${supabaseUrls.length}`);
    console.log(`❓ Other URLs: ${otherUrls.length}`);
    console.log('');
    
    if (replicateUrls.length > 0) {
      console.log('⚠️  WARNING: You have temporary Replicate URLs!');
      console.log('   These URLs expire after 24-48 hours.');
      console.log('');
      console.log('📦 Recent Replicate URLs:');
      replicateUrls.slice(0, 5).forEach(c => {
        const age = Math.floor((Date.now() - new Date(c.created_at).getTime()) / (1000 * 60 * 60));
        console.log(`   - ${c.type} (${age}h old) - ${c.url.substring(0, 60)}...`);
      });
      console.log('');
      console.log('🔄 SOLUTION: Run migration to convert to permanent URLs:');
      console.log('   1. node migrate-urls.js');
      console.log('   OR');
      console.log('   2. Admin Panel → "Migrate URLs to Permanent Storage"');
      console.log('');
    }
    
    if (supabaseUrls.length > 0) {
      console.log('✅ You have permanent Supabase Storage URLs:');
      supabaseUrls.slice(0, 3).forEach(c => {
        console.log(`   - ${c.type} - ${c.url.substring(0, 80)}...`);
      });
      console.log('');
    }
    
    // Check for expired URLs (older than 48 hours)
    const now = Date.now();
    const expiredUrls = replicateUrls.filter(c => {
      const age = now - new Date(c.created_at).getTime();
      const hoursOld = age / (1000 * 60 * 60);
      return hoursOld > 48;
    });
    
    if (expiredUrls.length > 0) {
      console.log('❌ EXPIRED URLs (older than 48 hours):');
      console.log(`   ${expiredUrls.length} items cannot be migrated (files deleted by Replicate)`);
      console.log('   These need to be regenerated.');
      console.log('');
    }
    
    console.log('================================');
    console.log('');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkUrls();

