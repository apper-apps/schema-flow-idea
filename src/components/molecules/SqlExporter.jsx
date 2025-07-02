import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const SqlExporter = ({ schema, isOpen, onClose }) => {
  const [selectedDialect, setSelectedDialect] = useState('mysql')
  
  const generateSQL = () => {
    if (!schema || !schema.tables || schema.tables.length === 0) {
      return '-- No tables to export'
    }
    
    let sql = `-- Schema: ${schema.name || 'Untitled Schema'}\n`
    sql += `-- Generated on: ${new Date().toISOString()}\n\n`
    
    // Generate CREATE TABLE statements
    schema.tables.forEach(table => {
      sql += `CREATE TABLE ${table.name} (\n`
      
      const columnDefinitions = table.columns.map(column => {
        let def = `  ${column.name} ${column.type}`
        
        if (column.isNotNull) {
          def += ' NOT NULL'
        }
        
        if (column.defaultValue) {
          def += ` DEFAULT '${column.defaultValue}'`
        }
        
        return def
      })
      
      // Add primary key constraint
      const primaryKeys = table.columns.filter(col => col.isPrimaryKey)
      if (primaryKeys.length > 0) {
        const pkColumns = primaryKeys.map(col => col.name).join(', ')
        columnDefinitions.push(`  PRIMARY KEY (${pkColumns})`)
      }
      
      sql += columnDefinitions.join(',\n')
      sql += `\n);\n\n`
    })
    
    // Generate foreign key constraints
    if (schema.relationships && schema.relationships.length > 0) {
      sql += '-- Foreign Key Constraints\n'
      schema.relationships.forEach(rel => {
        sql += `ALTER TABLE ${rel.fromTable} ADD CONSTRAINT fk_${rel.fromTable}_${rel.fromColumn} `
        sql += `FOREIGN KEY (${rel.fromColumn}) REFERENCES ${rel.toTable}(${rel.toColumn});\n`
      })
    }
    
    return sql
  }
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateSQL())
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
  
  const downloadSQL = () => {
    const sql = generateSQL()
    const blob = new Blob([sql], { type: 'text/sql' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${schema?.name || 'schema'}.sql`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
          className="bg-surface border border-white/20 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] flex flex-col glass glow-primary"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-semibold text-white">
              Export SQL Schema
            </h2>
            <Button variant="ghost" icon="X" onClick={onClose} size="sm" />
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <label className="text-sm font-medium text-gray-300">Database Dialect:</label>
            <select
              value={selectedDialect}
              onChange={(e) => setSelectedDialect(e.target.value)}
              className="px-3 py-2 bg-background border border-white/20 rounded-lg text-white text-sm"
            >
              <option value="mysql">MySQL</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="sqlite">SQLite</option>
            </select>
          </div>
          
          <div className="flex-1 min-h-0">
            <pre className="bg-background border border-white/10 rounded-lg p-4 text-sm text-gray-300 font-mono overflow-auto h-full whitespace-pre-wrap">
              {generateSQL()}
            </pre>
          </div>
          
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/10">
            <div className="text-sm text-gray-400">
              {schema?.tables?.length || 0} tables • Generated for {selectedDialect.toUpperCase()}
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" icon="Copy" onClick={copyToClipboard}>
                Copy to Clipboard
              </Button>
              <Button variant="primary" icon="Download" onClick={downloadSQL}>
                Download SQL File
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SqlExporter