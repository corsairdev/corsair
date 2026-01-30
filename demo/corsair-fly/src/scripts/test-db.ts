import { db } from '@/db';
import 'dotenv/config';

const main = async () => {
	console.log('Testing database connection...');

	try {
		// Test basic query
		const result = await db.execute(
			`SELECT NOW() as current_time, version() as pg_version`,
		);

		console.log('\nDatabase connected successfully!');
		console.log('PostgreSQL version:', result.rows[0]?.pg_version);
		console.log('Current time:', result.rows[0]?.current_time);

		// Check if Corsair tables exist
		const tables = await db.execute(`
			SELECT table_name
			FROM information_schema.tables
			WHERE table_schema = 'public'
			AND table_name LIKE 'corsair_%'
			ORDER BY table_name
		`);

		console.log('\nCorsair tables:');
		if (tables.rows.length === 0) {
			console.log('No tables found. Run migrations with: npm run db:push');
		} else {
			tables.rows.forEach((row: any) => {
				console.log(`- ${row.table_name}`);
			});
		}

		console.log('\nTest completed successfully!');
	} catch (error) {
		console.error('Error testing database:', error);
		throw error;
	} finally {
		// Close the database pool
		process.exit(0);
	}
};

main();
