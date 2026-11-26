import { createCorsair } from 'corsair/core';
import { SCRAPECREATORS_MAX_QUERY_LENGTH } from './endpoints/operations';
import { scrapecreators } from './index';

// Every call goes through createCorsair, so core's binding, the plugin's
// error handlers and the transport run as in production. fetch is mocked.

type Sent = {
	url: URL;
	method: string;
	headers: Headers;
	// unknown: request bodies are parsed JSON, read with matchers.
	body: unknown;
};

function mockFetch(
	// unknown: each test answers with its own JSON or text.
	respond: (req: Sent) => {
		status?: number;
		body: unknown;
		type?: string;
	} = () => ({
		body: { success: true, credits_remaining: 100, credits_charged: 1 },
	}),
) {
	const sent: Sent[] = [];
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const raw = init?.body;
		const req: Sent = {
			url: new URL(String(input instanceof Request ? input.url : input)),
			method: init?.method ?? 'GET',
			headers: new Headers(init?.headers),
			body: typeof raw === 'string' && raw ? JSON.parse(raw) : undefined,
		};
		sent.push(req);
		const { status = 200, body, type = 'application/json' } = respond(req);
		return new Response(
			typeof body === 'string' ? body : JSON.stringify(body),
			{
				status,
				headers: { 'content-type': type },
			},
		);
	});
	return sent;
}

function client() {
	return createCorsair({
		plugins: [scrapecreators({ key: 'sc_test_key' })],
	}).scrapecreators.api;
}

beforeEach(() => {
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('scrapecreators requests', () => {
	it('sends a GET to the route with the key in x-api-key', async () => {
		const sent = mockFetch(() => ({
			body: {
				success: true,
				credits_remaining: 100,
				credits_charged: 1,
				user: { uniqueId: 'nasa' },
				stats: { followerCount: 1 },
			},
		}));
		const result = await client().tiktok.profile({ handle: 'nasa' });

		expect(sent).toHaveLength(1);
		expect(sent[0]?.method).toBe('GET');
		expect(sent[0]?.url.origin).toBe('https://api.scrapecreators.com');
		expect(sent[0]?.url.pathname).toBe('/v1/tiktok/profile');
		expect(sent[0]?.url.searchParams.get('handle')).toBe('nasa');
		expect(sent[0]?.headers.get('x-api-key')).toBe('sc_test_key');
		expect(result.user).toEqual({ uniqueId: 'nasa' });
		expect(result.credits_charged).toBe(1);
	});

	it.each([
		['tiktok.profileVideos', '/v3/tiktok/profile/videos', { handle: 'nasa' }],
		[
			'tiktok.video',
			'/v2/tiktok/video',
			{ url: 'https://www.tiktok.com/@nasa/video/1' },
		],
		['instagram.userPosts', '/v2/instagram/user/posts', { handle: 'nasa' }],
		[
			'instagram.postComments',
			'/v2/instagram/post/comments',
			{ url: 'https://www.instagram.com/p/x/' },
		],
		['youtube.channelVideos', '/v1/youtube/channel-videos', { handle: 'NASA' }],
		['twitter.userTweets', '/v1/twitter/user-tweets', { handle: 'NASA' }],
		['appleMusic.search', '/v1/apple-music/search', { query: 'coldplay' }],
		['truthSocial.profile', '/v1/truthsocial/profile', { handle: 'x' }],
		[
			'linkInBio.linktree',
			'/v1/linktree',
			{ url: 'https://linktr.ee/linktree' },
		],
		[
			'creators.findSocialProfiles',
			'/v1/find-social-profiles',
			{ platform: 'instagram', handle: 'nasa' },
		],
		['tiktok.trendingFeed', '/v1/tiktok/get-trending-feed', { region: 'US' }],
		[
			'google.adLibrarySearchAdvertisers',
			'/v1/google/adLibrary/advertisers/search',
			{ query: 'nike' },
		],
	] as const)('%s calls %s', async (id, path, input) => {
		const sent = mockFetch();
		const [group, action] = id.split('.') as [string, string];
		// unknown: the table calls operations of different input types through one signature.
		const api = client() as unknown as Record<
			string,
			Record<string, (i: object) => Promise<unknown>>
		>;
		await api[group]?.[action]?.(input);
		expect(sent[0]?.url.pathname).toBe(path);
		for (const [name, value] of Object.entries(input)) {
			expect(sent[0]?.url.searchParams.get(name)).toBe(value);
		}
	});

	it('writes booleans and numbers into the query string', async () => {
		const sent = mockFetch();
		await client().tiktok.video({
			url: 'https://www.tiktok.com/@nasa/video/1',
			get_transcript: true,
			trim: false,
		});
		await client().facebook.marketplaceSearch({
			lat: 30.2677,
			lng: -97.7475,
			radius_km: 10,
		});
		expect(sent[0]?.url.searchParams.get('get_transcript')).toBe('true');
		expect(sent[0]?.url.searchParams.get('trim')).toBe('false');
		expect(sent[1]?.url.searchParams.get('radius_km')).toBe('10');
	});

	it('refuses a missing required field before any request', async () => {
		const sent = mockFetch();
		await expect(
			// @ts-expect-error url is required
			client().tiktok.video({}),
		).rejects.toThrow();
		expect(sent).toHaveLength(0);
	});

	it('refuses an unknown field instead of spending a credit on it', async () => {
		const sent = mockFetch();
		await expect(
			// @ts-expect-error `username` is not a parameter (it is `handle`)
			client().tiktok.profile({ username: 'nasa' }),
		).rejects.toThrow();
		expect(sent).toHaveLength(0);
	});

	it('refuses a value outside an enum', async () => {
		const sent = mockFetch();
		await expect(
			client().tiktok.profile({
				handle: 'nasa',
				// @ts-expect-error not one of 1d/3d/7d/14d/30d
				cache_max_age: '2d',
			}),
		).rejects.toThrow();
		expect(sent).toHaveLength(0);
	});

	it('keeps short Ad Library searches on GET', async () => {
		const sent = mockFetch();
		await client().facebook.adLibrarySearchAds({
			query: 'nike',
			cursor: 'abc',
		});
		expect(sent[0]?.method).toBe('GET');
		expect(sent[0]?.url.searchParams.get('cursor')).toBe('abc');
	});

	it('moves to a POST body when a cursor makes the query too long', async () => {
		const sent = mockFetch();
		const cursor = 'c'.repeat(SCRAPECREATORS_MAX_QUERY_LENGTH + 1);
		await client().facebook.adLibrarySearchAds({ query: 'nike', cursor });
		expect(sent[0]?.method).toBe('POST');
		expect(sent[0]?.url.pathname).toBe('/v1/facebook/adLibrary/search/ads');
		expect(sent[0]?.url.search).toBe('');
		expect(sent[0]?.body).toEqual({ query: 'nike', cursor });
		expect(sent[0]?.headers.get('content-type')).toContain('application/json');
	});

	it('never POSTs a route that only takes GET, however long the query', async () => {
		const sent = mockFetch();
		await client().youtube.channelVideos({
			handle: 'NASA',
			continuationToken: 't'.repeat(SCRAPECREATORS_MAX_QUERY_LENGTH + 1),
		});
		expect(sent[0]?.method).toBe('GET');
	});

	it('reads the credit balance that is sent as text/plain JSON', async () => {
		mockFetch(() => ({
			body: '{"success":true,"creditCount":3807,"message":"You have 3807 credits remaining."}',
			type: 'text/plain; charset=utf-8',
		}));
		const balance = await client().account.creditBalance({});
		expect(balance.creditCount).toBe(3807);
		expect(balance.success).toBe(true);
	});

	it('returns the account usage lists as arrays', async () => {
		mockFetch(() => ({
			body: [
				{
					base_endpoint: '/v1/tiktok/profile',
					call_count: '3',
					total_credits: '3',
				},
			],
		}));
		const routes = await client().account.mostUsedRoutes({});
		expect(Array.isArray(routes)).toBe(true);
		expect(routes).toHaveLength(1);
	});

	it('keeps fields the example did not show', async () => {
		mockFetch(() => ({
			body: { success: true, credits_charged: 1, user: {}, newField: 'x' },
		}));
		const result = await client().tiktok.profile({ handle: 'nasa' });
		expect(result.newField).toBe('x');
	});

	it('accepts ids and counts as strings or numbers', async () => {
		mockFetch(() => ({
			body: {
				success: true,
				credits_charged: 1,
				max_cursor: 5,
				has_more: true,
			},
		}));
		await expect(
			client().tiktok.profileVideos({ handle: 'nasa' }),
		).resolves.toEqual(expect.objectContaining({ max_cursor: 5 }));
	});

	it('rejects a body whose documented field has the wrong kind', async () => {
		mockFetch(() => ({
			body: { success: true, credits_charged: 1, user: 'not-an-object' },
		}));
		await expect(client().tiktok.profile({ handle: 'nasa' })).rejects.toThrow();
	});
});
