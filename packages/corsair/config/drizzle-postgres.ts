import type {
  ORMs,
  DBTypes,
  Framework,
  ExtractStrict,
  ConnectionConfig,
} from '.'

/**
 * This is the basic schema we are expecting.
 * We don't want to compare deeply nested types since that is inevitably going to throw errors
 * and degrade the DX. Instead, let's just make sure some basic fields are there and that we
 * are getting the correctly abstracted level of the Drizzle schema and database client.
 */
export type BaseDrizzlePostgresDatabase = {
  _: {
    schema?: Record<
      string,
      {
        columns: Record<string, any>
        relations?: Record<
          string,
          {
            config?: {
              fields?: Array<{ name?: string; [key: string]: any }>
              references?: Array<{ name?: string; [key: string]: any }>
              [key: string]: any
            }
            referencedTableName?: string
            [key: string]: any
          }
        >
        [key: string]: any
      }
    >
    fullSchema?: Record<string, any>
  }
  query: any
  select: any
  insert: any
  update: any
}

export type DrizzlePostgresConfig<T = any> = {
  /**
   * The ORM to use for the Postgres database.
   */
  orm: ExtractStrict<ORMs, 'drizzle'>
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
  db: T extends BaseDrizzlePostgresDatabase ? T : never
  /**
   * The database connection configuration.
   */
  connection: ConnectionConfig
}

export const DefaultDrizzlePostgresConfig: DrizzlePostgresConfig<any> = {
  orm: 'drizzle',
  dbType: 'postgres',
  framework: 'nextjs',
  db: {},
  connection: {
    host: 'localhost',
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
  },
}
