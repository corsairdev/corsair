import type { JsonObject, JsonValue } from './client';
import type { HypeAuditorContext } from './index';
import { hypeauditor } from './index';

const CLIENT_ID = 'client-123';
const TOKEN = 'token-secret';

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON until a schema reads it.
function respond(body: JsonValue, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function makeContext() {
	// Both credentials are account fields, so the fixture provides the two
	// getters they generate. The real manager also carries the DEK methods,
	// which these endpoints never read.
	const ctx = {
		authType: 'api_key',
		// The key builder's output: the pair packed as `<clientId>:<token>`.
		key: `${CLIENT_ID}:${TOKEN}`,
		keys: {
			get_client_id: async () => CLIENT_ID,
			get_api_key: async () => TOKEN,
		},
		$getAccountId: jest.fn(async () => 'account-1'),
	};
	// unknown: a stand-in for a context whose type brings the whole key manager.
	return ctx as unknown as HypeAuditorContext;
}

function lastCall() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return {
		parsed: new URL(String(url)),
		init,
		headers: new Headers(init.headers),
		body: init.body ? JSON.parse(String(init.body)) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	fetchMock.mockRestore();
	jest.restoreAllMocks();
});

const plugin = hypeauditor();
const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;

const report = {
	result: {
		report_state: 'READY',
		user: { id: '123', username: 'nasa', full_name: 'NASA' },
		validUntil: 1796143953,
		restTokens: 9924,
	},
};

const media = { result: { items: [] } };
const list = {
	result: [
		{
			id: 0,
			name: 'Recent searches',
			count: 63,
			created: 1502009312,
			updated: 1602857408,
		},
	],
};

describe('request shape', () => {
	const cases: Array<{
		name: string;
		run: (ctx: HypeAuditorContext) => Promise<object>;
		method: string;
		path: string;
		query?: Record<string, string>;
		body?: JsonObject;
		response: JsonValue;
	}> = [
		{
			name: 'reports.instagram',
			run: (ctx) => endpoints.reports.instagram(ctx, { username: 'nasa' }),
			method: 'GET',
			path: '/api/method/auditor.report/',
			query: { username: 'nasa', v: '2' },
			response: report,
		},
		{
			name: 'reports.instagram by user_id',
			run: (ctx) => endpoints.reports.instagram(ctx, { user_id: '123' }),
			method: 'GET',
			path: '/api/method/auditor.reportByUserId/',
			query: { user_id: '123', v: '2' },
			response: report,
		},
		{
			name: 'reports.instagram with type and features',
			run: (ctx) =>
				endpoints.reports.instagram(ctx, {
					username: 'nasa',
					type: 'report',
					features: ['ranking', 'mentions'],
				}),
			method: 'GET',
			path: '/api/method/auditor.report/',
			query: {
				username: 'nasa',
				type: 'report',
				features: 'ranking,mentions',
				v: '2',
			},
			response: report,
		},
		{
			name: 'reports.youtube',
			run: (ctx) => endpoints.reports.youtube(ctx, { channel: 'NASA' }),
			method: 'GET',
			path: '/api/method/auditor.youtube/',
			query: { channel: 'NASA', v: '2' },
			response: report,
		},
		{
			name: 'reports.tiktok',
			run: (ctx) => endpoints.reports.tiktok(ctx, { channel: 'littlebig' }),
			method: 'GET',
			path: '/api/method/auditor.tiktok/',
			query: { channel: 'littlebig', v: '2' },
			response: report,
		},
		{
			name: 'reports.tiktok by user_id',
			run: (ctx) => endpoints.reports.tiktok(ctx, { user_id: '42' }),
			method: 'GET',
			path: '/api/method/auditor.tiktokByUserId/',
			query: { user_id: '42', v: '2' },
			response: report,
		},
		{
			name: 'reports.twitch',
			run: (ctx) => endpoints.reports.twitch(ctx, { channel: 'nasa' }),
			method: 'GET',
			path: '/api/method/auditor.twitch/',
			query: { channel: 'nasa', v: '2' },
			response: report,
		},
		{
			name: 'reports.twitter',
			run: (ctx) => endpoints.reports.twitter(ctx, { channel: 'nasa' }),
			method: 'GET',
			path: '/api/method/auditor.twitter/',
			query: { channel: 'nasa', v: '2' },
			response: report,
		},
		{
			name: 'reports.snapchat',
			run: (ctx) => endpoints.reports.snapchat(ctx, { channel: 'nasa' }),
			method: 'GET',
			path: '/api/method/auditor.snapchat/',
			query: { channel: 'nasa', v: '2' },
			response: report,
		},
		{
			name: 'media.instagram',
			run: (ctx) => endpoints.media.instagram(ctx, { channel: 'nasa' }),
			method: 'GET',
			path: '/api/method/auditor.reportMedia/',
			query: { username: 'nasa', v: '2' },
			response: media,
		},
		{
			name: 'media.youtube',
			run: (ctx) => endpoints.media.youtube(ctx, { channel: 'NASA', page: 2 }),
			method: 'GET',
			path: '/api/method/auditor.youtubeMedia/',
			query: { channel: 'NASA', page: '2', v: '2' },
			response: media,
		},
		{
			name: 'media.tiktok',
			run: (ctx) => endpoints.media.tiktok(ctx, { channel: '1234' }),
			method: 'GET',
			path: '/api/method/auditor.tiktokMedia/',
			query: { channelId: '1234', v: '2' },
			response: media,
		},
		{
			name: 'history.instagram',
			run: (ctx) => endpoints.history.instagram(ctx, { channel: 'nasa' }),
			method: 'GET',
			path: '/api/method/auditor.instagramHistory/',
			query: { username: 'nasa', v: '2' },
			response: media,
		},
		{
			// The dotted form, because `auditor.youtubeHistory` answers
			// `405 code 3 Unknown method passed` live.
			name: 'history.youtube',
			run: (ctx) => endpoints.history.youtube(ctx, { channel: 'NASA' }),
			method: 'GET',
			path: '/api/method/auditor.youtube.history/',
			query: { channel: 'NASA', v: '2' },
			response: media,
		},
		{
			name: 'history.tiktok',
			run: (ctx) => endpoints.history.tiktok(ctx, { channel: 'littlebig' }),
			method: 'GET',
			path: '/api/method/auditor.tiktokHistory/',
			query: { channel: 'littlebig', v: '2' },
			response: media,
		},
		{
			name: 'history.twitch',
			run: (ctx) => endpoints.history.twitch(ctx, { channel: 'nasa' }),
			method: 'GET',
			path: '/api/method/auditor.twitchHistory/',
			query: { channel: 'nasa', v: '2' },
			response: media,
		},
		{
			name: 'history.twitter',
			run: (ctx) => endpoints.history.twitter(ctx, { channel: 'nasa' }),
			method: 'GET',
			path: '/api/method/auditor.twitterHistory/',
			query: { channel: 'nasa', v: '2' },
			response: media,
		},
		{
			name: 'mentions.youtube',
			run: (ctx) => endpoints.mentions.youtube(ctx, { channel: 'NASA' }),
			method: 'GET',
			path: '/api/method/auditor.youtubeBrandMentions/',
			query: { channel: 'NASA', v: '2' },
			response: media,
		},
		{
			name: 'mentions.tiktok',
			run: (ctx) => endpoints.mentions.tiktok(ctx, { channel: 'littlebig' }),
			method: 'GET',
			path: '/api/method/auditor.tiktokBrandMentions/',
			query: { channel: 'littlebig', v: '2' },
			response: media,
		},
		{
			name: 'discovery.search',
			run: (ctx) =>
				endpoints.discovery.search(ctx, {
					social_network: 'instagram',
					filters: { search: ['nasa'], er: { from: 1, to: 10 } },
					page: 2,
				}),
			method: 'POST',
			path: '/api/method/auditor.search/',
			query: { v: '2' },
			body: {
				search: ['nasa'],
				er: { from: 1, to: 10 },
				social_network: 'instagram',
				page: 2,
			},
			response: media,
		},
		{
			name: 'discovery.search in the sandbox',
			run: (ctx) =>
				endpoints.discovery.search(ctx, {
					social_network: 'youtube',
					sandbox: true,
				}),
			method: 'POST',
			path: '/api/method/auditor.searchSandbox/',
			query: { v: '2' },
			body: { social_network: 'youtube' },
			response: media,
		},
		{
			name: 'discovery.keywords',
			run: (ctx) =>
				endpoints.discovery.keywords(ctx, {
					socialNetwork: 'instagram',
					contentIds: '1,2',
				}),
			method: 'GET',
			path: '/api/method/auditor.searchKeywordsPosts/',
			query: { socialNetwork: 'instagram', contentIds: '1,2', v: '2' },
			response: media,
		},
		{
			name: 'lists.list',
			run: (ctx) => endpoints.lists.list(ctx, {}),
			method: 'GET',
			path: '/api/method/auditor.lists',
			query: { v: '2' },
			response: list,
		},
		{
			name: 'lists.items',
			run: (ctx) =>
				endpoints.lists.items(ctx, { id: 0, limit: 10, offset: 20 }),
			method: 'GET',
			path: '/api/method/auditor.list',
			query: { id: '0', limit: '10', offset: '20', v: '2' },
			response: { result: [] },
		},
		{
			name: 'lists.add',
			run: (ctx) =>
				endpoints.lists.add(ctx, {
					list_id: 483,
					channel_id: 'nasa',
					type: 'IG',
				}),
			method: 'GET',
			path: '/api/method/auditor.addToList',
			query: { list_id: '483', channel_id: 'nasa', type: 'IG', v: '2' },
			response: { result: true },
		},
		{
			name: 'lists.remove',
			run: (ctx) =>
				endpoints.lists.remove(ctx, { report_id: 6456, list_id: 483 }),
			method: 'GET',
			path: '/api/method/auditor.removeFromList',
			query: { report_id: '6456', list_id: '483', v: '2' },
			response: { result: true },
		},
		{
			name: 'account.planInfo',
			run: (ctx) => endpoints.account.planInfo(ctx, {}),
			method: 'GET',
			path: '/api/method/auditor.planInfo/',
			query: { v: '2' },
			response: { result: { report_left: 5 } },
		},
		{
			name: 'account.unlockedReports',
			run: (ctx) =>
				endpoints.account.unlockedReports(ctx, {
					limit: 10,
					date_from: '2024-01-01',
				}),
			method: 'GET',
			path: '/api/method/auditor.reportsUnlocked',
			query: { limit: '10', date_from: '2024-01-01', v: '2' },
			response: { result: [] },
		},
		{
			name: 'suggester.get',
			run: (ctx) => endpoints.suggester.get(ctx, { search: 'nas', st: 'IG' }),
			method: 'GET',
			path: '/api/method/auditor.suggester',
			query: { search: 'nas', st: 'IG', v: '2' },
			response: { result: [] },
		},
		{
			name: 'taxonomy.get',
			run: (ctx) => endpoints.taxonomy.get(ctx, {}),
			method: 'GET',
			path: '/api/method/auditor.taxonomy/',
			query: { v: '2' },
			response: { result: {} },
		},
	];

	it.each(cases)('$name sends $method $path', async (testCase) => {
		respond(testCase.response);

		await testCase.run(makeContext());

		const { parsed, init, headers, body } = lastCall();
		expect(init.method).toBe(testCase.method);
		expect(parsed.pathname).toBe(testCase.path);
		// Both credentials travel as headers, never in the URL.
		expect(headers.get('x-auth-id')).toBe(CLIENT_ID);
		expect(headers.get('x-auth-token')).toBe(TOKEN);
		expect(parsed.search).not.toContain(TOKEN);

		for (const [key, value] of Object.entries(testCase.query ?? {})) {
			expect([key, parsed.searchParams.get(key)]).toEqual([key, value]);
		}
		expect([...parsed.searchParams.keys()].sort()).toEqual(
			Object.keys(testCase.query ?? {}).sort(),
		);

		if (testCase.body !== undefined) {
			expect(body).toEqual(testCase.body);
		} else {
			expect(init.body).toBeUndefined();
		}
	});

	// The registry has 26 operations; the table above exercises each one, and a
	// few of them twice for the second identifier form.
	it('covers every registered operation', () => {
		const registered: string[] = [];
		for (const [group, members] of Object.entries(endpoints)) {
			for (const name of Object.keys(members as object)) {
				registered.push(`${group}.${name}`);
			}
		}
		const covered = new Set(
			cases.map((c) =>
				c.name.replace(
					/ (by user_id|with type and features|in the sandbox)$/,
					'',
				),
			),
		);
		expect([...covered].sort()).toEqual(registered.sort());
	});

	// The API's own default version moves, and these schemas are written against
	// v2, so the version is sent explicitly on every action.
	it('sends the documented version on every call', async () => {
		respond(list);
		await endpoints.lists.list(makeContext(), {});
		expect(lastCall().parsed.searchParams.get('v')).toBe('2');

		respond(media);
		await endpoints.discovery.search(makeContext(), {
			social_network: 'instagram',
		});
		expect(lastCall().parsed.searchParams.get('v')).toBe('2');
	});
});

describe('input rules the API documents', () => {
	it('refuses a report request naming both username and user_id', async () => {
		await expect(
			endpoints.reports.instagram(makeContext(), {
				username: 'nasa',
				user_id: '1',
			}),
		).rejects.toBeDefined();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refuses a report request naming neither', async () => {
		await expect(
			endpoints.reports.tiktok(makeContext(), {}),
		).rejects.toBeDefined();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refuses a report type outside the two documented ones', async () => {
		await expect(
			endpoints.reports.youtube(makeContext(), {
				channel: 'NASA',
				type: 'full_report' as never,
			}),
		).rejects.toBeDefined();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refuses a discovery page beyond the documented maximum of 500', async () => {
		await expect(
			endpoints.discovery.search(makeContext(), {
				social_network: 'instagram',
				page: 501,
			}),
		).rejects.toBeDefined();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refuses a discovery network outside the five documented ones', async () => {
		await expect(
			endpoints.discovery.search(makeContext(), {
				social_network: 'snapchat' as never,
			}),
		).rejects.toBeDefined();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('error translation', () => {
	it('keeps the numeric body code and the description', async () => {
		respond({ error: { code: 4, description: 'Invalid token' } }, 403);

		const error = (await endpoints.reports
			.youtube(makeContext(), { channel: 'NASA' })
			.catch((caught) => caught)) as Error & { status?: number; code?: number };

		expect(error.status).toBe(403);
		expect(error.code).toBe(4);
		expect(error.message).toBe('HypeAuditor 403 4: Invalid token');
	});

	it('reports an unknown action by its code', async () => {
		respond({ error: { code: 3, description: 'Unknown method passed' } }, 405);

		const error = (await endpoints.lists
			.list(makeContext(), {})
			.catch((caught) => caught)) as Error & { code?: number };

		expect(error.code).toBe(3);
	});

	it('does not put either credential in the error', async () => {
		respond(
			{ error: { code: 31, description: 'Account has not enough followers' } },
			400,
		);

		const error = (await endpoints.reports
			.instagram(makeContext(), { username: 'nasa' })
			.catch((caught) => caught)) as Error;

		const inspect = require('node:util').inspect(error) as string;
		expect(error.message).not.toContain(TOKEN);
		expect(inspect).not.toContain(TOKEN);
		expect(inspect).not.toContain(CLIENT_ID);
		expect(JSON.stringify(error)).not.toContain(TOKEN);
	});

	it('reports a missing credential as missing auth', async () => {
		const ctx = {
			authType: 'api_key',
			keys: {
				get_client_id: async () => CLIENT_ID,
				get_api_key: async () => undefined,
			},
			$getAccountId: async () => 'a',
		} as unknown as HypeAuditorContext; // unknown: fixture, see makeContext

		await expect(endpoints.lists.list(ctx, {})).rejects.toBeDefined();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
