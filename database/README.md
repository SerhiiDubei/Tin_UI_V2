# 🗄️ Database Documentation

This directory contains all database schemas, migrations, and related documentation.

## 📁 Structure

```
database/
├── migrations/
│   └── 001_initial_schema.sql    # Initial database setup
└── README.md                      # This file
```

## 🚀 Setup Instructions

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose organization and fill in:
   - **Project name**: tinder-ai-feedback (or your choice)
   - **Database password**: (save this securely)
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait for setup to complete

### Step 2: Get API Credentials

Once your project is ready:

1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)
3. Save these for your `.env` file

### Step 3: Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click **Run** button
6. Verify success message appears

### Step 4: Verify Tables Created

Go to **Table Editor** and verify these tables exist:
- ✅ `prompt_templates`
- ✅ `content`
- ✅ `ratings`
- ✅ `user_insights`

You should also see seed data in `prompt_templates` table with `dating_photos_v1` template.

## 📊 Database Schema

### Tables Overview

#### 1. `prompt_templates`
**Purpose**: Stores AI prompt templates that accumulate learned patterns over time.

**Columns**:
- `id` (UUID): Primary key
- `name` (TEXT): Template identifier
- `description` (TEXT): Template description
- `base_prompt` (TEXT): Base prompt text
- `system_instructions` (TEXT): System-level instructions
- `likes` (JSONB): Array of liked keywords/patterns
- `dislikes` (JSONB): Array of disliked keywords/patterns
- `suggestions` (JSONB): Array of user suggestions
- `created_at`, `updated_at` (TIMESTAMP)

**Relationships**:
- One-to-many with `content`

---

#### 2. `content`
**Purpose**: Stores generated content items (images/videos) with metadata.

**Columns**:
- `id` (UUID): Primary key
- `template_id` (UUID): Foreign key to `prompt_templates`
- `original_prompt` (TEXT): User's original prompt
- `enhanced_prompt` (TEXT): AI-enhanced prompt with context
- `url` (TEXT): URL to generated content
- `media_type` (TEXT): 'image' or 'video'
- `generation_params` (JSONB): Model parameters used
- `like_count` (INT): Count of likes
- `dislike_count` (INT): Count of dislikes
- `superlike_count` (INT): Count of superlikes
- `reroll_count` (INT): Count of skips
- `avg_rating` (FLOAT): Average rating score
- `total_ratings` (INT): Total number of ratings
- `created_at` (TIMESTAMP)

**Relationships**:
- Many-to-one with `prompt_templates`
- One-to-many with `ratings`

**Triggers**:
- Auto-updates statistics when ratings are added

---

#### 3. `ratings`
**Purpose**: Stores user feedback (swipes) on content.

**Columns**:
- `id` (UUID): Primary key
- `content_id` (UUID): Foreign key to `content`
- `user_id` (UUID): User identifier
- `direction` (TEXT): Swipe direction ('left', 'right', 'up', 'down')
- `comment` (TEXT): Optional user comment
- `latency_ms` (INT): Response time in milliseconds
- `user_weight` (FLOAT): Weight for learning (default 1.0)
- `created_at` (TIMESTAMP)

**Constraints**:
- CHECK: `direction` must be one of: 'left', 'right', 'up', 'down'
- UNIQUE: `(content_id, user_id)` - prevents duplicate ratings

**Relationships**:
- Many-to-one with `content`

**Indexes**:
- `idx_ratings_user_id` - Fast user lookups
- `idx_ratings_content_id` - Fast content lookups

---

#### 4. `user_insights`
**Purpose**: Stores personalized preference profiles for each user.

**Columns**:
- `user_id` (UUID): Primary key
- `likes` (JSONB): Array of liked keywords/patterns
- `dislikes` (JSONB): Array of disliked keywords/patterns
- `suggestions` (JSONB): Array of suggestions from comments
- `total_swipes` (INT): Total swipe count
- `like_rate` (FLOAT): Percentage of likes
- `updated_at` (TIMESTAMP)

**Update Trigger**: Auto-updates every 10 swipes via backend logic

---

## 🔄 Database Triggers

### 1. `update_content_stats()`
**Purpose**: Automatically updates content statistics when ratings are added.

**Trigger Events**:
- AFTER INSERT on `ratings`
- AFTER UPDATE on `ratings`

**What it does**:
1. Recounts like/dislike/superlike/reroll counts
2. Recalculates average rating
3. Updates total ratings count
4. Updates `updated_at` timestamp

**Example**:
```sql
-- When user swipes right on content
INSERT INTO ratings (content_id, user_id, direction) 
VALUES ('...', 'user-123', 'right');

-- Trigger automatically updates content table:
-- like_count += 1
-- total_ratings += 1
-- avg_rating recalculated
```

---

### 2. `update_updated_at_column()`
**Purpose**: Auto-updates `updated_at` timestamp on row modifications.

**Trigger Events**:
- BEFORE UPDATE on `prompt_templates`
- BEFORE UPDATE on `content`

**What it does**:
- Sets `updated_at = NOW()` whenever row is updated

---

## 🔍 Common Queries

### Get user's swipe statistics
```sql
SELECT 
  user_id,
  COUNT(*) as total_swipes,
  COUNT(*) FILTER (WHERE direction = 'right') as likes,
  COUNT(*) FILTER (WHERE direction = 'left') as dislikes,
  COUNT(*) FILTER (WHERE direction = 'up') as superlikes,
  AVG(latency_ms) as avg_response_time
FROM ratings
WHERE user_id = 'demo-user-123'
GROUP BY user_id;
```

### Get top performing content
```sql
SELECT 
  c.id,
  c.url,
  c.like_count,
  c.total_ratings,
  c.avg_rating,
  (c.like_count::float / NULLIF(c.total_ratings, 0)) * 100 as like_rate
FROM content c
WHERE c.total_ratings > 5
ORDER BY like_rate DESC, c.total_ratings DESC
LIMIT 10;
```

### Get user insights
```sql
SELECT 
  user_id,
  likes,
  dislikes,
  suggestions,
  total_swipes,
  like_rate,
  updated_at
FROM user_insights
WHERE user_id = 'demo-user-123';
```

### Get template with insights
```sql
SELECT 
  t.name,
  t.description,
  t.likes,
  t.dislikes,
  t.suggestions,
  COUNT(c.id) as content_count,
  AVG(c.avg_rating) as avg_content_rating
FROM prompt_templates t
LEFT JOIN content c ON c.template_id = t.id
WHERE t.name = 'dating_photos_v1'
GROUP BY t.id;
```

---

## 🔐 Security Considerations

### Row Level Security (RLS)

For production, enable RLS on sensitive tables:

```sql
-- Enable RLS
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_insights ENABLE ROW LEVEL SECURITY;

-- Allow users to see only their own ratings
CREATE POLICY "Users can view own ratings"
  ON ratings FOR SELECT
  USING (auth.uid()::text = user_id);

-- Allow users to insert their own ratings
CREATE POLICY "Users can insert own ratings"
  ON ratings FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Allow users to view their own insights
CREATE POLICY "Users can view own insights"
  ON user_insights FOR SELECT
  USING (auth.uid()::text = user_id);
```

### API Key Security

- ✅ Use **Anon Key** for client-side (frontend)
- ✅ Use **Service Role Key** for server-side (backend) - has bypass RLS
- ❌ NEVER expose Service Role Key in frontend
- ❌ NEVER commit API keys to version control

---

## 🔄 Migration Strategy

### Adding New Migrations

When you need to modify the database:

1. Create new migration file: `002_your_change_name.sql`
2. Include both UP and DOWN migrations:
   ```sql
   -- UP: Apply changes
   ALTER TABLE content ADD COLUMN new_field TEXT;
   
   -- DOWN: Rollback changes (commented)
   -- ALTER TABLE content DROP COLUMN new_field;
   ```
3. Run via Supabase SQL Editor
4. Document changes in this README

### Best Practices

- ✅ Always backup before running migrations
- ✅ Test migrations on development database first
- ✅ Use transactions for complex migrations
- ✅ Include rollback instructions
- ✅ Document breaking changes

---

## 📈 Performance Optimization

### Indexes

Current indexes:
- `idx_ratings_user_id` - Speed up user lookups
- `idx_ratings_content_id` - Speed up content lookups

### Future Optimizations

If you experience slow queries:

```sql
-- Index on content ratings
CREATE INDEX idx_content_ratings ON content(total_ratings DESC);

-- Index on content creation time
CREATE INDEX idx_content_created ON content(created_at DESC);

-- Composite index for user + timestamp
CREATE INDEX idx_ratings_user_time ON ratings(user_id, created_at DESC);
```

### Query Optimization Tips

- Use `EXPLAIN ANALYZE` to identify slow queries
- Add indexes on frequently queried columns
- Use JSONB indexes for insight fields if needed:
  ```sql
  CREATE INDEX idx_insights_likes ON user_insights USING GIN (likes);
  ```

---

## 🐛 Troubleshooting

### Issue: Tables not appearing

**Solution**:
1. Check SQL ran without errors
2. Refresh Table Editor page
3. Verify you're in correct project
4. Check database logs in Supabase dashboard

### Issue: Triggers not firing

**Solution**:
1. Verify trigger creation didn't error
2. Check trigger is enabled:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname LIKE 'update%';
   ```
3. Re-run trigger creation SQL

### Issue: Seed data missing

**Solution**:
1. Check if `prompt_templates` is empty
2. Re-run just the INSERT statement:
   ```sql
   INSERT INTO prompt_templates (name, description, base_prompt, ...)
   VALUES ('dating_photos_v1', ...);
   ```

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JSONB in PostgreSQL](https://www.postgresql.org/docs/current/datatype-json.html)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🤝 Contributing

When modifying the database schema:

1. Create a new migration file
2. Update this README with changes
3. Test thoroughly in development
4. Document any breaking changes
5. Submit PR with clear description

---

**Last Updated**: 2025-10-24
**Schema Version**: 1.0.0
