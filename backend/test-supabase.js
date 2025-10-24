const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zllrhtvxdxzkixwbuqyv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsbHJodHZ4ZHh6a2l4d2J1cXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMDgxNzQsImV4cCI6MjA3Njg4NDE3NH0.xgJ-nkvUTQ5YU_xF-yOkeBVoPbUsXAnRbGEOF5kMrOU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔌 Testing Supabase connection...');
    const { data, error } = await supabase.from('_test').select('*').limit(1);
    
    if (error && error.code !== 'PGRST116') {
      console.log('⚠️  Tables not found yet - needs migration');
    } else {
      console.log('✅ Connected to Supabase successfully!');
    }
    
    console.log('📍 URL:', supabaseUrl);
    console.log('✨ Connection is working!');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

testConnection();
