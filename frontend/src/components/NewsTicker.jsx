import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { useNews } from '../context/NewsContext'

const NewsTicker = () => {
  const { articles } = useNews()
  const [tickerNews, setTickerNews] = useState([])

  useEffect(() => {
    // Get breaking news or top headlines for ticker
    const breakingNews = articles
      .filter(article => article.category === 'breaking' || article.priority === 'high')
      .slice(0, 5)
    
    if (breakingNews.length === 0 && articles.length > 0) {
      // Fallback to top articles
      setTickerNews(articles.slice(0, 3))
    } else {
      setTickerNews(breakingNews)
    }
  }, [articles])

  if (tickerNews.length === 0) {
    return null
  }

  return (
    <div className="news-ticker-container">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          {/* Breaking News Label */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-r-lg font-bold text-sm uppercase tracking-wide flex-shrink-0"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Breaking</span>
          </motion.div>

          {/* Ticker Content */}
          <div className="flex-1 overflow-hidden">
            <motion.div
              className="news-ticker-content flex items-center space-x-8"
              animate={{ x: ['100%', '-100%'] }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              {tickerNews.map((article, index) => (
                <span key={index} className="whitespace-nowrap text-white font-medium">
                  {article.title}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsTicker
