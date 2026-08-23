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

// A 1x1 transparent GIF, used only as a small, deterministic upload payload.
const TINY_GIF_BASE64 =
	'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/**
 * Exercises the ImgBB plugin end-to-end. Gated on IMGBB_API_KEY so this
 * script still runs for contributors who haven't set one up.
 */
async function testImgBB() {
	if (!process.env.IMGBB_API_KEY) {
		console.log('[imgbb] Skipping — IMGBB_API_KEY not set');
		return;
	}

	const keyStatus = await corsair.imgbb.api.auth.getApiKey({});
	console.log('[imgbb] auth.getApiKey ->', keyStatus);

	const uploaded = await corsair.imgbb.api.images.upload({
		image: TINY_GIF_BASE64,
		name: 'corsair-imgbb-smoke-test',
	});
	console.log('[imgbb] images.upload ->', uploaded.url);
}

const main = async () => {
	const res = await corsair.slack.api.messages.post({
		channel: 'general',
		text: 'hello',
	});

	await testImgBB();
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
