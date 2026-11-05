import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { emailoctopus } from './index';
import { list, page, problem } from './test-fixtures';

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'emailoctopus', 'default');
	const corsair = createCorsair({
		plugins: [emailoctopus({ key: 'eo-test-key' })],
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

describe('EmailOctopus retries through the bound client', () => {
	it('retries a 429 and returns the next list page', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(problem, 429, { 'x-ratelimit-retry-after': '0' });
			respond(page(list));

			const result = await corsair.emailoctopus.api.lists.list({});

			expect(result.data?.[0]?.name).toBe('New clients list');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});
