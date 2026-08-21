import { ApiError } from 'corsair/http';
import { KaggleAPIError, makeKaggleBinaryRequest } from './client';

// `makeKaggleBinaryRequest` talks to the global `fetch` directly. Spy on it so the
// retry-after parsing, network-error wrapping, and filename decoding are exercised
// offline — the live smoke tests only hit JSON list endpoints and never reach this
// error/branch logic.
const fetchSpy = jest.spyOn(globalThis as { fetch: typeof fetch }, 'fetch');

async function captureError(promise: Promise<unknown>): Promise<unknown> {
	try {
		await promise;
	} catch (error) {
		return error;
	}
	throw new Error('expected promise to reject');
}

beforeEach(() => {
	fetchSpy.mockReset();
});

afterAll(() => {
	fetchSpy.mockRestore();
});

describe('makeKaggleBinaryRequest', () => {
	it('parses a numeric retry-after header (seconds → ms) on 429', async () => {
		fetchSpy.mockResolvedValue(
			new Response('rate limited', {
				status: 429,
				headers: { 'retry-after': '5' },
			}),
		);
		const error = (await captureError(
			makeKaggleBinaryRequest(
				'/competitions/data/download-all/titanic',
				'user:key',
			),
		)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(5000);
	});

	it('rejects a malformed retry-after via the NaN guard', async () => {
		fetchSpy.mockResolvedValue(
			new Response('rate limited', {
				status: 429,
				headers: { 'retry-after': 'not-a-number-or-date' },
			}),
		);
		const error = (await captureError(
			makeKaggleBinaryRequest('/x', 'user:key'),
		)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBeUndefined();
	});

	it('rejects a negative (past-date) retry-after', async () => {
		fetchSpy.mockResolvedValue(
			new Response('rate limited', {
				status: 429,
				headers: { 'retry-after': 'Wed, 21 Oct 2015 07:28:00 GMT' },
			}),
		);
		const error = (await captureError(
			makeKaggleBinaryRequest('/x', 'user:key'),
		)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBeUndefined();
	});

	it('wraps network failures in KaggleAPIError', async () => {
		fetchSpy.mockRejectedValue(new Error('connection reset'));
		const error = await captureError(makeKaggleBinaryRequest('/x', 'user:key'));
		expect(error).toBeInstanceOf(KaggleAPIError);
	});

	it('wraps mid-stream read failures in KaggleAPIError', async () => {
		const body = new ReadableStream<Uint8Array>({
			pull(controller) {
				controller.error(new Error('stream reset'));
			},
		});
		fetchSpy.mockResolvedValue(new Response(body, { status: 200 }));
		const error = await captureError(makeKaggleBinaryRequest('/x', 'user:key'));
		expect(error).toBeInstanceOf(KaggleAPIError);
		expect((error as Error).message).toBe('stream reset');
	});

	it('returns base64 payload and percent-decodes RFC 5987 filenames', async () => {
		fetchSpy.mockResolvedValue(
			new Response(Buffer.from('hello'), {
				status: 200,
				headers: {
					'content-type': 'application/zip',
					'content-disposition': "attachment; filename*=UTF-8''report%20q1.csv",
				},
			}),
		);
		const out = await makeKaggleBinaryRequest('/x', 'user:key');
		expect(out.contentType).toBe('application/zip');
		expect(out.size).toBe(5);
		expect(out.dataBase64).toBe(Buffer.from('hello').toString('base64'));
		expect(out.fileName).toBe('report q1.csv');
	});

	it('stops reading a non-ok error body after the cap', async () => {
		let pulls = 0;
		const body = new ReadableStream<Uint8Array>({
			pull(controller) {
				pulls += 1;
				if (pulls > 30) {
					controller.close();
					return;
				}
				controller.enqueue(Buffer.from('e'.repeat(1000)));
			},
		});
		fetchSpy.mockResolvedValue(
			new Response(body, {
				status: 500,
				statusText: 'Internal Server Error',
			}),
		);
		const error = (await captureError(
			makeKaggleBinaryRequest('/x', 'user:key'),
		)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(typeof error.body).toBe('string');
		expect((error.body as string).length).toBeLessThanOrEqual(4096);
		expect(pulls).toBeLessThan(30);
	});
});
