# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
GOOGLE_GEMINI_API_KEY=your_api_key_here
```

To get your Google Gemini API key:
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and paste it in your `.env.local` file

## Step 3: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Troubleshooting

### TypeScript Errors Before Installation
If you see TypeScript errors before running `npm install`, this is normal. The errors will resolve after installing dependencies.

### API Key Issues
- Make sure your `.env.local` file is in the root directory
- Restart the development server after adding/changing the API key
- The API key should start with something like `AIza...`

### Port Already in Use
If port 3000 is already in use, Next.js will automatically use the next available port (3001, 3002, etc.).

### Model Not Found Error (404)
If you get a "model not found" error, try these steps:

1. **Check available models**: Visit `http://localhost:3000/api/list-models` (after starting the server) to see which models your API key can access.

2. **Set a specific model**: Add this to your `.env.local` file:
   ```env
   GEMINI_MODEL_NAME=gemini-1.5-pro
   ```
   Common model names to try:
   - `gemini-1.5-pro`
   - `gemini-1.5-flash`
   - `gemini-pro`
   - `gemini-2.0-flash-exp` (experimental)

3. **Restart the server** after changing the model name.

