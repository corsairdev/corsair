import { Pool } from 'pg';

// Create a PostgreSQL connection pool
export const database = new Pool({
	connectionString:
		process.env.DATABASE_URL || 'postgresql://localhost:5432/corsair',
});
