import { ApiError } from 'corsair/http';
import {
	describeListcleanError,
	envelopeData,
	envelopeMessage,
	LISTCLEAN_API_BASE,
	makeListcleanRequest,
	readEnvelope,
	requestFactsOf,
	withoutAddresses,
} from './client';
import { RESULT_ROWS } from './test-fixtures';
import {
	captureError,
	currentFetch,
	downloadResponse,
	fail,
	htmlResponse,
	installFetchMock,
	jsonResponse,
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

		expect(error).toBeInstanceOf(ApiError);
		// request() surfaces only the body here, so the status is the 200 the
		// failure came over.
		expect(error).toMatchObject({
			status: 200,
			message: expect.stringContaining('Invalid token or token expired'),
		});
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

		expect(error).toBeInstanceOf(ApiError);
		const apiError = error as ApiError;
		expect(apiError.status).toBe(401);
		expect(apiError.body).toMatchObject({ error_code: 401 });
		expect(apiError.message).toBe(
			'Listclean 401 401: Invalid token or token expired',
		);
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
		// gets a thrown ApiError, never an empty result.
		expect(error).toBeInstanceOf(ApiError);
		const apiError = error as ApiError;
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

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).message).toContain('not the JSON envelope');
	});

	it('lets core retry a 429 three times and keeps its retry-after value', async () => {
		jest.useFakeTimers();
		try {
			for (let attempt = 0; attempt < 4; attempt++) {
				mockFetch(
					new Response(JSON.stringify({ success: 0, message: 'Slow' }), {
						status: 429,
						headers: {
							'Content-Type': 'application/json',
							'Retry-After': '3',
						},
					}),
				);
			}

			const pending = captureError(
				makeListcleanRequest('lc-key', {
					method: 'GET',
					path: '/credits',
					replayable: true,
				}),
			);
			await jest.advanceTimersByTimeAsync(30_000);
			const error = await pending;

			expect(error).toBeInstanceOf(ApiError);
			expect(error).toMatchObject({ status: 429, retryAfter: 3000 });
			expect(currentFetch()).toHaveBeenCalledTimes(4);
		} finally {
			jest.useRealTimers();
		}
	});

	it('passes a dropped connection through with its replay facts beside it', async () => {
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

		expect(error).toBeInstanceOf(TypeError);
		expect(requestFactsOf(error)).toEqual({
			method: 'POST',
			replayable: false,
			transport: true,
		});
	});

	it('parses the download route JSON stream and fails loudly on HTML', async () => {
		mockFetch(downloadResponse(RESULT_ROWS));

		const raw = await makeListcleanRequest('lc-key', {
			method: 'GET',
			path: '/downloads/json/159261/clean',
			replayable: true,
			response: 'json',
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
				response: 'json',
			}),
		);
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).message).toContain('not JSON');
	});

	it('strips addresses and profile data from the error it throws', async () => {
		mockFetch(
			jsonResponse(
				{
					success: 0,
					error_code: 0,
					message: 'Could not verify alice@example.com',
					data: { email: 'alice@example.com', name: 'Alice Smith' },
				},
				{ status: 500 },
			),
		);

		const error = await captureError(
			makeListcleanRequest('lc-key', {
				method: 'GET',
				path: '/verify/email/alice%40example.com',
				query: { email: 'alice@example.com' },
				replayable: false,
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		const apiError = error as ApiError;
		expect(apiError.status).toBe(500);
		const dumped = JSON.stringify({
			message: apiError.message,
			url: apiError.url,
			body: apiError.body,
			request: apiError.request,
		});
		expect(dumped).not.toContain('alice');
		expect(dumped).not.toContain('Alice');
		expect(dumped).not.toContain('lc-key');
		expect(apiError.url).toBe(`${LISTCLEAN_API_BASE}/verify/email/[REDACTED]`);
		expect(apiError.message).toBe('Listclean 500 0: Could not verify [email]');
	});

	it('drops the request body (a batch of addresses) from the error', async () => {
		mockFetch(jsonResponse({ success: 0, message: 'nope' }, { status: 400 }));

		const error = await captureError(
			makeListcleanRequest('lc-key', {
				method: 'POST',
				path: '/verify/email/batch',
				body: { emails: ['bob@example.com'] },
				replayable: false,
			}),
		);

		const apiError = error as ApiError;
		expect(apiError.status).toBe(400);
		expect(apiError.request.body).toBeUndefined();
		expect(apiError.url).toBe(`${LISTCLEAN_API_BASE}/verify/email/batch`);
		expect(JSON.stringify(apiError)).not.toContain('bob@');
	});

	it('reads the CSV download as text and fails on an envelope or HTML', async () => {
		mockFetch(
			new Response('email,status\nuser@example.com,clean\n', {
				status: 200,
				headers: { 'Content-Type': 'application/octet-stream' },
			}),
		);
		const csv = await makeListcleanRequest('lc-key', {
			method: 'GET',
			path: '/downloads/1/clean',
			response: 'text',
			replayable: true,
		});
		expect(csv).toBe('email,status\nuser@example.com,clean\n');

		mockFetch(fail('List not found'));
		const notFound = await captureError(
			makeListcleanRequest('lc-key', {
				method: 'GET',
				path: '/downloads/9/clean',
				response: 'text',
				replayable: true,
			}),
		);
		expect(notFound).toMatchObject({
			status: 200,
			message: expect.stringContaining('List not found'),
		});

		mockFetch(htmlResponse(200));
		const html = await captureError(
			makeListcleanRequest('lc-key', {
				method: 'GET',
				path: '/downloads/9/clean',
				response: 'text',
				replayable: true,
			}),
		);
		expect((html as ApiError).message).toContain('not CSV');
	});

	it('masks anything shaped like an address in a message', () => {
		expect(withoutAddresses('bad <a.b+c@x.co> and d@e.org')).toBe(
			'bad <[email]> and [email]',
		);
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
		expect(describeListcleanError(undefined, {}, 'fallback')).toBe(
			'Listclean: fallback',
		);
	});
});
