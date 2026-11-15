import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { ticketmaster } from './index';
import {
	attractionsSearchResponse,
	eventsSearchResponse,
	quotaExceeded,
	venuesSearchResponse,
} from './test-fixtures';

/**
 * The endpoints call the HTTP client, which is configured with
 * `maxRetries: 0`; only the bound client retries a 429, using the plugin's
 * error handlers. This file goes through `createCorsair` so that retry layer
 * actually runs. It lives outside `integration.test.ts` because CI skips that
 * file by name.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'ticketmaster', 'default');
	const corsair = createCorsair({
		plugins: [ticketmaster({ key: 'tm-test-key' })],
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

describe('Ticketmaster retries through the bound client', () => {
	it('retries an events search after a 429', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(quotaExceeded, 429, { 'Retry-After': '1' });
			respond(eventsSearchResponse);

			const result = await corsair.ticketmaster.api.events.search({});

			expect(result.events).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries an attractions search after a 429', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(quotaExceeded, 429, { 'Retry-After': '1' });
			respond(attractionsSearchResponse);

			await expect(
				corsair.ticketmaster.api.attractions.search({ keyword: 'coachella' }),
			).resolves.toMatchObject({ page: { totalElements: 1 } });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after three retries and rethrows the 429', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond(quotaExceeded, 429, { 'Retry-After': '1' });
			}

			await expect(
				corsair.ticketmaster.api.venues.search({ keyword: 'UCV' }),
			).rejects.toMatchObject({ status: 429 });
			// One attempt plus the three retries the handler allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('returns the good page after two rate limits', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(quotaExceeded, 429, { 'Retry-After': '1' });
			respond(quotaExceeded, 429, { 'Retry-After': '1' });
			respond(venuesSearchResponse);

			await expect(
				corsair.ticketmaster.api.venues.search({ keyword: 'UCV' }),
			).resolves.toMatchObject({ venues: expect.any(Array) });
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	});
});
