import 'dotenv/config'
import { type CorsairConfig } from 'corsair'
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
      token: '',
      channels: {
        'general': '123',
        'technology': '456',
        'notifications-error': '789',
      },
    },
  },
} satisfies CorsairConfig<typeof db>

export type Config = typeof config
