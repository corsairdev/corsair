import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { googleslides } from './index';

/**
 * Endpoint-level tests mock corsair/http's request, which never retries. Only
 * the bound client runs the error handlers, so retry behaviour is proven here.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'googleslides', 'default');
	const corsair = createCorsair({
		plugins: [googleslides({ key: 'test-access-token' })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

function respondJson(
	body: unknown, // unknown: a hand-built fixture, JSON-encoded for fetch.
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

const presentationReply = {
	presentationId: 'deck-1',
	title: 'Deck',
	slides: [],
};

beforeEach(() => {
	// A spy with no queued response would fall through to the real fetch and
	// send a live request, so an unstubbed call fails instead.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		throw new Error('unmocked fetch: queue a response first');
	});
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
	jest.useRealTimers();
});

/**
 * Core sleeps with a plain setTimeout, so fake timers step over the delay
 * instead of waiting for it.
 */
async function withFakeTimers<T>(run: Promise<T>): Promise<T> {
	let settled = false;
	const tracked = run.finally(() => {
		settled = true;
	});
	// The no-header rate-limit fallback is 60s per attempt, so each step has to
	// clear one whole attempt for the give-up case to settle.
	for (let step = 0; step < 12 && !settled; step++) {
		await Promise.resolve();
		await jest.advanceTimersByTimeAsync(61_000);
	}
	return tracked;
}

describe('retry behaviour through the bound client', () => {
	it('retries a 429 on a read and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respondJson({ error: { status: 'RESOURCE_EXHAUSTED' } }, 429, {
				'Retry-After': '2',
			});
			respondJson(presentationReply);

			const result = await withFakeTimers(
				corsair.googleslides.api.presentations.get({
					presentationId: 'deck-1',
				}),
			);

			expect(result.presentationId).toBe('deck-1');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the configured number of attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			// maxRetries 4 means five attempts, all refused.
			for (let attempt = 0; attempt < 5; attempt++) {
				respondJson({ error: { status: 'RESOURCE_EXHAUSTED' } }, 429);
			}

			const error = await withFakeTimers(
				corsair.googleslides.api.presentations
					.get({ presentationId: 'deck-1' })
					// unknown: rejection reason, narrowed by the assertion below.
					.catch((caught: unknown) => caught),
			);

			expect(error).toMatchObject({ status: 429 });
			expect(fetchMock).toHaveBeenCalledTimes(5);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not replay a write after a 5xx', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson({ error: { message: 'backend error' } }, 500);

			await expect(
				corsair.googleslides.api.text.insert({
					presentationId: 'deck-1',
					objectId: 'shape-1',
					text: 'hi',
				}),
			).rejects.toMatchObject({ status: 500 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read after a 5xx', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respondJson({ error: { message: 'backend error' } }, 503);
			respondJson(presentationReply);

			const result = await withFakeTimers(
				corsair.googleslides.api.presentations.get({
					presentationId: 'deck-1',
				}),
			);

			expect(result.presentationId).toBe('deck-1');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry an auth failure', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson({ error: { status: 'UNAUTHENTICATED' } }, 401);

			await expect(
				corsair.googleslides.api.presentations.get({
					presentationId: 'deck-1',
				}),
			).rejects.toMatchObject({ status: 401 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry an exhausted daily quota', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respondJson(
				{
					error: {
						code: 403,
						status: 'PERMISSION_DENIED',
						errors: [{ reason: 'dailyLimitExceeded' }],
					},
				},
				403,
			);

			await expect(
				corsair.googleslides.api.presentations.get({
					presentationId: 'deck-1',
				}),
			).rejects.toMatchObject({ status: 403 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits a full per-minute window when a 429 carries no Retry-After', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respondJson({ error: { status: 'RESOURCE_EXHAUSTED' } }, 429);
			respondJson(presentationReply);

			const pending = corsair.googleslides.api.presentations.get({
				presentationId: 'deck-1',
			});
			await Promise.resolve();
			await Promise.resolve();
			// Four seconds would land inside the same exhausted minute, so the
			// fallback waits for the next window instead.
			await jest.advanceTimersByTimeAsync(4_000);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(57_000);
			await pending;
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('a write followed by a read is not replayed', () => {
	it('returns the created slide when the read-back fails, without retrying', async () => {
		const { corsair, testDb } = await createClient();
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		try {
			// The createSlide batch succeeds.
			respondJson({
				presentationId: 'deck-1',
				replies: [{ createSlide: { objectId: 'slide-1' } }],
			});
			// The read-back that names the layout fails with a 503.
			respondJson({ error: { message: 'backend error' } }, 503);

			const result = await corsair.googleslides.api.slides.create({
				presentationId: 'deck-1',
				layout: 'BLANK',
			});

			// The slide exists, so the call reports it rather than failing over a
			// read that can be redone. The layout is the one thing the read was for.
			expect(result.slideObjectId).toBe('slide-1');
			expect(result.layoutObjectId).toBeUndefined();
			// Exactly two requests: the batch and the failed read. A replay would
			// add a second slide.
			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(warn).toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('does repeat presentations.get, which only reads', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient();
		try {
			respondJson({ error: { message: 'backend error' } }, 503);
			respondJson(presentationReply);

			const result = await withFakeTimers(
				corsair.googleslides.api.presentations.get({
					presentationId: 'deck-1',
				}),
			);

			expect(result.presentationId).toBe('deck-1');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});
