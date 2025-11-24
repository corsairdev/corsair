import type { ColumnInfo, SchemaOutput, TableSchema } from '../../../../config'
import { type BaseDrizzlePostgresDatabase } from '../../../../config/drizzle-postgres'

export const schemaToJson = (
  db: BaseDrizzlePostgresDatabase
): SchemaOutput | undefined => {
  if (!db?._.schema) {
    return
  }

  const result: SchemaOutput = {}

  for (const [tableName, tableDefinition] of Object.entries(db._.schema)) {
    if (!tableDefinition.columns) {
      continue
    }

    const columns: TableSchema = {}

    const columnReferences: Record<string, string> = {}
    if (tableDefinition.relations) {
      for (const relation of Object.values(tableDefinition.relations)) {
        if (
          relation?.config?.fields &&
          relation?.config?.references &&
          relation?.referencedTableName
        ) {
          const fields = relation.config.fields
          const references = relation.config.references

          for (let i = 0; i < fields.length && i < references.length; i++) {
            const fieldName = fields[i]?.name
            const referenceName = references[i]?.name

            if (fieldName && referenceName) {
              columnReferences[fieldName] =
                `${relation.referencedTableName}.${referenceName}`
            }
          }
        }
      }
    }

    for (const [columnName, columnDefinition] of Object.entries(
      tableDefinition.columns
    )) {
      let dataType = 'unknown'

      if (columnDefinition?.dataType) {
        dataType = columnDefinition.dataType
      } else if (columnDefinition?.config?.dataType) {
        dataType = columnDefinition.config.dataType
      } else if (columnDefinition?._.dataType) {
        dataType = columnDefinition._.dataType
      }

      const columnInfo: ColumnInfo = { dataType }

      if (columnReferences[columnName]) {
        columnInfo.references = columnReferences[columnName]
      }

      columns[columnName] = columnInfo
    }

    result[tableName] = columns
  }

  return result
}
