import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
	schema: [
		'./src/db/schema.ts',
		'./src/db/auth-schema.ts',
		'./src/db/corsair-schema.ts',
	],
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL ?? '',
	},
});
