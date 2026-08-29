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
	// Buildkite tests
	if (process.env.BUILDKITE_API_TOKEN) {
		const meta = await corsair.buildkite.api.getMeta({});
		console.log('Buildkite Meta:', meta);

		const token = await corsair.buildkite.api.getCurrentAccessToken({});
		console.log('Buildkite Token:', token);

		const user = await corsair.buildkite.api.getUser({});
		console.log('Buildkite User:', user);

		const orgs = await corsair.buildkite.api.listOrganizations({ perPage: 1 });
		console.log('Buildkite Orgs:', orgs);

		if (orgs.length > 0 && orgs[0].slug) {
			const agents = await corsair.buildkite.api.listPipelineAgents({
				orgSlug: orgs[0].slug,
				perPage: 1,
			});
			console.log('Buildkite Agents:', agents);
		}
	} else {
		console.log(
			'Skipping Buildkite tests because BUILDKITE_API_TOKEN is not set.',
		);
	}

	// const res = await corsair.slack.api.messages.post({
	// 	channel: 'general',
	// 	text: 'hello',
	// });
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
