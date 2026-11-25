/**
 * Live checks against the real X API: reads only, never a post, DM, follow,
 * like or delete. X bills every read (about $0.20 for this file: two user
 * reads, up to 10 post reads, up to 10 DM event reads, the credits read), so
 * it runs only through `pnpm test:live`.
 *
 * Env: X_ACCESS_TOKEN (an OAuth 2.0 user token), or X_REFRESH_TOKEN +
 * X_CLIENT_ID + X_CLIENT_SECRET to refresh one first through the plugin's own
 * key builder. X rotates the refresh token on that refresh; set
 * X_ROTATED_TOKENS_FILE to have the new pair written there (mode 600) so it
 * can be stored before the old one is lost.
 */
import { writeFileSync } from 'node:fs';
import type { TwitterContext } from './index';
import { twitter } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

const env = process.env;
const canRefresh = Boolean(
	env.X_REFRESH_TOKEN && env.X_CLIENT_ID && env.X_CLIENT_SECRET,
);
const hasToken = Boolean(env.X_ACCESS_TOKEN) || canRefresh;
if (!hasToken) {
	console.warn(
		'[twitter api.test] skipped: set X_ACCESS_TOKEN, or X_REFRESH_TOKEN + X_CLIENT_ID + X_CLIENT_SECRET',
	);
}
const live = hasToken ? describe : describe.skip;

// `unknown` because the walk goes through nested groups of endpoints.
type AnyEndpoint = (ctx: TwitterContext, input: unknown) => Promise<unknown>;
const plugin = twitter();
function endpoint(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = plugin.endpoints;
	for (const part of id.split('.'))
		node = (node as Record<string, unknown>)[part];
	return node as AnyEndpoint;
}

/** Refreshes through the key builder (getOAuthAccessToken), as a connection would. */
async function refreshedToken(): Promise<string> {
	const state: Record<string, string | null> = {
		access_token: env.X_ACCESS_TOKEN ?? null,
		refresh_token: env.X_REFRESH_TOKEN ?? null,
		// Past: forces the refresh.
		expires_at: String(Math.floor(Date.now() / 1000) - 60),
	};
	const persist = () => {
		if (!env.X_ROTATED_TOKENS_FILE) return;
		writeFileSync(
			env.X_ROTATED_TOKENS_FILE,
			JSON.stringify({
				access_token: state.access_token,
				refresh_token: state.refresh_token,
			}),
			{ mode: 0o600 },
		);
	};
	const keys = {
		get_integration_credentials: async () => ({
			client_id: env.X_CLIENT_ID,
			client_secret: env.X_CLIENT_SECRET,
		}),
		get_access_token: async () => state.access_token,
		get_expires_at: async () => state.expires_at,
		get_refresh_token: async () => state.refresh_token,
		set_access_token: async (value: string) => {
			state.access_token = value;
		},
		set_expires_at: async (value: string) => {
			state.expires_at = value;
		},
		set_refresh_token: async (value: string) => {
			state.refresh_token = value;
			// Written the moment it arrives: the old refresh token is already dead.
			persist();
		},
		set_scope: async () => {},
	};
	// `unknown` because the key builder's context is wider than what this check builds.
	const keyBuilder = plugin.keyBuilder as unknown as (
		ctx: unknown,
		source: 'endpoint',
	) => Promise<string>;
	const token = await keyBuilder(
		{ authType: 'oauth_2', keys, tenantId: 'live' },
		'endpoint',
	);
	persist();
	expect(state.refresh_token).not.toBe(env.X_REFRESH_TOKEN);
	console.log(
		'[live] refresh: new access token and a rotated refresh token stored',
	);
	return token;
}

live('X API v2 live reads', () => {
	let ctx: TwitterContext;
	let myId = '';

	beforeAll(async () => {
		const key = canRefresh
			? await refreshedToken()
			: (env.X_ACCESS_TOKEN as string);
		ctx = {
			endpoints: {},
			$getAccountId: () => Promise.resolve('live'),
			key,
			options: { authType: 'oauth_2' },
			keys: {},
			db: {},
			// `unknown` because the live context fills only the fields the endpoints read.
		} as unknown as TwitterContext;
	}, 30_000);

	it('users.me', async () => {
		const me = (await endpoint('users.me')(ctx, {
			'user.fields': ['created_at', 'public_metrics'],
		})) as {
			data: { id: string; username: string; name: string };
		};
		expect(me.data.id).toMatch(/^[0-9]+$/);
		myId = me.data.id;
		console.log(`[live] users.me: @${me.data.username}`);
	});

	it('users.getByUsername XDevelopers', async () => {
		const user = (await endpoint('users.getByUsername')(ctx, {
			username: 'XDevelopers',
			'user.fields': ['public_metrics'],
		})) as {
			data: { username: string; public_metrics?: { followers_count?: number } };
		};
		expect(user.data.username.toLowerCase()).toBe('xdevelopers');
		console.log(
			`[live] users.getByUsername: @${user.data.username}, ${user.data.public_metrics?.followers_count ?? '?'} followers`,
		);
	});

	it('posts.search.recent (max_results 10)', async () => {
		const result = (await endpoint('posts.search.recent')(ctx, {
			query: 'from:XDevelopers -is:retweet',
			max_results: 10,
			'post.fields': ['created_at'],
		})) as {
			data?: { id: string; created_at?: string }[];
			meta: { result_count: number };
		};
		expect(result.meta.result_count).toBeLessThanOrEqual(10);
		const withDates = (result.data ?? []).filter(
			(post) => post.created_at,
		).length;
		console.log(
			`[live] posts.search.recent: ${result.meta.result_count} posts, ${withDates} with created_at`,
		);
	});

	it('directMessages.events.list (counts only)', async () => {
		const result = (await endpoint('directMessages.events.list')(ctx, {
			max_results: 10,
			event_types: ['MessageCreate'],
		})) as {
			data?: { event_type?: string }[];
			meta?: { result_count?: number };
		};
		// Message text is never printed: only how many events came back.
		console.log(
			`[live] directMessages.events.list: ${result.meta?.result_count ?? result.data?.length ?? 0} events`,
		);
		expect(Array.isArray(result.data ?? [])).toBe(true);
	});

	it('usage.credits', async () => {
		const result = (await endpoint('usage.credits')(ctx, {})) as Record<
			string,
			unknown
		>;
		expect(result).toEqual(expect.any(Object));
		console.log(
			`[live] usage.credits: fields ${Object.keys((result.data as object) ?? result).join(', ')}`,
		);
	});

	it('refuses an app-only route with the user token before calling X', async () => {
		await expect(endpoint('usage.get')(ctx, {})).rejects.toThrow(
			/app-only auth/,
		);
		expect(myId).not.toBe('');
	});
});
