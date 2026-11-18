import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { imagekit } from './index';
import { file, rateLimited, serverError } from './test-fixtures';

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

// ImageKit sends no Retry-After; its 429 carries X-RateLimit-Reset in
// milliseconds, a header core cannot read, so retries wait the handler's
// 1s fallback.
function respondRateLimited() {
	respond(rateLimited, 429);
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'imagekit', 'default');
	const corsair = createCorsair({
		plugins: [imagekit({ key: 'ik-test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
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

describe('ImageKit 429 retries through the bound client', () => {
	it('waits the 1s no-header fallback before the second attempt', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondRateLimited();
			respond([file]);

			const pending = corsair.imagekit.api.files.list({ limit: 25 });
			await jest.advanceTimersByTimeAsync(999);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1);
			await expect(pending).resolves.toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a rate-limited write, which never ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondRateLimited();
			respond({});

			const pending = corsair.imagekit.api.files.delete({
				fileId: file.fileId,
			});
			await jest.advanceTimersByTimeAsync(8_000);
			await expect(pending).resolves.toBeDefined();
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the third rate-limited retry', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondRateLimited();
			respondRateLimited();
			respondRateLimited();
			respondRateLimited();

			const pending = corsair.imagekit.api.files.list({});
			const rejection = expect(pending).rejects.toMatchObject({
				status: 429,
			});
			// 1s + 2s + 4s of backoff, plus margin.
			await jest.advanceTimersByTimeAsync(10_000);

			await rejection;
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a 5xx on delete, which may have gone through', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(serverError, 503);

			await expect(
				corsair.imagekit.api.files.delete({ fileId: file.fileId }),
			).rejects.toMatchObject({ status: 503 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a flagged read that got a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(serverError, 503);
			respond([file]);

			const pending = corsair.imagekit.api.files.list({});
			await jest.advanceTimersByTimeAsync(4_000);
			await expect(pending).resolves.toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});
