import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { shopify, shopifyAuthConfig } from './index';
import { shop } from './test-fixtures';
import {
	requestShopifyClientCredentialsToken,
	ShopifyTokenError,
	shareMint,
	TOKEN_RENEW_BEFORE_SECONDS,
} from './token';

/**
 * Token renewal for Dev Dashboard apps, through `createCorsair` so the real
 * key manager, key builder and binder run. A client-credentials token lasts
 * 24 hours; the plugin mints one from the stored client id and secret, keeps
 * it with its expiry, renews it before it runs out, and renews once after a
 * 401. A static token keeps working without any of that.
 */
const SHOP = 'corsair-test.myshopify.com';
const CLIENT_ID = 'test-client-id-7f3a';
const CLIENT_SECRET = 'shpss_test_secret_value_91c2';
const STATIC_TOKEN = 'shpat_static_token_5d1e';
const NOW_MS = Date.UTC(2026, 10, 16, 12, 0, 0);
const NOW_S = Math.floor(NOW_MS / 1000);
const TOKEN_URL = `https://${SHOP}/admin/oauth/access_token`;
const GRAPHQL_URL = `https://${SHOP}/admin/api/2026-10/graphql.json`;

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'shopify', 'default');
	const corsair = createCorsair({
		plugins: [shopify({})],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	await corsair.shopify.keys.issue_new_dek();
	await corsair.shopify.keys.set_shop_domain(SHOP);
	return { corsair, testDb };
}

async function withClientCredentials(
	corsair: Awaited<ReturnType<typeof createClient>>['corsair'],
) {
	await corsair.shopify.keys.set_client_id(CLIENT_ID);
	await corsair.shopify.keys.set_client_secret(CLIENT_SECRET);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON, including error bodies.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function respondToken(token: string, expiresIn = 86399) {
	respond({
		access_token: token,
		scope: 'read_products',
		expires_in: expiresIn,
	});
}

const unauthorized = {
	errors:
		'[API] Invalid API key or access token (unrecognized login or wrong password)',
};

type SentCall = { url: string; headers: Headers; body: string };

function calls(): SentCall[] {
	return fetchMock.mock.calls.map(([url, init]) => ({
		url: String(url),
		headers: new Headers((init as RequestInit).headers),
		body: String((init as RequestInit).body ?? ''),
	}));
}

// unknown: every console argument, so a leaked secret is found wherever it is.
let consoleArgs: unknown[][];

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can
	// reach Shopify.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	jest.spyOn(Date, 'now').mockReturnValue(NOW_MS);
	consoleArgs = [];
	for (const level of ['log', 'warn', 'error', 'info', 'debug'] as const) {
		jest.spyOn(console, level).mockImplementation((...args) => {
			consoleArgs.push(args);
		});
	}
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('connect fields', () => {
	it('declares shop domain, client id and secret beside the token, and an expiry the plugin writes', () => {
		expect(shopifyAuthConfig.api_key.account).toEqual([
			'shop_domain',
			'client_id',
			'client_secret',
			'expires_at',
		]);
	});
});

describe('minting from client credentials', () => {
	it('mints a token with the client credentials grant and sends it', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await withClientCredentials(corsair);
			respondToken('minted-token-1');
			respond({ data: { shop } });

			const result = await corsair.shopify.api.shop.get({});

			expect(result.shop.name).toBe('Corsair Test');
			const [mint, graphql] = calls();
			expect(mint?.url).toBe(TOKEN_URL);
			expect(fetchMock.mock.calls[0]?.[1]?.method).toBe('POST');
			expect(mint?.headers.get('content-type')).toBe(
				'application/x-www-form-urlencoded',
			);
			const form = new URLSearchParams(mint?.body);
			expect(form.get('grant_type')).toBe('client_credentials');
			expect(form.get('client_id')).toBe(CLIENT_ID);
			expect(form.get('client_secret')).toBe(CLIENT_SECRET);
			expect(form.has('scope')).toBe(false);
			expect(graphql?.url).toBe(GRAPHQL_URL);
			expect(graphql?.headers.get('x-shopify-access-token')).toBe(
				'minted-token-1',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('stores the minted token with its expiry', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await withClientCredentials(corsair);
			respondToken('minted-token-1', 86399);
			respond({ data: { shop } });

			await corsair.shopify.api.shop.get({});

			expect(await corsair.shopify.keys.get_api_key()).toBe('minted-token-1');
			expect(await corsair.shopify.keys.get_expires_at()).toBe(
				String(NOW_S + 86399),
			);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('caching and renewal before expiry', () => {
	it('reuses a cached token that is still fresh, without minting', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await withClientCredentials(corsair);
			respondToken('minted-token-1');
			respond({ data: { shop } });
			respond({ data: { shop } });

			await corsair.shopify.api.shop.get({});
			await corsair.shopify.api.shop.get({});

			const urls = calls().map((c) => c.url);
			expect(urls).toEqual([TOKEN_URL, GRAPHQL_URL, GRAPHQL_URL]);
			expect(calls()[2]?.headers.get('x-shopify-access-token')).toBe(
				'minted-token-1',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('renews a token that is inside the renewal margin, before Shopify expires it', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await withClientCredentials(corsair);
			await corsair.shopify.keys.set_api_key('old-token');
			// Still valid for another minute: inside the margin, so renewed now.
			await corsair.shopify.keys.set_expires_at(String(NOW_S + 60));
			respondToken('minted-token-2');
			respond({ data: { shop } });

			await corsair.shopify.api.shop.get({});

			expect(calls()[0]?.url).toBe(TOKEN_URL);
			expect(calls()[1]?.headers.get('x-shopify-access-token')).toBe(
				'minted-token-2',
			);
			expect(await corsair.shopify.keys.get_api_key()).toBe('minted-token-2');
		} finally {
			testDb.cleanup();
		}
	});

	it('keeps a token that has just over the renewal margin left', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await withClientCredentials(corsair);
			await corsair.shopify.keys.set_api_key('cached-token');
			await corsair.shopify.keys.set_expires_at(
				String(NOW_S + TOKEN_RENEW_BEFORE_SECONDS + 1),
			);
			respond({ data: { shop } });

			await corsair.shopify.api.shop.get({});

			expect(calls().map((c) => c.url)).toEqual([GRAPHQL_URL]);
			expect(calls()[0]?.headers.get('x-shopify-access-token')).toBe(
				'cached-token',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('renews an expired token when the clock passes its expiry', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await withClientCredentials(corsair);
			respondToken('minted-token-1');
			respond({ data: { shop } });
			await corsair.shopify.api.shop.get({});

			// A day later the stored token is past its expiry.
			jest.spyOn(Date, 'now').mockReturnValue(NOW_MS + 86_400_000);
			respondToken('minted-token-2');
			respond({ data: { shop } });
			await corsair.shopify.api.shop.get({});

			expect(calls().map((c) => c.url)).toEqual([
				TOKEN_URL,
				GRAPHQL_URL,
				TOKEN_URL,
				GRAPHQL_URL,
			]);
			expect(calls()[3]?.headers.get('x-shopify-access-token')).toBe(
				'minted-token-2',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('treats a token with no recorded expiry as stale when client credentials are set', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await withClientCredentials(corsair);
			await corsair.shopify.keys.set_api_key('unknown-age-token');
			respondToken('minted-token-1');
			respond({ data: { shop } });

			await corsair.shopify.api.shop.get({});

			expect(calls()[0]?.url).toBe(TOKEN_URL);
		} finally {
			testDb.cleanup();
		}
	});

	it('shares one mint between calls that start together', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await withClientCredentials(corsair);
			fetchMock.mockImplementation(async (url: string) =>
				String(url) === TOKEN_URL
					? new Response(
							JSON.stringify({
								access_token: 'minted-token-1',
								expires_in: 86399,
							}),
						)
					: new Response(JSON.stringify({ data: { shop } }), {
							headers: { 'Content-Type': 'application/json' },
						}),
			);

			await Promise.all([
				corsair.shopify.api.shop.get({}),
				corsair.shopify.api.shop.get({}),
				corsair.shopify.api.shop.get({}),
			]);

			expect(calls().filter((c) => c.url === TOKEN_URL)).toHaveLength(1);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('a 401 renews once and retries once', () => {
	it('renews and retries a read that Shopify rejects before the recorded expiry', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await withClientCredentials(corsair);
			await corsair.shopify.keys.set_api_key('revoked-token');
			await corsair.shopify.keys.set_expires_at(String(NOW_S + 3600));
			respond(unauthorized, 401);
			respondToken('minted-token-2');
			respond({ data: { shop } });

			const result = await corsair.shopify.api.shop.get({});

			expect(result.shop.name).toBe('Corsair Test');
			expect(calls().map((c) => c.url)).toEqual([
				GRAPHQL_URL,
				TOKEN_URL,
				GRAPHQL_URL,
			]);
			expect(calls()[0]?.headers.get('x-shopify-access-token')).toBe(
				'revoked-token',
			);
			expect(calls()[2]?.headers.get('x-shopify-access-token')).toBe(
				'minted-token-2',
			);
			expect(await corsair.shopify.keys.get_api_key()).toBe('minted-token-2');
		} finally {
			testDb.cleanup();
		}
	});

	it('renews and retries a mutation too, since a 401 means it never ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await withClientCredentials(corsair);
			await corsair.shopify.keys.set_api_key('revoked-token');
			await corsair.shopify.keys.set_expires_at(String(NOW_S + 3600));
			respond(unauthorized, 401);
			respondToken('minted-token-2');
			respond({
				data: {
					webhookSubscriptionDelete: {
						deletedWebhookSubscriptionId: 'gid://shopify/WebhookSubscription/1',
						userErrors: [],
					},
				},
			});

			const result = await corsair.shopify.api.webhookSubscriptions.delete({
				id: 'gid://shopify/WebhookSubscription/1',
			});

			expect(result.deletedWebhookSubscriptionId).toBe(
				'gid://shopify/WebhookSubscription/1',
			);
			expect(calls().map((c) => c.url)).toEqual([
				GRAPHQL_URL,
				TOKEN_URL,
				GRAPHQL_URL,
			]);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after one renewal when the new token is rejected too', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await withClientCredentials(corsair);
			await corsair.shopify.keys.set_api_key('revoked-token');
			await corsair.shopify.keys.set_expires_at(String(NOW_S + 3600));
			respond(unauthorized, 401);
			respondToken('minted-token-2');
			respond(unauthorized, 401);

			await expect(corsair.shopify.api.shop.get({})).rejects.toMatchObject({
				status: 401,
			});
			// One request, one mint, one retry: neither the plugin nor core
			// renews a second time.
			expect(calls().map((c) => c.url)).toEqual([
				GRAPHQL_URL,
				TOKEN_URL,
				GRAPHQL_URL,
			]);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('static token', () => {
	it('sends a stored static token as is and never mints', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.shopify.keys.set_api_key(STATIC_TOKEN);
			respond({ data: { shop } });

			await corsair.shopify.api.shop.get({});

			expect(calls().map((c) => c.url)).toEqual([GRAPHQL_URL]);
			expect(calls()[0]?.headers.get('x-shopify-access-token')).toBe(
				STATIC_TOKEN,
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not renew a static token on a 401; the error reaches the caller', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.shopify.keys.set_api_key(STATIC_TOKEN);
			respond(unauthorized, 401);

			await expect(corsair.shopify.api.shop.get({})).rejects.toMatchObject({
				status: 401,
			});
			expect(calls().map((c) => c.url)).toEqual([GRAPHQL_URL]);
		} finally {
			testDb.cleanup();
		}
	});

	it('uses a static token when only one of the client credentials is set', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.shopify.keys.set_api_key(STATIC_TOKEN);
			await corsair.shopify.keys.set_client_id(CLIENT_ID);
			respond({ data: { shop } });

			await corsair.shopify.api.shop.get({});

			expect(calls().map((c) => c.url)).toEqual([GRAPHQL_URL]);
		} finally {
			testDb.cleanup();
		}
	});

	it('asks for a connection when there is neither a token nor client credentials', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await expect(corsair.shopify.api.shop.get({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});
});

describe('no secret or token in errors', () => {
	// unknown: a caught rejection of any type.
	function everythingVisible(error: unknown): string {
		const e = error as Error & { cause?: unknown };
		return [
			e?.message,
			e?.stack,
			String(e?.cause ?? ''),
			JSON.stringify(e),
			JSON.stringify(consoleArgs, (_k, v) =>
				v instanceof Error ? `${v.message} ${v.stack}` : v,
			),
		].join('\n');
	}

	it('names the OAuth error but not the secret, id or body when Shopify refuses the mint', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await withClientCredentials(corsair);
			// A body that echoes the request, to prove nothing is copied from it.
			respond(
				{
					error: 'invalid_client',
					error_description: `client ${CLIENT_ID} with secret ${CLIENT_SECRET} is not valid`,
				},
				401,
			);

			const error = await corsair.shopify.api.shop.get({}).then(
				() => {
					throw new Error('expected a rejection');
				},
				// unknown: a rejection reason has no static type.
				(caught: unknown) => caught,
			);

			const visible = everythingVisible(error);
			expect((error as Error).name).toBe('AuthMissingError');
			expect(visible).toContain('invalid_client');
			expect(visible).not.toContain(CLIENT_SECRET);
			expect(visible).not.toContain(CLIENT_ID);
			expect(await corsair.shopify.keys.get_api_key()).toBeNull();
		} finally {
			testDb.cleanup();
		}
	});

	it('names a plain-text refusal code without copying the text', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await withClientCredentials(corsair);
			respond(
				`Oauth error shop_not_permitted: Client credentials cannot be performed on this shop. ${CLIENT_SECRET}`,
				400,
			);

			const error = await corsair.shopify.api.shop.get({}).then(
				() => {
					throw new Error('expected a rejection');
				},
				// unknown: a rejection reason has no static type.
				(caught: unknown) => caught,
			);

			const visible = everythingVisible(error);
			expect(visible).toContain('shop_not_permitted');
			expect(visible).not.toContain(CLIENT_SECRET);
			expect(visible).not.toContain('Client credentials cannot be performed');
		} finally {
			testDb.cleanup();
		}
	});

	it('drops the transport error, which could carry request detail', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await withClientCredentials(corsair);
			fetchMock.mockRejectedValueOnce(
				new TypeError(`fetch failed: ${CLIENT_SECRET}`),
			);

			const error = await corsair.shopify.api.shop.get({}).then(
				() => {
					throw new Error('expected a rejection');
				},
				// unknown: a rejection reason has no static type.
				(caught: unknown) => caught,
			);

			const visible = everythingVisible(error);
			expect(visible).toContain('Could not reach');
			expect(visible).not.toContain(CLIENT_SECRET);
		} finally {
			testDb.cleanup();
		}
	});

	it('keeps the old and new tokens out of the error when the retry fails', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await withClientCredentials(corsair);
			await corsair.shopify.keys.set_api_key('revoked-token');
			await corsair.shopify.keys.set_expires_at(String(NOW_S + 3600));
			respond(unauthorized, 401);
			respondToken('minted-token-2');
			respond(unauthorized, 401);

			const error = await corsair.shopify.api.shop.get({}).then(
				() => {
					throw new Error('expected a rejection');
				},
				// unknown: a rejection reason has no static type.
				(caught: unknown) => caught,
			);

			const visible = everythingVisible(error);
			expect(visible).not.toContain('revoked-token');
			expect(visible).not.toContain('minted-token-2');
			expect(visible).not.toContain(CLIENT_SECRET);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('a stalled token request times out', () => {
	const input = {
		shopDomain: SHOP,
		clientId: CLIENT_ID,
		clientSecret: CLIENT_SECRET,
		timeoutMs: 50,
	};

	it('fails when Shopify never answers, and aborts the request', async () => {
		let signal: AbortSignal | undefined;
		fetchMock.mockImplementationOnce(
			(_url: string, init: RequestInit) =>
				new Promise<Response>(() => {
					signal = init.signal ?? undefined;
				}),
		);

		const error = await requestShopifyClientCredentialsToken(input).catch(
			// unknown: a rejection reason has no static type.
			(caught: unknown) => caught,
		);

		expect(error).toBeInstanceOf(ShopifyTokenError);
		expect((error as Error).message).toMatch(/did not answer/);
		expect((error as Error).message).not.toContain(CLIENT_SECRET);
		expect(signal?.aborted).toBe(true);
	});

	it('fails when the headers arrive but the body stalls', async () => {
		// A body stream that never closes.
		const stalled = new ReadableStream<Uint8Array>({ start() {} });
		fetchMock.mockResolvedValueOnce(new Response(stalled, { status: 200 }));

		await expect(requestShopifyClientCredentialsToken(input)).rejects.toThrow(
			/did not answer/,
		);
	});

	it('frees the shared mint so the next call can try again', async () => {
		const store = {};
		fetchMock.mockImplementationOnce(() => new Promise<Response>(() => {}));
		await expect(
			shareMint(store, 'routine', async () => {
				const token = await requestShopifyClientCredentialsToken(input);
				return token.accessToken;
			}),
		).rejects.toThrow(/did not answer/);

		respondToken('minted-after-timeout');
		const token = await shareMint(store, 'routine', async () => {
			const minted = await requestShopifyClientCredentialsToken(input);
			return minted.accessToken;
		});

		expect(token).toBe('minted-after-timeout');
	});
});

describe('token request responses that are not a refusal', () => {
	const input = {
		shopDomain: SHOP,
		clientId: CLIENT_ID,
		clientSecret: CLIENT_SECRET,
		maxRetryWaitMs: 0,
	};

	function respondThrottled() {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ errors: 'Too many requests' }), {
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '0' },
			}),
		);
	}

	it('retries a throttled token request once and uses the token', async () => {
		respondThrottled();
		respondToken('minted-after-429');

		const token = await requestShopifyClientCredentialsToken(input);

		expect(token.accessToken).toBe('minted-after-429');
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('reports a second 429 as throttling, not as missing credentials', async () => {
		respondThrottled();
		respondThrottled();

		const error = await requestShopifyClientCredentialsToken(input).catch(
			// unknown: a rejection reason has no static type.
			(caught: unknown) => caught,
		);

		expect(error).toBeInstanceOf(ShopifyTokenError);
		expect((error as Error).name).not.toBe('AuthMissingError');
		expect(error).toMatchObject({ status: 429 });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it.each([0, -5, '86399', Number.NaN])(
		'refuses expires_in %p instead of caching the token as fresh',
		async (expiresIn) => {
			respond({ access_token: 'dead-token', expires_in: expiresIn });

			await expect(requestShopifyClientCredentialsToken(input)).rejects.toThrow(
				/invalid expires_in/,
			);
		},
	);

	it('uses the documented 24-hour lifetime when expires_in is left out', async () => {
		respond({ access_token: 'no-expiry-token' });

		const token = await requestShopifyClientCredentialsToken(input);

		expect(token.expiresAt).toBe(NOW_S + 86399);
	});

	it('does not store a token whose expires_in is invalid', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await withClientCredentials(corsair);
			respond({ access_token: 'dead-token', expires_in: 0 });

			await expect(corsair.shopify.api.shop.get({})).rejects.toThrow(
				/invalid expires_in/,
			);
			expect(await corsair.shopify.keys.get_api_key()).toBeNull();
		} finally {
			testDb.cleanup();
		}
	});
});
