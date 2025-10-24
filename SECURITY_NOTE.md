# 🔐 Security Notice

## API Keys Rotation Required

⚠️ **IMPORTANT:** API keys were accidentally exposed in commit messages.

### Action Required:
Please rotate the following API keys:
1. Replicate API Token
2. OpenAI API Key  
3. OpenRouter API Key

### How to Rotate Keys:

#### Replicate
1. Go to: https://replicate.com/account/api-tokens
2. Delete old token
3. Create new token
4. Update in `backend/.env`

#### OpenAI
1. Go to: https://platform.openai.com/api-keys
2. Revoke old key
3. Create new key
4. Update in `backend/.env`

#### OpenRouter
1. Go to: https://openrouter.ai/keys
2. Delete old key
3. Create new key
4. Update in `backend/.env`

### After Rotation:
```bash
# Update .env file
nano backend/.env

# Restart server
npm run dev
```

---

**Note:** `.env` files are in `.gitignore` and never committed to Git.
Keys should only be stored locally and in secure environment variable managers.
