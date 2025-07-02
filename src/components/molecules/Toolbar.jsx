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
  onSearch,
  onToggleMinimap,
  onToggleSnapToGrid,
  onAutoLayout,
  searchTerm = '',
  showMinimap = false,
  snapToGrid = false,
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

          {/* Search Bar */}
          <div className="relative mr-4">
            <input
              type="text"
              placeholder="Search tables, columns..."
              value={searchTerm}
              onChange={(e) => onSearch && onSearch(e.target.value)}
              className="w-64 px-3 py-2 pl-10 bg-surface border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-sm"
            />
            <ApperIcon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => onSearch && onSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <ApperIcon name="X" size={14} />
              </button>
            )}
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
{/* View Controls */}
          <div className="flex items-center gap-1 mr-4">
            <Button 
              variant={showMinimap ? "primary" : "ghost"} 
              icon="Map" 
              onClick={onToggleMinimap} 
              size="sm"
              title="Toggle Minimap"
            />
            <Button 
              variant={snapToGrid ? "primary" : "ghost"} 
              icon="Grid3X3" 
              onClick={onToggleSnapToGrid} 
              size="sm"
              title="Snap to Grid"
            />
            <Button 
              variant="ghost" 
              icon="Shuffle" 
              onClick={onAutoLayout} 
              size="sm"
              title="Auto Layout"
            />
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" icon="Minus" onClick={onZoomOut} size="sm" title="Zoom Out (Ctrl + -)">
              <span className="sr-only">Zoom Out</span>
            </Button>
            <span className="text-sm text-gray-400 px-2 min-w-[60px] text-center font-mono">
              {zoom}%
            </span>
            <Button variant="ghost" icon="Plus" onClick={onZoomIn} size="sm" title="Zoom In (Ctrl + +)">
              <span className="sr-only">Zoom In</span>
            </Button>
            <Button variant="ghost" icon="RotateCcw" onClick={onZoomReset} size="sm" title="Reset Zoom (Ctrl + 0)">
              Reset
            </Button>
          </div>
        </div>
        
<div className="flex items-center gap-2">
          <div className="text-xs text-gray-500 mr-4 hidden lg:block">
            <kbd className="px-2 py-1 bg-surface/50 rounded border border-white/20 text-xs">Ctrl + N</kbd> New Table
            <span className="mx-2">•</span>
            <kbd className="px-2 py-1 bg-surface/50 rounded border border-white/20 text-xs">Ctrl + S</kbd> Save
          </div>
          <Button variant="outline" icon="Trash2" onClick={onClear} size="sm" title="Clear All Tables">
            Clear All
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default Toolbar