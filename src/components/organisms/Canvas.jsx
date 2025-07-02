import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import DatabaseTable from '@/components/organisms/DatabaseTable'
import Empty from '@/components/ui/Empty'

const Canvas = ({ 
  tables, 
  onTableMove, 
  onTableSelect, 
  onTableEdit, 
  onTableDelete,
  selectedTable,
  zoom = 100,
  onAddTable 
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef(null)
  
  const handleMouseDown = (e) => {
    if (e.target === canvasRef.current) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
    }
  }
  
  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }, [isDragging, dragStart])
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])
  
  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      onTableSelect(null)
    }
  }
  
  return (
    <div 
      ref={canvasRef}
      className="flex-1 overflow-hidden bg-background canvas-grid cursor-move relative"
      onMouseDown={handleMouseDown}
      onClick={handleCanvasClick}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom / 100})`,
          transformOrigin: '0 0'
        }}
        transition={{ type: "tween", duration: isDragging ? 0 : 0.2 }}
      >
        {tables.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto">
              <Empty
                title="Welcome to Schema Flow"
                description="Start designing your database schema by adding your first table. Drag tables around, connect relationships, and export to SQL when ready."
                actionLabel="Add Your First Table"
                onAction={onAddTable}
                icon="Database"
              />
            </div>
          </div>
        ) : (
          tables.map(table => (
            <DatabaseTable
              key={table.id}
              table={table}
              isSelected={selectedTable?.id === table.id}
              onMove={onTableMove}
              onSelect={onTableSelect}
              onEdit={onTableEdit}
              onDelete={onTableDelete}
            />
          ))
        )}
      </motion.div>
    </div>
  )
}

export default Canvas