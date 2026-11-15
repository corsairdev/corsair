import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { Mem0APIError } from './client';
import { mem0 } from './index';
import {
	badRequest,
	emptyMemoryPage,
	event,
	memory,
	memoryDeleted,
	memoryNotFound,
	rateLimited,
	unauthorized,
} from './test-fixtures';

async function createClient(options: Parameters<typeof mem0>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'mem0', 'default');
	const corsair = createCorsair({
		plugins: [mem0(options)],
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

describe('Mem0 plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.mem0.keys.issue_new_dek();
			await expect(
				corsair.mem0.api.memories.list({ filters: { user_id: 'alice' } }),
			).rejects.toThrow(/auth-missing/);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the API key stored for the account as an Authorization header', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.mem0.keys.issue_new_dek();
			await corsair.mem0.keys.set_api_key('m0-stored-key');
			respond(memory);

			await corsair.mem0.api.memories.get({ memory_id: 'ea925981' });

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			const headers = new Headers(init.headers);
			expect(headers.get('authorization')).toBe('Token m0-stored-key');
			expect(headers.get('x-api-key')).toBeNull();
		} finally {
			testDb.cleanup();
		}
	});

	it('reads a memory with the configured key', async () => {
		const { corsair, testDb } = await createClient({ key: 'm0-test-key' });
		try {
			respond(memory);

			const result = await corsair.mem0.api.memories.get({
				memory_id: 'ea925981-272f-40dd-b576-be64e4871429',
			});

			expect(result.memory).toContain('San Francisco');
			const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(
				'https://api.mem0.ai/v1/memories/ea925981-272f-40dd-b576-be64e4871429/',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('creates a memory and returns the event to poll', async () => {
		const { corsair, testDb } = await createClient({ key: 'm0-test-key' });
		try {
			respond({ event_id: 'evt-1', status: 'PENDING' });

			const result = await corsair.mem0.api.memories.add({
				messages: [{ role: 'user', content: 'I moved to Austin.' }],
				user_id: 'alice',
			});

			expect(result.event_id).toBe('evt-1');
			expect(result.status).toBe('PENDING');
		} finally {
			testDb.cleanup();
		}
	});

	it('polls an event until it succeeds', async () => {
		const { corsair, testDb } = await createClient({ key: 'm0-test-key' });
		try {
			respond(event);

			const result = await corsair.mem0.api.events.get({ event_id: 'evt-1' });

			expect(result.status).toBe('SUCCEEDED');
			expect(result.event_type).toBe('ADD');
		} finally {
			testDb.cleanup();
		}
	});

	it('removes a memory and reports success', async () => {
		const { corsair, testDb } = await createClient({ key: 'm0-test-key' });
		try {
			respond(memoryDeleted);

			const result = await corsair.mem0.api.memories.delete({
				memory_id: 'ea925981',
			});

			expect(result).toMatchObject({ success: true, memory_id: 'ea925981' });
		} finally {
			testDb.cleanup();
		}
	});

	it('returns an empty page for a user with no memories', async () => {
		const { corsair, testDb } = await createClient({ key: 'm0-test-key' });
		try {
			respond(emptyMemoryPage);

			const result = await corsair.mem0.api.memories.list({
				filters: { user_id: 'nobody' },
			});

			expect(result.count).toBe(0);
			expect(result.results).toEqual([]);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 and returns the next response', async () => {
		const { corsair, testDb } = await createClient({ key: 'm0-test-key' });
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

	it('does not retry a bad key', async () => {
		const { corsair, testDb } = await createClient({ key: 'm0-bad-key' });
		try {
			respond(unauthorized, 401);

			// unknown: a rejection can be any value until toBeInstanceOf narrows it.
			const error = await corsair.mem0.api.memories
				.get({ memory_id: 'ea925981' })
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(Mem0APIError);
			expect(error).toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a rejected body', async () => {
		const { corsair, testDb } = await createClient({ key: 'm0-test-key' });
		try {
			respond(badRequest('Invalid input data.'), 400);

			await expect(
				corsair.mem0.api.memories.add({
					messages: [{ role: 'user', content: 'hi' }],
					user_id: 'alice',
				}),
			).rejects.toMatchObject({ status: 400 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry an unknown memory', async () => {
		const { corsair, testDb } = await createClient({ key: 'm0-test-key' });
		try {
			respond(memoryNotFound, 404);

			await expect(
				corsair.mem0.api.memories.get({ memory_id: 'missing' }),
			).rejects.toMatchObject({ status: 404 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});

// Runs only with a real key, and reads only. CI has no key, so this is skipped
// there.
const describeIfKey = process.env.MEM0_API_KEY ? describe : describe.skip;

describeIfKey('Mem0 live smoke', () => {
	it('lists events for the project', async () => {
		const { corsair, testDb } = await createClient({
			key: process.env.MEM0_API_KEY,
		});
		try {
			const result = await corsair.mem0.api.events.list({ page: 1 });

			expect(result.count).toBeGreaterThanOrEqual(0);
			expect(Array.isArray(result.results)).toBe(true);
		} finally {
			testDb.cleanup();
		}
	});
});
