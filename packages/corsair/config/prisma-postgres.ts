import type {
  ORMs,
  DBTypes,
  Framework,
  ExtractStrict,
  ConnectionConfig,
} from '.'

export type BasePrismaPostgresClient = {
  [key: string]: any
}

export type PrismaDMMFDatamodel = {
  models: Array<{
    name: string
    fields: Array<{
      name: string
      kind: string
      type: string
      relationName?: string
      relationToFields?: string[]
      relationOnDelete?: string
      [key: string]: any
    }>
    [key: string]: any
  }>
  [key: string]: any
}

export type PrismaPostgresConfig<T = any> = {
  /**
   * The ORM to use for the Postgres database.
   */
  orm: ExtractStrict<ORMs, 'prisma'>
  /**
   * The database being used. In this case, Postgres.
   */
  dbType: ExtractStrict<DBTypes, 'postgres'>
  /**
   * The framework being used to build this project. In this case, Nextjs.
   */
  framework: ExtractStrict<Framework, 'nextjs'>
  /**
   * The database client that Corsair will use to interact with the database.
   */
  db: T extends BasePrismaPostgresClient ? T : never
  /**
   * The schema that Corsair will use to prompt the LLM and build API endpoints.
   */
  schema: PrismaDMMFDatamodel
  /**
   * The database connection configuration.
   */
  connection: ConnectionConfig
}

export const DefaultPrismaPostgresConfig: PrismaPostgresConfig<any> = {
  orm: 'prisma',
  dbType: 'postgres',
  framework: 'nextjs',
  db: {},
  schema: {},
  connection: {
    host: 'localhost',
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
  },
}
