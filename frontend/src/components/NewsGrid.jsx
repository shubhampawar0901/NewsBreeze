import React from 'react'
import { motion } from 'framer-motion'
import { Clock, User, Play, Loader2, ExternalLink } from 'lucide-react'
import { useNews } from '../context/NewsContext'
import { formatDistanceToNow } from 'date-fns'

const NewsGrid = () => {
  const { 
    articles, 
    loading, 
    generateAudio, 
    selectedVoice, 
    availableVoices 
  } = useNews()

  const handleGenerateAudio = (articleId) => {
    generateAudio(articleId)
  }

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Recently'
    }
  }

  const getSelectedVoiceName = () => {
    return availableVoices.find(v => v.id === selectedVoice)?.name || 'Selected Voice'
  }

  if (loading.articles) {
    return (
      <div className="section-container">
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading latest news...</p>
        </div>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="section-container">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Articles Found</h3>
          <p className="text-gray-600">
            Try selecting a different category or check back later for updates.
          </p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="section-container"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 font-display">
          Latest News
        </h2>
        <div className="text-sm text-gray-500">
          {articles.length} article{articles.length !== 1 ? 's' : ''} available
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <motion.div
            key={article.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="news-card group"
          >
            {/* Article Image */}
            {article.urlToImage && (
              <div className="relative mb-4 overflow-hidden rounded-lg">
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )}

            {/* Article Content */}
            <div className="space-y-3">
              {/* Category Badge */}
              {article.category && (
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {article.category}
                </span>
              )}

              {/* Title */}
              <h3 className="font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {article.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm line-clamp-3">
                {article.description || 'No description available.'}
              </p>

              {/* Meta Information */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-3">
                  {article.author && (
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span className="truncate max-w-20">{article.author}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleGenerateAudio(article.id || index)}
                  disabled={loading.audio}
                  className="btn-voice flex items-center space-x-2 text-sm flex-1"
                >
                  {loading.audio ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  <span>Listen with {getSelectedVoiceName()}</span>
                </motion.button>

                {article.url && (
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More Button (if needed) */}
      {articles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-gray-500 text-sm">
            🎧 Click "Listen" on any article to hear it narrated by {getSelectedVoiceName()}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default NewsGrid
