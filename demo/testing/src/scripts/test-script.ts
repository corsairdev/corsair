import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

const main = async () => {
	console.log('Testing Codacy Plugin...');

	try {
		console.log('Attempting to fetch Codacy API Health...');
		const healthRes = await corsair.codacy.api.system.getHealth({});
		console.log('Health response:', healthRes);
	} catch (e) {
		console.error(
			'Expected error if unauthorized or misconfigured (Health):',
			e.message,
		);
	}

	try {
		console.log('Attempting to fetch Codacy Account Details...');
		const accountRes = await corsair.codacy.api.account.getAccountDetails({});
		console.log('Account response:', accountRes);
	} catch (e) {
		console.error(
			'Expected error if unauthorized or misconfigured (Account):',
			e.message,
		);
	}
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
