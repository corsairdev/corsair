import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { customjs } from './index';
import { invalidKey, pageCreated, tooManyRequests } from './test-fixtures';
import { captureError } from './test-helpers';

/**
 * These run through `createCorsair` rather than the endpoint functions, because
 * the endpoint-level tests call the client directly and the client never retries.
 * Only the core path proves the handlers are wired in.
 */
async function createClient(options: Parameters<typeof customjs>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'customjs', 'default');
	const corsair = createCorsair({
		plugins: [customjs(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

const PDF_BYTES = new Uint8Array([
	0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37,
]);

let fetchMock: jest.SpyInstance;

function respondPdf() {
	fetchMock.mockResolvedValueOnce(
		new Response(PDF_BYTES, {
			status: 200,
			headers: { 'Content-Type': 'application/pdf' },
		}),
	);
}

/** The exhausted-window answer: a 403 whose body is the only tell. */
function respondRateLimited(retryAfter?: string) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(tooManyRequests), {
			status: 403,
			headers: {
				'Content-Type': 'application/json',
				...(retryAfter ? { 'Retry-After': retryAfter } : {}),
			},
		}),
	);
}

function respondInvalidKey() {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(invalidKey), {
			status: 403,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function respondFailure(status: number) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify({ error: { message: 'boom' } }), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

beforeEach(() => {
	// A spy with no queued response would fall through to the real fetch and send
	// a live request, so an unstubbed call fails instead.
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
 * Core sleeps between retries with a plain setTimeout, so fake timers step over
 * the backoff instead of waiting it out.
 */
async function withFakeTimers<T>(run: Promise<T>): Promise<T> {
	let settled = false;
	const tracked = run.finally(() => {
		settled = true;
	});
	for (let step = 0; step < 12 && !settled; step++) {
		await Promise.resolve();
		await jest.advanceTimersByTimeAsync(31_000);
	}
	return tracked;
}

describe('retry behaviour', () => {
	it('retries the exhausted window and returns the next response', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'customjs-test-key',
		});
		try {
			respondRateLimited('30');
			respondPdf();

			const result = await withFakeTimers(
				corsair.customjs.api.pdf.fromHtml({ html: '<h1>Hello</h1>' }),
			);

			expect(result.contentType).toBe('application/pdf');
			expect(result.byteLength).toBe(PDF_BYTES.length);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	// The window is a throughput limit, so CustomJS never started the work and a
	// write is safe to send again.
	it('retries a rate-limited write', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'customjs-test-key',
		});
		try {
			respondRateLimited('30');
			fetchMock.mockResolvedValueOnce(
				new Response(JSON.stringify(pageCreated), {
					status: 201,
					headers: { 'Content-Type': 'application/json' },
				}),
			);

			const result = await withFakeTimers(
				corsair.customjs.api.pages.create({
					name: 'Launch',
					htmlContent: '<h1>hi</h1>',
				}),
			);

			expect(result.pageId).toBe(pageCreated.pageId);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after the configured attempts', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'customjs-test-key',
		});
		try {
			respondRateLimited('30');
			respondRateLimited('30');
			respondRateLimited('30');
			respondRateLimited('30');

			const error = await withFakeTimers(
				captureError(
					corsair.customjs.api.pdf.fromHtml({ html: '<h1>Hello</h1>' }),
				),
			);

			expect(error).toMatchObject({ isRateLimit: true, status: 403 });
			// One attempt plus the three the handler allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	// The live 403 for a used-up day has no Retry-After, and the quota stays
	// closed until the next day, so the call fails at once.
	it('does not retry an exhausted daily quota', async () => {
		const { corsair, testDb } = await createClient({
			key: 'customjs-test-key',
		});
		try {
			respondRateLimited();

			const error = await captureError(
				corsair.customjs.api.pdf.fromHtml({ html: '<h1>Hello</h1>' }),
			);

			expect(error).toMatchObject({ isRateLimit: true, status: 403 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a bad key', async () => {
		const { corsair, testDb } = await createClient({
			key: 'customjs-test-key',
		});
		try {
			respondInvalidKey();

			const error = await captureError(
				corsair.customjs.api.pdf.fromHtml({ html: '<h1>Hello</h1>' }),
			);

			expect(error).toMatchObject({ isAuthError: true, status: 403 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	// A 5xx may have published the page before it failed, so the second call would
	// publish a second page.
	it('never replays a page creation on a 5xx', async () => {
		const { corsair, testDb } = await createClient({
			key: 'customjs-test-key',
		});
		try {
			respondFailure(502);

			const error = await captureError(
				corsair.customjs.api.pages.create({
					name: 'Launch',
					htmlContent: '<h1>hi</h1>',
				}),
			);

			expect(error).toMatchObject({ status: 502, replayable: false });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	// The code decides what it does, so a script that already sent a POST must not
	// be run again after a failure.
	it('never replays inline JavaScript on a 5xx', async () => {
		const { corsair, testDb } = await createClient({
			key: 'customjs-test-key',
		});
		try {
			respondFailure(502);

			const error = await captureError(
				corsair.customjs.api.javascript.run({ code: 'return 1' }),
			);

			expect(error).toMatchObject({ status: 502, replayable: false });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	// A click or a type can submit a form, so the steps are not safe to repeat.
	it('never replays browser commands on a 5xx', async () => {
		const { corsair, testDb } = await createClient({
			key: 'customjs-test-key',
		});
		try {
			respondFailure(502);

			const error = await captureError(
				corsair.customjs.api.scrape.page({
					url: 'https://example.com',
					commands: [
						{ action: 'click', selector: 'button[type=submit]' },
						{ action: 'extract', selector: 'h1', as: 'heading' },
					],
				}),
			);

			expect(error).toMatchObject({ status: 502, replayable: false });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	// A body that dies after the headers arrived used to escape as a native error,
	// so the transport handlers never saw it and the read got no retry.
	it('retries a render whose body was cut off', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'customjs-test-key',
		});
		try {
			fetchMock.mockResolvedValueOnce(
				new Response(
					new ReadableStream({
						start(controller) {
							controller.enqueue(new Uint8Array([1, 2, 3]));
							controller.error(new TypeError('terminated'));
						},
					}),
					{ status: 200, headers: { 'Content-Type': 'application/pdf' } },
				),
			);
			respondPdf();

			const result = await withFakeTimers(
				corsair.customjs.api.pdf.fromHtml({ html: '<h1>Hello</h1>' }),
			);

			expect(result.byteLength).toBe(PDF_BYTES.length);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a render on a 5xx, which leaves nothing behind', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'customjs-test-key',
		});
		try {
			respondFailure(502);
			respondPdf();

			const result = await withFakeTimers(
				corsair.customjs.api.pdf.fromHtml({ html: '<h1>Hello</h1>' }),
			);

			expect(result.byteLength).toBe(PDF_BYTES.length);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	// A 429 with no reset time: this pins the fallback the plugin uses when there
	// is no Retry-After header, the whole 60s window, stepped by hand.
	it('waits the whole window on a 429 with no Retry-After', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'customjs-test-key',
		});
		try {
			fetchMock.mockResolvedValueOnce(
				new Response(JSON.stringify(tooManyRequests), {
					status: 429,
					headers: { 'Content-Type': 'application/json' },
				}),
			);
			respondPdf();

			const run = corsair.customjs.api.pdf.fromHtml({ html: '<h1>Hi</h1>' });
			let settled = false;
			void run.finally(() => {
				settled = true;
			});

			// The first attempt and its failure.
			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(0);
			expect(settled).toBe(false);

			// A short backoff would fire here and retry inside the closed window.
			await jest.advanceTimersByTimeAsync(7_000);
			expect(settled).toBe(false);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			await jest.advanceTimersByTimeAsync(53_000);
			await expect(run).resolves.toMatchObject({
				contentType: 'application/pdf',
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits the Retry-After header when one is sent', async () => {
		jest.useFakeTimers();
		const { corsair, testDb } = await createClient({
			key: 'customjs-test-key',
		});
		try {
			respondRateLimited('30');
			respondPdf();

			const run = corsair.customjs.api.pdf.fromHtml({ html: '<h1>Hi</h1>' });
			let settled = false;
			void run.finally(() => {
				settled = true;
			});

			await Promise.resolve();
			await jest.advanceTimersByTimeAsync(0);
			expect(settled).toBe(false);

			// Twenty-nine seconds is inside the window the header asked for.
			await jest.advanceTimersByTimeAsync(29_000);
			expect(settled).toBe(false);
			await jest.advanceTimersByTimeAsync(1_000);
			await expect(run).resolves.toMatchObject({
				contentType: 'application/pdf',
			});
		} finally {
			testDb.cleanup();
		}
	});
});
