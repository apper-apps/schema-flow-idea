import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data available", 
  description = "Get started by adding some content.",
  actionLabel = "Get Started",
  onAction,
  icon = "Database"
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mb-6 glow-primary"
        whileHover={{ scale: 1.05, rotate: 5 }}
        transition={{ duration: 0.3 }}
      >
        <ApperIcon name={icon} size={40} className="text-primary" />
      </motion.div>
      
      <h3 className="text-2xl font-display font-semibold text-white mb-3">
        {title}
      </h3>
      
      <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
        {description}
      </p>
      
      {onAction && (
        <motion.button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-secondary text-background font-semibold rounded-lg hover:opacity-90 transition-all duration-200 glow-primary hover:glow-primary-intense"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Plus" size={18} />
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  )
}

export default Empty