import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Toolbar from '@/components/molecules/Toolbar'
import Canvas from '@/components/organisms/Canvas'
import TableEditor from '@/components/molecules/TableEditor'
import SqlExporter from '@/components/molecules/SqlExporter'
import schemaService from '@/services/api/schemaService'

const SchemaCanvas = () => {
  const [schema, setSchema] = useState({
    id: 'default',
    name: 'Untitled Schema',
    tables: [],
    relationships: [],
    createdAt: new Date(),
    updatedAt: new Date()
  })
  
  const [selectedTable, setSelectedTable] = useState(null)
  const [editingTable, setEditingTable] = useState(null)
  const [isTableEditorOpen, setIsTableEditorOpen] = useState(false)
  const [isSqlExporterOpen, setIsSqlExporterOpen] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // Load schema on mount
  useEffect(() => {
    const loadSchema = () => {
      try {
        const savedSchema = schemaService.loadSchema()
        if (savedSchema) {
          setSchema(savedSchema)
        }
      } catch (error) {
        console.error('Failed to load schema:', error)
        toast.error('Failed to load saved schema')
      }
    }
    
    loadSchema()
  }, [])
  
  // Auto-save when schema changes
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timer = setTimeout(() => {
        handleSave(false) // Silent save
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [schema, hasUnsavedChanges])
  
  const handleAddTable = () => {
    const newTable = {
      id: `table_${Date.now()}`,
      name: `Table_${schema.tables.length + 1}`,
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
      columns: []
    }
    
    setEditingTable(newTable)
    setIsTableEditorOpen(true)
  }
  
  const handleTableMove = (tableId, position) => {
    setSchema(prev => ({
      ...prev,
      tables: prev.tables.map(table =>
        table.id === tableId ? { ...table, ...position } : table
      ),
      updatedAt: new Date()
    }))
    setHasUnsavedChanges(true)
  }
  
  const handleTableSelect = (table) => {
    setSelectedTable(table)
  }
  
  const handleTableEdit = (table) => {
    setEditingTable(table)
    setIsTableEditorOpen(true)
  }
  
  const handleTableDelete = (tableId) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      setSchema(prev => ({
        ...prev,
        tables: prev.tables.filter(table => table.id !== tableId),
        relationships: prev.relationships.filter(rel => 
          rel.fromTable !== tableId && rel.toTable !== tableId
        ),
        updatedAt: new Date()
      }))
      setSelectedTable(null)
      setHasUnsavedChanges(true)
      toast.success('Table deleted successfully')
    }
  }
  
  const handleTableSave = (updatedTable) => {
    setSchema(prev => {
      const existingIndex = prev.tables.findIndex(t => t.id === updatedTable.id)
      const newTables = existingIndex >= 0 
        ? prev.tables.map(t => t.id === updatedTable.id ? updatedTable : t)
        : [...prev.tables, updatedTable]
      
      return {
        ...prev,
        tables: newTables,
        updatedAt: new Date()
      }
    })
    
    setIsTableEditorOpen(false)
    setEditingTable(null)
    setHasUnsavedChanges(true)
    toast.success(updatedTable.id ? 'Table updated successfully' : 'Table created successfully')
  }
  
  const handleSave = (showToast = true) => {
    try {
      schemaService.saveSchema(schema)
      setHasUnsavedChanges(false)
      if (showToast) {
        toast.success('Schema saved successfully')
      }
    } catch (error) {
      console.error('Failed to save schema:', error)
      toast.error('Failed to save schema')
    }
  }
  
  const handleLoad = () => {
    try {
      const loadedSchema = schemaService.loadSchema()
      if (loadedSchema) {
        setSchema(loadedSchema)
        setSelectedTable(null)
        setHasUnsavedChanges(false)
        toast.success('Schema loaded successfully')
      } else {
        toast.info('No saved schema found')
      }
    } catch (error) {
      console.error('Failed to load schema:', error)
      toast.error('Failed to load schema')
    }
  }
  
  const handleExport = () => {
    setIsSqlExporterOpen(true)
  }
  
  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all tables? This action cannot be undone.')) {
      setSchema({
        id: 'default',
        name: 'Untitled Schema',
        tables: [],
        relationships: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })
      setSelectedTable(null)
      setHasUnsavedChanges(true)
      toast.success('Canvas cleared')
    }
  }
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200))
  }
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25))
  }
  
  const handleZoomReset = () => {
    setZoom(100)
  }
  
  return (
    <div className="h-screen flex flex-col bg-background">
      <Toolbar
        onAddTable={handleAddTable}
        onSave={() => handleSave(true)}
        onLoad={handleLoad}
        onExport={handleExport}
        onClear={handleClear}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        zoom={zoom}
        hasUnsavedChanges={hasUnsavedChanges}
      />
      
      <Canvas
        tables={schema.tables}
        selectedTable={selectedTable}
        onTableMove={handleTableMove}
        onTableSelect={handleTableSelect}
        onTableEdit={handleTableEdit}
        onTableDelete={handleTableDelete}
        onAddTable={handleAddTable}
        zoom={zoom}
      />
      
      <TableEditor
        table={editingTable}
        isOpen={isTableEditorOpen}
        onSave={handleTableSave}
        onClose={() => {
          setIsTableEditorOpen(false)
          setEditingTable(null)
        }}
      />
      
      <SqlExporter
        schema={schema}
        isOpen={isSqlExporterOpen}
        onClose={() => setIsSqlExporterOpen(false)}
      />
      
      {/* Status Bar */}
      <div className="bg-surface border-t border-white/10 px-4 py-2 flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-4">
          <span>{schema.tables.length} tables</span>
          <span>Zoom: {zoom}%</span>
          {hasUnsavedChanges && (
            <span className="flex items-center gap-1 text-accent">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              Unsaved changes
            </span>
          )}
        </div>
        <div className="text-xs">
          Last updated: {schema.updatedAt.toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}

export default SchemaCanvas