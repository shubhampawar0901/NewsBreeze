#!/usr/bin/env python3
"""
News Fetcher for NewsBreeze - RSS feed processing and news aggregation.
"""

import feedparser
import requests
from datetime import datetime
import logging
from config import NEWS_SOURCES, REQUEST_TIMEOUT

logger = logging.getLogger(__name__)

class NewsFetcher:
    """Handles fetching news from various RSS sources."""
    
    def __init__(self):
        self.sources = NEWS_SOURCES
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'NewsBreeze/1.0 (News Aggregator)'
        })
    
    def fetch_news(self, sources=None, category=None, max_articles=50):
        """
        Fetch news from RSS feeds.
        
        Args:
            sources: List of source names to fetch from
            category: Category filter
            max_articles: Maximum number of articles to return
            
        Returns:
            List of article dictionaries
        """
        articles = []
        
        # Filter sources if specified
        if sources:
            selected_sources = {k: v for k, v in self.sources.items() if k in sources}
        else:
            selected_sources = self.sources
        
        for source_name, source_config in selected_sources.items():
            try:
                # Skip if category filter doesn't match
                if category and source_config.get('category') != category:
                    continue
                
                logger.info(f"Fetching from {source_name}...")
                source_articles = self._fetch_from_source(source_name, source_config)
                articles.extend(source_articles)
                
            except Exception as e:
                logger.error(f"Error fetching from {source_name}: {e}")
                continue
        
        # Sort by publication date (newest first)
        articles.sort(key=lambda x: x.get('published_date', datetime.min), reverse=True)
        
        # Limit number of articles
        return articles[:max_articles]
    
    def _fetch_from_source(self, source_name, source_config):
        """Fetch articles from a single RSS source."""
        articles = []
        
        try:
            # Fetch RSS feed
            response = self.session.get(
                source_config['url'], 
                timeout=REQUEST_TIMEOUT
            )
            response.raise_for_status()
            
            # Parse RSS feed
            feed = feedparser.parse(response.content)
            
            if feed.bozo:
                logger.warning(f"RSS feed parsing issues for {source_name}")
            
            # Process entries
            for entry in feed.entries[:20]:  # Limit per source
                try:
                    article = self._parse_entry(entry, source_name, source_config)
                    if article:
                        articles.append(article)
                except Exception as e:
                    logger.error(f"Error parsing entry from {source_name}: {e}")
                    continue
            
            logger.info(f"Fetched {len(articles)} articles from {source_name}")
            
        except requests.RequestException as e:
            logger.error(f"Network error fetching {source_name}: {e}")
        except Exception as e:
            logger.error(f"Unexpected error fetching {source_name}: {e}")
        
        return articles
    
    def _parse_entry(self, entry, source_name, source_config):
        """Parse a single RSS entry into article format."""
        try:
            # Extract basic information
            title = getattr(entry, 'title', 'No Title')
            link = getattr(entry, 'link', '')
            description = getattr(entry, 'description', '') or getattr(entry, 'summary', '')
            
            # Parse publication date
            published_date = None
            if hasattr(entry, 'published_parsed') and entry.published_parsed:
                published_date = datetime(*entry.published_parsed[:6])
            elif hasattr(entry, 'updated_parsed') and entry.updated_parsed:
                published_date = datetime(*entry.updated_parsed[:6])
            else:
                published_date = datetime.now()
            
            # Extract author
            author = getattr(entry, 'author', source_config.get('default_author', source_name))
            
            # Extract tags/categories
            tags = []
            if hasattr(entry, 'tags'):
                tags = [tag.term for tag in entry.tags]
            
            # Clean description (remove HTML tags)
            clean_description = self._clean_html(description)
            
            # Create article object
            article = {
                'id': self._generate_article_id(link, title),
                'title': title.strip(),
                'link': link,
                'description': clean_description,
                'source': source_name,
                'source_display': source_config.get('display_name', source_name),
                'author': author,
                'published_date': published_date,
                'category': source_config.get('category', 'General'),
                'tags': tags,
                'image_url': self._extract_image_url(entry),
                'word_count': len(clean_description.split()) if clean_description else 0
            }
            
            # Filter out articles that are too short
            if article['word_count'] < 20:
                return None
            
            return article
            
        except Exception as e:
            logger.error(f"Error parsing entry: {e}")
            return None
    
    def _clean_html(self, html_text):
        """Remove HTML tags from text."""
        if not html_text:
            return ""
        
        import re
        # Remove HTML tags
        clean = re.sub('<.*?>', '', html_text)
        # Remove extra whitespace
        clean = ' '.join(clean.split())
        return clean
    
    def _extract_image_url(self, entry):
        """Extract image URL from RSS entry."""
        # Try different fields where images might be stored
        if hasattr(entry, 'media_content') and entry.media_content:
            return entry.media_content[0].get('url', '')
        
        if hasattr(entry, 'enclosures') and entry.enclosures:
            for enclosure in entry.enclosures:
                if enclosure.type and enclosure.type.startswith('image/'):
                    return enclosure.href
        
        # Look for images in description
        if hasattr(entry, 'description'):
            import re
            img_match = re.search(r'<img[^>]+src="([^"]+)"', entry.description)
            if img_match:
                return img_match.group(1)
        
        return ''
    
    def _generate_article_id(self, link, title):
        """Generate a unique ID for an article."""
        import hashlib
        content = f"{link}_{title}"
        return hashlib.md5(content.encode()).hexdigest()[:12]
    
    def get_sources(self):
        """Get list of available news sources."""
        return [
            {
                'name': name,
                'display_name': config.get('display_name', name),
                'category': config.get('category', 'General'),
                'description': config.get('description', ''),
                'url': config['url']
            }
            for name, config in self.sources.items()
        ]
    
    def test_source(self, source_name):
        """Test if a news source is accessible."""
        if source_name not in self.sources:
            return {'success': False, 'error': 'Source not found'}
        
        try:
            source_config = self.sources[source_name]
            response = self.session.get(source_config['url'], timeout=10)
            response.raise_for_status()
            
            feed = feedparser.parse(response.content)
            article_count = len(feed.entries)
            
            return {
                'success': True,
                'article_count': article_count,
                'feed_title': getattr(feed.feed, 'title', 'Unknown'),
                'last_updated': getattr(feed.feed, 'updated', 'Unknown')
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e)}
