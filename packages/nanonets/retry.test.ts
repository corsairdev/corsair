import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { nanonets } from './index';
import {
	error429,
	error500,
	filesListResponse,
	modelId,
	predictionEnvelope,
} from './test-fixtures';

// Endpoint tests call the HTTP client, which makes one attempt
// (rateLimitConfig.maxRetries: 0); only the client corsair binds retries.
// CI skips integration.test.ts, so the 429 path is exercised here.

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'nanonets', 'default');
	const corsair = createCorsair({
		plugins: [nanonets({ key: 'nn-test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown,
	status: number,
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

describe('Nanonets retry through createCorsair', () => {
	it('retries a 429 and returns the next response', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(error429, 429, { 'Retry-After': '1' });
			respond(predictionEnvelope, 200);

			const result = await corsair.nanonets.api.predictions.createFromUrls({
				model_id: modelId,
				urls: ['https://img.example/a.png'],
			});

			expect(result.message).toBe('Success');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits the documented 30 seconds between no-header retries', async () => {
		const { corsair, testDb } = await createClient();
		jest.useFakeTimers();
		try {
			respond(error429, 429);
			respond(predictionEnvelope, 200);

			const pending = corsair.nanonets.api.predictions.createFromUrls({
				model_id: modelId,
				urls: ['https://img.example/a.png'],
			});

			await jest.advanceTimersByTimeAsync(29_999);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(1);
			await expect(pending).resolves.toMatchObject({ message: 'Success' });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			jest.useRealTimers();
			testDb.cleanup();
		}
	});

	it('gives up after three rate-limit retries', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i++) {
				respond(error429, 429, { 'Retry-After': '1' });
			}

			await expect(
				corsair.nanonets.api.predictions.createFromUrls({
					model_id: modelId,
					urls: ['https://img.example/a.png'],
				}),
			).rejects.toMatchObject({ status: 429, isRateLimit: true });
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a prediction on a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(error500, 500);

			await expect(
				corsair.nanonets.api.predictions.createFromUrls({
					model_id: modelId,
					urls: ['https://img.example/a.png'],
				}),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a 5xx on a replay-safe read', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(error500, 500);
			respond(filesListResponse, 200);

			const result = await corsair.nanonets.api.predictions.listFiles({
				model_id: modelId,
				start_day_interval: 20357,
				current_batch_day: 20360,
			});

			expect(result.moderated_images_count).toBe(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});
