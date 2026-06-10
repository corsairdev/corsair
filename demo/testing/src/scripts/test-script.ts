import 'dotenv/config';

import { corsair } from '@/server/corsair';

const main = async () => {
	// HubSpot scratch sample:
	// const res = await corsair.hubspot.api.contacts.search({
	// 	query: 'test',
	// 	limit: 5,
	// });
	// console.log('HubSpot contacts:', res);

	if (!process.env.AGENTQL_API_KEY) {
		console.log('AGENTQL_API_KEY is not set; skipping AgentQL manual tests.');
		return;
	}

	const queryData = await corsair.agentql.api.data.query({
		url: 'https://docs.agentql.com/home',
		prompt: 'Extract the page title and main heading.',
		params: {
			mode: 'fast',
		},
	});
	console.log('AgentQL query data:', queryData);

	const browserSession =
		await corsair.agentql.api.browserSessions.createRemoteBrowserSession({
			browser_profile: 'light',
			shutdown_mode: 'on_disconnect',
			branding: false,
			browser_startup_url: 'about:blank',
		});
	console.log('AgentQL browser session:', browserSession);

	const usage = await corsair.agentql.api.usage.get({});
	console.log('AgentQL usage:', usage);
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
