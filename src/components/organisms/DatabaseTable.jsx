import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const DatabaseTable = ({ 
  table, 
  isSelected, 
  onMove, 
  onSelect, 
  onEdit, 
  onDelete,
  onRelationshipStart,
  relationships = [],
  snapToGrid = false 
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: table.x || 0, y: table.y || 0 })
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const tableRef = useRef(null)
  const handleMouseDown = (e) => {
    e.stopPropagation()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
    onSelect(table)
  }
  
const handleMouseMove = (e) => {
    if (isDragging) {
      let newX = e.clientX - dragStart.x
      let newY = e.clientY - dragStart.y
      
      // Snap to grid if enabled
      if (snapToGrid) {
        newX = Math.round(newX / 20) * 20
        newY = Math.round(newY / 20) * 20
      }
      
      setPosition({ x: newX, y: newY })
    }
  }
  
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      onMove(table.id, position)
    }
  }
  
  const handleContextMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowContextMenu(true)
  }
  
  const handleRelationshipConnect = (column) => {
    if (onRelationshipStart) {
      onRelationshipStart(table.id, column.name)
    }
  }
  
  const handleDoubleClick = (e) => {
    e.stopPropagation()
    onEdit(table)
  }
  
  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete(table.id)
  }
  
  // Add event listeners when dragging
  if (isDragging) {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
  
  const primaryKeys = table.columns?.filter(col => col.isPrimaryKey) || []
  const foreignKeys = table.columns?.filter(col => col.isForeignKey) || []
  
// Get related tables count for visual indicator
  const relatedTablesCount = relationships.filter(rel => 
    rel.fromTable === table.name || rel.toTable === table.name
  ).length

return (
    <>
      <motion.div
        ref={tableRef}
        className={`
          absolute bg-surface border-2 rounded-lg shadow-lg select-none 
          min-w-[250px] max-w-[320px] sm:min-w-[280px] sm:max-w-[350px]
          mobile-touch-target
          ${isSelected 
            ? 'border-primary glow-primary z-20' 
            : 'border-white/20 hover:border-primary/50 hover:glow-primary z-10'
          }
          ${isDragging ? 'cursor-grabbing z-30 scale-105 sm:scale-102' : 'cursor-grab hover:scale-101'}
          ${isHovering ? 'shadow-2xl' : ''}
          transition-transform duration-200 ease-out
        `}
style={{
          left: position.x,
          top: position.y,
          transform: isDragging ? 'scale(1.05)' : 'scale(1)'
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        whileHover={{ scale: isDragging ? 1.02 : 1.01 }}
        transition={{ duration: 0.2 }}
      >
        {/* Connection Points */}
        <div className="absolute -top-2 left-1/2 w-4 h-4 bg-primary rounded-full border-2 border-background transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity cursor-crosshair" 
             title="Connect relationships" />
        <div className="absolute top-1/2 -right-2 w-4 h-4 bg-primary rounded-full border-2 border-background transform -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity cursor-crosshair" 
             title="Connect relationships" />
        <div className="absolute -bottom-2 left-1/2 w-4 h-4 bg-primary rounded-full border-2 border-background transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity cursor-crosshair" 
             title="Connect relationships" />
        <div className="absolute top-1/2 -left-2 w-4 h-4 bg-primary rounded-full border-2 border-background transform -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity cursor-crosshair" 
             title="Connect relationships" />
{/* Table Header */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-3 sm:p-4 rounded-t-md border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <ApperIcon name="Table" size={18} className="text-primary flex-shrink-0" />
            <h3 className="font-display font-semibold text-white truncate text-sm sm:text-base">{table.name}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleDoubleClick}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              title="Edit table"
            >
              <ApperIcon name="Edit2" size={14} className="text-gray-400 hover:text-primary" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 hover:bg-error/20 rounded transition-colors"
              title="Delete table"
            >
              <ApperIcon name="Trash2" size={14} className="text-gray-400 hover:text-error" />
            </button>
          </div>
        </div>
      </div>
      
{/* Columns */}
      <div className="p-3 sm:p-4">
        {table.columns && table.columns.length > 0 ? (
          <div className="space-y-1 sm:space-y-2">
{table.columns.map(column => (
              <div 
                key={column.id} 
                className="flex items-center justify-between text-xs sm:text-sm py-2 px-2 rounded hover:bg-white/5 group transition-all mobile-touch-target"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {column.isPrimaryKey && (
                      <ApperIcon name="Key" size={12} className="text-accent" title="Primary Key" />
                    )}
                    {column.isForeignKey && (
                      <ApperIcon name="Link" size={12} className="text-secondary cursor-pointer hover:text-secondary/80" 
                                title="Foreign Key - Click to connect" 
                                onClick={() => handleRelationshipConnect(column)} />
                    )}
                    {column.isNotNull && (
                      <ApperIcon name="AlertCircle" size={12} className="text-warning" title="Not Null" />
                    )}
                    {column.isUnique && (
                      <ApperIcon name="Shield" size={12} className="text-blue-400" title="Unique" />
                    )}
                  </div>
                  <span className="text-white font-medium truncate" title={column.name}>
                    {column.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-gray-400 text-xs" title={column.type}>
                    {column.type.length > 12 ? column.type.substring(0, 12) + '...' : column.type}
                  </span>
                  {column.defaultValue && (
                    <ApperIcon name="Star" size={10} className="text-yellow-400" title={`Default: ${column.defaultValue}`} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <ApperIcon name="Columns" size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-xs">No columns defined</p>
          </div>
        )}
      </div>
      
{/* Stats Footer */}
        <div className="px-3 py-2 sm:px-4 bg-black/20 rounded-b-md border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="text-xs sm:text-sm">{table.columns?.length || 0} columns</span>
            <div className="flex items-center gap-1 sm:gap-2">
              {primaryKeys.length > 0 && (
                <span className="flex items-center gap-1" title="Primary Keys">
                  <ApperIcon name="Key" size={10} className="text-accent" />
                  {primaryKeys.length}
                </span>
              )}
              {foreignKeys.length > 0 && (
                <span className="flex items-center gap-1" title="Foreign Keys">
                  <ApperIcon name="Link" size={10} className="text-secondary" />
                  {foreignKeys.length}
                </span>
              )}
              {relatedTablesCount > 0 && (
                <span className="flex items-center gap-1" title="Related Tables">
                  <ApperIcon name="Network" size={10} className="text-blue-400" />
                  {relatedTablesCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

{/* Context Menu */}
      {showContextMenu && (
        <motion.div
          className="fixed bg-surface border border-white/20 rounded-lg shadow-lg z-50 py-2 min-w-[160px] sm:min-w-[180px] glass-advanced"
          style={{
            left: Math.min(position.x + 100, window.innerWidth - 200),
            top: Math.min(position.y + 50, window.innerHeight - 150)
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          onMouseLeave={() => setShowContextMenu(false)}
        >
          <button
            onClick={() => { onEdit(table); setShowContextMenu(false); }}
            className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/10 flex items-center gap-2"
          >
            <ApperIcon name="Edit2" size={14} />
            Edit Table
          </button>
          <button
            onClick={() => { handleDelete(); setShowContextMenu(false); }}
            className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-error/20 hover:text-error flex items-center gap-2"
          >
            <ApperIcon name="Trash2" size={14} />
            Delete Table
          </button>
          <hr className="border-white/10 my-1" />
          <button
            onClick={() => setShowContextMenu(false)}
            className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/10 flex items-center gap-2"
          >
            <ApperIcon name="Copy" size={14} />
            Duplicate Table
          </button>
        </motion.div>
      )}
    </>
  )
}

export default DatabaseTable