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

async function setSupadataCredentials() {
	const { SUPADATA_API_KEY } = process.env;

	if (SUPADATA_API_KEY) {
		await corsair.supadata.keys.set_api_key(SUPADATA_API_KEY);
	}
}

const main = async () => {
	await setInstagramCredentials();
	await setSupadataCredentials();

	const res = await corsair.slack.api.messages.post({
		channel: 'general',
		text: 'hello',
	});

	if (process.env.SUPADATA_API_KEY) {
		console.log('Testing Supadata transcript.get...');
		const transcript = await corsair.supadata.api.transcript.get({
			url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
		});
		console.log('Transcript result:', JSON.stringify(transcript, null, 2));

		console.log('Testing Supadata metadata.get...');
		const metadata = await corsair.supadata.api.metadata.get({
			url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
		});
		console.log('Metadata result:', JSON.stringify(metadata, null, 2));

		console.log('Testing Supadata web.scrape...');
		const webScrape = await corsair.supadata.api.web.scrape({
			url: 'https://example.com',
		});
		console.log('Web Scrape result:', JSON.stringify(webScrape, null, 2));

		console.log('Testing Supadata web.map...');
		const webMap = await corsair.supadata.api.web.map({
			url: 'https://example.com',
		});
		console.log('Web Map result:', JSON.stringify(webMap, null, 2));

		console.log('Testing Supadata youtube.search...');
		const youtubeSearch = await corsair.supadata.api.youtube.search({
			query: 'Rick Astley',
		});
		console.log(
			'YouTube Search result:',
			JSON.stringify(youtubeSearch, null, 2),
		);
	}
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
