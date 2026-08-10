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
	const { BOLOFORMS_API_KEY, BOLOFORMS_WORKSPACE_ID } = process.env;
	if (BOLOFORMS_API_KEY) {
		await corsair.boloforms.keys.set_api_key(BOLOFORMS_API_KEY);
	}

	const res = await corsair.boloforms.api.documents.list({
		workspaceId: BOLOFORMS_WORKSPACE_ID ?? '',
	});
	console.log(res);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});

