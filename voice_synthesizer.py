#!/usr/bin/env python3
"""
Voice Synthesizer for NewsBreeze - Celebrity voice cloning using Coqui TTS.
"""

import os
import logging
import torch
from TTS.api import TTS
from config import VOICE_MODEL, VOICES_DIR, AUDIO_SAMPLE_RATE

logger = logging.getLogger(__name__)

class VoiceSynthesizer:
    """Handles voice synthesis using Coqui TTS with celebrity voice cloning."""
    
    def __init__(self):
        self.model_name = VOICE_MODEL
        self.tts = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.available_voices = self._get_available_voices()
        logger.info(f"Voice synthesis device: {self.device}")
    
    def load_model(self):
        """Load the TTS model."""
        try:
            logger.info(f"Loading TTS model: {self.model_name}")
            
            # Initialize TTS with the specified model
            self.tts = TTS(
                model_name=self.model_name,
                progress_bar=True,
                gpu=(self.device == "cuda")
            )
            
            logger.info("✅ TTS model loaded successfully")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to load TTS model: {e}")
            return False
    
    def is_ready(self):
        """Check if the model is loaded and ready."""
        return self.tts is not None
    
    def synthesize(self, text, voice_name="morgan_freeman", output_path=None):
        """
        Synthesize speech from text using specified voice.
        
        Args:
            text: Text to synthesize
            voice_name: Name of the voice to use
            output_path: Path to save the audio file
            
        Returns:
            Boolean indicating success
        """
        if not self.is_ready():
            logger.info("TTS model not loaded, loading now...")
            if not self.load_model():
                raise Exception("Failed to load TTS model")
        
        try:
            # Get voice configuration
            voice_config = self.available_voices.get(voice_name)
            if not voice_config:
                logger.warning(f"Voice {voice_name} not found, using default")
                voice_name = "morgan_freeman"
                voice_config = self.available_voices[voice_name]
            
            # Prepare text
            cleaned_text = self._prepare_text(text)
            
            logger.info(f"Synthesizing speech with {voice_name} voice...")
            logger.info(f"Text length: {len(cleaned_text)} characters")
            
            # Get speaker reference audio
            speaker_wav = voice_config.get('reference_audio')
            
            if speaker_wav and os.path.exists(speaker_wav):
                # Use voice cloning with reference audio
                self.tts.tts_to_file(
                    text=cleaned_text,
                    speaker_wav=speaker_wav,
                    language="en",
                    file_path=output_path
                )
            else:
                # Use built-in voice or fallback
                logger.warning(f"Reference audio not found for {voice_name}, using fallback")
                self._synthesize_fallback(cleaned_text, output_path)
            
            logger.info(f"✅ Audio generated: {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Voice synthesis failed: {e}")
            return False
    
    def _prepare_text(self, text):
        """Prepare text for speech synthesis."""
        if not text:
            return ""
        
        # Clean up text
        text = text.strip()
        
        # Replace problematic characters
        replacements = {
            '"': '"',
            '"': '"',
            ''': "'",
            ''': "'",
            '—': '-',
            '–': '-',
            '…': '...',
        }
        
        for old, new in replacements.items():
            text = text.replace(old, new)
        
        # Add pauses for better speech flow
        import re
        
        # Add pause after periods
        text = re.sub(r'\.(\s+)([A-Z])', r'.\1\2', text)
        
        # Add pause after commas
        text = re.sub(r',(\s+)', r', ', text)
        
        # Limit length for better synthesis
        if len(text) > 1000:
            # Find a good breaking point
            sentences = text.split('. ')
            truncated = []
            char_count = 0
            
            for sentence in sentences:
                if char_count + len(sentence) > 1000:
                    break
                truncated.append(sentence)
                char_count += len(sentence) + 2
            
            text = '. '.join(truncated)
            if not text.endswith('.'):
                text += '.'
        
        return text
    
    def _synthesize_fallback(self, text, output_path):
        """Fallback synthesis method using built-in voices."""
        try:
            # Use a simpler TTS approach
            self.tts.tts_to_file(
                text=text,
                file_path=output_path
            )
        except Exception as e:
            logger.error(f"Fallback synthesis failed: {e}")
            # Ultimate fallback using system TTS
            self._system_tts_fallback(text, output_path)
    
    def _system_tts_fallback(self, text, output_path):
        """System TTS fallback using espeak or similar."""
        try:
            import subprocess
            
            # Try espeak (Linux/Windows)
            cmd = [
                'espeak',
                '-s', '150',  # Speed
                '-v', 'en+f3',  # Voice
                '-w', output_path,  # Output file
                text
            ]
            
            subprocess.run(cmd, check=True, capture_output=True)
            logger.info("Used espeak fallback for TTS")
            
        except (subprocess.CalledProcessError, FileNotFoundError):
            try:
                # Try say (macOS)
                cmd = ['say', '-o', output_path, '--data-format=LEI16@22050', text]
                subprocess.run(cmd, check=True, capture_output=True)
                logger.info("Used say fallback for TTS")
                
            except (subprocess.CalledProcessError, FileNotFoundError):
                logger.error("No system TTS available")
                raise Exception("All TTS methods failed")
    
    def _get_available_voices(self):
        """Get available voice configurations."""
        voices = {
            "morgan_freeman": {
                "display_name": "Morgan Freeman",
                "description": "Deep, authoritative narration",
                "reference_audio": os.path.join(VOICES_DIR, "morgan_freeman.wav"),
                "language": "en",
                "gender": "male"
            },
            "david_attenborough": {
                "display_name": "David Attenborough",
                "description": "Nature documentary style",
                "reference_audio": os.path.join(VOICES_DIR, "david_attenborough.wav"),
                "language": "en",
                "gender": "male"
            },
            "barack_obama": {
                "display_name": "Barack Obama",
                "description": "Presidential, clear delivery",
                "reference_audio": os.path.join(VOICES_DIR, "barack_obama.wav"),
                "language": "en",
                "gender": "male"
            },
            "emma_watson": {
                "display_name": "Emma Watson",
                "description": "British accent, clear pronunciation",
                "reference_audio": os.path.join(VOICES_DIR, "emma_watson.wav"),
                "language": "en",
                "gender": "female"
            },
            "default": {
                "display_name": "Default Voice",
                "description": "Standard synthetic voice",
                "reference_audio": None,
                "language": "en",
                "gender": "neutral"
            }
        }
        
        # Check which voices have reference audio available
        available = {}
        for voice_id, config in voices.items():
            if voice_id == "default" or (config["reference_audio"] and os.path.exists(config["reference_audio"])):
                available[voice_id] = config
            else:
                logger.info(f"Voice {voice_id} reference audio not found: {config['reference_audio']}")
        
        return available
    
    def get_available_voices(self):
        """Get list of available voices for the API."""
        return [
            {
                "id": voice_id,
                "name": config["display_name"],
                "description": config["description"],
                "language": config["language"],
                "gender": config["gender"],
                "available": config["reference_audio"] is None or os.path.exists(config["reference_audio"])
            }
            for voice_id, config in self.available_voices.items()
        ]
    
    def clone_voice(self, reference_audio_path, voice_name, description="Custom voice"):
        """
        Add a new voice by cloning from reference audio.
        
        Args:
            reference_audio_path: Path to reference audio file
            voice_name: Name for the new voice
            description: Description of the voice
            
        Returns:
            Boolean indicating success
        """
        try:
            if not os.path.exists(reference_audio_path):
                raise Exception("Reference audio file not found")
            
            # Copy reference audio to voices directory
            import shutil
            target_path = os.path.join(VOICES_DIR, f"{voice_name}.wav")
            shutil.copy2(reference_audio_path, target_path)
            
            # Add to available voices
            self.available_voices[voice_name] = {
                "display_name": voice_name.replace('_', ' ').title(),
                "description": description,
                "reference_audio": target_path,
                "language": "en",
                "gender": "unknown"
            }
            
            logger.info(f"✅ Voice {voice_name} cloned successfully")
            return True
            
        except Exception as e:
            logger.error(f"❌ Voice cloning failed: {e}")
            return False
    
    def get_model_info(self):
        """Get information about the TTS model."""
        return {
            "model_name": self.model_name,
            "device": self.device,
            "is_ready": self.is_ready(),
            "available_voices": len(self.available_voices),
            "sample_rate": AUDIO_SAMPLE_RATE
        }
