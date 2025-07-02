import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Toolbar = ({ 
  onAddTable, 
  onSave, 
  onLoad, 
  onExport, 
  onZoomIn, 
  onZoomOut, 
  onZoomReset,
  onClear,
  zoom = 100,
  hasUnsavedChanges = false 
}) => {
  return (
    <motion.div
      className="glass border-b border-white/10 p-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="flex items-center mr-6">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg mr-3 glow-primary"></div>
            <h1 className="text-xl font-display font-bold text-white">Schema Flow</h1>
          </div>
          
          <Button 
            variant="accent" 
            icon="Plus" 
            onClick={onAddTable}
            className="mr-4"
          >
            Add Table
          </Button>
          
          <div className="flex items-center gap-1 mr-4">
            <Button variant="ghost" icon="Save" onClick={onSave}>
              Save {hasUnsavedChanges && <span className="w-2 h-2 bg-accent rounded-full ml-1"></span>}
            </Button>
            <Button variant="ghost" icon="FolderOpen" onClick={onLoad}>
              Load
            </Button>
            <Button variant="ghost" icon="Download" onClick={onExport}>
              Export SQL
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" icon="Minus" onClick={onZoomOut} size="sm">
              <span className="sr-only">Zoom Out</span>
            </Button>
            <span className="text-sm text-gray-400 px-2 min-w-[60px] text-center">
              {zoom}%
            </span>
            <Button variant="ghost" icon="Plus" onClick={onZoomIn} size="sm">
              <span className="sr-only">Zoom In</span>
            </Button>
            <Button variant="ghost" icon="RotateCcw" onClick={onZoomReset} size="sm">
              Reset
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" icon="Trash2" onClick={onClear} size="sm">
            Clear All
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default Toolbar