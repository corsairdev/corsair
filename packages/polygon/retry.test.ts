import { createCorsair } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { POLYGON_HOSTS, readErrorCode, resetPolygonTokenCache } from './client';
import { polygon } from './index';
import { captureError } from './test-helpers';

async function createClient(options: Parameters<typeof polygon>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'polygon', 'default');
	const corsair = createCorsair({
		plugins: [polygon(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	// The account row starts without a data key, and the key manager needs one
	// before it can read or write any credential.
	await corsair.polygon.keys.issue_new_dek();
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

/** Queues one response for the next fetch call. */
function respond(
	body: unknown, // unknown: each test passes one of OMS's response shapes.
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

const tokenResponse = {
	accessToken: 'jwt-from-test',
	tokenType: 'bearer',
	expiresIn: 3600,
	expiresAt: '2026-01-01T01:00:00Z',
	projectId: 'prj_1',
	projectMode: 'sandbox',
};

const networksPage = { object: 'list', limit: 20, hasMore: false, data: [] };

beforeEach(() => {
	resetPolygonTokenCache();
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Polygon plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when neither credential is stored', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await expect(corsair.polygon.api.networks.list({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('mints a token from the stored pair, then calls the API with the bearer', async () => {
		const { corsair, testDb } = await createClient({ environment: 'sandbox' });
		try {
			await corsair.polygon.keys.set_api_key('sk_sdbx_stored');
			await corsair.polygon.keys.set_api_secret('stored-secret');
			respond(tokenResponse);
			respond(networksPage);

			await corsair.polygon.api.networks.list({});

			expect(fetchMock).toHaveBeenCalledTimes(2);
			const [tokenUrl, tokenInit] = fetchMock.mock.calls[0] as [
				string,
				RequestInit,
			];
			expect(tokenUrl).toBe(`${POLYGON_HOSTS.sandbox}/auth/token`);
			expect(JSON.parse(String(tokenInit.body))).toEqual({
				apiKey: 'sk_sdbx_stored',
				apiSecret: 'stored-secret',
			});

			const [url, init] = fetchMock.mock.calls[1] as [string, RequestInit];
			expect(url).toBe(`${POLYGON_HOSTS.sandbox}/networks`);
			const headers = new Headers(init.headers);
			expect(headers.get('Authorization')).toBe('Bearer jwt-from-test');
			// The secret rode only in the token body, never on a normal call.
			expect(headers.get('Api-Key')).toBeNull();
		} finally {
			testDb.cleanup();
		}
	});

	it('reuses the minted token across calls in one process', async () => {
		const { corsair, testDb } = await createClient({
			apiKey: 'sk_sdbx_inline',
			apiSecret: 'inline-secret',
			environment: 'sandbox',
		});
		try {
			respond(tokenResponse);
			respond(networksPage);
			respond(networksPage);

			await corsair.polygon.api.networks.list({});
			await corsair.polygon.api.networks.list({});

			// One token call plus two API calls.
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	});

	it('sends an Idempotency-Key on a write', async () => {
		const { corsair, testDb } = await createClient({
			apiKey: 'sk_sdbx_inline',
			apiSecret: 'inline-secret',
			environment: 'sandbox',
		});
		try {
			respond(tokenResponse);
			respond({ id: 'cst_new', status: 'pending' });

			await corsair.polygon.api.customers.create({
				type: 'individual',
				firstName: 'Jane',
				lastName: 'Smith',
			});

			const [, init] = fetchMock.mock.calls[1] as [string, RequestInit];
			expect(new Headers(init.headers).get('Idempotency-Key')).toMatch(
				/^[0-9a-f-]{36}$/,
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a rejected token', async () => {
		const { corsair, testDb } = await createClient({
			apiKey: 'sk_sdbx_wrong',
			apiSecret: 'wrong-secret',
			environment: 'sandbox',
		});
		try {
			respond(
				{
					error: 'InvalidCredentials',
					code: 1003,
					msg: 'invalid credentials',
					status: 401,
				},
				401,
			);

			const error = await captureError(corsair.polygon.api.networks.list({}));

			// Core's ApiError passes through, and OMS's code stays on its body.
			expect(error).toBeInstanceOf(ApiError);
			expect(error).toMatchObject({ status: 401 });
			expect(readErrorCode((error as ApiError).body)).toBe(
				'InvalidCredentials',
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(JSON.stringify(error)).not.toContain('wrong-secret');
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 on a read and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			apiKey: 'sk_sdbx_inline',
			apiSecret: 'inline-secret',
			environment: 'sandbox',
		});
		try {
			respond(tokenResponse);
			respond(
				{
					error: 'RateLimited',
					code: 1040,
					msg: 'too many requests',
					status: 429,
				},
				429,
				{ 'Retry-After': '1' },
			);
			respond(networksPage);

			const pending = corsair.polygon.api.networks.list({});
			await jest.advanceTimersByTimeAsync(5000);
			const result = await pending;

			expect(result.data).toEqual([]);
			// One token call, the 429, and the retry that succeeded.
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});

	it('does not replay a write after a 5xx', async () => {
		const { corsair, testDb } = await createClient({
			apiKey: 'sk_sdbx_inline',
			apiSecret: 'inline-secret',
			environment: 'sandbox',
		});
		try {
			respond(tokenResponse);
			respond(
				{ error: 'InternalError', code: 5000, msg: 'boom', status: 503 },
				503,
			);

			await expect(
				corsair.polygon.api.webhooks.create({
					url: 'https://partner.example/webhooks',
					subscriptions: ['*'],
				}),
			).rejects.toBeInstanceOf(ApiError);
			// The token call and the single failed write, with no replay.
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a 5xx on a read', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			apiKey: 'sk_sdbx_inline',
			apiSecret: 'inline-secret',
			environment: 'sandbox',
		});
		try {
			respond(tokenResponse);
			respond(
				{ error: 'InternalError', code: 5000, msg: 'boom', status: 503 },
				503,
			);
			respond(networksPage);

			const pending = corsair.polygon.api.networks.list({});
			await jest.advanceTimersByTimeAsync(5000);
			const result = await pending;

			expect(result.data).toEqual([]);
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});
});
