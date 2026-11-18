import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { emailoctopus } from './index';
import { list, page } from './test-fixtures';

const describeIfKey = process.env.EMAILOCTOPUS_API_KEY
	? describe
	: describe.skip;

async function createClient(options: Parameters<typeof emailoctopus>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'emailoctopus', 'default');
	const corsair = createCorsair({
		plugins: [emailoctopus(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
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

describe('EmailOctopus plugin through createCorsair', () => {
	it('fails fast when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.emailoctopus.keys.issue_new_dek();
			await expect(corsair.emailoctopus.api.lists.list({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the API key stored for the account', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.emailoctopus.keys.issue_new_dek();
			await corsair.emailoctopus.keys.set_api_key('eo-stored-key');
			respond(page(list));

			await corsair.emailoctopus.api.lists.list({});

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('authorization')).toBe(
				'Bearer eo-stored-key',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('lists lists with the configured key', async () => {
		const { corsair, testDb } = await createClient({ key: 'eo-test-key' });
		try {
			respond(page(list));
			const result = await corsair.emailoctopus.api.lists.list({ limit: 10 });
			expect(result.data?.[0]?.name).toBe('New clients list');
			const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe('https://api.emailoctopus.com/lists?limit=10');
		} finally {
			testDb.cleanup();
		}
	});
});

describeIfKey('EmailOctopus live API', () => {
	it('lists lists with the supplied key', async () => {
		const { corsair, testDb } = await createClient({
			key: process.env.EMAILOCTOPUS_API_KEY,
		});
		try {
			const result = await corsair.emailoctopus.api.lists.list({ limit: 1 });
			expect(Array.isArray(result.data ?? [])).toBe(true);
		} finally {
			testDb.cleanup();
		}
	}, 30_000);
});
