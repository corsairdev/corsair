import 'dotenv/config';

import { setupCorsair } from 'corsair/setup';
import { corsair } from '@/server/corsair';

const main = async () => {
	if (!process.env.FIRECRAWL_API_KEY) {
		console.info(
			'Skipping Firecrawl test: set FIRECRAWL_API_KEY in demo/testing/.env',
		);
		return;
	}

	// Ensures corsair_integrations / corsair_accounts exist for every plugin so
	// logEventFromContext (used by plugin endpoints) can resolve $getAccountId.
	await setupCorsair(corsair, {
		credentials: {
			firecrawl: { api_key: process.env.FIRECRAWL_API_KEY },
		},
	});

	const res = await corsair.firecrawl.api.scrape.run({
		url: 'https://example.com',
		formats: ['markdown'],
	});

	console.log(JSON.stringify(res, null, 2));
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
