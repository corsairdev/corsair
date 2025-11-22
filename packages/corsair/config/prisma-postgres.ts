import type {
  ORMs,
  DBTypes,
  Framework,
  ExtractStrict,
  ConnectionConfig,
} from '.'

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
  db: never
  /**
   * The schema that Corsair will use to prompt the LLM and build API endpoints.
   */
  schema: T extends { _: { schema: infer S } } ? S : never
  /**
   * The database connection configuration.
   */
  connection: ConnectionConfig
}
