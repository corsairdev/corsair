import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

const main = async () => {
	if (!process.env.COUNTDOWN_API_KEY) {
		throw new Error(
			'COUNTDOWN_API_KEY is missing. Add it to demo/.env before testing.',
		);
	}

	const res = await corsair.countdownapi.api.search.get({
		query: 'iphone',
		ebay_domain: 'ebay.com',
	});

	console.log(JSON.stringify(res, null, 2));
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
