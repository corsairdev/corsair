import type { DrizzlePostgresConfig } from './drizzle-postgres'
import type { SlackPlugin } from '../plugins'

export type ColumnInfo = {
  dataType: string
  references?: string
}

export type TableSchema = Record<string, ColumnInfo>

export type SchemaOutput = Record<string, TableSchema>

type BasePlugin = Record<'slack', SlackPlugin>

export type BaseConfig = {
  /**
   * The API endpoint to use for the Corsair client. Defaults to `/api/corsair`.
   */
  apiEndpoint: string
  /**
   * The path to the Corsair folder. Defaults to `./corsair`.
   */
  pathToCorsairFolder: string
  /**
   * Base schema transformed from any db to a unified version an LLM can reference.
   * If this can't compile, CLI will throw an error.
   */
  unifiedSchema?: SchemaOutput
  /**
   * Any plugins for Corsair to use
   */
  plugins?: BasePlugin
}

/**
 * Base Corsair config setup. Currently only compatible with Next.js + Drizzle + Postgres
 */
export type CorsairConfig<T> = BaseConfig & DrizzlePostgresConfig<T>
