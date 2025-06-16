# Question 3: NewsBreeze - Your Celebrity-Powered Audio News Reader

## Problem Description
Build a news aggregation app that fetches latest headlines via APIs (RSS feeds), summarizes them using Hugging Face models, and reads them aloud in celebrity voices using voice cloning technology.

## Objective
Create NewsBreeze with the following features:
- News aggregation from RSS feeds
- AI-powered headline summarization using Hugging Face models
- Celebrity voice cloning for audio playback
- Clean UI with summaries and audio playback controls

## Solution Features
- **News Fetching**: Multiple RSS feed sources (BBC, CNN, Reuters, etc.)
- **AI Summarization**: Hugging Face Falconsai/text_summarization model
- **Voice Cloning**: Coqui XTTS-v2 for celebrity voice synthesis
- **Audio Playback**: Built-in audio controls with download options
- **Responsive UI**: Modern design with smooth animations
- **Voice Selection**: Multiple celebrity voice options
- **Caching**: Efficient caching for better performance

## Technology Stack
- **Backend**: Python Flask
- **AI Models**: 
  - Hugging Face Transformers (Falconsai/text_summarization)
  - Coqui TTS (XTTS-v2)
- **Frontend**: HTML, CSS, JavaScript
- **News Sources**: RSS feeds from major news outlets
- **Audio**: Web Audio API for playback

## Prerequisites
1. Python 3.8+
2. CUDA-capable GPU (recommended for voice synthesis)
3. Sufficient disk space for model downloads (~2GB)
4. Internet connection for news feeds

## Setup Instructions

### 1. Install System Dependencies
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install espeak espeak-data libespeak1 libespeak-dev
sudo apt install ffmpeg

# macOS
brew install espeak ffmpeg

# Windows
# Download and install espeak from http://espeak.sourceforge.net/
# Download and install ffmpeg from https://ffmpeg.org/
```

### 2. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 3. Download Voice Models (First Run)
The application will automatically download required models on first run:
- Falconsai/text_summarization (~500MB)
- Coqui XTTS-v2 (~1.5GB)

### 4. Run the Application
```bash
python app.py
```

### 5. Open in Browser
Navigate to `http://localhost:5000`

## Features Overview

### News Aggregation
- **Multiple Sources**: BBC, CNN, Reuters, TechCrunch, etc.
- **Real-time Updates**: Automatic refresh every 30 minutes
- **Category Filtering**: Technology, Politics, Sports, Entertainment
- **Source Selection**: Choose specific news sources

### AI Summarization
- **Model**: Falconsai/text_summarization
- **Smart Summarization**: Reduces articles to 2-3 key sentences
- **Batch Processing**: Efficient processing of multiple articles
- **Quality Control**: Filters out low-quality summaries

### Voice Synthesis
- **Celebrity Voices**: Multiple pre-trained voice options
- **High Quality**: 22kHz audio output
- **Fast Generation**: Optimized for real-time synthesis
- **Custom Voices**: Support for custom voice training

### User Interface
- **Modern Design**: Clean, responsive layout
- **Audio Controls**: Play, pause, download, speed control
- **Dark/Light Mode**: Theme switching
- **Mobile Friendly**: Responsive design for all devices

## Available Celebrity Voices
1. **Morgan Freeman** - Deep, authoritative narration
2. **David Attenborough** - Nature documentary style
3. **Barack Obama** - Presidential, clear delivery
4. **Emma Watson** - British accent, clear pronunciation
5. **Custom** - Upload your own voice samples

## News Sources
- BBC News
- CNN
- Reuters
- Associated Press
- TechCrunch
- The Guardian
- NPR
- Wall Street Journal

## File Structure
```
question3_newsbreeze_audio_news/
├── app.py                    # Flask backend
├── news_fetcher.py          # RSS feed processing
├── summarizer.py            # AI summarization
├── voice_synthesizer.py     # Voice cloning
├── static/
│   ├── css/
│   │   └── style.css       # Styling with animations
│   ├── js/
│   │   └── app.js          # Frontend JavaScript
│   └── audio/              # Generated audio files
├── templates/
│   └── index.html          # Main UI
├── models/                 # Downloaded AI models
├── voices/                 # Voice model files
├── cache/                  # News and audio cache
├── requirements.txt        # Dependencies
├── config.py              # Configuration
└── test_newsbreeze.py     # Test suite
```

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
