#!/usr/bin/env python3
"""
NewsBreeze - Celebrity-Powered Audio News Reader - Question 3 Solution
A Flask web application for news aggregation with AI summarization and voice synthesis.
"""

from flask import Flask, render_template, request, jsonify, send_file
import os
import json
import hashlib
import logging
from datetime import datetime, timedelta
from news_fetcher import NewsFetcher
from summarizer import NewsSummarizer
from voice_synthesizer import VoiceSynthesizer
from config import *

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

class NewsBreeze:
    """Main NewsBreeze application service."""
    
    def __init__(self):
        self.news_fetcher = NewsFetcher()
        self.summarizer = NewsSummarizer()
        self.voice_synthesizer = VoiceSynthesizer()
        self.ensure_directories()
        self.cached_news = []
        self.last_fetch = None
    
    def ensure_directories(self):
        """Create necessary directories."""
        for directory in [CACHE_DIR, AUDIO_DIR, MODELS_DIR, VOICES_DIR]:
            if not os.path.exists(directory):
                os.makedirs(directory)
    
    def get_news(self, sources=None, category=None, force_refresh=False):
        """Get news articles with caching."""
        try:
            # Check if we need to refresh
            if (force_refresh or 
                not self.last_fetch or 
                datetime.now() - self.last_fetch > timedelta(minutes=NEWS_REFRESH_INTERVAL)):
                
                logger.info("Fetching fresh news...")
                self.cached_news = self.news_fetcher.fetch_news(sources, category)
                self.last_fetch = datetime.now()
                
                # Cache to file
                cache_file = os.path.join(CACHE_DIR, 'news_cache.json')
                with open(cache_file, 'w', encoding='utf-8') as f:
                    json.dump({
                        'news': self.cached_news,
                        'timestamp': self.last_fetch.isoformat()
                    }, f, indent=2, ensure_ascii=False)
            
            return {
                'success': True,
                'articles': self.cached_news,
                'last_updated': self.last_fetch.isoformat() if self.last_fetch else None,
                'total_articles': len(self.cached_news)
            }
            
        except Exception as e:
            logger.error(f"Error fetching news: {e}")
            return {'success': False, 'error': str(e)}
    
    def summarize_article(self, article_text, article_url=None):
        """Summarize an article with caching."""
        try:
            # Create cache key
            cache_key = hashlib.md5(article_text.encode()).hexdigest()
            cache_file = os.path.join(CACHE_DIR, f'summary_{cache_key}.json')
            
            # Check cache
            if os.path.exists(cache_file):
                with open(cache_file, 'r', encoding='utf-8') as f:
                    cached_data = json.load(f)
                    return {
                        'success': True,
                        'summary': cached_data['summary'],
                        'cached': True
                    }
            
            # Generate new summary
            logger.info("Generating new summary...")
            summary = self.summarizer.summarize(article_text)
            
            # Cache the result
            with open(cache_file, 'w', encoding='utf-8') as f:
                json.dump({
                    'summary': summary,
                    'timestamp': datetime.now().isoformat(),
                    'url': article_url
                }, f, indent=2, ensure_ascii=False)
            
            return {
                'success': True,
                'summary': summary,
                'cached': False
            }
            
        except Exception as e:
            logger.error(f"Error summarizing article: {e}")
            return {'success': False, 'error': str(e)}
    
    def synthesize_voice(self, text, voice_name='morgan_freeman', article_id=None):
        """Synthesize voice audio with caching."""
        try:
            # Create cache key
            text_hash = hashlib.md5(text.encode()).hexdigest()
            cache_key = f"{voice_name}_{text_hash}"
            audio_file = os.path.join(AUDIO_DIR, f"{cache_key}.wav")
            
            # Check if audio already exists
            if os.path.exists(audio_file):
                return {
                    'success': True,
                    'audio_file': f"audio/{cache_key}.wav",
                    'cached': True
                }
            
            # Generate new audio
            logger.info(f"Generating voice audio with {voice_name}...")
            success = self.voice_synthesizer.synthesize(text, voice_name, audio_file)
            
            if success:
                return {
                    'success': True,
                    'audio_file': f"audio/{cache_key}.wav",
                    'cached': False
                }
            else:
                return {'success': False, 'error': 'Voice synthesis failed'}
                
        except Exception as e:
            logger.error(f"Error synthesizing voice: {e}")
            return {'success': False, 'error': str(e)}
    
    def get_available_voices(self):
        """Get list of available voice models."""
        return self.voice_synthesizer.get_available_voices()
    
    def get_news_sources(self):
        """Get list of available news sources."""
        return self.news_fetcher.get_sources()

# Initialize NewsBreeze service
newsbreeze = NewsBreeze()

@app.route('/')
def index():
    """Main page."""
    return render_template('index.html')

@app.route('/api/news')
def get_news():
    """Get news articles."""
    sources = request.args.getlist('sources')
    category = request.args.get('category')
    force_refresh = request.args.get('refresh', 'false').lower() == 'true'
    
    result = newsbreeze.get_news(sources, category, force_refresh)
    return jsonify(result)

@app.route('/api/summarize', methods=['POST'])
def summarize():
    """Summarize article text."""
    try:
        data = request.get_json()
        article_text = data.get('text', '')
        article_url = data.get('url', '')
        
        if not article_text.strip():
            return jsonify({'success': False, 'error': 'No text provided'})
        
        result = newsbreeze.summarize_article(article_text, article_url)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in summarize endpoint: {e}")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/synthesize', methods=['POST'])
def synthesize():
    """Synthesize voice audio."""
    try:
        data = request.get_json()
        text = data.get('text', '')
        voice_name = data.get('voice', 'morgan_freeman')
        article_id = data.get('article_id')
        
        if not text.strip():
            return jsonify({'success': False, 'error': 'No text provided'})
        
        result = newsbreeze.synthesize_voice(text, voice_name, article_id)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in synthesize endpoint: {e}")
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/voices')
def get_voices():
    """Get available voice models."""
    voices = newsbreeze.get_available_voices()
    return jsonify({'voices': voices})

@app.route('/api/sources')
def get_sources():
    """Get available news sources."""
    sources = newsbreeze.get_news_sources()
    return jsonify({'sources': sources})

@app.route('/audio/<filename>')
def serve_audio(filename):
    """Serve audio files."""
    try:
        audio_path = os.path.join(AUDIO_DIR, filename)
        if os.path.exists(audio_path):
            return send_file(audio_path, mimetype='audio/wav')
        else:
            return jsonify({'error': 'Audio file not found'}), 404
    except Exception as e:
        logger.error(f"Error serving audio: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/health')
def health_check():
    """Health check endpoint."""
    try:
        # Check if models are loaded
        summarizer_ready = newsbreeze.summarizer.is_ready()
        voice_ready = newsbreeze.voice_synthesizer.is_ready()
        
        return jsonify({
            'status': 'healthy',
            'summarizer_ready': summarizer_ready,
            'voice_synthesizer_ready': voice_ready,
            'available_voices': len(newsbreeze.get_available_voices()),
            'cached_articles': len(newsbreeze.cached_news)
        })
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        })

if __name__ == '__main__':
    logger.info("Starting NewsBreeze application...")
    
    # Initialize models in background
    try:
        logger.info("Initializing AI models...")
        newsbreeze.summarizer.load_model()
        newsbreeze.voice_synthesizer.load_model()
        logger.info("✅ Models loaded successfully")
    except Exception as e:
        logger.warning(f"⚠️  Model loading failed: {e}")
        logger.info("Models will be loaded on first use")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
