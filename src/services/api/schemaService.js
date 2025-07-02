const STORAGE_KEY = 'schema_flow_data'

const schemaService = {
  saveSchema: (schema) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...schema,
        updatedAt: new Date().toISOString()
      }))
      return true
    } catch (error) {
      console.error('Failed to save schema:', error)
      throw new Error('Failed to save schema to local storage')
    }
  },
  
  loadSchema: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const schema = JSON.parse(saved)
        return {
          ...schema,
          createdAt: new Date(schema.createdAt),
          updatedAt: new Date(schema.updatedAt)
        }
      }
      return null
    } catch (error) {
      console.error('Failed to load schema:', error)
      throw new Error('Failed to load schema from local storage')
    }
  },
  
  exportToSQL: (schema, dialect = 'mysql') => {
    if (!schema || !schema.tables || schema.tables.length === 0) {
      return '-- No tables to export'
    }
    
    let sql = `-- Schema: ${schema.name || 'Untitled Schema'}\n`
    sql += `-- Generated on: ${new Date().toISOString()}\n`
    sql += `-- Dialect: ${dialect.toUpperCase()}\n\n`
    
    // Generate CREATE TABLE statements
    schema.tables.forEach(table => {
      sql += `CREATE TABLE ${table.name} (\n`
      
      const columnDefinitions = table.columns.map(column => {
        let def = `  ${column.name} ${column.type}`
        
        if (column.isNotNull) {
          def += ' NOT NULL'
        }
        
        if (column.defaultValue) {
          const isString = ['VARCHAR', 'TEXT', 'CHAR'].some(type => 
            column.type.toUpperCase().includes(type)
          )
          def += isString 
            ? ` DEFAULT '${column.defaultValue}'`
            : ` DEFAULT ${column.defaultValue}`
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
      sql += '\n'
    }
    
    return sql
  },
  
  clearSchema: () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      return true
    } catch (error) {
      console.error('Failed to clear schema:', error)
      throw new Error('Failed to clear schema from local storage')
    }
  }
}

export default schemaService