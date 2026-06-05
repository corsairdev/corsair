import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import { corsair } from '@/server/corsair';

async function setInstagramCredentials() {
	const {
		FACEBOOK_APP_ID,
		FACEBOOK_APP_SECRET,
		IG_ACCESS_TOKEN,
	} = process.env;

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
	await setInstagramCredentials();

	const res = await corsair.instagram.api.profile.GetFacebookPages({});

	console.log('Facebook Pages:', res);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
