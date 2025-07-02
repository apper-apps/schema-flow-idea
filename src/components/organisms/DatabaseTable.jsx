import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const DatabaseTable = ({ 
  table, 
  isSelected, 
  onMove, 
  onSelect, 
  onEdit, 
  onDelete 
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: table.x || 0, y: table.y || 0 })
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
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      setPosition({ x: newX, y: newY })
    }
  }
  
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      onMove(table.id, position)
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
  
  return (
    <motion.div
      ref={tableRef}
      className={`
        absolute bg-surface border-2 rounded-lg shadow-lg cursor-move select-none min-w-[250px]
        ${isSelected 
          ? 'border-primary glow-primary z-20' 
          : 'border-white/20 hover:border-primary/50 hover:glow-primary z-10'
        }
        ${isDragging ? 'cursor-grabbing z-30' : 'cursor-grab'}
      `}
      style={{
        left: position.x,
        top: position.y,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)'
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      whileHover={{ scale: isDragging ? 1.02 : 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {/* Table Header */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-3 rounded-t-md border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ApperIcon name="Table" size={18} className="text-primary" />
            <h3 className="font-display font-semibold text-white">{table.name}</h3>
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
      <div className="p-3">
        {table.columns && table.columns.length > 0 ? (
          <div className="space-y-2">
            {table.columns.map(column => (
              <div 
                key={column.id} 
                className="flex items-center justify-between text-sm py-1 px-2 rounded hover:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {column.isPrimaryKey && (
                      <ApperIcon name="Key" size={12} className="text-accent" title="Primary Key" />
                    )}
                    {column.isForeignKey && (
                      <ApperIcon name="Link" size={12} className="text-secondary" title="Foreign Key" />
                    )}
                    {column.isNotNull && (
                      <ApperIcon name="AlertCircle" size={12} className="text-warning" title="Not Null" />
                    )}
                  </div>
                  <span className="text-white font-medium">{column.name}</span>
                </div>
                <span className="text-gray-400 text-xs">{column.type}</span>
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
      <div className="px-3 py-2 bg-black/20 rounded-b-md border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{table.columns?.length || 0} columns</span>
          <div className="flex items-center gap-2">
            {primaryKeys.length > 0 && (
              <span className="flex items-center gap-1">
                <ApperIcon name="Key" size={10} className="text-accent" />
                {primaryKeys.length} PK
              </span>
            )}
            {foreignKeys.length > 0 && (
              <span className="flex items-center gap-1">
                <ApperIcon name="Link" size={10} className="text-secondary" />
                {foreignKeys.length} FK
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default DatabaseTable