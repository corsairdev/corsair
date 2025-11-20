import { SchemaOutput, ColumnInfo, ConnectionConfig } from '../config/index.js'
import { loadConfig, loadEnv } from './config.js'
import { Client, ClientConfig } from 'pg'
import { resolve } from 'path'
import { existsSync } from 'fs'

async function loadRuntimeConfig(): Promise<{
  connection?: ConnectionConfig
} | null> {
  const tsConfigPath = resolve(process.cwd(), 'corsair.config.ts')
  const jsConfigPath = resolve(process.cwd(), 'corsair.config.js')

  try {
    if (existsSync(jsConfigPath)) {
      const mod = require(jsConfigPath)
      const config = mod?.config ?? mod?.default ?? mod
      return config
    } else if (existsSync(tsConfigPath)) {
      const mod = require(tsConfigPath)
      const config = mod?.config ?? mod?.default ?? mod
      return config
    }
  } catch (error) {
    return null
  }

  return null
}

function buildClientConfig(connection: ConnectionConfig): ClientConfig {
  if (typeof connection === 'string') {
    return { connectionString: connection }
  }

  return {
    host: connection.host,
    port: connection.port ?? 5432,
    user: connection.username,
    password: connection.password,
    database: connection.database,
    ssl: connection.ssl ? { rejectUnauthorized: false } : false,
  }
}

export const loadSchema = async (): Promise<SchemaOutput> => {
  const cfg = loadConfig()
  loadEnv('.env.local')

  const runtimeConfig = await loadRuntimeConfig()
  let clientConfig: ClientConfig

  if (runtimeConfig?.connection) {
    clientConfig = buildClientConfig(runtimeConfig.connection)
  } else {
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      throw new Error(
        'DATABASE_URL environment variable is required when connection is not specified in corsair.config'
      )
    }
    clientConfig = { connectionString: dbUrl }
  }
  const client = new Client(clientConfig)

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
