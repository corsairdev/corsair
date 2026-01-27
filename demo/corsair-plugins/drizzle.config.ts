import { config } from 'dotenv';
import type { Config } from 'drizzle-kit';

// Keep consistent with the demo runtime env loading.
config({ path: '.env' });

export default {
	schema: './src/db/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
} satisfies Config;
