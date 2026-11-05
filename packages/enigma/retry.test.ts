import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { enigma } from './index';
import {
	badKeyResponse,
	brand,
	locationDetail,
	searchResponse,
} from './test-fixtures';

const RETRY_AFTER_SECONDS = 7;

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

function rateLimited() {
	respond(badKeyResponse, 429, {
		'Retry-After': String(RETRY_AFTER_SECONDS),
	});
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.useFakeTimers();
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.useRealTimers();
	jest.restoreAllMocks();
});

describe('Enigma retry behavior through createCorsair', () => {
	it('waits out Retry-After before the second attempt', async () => {
		const { corsair, testDb } = await createClient();
		try {
			rateLimited();
			respond(searchResponse(brand));

			const pending = corsair.enigma.api.brands.match({
				name: 'Starbucks',
			});
			await jest.advanceTimersByTimeAsync(RETRY_AFTER_SECONDS * 1000 - 1);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1);
			await expect(pending).resolves.toMatchObject({
				brand: { id: brand.id },
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the third rate-limited retry', async () => {
		const { corsair, testDb } = await createClient();
		try {
			rateLimited();
			rateLimited();
			rateLimited();
			rateLimited();

			const pending = corsair.enigma.api.brands.match({
				name: 'Starbucks',
			});
			const rejection = expect(pending).rejects.toMatchObject({
				status: 429,
			});
			await jest.advanceTimersByTimeAsync(
				RETRY_AFTER_SECONDS * 1000 * 3 + 1000,
			);

			await rejection;
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

			const pending = corsair.enigma.api.locations.match({
				name: 'Bluestone Lane',
			});
			await jest.advanceTimersByTimeAsync(10_000);

			await expect(pending).resolves.toMatchObject({
				location: { id: locationDetail.id },
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});
