#!/bin/bash

# Автоматичний запуск SQL міграції в Supabase
# Використовуй цей скрипт замість ручного копіювання SQL

echo "🗄️  Running Supabase Database Migration..."
echo ""

SUPABASE_URL="https://zllrhtvxdxzkixwbuqyv.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsbHJodHZ4ZHh6a2l4d2J1cXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMDgxNzQsImV4cCI6MjA3Njg4NDE3NH0.xgJ-nkvUTQ5YU_xF-yOkeBVoPbUsXAnRbGEOF5kMrOU"

echo "📍 Supabase URL: $SUPABASE_URL"
echo ""
echo "⚠️  WARNING: This script cannot directly execute SQL migrations."
echo "    Supabase REST API doesn't support arbitrary SQL execution."
echo ""
echo "📝 MANUAL STEPS REQUIRED:"
echo ""
echo "1. Go to: https://supabase.com/dashboard/project/zllrhtvxdxzkixwbuqyv/editor"
echo ""
echo "2. Click 'SQL Editor' in the left sidebar"
echo ""
echo "3. Click 'New query'"
echo ""
echo "4. Copy the SQL from: database/migrations/001_initial_schema.sql"
echo ""
echo "5. Paste and click 'Run'"
echo ""
echo "✅ After running, you should see:"
echo "   - 4 tables created: prompt_templates, content, ratings, user_insights"
echo "   - 1 seed row in prompt_templates"
echo ""
echo "🔗 Direct link to SQL Editor:"
echo "   https://supabase.com/dashboard/project/zllrhtvxdxzkixwbuqyv/editor"
echo ""

# Check if tables exist
echo "🔍 Checking if tables already exist..."
RESPONSE=$(curl -s "${SUPABASE_URL}/rest/v1/prompt_templates?select=count" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}")

if echo "$RESPONSE" | grep -q "error"; then
  echo "❌ Tables not found - migration needed"
  echo ""
  echo "👉 Please follow the manual steps above"
else
  echo "✅ Tables found! Migration already completed."
  echo ""
  echo "📊 Testing connection..."
  curl -s "${SUPABASE_URL}/rest/v1/prompt_templates?select=name" \
    -H "apikey: ${SUPABASE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_KEY}" | jq .
fi

echo ""
echo "Done! 🎉"
