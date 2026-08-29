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

const main = async () => {
	// Set a mock access token for the oauth_2 auth method
	await corsair.blackbaud.keys.set_access_token('mock-access-token');

	try {
		const gift = await corsair.blackbaud.api.gifts.getGiftById({
			gift_id: '12345',
		});
		console.log('Gift response:', gift);
	} catch (err) {
		console.log('Gift fetch finished:', err);
	}
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
