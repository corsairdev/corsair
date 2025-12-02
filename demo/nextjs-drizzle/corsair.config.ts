import { config as dotenvConfig } from 'dotenv'
import { type CorsairConfig } from 'corsair'
import { db } from './db'

dotenvConfig({ path: '.env.local' })

export const config = {
  dbType: 'postgres',
  orm: 'drizzle',
  framework: 'nextjs',
  pathToCorsairFolder: './corsair',
  apiEndpoint: process.env.NEXT_PUBLIC_CORSAIR_API_ROUTE!,
  db: db,
  connection: process.env.DATABASE_URL!,
  plugins: {
    slack: {
      token: '',
      channels: {
        'general': 'G-34839139',
        'technology': '456',
        'notifications-error': '789',
      },
    },
  },
} satisfies CorsairConfig<typeof db>

export type Config = typeof config
