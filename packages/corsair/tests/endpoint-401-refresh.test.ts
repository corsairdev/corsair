import { createCorsair } from '../core';
import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import { getOAuthAccessToken } from '../core/auth/oauth-access';
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
			return new Response(
				JSON.stringify({ access_token: 'fresh', expires_in: 3600 }),
				{ status: 200, headers: { 'content-type': 'application/json' } },
			);
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
