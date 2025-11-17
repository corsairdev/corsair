// @ts-nocheck

import type { SchemaDefinition, TableDefinition } from '../types/state.js'

/**
 * Generates TypeScript types from schema definitions
 */
export function generateTypes(
  queryResult: any,
  schema: SchemaDefinition,
  tableName: string
): string {
  const table = schema.tables.find(t => t.name === tableName)

  if (!table) {
    return 'export type QueryResult = any;'
  }

  return generateTableType(table)
}

function generateTableType(table: TableDefinition): string {
  const fields = table.columns
    .map(col => {
      return `  ${col.name}: ${mapSqlTypeToTs(col.type)};`
    })
    .join('\n')

  return `export type ${capitalize(table.name)} = {\n${fields}\n};`
}

function mapSqlTypeToTs(sqlType: string): string {
  const type = sqlType.toLowerCase()

  if (
    type.includes('int') ||
    type.includes('serial') ||
    type.includes('decimal') ||
    type.includes('numeric')
  ) {
    return 'number'
  }

  if (type.includes('bool')) {
    return 'boolean'
  }

  if (type.includes('json')) {
    return 'any'
  }

  if (type.includes('date') || type.includes('time')) {
    return 'Date'
  }

  // Default to string for text, varchar, char, etc.
  return 'string'
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
