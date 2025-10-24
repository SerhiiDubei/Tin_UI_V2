#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('\n🚀 Welcome to Tinder AI Feedback Platform Setup!\n');
  console.log('This script will help you configure your environment.\n');

  // Collect configuration
  const config = {
    SUPABASE_URL: await question('Enter your Supabase URL: '),
    SUPABASE_KEY: await question('Enter your Supabase Anon Key: '),
    REPLICATE_API_TOKEN: await question('Enter your Replicate API Token: '),
    OPENAI_API_KEY: await question('Enter your OpenAI API Key: '),
  };

  // Create backend .env file
  const backendEnvPath = path.join(__dirname, '../backend/.env');
  const backendEnvContent = `# Backend Environment Variables
SUPABASE_URL=${config.SUPABASE_URL}
SUPABASE_KEY=${config.SUPABASE_KEY}
REPLICATE_API_TOKEN=${config.REPLICATE_API_TOKEN}
OPENAI_API_KEY=${config.OPENAI_API_KEY}
PORT=5000
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
`;

  fs.writeFileSync(backendEnvPath, backendEnvContent);
  console.log('\n✅ Created backend/.env');

  // Create frontend .env file
  const frontendEnvPath = path.join(__dirname, '../frontend/.env');
  const frontendEnvContent = `# Frontend Environment Variables
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_DEFAULT_USER_ID=demo-user-123
`;

  fs.writeFileSync(frontendEnvPath, frontendEnvContent);
  console.log('✅ Created frontend/.env');

  // Create .env.example files
  const backendEnvExamplePath = path.join(__dirname, '../backend/.env.example');
  const backendEnvExampleContent = `# Backend Environment Variables
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here
REPLICATE_API_TOKEN=your_replicate_token_here
OPENAI_API_KEY=your_openai_key_here
PORT=5000
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
`;

  fs.writeFileSync(backendEnvExamplePath, backendEnvExampleContent);
  console.log('✅ Created backend/.env.example');

  const frontendEnvExamplePath = path.join(__dirname, '../frontend/.env.example');
  const frontendEnvExampleContent = `# Frontend Environment Variables
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_DEFAULT_USER_ID=demo-user-123
`;

  fs.writeFileSync(frontendEnvExamplePath, frontendEnvExampleContent);
  console.log('✅ Created frontend/.env.example');

  console.log('\n📝 Next steps:');
  console.log('1. Run: npm run install:all    # Install all dependencies');
  console.log('2. Set up your database:');
  console.log('   - Go to your Supabase dashboard');
  console.log('   - Run the SQL migration from database/migrations/001_initial_schema.sql');
  console.log('3. Run: npm run dev            # Start both frontend and backend');
  console.log('\n🎉 Setup complete!\n');

  rl.close();
}

setup().catch(error => {
  console.error('\n❌ Setup failed:', error.message);
  rl.close();
  process.exit(1);
});
