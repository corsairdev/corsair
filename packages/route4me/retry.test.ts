import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { route4me } from './index';
import {
	ROUTE_PAGE,
	V4_AUTH_ERROR,
	V5_VALIDATION_ERROR,
} from './test-fixtures';
import { respond, spyOnFetch } from './test-support';

async function createClient(options: Parameters<typeof route4me>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'route4me', 'default');
	const corsair = createCorsair({
		plugins: [route4me(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
	jest.useRealTimers();
});

/**
 * Core sleeps between retries with a plain setTimeout, so fake timers step over
 * the wait instead of taking it. The rejection handler is attached before the
 * clock moves: otherwise the promise rejects mid-step with nothing listening,
 * and Node reports an unhandled rejection instead of the assertion the test
 * wants.
 */
async function withFakeTimers<T>(run: Promise<T>): Promise<T> {
	let settled = false;
	const tracked = run.finally(() => {
		settled = true;
	});
	tracked.catch(() => undefined);
	for (let step = 0; step < 20 && !settled; step++) {
		await Promise.resolve();
		await jest.advanceTimersByTimeAsync(10_000);
	}
	return tracked;
}

describe('retry behaviour', () => {
	it('retries a rate-limited read and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'route4me-test-key',
		});
		try {
			respond(
				fetchMock,
				{
					status: false,
					error: 'Too Many Requests',
					code: 429,
					messages: ['Too Many Requests'],
				},
				429,
			);
			respond(fetchMock, ROUTE_PAGE);

			const result = await withFakeTimers(corsair.route4me.api.routes.list({}));

			expect(result.routes).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the documented number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'route4me-test-key',
		});
		try {
			for (let attempt = 0; attempt < 6; attempt++) {
				respond(
					fetchMock,
					{
						status: false,
						error: 'Too Many Requests',
						code: 429,
						messages: ['Too Many Requests'],
					},
					429,
				);
			}

			await expect(
				withFakeTimers(corsair.route4me.api.routes.list({})),
			).rejects.toThrow(/Route4Me 429/);
			// One original attempt plus the three the handler allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a write that failed with a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'route4me-test-key',
		});
		try {
			respond(
				fetchMock,
				{
					status: false,
					error: 'Server Error',
					code: 500,
					messages: ['Server Error'],
				},
				500,
			);

			await expect(
				withFakeTimers(
					corsair.route4me.api.orders.create({
						address_1: 'Prinsengracht 100',
					}),
				),
			).rejects.toThrow(/Route4Me 500/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a rejected key', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({ key: 'bad-key' });
		try {
			respond(fetchMock, V4_AUTH_ERROR, 401);

			await expect(
				withFakeTimers(corsair.route4me.api.optimizations.list({})),
			).rejects.toThrow(/Invalid API key/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a v5 validation rejection', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'route4me-test-key',
		});
		try {
			respond(fetchMock, V5_VALIDATION_ERROR, 406);

			await expect(
				withFakeTimers(corsair.route4me.api.addresses.list({ display: 'all' })),
			).rejects.toThrow(/Route4Me 406/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 5xx read through the backoff strategy', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'route4me-test-key',
		});
		try {
			respond(
				fetchMock,
				{
					status: false,
					error: 'Server Error',
					code: 500,
					messages: ['Server Error'],
				},
				500,
			);
			respond(fetchMock, ROUTE_PAGE);

			const result = await withFakeTimers(corsair.route4me.api.routes.list({}));

			expect(result.routes).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});
