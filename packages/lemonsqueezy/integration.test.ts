import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { lemonsqueezy } from './index';
import { customer, storeDetail } from './test-fixtures';

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'lemonsqueezy', 'default');
	const corsair = createCorsair({
		plugins: [lemonsqueezy()],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	await corsair.lemonsqueezy.keys.issue_new_dek();
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

/**
 * Lemon Squeezy answers `application/vnd.api+json`, so the mock sends that
 * media type: it is what makes corsair/http hand the body back as text for the
 * client to parse, which is the behaviour being exercised here.
 */
// unknown: response bodies are arbitrary provider JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/vnd.api+json' },
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

describe('Lemon Squeezy through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await expect(corsair.lemonsqueezy.api.stores.list({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('reads a store through the bound client with the stored key', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.lemonsqueezy.keys.set_api_key('stored-key');
			respond(storeDetail);

			const result = await corsair.lemonsqueezy.api.stores.get({
				storeId: '520119',
			});

			expect(result.data.attributes.slug).toBe('testingapi');
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new URL(url).pathname).toBe('/v1/stores/520119');
			expect(new Headers(init.headers).get('authorization')).toBe(
				'Bearer stored-key',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('creates a customer and returns its id', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.lemonsqueezy.keys.set_api_key('stored-key');
			respond(customer, 201);

			const result = await corsair.lemonsqueezy.api.customers.create({
				storeId: 520119,
				name: 'Corsair Probe',
				email: 'probe@example.com',
			});

			expect(result.data.id).toBe('10361540');
		} finally {
			testDb.cleanup();
		}
	});
});
