"""
Configuration settings for NewsBreeze - Question 3 Solution
"""

import os

# Directory settings
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CACHE_DIR = os.path.join(BASE_DIR, 'cache')
AUDIO_DIR = os.path.join(BASE_DIR, 'static', 'audio')
MODELS_DIR = os.path.join(BASE_DIR, 'models')
VOICES_DIR = os.path.join(BASE_DIR, 'voices')

# AI Model settings
SUMMARIZATION_MODEL = "Falconsai/text_summarization"
VOICE_MODEL = "tts_models/multilingual/multi-dataset/xtts_v2"

# Summarization settings
MAX_SUMMARY_LENGTH = 150
MIN_SUMMARY_LENGTH = 30

# Voice synthesis settings
AUDIO_SAMPLE_RATE = 22050
VOICE_SPEED = 1.0

# News fetching settings
NEWS_REFRESH_INTERVAL = 30  # minutes
REQUEST_TIMEOUT = 10  # seconds

# News sources configuration
NEWS_SOURCES = {
    "bbc": {
        "url": "http://feeds.bbci.co.uk/news/rss.xml",
        "display_name": "BBC News",
        "category": "General",
        "description": "British Broadcasting Corporation news feed",
        "default_author": "BBC News"
    },
    "cnn": {
        "url": "http://rss.cnn.com/rss/edition.rss",
        "display_name": "CNN",
        "category": "General",
        "description": "Cable News Network international feed",
        "default_author": "CNN"
    },
    "reuters": {
        "url": "https://feeds.reuters.com/reuters/topNews",
        "display_name": "Reuters",
        "category": "General",
        "description": "Reuters top news feed",
        "default_author": "Reuters"
    },
    "techcrunch": {
        "url": "https://feeds.feedburner.com/TechCrunch",
        "display_name": "TechCrunch",
        "category": "Technology",
        "description": "Technology news and startup information",
        "default_author": "TechCrunch"
    },
    "guardian": {
        "url": "https://www.theguardian.com/world/rss",
        "display_name": "The Guardian",
        "category": "General",
        "description": "The Guardian world news",
        "default_author": "The Guardian"
    },
    "npr": {
        "url": "https://feeds.npr.org/1001/rss.xml",
        "display_name": "NPR",
        "category": "General",
        "description": "National Public Radio news",
        "default_author": "NPR"
    },
    "wsj": {
        "url": "https://feeds.a.dj.com/rss/RSSWorldNews.xml",
        "display_name": "Wall Street Journal",
        "category": "Business",
        "description": "Wall Street Journal world news",
        "default_author": "WSJ"
    },
    "ap": {
        "url": "https://feeds.apnews.com/rss/apf-topnews",
        "display_name": "Associated Press",
        "category": "General",
        "description": "Associated Press top news",
        "default_author": "AP"
    }
}

# UI settings
THEME_OPTIONS = ["light", "dark"]
DEFAULT_THEME = "light"

# Audio settings
AUDIO_FORMATS = ["wav", "mp3"]
DEFAULT_AUDIO_FORMAT = "wav"

# Cache settings
CACHE_EXPIRY_HOURS = 24
MAX_CACHE_SIZE_MB = 500

# API rate limiting
MAX_REQUESTS_PER_MINUTE = 60
MAX_SYNTHESIS_REQUESTS_PER_HOUR = 100
