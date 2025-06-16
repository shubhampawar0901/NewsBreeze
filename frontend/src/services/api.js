import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 1 minute for audio generation
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message)
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.')
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Audio generation might take longer than expected.')
    }
    
    throw error
  }
)

export const apiService = {
  // Health check
  async checkHealth() {
    try {
      const response = await api.get('/api/health')
      return response.data
    } catch (error) {
      throw new Error('Health check failed')
    }
  },

  // Get news articles
  async getNews(category = 'general') {
    try {
      const response = await api.get('/api/news', {
        params: { category }
      })
      return response.data
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error)
      }
      throw new Error('Failed to get news articles')
    }
  },

  // Search news
  async searchNews(query) {
    try {
      const response = await api.get('/api/search', {
        params: { q: query }
      })
      return response.data
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error)
      }
      throw new Error('Failed to search news')
    }
  },

  // Get available voices
  async getVoices() {
    try {
      const response = await api.get('/api/voices')
      return response.data
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error)
      }
      throw new Error('Failed to get available voices')
    }
  },

  // Generate audio for article
  async generateAudio(articleId, voiceId) {
    try {
      const response = await api.post('/api/generate-audio', {
        article_id: articleId,
        voice_id: voiceId
      })
      return response.data
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error)
      }
      throw new Error('Failed to generate audio')
    }
  },

  // Get article by ID
  async getArticle(articleId) {
    try {
      const response = await api.get(`/api/article/${articleId}`)
      return response.data
    } catch (error) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error)
      }
      throw new Error('Failed to get article')
    }
  },

  // Get trending articles
  async getTrending() {
    try {
      const response = await api.get('/api/trending')
      return response.data
    } catch (error) {
      console.error('Failed to get trending articles:', error)
      return { success: false, articles: [] }
    }
  },

  // Get breaking news
  async getBreakingNews() {
    try {
      const response = await api.get('/api/breaking')
      return response.data
    } catch (error) {
      console.error('Failed to get breaking news:', error)
      return { success: false, articles: [] }
    }
  },

  // Save user preferences
  async savePreferences(preferences) {
    try {
      const response = await api.post('/api/preferences', {
        preferences
      })
      return response.data
    } catch (error) {
      console.error('Failed to save preferences:', error)
      return { success: false }
    }
  },

  // Get user preferences
  async getPreferences() {
    try {
      const response = await api.get('/api/preferences')
      return response.data
    } catch (error) {
      console.error('Failed to get preferences:', error)
      return { success: false, preferences: {} }
    }
  },

  // Get audio file
  async getAudio(audioId) {
    try {
      const response = await api.get(`/audio/${audioId}`, {
        responseType: 'blob'
      })
      return URL.createObjectURL(response.data)
    } catch (error) {
      throw new Error('Failed to get audio file')
    }
  },

  // Get categories
  async getCategories() {
    try {
      const response = await api.get('/api/categories')
      return response.data
    } catch (error) {
      console.error('Failed to get categories:', error)
      return { 
        success: true, 
        categories: ['general', 'technology', 'business', 'sports', 'entertainment', 'health', 'science'] 
      }
    }
  },

  // Get news statistics
  async getStats() {
    try {
      const response = await api.get('/api/stats')
      return response.data
    } catch (error) {
      console.error('Failed to get stats:', error)
      return { success: false, stats: {} }
    }
  },

  // Submit feedback
  async submitFeedback(feedback) {
    try {
      const response = await api.post('/api/feedback', {
        feedback
      })
      return response.data
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      return { success: false }
    }
  },

  // Get popular voices
  async getPopularVoices() {
    try {
      const response = await api.get('/api/popular-voices')
      return response.data
    } catch (error) {
      console.error('Failed to get popular voices:', error)
      return { success: false, voices: [] }
    }
  },

  // Download audio
  async downloadAudio(audioId, filename) {
    try {
      const response = await api.get(`/api/download-audio/${audioId}`, {
        responseType: 'blob'
      })

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename || `news-audio-${audioId}.mp3`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      return { success: true }
    } catch (error) {
      throw new Error('Failed to download audio')
    }
  },

  // Share article
  async shareArticle(articleId, platform) {
    try {
      const response = await api.post('/api/share', {
        article_id: articleId,
        platform
      })
      return response.data
    } catch (error) {
      console.error('Failed to share article:', error)
      return { success: false }
    }
  }
}

export default api
