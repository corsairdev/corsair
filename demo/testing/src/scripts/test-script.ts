import { corsair } from '@/server/corsair';
import { setupCorsair } from 'corsair/setup';
import 'dotenv/config';

const main = async () => {
	// Requires `APIFY_API_KEY` in your env.
	const apiKey = process.env.APIFY_API_KEY;
	if (!apiKey) {
		console.log('Skipping Apify test: missing APIFY_API_KEY env var');
		return;
	}

	await setupCorsair(corsair);
	await corsair.apify.keys.set_api_key(apiKey);

	const me = await corsair.apify.api.users.usersMeGet({});
	console.log('Apify user:', me);
	// write any test scripts here
	// const res = await corsair -> fill in the rest
	const res = await corsair.googlesheets.api.spreadsheets.list({});
};

main();
