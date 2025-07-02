import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Checkbox = forwardRef(({ 
  label, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
<label className="flex items-center gap-3 cursor-pointer mobile-touch-target">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only"
            {...props}
          />
          <div className={`
            w-5 h-5 sm:w-6 sm:h-6 border-2 rounded-md transition-all duration-200
            ${props.checked 
              ? 'bg-primary border-primary glow-primary scale-105' 
              : 'border-white/30 hover:border-primary/50'
            }
            ${className}
          `}>
            {props.checked && (
              <ApperIcon 
                name="Check" 
                size={12} 
                className="text-background absolute top-0.5 left-0.5" 
              />
            )}
          </div>
        </div>
{label && (
          <span className="text-sm sm:text-base text-gray-300 select-none">
            {label}
          </span>
        )}
      </label>
      {error && (
        <p className="text-sm text-error ml-8">{error}</p>
      )}
    </div>
  )
})

Checkbox.displayName = 'Checkbox'

export default Checkbox