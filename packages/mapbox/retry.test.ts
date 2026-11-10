import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { mapbox } from './index';
import {
	directionsRoute,
	errorBodies,
	geocodingForwardParis,
} from './test-fixtures';
import type { FetchMock } from './test-harness';
import { API_KEY, GEO_JSON, installFetchMock, respond } from './test-harness';

let fetchMock: FetchMock;

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'mapbox', 'default');
	const corsair = createCorsair({
		plugins: [mapbox({ key: API_KEY })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

type Client = Awaited<ReturnType<typeof createClient>>['corsair'];

const PARIS = { longitude: 2.35, latitude: 48.85 };
const NEARBY = { longitude: 2.3, latitude: 48.86 };

function forward(corsair: Client) {
	return corsair.mapbox.api.geocoding.forward({ q: 'Paris' });
}

function route(corsair: Client) {
	return corsair.mapbox.api.directions.route({
		profile: 'mapbox/driving',
		coordinates: [PARIS, NEARBY],
	});
}

/** Starts a call, lets the fake clock run, and reports how it ended. */
async function settle<T>(promise: Promise<T>, advanceMs: number) {
	const outcome = promise.then(
		(value) => ({ value, error: undefined }),
		(error: Error) => ({ value: undefined, error }),
	);
	await jest.advanceTimersByTimeAsync(advanceMs);
	return outcome;
}

beforeEach(() => {
	jest.useFakeTimers();
	fetchMock = installFetchMock();
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.useRealTimers();
	jest.restoreAllMocks();
});

describe('429 retries through the bound client', () => {
	it('waits Retry-After, then returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(fetchMock, errorBodies.rateLimited, 429, {
				headers: { 'Retry-After': '3' },
			});
			respond(fetchMock, geocodingForwardParis, 200, {
				contentType: GEO_JSON,
			});

			const pending = forward(corsair);
			await jest.advanceTimersByTimeAsync(2999);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1);
			const result = await pending;
			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(result.features).toHaveLength(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('derives the wait from x-rate-limit-reset', async () => {
		const { corsair, testDb } = await createClient();
		try {
			jest.setSystemTime(1_800_000_000_000);
			respond(fetchMock, errorBodies.rateLimited, 429, {
				headers: { 'x-rate-limit-reset': '1800000005' },
			});
			respond(fetchMock, directionsRoute);

			const pending = route(corsair);
			await jest.advanceTimersByTimeAsync(4999);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1);
			const result = await pending;
			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(result.code).toBe('Ok');
		} finally {
			testDb.cleanup();
		}
	});

	it('waits the documented 60 second window when a 429 carries no header', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(fetchMock, errorBodies.rateLimited, 429);
			respond(fetchMock, geocodingForwardParis, 200, {
				contentType: GEO_JSON,
			});

			const pending = forward(corsair);
			await jest.advanceTimersByTimeAsync(59_999);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1);
			const result = await pending;
			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(result.features).toHaveLength(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after two retries and throws the last 429', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let attempt = 0; attempt < 3; attempt++) {
				respond(fetchMock, errorBodies.rateLimited, 429, {
					headers: { 'Retry-After': '1' },
				});
			}

			const outcome = await settle(forward(corsair), 2000);

			expect(outcome.error).toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('5xx and transport retries (every operation is a GET)', () => {
	it('retries a 503 after one second', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(fetchMock, { message: 'Service Unavailable' }, 503);
			respond(fetchMock, directionsRoute);

			const pending = route(corsair);
			await jest.advanceTimersByTimeAsync(999);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1);
			expect((await pending).code).toBe('Ok');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after two retries on a persistent 503', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let attempt = 0; attempt < 3; attempt++) {
				respond(fetchMock, { message: 'Service Unavailable' }, 503);
			}

			// 1s then 2s of exponential backoff.
			const outcome = await settle(route(corsair), 3000);

			expect(outcome.error).toMatchObject({ status: 503 });
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a dropped connection and returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respond(fetchMock, directionsRoute);

			const outcome = await settle(route(corsair), 1000);

			expect(outcome.value?.code).toBe('Ok');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('failures that are not retried', () => {
	it('sends one request for a 401', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(fetchMock, errorBodies.invalidToken, 401);

			const outcome = await settle(forward(corsair), 70_000);

			expect(outcome.error).toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('sends one request for a 422', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(fetchMock, errorBodies.navigationValidation, 422);

			const outcome = await settle(route(corsair), 70_000);

			expect(outcome.error).toMatchObject({ status: 422 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('sends one request for a 200 NoSegment', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(fetchMock, errorBodies.noSegment);

			const outcome = await settle(route(corsair), 70_000);

			expect(outcome.error).toMatchObject({ code: 'NoSegment' });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not send the token anywhere but the query string', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(fetchMock, geocodingForwardParis, 200, {
				contentType: GEO_JSON,
			});

			await forward(corsair);

			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new URL(url).searchParams.get('access_token')).toBe(API_KEY);
			expect(new Headers(init.headers).get('authorization')).toBeNull();
		} finally {
			testDb.cleanup();
		}
	});
});
