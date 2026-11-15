import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { TicketmasterAPIError } from './client';
import { ticketmaster } from './index';
import {
	attraction,
	event,
	eventsSearchResponse,
	invalidApiKey,
	invalidParameter,
	quotaExceeded,
} from './test-fixtures';

// The live block only runs when a real key is in the environment; CI has no
// key, so it is skipped there.
const describeIfKey = process.env.TICKETMASTER_API_KEY
	? describe
	: describe.skip;

async function createClient(options: Parameters<typeof ticketmaster>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'ticketmaster', 'default');
	const corsair = createCorsair({
		plugins: [ticketmaster(options)],
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

describe('Ticketmaster plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.ticketmaster.keys.issue_new_dek();
			await expect(
				corsair.ticketmaster.api.events.search({ keyword: 'x' }),
			).rejects.toThrow(/auth-missing/);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the API key stored for the account', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.ticketmaster.keys.issue_new_dek();
			await corsair.ticketmaster.keys.set_api_key('tm-stored-key');
			respond(eventsSearchResponse);

			await corsair.ticketmaster.api.events.search({});

			const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
			const parsed = new URL(url);
			expect(parsed.searchParams.get('apikey')).toBe('tm-stored-key');
			expect(
				(fetchMock.mock.calls[0] as [string, RequestInit])[1].headers,
			).not.toHaveProperty('Authorization');
		} finally {
			testDb.cleanup();
		}
	});

	it('searches events with the configured key', async () => {
		const { corsair, testDb } = await createClient({ key: 'tm-test-key' });
		try {
			respond(eventsSearchResponse);

			const result = await corsair.ticketmaster.api.events.search({
				keyword: 'devjam',
				countryCode: 'US',
			});

			expect(result.events[0]?.id).toBe(event.id);
			const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(
				'https://app.ticketmaster.com/discovery/v2/events.json?keyword=devjam&countryCode=US&apikey=tm-test-key',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('reads an attraction by ID', async () => {
		const { corsair, testDb } = await createClient({ key: 'tm-test-key' });
		try {
			respond(attraction);

			const result = await corsair.ticketmaster.api.attractions.get({
				id: attraction.id,
			});

			expect(result.name).toBe(attraction.name);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 and returns the next response', async () => {
		const { corsair, testDb } = await createClient({ key: 'tm-test-key' });
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

	it('does not retry a rejected parameter', async () => {
		const { corsair, testDb } = await createClient({ key: 'tm-test-key' });
		try {
			respond(invalidParameter, 400);

			await expect(
				corsair.ticketmaster.api.events.search({ keyword: 'x' }),
			).rejects.toMatchObject({ status: 400, code: 'DIS1001' });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad key', async () => {
		const { corsair, testDb } = await createClient({ key: 'tm-bad-key' });
		try {
			respond(invalidApiKey, 401);

			// unknown: a rejection can be any value until toBeInstanceOf narrows it.
			const error = await corsair.ticketmaster.api.events
				.search({})
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(TicketmasterAPIError);
			expect(error).toMatchObject({
				status: 401,
				code: 'oauth.v2.InvalidApiKey',
			});
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});

/**
 * Read-only calls against the live Discovery API. Run with
 * `TICKETMASTER_API_KEY=<key> pnpm --filter @corsair-dev/ticketmaster test`.
 * Every call here is a search or a read, so it cannot change anything.
 */
describeIfKey('Ticketmaster live smoke (read-only)', () => {
	beforeEach(() => {
		// Let the real network through: this block is the only one that uses it.
		jest.restoreAllMocks();
	});

	it('searches music events in the US and finds at least one', async () => {
		const { corsair, testDb } = await createClient({
			key: process.env.TICKETMASTER_API_KEY,
		});
		try {
			const result = await corsair.ticketmaster.api.events.search({
				classificationName: ['music'],
				countryCode: 'US',
				size: 1,
			});

			expect(result.events.length).toBeGreaterThan(0);
			expect(result.events[0]?.id).toBeTruthy();
			expect(result.page?.totalElements).toBeGreaterThan(0);
			expect(result.next_page).toBe(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('reads the event the search just returned', async () => {
		const { corsair, testDb } = await createClient({
			key: process.env.TICKETMASTER_API_KEY,
		});
		try {
			const found = await corsair.ticketmaster.api.events.search({ size: 1 });
			const id = found.events[0]?.id;
			expect(id).toBeTruthy();

			const detail = await corsair.ticketmaster.api.events.get({
				id: id ?? '',
			});
			expect(detail.id).toBe(id);

			const images = await corsair.ticketmaster.api.events.getImages({
				id: id ?? '',
			});
			expect(Array.isArray(images.images)).toBe(true);
		} finally {
			testDb.cleanup();
		}
	});

	it('searches venues and reads the first one back', async () => {
		const { corsair, testDb } = await createClient({
			key: process.env.TICKETMASTER_API_KEY,
		});
		try {
			const found = await corsair.ticketmaster.api.venues.search({
				keyword: 'Madison Square Garden',
				size: 1,
			});
			const id = found.venues[0]?.id;
			expect(id).toBeTruthy();

			const detail = await corsair.ticketmaster.api.venues.get({
				id: id ?? '',
			});
			expect(detail.id).toBe(id);
		} finally {
			testDb.cleanup();
		}
	});

	it('searches the classification tree', async () => {
		const { corsair, testDb } = await createClient({
			key: process.env.TICKETMASTER_API_KEY,
		});
		try {
			const result = await corsair.ticketmaster.api.classifications.search({
				size: 5,
			});
			expect(result.classifications.length).toBeGreaterThan(0);

			const segmentId = result.classifications[0]?.segment?.id;
			expect(segmentId).toBeTruthy();
			const detail = await corsair.ticketmaster.api.classifications.get({
				id: segmentId ?? '',
			});
			expect(detail.segment?.id).toBe(segmentId);
		} finally {
			testDb.cleanup();
		}
	});

	it('suggests collections for a partial term', async () => {
		const { corsair, testDb } = await createClient({
			key: process.env.TICKETMASTER_API_KEY,
		});
		try {
			const result = await corsair.ticketmaster.api.suggest.get({
				keyword: 'coachella',
				size: 3,
			});
			const total =
				(result.attractions?.length ?? 0) +
				(result.events?.length ?? 0) +
				(result.venues?.length ?? 0);
			expect(total).toBeGreaterThan(0);
		} finally {
			testDb.cleanup();
		}
	});
});
