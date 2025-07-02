import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = "Something went wrong", onRetry, showRetry = true }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <motion.div
        className="text-center max-w-md mx-auto p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="AlertTriangle" size={32} className="text-error" />
        </div>
        
        <h2 className="text-2xl font-display font-semibold text-white mb-3">
          Oops! Something went wrong
        </h2>
        
        <p className="text-gray-400 mb-6 leading-relaxed">
          {message}
        </p>
        
        {showRetry && onRetry && (
          <motion.button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background font-medium rounded-lg hover:bg-primary/90 transition-all duration-200 glow-primary hover:glow-primary-intense"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ApperIcon name="RefreshCw" size={18} />
            Try Again
          </motion.button>
        )}
      </motion.div>
    </div>
  )
}

export default Error