import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { enigma } from './index';
import {
	badKeyResponse,
	brand,
	locationDetail,
	searchResponse,
} from './test-fixtures';

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'enigma', 'default');
	const corsair = createCorsair({
		plugins: [enigma({ key: 'eg-test-key' })],
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

describe('Enigma retry behavior through createCorsair', () => {
	it('retries a 429 through the bound client, which the HTTP layer does not', async () => {
		const { corsair, testDb } = await createClient();
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

	it('gives up after the third rate-limited attempt', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(badKeyResponse, 429, { 'Retry-After': '1' });
			respond(badKeyResponse, 429, { 'Retry-After': '1' });
			respond(badKeyResponse, 429, { 'Retry-After': '1' });
			respond(badKeyResponse, 429, { 'Retry-After': '1' });

			await expect(
				corsair.enigma.api.brands.match({ name: 'Starbucks' }),
			).rejects.toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 502 because every operation is a read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(badKeyResponse, 502);
			respond(searchResponse(locationDetail));

			const result = await corsair.enigma.api.locations.match({
				name: 'Bluestone Lane',
			});

			expect(result.location?.id).toBe(locationDetail.id);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});
