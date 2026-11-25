import {
	describeListcleanError,
	envelopeData,
	envelopeMessage,
	LISTCLEAN_API_BASE,
	ListcleanAPIError,
	makeListcleanRequest,
	readEnvelope,
} from './client';
import { RESULT_ROWS } from './test-fixtures';
import {
	captureError,
	downloadResponse,
	fail,
	htmlResponse,
	installFetchMock,
	lastCall,
	mockFetch,
	ok,
	restoreFetchMock,
	sentHeader,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('Listclean client', () => {
	it('sends the key as a plain X-Auth-Token header, not a Bearer token', async () => {
		mockFetch(ok({}));

		await makeListcleanRequest('lc-key', {
			method: 'GET',
			path: '/credits',
			replayable: true,
		});

		expect(lastCall().url).toBe(`${LISTCLEAN_API_BASE}/credits`);
		expect(sentHeader('X-Auth-Token')).toBe('lc-key');
		expect(sentHeader('Authorization')).toBeNull();
	});

	it('returns the whole envelope, and the readers pick data and message', async () => {
		mockFetch(ok({ credits: 5 }));

		const raw = await makeListcleanRequest('lc-key', {
			method: 'GET',
			path: '/credits',
			replayable: true,
		});

		expect(envelopeData(raw)).toEqual({ credits: 5 });
		expect(envelopeMessage(raw)).toBe('OK');
	});

	it('treats a 200 whose envelope says success 0 as a failure', async () => {
		mockFetch(fail('Invalid token or token expired'));

		const error = await captureError(
			makeListcleanRequest('lc-key', {
				method: 'GET',
				path: '/credits',
				replayable: true,
			}),
		);

		expect(error).toBeInstanceOf(ListcleanAPIError);
		// No HTTP status rides along: request() only surfaces the body here.
		expect(error).toMatchObject({
			message: expect.stringContaining('Invalid token or token expired'),
		});
		expect((error as ListcleanAPIError).status).toBeUndefined();
	});

	it('carries the envelope error code on an HTTP error', async () => {
		mockFetch(fail('Invalid token or token expired', 401, 401));

		const error = await captureError(
			makeListcleanRequest('lc-key', {
				method: 'GET',
				path: '/lists/',
				replayable: true,
			}),
		);

		expect(error).toBeInstanceOf(ListcleanAPIError);
		const apiError = error as ListcleanAPIError;
		expect(apiError.status).toBe(401);
		expect(apiError.code).toBe(401);
		expect(apiError.isAuthError).toBe(true);
		expect(apiError.message).toContain('Invalid token or token expired');
	});

	it('fails loudly on the HTML page a missing route answers, instead of returning an empty result', async () => {
		mockFetch(htmlResponse(404));

		const error = await captureError(
			makeListcleanRequest('lc-key', {
				method: 'GET',
				path: '/totally-not-a-route',
				replayable: true,
			}),
		);

		// Core reports the 404 before the body is read; either way the caller
		// gets a thrown ListcleanAPIError, never an empty result.
		expect(error).toBeInstanceOf(ListcleanAPIError);
		const apiError = error as ListcleanAPIError;
		expect(apiError.status).toBe(404);
		expect(apiError.message).toContain('404');
	});

	it('fails loudly on an HTML body that arrives over a 200', async () => {
		mockFetch(htmlResponse(200));

		const error = await captureError(
			makeListcleanRequest('lc-key', {
				method: 'GET',
				path: '/lists/',
				replayable: true,
			}),
		);

		expect(error).toBeInstanceOf(ListcleanAPIError);
		expect((error as ListcleanAPIError).message).toContain(
			'not the JSON envelope',
		);
	});

	it('keeps a retry-after value on an HTTP error', async () => {
		mockFetch(
			new Response(JSON.stringify({ success: 0, message: 'Slow' }), {
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '3' },
			}),
		);

		const error = await captureError(
			makeListcleanRequest('lc-key', {
				method: 'GET',
				path: '/credits',
				replayable: true,
			}),
		);

		expect(error).toMatchObject({ status: 429, retryAfter: 3000 });
	});

	it('wraps a dropped connection as a transport error and carries the replay flag', async () => {
		const spy = jest.spyOn(globalThis, 'fetch');
		// Replace the installFetchMock stub so the rejection below is the only
		// behaviour this test gets.
		spy.mockReset();
		spy.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await captureError(
			makeListcleanRequest('lc-key', {
				method: 'POST',
				path: '/verify/email/batch',
				body: { emails: ['a@example.com'] },
				replayable: false,
			}),
		);

		expect(error).toBeInstanceOf(ListcleanAPIError);
		const apiError = error as ListcleanAPIError;
		expect(apiError.transport).toBe(true);
		expect(apiError.replayable).toBe(false);
		expect(apiError.method).toBe('POST');
	});

	it('parses the download route JSON stream and fails loudly on HTML', async () => {
		mockFetch(downloadResponse(RESULT_ROWS));

		const raw = await makeListcleanRequest('lc-key', {
			method: 'GET',
			path: '/downloads/json/159261/clean',
			replayable: true,
			download: true,
		});

		expect(Array.isArray(raw)).toBe(true);

		// A 200 whose body is not JSON (a proxy page) must throw, not parse as
		// an empty result list. A 404 is reported by core first.
		mockFetch(htmlResponse(200));
		const error = await captureError(
			makeListcleanRequest('lc-key', {
				method: 'GET',
				path: '/downloads/json/1/clean',
				replayable: true,
				download: true,
			}),
		);
		expect(error).toBeInstanceOf(ListcleanAPIError);
		expect((error as ListcleanAPIError).message).toContain('not JSON');
	});

	it('drops undefined query keys instead of sending them', async () => {
		mockFetch(ok([]));

		await makeListcleanRequest('lc-key', {
			method: 'GET',
			path: '/logs',
			query: {
				start_date: '2026-11-01',
				end_date: '2026-11-25',
				email: undefined,
			},
			replayable: true,
		});

		expect(lastCall().url).toBe(
			`${LISTCLEAN_API_BASE}/logs?start_date=2026-11-01&end_date=2026-11-25`,
		);
	});
});

describe('envelope readers', () => {
	it('reads the integer success flag', () => {
		expect(readEnvelope({ success: 1 }).success).toBe(1);
		expect(readEnvelope({ success: 0 }).success).toBe(0);
		// The profile route's 401 has no error_code; both stay optional.
		expect(
			readEnvelope({ success: 0, message: 'x', data: [] }).errorCode,
		).toBeUndefined();
	});

	it('reads message and error_code only when well-typed', () => {
		const envelope = readEnvelope({ message: 42, error_code: 'x' });
		expect(envelope.message).toBeUndefined();
		expect(envelope.errorCode).toBeUndefined();
	});

	it('describes an error with the status and code in front', () => {
		expect(
			describeListcleanError(
				401,
				{ message: 'No auth token provided' },
				'fallback',
			),
		).toBe('Listclean 401: No auth token provided');
		expect(describeListcleanError(undefined, {}, 'fallback')).toBe('fallback');
	});
});
