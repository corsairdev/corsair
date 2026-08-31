import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { corsair } from '@/server/corsair';

async function setInstagramCredentials() {
	const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, IG_ACCESS_TOKEN } = process.env;

	if (FACEBOOK_APP_ID) {
		await corsair.keys.instagram.set_client_id(FACEBOOK_APP_ID);
	}
	if (FACEBOOK_APP_SECRET) {
		await corsair.keys.instagram.set_client_secret(FACEBOOK_APP_SECRET);
	}
	if (IG_ACCESS_TOKEN) {
		await corsair.instagram.keys.set_access_token(IG_ACCESS_TOKEN);
	}
}

async function testDynapictures() {
	const dynapicturesApiKey = process.env.DYNAPICTURES_API_KEY;

	if (!dynapicturesApiKey) {
		console.log(
			'DYNAPICTURES_API_KEY is not set. Gracefully skipping live Dynapictures API call.',
		);
		return;
	}

	await corsair.keys.dynapictures.set_api_key(dynapicturesApiKey);

	const templates = await corsair.dynapictures.api.templates.list({});
	console.log('Dynapictures templates:', templates);
}

const main = async () => {
	await setInstagramCredentials();
	await testDynapictures();
	const res = await corsair.slack.api.messages.post({
		channel: 'general',
		text: 'hello',
	});
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
