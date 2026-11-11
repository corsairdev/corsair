import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { databox } from './index';
import { dataSourceList, ingestQueued, unauthorized } from './test-fixtures';

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'databox', 'default');
	const corsair = createCorsair({
		plugins: [databox({ key: 'dbx-test-key' })],
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

function rateLimited(retryAfterSeconds?: number) {
	respond(
		unauthorized,
		429,
		retryAfterSeconds === undefined
			? {}
			: { 'Retry-After': String(retryAfterSeconds) },
	);
}

beforeEach(() => {
	// An unmocked call throws instead of reaching api.databox.com.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch');
	});
	jest.useFakeTimers();
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.useRealTimers();
	jest.restoreAllMocks();
});

describe('Databox retry behavior through createCorsair', () => {
	it('waits out Retry-After before the second attempt', async () => {
		const { corsair, testDb } = await createClient();
		try {
			rateLimited(7);
			respond(dataSourceList);

			const pending = corsair.databox.api.dataSources.list({});
			await jest.advanceTimersByTimeAsync(7 * 1000 - 1);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1);
			await expect(pending).resolves.toMatchObject({
				dataSources: [{ id: 1234567 }],
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('pins the no-header 429 delay to the first backoff step, one second', async () => {
		const { corsair, testDb } = await createClient();
		try {
			rateLimited();
			respond(dataSourceList);

			const pending = corsair.databox.api.dataSources.list({});
			await jest.advanceTimersByTimeAsync(999);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1);
			await expect(pending).resolves.toMatchObject({ page: 0 });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the third rate-limited retry', async () => {
		const { corsair, testDb } = await createClient();
		try {
			rateLimited(1);
			rateLimited(1);
			rateLimited(1);
			rateLimited(1);

			const pending = corsair.databox.api.dataSources.list({});
			const rejection = expect(pending).rejects.toMatchObject({ status: 429 });
			await jest.advanceTimersByTimeAsync(1000 * 3 + 1000);

			await rejection;
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits out the documented 5 second fallback on a headerless 409', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					requestId: 'r',
					status: 'error',
					errors: [
						{
							code: 'modification_in_progress',
							message: 'A dataset modification is in progress.',
							type: 'conflict',
						},
					],
				},
				409,
			);
			respond(dataSourceList);

			const pending = corsair.databox.api.dataSources.list({});
			await jest.advanceTimersByTimeAsync(4999);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1);
			await expect(pending).resolves.toMatchObject({ page: 0 });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a write on a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(unauthorized, 502);
			respond(ingestQueued);

			const rejection = expect(
				corsair.databox.api.datasets.ingestData({
					id: 1,
					records: [{ transaction_id: 'T-1' }],
				}),
			).rejects.toMatchObject({ status: 502 });
			await jest.advanceTimersByTimeAsync(30_000);

			await rejection;
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read on a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(unauthorized, 502);
			respond(dataSourceList);

			const pending = corsair.databox.api.dataSources.list({});
			await jest.advanceTimersByTimeAsync(10_000);

			await expect(pending).resolves.toMatchObject({ page: 0 });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays metrics.getData on a 5xx although it POSTs', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(unauthorized, 500);
			respond({
				requestId: 'r',
				status: 'success',
				data: {
					metric: { id: 'GoogleAnalytics4@sessions', name: 'Sessions' },
					dataPoints: [],
					syncInfo: { status: 'synced' },
				},
			});

			const pending = corsair.databox.api.metrics.getData({
				id: 'GoogleAnalytics4@sessions',
				dateRange: {
					from: '2026-06-01',
					to: '2026-06-30',
					granularity: 'daily',
				},
			});
			await jest.advanceTimersByTimeAsync(10_000);

			await expect(pending).resolves.toMatchObject({
				metric: { id: 'GoogleAnalytics4@sessions' },
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});
