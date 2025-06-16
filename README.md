# 📻 NewsBreeze - Celebrity-Powered Audio News Reader

An innovative news application that transforms written articles into engaging audio experiences using celebrity voice synthesis. Built with modern React frontend and Flask backend for a seamless, responsive user experience.

## ✨ Features

- 🎭 **Celebrity Voice Synthesis** - Choose from iconic voices like Morgan Freeman, Oprah Winfrey, David Attenborough, and more
- 📰 **Real-time News** - Latest articles from multiple categories and sources with live updates
- 🎧 **Full Audio Experience** - Professional audio player with controls, progress tracking, and download options
- 📱 **Modern Responsive UI** - Beautiful React interface with glass morphism effects and smooth animations
- 🔍 **Smart Search** - Find specific news topics and articles quickly
- 📊 **Breaking News Ticker** - Live breaking news updates at the top of the page
- 🎨 **Category Navigation** - Browse news by Technology, Sports, Business, Entertainment, Health, and more
- 🌙 **Accessibility** - Keyboard navigation, screen reader support, and mobile-friendly design

## 🏗️ Architecture

### Frontend (React + Vite)
- **Modern React 18** with hooks and context for state management
- **Tailwind CSS** with custom design system and animations
- **Framer Motion** for smooth transitions and micro-interactions
- **Responsive Design** that works perfectly on all devices
- **Real-time Updates** with automatic news refresh

### Backend (Flask)
- **News Aggregation** from multiple RSS feed sources
- **AI Summarization** using Hugging Face models
- **Voice Synthesis** with Coqui XTTS-v2 for celebrity voices
- **RESTful API** with comprehensive endpoints
- **Caching System** for optimal performance

### AI Models
- **Hugging Face Transformers** (Falconsai/text_summarization)
- **Coqui TTS** (XTTS-v2) for high-quality voice synthesis
- **Voice Cloning** technology for celebrity voice replication

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+ and npm/yarn
- CUDA-capable GPU (recommended for voice synthesis)
- 4GB+ disk space for model downloads
- Internet connection for news feeds

### Backend Setup

1. **Install System Dependencies**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install espeak espeak-data libespeak1 libespeak-dev ffmpeg

# macOS
brew install espeak ffmpeg

# Windows
# Download and install espeak from http://espeak.sourceforge.net/
# Download and install ffmpeg from https://ffmpeg.org/
```

2. **Install Python Dependencies**
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

3. **Start Flask Backend**
```bash
python app.py
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to Frontend Directory**
```bash
cd frontend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Start Development Server**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### First Run
- Models will automatically download on first use (~2GB)
- Voice synthesis may take 10-30 seconds initially
- Generated audio is cached for faster replay

## 🎯 Key Features

### 📰 News Experience
- **Real-time Updates** - Latest articles refreshed automatically
- **Multiple Sources** - BBC, CNN, Reuters, TechCrunch, and more
- **Smart Categories** - Technology, Politics, Sports, Entertainment, Health, Science
- **Breaking News Ticker** - Live updates at the top of the page
- **Search Functionality** - Find specific topics and articles quickly

### 🎭 Celebrity Voices
- **Morgan Freeman** - Deep, authoritative narration perfect for serious news
- **David Attenborough** - Nature documentary style, great for science news
- **Oprah Winfrey** - Warm and engaging delivery for human interest stories
- **Barack Obama** - Presidential, clear delivery for political news
- **Stephen Hawking** - Scientific and thoughtful for technology news

### 🎧 Audio Experience
- **Professional Player** - Full-featured audio controls with progress tracking
- **High Quality** - 22kHz audio output for crystal clear narration
- **Download Options** - Save audio files for offline listening
- **Speed Control** - Adjust playback speed to your preference
- **Volume Control** - Fine-tune audio levels with mute option

### 🎨 Modern UI/UX
- **Glass Morphism** - Beautiful translucent design elements
- **Smooth Animations** - Framer Motion powered transitions
- **Responsive Design** - Perfect experience on desktop, tablet, and mobile
- **Accessibility** - Keyboard navigation and screen reader support
- **Dark/Light Themes** - Comfortable viewing in any lighting condition

## 📁 Project Structure

```
question3_newsbreeze_audio_news/
├── app.py                    # Flask backend server
├── news_fetcher.py          # RSS feed processing
├── summarizer.py            # AI summarization engine
├── voice_synthesizer.py     # Celebrity voice synthesis
├── config.py               # Configuration settings
├── requirements.txt        # Python dependencies
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Header.jsx  # Navigation header
│   │   │   ├── NewsTicker.jsx # Breaking news ticker
│   │   │   ├── VoiceSelector.jsx # Celebrity voice selection
│   │   │   ├── CategorySelector.jsx # News categories
│   │   │   ├── NewsGrid.jsx # Article grid display
│   │   │   ├── AudioPlayer.jsx # Audio playback controls
│   │   │   └── StatusIndicator.jsx # System status
│   │   ├── pages/          # Page components
│   │   │   ├── HomePage.jsx # Main news page
│   │   │   ├── CategoryPage.jsx # Category-specific news
│   │   │   ├── ArticlePage.jsx # Individual article view
│   │   │   └── VoicesPage.jsx # Voice management
│   │   ├── context/        # React context providers
│   │   │   └── NewsContext.jsx # Global state management
│   │   ├── services/       # API and external services
│   │   │   └── api.js      # Backend API client
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # App entry point
│   │   └── index.css       # Global styles and Tailwind
│   ├── package.json        # Node dependencies
│   ├── tailwind.config.js  # Tailwind configuration
│   ├── vite.config.js      # Vite configuration
│   └── index.html          # HTML template
├── models/                 # Downloaded AI models
├── voices/                 # Voice model files
├── cache/                  # News and audio cache
├── audio/                  # Generated audio files
└── test_newsbreeze.py     # Test suite
```

## 🌐 News Sources

- **BBC News** - International and UK news
- **CNN** - Breaking news and politics
- **Reuters** - Global news and business
- **Associated Press** - Wire service news
- **TechCrunch** - Technology and startup news
- **The Guardian** - UK and international news
- **NPR** - Public radio news
- **Wall Street Journal** - Business and finance

## Usage

### 1. Fetch News
- Click "Refresh News" to get latest headlines
- Select news sources and categories
- View article summaries in the feed

### 2. Generate Audio
- Click the "🔊" button next to any article
- Select your preferred celebrity voice
- Wait for audio generation (10-30 seconds)
- Use audio controls to play/pause/download

### 3. Customize Experience
- Switch between light/dark themes
- Adjust audio playback speed
- Filter by news categories
- Select specific news sources

## Performance Notes
- First run will download models (~2GB)
- Voice synthesis takes 10-30 seconds per article
- Generated audio is cached for faster replay
- GPU acceleration recommended for faster synthesis

## API Endpoints
- `GET /` - Main application
- `GET /api/news` - Fetch latest news
- `POST /api/summarize` - Summarize article
- `POST /api/synthesize` - Generate voice audio
- `GET /api/voices` - Available voice models
