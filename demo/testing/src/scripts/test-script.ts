import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

async function testDynapictures() {
	const dynapicturesApiKey = process.env.DYNAPICTURES_API_KEY;

	if (!dynapicturesApiKey) {
		console.log(
			'DYNAPICTURES_API_KEY is not set. Gracefully skipping live Dynapictures API call.',
		);
		return;
	}

	console.log('Configuring Dynapictures API key...');
	if ('dynapictures' in corsair.keys) {
		await (corsair.keys as Record<string, any>).dynapictures.set_api_key(
			dynapicturesApiKey,
		);
	} else if (
		'dynapictures' in corsair &&
		'keys' in (corsair as any).dynapictures
	) {
		await (corsair as any).dynapictures.keys.set_api_key(dynapicturesApiKey);
	}

	console.log('Exercising Dynapictures templates.list endpoint...');
	const templates = await corsair.dynapictures.api.templates.list({});
	console.log(
		`Successfully fetched ${templates.length} Dynapictures templates:`,
		templates,
	);
}

const main = async () => {
	console.log(
		'Dynapictures plugin registered successfully on Corsair instance.',
	);
	await testDynapictures();
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
