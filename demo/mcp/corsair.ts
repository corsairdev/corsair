import 'dotenv/config';
import { createCorsair, slack } from 'corsair';
import { Pool } from 'pg';

const pool = new Pool({
	connectionString: process.env.DATABASE_URL ?? 'postgres://postgres:secret@localhost:5432/corsair',
});

export const corsair = createCorsair({
	plugins: [slack()],
	database: pool,
	kek: process.env.CORSAIR_KEK!,
	multiTenancy: false,
});
