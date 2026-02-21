import { config } from 'dotenv';
import type { Config } from 'drizzle-kit';

// Load env as early as possible (import order matters with ESM).
config({ path: '.env' });

export default {
	schema: './server/db/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url:
			process.env.DATABASE_URL ??
			'postgres://postgres:secret@localhost:5433/corsair',
	},
} satisfies Config;
