import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Checkbox from '@/components/atoms/Checkbox'
import ApperIcon from '@/components/ApperIcon'

const TableEditor = ({ table, onSave, onClose, isOpen }) => {
  const [tableName, setTableName] = useState('')
  const [columns, setColumns] = useState([])
  
  useEffect(() => {
    if (table) {
      setTableName(table.name)
      setColumns(table.columns || [])
    } else {
      setTableName('')
      setColumns([])
    }
  }, [table])
  
const dataTypes = [
    { value: 'VARCHAR(255)', label: 'VARCHAR(255)' },
    { value: 'VARCHAR(50)', label: 'VARCHAR(50)' },
    { value: 'VARCHAR(1000)', label: 'VARCHAR(1000)' },
    { value: 'CHAR(10)', label: 'CHAR(10)' },
    { value: 'TEXT', label: 'TEXT' },
    { value: 'LONGTEXT', label: 'LONGTEXT' },
    { value: 'INT', label: 'INT' },
    { value: 'BIGINT', label: 'BIGINT' },
    { value: 'SMALLINT', label: 'SMALLINT' },
    { value: 'TINYINT', label: 'TINYINT' },
    { value: 'DECIMAL(10,2)', label: 'DECIMAL(10,2)' },
    { value: 'FLOAT', label: 'FLOAT' },
    { value: 'DOUBLE', label: 'DOUBLE' },
    { value: 'BOOLEAN', label: 'BOOLEAN' },
    { value: 'DATE', label: 'DATE' },
    { value: 'DATETIME', label: 'DATETIME' },
    { value: 'TIMESTAMP', label: 'TIMESTAMP' },
    { value: 'TIME', label: 'TIME' },
    { value: 'YEAR', label: 'YEAR' },
    { value: 'BINARY', label: 'BINARY' },
    { value: 'VARBINARY', label: 'VARBINARY' },
    { value: 'BLOB', label: 'BLOB' },
    { value: 'JSON', label: 'JSON' },
    { value: 'UUID', label: 'UUID' },
    { value: 'ENUM', label: 'ENUM' }
  ]
  
const addColumn = () => {
    const newColumn = {
      id: `col_${Date.now()}`,
      name: '',
      type: 'VARCHAR(255)',
      isPrimaryKey: false,
      isForeignKey: false,
      isNotNull: false,
      isUnique: false,
      isAutoIncrement: false,
      defaultValue: '',
      comment: ''
    }
    setColumns([...columns, newColumn])
  }
  
  const removeColumn = (columnId) => {
    setColumns(columns.filter(col => col.id !== columnId))
  }
  
  const updateColumn = (columnId, field, value) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, [field]: value } : col
    ))
}

  const moveColumn = (fromIndex, toIndex) => {
    const newColumns = [...columns]
    const [movedColumn] = newColumns.splice(fromIndex, 1)
    newColumns.splice(toIndex, 0, movedColumn)
    setColumns(newColumns)
  }

  const validateTable = () => {
    const errors = []
    if (!tableName.trim()) errors.push('Table name is required')
    if (columns.length === 0) errors.push('At least one column is required')
    
    const primaryKeys = columns.filter(col => col.isPrimaryKey)
    if (primaryKeys.length === 0) errors.push('At least one primary key is recommended')
    
    const columnNames = columns.map(col => col.name.trim().toLowerCase())
    const duplicates = columnNames.filter((name, index) => name && columnNames.indexOf(name) !== index)
    if (duplicates.length > 0) errors.push('Duplicate column names found')
    
    return errors
  }
  
  const handleSave = () => {
    if (!tableName.trim()) return
    
    const validationErrors = validateTable()
    if (validationErrors.length > 0) {
      alert('Validation errors:\n' + validationErrors.join('\n'))
      return
    }
    
    const updatedTable = {
      ...table,
      name: tableName,
      columns: columns.filter(col => col.name.trim())
    }
    
    onSave(updatedTable)
  }
  
  if (!isOpen) return null
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-surface border border-white/20 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto glass glow-primary"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-semibold text-white">
              {table ? `Edit Table: ${table.name}` : 'Create New Table'}
            </h2>
            <Button variant="ghost" icon="X" onClick={onClose} size="sm" />
          </div>
          
          <div className="space-y-6">
            <Input
              label="Table Name"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Enter table name"
            />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Columns</h3>
                <Button variant="accent" icon="Plus" onClick={addColumn} size="sm">
                  Add Column
                </Button>
              </div>
              
              <div className="space-y-4">
                {columns.map((column, index) => (
                  <motion.div
                    key={column.id}
                    className="bg-background/50 border border-white/10 rounded-lg p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
<div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <ApperIcon name="GripVertical" size={16} className="text-gray-500 cursor-grab" />
                        <span className="text-sm font-medium text-gray-300">Column {index + 1}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {index > 0 && (
                          <button
                            onClick={() => moveColumn(index, index - 1)}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                            title="Move up"
                          >
                            <ApperIcon name="ChevronUp" size={14} className="text-gray-400" />
                          </button>
                        )}
                        {index < columns.length - 1 && (
                          <button
                            onClick={() => moveColumn(index, index + 1)}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                            title="Move down"
                          >
                            <ApperIcon name="ChevronDown" size={14} className="text-gray-400" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <Input
                        label="Column Name"
                        value={column.name}
                        onChange={(e) => updateColumn(column.id, 'name', e.target.value)}
                        placeholder="column_name"
                      />
                      
                      <Select
                        label="Data Type"
                        value={column.type}
                        onChange={(e) => updateColumn(column.id, 'type', e.target.value)}
                        options={dataTypes}
                      />
                      
                      <Input
                        label="Default Value"
                        value={column.defaultValue}
                        onChange={(e) => updateColumn(column.id, 'defaultValue', e.target.value)}
                        placeholder="Optional"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Input
                        label="Comment"
                        value={column.comment || ''}
                        onChange={(e) => updateColumn(column.id, 'comment', e.target.value)}
                        placeholder="Optional description"
                      />
                    </div>
                    
<div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-4">
                        <Checkbox
                          label="Primary Key"
                          checked={column.isPrimaryKey}
                          onChange={(e) => updateColumn(column.id, 'isPrimaryKey', e.target.checked)}
                        />
                        <Checkbox
                          label="Foreign Key"
                          checked={column.isForeignKey}
                          onChange={(e) => updateColumn(column.id, 'isForeignKey', e.target.checked)}
                        />
                        <Checkbox
                          label="Not Null"
                          checked={column.isNotNull}
                          onChange={(e) => updateColumn(column.id, 'isNotNull', e.target.checked)}
                        />
                        <Checkbox
                          label="Unique"
                          checked={column.isUnique}
                          onChange={(e) => updateColumn(column.id, 'isUnique', e.target.checked)}
                        />
                        <Checkbox
                          label="Auto Increment"
                          checked={column.isAutoIncrement}
                          onChange={(e) => updateColumn(column.id, 'isAutoIncrement', e.target.checked)}
                        />
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        icon="Trash2" 
                        onClick={() => removeColumn(column.id)}
                        size="sm"
                        className="text-error hover:bg-error/10"
                      />
                    </div>
                  </motion.div>
                ))}
                
                {columns.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <ApperIcon name="Columns" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No columns added yet. Click "Add Column" to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-white/10">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={!tableName.trim()}>
              {table ? 'Update Table' : 'Create Table'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TableEditor