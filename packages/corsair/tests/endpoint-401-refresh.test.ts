import { createCorsair } from '../core';
import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import { getOAuthAccessToken } from '../core/auth/oauth-access';
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

function probePlugin(seen: string[], withHooks: boolean): CorsairPlugin {
	const callProvider = (key: string) => {
		seen.push(key);
		if (key === 'revoked') throw new UnauthorizedError('401');
		return { ok: true, key };
	};
	return {
		id: 'probe',
		options: { authType: 'oauth_2' },
		...(withHooks
			? {
					hooks: {
						items: {
							list: {
								before: async (ctx: unknown, args: unknown) => ({
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
				list: async (
					ctx: { key: string; _refreshAuth?: () => Promise<string> },
					_args: unknown,
				) => {
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
		keyBuilder: async (ctx: never) =>
			getOAuthAccessToken(ctx, { plugin: 'probe', tokenUrl: TOKEN_URL }),
	} as unknown as CorsairPlugin;
}

describe('endpoint 401 refresh', () => {
	const realFetch = global.fetch;
	afterEach(() => {
		global.fetch = realFetch;
	});

	it.each([
		['without endpoint hooks', false],
		['with a before hook', true],
	])(
		'%s: a revoked cached token is refreshed once and the call retried',
		async (_label, withHooks) => {
			const { database, cleanup } = createTestDatabase();
			try {
				await seed(database);
				const tokenCalls: string[] = [];
				global.fetch = (async (url: string) => {
					tokenCalls.push(String(url));
					return {
						ok: true,
						status: 200,
						headers: { get: () => 'application/json' },
						text: async () =>
							JSON.stringify({ access_token: 'fresh', expires_in: 3600 }),
						json: async () => ({ access_token: 'fresh', expires_in: 3600 }),
					} as unknown as Response;
				}) as unknown as typeof fetch;

				const seen: string[] = [];
				const corsair = createCorsair({
					kek: KEK,
					plugins: [probePlugin(seen, withHooks)],
					database: database.db,
				}) as unknown as {
					probe: {
						api: { items: { list: (a?: unknown) => Promise<unknown> } };
					};
				};

				const result = await corsair.probe.api.items.list({});

				expect(result).toEqual({ ok: true, key: 'fresh' });
				expect(seen).toEqual(['revoked', 'fresh']);
				expect(tokenCalls).toEqual([TOKEN_URL]);
			} finally {
				cleanup();
			}
		},
	);
});
