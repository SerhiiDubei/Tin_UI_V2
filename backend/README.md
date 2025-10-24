# Backend API

Node.js + Express backend for Tinder AI Feedback Platform.

## Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev

# Start production server
npm start
```

## Environment Variables

See `.env.example` for required variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase anon key
- `REPLICATE_API_TOKEN` - Replicate API token
- `OPENAI_API_KEY` - OpenAI API key

## API Endpoints

### Content
- `POST /api/content/generate` - Generate new content
- `GET /api/content/:id` - Get content by ID
- `GET /api/content` - List content
- `GET /api/content/random/next` - Get random content for swipe

### Ratings
- `POST /api/ratings` - Create rating (swipe)
- `GET /api/ratings` - List ratings
- `GET /api/ratings/stats` - Get rating statistics

### Insights
- `GET /api/insights/user/:userId` - Get user insights
- `POST /api/insights/user/:userId/update` - Update user insights
- `GET /api/insights/template/:templateId` - Get template insights
- `GET /api/insights/dashboard` - Get dashboard analytics

## Tech Stack

- Express.js
- Supabase (PostgreSQL)
- Replicate API
- OpenAI API
