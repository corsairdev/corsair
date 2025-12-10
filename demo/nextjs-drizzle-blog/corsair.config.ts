import type { CorsairConfig } from 'corsair';
import { config as dotenvConfig } from 'dotenv';
import { db } from './db';

dotenvConfig({ path: '.env.local' });

export const config = {
	dbType: 'postgres',
	orm: 'drizzle',
	framework: 'nextjs',
	pathToCorsairFolder: './corsair',
	apiEndpoint: process.env.NEXT_PUBLIC_CORSAIR_API_ROUTE!,
	db: db,
	schema: db._.schema,
	// connection: {
	//   host: process.env.DATABASE_HOST!,
	//   username: process.env.DATABASE_USERNAME!,
	//   password: process.env.DATABASE_PASSWORD!,
	//   database: process.env.DATABASE_NAME!,
	// },
	connection: process.env.DATABASE_URL!,
	plugins: {
		slack: {
			token: '',
			channels: {
				general: 'G-34839139',
				technology: '456',
				'notifications-error': '789',
			},
		},
	},
} satisfies CorsairConfig<typeof db>;

export type Config = typeof config;
