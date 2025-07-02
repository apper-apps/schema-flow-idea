import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
const baseClasses = 'inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed mobile-touch-target'
  
  const variants = {
    primary: 'bg-primary text-background hover:bg-primary/90 glow-primary hover:glow-primary-intense active:scale-95',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 glow-secondary active:scale-95',
    accent: 'bg-accent text-background hover:bg-accent/90 glow-accent active:scale-95',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-background hover:glow-primary active:scale-95',
    ghost: 'text-primary hover:bg-primary/10 hover:glow-primary active:scale-95',
    surface: 'bg-surface text-white hover:bg-surface/80 border border-white/10 active:scale-95'
  }
  
  const sizes = {
    sm: 'px-2 py-1.5 text-xs sm:px-3 sm:text-sm min-h-[36px] sm:min-h-[32px]',
    md: 'px-3 py-2 text-sm sm:px-4 sm:py-2.5 sm:text-base min-h-[40px] sm:min-h-[36px]',
    lg: 'px-4 py-2.5 text-base sm:px-6 sm:py-3 sm:text-lg min-h-[44px] sm:min-h-[40px]',
    xl: 'px-6 py-3 text-lg sm:px-8 sm:py-4 sm:text-xl min-h-[48px] sm:min-h-[44px]'
  }
  
  const iconSize = {
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
<motion.button
      className={classes}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {loading ? (
        <>
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          Loading...
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <ApperIcon name={icon} size={iconSize[size]} />
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <ApperIcon name={icon} size={iconSize[size]} />
          )}
        </>
      )}
    </motion.button>
  )
}

export default Button