import type { SchemaOutput } from '../../../config'

export function formattedSchema(schema: SchemaOutput): string {
  if (!schema || Object.keys(schema).length === 0) {
    return 'No schema information available.'
  }

  let description = ''

  Object.entries(schema).forEach(([tableName, tableSchema], index) => {
    description += `${tableName}:\n`

    Object.entries(tableSchema).forEach(([columnName, columnInfo]) => {
      description += `${columnName}: ${columnInfo.type}\n`
    })

    if (index < Object.keys(schema).length - 1) {
      description += '\n'
    }
  })

  return description
}
