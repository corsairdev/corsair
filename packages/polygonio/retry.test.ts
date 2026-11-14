import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { POLYGONIO_API_BASE, PolygonioAPIError } from './client';
import { polygonio } from './index';
import { captureError } from './test-helpers';

async function createClient(options: Parameters<typeof polygonio>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'polygonio', 'default');
	const corsair = createCorsair({
		plugins: [polygonio(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

/** Queues one response for the next fetch call. */
function respond(
	body: unknown, // unknown: each test passes one of the API's response shapes.
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

const statusBody = { market: 'open', earlyHours: false, afterHours: false };

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Polygon.io plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is stored', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.polygonio.keys.issue_new_dek();
			await expect(corsair.polygonio.api.market.status({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the key the account stored, in the documented query parameter', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.polygonio.keys.issue_new_dek();
			await corsair.polygonio.keys.set_api_key('stored-key');
			respond(statusBody);

			const result = await corsair.polygonio.api.market.status({});

			expect(result.market).toBe('open');
			const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(
				`${POLYGONIO_API_BASE}/v1/marketstatus/now?apiKey=stored-key`,
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('reads bars with the configured key', async () => {
		const { corsair, testDb } = await createClient({ key: 'inline-key' });
		try {
			respond({ status: 'OK', resultsCount: 1, results: [{ c: 1, t: 1 }] });

			const result = await corsair.polygonio.api.aggregates.bars({
				ticker: 'AAPL',
				multiplier: 1,
				timespan: 'day',
				from: '2020-01-01',
				to: '2020-01-02',
			});

			expect(result.results).toHaveLength(1);
			const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(
				`${POLYGONIO_API_BASE}/v2/aggs/ticker/AAPL/range/1/day/2020-01-01/2020-01-02?apiKey=inline-key`,
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a rejected key', async () => {
		const { corsair, testDb } = await createClient({ key: 'bad-key' });
		try {
			respond({ status: 'ERROR', error: 'Unknown API Key' }, 401);

			const error = await captureError(corsair.polygonio.api.market.status({}));

			expect(error).toBeInstanceOf(PolygonioAPIError);
			expect(error).toMatchObject({ status: 401, credentialsRejected: true });
			expect(fetchMock).toHaveBeenCalledTimes(1);
			// The key rode in the query string, so no error may echo it.
			expect(JSON.stringify(error)).not.toContain('bad-key');
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'inline-key' });
		try {
			respond({ status: 'ERROR', error: 'Too many requests' }, 429);
			respond(statusBody);

			const pending = corsair.polygonio.api.market.status({});
			await jest.advanceTimersByTimeAsync(5000);
			const result = await pending;

			expect(result.market).toBe('open');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});

	it('gives up after the retry budget is spent', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'inline-key' });
		try {
			for (let attempt = 0; attempt < 4; attempt += 1) {
				respond({ status: 'ERROR', error: 'Too many requests' }, 429);
			}

			const pending = captureError(corsair.polygonio.api.market.status({}));
			await jest.advanceTimersByTimeAsync(30_000);
			const error = await pending;

			expect(error).toBeInstanceOf(PolygonioAPIError);
			expect(error).toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});

	it('replays a 5xx, since every route is a read', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'inline-key' });
		try {
			respond({ status: 'ERROR', error: 'Internal' }, 503);
			respond(statusBody);

			const pending = corsair.polygonio.api.market.status({});
			await jest.advanceTimersByTimeAsync(5000);
			const result = await pending;

			expect(result.market).toBe('open');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});
});
