import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { setupCorsair } from 'corsair';
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

async function runAbyssaleTest() {
	console.log('Running Abyssale manual test...');
	try {
		await corsair.abyssale.keys.set_api_key('mock-abyssale-key');
		const res = await corsair.abyssale.api.auth.test({});
		console.log('Abyssale testAuth response:', res);
	} catch (error) {
		console.log(
			'Abyssale testAuth failed (expected with mock key):',
			error instanceof Error ? error.message : String(error),
		);
	}
}

const main = async () => {
	await setupCorsair(corsair);
	await runAbyssaleTest();
	try {
		await corsair.slack.api.messages.post({
			channel: 'general',
			text: 'hello',
		});
	} catch (error) {
		// Slack might fail if not configured
	}
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
