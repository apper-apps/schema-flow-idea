import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import DatabaseTable from "@/components/organisms/DatabaseTable";
import Empty from "@/components/ui/Empty";

const Canvas = ({ 
  tables, 
  relationships = [],
  onTableMove, 
  onTableSelect, 
  onTableEdit, 
  onTableDelete,
  onRelationshipCreate,
  selectedTable,
  zoom = 100,
  onAddTable,
  searchTerm = '',
  showMinimap = false,
  snapToGrid = false,
  onMinimapClick 
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [relationshipStart, setRelationshipStart] = useState(null)
  const [isCreatingRelationship, setIsCreatingRelationship] = useState(false)
  const canvasRef = useRef(null)
  const svgRef = useRef(null)
  
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
      setRelationshipStart(null)
      setIsCreatingRelationship(false)
    }
  }

  const handleRelationshipStart = (tableId, columnName) => {
    setRelationshipStart({ tableId, columnName })
    setIsCreatingRelationship(true)
  }

  const handleRelationshipEnd = (targetTableId, targetColumnName) => {
    if (relationshipStart && onRelationshipCreate) {
      onRelationshipCreate({
        fromTable: relationshipStart.tableId,
        fromColumn: relationshipStart.columnName,
        toTable: targetTableId,
        toColumn: targetColumnName
      })
    }
    setRelationshipStart(null)
    setIsCreatingRelationship(false)
  }

  // Filter tables based on search term
  const filteredTables = tables.filter(table => 
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.columns?.some(col => 
      col.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  // Calculate relationship line coordinates
  const getTableCenter = (table) => {
    return {
      x: (table.x || 0) + 125, // Half of min-width
      y: (table.y || 0) + 100   // Approximate center height
    }
  }

  const renderRelationshipLines = () => {
    if (!relationships.length) return null

    return relationships.map((rel, index) => {
      const fromTable = tables.find(t => t.name === rel.fromTable)
      const toTable = tables.find(t => t.name === rel.toTable)
      
      if (!fromTable || !toTable) return null

      const start = getTableCenter(fromTable)
      const end = getTableCenter(toTable)
      
      // Calculate control points for curved line
      const dx = end.x - start.x
      const dy = end.y - start.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      const controlPoint1 = {
        x: start.x + dx * 0.3,
        y: start.y
      }
      const controlPoint2 = {
        x: end.x - dx * 0.3,
        y: end.y
      }

      return (
        <g key={`${rel.fromTable}-${rel.toTable}-${index}`}>
          <path
            d={`M ${start.x} ${start.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${end.x} ${end.y}`}
            stroke="rgba(59, 130, 246, 0.6)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            className="hover:stroke-primary transition-colors"
          />
          {/* Arrowhead */}
          <polygon
            points={`${end.x},${end.y} ${end.x-8},${end.y-4} ${end.x-8},${end.y+4}`}
            fill="rgba(59, 130, 246, 0.6)"
          />
          {/* Relationship label */}
          <text
            x={(start.x + end.x) / 2}
            y={(start.y + end.y) / 2 - 10}
            fill="rgba(156, 163, 175, 0.8)"
            fontSize="10"
            textAnchor="middle"
            className="pointer-events-none"
          >
            {rel.fromColumn} → {rel.toColumn}
          </text>
        </g>
      )
    })
  }
return (
    <div 
      ref={canvasRef}
      className={`flex-1 overflow-hidden bg-background relative ${snapToGrid ? 'canvas-grid' : ''}`}
      onMouseDown={handleMouseDown}
      onClick={handleCanvasClick}
      style={{
        cursor: isDragging ? 'grabbing' : (isCreatingRelationship ? 'crosshair' : 'grab')
      }}
    >
      {/* SVG for relationship lines */}
      <svg
        ref={svgRef}
        className="absolute inset-0 pointer-events-none z-5"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom / 100})`,
          transformOrigin: '0 0'
        }}
      >
        {renderRelationshipLines()}
      </svg>

      <motion.div
        className="relative w-full h-full"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom / 100})`,
          transformOrigin: '0 0'
        }}
        transition={{ type: "tween", duration: isDragging ? 0 : 0.2 }}
      >
{filteredTables.length === 0 && tables.length === 0 ? (
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
        ) : filteredTables.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto text-center">
              <ApperIcon name="Search" size={48} className="mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No matches found</h3>
              <p className="text-gray-500">Try adjusting your search term</p>
            </div>
          </div>
        ) : (
          filteredTables.map(table => (
            <DatabaseTable
              key={table.id}
              table={table}
              isSelected={selectedTable?.id === table.id}
              onMove={onTableMove}
              onSelect={onTableSelect}
              onEdit={onTableEdit}
              onDelete={onTableDelete}
              onRelationshipStart={handleRelationshipStart}
              relationships={relationships}
              snapToGrid={snapToGrid}
            />
          ))
        )}
      </motion.div>

      {/* Minimap */}
      {showMinimap && tables.length > 0 && (
        <div className="absolute bottom-4 right-4 w-48 h-32 bg-surface/90 border border-white/20 rounded-lg backdrop-blur-sm z-30">
          <div className="p-2">
            <div className="text-xs text-gray-400 mb-2 font-medium">Minimap</div>
            <div className="relative w-full h-24 bg-background/50 rounded border border-white/10 overflow-hidden">
              {tables.map(table => {
                const scale = 0.1 // Scale down factor
                const miniX = (table.x || 0) * scale
                const miniY = (table.y || 0) * scale
                
                return (
                  <div
                    key={table.id}
                    className={`absolute w-6 h-4 rounded cursor-pointer transition-all ${
                      selectedTable?.id === table.id 
                        ? 'bg-primary border border-primary/50' 
                        : 'bg-secondary/60 hover:bg-secondary'
                    }`}
                    style={{
                      left: Math.max(0, Math.min(miniX, 180)),
                      top: Math.max(0, Math.min(miniY, 80))
                    }}
                    onClick={() => onMinimapClick && onMinimapClick(table.x || 0, table.y || 0)}
                    title={table.name}
                  />
                )
              })}
              
              {/* Viewport indicator */}
              <div 
                className="absolute border-2 border-accent/60 rounded pointer-events-none"
                style={{
                  left: Math.max(0, -panOffset.x * 0.1),
                  top: Math.max(0, -panOffset.y * 0.1),
                  width: Math.min(180, window.innerWidth * 0.1 / (zoom / 100)),
                  height: Math.min(80, window.innerHeight * 0.1 / (zoom / 100))
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Relationship creation indicator */}
      {isCreatingRelationship && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-primary/20 border border-primary rounded-lg px-4 py-2 z-40 glass">
          <div className="flex items-center gap-2 text-primary">
<ApperIcon name="Link" size={16} />
            <span className="text-sm font-medium">Click on target column to create relationship</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Canvas