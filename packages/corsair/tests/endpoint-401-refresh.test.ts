import { createCorsair } from '../core';
import { formatDefaultAuthMissingMessage } from '../core/auth/auth-missing-message';
import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import { AuthMissingError } from '../core/auth/errors';
import { getOAuthAccessToken } from '../core/auth/oauth-access';
import {
	classifyOAuthRefreshFailure,
	OAuthRefreshError,
} from '../core/auth/oauth-refresh-local';
import { isUnauthorizedError } from '../core/endpoints/bind';
import type { CorsairPlugin } from '../core/plugins';
import { createTestDatabase } from './setup-db';

const KEK = 'test-kek-with-at-least-32-characters!!';
const TOKEN_URL = 'https://provider.test/oauth/token';

// The keyBuilder puts `_refreshAuth` on the ctx it is given. An OAuth plugin's
// endpoint calls it after a 401 to mint a new token and retry. The endpoint
// must therefore get that same ctx; a copy made before the keyBuilder ran
// drops the callback, and the 401 goes back to the caller unretried.

async function seed(
	database: ReturnType<typeof createTestDatabase>['database'],
) {
	const now = new Date();
	const dek = generateDEK();
	const encryptedDek = await encryptDEK(dek, KEK);
	await database.db
		.insertInto('corsair_integrations')
		.values({
			id: 'integration-probe',
			created_at: now,
			updated_at: now,
			name: 'probe',
			config: encryptConfig(
				{ client_id: 'cid', client_secret: 'csecret' },
				dek,
			),
			dek: encryptedDek,
		})
		.execute();
	await database.db
		.insertInto('corsair_accounts')
		.values({
			id: 'account-default',
			created_at: now,
			updated_at: now,
			tenant_id: 'default',
			integration_id: 'integration-probe',
			// Looks fresh for another day, so the keyBuilder hands it out as is,
			// but the provider has revoked it.
			config: encryptConfig(
				{
					access_token: 'revoked',
					expires_at: String(Math.floor(Date.now() / 1000) + 86_400),
					refresh_token: 'rt',
				},
				dek,
			),
			dek: encryptedDek,
		})
		.execute();
}

class UnauthorizedError extends Error {
	status = 401;
}

class ServerError extends Error {
	status = 500;
}

type ProbeCtx = { key: string; _refreshAuth?: () => Promise<string> };
type ProbeArgs = Record<string, never>;
type ProbeResult = { ok: true; key: string };
type OAuthCtx = Parameters<typeof getOAuthAccessToken>[0];

type ProbeOptions = {
	withHooks?: boolean;
	// The endpoint catches its own 401 and calls ctx._refreshAuth, as Gmail,
	// GitHub and the other older OAuth plugins do. Without it, core retries.
	ownRetry?: boolean;
	// Keys the provider rejects: 'revoked' always; 'fresh' too when the refresh
	// does not help (the grant itself is gone).
	rejected?: string[];
	// What a rejected key fails with.
	failure?: 'unauthorized' | 'server';
	// What the provider's token endpoint answers the refresh with.
	tokenReply?: {
		status: number;
		body: { access_token?: string; expires_in?: number; error?: string };
	};
	// The plugin opts out of core's retry.
	refreshOnUnauthorized?: false;
	// Declared risk level of items.list; core retries only reads.
	riskLevel?: 'read' | 'write';
};

function probePlugin(seen: string[], opts: ProbeOptions = {}): CorsairPlugin {
	const rejected = opts.rejected ?? ['revoked'];
	const callProvider = (key: string): ProbeResult => {
		seen.push(key);
		if (rejected.includes(key)) {
			throw opts.failure === 'server'
				? new ServerError('500')
				: new UnauthorizedError('401');
		}
		return { ok: true, key };
	};
	return {
		id: 'probe',
		options: { authType: 'oauth_2' },
		endpointMeta: { 'items.list': { riskLevel: opts.riskLevel ?? 'read' } },
		...(opts.refreshOnUnauthorized === false
			? { refreshOnUnauthorized: false }
			: {}),
		...(opts.withHooks
			? {
					hooks: {
						items: {
							list: {
								before: async (ctx: ProbeCtx, args: ProbeArgs) => ({
									ctx,
									args,
								}),
							},
						},
					},
				}
			: {}),
		endpoints: {
			items: {
				list: async (ctx: ProbeCtx, _args: ProbeArgs) => {
					if (!opts.ownRetry) return callProvider(ctx.key);
					try {
						return callProvider(ctx.key);
					} catch (error) {
						if (error instanceof UnauthorizedError && ctx._refreshAuth) {
							return callProvider(await ctx._refreshAuth());
						}
						throw error;
					}
				},
			},
		},
		keyBuilder: async (ctx: OAuthCtx) =>
			getOAuthAccessToken(ctx, { plugin: 'probe', tokenUrl: TOKEN_URL }),
		// CorsairPlugin's generics are inferred from a real plugin's schema and
		// endpoint tree; this one-endpoint stand-in has neither, so it is cast.
	} as unknown as CorsairPlugin;
}

async function run(opts: ProbeOptions) {
	const { database, cleanup } = createTestDatabase();
	try {
		await seed(database);
		const tokenCalls: string[] = [];
		jest.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
			tokenCalls.push(String(input));
			const reply = opts.tokenReply ?? {
				status: 200,
				body: { access_token: 'fresh', expires_in: 3600 },
			};
			return new Response(JSON.stringify(reply.body), {
				status: reply.status,
				headers: { 'content-type': 'application/json' },
			});
		});
		const seen: string[] = [];
		const corsair = createCorsair({
			kek: KEK,
			plugins: [probePlugin(seen, opts)],
			database: database.db,
			// The client type is built from registered plugin ids; 'probe' is
			// not one, so the test names the one route it calls.
		}) as unknown as {
			probe: {
				api: { items: { list: (a: ProbeArgs) => Promise<ProbeResult> } };
			};
		};
		const outcome = await corsair.probe.api.items.list({}).then(
			(result) => ({ result }),
			(error: Error) => ({ error }),
		);
		return { ...outcome, seen, tokenCalls };
	} finally {
		cleanup();
	}
}

describe('endpoint 401 refresh', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe.each([
		['the endpoint retries itself', true],
		['core retries', false],
	])('%s', (_label, ownRetry) => {
		it.each([
			['without endpoint hooks', false],
			['with a before hook', true],
		])(
			'%s: a revoked cached token is refreshed once and the call retried',
			async (_hooks, withHooks) => {
				const out = await run({ ownRetry, withHooks });

				expect(out.result).toEqual({ ok: true, key: 'fresh' });
				expect(out.seen).toEqual(['revoked', 'fresh']);
				expect(out.tokenCalls).toEqual([TOKEN_URL]);
			},
		);

		it('a second 401 after the refresh goes back to the caller', async () => {
			const out = await run({ ownRetry, rejected: ['revoked', 'fresh'] });

			expect(out.error).toBeInstanceOf(UnauthorizedError);
			expect(out.seen).toEqual(['revoked', 'fresh']);
			expect(out.tokenCalls).toEqual([TOKEN_URL]);
		});
	});

	describe.each([
		['the endpoint retries itself', true],
		['core retries', false],
	])('when the provider refuses the refresh (%s)', (_label, ownRetry) => {
		it('a revoked grant becomes a reconnect error', async () => {
			const out = await run({
				ownRetry,
				tokenReply: { status: 400, body: { error: 'invalid_grant' } },
			});

			expect(out.error).toBeInstanceOf(AuthMissingError);
			expect(out.error).toMatchObject({
				pluginId: 'probe',
				authType: 'oauth_2',
				reason: 'revoked',
			});
			expect(out.seen).toEqual(['revoked']);
			expect(out.tokenCalls).toEqual([TOKEN_URL]);
		});

		it('a rejected OAuth app is not a reconnect', async () => {
			const out = await run({
				ownRetry,
				tokenReply: { status: 401, body: { error: 'invalid_client' } },
			});

			expect(out.error).toBeInstanceOf(OAuthRefreshError);
			expect(out.error).toMatchObject({
				kind: 'client',
				errorCode: 'invalid_client',
			});
			expect(out.error?.message).toContain('Reconnecting will not help');
		});
	});

	it('core leaves a 401 on a write to the plugin', async () => {
		// The retry would run the whole endpoint again, and a write may have
		// landed before the request that got the 401.
		const out = await run({ riskLevel: 'write' });

		expect(out.error).toBeInstanceOf(UnauthorizedError);
		expect(out.seen).toEqual(['revoked']);
		expect(out.tokenCalls).toEqual([]);
	});

	it('core leaves a 401 alone for a plugin that opted out', async () => {
		const out = await run({ refreshOnUnauthorized: false });

		expect(out.error).toBeInstanceOf(UnauthorizedError);
		expect(out.seen).toEqual(['revoked']);
		expect(out.tokenCalls).toEqual([]);
	});

	it('core does not refresh on an error that is not a 401', async () => {
		const out = await run({ failure: 'server' });

		expect(out.error).toBeInstanceOf(ServerError);
		expect(out.seen).toEqual(['revoked']);
		expect(out.tokenCalls).toEqual([]);
	});
});

describe('isUnauthorizedError', () => {
	it.each([
		[{ status: 401 }, true],
		[{ statusCode: 401 }, true],
		[new Error('wrapped', { cause: { status: 401 } }), true],
		[{ status: 403 }, false],
		[{ status: '401' }, false],
		[new Error('401 in the message only'), false],
		[undefined, false],
	])('%p -> %p', (error, expected) => {
		expect(isUnauthorizedError(error)).toBe(expected);
	});
});

describe('classifyOAuthRefreshFailure', () => {
	it.each([
		[400, 'invalid_grant', 'revoked'],
		[401, 'invalid_token', 'revoked'],
		[400, undefined, 'revoked'],
		[400, 'invalid_request', 'transient'],
		[400, 'unsupported_grant_type', 'transient'],
		[400, 'invalid_scope', 'transient'],
		[401, 'invalid_request', 'transient'],
		[403, undefined, 'transient'],
		[404, undefined, 'transient'],
		[410, undefined, 'transient'],
		[422, undefined, 'transient'],
		[404, 'invalid_client', 'client'],
		[401, 'invalid_client', 'client'],
		[400, 'unauthorized_client', 'client'],
		[500, undefined, 'transient'],
		[503, 'temporarily_unavailable', 'transient'],
		[429, undefined, 'transient'],
		[408, undefined, 'transient'],
	] as const)('%s %s -> %s', (status, code, kind) => {
		expect(classifyOAuthRefreshFailure(status, code)).toBe(kind);
	});

	it('keeps the provider body off the message', () => {
		const error = new OAuthRefreshError(400, 'invalid_grant');
		expect(error.message).toBe(
			'OAuth token refresh failed (400 invalid_grant)',
		);
	});
});

describe('formatDefaultAuthMissingMessage', () => {
	it('says reconnect when access was revoked', () => {
		expect(
			formatDefaultAuthMissingMessage(
				'gmail',
				'https://hub.test/c/1',
				'revoked',
			),
		).toBe(
			'[auth-missing:gmail] Access was revoked or has expired at the provider. Direct the user to reconnect their account: https://hub.test/c/1',
		);
	});

	it('keeps the first-connect wording otherwise', () => {
		expect(
			formatDefaultAuthMissingMessage('gmail', 'https://hub.test/c/1'),
		).toBe(
			'[auth-missing:gmail] Authentication required. Direct the user to connect their account: https://hub.test/c/1',
		);
	});
});
