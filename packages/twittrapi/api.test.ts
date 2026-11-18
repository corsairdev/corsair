import 'dotenv/config';
import { makeTwittrApiRequest } from './client';
import { TwittrApiEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.TWITTRAPI_API_KEY!;
const TEST_USERNAME = process.env.TEST_TWITTER_USERNAME || 'XDevelopers';
const TEST_USER_ID = process.env.TEST_TWITTER_USER_ID || '2244994945';
const TEST_TWEET_ID =
	process.env.TEST_TWITTER_TWEET_ID || '2019881223666233717';
const TEST_LIST_ID = process.env.TEST_TWITTER_LIST_ID || '';
const TEST_COMMUNITY_ID = process.env.TEST_TWITTER_COMMUNITY_ID || '';

describe('TwittrAPI live API (requires TWITTRAPI_API_KEY)', () => {
	it('balanceGet returns the key balance (free)', async () => {
		if (!TEST_API_KEY) return;
		const response = await makeTwittrApiRequest<
			import('./endpoints/types').TwittrApiEndpointOutputs['balanceGet']
		>('/balance', TEST_API_KEY, { method: 'GET' });
		TwittrApiEndpointOutputSchemas.balanceGet.parse(response);
		expect(response).toBeDefined();
	});

	it('usersGetByUsername returns simple-format user', async () => {
		if (!TEST_API_KEY) return;
		const response = await makeTwittrApiRequest<
			import('./endpoints/types').TwittrApiEndpointOutputs['usersGetByUsername']
		>(`/user/by/username/${TEST_USERNAME}`, TEST_API_KEY, {
			query: { format: 'simple' },
		});
		TwittrApiEndpointOutputSchemas.usersGetByUsername.parse(response);
	});

	it('usersGetById returns simple-format user', async () => {
		if (!TEST_API_KEY) return;
		const response = await makeTwittrApiRequest<
			import('./endpoints/types').TwittrApiEndpointOutputs['usersGetById']
		>(`/user/${TEST_USER_ID}`, TEST_API_KEY, {
			query: { format: 'simple' },
		});
		TwittrApiEndpointOutputSchemas.usersGetById.parse(response);
	});

	it('tweetsSearch returns a tweet page', async () => {
		if (!TEST_API_KEY) return;
		const response = await makeTwittrApiRequest<
			import('./endpoints/types').TwittrApiEndpointOutputs['tweetsSearch']
		>('/search', TEST_API_KEY, {
			query: {
				searchItem: 'from:XDevelopers',
				category: 'Latest',
				format: 'simple',
			},
		});
		TwittrApiEndpointOutputSchemas.tweetsSearch.parse(response);
	});

	it('tweetsGetById returns a single tweet', async () => {
		if (!TEST_API_KEY) return;
		const response = await makeTwittrApiRequest<
			import('./endpoints/types').TwittrApiEndpointOutputs['tweetsGetById']
		>(`/simpletweet/${TEST_TWEET_ID}`, TEST_API_KEY, {
			query: { format: 'simple' },
		});
		TwittrApiEndpointOutputSchemas.tweetsGetById.parse(response);
	});

	it('usersGetTweets returns a tweet page', async () => {
		if (!TEST_API_KEY) return;
		const response = await makeTwittrApiRequest<
			import('./endpoints/types').TwittrApiEndpointOutputs['usersGetTweets']
		>(`/user/${TEST_USER_ID}/tweets`, TEST_API_KEY, {
			query: { count: 5, format: 'simple' },
		});
		TwittrApiEndpointOutputSchemas.usersGetTweets.parse(response);
	});

	it('usersGetFollowers returns a user page', async () => {
		if (!TEST_API_KEY) return;
		const response = await makeTwittrApiRequest<
			import('./endpoints/types').TwittrApiEndpointOutputs['usersGetFollowers']
		>(`/user/${TEST_USER_ID}/followers`, TEST_API_KEY, {
			query: { count: 5, format: 'simple' },
		});
		TwittrApiEndpointOutputSchemas.usersGetFollowers.parse(response);
	});

	it('trendsGetByLocation returns trends', async () => {
		if (!TEST_API_KEY) return;
		const response = await makeTwittrApiRequest<
			import('./endpoints/types').TwittrApiEndpointOutputs['trendsGetByLocation']
		>('/trends/1', TEST_API_KEY, { query: { format: 'simple' } });
		TwittrApiEndpointOutputSchemas.trendsGetByLocation.parse(response);
	});

	it('listsGetDetails returns a list (opt-in)', async () => {
		if (!TEST_API_KEY || !TEST_LIST_ID) return;
		const response = await makeTwittrApiRequest<
			import('./endpoints/types').TwittrApiEndpointOutputs['listsGetDetails']
		>('/lists/details', TEST_API_KEY, {
			query: { listId: TEST_LIST_ID, format: 'simple' },
		});
		TwittrApiEndpointOutputSchemas.listsGetDetails.parse(response);
	});

	it('communitiesGetById returns a community (opt-in)', async () => {
		if (!TEST_API_KEY || !TEST_COMMUNITY_ID) return;
		const response = await makeTwittrApiRequest<
			import('./endpoints/types').TwittrApiEndpointOutputs['communitiesGetById']
		>(`/communities/${TEST_COMMUNITY_ID}`, TEST_API_KEY, {
			query: { format: 'simple' },
		});
		TwittrApiEndpointOutputSchemas.communitiesGetById.parse(response);
	});

	it('monitorsListAccounts reads the monitor plan (not billed per call)', async () => {
		if (!TEST_API_KEY) return;
		const response = await makeTwittrApiRequest<
			import('./endpoints/types').TwittrApiEndpointOutputs['monitorsListAccounts']
		>('/monitors/accounts', TEST_API_KEY, { method: 'GET' });
		TwittrApiEndpointOutputSchemas.monitorsListAccounts.parse(response);
	});

	it('monitorsGetEvents reads the event feed', async () => {
		if (!TEST_API_KEY) return;
		const response = await makeTwittrApiRequest<
			import('./endpoints/types').TwittrApiEndpointOutputs['monitorsGetEvents']
		>('/monitors/events', TEST_API_KEY, {
			query: { limit: 5 },
		});
		TwittrApiEndpointOutputSchemas.monitorsGetEvents.parse(response);
	});
});
