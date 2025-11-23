# AI Health Assistant

A modern, AI-powered healthcare assistant web application built with Next.js, TypeScript, and Tailwind CSS. This application leverages Google Gemini AI to provide personalized healthcare guidance, symptom checking, and health monitoring.

## Features

### 🤖 Conversational AI
- Powered by Google Gemini for natural language understanding
- Interactive chat interface for health-related queries
- Handles questions about symptoms, medications, diet, and fitness

### 🔍 Symptom Checker
- Enter symptoms and receive potential causes
- Get recommended actions and when to seek medical help
- Includes age, gender, and duration filters for better analysis

### 📋 Health Records
- Securely store and manage health records
- Track appointments, medications, lab results, and more
- Local storage for privacy (data stays on your device)

### 🔔 Reminders & Notifications
- Set medication reminders
- Schedule appointments
- Daily health tips
- Recurring reminder support

### 📱 Responsive Design
- Modern, mobile-friendly UI built with Tailwind CSS
- Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API (Free Tier - using `gemini-2.5-flash` model by default)
- **Icons**: Lucide React
- **Date Utilities**: date-fns

## Free Tier Configuration

This project is configured to work with Google Gemini's **free tier**:
- Uses `gemini-2.5-flash` model by default (latest free tier model)
- You can customize the model via `GEMINI_MODEL_NAME` environment variable
- Includes rate limit error handling
- Free tier has daily request limits (check Google's current limits)
- No premium features required

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-health-assistant
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Google Gemini API key:
```
GOOGLE_GEMINI_API_KEY=your_actual_api_key_here
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ai-health-assistant/
├── app/
│   ├── api/
│   │   ├── chat/              # AI chat API endpoint
│   │   └── symptom-checker/   # Symptom analysis API endpoint
│   ├── chat/                  # AI chat page
│   ├── symptom-checker/       # Symptom checker page
│   ├── health-records/        # Health records page
│   ├── reminders/            # Reminders page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
├── components/
│   └── Navigation.tsx        # Navigation component
├── public/                   # Static assets
└── ...config files
```

## Usage

### AI Chat
Navigate to the "AI Chat" page and start a conversation with the AI assistant. Ask questions about health, symptoms, medications, diet, or fitness.

### Symptom Checker
1. Go to "Symptom Checker"
2. Describe your symptoms
3. Optionally provide age, gender, and duration
4. Click "Analyze Symptoms" to get insights

### Health Records
1. Visit "Health Records"
2. Click "Add Record"
3. Fill in the details (type, date, description, etc.)
4. Your records are stored locally in your browser

### Reminders
1. Go to "Reminders"
2. Click "Add Reminder"
3. Set the type (medication, appointment, health tip)
4. Choose date, time, and optionally set as recurring
5. Mark reminders as complete when done

## Important Notes

### Privacy & Security
- Health records and reminders are stored locally in your browser (localStorage)
- No data is sent to external servers except for AI API calls
- All conversations with the AI are processed through Google Gemini API
- For production use, consider implementing proper backend authentication and database storage

### Medical Disclaimer
**This application is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read or received from this application.**

## Environment Variables

- `GOOGLE_GEMINI_API_KEY`: Your Google Gemini API key (required)
  - Get your free API key from: https://makersuite.google.com/app/apikey
- `GEMINI_MODEL_NAME`: (Optional) Model name to use. Default: `gemini-2.5-flash`
  - Common options: `gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-1.5-pro`, `gemini-pro`
  - Visit `/api/list-models` after starting the server to see available models for your API key

## Free Tier Notes

- **Model**: Uses `gemini-2.5-flash` by default (latest free tier model)
- **Finding Your Model**: If you get a "model not found" error, visit `http://localhost:3000/api/list-models` to see available models
- **Custom Model**: Set `GEMINI_MODEL_NAME` in `.env.local` to use a different model
- **Rate Limits**: Free tier has daily request limits
- **Error Handling**: The app includes rate limit detection and user-friendly error messages
- If you hit rate limits, you'll see a clear message suggesting to try again later

## Building for Production

```bash
npm run build
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on the repository.

