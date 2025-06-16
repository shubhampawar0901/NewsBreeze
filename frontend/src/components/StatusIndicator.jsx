import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Loader2, Radio } from 'lucide-react'

const StatusIndicator = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'ready':
        return {
          icon: CheckCircle,
          text: 'System Ready',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          dotColor: 'bg-green-500'
        }
      case 'loading':
        return {
          icon: Loader2,
          text: 'Loading...',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          dotColor: 'bg-yellow-500'
        }
      case 'error':
        return {
          icon: AlertCircle,
          text: 'System Error',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          dotColor: 'bg-red-500'
        }
      default:
        return {
          icon: Radio,
          text: 'Checking...',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          dotColor: 'bg-gray-500'
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center space-x-2"
    >
      {/* Status Dot */}
      <div className="relative">
        <motion.div
          className={`w-3 h-3 rounded-full ${config.dotColor}`}
          animate={status === 'loading' ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1, repeat: status === 'loading' ? Infinity : 0 }}
        />
        {status === 'ready' && (
          <motion.div
            className="absolute inset-0 w-3 h-3 rounded-full bg-green-400 opacity-75"
            animate={{ scale: [1, 1.5, 1], opacity: [0.75, 0, 0.75] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      {/* Status Text */}
      <div className="hidden sm:flex items-center space-x-1">
        <Icon 
          className={`w-4 h-4 ${config.color} ${status === 'loading' ? 'animate-spin' : ''}`}
        />
        <span className={`text-sm font-medium ${config.color}`}>
          {config.text}
        </span>
      </div>

      {/* Mobile Status Indicator */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`sm:hidden p-2 rounded-full ${config.bgColor}`}
      >
        <Icon 
          className={`w-4 h-4 ${config.color} ${status === 'loading' ? 'animate-spin' : ''}`}
        />
      </motion.div>
    </motion.div>
  )
}

export default StatusIndicator
