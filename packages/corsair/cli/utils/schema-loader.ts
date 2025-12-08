import { exec } from 'child_process'
import { promisify } from 'util'
import type { CorsairConfig, SchemaOutput } from '../../config/index.js'
import type { ColumnInfo, TableSchema } from '../../config/index.js'

const execAsync = promisify(exec)

function getSchemaLoaderCode(config: CorsairConfig<any>) {
  const dbSchema: SchemaOutput = {}
  if (config.orm === 'drizzle') {
    const drizzleConfig = config satisfies CorsairConfig<any>

    const schema = drizzleConfig.db._.schema

    if (!schema) {
      throw new Error('No schema found in drizzle instance')
    }

    for (const [tableName, table] of Object.entries(schema)) {
      const tableSchema: TableSchema = {}
      const { columns } = table as any

      for (const [columnName] of Object.entries(columns)) {
        const column = columns[columnName as keyof typeof columns]

        const columnInfo: ColumnInfo = {
          type: column.dataType,
        }

        tableSchema[columnName] = columnInfo
      }

      const actualTableName = (table as any).dbName || tableName
      dbSchema[actualTableName] = tableSchema
    }
  }
}

const body = getSchemaLoaderCode
  .toString()
  .slice(
    getSchemaLoaderCode.toString().indexOf('{') + 1,
    getSchemaLoaderCode.toString().lastIndexOf('}')
  )
  .trim()

export const loadSchema = async () => {
  try {
    const code = `
import { config } from './corsair.config.js'

${body}

const formattedConfig = {
  ...config,
  db: dbSchema,
}

console.log('<output>')
console.log(JSON.stringify(formattedConfig, null, 2))
console.log('</output>')
`

    const result = await execAsync(
      `tsx --conditions=react-server -e "${code.replace(/"/g, '\\"')}"`,
      {
        cwd: process.cwd(),
      }
    )

    const response =
      result.stdout.match(/<output>(.*?)<\/output>/s)?.[1]?.trim() || ''

    const object = JSON.parse(response) as Omit<CorsairConfig<any>, 'db'> & {
      db: SchemaOutput
    }

    return object
  } catch (error) {
    console.error('Error extracting schema:', error)
  }
}
