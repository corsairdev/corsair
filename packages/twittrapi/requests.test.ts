import type { CorsairEndpoint } from 'corsair/core';
import { twittrApiEndpointSchemas, twittrapi } from './index';

// On-the-wire checks for every operation: the request the plugin sends
// (method, path, query, body, auth header) with fetch mocked, and the reply
// parsed by the operation's own output schema. Reply shapes are trimmed from
// the 11-18 live run.

const API_KEY = 'twittrapi_test_key';

const user = {
	id: '2244994945',
	username: 'XDevelopers',
	name: 'Developers',
	description: 'The voice of the X Dev team',
	location: '',
	url: null,
	createdAt: '2013-12-13T19:38:37Z',
	avatarUrl: null,
	bannerUrl: null,
	verified: true,
	verifiedType: 'Business',
	protected: false,
	counts: {
		followers: 1,
		following: 1,
		tweets: 1,
		likes: 1,
		media: 1,
		listed: 1,
	},
	pinnedTweetIds: [],
	isAutomated: false,
};

const tweet = {
	id: '2019881223666233717',
	url: 'https://x.com/XDevelopers/status/2019881223666233717',
	text: 'hello',
	createdAt: '2026-02-06T21:09:45Z',
	lang: 'en',
	author: user,
	counts: {
		likes: 1,
		retweets: 0,
		replies: 0,
		quotes: 0,
		bookmarks: 0,
		views: null,
	},
	media: [
		{
			type: 'animated_gif_v2',
			url: 'https://pbs.twimg.com/x.mp4',
			previewUrl: 'https://pbs.twimg.com/x.jpg',
			width: 1,
			height: 1,
			altText: null,
			durationMs: null,
		},
	],
	urls: [],
	hashtags: [],
	mentions: [],
	replyTo: null,
	quoted: { id: '1', unavailable: true },
	retweetOf: null,
	conversationId: '2019881223666233717',
	isPinned: false,
	source: null,
	article: null,
};

const page = <T>(data: T[]) => ({
	data,
	nextCursor: 'c2',
	previousCursor: null,
	hasNextPage: true,
});

const list = {
	id: '84839422',
	name: 'Official Twitter Accounts',
	description: '',
	createdAt: null,
	memberCount: 81,
	followerCount: 1,
	private: false,
	bannerUrl: null,
	owner: { id: '783214', username: 'X' },
};

const community = {
	id: '1500000000000000000',
	name: 'Python Coding',
	description: '',
	createdAt: null,
	memberCount: 1,
	moderatorCount: 1,
	joinPolicy: 'Open',
	nsfw: false,
	topic: null,
	bannerUrl: null,
	creator: null,
	rules: [],
};

const webhook = {
	id: 18,
	url: 'https://example.com/corsair-plugin-test',
	label: 'corsair-plugin-test',
	accounts: null,
	secret: 'whsec_00',
	active: true,
	failureCount: 0,
	disabledAt: null,
	disabledReason: null,
	lastSuccessAt: null,
	lastFailureAt: null,
	createdAt: '2026-11-18T09:58:00Z',
};

const plan = {
	planId: 'free',
	maxAccounts: 1,
	usedAccounts: 0,
	latencyClass: 'standard',
	status: 'active',
};

const monitored = {
	userId: '2244994945',
	username: 'XDevelopers',
	state: 'pending',
	stage: 'queued',
	latencyClass: 'standard',
	subscribedAt: '2026-11-18T09:58:00Z',
	monitoringSince: null,
	filters: { replies: false, retweets: true, quotes: true },
};

type Case = {
	op: keyof typeof twittrApiEndpointSchemas;
	input: Record<string, unknown>;
	method: string;
	path: string;
	query?: Record<string, string>;
	body?: Record<string, unknown>;
	reply: unknown;
};

const simple = { format: 'simple' };

const cases: Case[] = [
	{
		op: 'tweets.search',
		input: { searchItem: 'from:XDevelopers', category: 'Latest', count: 5 },
		method: 'GET',
		path: '/search',
		query: {
			searchItem: 'from:XDevelopers',
			category: 'Latest',
			count: '5',
			...simple,
		},
		reply: page([tweet]),
	},
	{
		op: 'tweets.getById',
		input: { tweetId: '2019881223666233717' },
		method: 'GET',
		path: '/simpletweet/2019881223666233717',
		query: simple,
		reply: { data: tweet },
	},
	{
		op: 'tweets.getReplies',
		input: { tweetId: '2019881223666233717', rankingMode: 'Recency' },
		method: 'GET',
		path: '/tweet/2019881223666233717',
		query: { rankingMode: 'Recency', ...simple },
		reply: page([tweet, { id: '9', unavailable: true }]),
	},
	{
		op: 'tweets.getQuotes',
		input: { tweetId: '2019881223666233717', count: 5, cursor: 'c1' },
		method: 'GET',
		path: '/tweet/2019881223666233717/quotes',
		query: { count: '5', cursor: 'c1', ...simple },
		reply: page([tweet]),
	},
	{
		op: 'tweets.getRetweeters',
		input: { tweetId: '2019881223666233717', count: 5 },
		method: 'GET',
		path: '/tweet/2019881223666233717/retweets',
		query: { count: '5', ...simple },
		reply: page([user]),
	},
	{
		op: 'users.getByUsername',
		input: { username: '@XDevelopers' },
		method: 'GET',
		path: '/user/by/username/XDevelopers',
		query: simple,
		reply: { data: user },
	},
	{
		op: 'users.getById',
		input: { userId: '-1', username: 'XDevelopers' },
		method: 'GET',
		path: '/user/-1',
		query: { username: 'XDevelopers', ...simple },
		reply: { data: user },
	},
	{
		op: 'users.batchGetByIds',
		input: { ids: '2244994945,12' },
		method: 'GET',
		path: '/user/users/by/ids',
		query: { ids: '2244994945,12', ...simple },
		reply: { ...page([user]), nextCursor: null, hasNextPage: false },
	},
	...(
		[
			['users.getTweets', 'tweets', [tweet]],
			['users.getTweetsAndReplies', 'tweetsAndReplies', [tweet]],
			['users.getMedia', 'media', [tweet]],
			['users.getLikes', 'likes', []],
			['users.getFollowers', 'followers', [user]],
			['users.getFollowings', 'followings', [user]],
			['users.getVerifiedFollowers', 'verifiedFollowers', [user]],
		] as const
	).map(
		([op, segment, data]): Case => ({
			op,
			input: { userId: '2244994945', count: 5 },
			method: 'GET',
			path: `/user/2244994945/${segment}`,
			query: { count: '5', ...simple },
			reply: page([...data]),
		}),
	),
	{
		op: 'users.getFriendship',
		input: { sourceScreenName: 'XDevelopers', targetScreenName: 'X' },
		method: 'GET',
		path: '/user/friendships/show',
		query: {
			source_screen_name: 'XDevelopers',
			target_screen_name: 'X',
			...simple,
		},
		// blocking/blockedBy/muting came back null on the live run.
		reply: {
			data: {
				source: { id: '2244994945', username: 'XDevelopers' },
				target: { id: '783214', username: 'X' },
				following: true,
				followedBy: false,
				canDm: false,
				blocking: null,
				blockedBy: null,
				muting: null,
			},
		},
	},
	{
		op: 'users.resolveIds',
		input: { usernames: 'XDevelopers,jack,nobody_here_1' },
		method: 'GET',
		path: '/user/usernames/to/ids',
		query: { usernames: 'XDevelopers,jack,nobody_here_1', ...simple },
		reply: {
			data: {
				userIds: { XDevelopers: '2244994945', jack: '12' },
				errors: [{ username: 'nobody_here_1', error: 'not_found' }],
			},
		},
	},
	{
		op: 'lists.getDetails',
		input: { listId: '84839422' },
		method: 'GET',
		path: '/lists/details',
		query: { listId: '84839422', ...simple },
		reply: { data: list },
	},
	{
		op: 'lists.getTweets',
		input: { listId: '84839422', count: 5 },
		method: 'GET',
		path: '/lists/tweets',
		query: { listId: '84839422', count: '5', ...simple },
		reply: page([tweet]),
	},
	{
		op: 'lists.getMembers',
		input: { listId: '84839422' },
		method: 'GET',
		path: '/lists/members',
		query: { listId: '84839422', ...simple },
		reply: page([user]),
	},
	{
		op: 'lists.getFollowers',
		input: { listId: '84839422' },
		method: 'GET',
		path: '/lists/followers',
		query: { listId: '84839422', ...simple },
		reply: page([user]),
	},
	{
		op: 'communities.search',
		input: { searchTerm: 'python dev' },
		method: 'GET',
		path: '/communities/search/python%20dev',
		query: simple,
		reply: page([community]),
	},
	{
		op: 'communities.getById',
		input: { communityId: '1500000000000000000' },
		method: 'GET',
		path: '/communities/1500000000000000000',
		query: simple,
		reply: { data: community },
	},
	{
		op: 'communities.getTweets',
		input: { communityId: '1500000000000000000', count: 5 },
		method: 'GET',
		path: '/communities/1500000000000000000/tweets',
		query: { count: '5', ...simple },
		reply: page([tweet]),
	},
	{
		op: 'communities.getMembers',
		input: { communityId: '1500000000000000000' },
		method: 'GET',
		path: '/communities/1500000000000000000/members',
		query: simple,
		reply: page([user]),
	},
	{
		op: 'communities.getModerators',
		input: { communityId: '1500000000000000000' },
		method: 'GET',
		path: '/communities/1500000000000000000/moderators',
		query: simple,
		reply: page([user]),
	},
	{
		op: 'trends.getByLocation',
		input: { locationId: '1' },
		method: 'GET',
		path: '/trends/1',
		query: simple,
		reply: page([
			{
				name: '#AI',
				query: '%23AI',
				url: 'https://x.com/x',
				tweetVolume: null,
			},
		]),
	},
	{
		op: 'trends.getLocations',
		input: {},
		method: 'GET',
		path: '/misc/locations',
		query: simple,
		reply: {
			data: [
				{
					woeid: 1,
					name: 'Worldwide',
					country: '',
					countryCode: null,
					placeType: 'Supername',
					parentId: 0,
				},
			],
		},
	},
	{
		op: 'monitors.getPlan',
		input: {},
		method: 'GET',
		path: '/monitors',
		reply: { plan, webhook: null, webhooks: [] },
	},
	{
		op: 'monitors.listAccounts',
		input: {},
		method: 'GET',
		path: '/monitors/accounts',
		reply: { data: [monitored], plan },
	},
	{
		op: 'monitors.addAccounts',
		input: { usernames: ['XDevelopers'] },
		method: 'POST',
		path: '/monitors/accounts',
		body: { usernames: ['XDevelopers'] },
		reply: {
			data: [
				{
					input: 'XDevelopers',
					userId: '2244994945',
					username: 'XDevelopers',
					status: 'added',
				},
			],
			plan,
		},
	},
	{
		op: 'monitors.updateAccount',
		input: { usernameOrId: 'XDevelopers', filters: { replies: false } },
		method: 'PATCH',
		path: '/monitors/accounts/XDevelopers',
		body: { filters: { replies: false } },
		reply: { data: monitored },
	},
	{
		op: 'monitors.removeAccount',
		input: { usernameOrId: 'XDevelopers' },
		method: 'DELETE',
		path: '/monitors/accounts/XDevelopers',
		reply: { removed: '2244994945' },
	},
	{
		op: 'monitors.listWebhooks',
		input: {},
		method: 'GET',
		path: '/monitors/webhooks',
		// {data: [...]} on the live run, not {webhooks: [...]}.
		reply: { data: [webhook] },
	},
	{
		op: 'monitors.createWebhook',
		input: { url: 'https://example.com/corsair-plugin-test', label: 'x' },
		method: 'POST',
		path: '/monitors/webhooks',
		body: { url: 'https://example.com/corsair-plugin-test', label: 'x' },
		reply: { webhook },
	},
	{
		op: 'monitors.getWebhook',
		input: { webhookId: 18 },
		method: 'GET',
		path: '/monitors/webhooks/18',
		reply: { webhook },
	},
	{
		op: 'monitors.updateWebhook',
		input: { webhookId: 18, accounts: ['2244994945'], rotateSecret: true },
		method: 'PATCH',
		path: '/monitors/webhooks/18',
		body: { accounts: ['2244994945'], rotateSecret: true },
		reply: { webhook: { ...webhook, accounts: ['2244994945'] } },
	},
	{
		op: 'monitors.deleteWebhook',
		input: { webhookId: 18 },
		method: 'DELETE',
		path: '/monitors/webhooks/18',
		reply: { deleted: true },
	},
	{
		op: 'monitors.testWebhook',
		input: { webhookId: 18 },
		method: 'POST',
		path: '/monitors/webhooks/18/test',
		body: {},
		reply: { ok: false, statusCode: 405, latencyMs: 90, error: 'HTTP 405' },
	},
	{
		op: 'monitors.getEvents',
		input: { since: '1849203', limit: 5 },
		method: 'GET',
		path: '/monitors/events',
		query: { since: '1849203', limit: '5' },
		reply: { data: [], hasMore: false },
	},
	{
		op: 'monitors.getDeliveries',
		input: { limit: 5 },
		method: 'GET',
		path: '/monitors/deliveries',
		query: { limit: '5' },
		reply: { data: [] },
	},
	{
		op: 'balance.get',
		input: {},
		method: 'GET',
		path: '/balance',
		reply: {
			user_id: 1,
			balance: 0.5,
			price_per_call: 0.0001,
			is_active: true,
		},
	},
];

// unknown: each operation has its own input and output; the schemas check them.
type Endpoint = CorsairEndpoint<never, unknown, unknown>;

async function capture(c: Case) {
	const original = globalThis.fetch;
	let url = '';
	let init: RequestInit = {};
	globalThis.fetch = (async (called: string, options: RequestInit) => {
		url = called;
		init = options;
		return new Response(JSON.stringify(c.reply), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}) as typeof fetch;
	try {
		const plugin = twittrapi();
		const [group, name] = c.op.split('.') as [string, string];
		const endpoints = plugin.endpoints as unknown as Record<
			string,
			Record<string, Endpoint>
		>;
		const contract = twittrApiEndpointSchemas[c.op];
		const ctx = {
			key: API_KEY,
			options: plugin.options,
			db: {},
			tenantId: 'default',
		} as never;
		const result = await endpoints[group]![name]!(
			ctx,
			contract.input.parse(c.input) as never,
		);
		return { result, url: new URL(url), init, contract };
	} finally {
		globalThis.fetch = original;
	}
}

describe('TwittrAPI requests on the wire', () => {
	const originalWarn = console.warn;
	beforeAll(() => {
		console.warn = () => undefined;
	});
	afterAll(() => {
		console.warn = originalWarn;
	});

	it('covers every operation', () => {
		expect(new Set(cases.map((c) => c.op))).toEqual(
			new Set(Object.keys(twittrApiEndpointSchemas)),
		);
	});

	it.each(cases.map((c) => [c.op, c] as const))('%s', async (_op, c) => {
		const { result, url, init, contract } = await capture(c);
		expect(url.origin).toBe('https://api.twittrapi.com');
		expect(url.pathname).toBe(c.path);
		expect(init.method).toBe(c.method);
		expect(Object.fromEntries(url.searchParams)).toEqual(c.query ?? {});
		const headers = new Headers(init.headers);
		expect(headers.get('X-API-KEY')).toBe(API_KEY);
		if (c.body) {
			expect(JSON.parse(String(init.body))).toEqual(c.body);
		} else {
			expect(init.body ?? undefined).toBeUndefined();
		}
		expect(() => contract.output.parse(result)).not.toThrow();
	});
});
