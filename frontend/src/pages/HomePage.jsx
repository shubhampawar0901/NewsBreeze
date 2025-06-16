import React from 'react'
import { motion } from 'framer-motion'
import CategorySelector from '../components/CategorySelector'
import VoiceSelector from '../components/VoiceSelector'
import NewsGrid from '../components/NewsGrid'
import AudioPlayer from '../components/AudioPlayer'
import { useNews } from '../context/NewsContext'

const HomePage = () => {
  const { currentArticle, currentAudio } = useNews()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* Hero Section */}
      <motion.div
        variants={itemVariants}
        className="text-center py-12"
      >
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-4xl md:text-6xl font-bold gradient-text mb-6 font-display"
        >
          📻 NewsBreeze
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
        >
          Experience news like never before! Get your daily updates narrated by your favorite 
          celebrity voices. From Morgan Freeman's wisdom to Oprah's warmth - choose your perfect news companion.
        </motion.p>
        
        {/* Feature highlights */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 text-sm text-gray-500"
        >
          <span className="flex items-center space-x-1">
            <span>🎭</span>
            <span>Celebrity Voices</span>
          </span>
          <span className="flex items-center space-x-1">
            <span>📰</span>
            <span>Real-time News</span>
          </span>
          <span className="flex items-center space-x-1">
            <span>🎧</span>
            <span>Audio Experience</span>
          </span>
          <span className="flex items-center space-x-1">
            <span>📱</span>
            <span>Mobile Friendly</span>
          </span>
        </motion.div>
      </motion.div>

      {/* Voice Selection */}
      <motion.div variants={itemVariants}>
        <VoiceSelector />
      </motion.div>

      {/* Category Selection */}
      <motion.div variants={itemVariants}>
        <CategorySelector />
      </motion.div>

      {/* Audio Player (if audio is available) */}
      {currentAudio && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <AudioPlayer />
        </motion.div>
      )}

      {/* News Grid */}
      <motion.div variants={itemVariants}>
        <NewsGrid />
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        variants={itemVariants}
        className="section-container"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center font-display">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              step: '1',
              icon: '🎭',
              title: 'Choose Voice',
              description: 'Select your favorite celebrity voice from our collection of iconic personalities'
            },
            {
              step: '2',
              icon: '📰',
              title: 'Pick Category',
              description: 'Browse news by category: Technology, Sports, Business, Entertainment, and more'
            },
            {
              step: '3',
              icon: '🎧',
              title: 'Generate Audio',
              description: 'Click any article to have it narrated in your chosen celebrity voice'
            },
            {
              step: '4',
              icon: '📱',
              title: 'Listen & Enjoy',
              description: 'Sit back and enjoy your personalized audio news experience'
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <div className="text-4xl mb-4 bounce-gentle">
                {item.icon}
              </div>
              <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 font-display">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        variants={itemVariants}
        className="section-container"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4 font-display">
          ✨ Why Choose NewsBreeze?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">🎯</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Personalized Experience</h4>
                <p className="text-gray-600 text-sm">Choose from multiple celebrity voices and customize your news consumption</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">⚡</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Real-time Updates</h4>
                <p className="text-gray-600 text-sm">Get the latest news as it happens, updated throughout the day</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">🎧</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Hands-free Listening</h4>
                <p className="text-gray-600 text-sm">Perfect for commuting, exercising, or multitasking</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-yellow-600 font-bold">📱</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Mobile Optimized</h4>
                <p className="text-gray-600 text-sm">Seamless experience across all devices and screen sizes</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 font-bold">🌍</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Global Coverage</h4>
                <p className="text-gray-600 text-sm">News from around the world, covering all major topics and regions</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-indigo-600 font-bold">🎭</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Celebrity Voices</h4>
                <p className="text-gray-600 text-sm">Enjoy news narrated by iconic voices you know and love</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default HomePage
