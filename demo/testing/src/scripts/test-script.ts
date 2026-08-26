import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '../.env' });

import { setupCorsair } from 'corsair/setup';
import { sqlite } from '../db';
import { corsair } from '../server/corsair';

async function testBookingmoodIntegration() {
	console.log('[Test Script] Running SQLite migrations...');
	const migrationSql = fs.readFileSync(path.resolve('migration.sql'), 'utf-8');
	sqlite.exec(migrationSql);

	console.log(
		'[Test Script] Initializing Corsair setup & provisioning integration rows...',
	);
	await setupCorsair(corsair);

	console.log(
		'[Test Script] Verifying Bookingmood plugin on Corsair client...',
	);
	const bookingmoodPlugin = (corsair as any).bookingmood;

	if (!bookingmoodPlugin) {
		throw new Error('Bookingmood plugin not registered on Corsair client!');
	}

	console.log(
		'[Test Script] Plugin ID:',
		bookingmoodPlugin.id || 'bookingmood',
	);
	console.log(
		'[Test Script] Registered Endpoints:',
		Object.keys(bookingmoodPlugin.api || {}),
	);

	console.log('[Test Script] Setting test API Key via key manager...');
	await bookingmoodPlugin.keys.set_api_key('bm_test_key_abc123');
	console.log('[Test Script] API key set successfully!');

	console.log('[Test Script] All demo integration tests passed cleanly!');
}

const main = async () => {
	console.log(
		'[Test Script] Starting Corsair demo testing for Bookingmood integration...',
	);
	await testBookingmoodIntegration();
};

main().catch((err) => {
	console.error('[Test Script Failure]', err);
	process.exit(1);
});
