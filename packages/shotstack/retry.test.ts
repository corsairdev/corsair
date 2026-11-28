import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { shotstack } from './index';
import { renderDone, renderFailed, templateList } from './test-fixtures';

/**
 * The transport makes one attempt (rateLimitConfig maxRetries 0) and
 * error-handlers.ts decides the retries: a 429 once, after the 60-second
 * window (or Retry-After), reads on 5xx twice.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'shotstack', 'default');
	const corsair = createCorsair({
		plugins: [shotstack({ key: 'sst-test-key' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
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
	// Any call a test did not queue a response for throws, so no test can
	// reach the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
	jest.useRealTimers();
});

const RENDER = { id: '2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7' };

describe('retries through createCorsair', () => {
	it('retries a rate-limited render read and returns the status', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					errors: [
						{ status: '429', title: 'Too Many Requests', detail: 'slow down' },
					],
				},
				429,
				{
					'Retry-After': '1',
				},
			);
			respond(renderDone);

			const result = await corsair.shotstack.api.renders.get({ id: RENDER.id });

			expect(result.response.status).toBe('done');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the retry budget on a persistently rate-limited read', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 2; i += 1) {
				respond(
					{
						errors: [
							{
								status: '429',
								title: 'Too Many Requests',
								detail: 'slow down',
							},
						],
					},
					429,
				);
			}

			const promise = corsair.shotstack.api.renders.get({ id: RENDER.id });
			const settled = expect(promise).rejects.toMatchObject({ status: 429 });
			await jest.advanceTimersByTimeAsync(60_000);
			await settled;
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('replays a template list that got a 503, a read with no side effect', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ success: false, message: 'Service Unavailable' }, 503);
			respond(templateList);

			const result = await corsair.shotstack.api.templates.list({});

			expect(result.response.templates).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a render create that got a 503, which has no idempotency key', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ success: false, message: 'Service Unavailable' }, 503);

			await expect(
				corsair.shotstack.api.renders.create({
					timeline: {
						tracks: [
							{
								clips: [
									{ asset: { type: 'title', text: 'Hi' }, start: 0, length: 3 },
								],
							},
						],
					},
					output: { format: 'mp4', resolution: 'sd' },
				}),
			).rejects.toMatchObject({ status: 503 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 401 bad key', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					errors: [
						{
							status: '401',
							title: 'Unauthorized',
							detail: 'Missing API key.',
						},
					],
				},
				401,
			);

			await expect(
				corsair.shotstack.api.renders.get({ id: RENDER.id }),
			).rejects.toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits out the 60-second window before the retry when no Retry-After is sent', async () => {
		// Core sleeps between handler retries with a plain setTimeout, which
		// fake timers can advance. No Retry-After is documented, so the retry
		// waits for the fixed window to reset.
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respond({ success: false, message: 'Too Many Requests' }, 429);
			respond(renderDone);

			const promise = corsair.shotstack.api.renders.get({ id: RENDER.id });
			// The first attempt has already failed by the time the handler runs.
			await jest.advanceTimersByTimeAsync(0);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			// A millisecond short of the window: no second attempt yet.
			await jest.advanceTimersByTimeAsync(59_999);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
			await expect(promise).resolves.toMatchObject({
				response: { status: 'done' },
			});
		} finally {
			testDb.cleanup();
			jest.useRealTimers();
		}
	});

	it('never sends a live request when the plugin cannot reach the API', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(renderFailed);

			const result = await corsair.shotstack.api.renders.get({ id: RENDER.id });
			expect(result.response.status).toBe('failed');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
