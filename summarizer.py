#!/usr/bin/env python3
"""
News Summarizer for NewsBreeze - AI-powered text summarization using Hugging Face models.
"""

import logging
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
import torch
from config import SUMMARIZATION_MODEL, MAX_SUMMARY_LENGTH, MIN_SUMMARY_LENGTH

logger = logging.getLogger(__name__)

class NewsSummarizer:
    """Handles AI-powered text summarization using Hugging Face models."""
    
    def __init__(self):
        self.model_name = SUMMARIZATION_MODEL
        self.pipeline = None
        self.tokenizer = None
        self.model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Using device: {self.device}")
    
    def load_model(self):
        """Load the summarization model."""
        try:
            logger.info(f"Loading summarization model: {self.model_name}")
            
            # Load tokenizer and model
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModelForSeq2SeqLM.from_pretrained(self.model_name)
            
            # Move model to appropriate device
            if self.device == "cuda":
                self.model = self.model.to(self.device)
            
            # Create pipeline
            self.pipeline = pipeline(
                "summarization",
                model=self.model,
                tokenizer=self.tokenizer,
                device=0 if self.device == "cuda" else -1
            )
            
            logger.info("✅ Summarization model loaded successfully")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to load summarization model: {e}")
            return False
    
    def is_ready(self):
        """Check if the model is loaded and ready."""
        return self.pipeline is not None
    
    def summarize(self, text, max_length=None, min_length=None):
        """
        Summarize the given text.
        
        Args:
            text: Input text to summarize
            max_length: Maximum length of summary
            min_length: Minimum length of summary
            
        Returns:
            Summarized text string
        """
        if not self.is_ready():
            logger.info("Model not loaded, loading now...")
            if not self.load_model():
                raise Exception("Failed to load summarization model")
        
        try:
            # Clean and prepare text
            cleaned_text = self._preprocess_text(text)
            
            if len(cleaned_text.split()) < 50:
                logger.info("Text too short for summarization, returning original")
                return cleaned_text
            
            # Set default lengths
            if max_length is None:
                max_length = MAX_SUMMARY_LENGTH
            if min_length is None:
                min_length = MIN_SUMMARY_LENGTH
            
            # Adjust lengths based on input text length
            input_length = len(cleaned_text.split())
            max_length = min(max_length, input_length // 2)
            min_length = min(min_length, max_length - 10)
            
            logger.info(f"Summarizing text ({input_length} words) -> ({min_length}-{max_length} words)")
            
            # Generate summary
            summary_result = self.pipeline(
                cleaned_text,
                max_length=max_length,
                min_length=min_length,
                do_sample=False,
                truncation=True
            )
            
            summary = summary_result[0]['summary_text']
            
            # Post-process summary
            summary = self._postprocess_summary(summary)
            
            logger.info(f"Summary generated: {len(summary.split())} words")
            return summary
            
        except Exception as e:
            logger.error(f"Error during summarization: {e}")
            # Fallback to extractive summarization
            return self._extractive_summary(text)
    
    def _preprocess_text(self, text):
        """Clean and prepare text for summarization."""
        if not text:
            return ""
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        # Remove URLs
        import re
        text = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', text)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        
        # Remove excessive punctuation
        text = re.sub(r'[.]{3,}', '...', text)
        text = re.sub(r'[!]{2,}', '!', text)
        text = re.sub(r'[?]{2,}', '?', text)
        
        # Limit length for model input
        words = text.split()
        if len(words) > 1000:  # Most models have token limits
            text = ' '.join(words[:1000])
        
        return text.strip()
    
    def _postprocess_summary(self, summary):
        """Clean up the generated summary."""
        if not summary:
            return ""
        
        # Ensure proper capitalization
        summary = summary.strip()
        if summary and not summary[0].isupper():
            summary = summary[0].upper() + summary[1:]
        
        # Ensure proper ending punctuation
        if summary and summary[-1] not in '.!?':
            summary += '.'
        
        # Remove redundant phrases
        redundant_phrases = [
            "In this article,",
            "This article discusses",
            "The article states that",
            "According to the article,"
        ]
        
        for phrase in redundant_phrases:
            if summary.startswith(phrase):
                summary = summary[len(phrase):].strip()
                if summary and not summary[0].isupper():
                    summary = summary[0].upper() + summary[1:]
        
        return summary
    
    def _extractive_summary(self, text, num_sentences=3):
        """
        Fallback extractive summarization using sentence ranking.
        """
        try:
            import nltk
            from collections import Counter
            import string
            
            # Download required NLTK data
            try:
                nltk.data.find('tokenizers/punkt')
            except LookupError:
                nltk.download('punkt')
            
            # Tokenize into sentences
            sentences = nltk.sent_tokenize(text)
            
            if len(sentences) <= num_sentences:
                return text
            
            # Simple word frequency-based ranking
            words = text.lower().split()
            words = [word.strip(string.punctuation) for word in words]
            word_freq = Counter(words)
            
            # Score sentences based on word frequency
            sentence_scores = {}
            for sentence in sentences:
                sentence_words = sentence.lower().split()
                sentence_words = [word.strip(string.punctuation) for word in sentence_words]
                score = sum(word_freq[word] for word in sentence_words if word in word_freq)
                sentence_scores[sentence] = score
            
            # Get top sentences
            top_sentences = sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)[:num_sentences]
            
            # Maintain original order
            summary_sentences = []
            for sentence in sentences:
                if any(sentence == top_sent[0] for top_sent in top_sentences):
                    summary_sentences.append(sentence)
                if len(summary_sentences) >= num_sentences:
                    break
            
            return ' '.join(summary_sentences)
            
        except Exception as e:
            logger.error(f"Extractive summarization failed: {e}")
            # Ultimate fallback - return first few sentences
            sentences = text.split('. ')
            return '. '.join(sentences[:3]) + '.'
    
    def batch_summarize(self, texts, max_length=None, min_length=None):
        """
        Summarize multiple texts in batch for efficiency.
        
        Args:
            texts: List of texts to summarize
            max_length: Maximum length of summaries
            min_length: Minimum length of summaries
            
        Returns:
            List of summarized texts
        """
        if not self.is_ready():
            if not self.load_model():
                raise Exception("Failed to load summarization model")
        
        summaries = []
        for text in texts:
            try:
                summary = self.summarize(text, max_length, min_length)
                summaries.append(summary)
            except Exception as e:
                logger.error(f"Error summarizing text: {e}")
                summaries.append(self._extractive_summary(text))
        
        return summaries
    
    def get_model_info(self):
        """Get information about the loaded model."""
        return {
            'model_name': self.model_name,
            'device': self.device,
            'is_ready': self.is_ready(),
            'max_summary_length': MAX_SUMMARY_LENGTH,
            'min_summary_length': MIN_SUMMARY_LENGTH
        }
