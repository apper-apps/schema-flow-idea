import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const SqlExporter = ({ schema, isOpen, onClose }) => {
  const [selectedDialect, setSelectedDialect] = useState('mysql')
  const [exportFormat, setExportFormat] = useState('sql')
  const [includeComments, setIncludeComments] = useState(true)
  const [includeDropStatements, setIncludeDropStatements] = useState(false)
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
  
  const downloadFile = () => {
    const content = getContent()
    const extension = getFileExtension()
    const mimeType = exportFormat === 'json' ? 'application/json' : 'text/plain'
    
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${schema?.name || 'schema'}.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getContent())
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const generateJSON = () => {
    return JSON.stringify(schema, null, 2)
  }

  const generateDocumentation = () => {
    if (!schema || !schema.tables || schema.tables.length === 0) {
      return '# No tables to document'
    }

    let doc = `# Database Schema Documentation\n\n`
    doc += `**Schema Name:** ${schema.name || 'Untitled Schema'}\n`
    doc += `**Generated on:** ${new Date().toLocaleString()}\n`
    doc += `**Total Tables:** ${schema.tables.length}\n\n`

    schema.tables.forEach(table => {
      doc += `## Table: ${table.name}\n\n`
      
      if (table.columns && table.columns.length > 0) {
        doc += `| Column | Type | Constraints | Description |\n`
        doc += `|--------|------|-------------|-------------|\n`
        
        table.columns.forEach(column => {
          const constraints = []
          if (column.isPrimaryKey) constraints.push('PK')
          if (column.isForeignKey) constraints.push('FK')
          if (column.isNotNull) constraints.push('NOT NULL')
          if (column.isUnique) constraints.push('UNIQUE')
          if (column.isAutoIncrement) constraints.push('AUTO_INCREMENT')
          
          doc += `| ${column.name} | ${column.type} | ${constraints.join(', ') || '-'} | ${column.comment || '-'} |\n`
        })
        doc += `\n`
      }
    })

    return doc
  }

  const getContent = () => {
    switch (exportFormat) {
      case 'json':
        return generateJSON()
      case 'documentation':
        return generateDocumentation()
      default:
        return generateSQL()
    }
  }

  const getFileExtension = () => {
    switch (exportFormat) {
      case 'json': return 'json'
      case 'documentation': return 'md'
      default: return 'sql'
    }
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
          
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Export Format:</label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-white/20 rounded-lg text-white text-sm"
              >
                <option value="sql">SQL Script</option>
                <option value="json">JSON Schema</option>
                <option value="documentation">Documentation</option>
              </select>
            </div>

            {exportFormat === 'sql' && (
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Database Dialect:</label>
                <select
                  value={selectedDialect}
                  onChange={(e) => setSelectedDialect(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-white/20 rounded-lg text-white text-sm"
                >
                  <option value="mysql">MySQL</option>
                  <option value="postgresql">PostgreSQL</option>
                  <option value="sqlite">SQLite</option>
                  <option value="mssql">SQL Server</option>
                  <option value="oracle">Oracle</option>
                </select>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Options:</label>
              <div className="space-y-2">
                {exportFormat === 'sql' && (
                  <>
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={includeComments}
                        onChange={(e) => setIncludeComments(e.target.checked)}
                        className="rounded"
                      />
                      Include Comments
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={includeDropStatements}
                        onChange={(e) => setIncludeDropStatements(e.target.checked)}
                        className="rounded"
                      />
                      Include DROP statements
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>
          
<div className="flex-1 min-h-0">
            <div className="bg-background border border-white/10 rounded-lg overflow-hidden h-full">
              <div className="bg-surface/50 px-4 py-2 border-b border-white/10 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">
                  {exportFormat === 'sql' && `${selectedDialect.toUpperCase()} Script`}
                  {exportFormat === 'json' && 'JSON Schema'}
                  {exportFormat === 'documentation' && 'Markdown Documentation'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {getContent().split('\n').length} lines
                  </span>
                </div>
              </div>
              <pre className="p-4 text-sm text-gray-300 font-mono overflow-auto h-full whitespace-pre-wrap">
                {getContent()}
              </pre>
            </div>
          </div>
          
<div className="flex justify-between items-center mt-6 pt-6 border-t border-white/10">
            <div className="text-sm text-gray-400">
              {schema?.tables?.length || 0} tables • {schema?.relationships?.length || 0} relationships
              {exportFormat === 'sql' && ` • ${selectedDialect.toUpperCase()}`}
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" icon="Copy" onClick={copyToClipboard}>
                Copy to Clipboard
              </Button>
              <Button variant="primary" icon="Download" onClick={downloadFile}>
                Download {exportFormat === 'sql' ? 'SQL' : exportFormat === 'json' ? 'JSON' : 'MD'} File
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SqlExporter