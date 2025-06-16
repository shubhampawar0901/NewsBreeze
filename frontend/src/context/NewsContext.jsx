import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { apiService } from '../services/api'

const NewsContext = createContext()

const initialState = {
  // News data
  articles: [],
  categories: ['general', 'technology', 'business', 'sports', 'entertainment', 'health', 'science'],
  selectedCategory: 'general',
  
  // Current article and audio
  currentArticle: null,
  currentAudio: null,
  isPlaying: false,
  
  // Voice settings
  selectedVoice: 'morgan_freeman',
  availableVoices: [
    { id: 'morgan_freeman', name: 'Morgan Freeman', description: 'Wise and authoritative', avatar: 'MF' },
    { id: 'david_attenborough', name: 'David Attenborough', description: 'Nature documentary style', avatar: 'DA' },
    { id: 'oprah_winfrey', name: 'Oprah Winfrey', description: 'Warm and engaging', avatar: 'OW' },
    { id: 'barack_obama', name: 'Barack Obama', description: 'Presidential and inspiring', avatar: 'BO' },
    { id: 'stephen_hawking', name: 'Stephen Hawking', description: 'Scientific and thoughtful', avatar: 'SH' }
  ],
  
  // Loading states
  loading: {
    articles: false,
    audio: false,
    voices: false
  },
  
  // Preferences
  preferences: {
    autoPlay: false,
    playbackSpeed: 1.0,
    showTranscript: true
  },
  
  // System status
  systemStatus: 'checking'
}

function newsReducer(state, action) {
  switch (action.type) {
    case 'SET_SYSTEM_STATUS':
      return { ...state, systemStatus: action.payload }
    
    case 'SET_ARTICLES':
      return { ...state, articles: action.payload }
    
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload }
    
    case 'SET_CURRENT_ARTICLE':
      return { ...state, currentArticle: action.payload }
    
    case 'SET_CURRENT_AUDIO':
      return { ...state, currentAudio: action.payload }
    
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload }
    
    case 'SET_VOICE':
      return { ...state, selectedVoice: action.payload }
    
    case 'SET_AVAILABLE_VOICES':
      return { ...state, availableVoices: action.payload }
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.type]: action.payload.value }
      }
    
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      }
    
    case 'ADD_ARTICLE':
      return {
        ...state,
        articles: [action.payload, ...state.articles]
      }
    
    default:
      return state
  }
}

export function NewsProvider({ children }) {
  const [state, dispatch] = useReducer(newsReducer, initialState)

  // Check system health on mount
  useEffect(() => {
    checkSystemHealth()
    loadArticles()
    loadVoices()
  }, [])

  const checkSystemHealth = async () => {
    try {
      const health = await apiService.checkHealth()
      dispatch({
        type: 'SET_SYSTEM_STATUS',
        payload: health.status === 'healthy' ? 'ready' : 'loading'
      })
    } catch (error) {
      dispatch({ type: 'SET_SYSTEM_STATUS', payload: 'error' })
      toast.error('System health check failed')
    }
  }

  const loadArticles = async (category = 'general') => {
    dispatch({ type: 'SET_LOADING', payload: { type: 'articles', value: true } })
    
    try {
      const result = await apiService.getNews(category)
      if (result.success) {
        dispatch({ type: 'SET_ARTICLES', payload: result.articles })
      } else {
        toast.error('Failed to load news articles')
      }
    } catch (error) {
      toast.error('Failed to load news articles')
      console.error('Load articles error:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { type: 'articles', value: false } })
    }
  }

  const loadVoices = async () => {
    dispatch({ type: 'SET_LOADING', payload: { type: 'voices', value: true } })
    
    try {
      const result = await apiService.getVoices()
      if (result.success) {
        dispatch({ type: 'SET_AVAILABLE_VOICES', payload: result.voices })
      }
    } catch (error) {
      console.error('Failed to load voices:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { type: 'voices', value: false } })
    }
  }

  const setCategory = (category) => {
    dispatch({ type: 'SET_CATEGORY', payload: category })
    loadArticles(category)
  }

  const setVoice = (voiceId) => {
    dispatch({ type: 'SET_VOICE', payload: voiceId })
    toast.success(`Voice changed to ${state.availableVoices.find(v => v.id === voiceId)?.name}`)
  }

  const generateAudio = async (articleId) => {
    const article = state.articles.find(a => a.id === articleId)
    if (!article) {
      toast.error('Article not found')
      return
    }

    dispatch({ type: 'SET_LOADING', payload: { type: 'audio', value: true } })
    dispatch({ type: 'SET_CURRENT_ARTICLE', payload: article })

    try {
      const result = await apiService.generateAudio(articleId, state.selectedVoice)
      
      if (result.success) {
        dispatch({ type: 'SET_CURRENT_AUDIO', payload: result.audio_url })
        
        if (state.preferences.autoPlay) {
          dispatch({ type: 'SET_PLAYING', payload: true })
        }
        
        toast.success('Audio generated successfully!')
      } else {
        toast.error(`Audio generation failed: ${result.error}`)
      }
    } catch (error) {
      toast.error('Audio generation failed. Please try again.')
      console.error('Audio generation error:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { type: 'audio', value: false } })
    }
  }

  const playAudio = () => {
    if (state.currentAudio) {
      dispatch({ type: 'SET_PLAYING', payload: true })
    }
  }

  const pauseAudio = () => {
    dispatch({ type: 'SET_PLAYING', payload: false })
  }

  const updatePreferences = (newPreferences) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: newPreferences })
  }

  const refreshNews = async () => {
    await loadArticles(state.selectedCategory)
    toast.success('News refreshed!')
  }

  const searchNews = async (query) => {
    dispatch({ type: 'SET_LOADING', payload: { type: 'articles', value: true } })
    
    try {
      const result = await apiService.searchNews(query)
      if (result.success) {
        dispatch({ type: 'SET_ARTICLES', payload: result.articles })
      } else {
        toast.error('Search failed')
      }
    } catch (error) {
      toast.error('Search failed')
      console.error('Search error:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { type: 'articles', value: false } })
    }
  }

  const value = {
    ...state,
    setCategory,
    setVoice,
    generateAudio,
    playAudio,
    pauseAudio,
    updatePreferences,
    refreshNews,
    searchNews,
    loadArticles,
    checkSystemHealth
  }

  return (
    <NewsContext.Provider value={value}>
      {children}
    </NewsContext.Provider>
  )
}

export function useNews() {
  const context = useContext(NewsContext)
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider')
  }
  return context
}
