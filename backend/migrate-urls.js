#!/usr/bin/env node

/**
 * Migration Script - Migrate existing Replicate URLs to permanent Supabase Storage
 * 
 * This script fixes the issue where Replicate URLs expire after 24-48 hours
 * by downloading all existing content and re-uploading to Supabase Storage.
 * 
 * Usage:
 *   node migrate-urls.js
 */

import { initializeStorage, migrateExistingUrls } from './src/services/storage.service.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function main() {
  console.log('');
  console.log('🔄 URL Migration Tool');
  console.log('=====================');
  console.log('');
  console.log('This will migrate all existing Replicate URLs to permanent Supabase Storage.');
  console.log('');
  
  try {
    // Initialize storage
    console.log('📦 Initializing storage...');
    await initializeStorage();
    console.log('');
    
    // Run migration
    console.log('🚀 Starting migration...');
    console.log('');
    
    const result = await migrateExistingUrls();
    
    console.log('');
    console.log('=====================');
    console.log('✅ Migration Complete!');
    console.log('=====================');
    console.log('');
    console.log(`Total URLs found: ${result.total || 0}`);
    console.log(`Successfully migrated: ${result.migrated || 0}`);
    console.log(`Failed: ${result.failed || 0}`);
    console.log('');
    
    if (result.failed > 0) {
      console.log('⚠️  Some URLs failed to migrate. This is normal for already expired URLs.');
      console.log('   Only active URLs can be migrated.');
      console.log('');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ Migration failed:', error.message);
    console.error('');
    process.exit(1);
  }
}

main();

