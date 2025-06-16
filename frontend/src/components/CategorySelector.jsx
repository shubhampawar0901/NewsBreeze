import React from 'react'
import { motion } from 'framer-motion'
import { Grid, TrendingUp } from 'lucide-react'
import { useNews } from '../context/NewsContext'

const CategorySelector = () => {
  const { categories, selectedCategory, setCategory } = useNews()

  const getCategoryIcon = (category) => {
    const icons = {
      general: '📰',
      technology: '💻',
      business: '💼',
      sports: '⚽',
      entertainment: '🎬',
      health: '🏥',
      science: '🔬',
      politics: '🏛️',
      world: '🌍'
    }
    return icons[category] || '📰'
  }

  const getCategoryColor = (category) => {
    const colors = {
      general: 'category-general',
      technology: 'category-technology',
      business: 'category-business',
      sports: 'category-sports',
      entertainment: 'category-entertainment',
      health: 'category-health',
      science: 'category-science',
      politics: 'category-politics',
      world: 'category-world'
    }
    return colors[category] || 'category-general'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="section-container"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Grid className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800 font-display">
            News Categories
          </h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>Choose your interest</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {categories.map((category, index) => (
          <motion.button
            key={category}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCategory(category)}
            className={`category-chip ${
              selectedCategory === category ? 'active' : 'inactive'
            } ${getCategoryColor(category)}`}
          >
            <span className="mr-2">{getCategoryIcon(category)}</span>
            <span className="capitalize font-medium">{category}</span>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
      >
        <h4 className="font-semibold text-yellow-800 mb-2">
          {getCategoryIcon(selectedCategory)} Currently Viewing: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
        </h4>
        <p className="text-yellow-700 text-sm">
          Get the latest {selectedCategory} news narrated by your selected celebrity voice.
        </p>
      </motion.div>
    </motion.div>
  )
}

export default CategorySelector
