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

async function runTpscheckExamples() {
	// 1. Health check (public)
	const status = await corsair.tpscheck.api.status.get({});
	console.log('TPSCheck status:', status);

	// 2. Check remaining credits (requires TPSCHECK_API_KEY)
	// const credits = await corsair.tpscheck.api.credits.get({});
	// console.log('TPSCheck credits:', credits);

	// 3. Single number check (requires TPSCHECK_API_KEY)
	// const check = await corsair.tpscheck.api.check.post({ phone: '01829 830730' });
	// console.log('TPSCheck check result:', check);

	// 4. Batch check (requires TPSCHECK_API_KEY)
	// const batch = await corsair.tpscheck.api.batch.post({
	// 	phones: ['01564 331484', '01953 498974'],
	// });
	// console.log('TPSCheck batch result:', batch);
}

const main = async () => {
	const res = await corsair.slack.api.messages.post({
		channel: 'general',
		text: 'hello',
	});
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
