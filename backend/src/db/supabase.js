import { createClient } from '@supabase/supabase-js';
import config from '../config/index.js';

export const supabase = createClient(
  config.supabase.url,
  config.supabase.key
);

// Test connection
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('prompt_templates')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    return false;
  }
}

export default supabase;
