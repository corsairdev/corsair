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

async function setContentfulCredentials() {
	const { CONTENTFUL_API_KEY } = process.env;
	if (CONTENTFUL_API_KEY) {
		await corsair.contentful.keys.set_api_key(CONTENTFUL_API_KEY);
	}
}

const main = async () => {
	const { CONTENTFUL_API_KEY, CONTENTFUL_SPACE_ID } = process.env;

	if (CONTENTFUL_API_KEY && CONTENTFUL_SPACE_ID) {
		await setContentfulCredentials();
		const contentfulRes = await corsair.contentful.api.spaces.get({
			spaceId: CONTENTFUL_SPACE_ID,
		});
		console.log('Contentful Space:', contentfulRes.name);
	} else {
		console.log(
			'Skipping Contentful demo test: missing CONTENTFUL_API_KEY or CONTENTFUL_SPACE_ID in .env',
		);
	}

	// Keep existing slack test to not break other things
	if (process.env.SLACK_BOT_TOKEN) {
		const res = await corsair.slack.api.messages.post({
			channel: 'general',
			text: 'hello',
		});
		console.log('Slack response:', res.ok);
	} else {
		console.log('Skipping Slack demo test: missing SLACK_BOT_TOKEN');
	}
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
