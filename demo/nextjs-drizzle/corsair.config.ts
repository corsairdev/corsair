import 'dotenv/config'
import { z, type CorsairConfig } from 'corsair'
import { type SlackChannels } from 'corsair/plugins'
import { db } from './db'
import { schemaToJson } from 'corsair/adapters/db/postgres/drizzle'

export const config = {
  dbType: 'postgres',
  orm: 'drizzle',
  pathToCorsairFolder: './corsair',
  apiEndpoint: process.env.NEXT_PUBLIC_CORSAIR_API_ROUTE!,
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
} satisfies CorsairConfig<typeof db>

export type Config = typeof config
