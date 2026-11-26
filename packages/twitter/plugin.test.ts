import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { twitterOperations } from './endpoints/manifest';
import {
	errorHandlers,
	isQuotaExhausted,
	X_MAX_RATE_LIMIT_WAIT_MS,
} from './error-handlers';
import { twitter, X_DEFAULT_SCOPES, X_EXTRA_SCOPES } from './index';
import { mockFetch } from './test-helpers';

// `unknown` because each case gives the key builder only the context fields it reads.
type KeyBuilder = (
	ctx: unknown,
	source: 'endpoint' | 'webhook',
) => Promise<string>;

function keyBuilderOf(plugin: ReturnType<typeof twitter>): KeyBuilder {
	// `unknown` because the key builder's real context type is wider than what these cases build.
	return plugin.keyBuilder as unknown as KeyBuilder;
}

/**
 * The account and integration key store the key builder reads and writes, in
 * memory, recording every write.
 */
function oauthKeys(initial: {
	accessToken: string | null;
	expiresAt: string | null;
	refreshToken: string | null;
}) {
	const state = { ...initial, scope: null as string | null };
	const writes: string[] = [];
	return {
		state,
		writes,
		keys: {
			get_integration_credentials: async () => ({
				client_id: 'x-client-id',
				client_secret: 'x-client-secret',
			}),
			get_access_token: async () => state.accessToken,
			get_expires_at: async () => state.expiresAt,
			get_refresh_token: async () => state.refreshToken,
			set_access_token: async (value: string) => {
				writes.push('access_token');
				state.accessToken = value;
			},
			set_expires_at: async (value: string) => {
				writes.push('expires_at');
				state.expiresAt = value;
			},
			set_refresh_token: async (value: string) => {
				writes.push('refresh_token');
				state.refreshToken = value;
			},
			set_scope: async (value: string) => {
				writes.push('scope');
				state.scope = value;
			},
		},
	};
}

const realFetch = global.fetch;
afterEach(() => {
	global.fetch = realFetch;
});

describe('twitter plugin', () => {
	it('keeps the id twitter, every generated operation and the two legacy endpoints', () => {
		const plugin = twitter();
		expect(plugin.id).toBe('twitter');
		expect(plugin.options?.authType).toBe('oauth_2');
		const meta = Object.keys(plugin.endpointMeta ?? {}).sort();
		expect(meta).toEqual(
			[
				...twitterOperations.map((o) => o.id),
				'tweets.create',
				'tweets.createReply',
			].sort(),
		);
		expect(meta).toHaveLength(259);
		expect(plugin.endpoints?.tweets.create).toEqual(expect.any(Function));
		expect(plugin.endpoints?.tweets.createReply).toEqual(expect.any(Function));
		expect(plugin.endpoints?.posts.search.recent).toEqual(expect.any(Function));
		expect(plugin.endpoints?.directMessages.sendToParticipant).toEqual(
			expect.any(Function),
		);
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(meta);
	});

	it('signs in with OAuth 2.0 Authorization Code + PKCE on x.com', () => {
		const plugin = twitter();
		expect(plugin.oauthConfig).toEqual({
			providerName: 'X',
			authUrl: 'https://x.com/i/oauth2/authorize',
			tokenUrl: 'https://api.x.com/2/oauth2/token',
			pkce: true,
			tokenAuthMethod: 'basic',
			scopes: [...X_DEFAULT_SCOPES],
		});
		expect(plugin.oauthConfig?.scopes).toContain('offline.access');
		const wider = twitter({ scopes: [...X_DEFAULT_SCOPES, ...X_EXTRA_SCOPES] });
		expect(wider.oauthConfig?.scopes).toContain('broadcast.write');
	});

	it('marks posts, DMs, going live and deletes destructive; reads read', () => {
		const meta = twitter().endpointMeta as Record<
			string,
			{ riskLevel: string; irreversible?: boolean }
		>;
		for (const id of [
			'posts.create',
			'tweets.create',
			'tweets.createReply',
			'users.reposts.create',
			'directMessages.sendToParticipant',
			'directMessages.sendToConversation',
			'directMessages.conversations.create',
			'chat.messages.send',
			'broadcasts.create',
			// Revokes the token of a bot whose handle already exists.
			'bots.create',
			// Email the invitees unless notify_invitees is false.
			'calls.scheduled.create',
			'calls.scheduled.update',
			// delete / delete_all removes the active rules.
			'posts.streamRules.update',
			// Also removes any follow between the accounts, for good.
			'users.blocking.block',
		]) {
			expect([id, meta[id]?.riskLevel]).toEqual([id, 'destructive']);
		}
		expect(meta['posts.delete']).toMatchObject({
			riskLevel: 'destructive',
			irreversible: true,
		});
		expect(meta['directMessages.events.delete']?.riskLevel).toBe('destructive');
		expect(meta['users.likes.unlike']?.riskLevel).toBe('write');
		expect(meta['users.following.follow']?.riskLevel).toBe('write');
		expect(meta['users.me']?.riskLevel).toBe('read');
		expect(meta['posts.search.recent']?.riskLevel).toBe('read');
		// Reading a message request marks its messages delivered: not read-only.
		expect(meta['chat.messageRequests.get']?.riskLevel).toBe('write');
		expect(meta['chat.messageRequests.list']?.riskLevel).toBe('read');
		for (const operation of twitterOperations) {
			if (
				operation.method === 'GET' &&
				operation.id !== 'chat.messageRequests.get'
			) {
				expect([operation.id, meta[operation.id]?.riskLevel]).toEqual([
					operation.id,
					'read',
				]);
			}
		}
	});

	it('says in the description which routes X removed from self-serve', () => {
		const meta = twitter().endpointMeta as Record<
			string,
			{ description: string }
		>;
		expect(meta['users.following.follow']?.description).toMatch(
			/2026-04-20.*403/,
		);
		expect(meta['users.likes.like']?.description).toMatch(/2026-04-20.*403/);
		expect(meta['posts.create']?.description).toMatch(/\$0\.015.*\$0\.20/);
	});
});

describe('key builder', () => {
	it('uses the key passed in options', async () => {
		await expect(
			keyBuilderOf(twitter({ key: 'option-token' }))(
				{ authType: 'oauth_2' },
				'endpoint',
			),
		).resolves.toBe('option-token');
	});

	it("returns the stored app Bearer token for authType 'api_key'", async () => {
		const plugin = twitter({ authType: 'api_key' });
		await expect(
			keyBuilderOf(plugin)(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'app-bearer' },
				},
				'endpoint',
			),
		).resolves.toBe('app-bearer');
		await expect(
			keyBuilderOf(plugin)(
				{ authType: 'api_key', keys: { get_api_key: async () => null } },
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('returns a fresh access token without refreshing', async () => {
		const { keys, writes } = oauthKeys({
			accessToken: 'fresh-access',
			expiresAt: String(Math.floor(Date.now() / 1000) + 3600),
			refreshToken: 'refresh-1',
		});
		const { fetchMock } = mockFetch();
		await expect(
			keyBuilderOf(twitter())(
				{ authType: 'oauth_2', keys, tenantId: 't1' },
				'endpoint',
			),
		).resolves.toBe('fresh-access');
		expect(fetchMock).not.toHaveBeenCalled();
		expect(writes).toEqual([]);
	});

	it('refreshes an expired token and keeps the rotated refresh token', async () => {
		const { keys, state } = oauthKeys({
			accessToken: 'old-access',
			expiresAt: String(Math.floor(Date.now() / 1000) - 60),
			refreshToken: 'refresh-1',
		});
		const { sent } = mockFetch({
			body: {
				token_type: 'bearer',
				expires_in: 7200,
				access_token: 'new-access',
				scope: 'tweet.read users.read offline.access',
				refresh_token: 'refresh-2',
			},
		});
		await expect(
			keyBuilderOf(twitter())(
				{ authType: 'oauth_2', keys, tenantId: 't-rotate' },
				'endpoint',
			),
		).resolves.toBe('new-access');

		expect(sent).toHaveLength(1);
		expect(sent[0]!.url).toBe('https://api.x.com/2/oauth2/token');
		expect(sent[0]!.method).toBe('POST');
		expect(sent[0]!.headers.authorization).toBe(
			`Basic ${Buffer.from('x-client-id:x-client-secret').toString('base64')}`,
		);
		expect(sent[0]!.body).toEqual({
			grant_type: 'refresh_token',
			refresh_token: 'refresh-1',
		});

		// The old refresh token stops working at X once it's used: the new one is stored.
		expect(state.refreshToken).toBe('refresh-2');
		expect(state.accessToken).toBe('new-access');
		const expiresAt = Number(state.expiresAt);
		expect(expiresAt).toBeGreaterThan(Math.floor(Date.now() / 1000) + 7000);

		// The next call reads the stored pair and spends refresh-2, not refresh-1.
		state.expiresAt = String(Math.floor(Date.now() / 1000) - 1);
		const second = mockFetch({
			body: {
				access_token: 'newer-access',
				refresh_token: 'refresh-3',
				expires_in: 7200,
			},
		});
		await keyBuilderOf(twitter())(
			{ authType: 'oauth_2', keys, tenantId: 't-rotate' },
			'endpoint',
		);
		expect(second.sent[0]!.body).toEqual({
			grant_type: 'refresh_token',
			refresh_token: 'refresh-2',
		});
		expect(state.refreshToken).toBe('refresh-3');
	});

	it('refuses a route that takes the other token kind before reading or refreshing credentials', async () => {
		const { keys, writes, state } = oauthKeys({
			accessToken: 'old-access',
			expiresAt: String(Math.floor(Date.now() / 1000) - 60),
			refreshToken: 'refresh-1',
		});
		const { fetchMock } = mockFetch();
		await expect(
			keyBuilderOf(twitter())(
				{
					authType: 'oauth_2',
					keys,
					tenantId: 't-guard',
					meteredOperationId: 'usage.get',
				},
				'endpoint',
			),
		).rejects.toThrow(/app-only auth on usage\.get/);
		expect(fetchMock).not.toHaveBeenCalled();
		expect(writes).toEqual([]);
		expect(state.refreshToken).toBe('refresh-1');
		await expect(
			keyBuilderOf(twitter({ authType: 'api_key' }))(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => 'app-bearer' },
					meteredOperationId: 'directMessages.events.list',
				},
				'endpoint',
			),
		).rejects.toThrow(/user's OAuth 2\.0 token/);
	});

	it('surfaces X refusing a spent refresh token with its error code', async () => {
		const { keys } = oauthKeys({
			accessToken: 'old-access',
			expiresAt: String(Math.floor(Date.now() / 1000) - 60),
			refreshToken: 'already-used',
		});
		mockFetch({
			status: 400,
			body: {
				error: 'invalid_request',
				error_description: 'Value passed for the token was invalid.',
			},
		});
		await expect(
			keyBuilderOf(twitter())(
				{ authType: 'oauth_2', keys, tenantId: 't-dead' },
				'endpoint',
			),
		).rejects.toThrow(/OAuth token refresh failed \(400 invalid_request\)/);
	});
});

describe('error handlers', () => {
	function apiError(status: number, retryAfter?: number): ApiError {
		return new ApiError(
			{ method: 'GET', url: '/2/users/me' },
			{
				url: 'https://api.x.com/2/users/me',
				ok: false,
				status,
				statusText: 'x',
				body: {},
			},
			`X ${status}`,
			retryAfter === undefined ? undefined : { retryAfter },
		);
	}

	it('waits out a short rate-limit window once and reports a long one', async () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError(429))).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(apiError(429, 5_000)),
		).resolves.toEqual({ maxRetries: 1, headersRetryAfterMs: 5_000 });
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(
				apiError(429, X_MAX_RATE_LIMIT_WAIT_MS + 1),
			),
		).resolves.toEqual({ maxRetries: 0 });
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(apiError(429)),
		).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('never retries a 429 for a spent daily or monthly cap', async () => {
		const capped = (body: Record<string, string>) =>
			new ApiError(
				{
					method: 'POST',
					url: '/2/dm_conversations/with/{participant_id}/messages',
				},
				{
					url: 'https://api.x.com/2/dm_conversations',
					ok: false,
					status: 429,
					statusText: 'x',
					body,
				},
				'X 429',
				{ retryAfter: 5_000 },
			);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(
				capped({
					title: 'UsageCapExceeded',
					detail: 'Usage cap exceeded: Monthly product cap',
				}),
			),
		).resolves.toEqual({ maxRetries: 0 });
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(
				capped({
					title: 'Too Many Requests',
					detail: 'You have reached the 24 hour limit for Direct Messages.',
				}),
			),
		).resolves.toEqual({ maxRetries: 0 });
		expect(
			isQuotaExhausted(
				capped({ title: 'Too Many Requests', detail: 'Too Many Requests' }),
			),
		).toBe(false);
	});

	it('routes 401, 403, 404, 400 and 5xx to their handlers without retrying', async () => {
		expect(errorHandlers.AUTH_ERROR.match(apiError(401))).toBe(true);
		expect(errorHandlers.PERMISSION_ERROR.match(apiError(403))).toBe(true);
		expect(errorHandlers.NOT_FOUND_ERROR.match(apiError(404))).toBe(true);
		expect(errorHandlers.BAD_REQUEST_ERROR.match(apiError(400))).toBe(true);
		expect(errorHandlers.SERVER_ERROR.match(apiError(503))).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(apiError(403))).toBe(false);
		await expect(errorHandlers.SERVER_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});
