import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { eventbrite } from './index';
import {
	eventbriteEvent,
	rateLimitEnvelope,
	ticketClassesPage,
} from './test-fixtures';
import { createHarness } from './test-helpers';

/**
 * The endpoints call the HTTP client, which is configured with
 * `maxRetries: 0`; only the bound client retries, using the plugin's error
 * handlers. This file goes through `createCorsair` so that retry layer actually
 * runs; the endpoint-level tests hit the raw client, which never retries.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'eventbrite', 'default');
	const corsair = createCorsair({
		plugins: [eventbrite({ key: 'eventbrite-test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

const h = createHarness();

beforeEach(() => {
	h.mockFetch();
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.useFakeTimers();
});

afterEach(() => {
	jest.restoreAllMocks();
	jest.useRealTimers();
});

/**
 * The handler waits `headersRetryAfterMs` between attempts, and its no-header
 * fallback is 60 seconds for Eventbrite's hourly quota, so the timers have to
 * be advanced rather than the test sat through.
 */
async function advance<T>(promise: Promise<T>): Promise<T> {
	const settled = promise.then(
		(value) => ({ ok: true as const, value }),
		// unknown: a rejection is caught as unknown, since fetch can throw anything.
		(error: unknown) => ({ ok: false as const, error }),
	);
	// Enough time for the three retries the handler allows.
	await jest.advanceTimersByTimeAsync(200_000);
	const outcome = await settled;
	if (!outcome.ok) throw outcome.error;
	return outcome.value;
}

describe('Eventbrite retries through the bound client', () => {
	it('retries a read after a 429 and returns the good page', async () => {
		const { corsair, testDb } = await createClient();
		try {
			h.respond(rateLimitEnvelope, 429);
			h.respond(eventbriteEvent);

			const result = await advance(
				corsair.eventbrite.api.events.get({ event_id: '2000937221092' }),
			);

			expect(result.id).toBe('2000937221092');
			expect(h.fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('honours a Retry-After header instead of the one-minute fallback', async () => {
		const { corsair, testDb } = await createClient();
		try {
			h.respond(rateLimitEnvelope, 429, { 'Retry-After': '2' });
			h.respond(ticketClassesPage);

			const promise = corsair.eventbrite.api.ticketClasses.list({
				event_id: '2000937221092',
			});
			// unknown: a rejection payload has no type; it is asserted on below.
			const settled = promise.then(
				(value) => value,
				(error: unknown) => error,
			);

			// One second is not enough if Retry-After (2s) was read.
			await jest.advanceTimersByTimeAsync(1000);
			expect(h.fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1500);
			const result = await settled;

			expect(result).toMatchObject({ ticket_classes: expect.any(Array) });
			expect(h.fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the three retries the handler allows', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let attempt = 0; attempt < 4; attempt += 1) {
				h.respond(rateLimitEnvelope, 429);
			}

			await expect(
				advance(corsair.eventbrite.api.events.get({ event_id: '1' })),
			).rejects.toMatchObject({ status: 429, code: 'HIT_RATE_LIMIT' });
			// One attempt plus the three retries.
			expect(h.fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a write that failed with a 500', async () => {
		const { corsair, testDb } = await createClient();
		try {
			h.respond(
				{
					error: 'INTERNAL_ERROR',
					error_description: 'The server encountered an internal error.',
					status_code: 500,
				},
				500,
			);

			await expect(
				corsair.eventbrite.api.events.publish({ event_id: '2000937221092' }),
			).rejects.toMatchObject({ status: 500 });
			expect(h.fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a read that failed with a 500', async () => {
		const { corsair, testDb } = await createClient();
		try {
			h.respond(
				{
					error: 'INTERNAL_ERROR',
					error_description: 'The server encountered an internal error.',
					status_code: 500,
				},
				500,
			);
			h.respond(eventbriteEvent);

			const result = await advance(
				corsair.eventbrite.api.events.get({ event_id: '2000937221092' }),
			);

			expect(result.status).toBe('live');
			expect(h.fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('fails a 404 immediately, since the next attempt sends the same thing', async () => {
		const { corsair, testDb } = await createClient();
		try {
			h.respond(
				{
					error: 'NOT_FOUND',
					error_description: 'The event you requested does not exist.',
					status_code: 404,
				},
				404,
			);

			await expect(
				corsair.eventbrite.api.events.get({ event_id: 'missing' }),
			).rejects.toMatchObject({ status: 404, code: 'NOT_FOUND' });
			expect(h.fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('fails a 401 immediately', async () => {
		const { corsair, testDb } = await createClient();
		try {
			h.respond(
				{
					error: 'INVALID_AUTH',
					error_description: 'The OAuth token you provided was invalid.',
					status_code: 401,
				},
				401,
			);

			await expect(corsair.eventbrite.api.users.me({})).rejects.toMatchObject({
				status: 401,
			});
			expect(h.fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
