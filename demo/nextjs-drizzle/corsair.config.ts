import 'dotenv/config'
import type { CorsairConfig } from 'corsair'
import { db } from './db'
import { schemaToJson } from 'corsair/adapters/db/postgres/drizzle'
import { z } from 'corsair'

export const config: CorsairConfig<typeof db> = {
  dbType: 'postgres',
  orm: 'drizzle',
  pathToCorsairFolder: './corsair',
  apiEndpoint: process.env.CORSAIR_API_ROUTE!,
  db: db,
  schema: db._.schema,
  unifiedSchema: schemaToJson(db),
  plugins: {
    slack: {
      channels: {
        'general': '123',
        'technology': '456',
        'notifications-error': '789',
      },
    },
  },
} as const
