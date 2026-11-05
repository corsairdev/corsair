import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { EnigmaAPIError } from './client';
import { enigma } from './index';
import { badKeyResponse, brand, searchResponse } from './test-fixtures';

const describeIfKey = process.env.ENIGMA_API_KEY ? describe : describe.skip;

async function createClient(options: Parameters<typeof enigma>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'enigma', 'default');
	const corsair = createCorsair({
		plugins: [enigma(options)],
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

describe('Enigma plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is configured', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.enigma.keys.issue_new_dek();
			await expect(
				corsair.enigma.api.brands.match({ name: 'Starbucks' }),
			).rejects.toThrow(/auth-missing/);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the API key stored for the account', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.enigma.keys.issue_new_dek();
			await corsair.enigma.keys.set_api_key('eg-stored-key');
			respond(searchResponse(brand));

			await corsair.enigma.api.brands.match({ name: 'Starbucks' });

			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			const headers = new Headers(init.headers);
			expect(headers.get('x-api-key')).toBe('eg-stored-key');
			expect(headers.get('authorization')).toBeNull();
		} finally {
			testDb.cleanup();
		}
	});

	it('matches a brand with the configured key', async () => {
		const { corsair, testDb } = await createClient({ key: 'eg-test-key' });
		try {
			respond(searchResponse(brand));

			const result = await corsair.enigma.api.brands.match({
				name: 'Starbucks',
			});

			expect(result.brand?.names).toEqual(['STARBUCKS']);
			const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe('https://api.enigma.com/graphql');
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 429 and returns the next response', async () => {
		const { corsair, testDb } = await createClient({ key: 'eg-test-key' });
		try {
			respond(badKeyResponse, 429, { 'Retry-After': '1' });
			respond(searchResponse(brand));

			const result = await corsair.enigma.api.brands.match({
				name: 'Starbucks',
			});

			expect(result.brand?.id).toBe(brand.id);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad key', async () => {
		const { corsair, testDb } = await createClient({ key: 'eg-bad-key' });
		try {
			respond(badKeyResponse, 401);

			// unknown: a rejection can be any value until toBeInstanceOf narrows it.
			const error = await corsair.enigma.api.brands
				.match({ name: 'Starbucks' })
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(EnigmaAPIError);
			expect(error).toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});

describeIfKey('Enigma live smoke (read-only)', () => {
	it('matches a brand by name', async () => {
		const { corsair, testDb } = await createClient({
			key: process.env.ENIGMA_API_KEY,
		});
		try {
			const result = await corsair.enigma.api.brands.match({
				name: 'Starbucks',
				address: { state: 'WA' },
				matchThreshold: 0.5,
			});
			expect(result.brand?.names[0]).toBeTruthy();
		} finally {
			testDb.cleanup();
		}
	});

	it('gets a brand detail by id when a match returned one', async () => {
		const { corsair, testDb } = await createClient({
			key: process.env.ENIGMA_API_KEY,
		});
		try {
			const matched = await corsair.enigma.api.brands.match({
				name: 'Starbucks',
			});
			if (!matched.brand) return;

			const detail = await corsair.enigma.api.brands.get({
				id: matched.brand.id,
				locationsFirst: 5,
			});
			expect(detail.brand?.id).toBe(matched.brand.id);
		} finally {
			testDb.cleanup();
		}
	});
});
