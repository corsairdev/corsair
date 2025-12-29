import type { CorsairConfig } from '@corsair-ai/core';
import { slackDbPlugin } from '../slack';

export const config = {
	dbType: 'postgres',
	orm: 'drizzle',
	framework: 'nextjs',
	pathToCorsairFolder: './corsair',
	apiEndpoint: 'api/corsair',
	// not needed for schema generation (only for runtime operations)
	db: {},
	connection: 'postgres://postgres:postgres@localhost:5432/postgres',
	dbPlugins: [slackDbPlugin],
} satisfies CorsairConfig<any>;

export type Config = typeof config;
