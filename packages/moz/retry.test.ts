import { createCorsair } from 'corsair';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { moz } from './index';
import { authErrorEnvelope, quota, siteMetrics } from './test-fixtures';

/**
 * The endpoints call the HTTP client, which is configured with `maxRetries:
 * 0`; only the bound client retries, using this plugin's error handlers. This
 * file goes through `createCorsair` so that retry layer actually runs. It is
 * not named `integration.test.ts`, because CI skips that name.
 */
async function createClient(key = 'moz-test-key') {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'moz', 'default');
	const corsair = createCorsair({
		plugins: [moz({ key })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('retries through the bound client', () => {
	it('retries a per-method 429 on a read and returns the good page', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					id: 'id',
					jsonrpc: '2.0',
					error: {
						code: -32658,
						status: 429,
						data: { issue: 'rate_limited', value: 1 },
						message:
							'You have exceeded the request rate limit. Please slow down and try again.',
					},
				},
				429,
				{ 'Retry-After': '1' },
			);
			respond({
				id: 'id',
				jsonrpc: '2.0',
				result: { quota },
			});

			const result = await corsair.moz.api.quota.lookup({
				path: 'api.limits.data.rows',
			});

			expect(result.quota.allotted).toBe(750);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after three retries and rethrows the throttle', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond(
					{
						id: 'id',
						jsonrpc: '2.0',
						error: {
							code: -32650,
							status: 429,
							data: { issue: 'request-is-blocked', key: null },
							message:
								'Your IP has been temporarily blocked due to bad requests.',
						},
					},
					429,
				);
			}

			await expect(
				corsair.moz.api.quota.lookup({ path: 'api.limits.data.rows' }),
			).rejects.toMatchObject({ code: -32650 });
			// One attempt plus the three retries RATE_LIMIT_ERROR allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry an auth failure', async () => {
		const { corsair, testDb } = await createClient('wrong-key');
		try {
			respond(authErrorEnvelope, 401);

			await expect(
				corsair.moz.api.quota.lookup({ path: 'api.limits.data.rows' }),
			).rejects.toMatchObject({ code: -32651 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a metrics read after a 5xx and succeeds', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					id: 'id',
					jsonrpc: '2.0',
					error: {
						code: -32603,
						httpStatus: 500,
						data: {},
						message: 'Internal error',
					},
				},
				500,
			);
			respond({
				id: 'id',
				jsonrpc: '2.0',
				result: {
					site_query: {
						query: 'moz.com',
						scope: 'domain',
						original_site_query: { query: 'moz.com', scope: 'domain' },
					},
					site_metrics: siteMetrics,
				},
			});

			const result = await corsair.moz.api.metrics.fetch({
				site_query: { query: 'moz.com', scope: 'domain' },
			});

			expect(result.site_metrics.domain_authority).toBe(91);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay the competitor job start after a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					id: 'id',
					jsonrpc: '2.0',
					error: {
						code: -32603,
						httpStatus: 500,
						data: {},
						message: 'Internal error',
					},
				},
				500,
			);

			await expect(
				corsair.moz.api.competitors.fetch({
					target_query: { query: 'moz.com', scope: 'domain', locale: 'en-US' },
				}),
			).rejects.toMatchObject({ code: -32603 });
			// The start spends mozscape quota, so a lost response is never
			// re-sent; the failure surfaces to the caller instead.
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
