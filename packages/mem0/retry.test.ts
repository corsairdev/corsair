import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { mem0 } from './index';
import {
	memory,
	rateLimited,
	searchResults,
	serverError,
} from './test-fixtures';

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

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'mem0', 'default');
	const corsair = createCorsair({
		plugins: [mem0({ key: 'm0-test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('Mem0 429 retries through the bound client', () => {
	it('retries a rate-limited read and returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(rateLimited, 429, { 'Retry-After': '1' });
			respond(memory);

			const result = await corsair.mem0.api.memories.get({
				memory_id: 'ea925981',
			});

			expect(result.id).toBe(memory.id);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a rate-limited write', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(rateLimited, 429, { 'Retry-After': '1' });
			respond({ event_id: 'evt-1', status: 'PENDING' });

			const result = await corsair.mem0.api.memories.add({
				messages: [{ role: 'user', content: 'I moved to Austin.' }],
				user_id: 'alice',
			});

			expect(result.event_id).toBe('evt-1');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 5xx on search, a POST that reads', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(serverError, 503);
			respond(searchResults);

			const result = await corsair.mem0.api.memories.search({
				query: 'hobbies',
				filters: { user_id: 'alice' },
			});

			expect(result.results).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 5xx on add, which may have been applied', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(serverError, 503);

			await expect(
				corsair.mem0.api.memories.add({
					messages: [{ role: 'user', content: 'I moved to Austin.' }],
					user_id: 'alice',
				}),
			).rejects.toMatchObject({ status: 503 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after three retries and throws the last 429', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let attempt = 0; attempt < 4; attempt++) {
				respond(rateLimited, 429);
			}

			await expect(
				corsair.mem0.api.memories.get({ memory_id: 'ea925981' }),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});
});
