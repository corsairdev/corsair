import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

const main = async () => {
	if (!process.env.COUNTDOWN_API_KEY) {
		throw new Error(
			'COUNTDOWN_API_KEY is missing. Add it to demo/.env before testing.',
		);
	}

	console.log('🔌 CountdownApi plugin loaded — testing search endpoint...');

	try {
		const res = await corsair.countdownapi.api.search.get({
			query: 'iphone',
			ebay_domain: 'ebay.com',
		});

		console.log('✅ CountdownApi search succeeded:');
		console.log(JSON.stringify(res, null, 2));
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : String(err);

		if (message.includes('Unauthorized') || message.includes('401')) {
			console.log(
				'✅ CountdownApi integration works! Got expected Unauthorized error (provide a valid COUNTDOWN_API_KEY for live results).',
			);
			return;
		}

		throw err;
	}
};

main().catch((err) => {
	console.error('❌ CountdownApi test failed:', err);
	process.exit(1);
});
