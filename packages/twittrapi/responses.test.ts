import { redactUrl } from './endpoints/monitors';
import {
	TwittrApiEndpointInputSchemas,
	TwittrApiEndpointOutputSchemas,
} from './endpoints/types';
import { asArray, persistUsers } from './utils';

// ── Simple-format fixtures (run without a live key) ───────────────────────────

const sampleUser = {
	id: '2244994945',
	username: 'XDevelopers',
	name: 'Developers',
	description: 'The voice of the X Dev team',
	location: 'San Francisco',
	url: 'https://developer.x.com',
	createdAt: '2013-12-13T19:38:37Z',
	avatarUrl: 'https://pbs.twimg.com/avatar.jpg',
	bannerUrl: null,
	verified: true,
	verifiedType: 'Business',
	protected: false,
	counts: {
		followers: 100,
		following: 10,
		tweets: 5000,
		likes: 200,
		media: 50,
		listed: 5,
	},
	pinnedTweetIds: [],
	isAutomated: false,
};

const sampleTweet = {
	id: '2019881223666233717',
	url: 'https://x.com/XDevelopers/status/2019881223666233717',
	text: 'Hello world http://developer.x.com',
	createdAt: '2026-02-06T21:09:45Z',
	lang: 'en',
	author: sampleUser,
	counts: {
		likes: 1,
		retweets: 0,
		replies: 0,
		quotes: 0,
		bookmarks: 0,
		views: 10,
	},
	media: [],
	urls: ['http://developer.x.com'],
	hashtags: [],
	mentions: [],
	replyTo: null,
	quoted: null,
	retweetOf: null,
	conversationId: '2019881223666233717',
	isPinned: false,
	source: null,
};

const tweetPage = {
	data: [sampleTweet],
	nextCursor: null,
	previousCursor: null,
	hasNextPage: false,
};

const userPage = {
	data: [sampleUser],
	nextCursor: null,
	previousCursor: null,
	hasNextPage: false,
};

describe('TwittrAPI output schemas (offline fixtures)', () => {
	it('parses tweet pages', () => {
		expect(
			TwittrApiEndpointOutputSchemas.tweetsSearch.parse(tweetPage),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.tweetsGetReplies.parse(tweetPage),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.tweetsGetQuotes.parse(tweetPage),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.usersGetTweets.parse(tweetPage),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.usersGetTweetsAndReplies.parse(tweetPage),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.usersGetMedia.parse(tweetPage),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.usersGetLikes.parse(tweetPage),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.listsGetTweets.parse(tweetPage),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.communitiesGetTweets.parse(tweetPage),
		).toBeDefined();
	});

	it('parses single tweet results', () => {
		const result = TwittrApiEndpointOutputSchemas.tweetsGetById.parse({
			data: sampleTweet,
		});
		expect(result.data).toMatchObject({ id: sampleTweet.id });
	});

	it('parses unavailable tweets', () => {
		const result = TwittrApiEndpointOutputSchemas.tweetsGetById.parse({
			data: { id: '123', unavailable: true },
		});
		expect(result.data).toMatchObject({ id: '123' });
	});

	it('parses user pages', () => {
		expect(
			TwittrApiEndpointOutputSchemas.tweetsGetRetweeters.parse(userPage),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.usersBatchGetByIds.parse(userPage),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.usersGetFollowers.parse(userPage),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.usersGetFollowings.parse(userPage),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.usersGetVerifiedFollowers.parse(userPage),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.usersResolveIds.parse({
				data: { userIds: { XDevelopers: '2244994945' } },
			}),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.listsGetMembers.parse(userPage),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.listsGetFollowers.parse(userPage),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.communitiesGetMembers.parse(userPage),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.communitiesGetModerators.parse(userPage),
		).toBeDefined();
	});

	it('parses single user results', () => {
		const byUsername = TwittrApiEndpointOutputSchemas.usersGetByUsername.parse({
			data: sampleUser,
		});
		expect(byUsername.data?.username).toBe('XDevelopers');
		const byId = TwittrApiEndpointOutputSchemas.usersGetById.parse({
			data: sampleUser,
		});
		expect(byId.data?.id).toBe('2244994945');
		const missing = TwittrApiEndpointOutputSchemas.usersGetByUsername.parse({
			data: null,
		});
		expect(missing.data).toBeNull();
	});

	it('parses friendship results', () => {
		const result = TwittrApiEndpointOutputSchemas.usersGetFriendship.parse({
			data: {
				source: { id: '1', username: 'a' },
				target: { id: '2', username: 'b' },
				following: true,
				followedBy: false,
				canDm: false,
				blocking: false,
				blockedBy: false,
				muting: false,
			},
		});
		expect(result.data.following).toBe(true);
	});

	it('parses list results', () => {
		const list = {
			id: '123',
			name: 'Test',
			description: 'desc',
			createdAt: null,
			memberCount: 5,
			followerCount: 10,
			private: false,
			bannerUrl: null,
			owner: { id: '1', username: 'a' },
		};
		const result = TwittrApiEndpointOutputSchemas.listsGetDetails.parse({
			data: list,
		});
		expect(result.data?.id).toBe('123');
	});

	it('parses community results', () => {
		const community = {
			id: '456',
			name: 'Test Community',
			description: '',
			createdAt: null,
			memberCount: 100,
			moderatorCount: 2,
			joinPolicy: 'Open',
			nsfw: false,
			topic: null,
			bannerUrl: null,
			creator: null,
			rules: [],
		};
		const byId = TwittrApiEndpointOutputSchemas.communitiesGetById.parse({
			data: community,
		});
		expect(byId.data?.id).toBe('456');
		const search = TwittrApiEndpointOutputSchemas.communitiesSearch.parse({
			data: [community],
			nextCursor: null,
			previousCursor: null,
			hasNextPage: false,
		});
		expect(search.data).toHaveLength(1);
	});

	it('parses trend results', () => {
		const trends = TwittrApiEndpointOutputSchemas.trendsGetByLocation.parse({
			data: [
				{
					name: '#GoLang',
					query: '#GoLang',
					url: 'https://x.com',
					tweetVolume: 100,
				},
			],
			nextCursor: null,
			previousCursor: null,
			hasNextPage: false,
		});
		expect(trends.data[0]?.name).toBe('#GoLang');
		const locations = TwittrApiEndpointOutputSchemas.trendsGetLocations.parse({
			data: [
				{
					woeid: 1,
					name: 'Worldwide',
					country: '',
					countryCode: null,
					placeType: 'Supername',
					parentId: null,
				},
			],
		});
		expect(locations.data[0]?.woeid).toBe(1);
	});

	it('parses monitor responses', () => {
		expect(
			TwittrApiEndpointOutputSchemas.monitorsAddAccounts.parse({
				data: [{ input: 'XDevelopers', userId: '2244994945', status: 'added' }],
			}),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.monitorsListAccounts.parse({
				data: [
					{
						userId: '2244994945',
						username: 'XDevelopers',
						state: 'active',
					},
				],
			}),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.monitorsCreateWebhook.parse({
				webhook: { id: 7, url: 'https://example.com/hooks', active: true },
			}),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.monitorsTestWebhook.parse({
				ok: true,
				statusCode: 200,
				latencyMs: 84,
			}),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.monitorsGetEvents.parse({
				data: [
					{
						event: 'tweet',
						id: '1849204',
						monitoredUserId: '2244994945',
						tweetId: sampleTweet.id,
						tweetCreatedAt: '2026-02-06T21:12:03Z',
						detectedAt: '2026-02-06T21:12:04.017Z',
						tweet: sampleTweet,
					},
				],
				nextSince: '1849204',
				hasMore: false,
			}),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.monitorsGetDeliveries.parse({ data: [] }),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.balanceGet.parse({
				balance: 1.5,
				price_per_call: 0.0001,
				is_active: true,
			}),
		).toBeDefined();
	});

	it('parses every remaining monitor response', () => {
		const webhook = {
			id: 7,
			url: 'https://example.com/hooks',
			label: 'Production',
			accounts: null,
			active: true,
			failureCount: 0,
			disabledAt: null,
			disabledReason: null,
			lastSuccessAt: null,
			lastFailureAt: null,
			createdAt: '2026-10-15T08:00:00Z',
		};
		expect(
			TwittrApiEndpointOutputSchemas.monitorsGetPlan.parse({
				plan: { planId: 'm50-realtime', maxAccounts: 50, status: 'active' },
				webhooks: [webhook],
			}),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.monitorsUpdateAccount.parse({
				data: {
					userId: '2244994945',
					username: 'XDevelopers',
					state: 'active',
					filters: { replies: false, retweets: true, quotes: true },
				},
			}),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.monitorsRemoveAccount.parse({}),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.monitorsListWebhooks.parse({
				data: [webhook],
			}),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.monitorsGetWebhook.parse({
				webhook,
			}),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.monitorsUpdateWebhook.parse({
				webhook,
			}),
		).toBeDefined();
		expect(
			TwittrApiEndpointOutputSchemas.monitorsDeleteWebhook.parse({}),
		).toBeDefined();
	});

	it('treats non-array persistence payloads as empty', async () => {
		// Narrow test-only cast to exercise the non-array guard.
		expect(asArray('nope' as unknown as string[])).toEqual([]);
		expect(asArray(null)).toEqual([]);
		await expect(
			persistUsers('nope' as unknown as never, {}),
		).resolves.toBeUndefined();
	});

	it('accepts partial monitor filter updates', () => {
		const parsed = TwittrApiEndpointInputSchemas.monitorsUpdateAccount.parse({
			usernameOrId: 'XDevelopers',
			filters: { replies: false },
		});
		expect(parsed.filters).toMatchObject({ replies: false });
	});

	it('rejects invalid tweet IDs at the input layer', () => {
		expect(() =>
			TwittrApiEndpointInputSchemas.tweetsGetById.parse({
				tweetId: 'not-a-number!!',
			}),
		).toThrow();
	});

	it('accepts a missing community or list as null (live: unknown community ID)', () => {
		expect(
			TwittrApiEndpointOutputSchemas.communitiesGetById.parse({ data: null })
				.data,
		).toBeNull();
		expect(
			TwittrApiEndpointOutputSchemas.listsGetDetails.parse({ data: null }).data,
		).toBeNull();
	});

	it('accepts one-letter handles such as @X', () => {
		expect(
			TwittrApiEndpointInputSchemas.usersGetByUsername.parse({ username: '@X' })
				.username,
		).toBe('@X');
	});

	it('keeps receiver URL credentials out of event logs', () => {
		expect(redactUrl('https://user:pw@hooks.example.com/tw?token=abc#x')).toBe(
			'https://hooks.example.com',
		);
		expect(
			redactUrl('https://hooks.example.com/incoming/receiver-secret'),
		).toBe('https://hooks.example.com');
		expect(redactUrl('not a url')).toBe('[invalid url]');
	});
});
