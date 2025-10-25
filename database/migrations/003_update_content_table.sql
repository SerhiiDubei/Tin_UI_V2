-- =====================================================
-- MIGRATION: Update content table for multi-type generation
-- Version: 1.1.0
-- Date: 2025-10-25
-- =====================================================

-- Add media_type column (rename from type for clarity)
ALTER TABLE content RENAME COLUMN type TO media_type;

-- Add generation_params column for storing model parameters
ALTER TABLE content ADD COLUMN IF NOT EXISTS generation_params JSONB DEFAULT '{}';

-- Update check constraint for new content types
ALTER TABLE content DROP CONSTRAINT IF EXISTS content_type_check;
ALTER TABLE content ADD CONSTRAINT content_media_type_check 
  CHECK (media_type IN ('image', 'video', 'audio', 'text'));

-- Add index for media_type
CREATE INDEX IF NOT EXISTS idx_content_media_type ON content(media_type);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Content table updated successfully for multi-type generation!';
END $$;
