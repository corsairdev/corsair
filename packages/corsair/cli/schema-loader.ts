import { SchemaOutput, ColumnInfo } from '../config'
import { loadConfig, loadEnv } from './config.js'
import { Client } from 'pg'

export const loadSchema = async (): Promise<SchemaOutput> => {
  const cfg = loadConfig()
  loadEnv(cfg.envFile ?? '.env.local')
  const dbUrl = process.env.DATABASE_URL

  if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable is required')
  }

  const client = new Client({ connectionString: dbUrl })

  try {
    await client.connect()

    const query = `
      SELECT
        c.table_name,
        c.column_name,
        c.data_type,
        c.is_nullable,
        c.column_default,
        tc.constraint_type,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM
        information_schema.columns c
      LEFT JOIN
        information_schema.key_column_usage kcu
        ON c.table_name = kcu.table_name
        AND c.column_name = kcu.column_name
        AND c.table_schema = kcu.table_schema
      LEFT JOIN
        information_schema.table_constraints tc
        ON kcu.constraint_name = tc.constraint_name
        AND kcu.table_schema = tc.table_schema
      LEFT JOIN
        information_schema.constraint_column_usage ccu
        ON tc.constraint_name = ccu.constraint_name
        AND tc.table_schema = ccu.table_schema
      WHERE
        c.table_schema = 'public'
      ORDER BY
        c.table_name, c.ordinal_position;
    `

    const result = await client.query(query)
    const schema: SchemaOutput = {}

    for (const row of result.rows) {
      const tableName = row.table_name
      const columnName = row.column_name
      const dataType = row.data_type

      if (!schema[tableName]) {
        schema[tableName] = {}
      }

      const columnInfo: ColumnInfo = {
        dataType: dataType,
      }

      if (
        row.constraint_type === 'FOREIGN KEY' &&
        row.foreign_table_name &&
        row.foreign_column_name
      ) {
        columnInfo.references = `${row.foreign_table_name}.${row.foreign_column_name}`
      }

      schema[tableName][columnName] = columnInfo
    }

    return schema
  } finally {
    await client.end()
  }
}
