#!/usr/bin/env node

// Автоматичне створення таблиць через Supabase API
// Альтернатива ручному запуску SQL у dashboard

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zllrhtvxdxzkixwbuqyv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsbHJodHZ4ZHh6a2l4d2J1cXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMDgxNzQsImV4cCI6MjA3Njg4NDE3NH0.xgJ-nkvUTQ5YU_xF-yOkeBVoPbUsXAnRbGEOF5kMrOU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('🔍 Checking if tables exist...\n');
  
  const tables = ['prompt_templates', 'content', 'ratings', 'user_insights'];
  const results = {};
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        results[table] = '❌ Not found';
      } else {
        results[table] = `✅ Exists (${data || 0} rows)`;
      }
    } catch (err) {
      results[table] = '❌ Error checking';
    }
  }
  
  console.log('📊 Table Status:');
  Object.entries(results).forEach(([table, status]) => {
    console.log(`   ${table}: ${status}`);
  });
  console.log('');
  
  const allExist = Object.values(results).every(status => status.includes('✅'));
  
  if (allExist) {
    console.log('✅ All tables exist! Database is ready.\n');
    
    // Check seed data
    const { data: templates } = await supabase
      .from('prompt_templates')
      .select('name');
    
    if (templates && templates.length > 0) {
      console.log('📝 Prompt templates found:');
      templates.forEach(t => console.log(`   - ${t.name}`));
      console.log('');
    }
    
    return true;
  } else {
    console.log('❌ Some tables are missing. Please run SQL migration.\n');
    console.log('📝 Steps to create tables:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/zllrhtvxdxzkixwbuqyv/editor');
    console.log('   2. Click "SQL Editor"');
    console.log('   3. Click "New query"');
    console.log('   4. Copy SQL from: database/migrations/001_initial_schema.sql');
    console.log('   5. Paste and click "Run"\n');
    return false;
  }
}

async function main() {
  console.log('🚀 Supabase Database Setup Check\n');
  console.log('📍 URL:', supabaseUrl);
  console.log('🔑 API Key:', supabaseKey.substring(0, 20) + '...\n');
  
  try {
    const isReady = await checkTables();
    
    if (isReady) {
      console.log('🎉 Database is fully configured and ready to use!');
      process.exit(0);
    } else {
      console.log('⚠️  Database needs setup. Follow steps above.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
