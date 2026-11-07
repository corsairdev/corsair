import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { happyscribe } from './index';
import {
	rateLimited,
	serverError,
	transcription,
	transcriptionList,
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

// HappyScribe signals its rate limit through `retry_in_seconds` in the 429
// body; the handler waits exactly that before the next attempt.
function respondRateLimited() {
	respond(rateLimited, 429);
}

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'happyscribe', 'default');
	const corsair = createCorsair({
		plugins: [happyscribe({ key: 'hs-test-key' })],
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

describe('HappyScribe 429 retries through the bound client', () => {
	it('waits retry_in_seconds before the second attempt', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondRateLimited();
			respond(transcriptionList);

			const pending = corsair.happyscribe.api.transcriptions.list({
				organizationId: 123,
			});
			// The API asked for 30s; 1s earlier the retry has not fired.
			await jest.advanceTimersByTimeAsync(29_999);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1);
			// unknown: the rejection is typed loosely to assert on the parsed
			// page shape through the bound client.
			const done = (await pending) as { results: unknown[] };
			expect(done.results).toHaveLength(2);
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

			const pending = corsair.happyscribe.api.transcriptions.list({
				organizationId: 123,
			});
			const rejection = expect(pending).rejects.toMatchObject({
				status: 429,
			});
			await jest.advanceTimersByTimeAsync(130_000);

			await rejection;
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a 5xx on create, which spends credits', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(serverError, 503);

			await expect(
				corsair.happyscribe.api.transcriptions.create({
					organizationId: 123,
					name: 'Interview',
					language: 'en-GB',
					tmpUrl: 'https://example.com/media.mp3',
				}),
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
			respond(transcriptionList);

			const pending = corsair.happyscribe.api.transcriptions.list({
				organizationId: 123,
			});
			await jest.advanceTimersByTimeAsync(4_000);
			// unknown: same loose assertion through the bound client.
			const done = (await pending) as { results: unknown[] };
			expect(done.results).toHaveLength(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a rate-limited flagged read, which never ran', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondRateLimited();
			respond(transcription);

			const pending = corsair.happyscribe.api.transcriptions.getDetails({
				fileId: transcription.id,
			});
			await jest.advanceTimersByTimeAsync(30_000);
			await expect(pending).resolves.toMatchObject({ id: transcription.id });
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});

// transcriptions.create is a job: the bound client surfaces the transcription
// id at once while processing continues.
describe('HappyScribe create transcription as a job', () => {
	it('returns the transcription with its running state', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ ...transcription, state: 'automatic_transcribing' });

			const result = await corsair.happyscribe.api.transcriptions.create({
				organizationId: 123,
				name: 'Interview',
				language: 'en-GB',
				tmpUrl: 'https://example.com/media.mp3',
			});
			expect(result.state).toBe('automatic_transcribing');
		} finally {
			testDb.cleanup();
		}
	});
});
