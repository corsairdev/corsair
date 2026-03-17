import 'dotenv/config';
import { createCorsair, gmail, linear, slack } from 'corsair';
import { Pool } from 'pg';

const pool = new Pool({
	connectionString:
		process.env.DATABASE_URL ??
		'postgres://postgres:secret@localhost:5432/corsair',
});

export const corsair = createCorsair({
	plugins: [
		slack(),
		linear(),
		gmail({
			permissions: {
				mode: 'cautious',
				overrides: {
					'messages.send': 'require_approval',
				},
			},
		}),
	],
	database: pool,
	kek: process.env.CORSAIR_KEK!,
	multiTenancy: false,
});
