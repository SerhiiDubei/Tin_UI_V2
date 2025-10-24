-- =====================================================
-- TINDER AI FEEDBACK PLATFORM - DATABASE SCHEMA
-- Version: 1.0.0
-- =====================================================

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE 1: prompt_templates
-- =====================================================

CREATE TABLE prompt_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic info
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT,
  
  -- Prompt configuration
  base_prompt TEXT NOT NULL,
  system_instructions TEXT,
  
  -- Model settings
  model TEXT NOT NULL,
  model_params JSONB DEFAULT '{}',
  
  -- Versioning
  version INTEGER DEFAULT 1,
  active BOOLEAN DEFAULT true,
  
  -- Insights (learned patterns)
  insights_json JSONB DEFAULT '{"likes": [], "dislikes": []}',
  total_uses INTEGER DEFAULT 0,
  avg_like_rate FLOAT DEFAULT 0.0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_prompt_templates_name ON prompt_templates(name);
CREATE INDEX idx_prompt_templates_active ON prompt_templates(active);

-- =====================================================
-- TABLE 2: content
-- =====================================================

CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic data
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'audio', 'text')),
  
  -- Prompts
  original_prompt TEXT NOT NULL,
  enhanced_prompt TEXT,
  final_prompt TEXT,
  
  -- Metadata
  model TEXT NOT NULL,
  meta_json JSONB DEFAULT '{}',
  
  -- Tracing
  template_id UUID REFERENCES prompt_templates(id) ON DELETE SET NULL,
  user_id UUID,
  parent_id UUID REFERENCES content(id) ON DELETE SET NULL,
  
  -- Statistics
  total_ratings INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  dislikes_count INTEGER DEFAULT 0,
  superlikes_count INTEGER DEFAULT 0,
  like_rate FLOAT DEFAULT 0.0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_content_created ON content(created_at DESC);
CREATE INDEX idx_content_user ON content(user_id);
CREATE INDEX idx_content_template ON content(template_id);
CREATE INDEX idx_content_like_rate ON content(like_rate DESC);
CREATE UNIQUE INDEX idx_content_url_unique ON content(url);

-- =====================================================
-- TABLE 3: ratings
-- =====================================================

CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relations
  content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  
  -- Feedback
  direction TEXT NOT NULL CHECK (direction IN ('left', 'right', 'up', 'down')),
  comment TEXT,
  
  -- Metrics
  latency_ms INTEGER,
  user_weight FLOAT DEFAULT 1.0,
  
  -- Metadata
  meta_json JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ratings_content ON ratings(content_id);
CREATE INDEX idx_ratings_user ON ratings(user_id);
CREATE INDEX idx_ratings_direction ON ratings(direction);
CREATE UNIQUE INDEX idx_ratings_user_content_unique ON ratings(user_id, content_id);

-- =====================================================
-- TABLE 4: user_insights
-- =====================================================

CREATE TABLE user_insights (
  user_id UUID PRIMARY KEY,
  
  -- Accumulated patterns
  likes_json JSONB DEFAULT '[]',
  dislikes_json JSONB DEFAULT '[]',
  
  -- Statistics
  total_swipes INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_dislikes INTEGER DEFAULT 0,
  total_superlikes INTEGER DEFAULT 0,
  
  -- Best examples
  gold_content_ids UUID[] DEFAULT ARRAY[]::UUID[],
  
  -- Preferences
  preferences_json JSONB DEFAULT '{}',
  
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Update content stats after rating
CREATE OR REPLACE FUNCTION update_content_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE content
  SET
    total_ratings = (SELECT COUNT(*) FROM ratings WHERE content_id = NEW.content_id),
    likes_count = (SELECT COUNT(*) FROM ratings WHERE content_id = NEW.content_id AND direction = 'right'),
    dislikes_count = (SELECT COUNT(*) FROM ratings WHERE content_id = NEW.content_id AND direction = 'left'),
    superlikes_count = (SELECT COUNT(*) FROM ratings WHERE content_id = NEW.content_id AND direction = 'up'),
    like_rate = CASE
      WHEN (SELECT COUNT(*) FROM ratings WHERE content_id = NEW.content_id) > 0
      THEN (SELECT COUNT(*)::FLOAT FROM ratings WHERE content_id = NEW.content_id AND direction IN ('right', 'up'))
           / (SELECT COUNT(*)::FLOAT FROM ratings WHERE content_id = NEW.content_id)
      ELSE 0.0
    END
  WHERE id = NEW.content_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_content_stats
AFTER INSERT ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_content_stats();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prompt_templates_updated_at
BEFORE UPDATE ON prompt_templates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_insights_updated_at
BEFORE UPDATE ON user_insights
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA
-- =====================================================

INSERT INTO prompt_templates (name, description, category, base_prompt, model, system_instructions)
VALUES (
  'dating_photos_v1',
  'Realistic dating profile photos generator',
  'dating',
  'Generate a realistic dating profile photo of a person. Natural lighting, casual clothing, outdoor setting preferred.',
  'bytedance/seedream-4',
  'You are an expert prompt engineer for photo generation. Create prompts that generate natural, attractive, and realistic dating profile photos. Avoid plastic/artificial look, bad lighting, and fake backgrounds.'
)
ON CONFLICT (name) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Database schema created successfully!';
END $$;
