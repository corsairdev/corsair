import { config } from 'dotenv';
import type { Config } from 'drizzle-kit';

// Keep consistent with the demo runtime env loading.
config({ path: '.env' });

export default {
	schema: './src/db/schema.ts',
	out: './drizzle',
	dialect: 'sqlite',
	dbCredentials: {
		url: './corsair.db',
	},
} satisfies Config;
