import React from 'react'
import { motion } from 'framer-motion'
import { Mic, Star } from 'lucide-react'
import { useNews } from '../context/NewsContext'

const VoiceSelector = () => {
  const { selectedVoice, availableVoices, setVoice } = useNews()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="section-container"
    >
      <div className="flex items-center mb-6">
        <Mic className="w-6 h-6 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800 font-display">
          Choose Your Voice
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {availableVoices.map((voice, index) => (
          <motion.button
            key={voice.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setVoice(voice.id)}
            className={`voice-selector ${selectedVoice === voice.id ? 'selected' : ''}`}
          >
            <div className={`voice-avatar ${selectedVoice === voice.id ? 'selected' : ''} mb-3`}>
              {voice.avatar}
            </div>
            <h3 className="font-semibold text-gray-800 text-sm mb-1">
              {voice.name}
            </h3>
            <p className="text-xs text-gray-600 mb-2">
              {voice.description}
            </p>
            {selectedVoice === voice.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center space-x-1 text-blue-600"
              >
                <Star className="w-3 h-3 fill-current" />
                <span className="text-xs font-medium">Selected</span>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
      >
        <h4 className="font-semibold text-blue-800 mb-2">🎭 Current Selection</h4>
        <p className="text-blue-700 text-sm">
          <strong>{availableVoices.find(v => v.id === selectedVoice)?.name}</strong> - 
          {availableVoices.find(v => v.id === selectedVoice)?.description}
        </p>
      </motion.div>
    </motion.div>
  )
}

export default VoiceSelector
