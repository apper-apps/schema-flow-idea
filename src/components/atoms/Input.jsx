import { forwardRef } from 'react'

const Input = forwardRef(({ 
  label, 
  error, 
  className = '', 
  type = 'text',
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
<input
        ref={ref}
        type={type}
        className={`
          w-full px-3 py-2.5 sm:py-3 bg-surface border border-white/20 rounded-lg 
          text-white placeholder-gray-400 text-sm sm:text-base
          focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 focus:glow-primary
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200 mobile-touch-target
          ${error ? 'border-error focus:border-error focus:ring-error/50' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input