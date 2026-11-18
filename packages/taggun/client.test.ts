import { inspect } from 'node:util';
import {
	describeTaggunError,
	makeTaggunRequest,
	TaggunAPIError,
} from './client';
import {
	FEATURE_UNAVAILABLE,
	INVALID_KEY,
	MISSING_KEY,
	NOT_FOUND_ACK,
	RATE_LIMITED,
} from './test-fixtures';
import { captureError, respond, respondRaw, spyOnFetch } from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	fetchMock.mockRestore();
});

/**
 * Narrows a captured rejection. The assertion fails first, so a value of the
 * wrong type is reported as the throw it was rather than as a cast gone wrong.
 */
function asTaggunError(error: object): TaggunAPIError {
	expect(error).toBeInstanceOf(TaggunAPIError);
	return error as TaggunAPIError;
}

describe('auth placement', () => {
	it('sends the key in the apikey header and nowhere else', async () => {
		respond(fetchMock, { trackingId: 'T-1' });

		await makeTaggunRequest('secret-key', {
			method: 'POST',
			path: '/api/receipt/v1/simple/url',
			body: { url: 'https://example.com/r.png' },
		});

		const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		const headers = new Headers(init.headers);
		expect(new URL(url).origin).toBe('https://api.taggun.io');
		expect(headers.get('apikey')).toBe('secret-key');
		// Taggun does not accept a bearer token, and a query parameter would put
		// the key in every access log.
		expect(headers.get('authorization')).toBeNull();
		expect(new URL(url).search).toBe('');
	});

	it('sets a JSON content type only for a JSON body', async () => {
		respond(fetchMock, { trackingId: 'T-1' });
		await makeTaggunRequest('k', {
			method: 'POST',
			path: '/api/x',
			body: { a: 1 },
		});
		const jsonHeaders = new Headers(
			(fetchMock.mock.calls.at(-1) as [string, RequestInit])[1].headers,
		);
		expect(jsonHeaders.get('content-type')).toBe('application/json');

		respond(fetchMock, { trackingId: 'T-1' });
		await makeTaggunRequest('k', {
			method: 'POST',
			path: '/api/x',
			formData: { file: new Blob([new Uint8Array([1, 2])]) },
		});
		const formHeaders = new Headers(
			(fetchMock.mock.calls.at(-1) as [string, RequestInit])[1].headers,
		);
		// Fetch generates the boundary itself; a hand-set media type omits it.
		expect(formHeaders.get('content-type')).toBeNull();
	});
});

describe('error parsing', () => {
	it('reads the gateway message and status off a 401', async () => {
		respond(fetchMock, MISSING_KEY, 401);

		const error = asTaggunError(
			await captureError(
				makeTaggunRequest('k', { method: 'GET', path: '/api/x' }),
			),
		);

		expect(error.status).toBe(401);
		expect(error.message).toBe('Taggun 401: No API key found in request');
		expect(error.isAuthError).toBe(true);
		expect(error.method).toBe('GET');
	});

	it('reads the message off a 403 and keeps it distinct from a rate limit', async () => {
		respond(fetchMock, INVALID_KEY, 403);

		const error = asTaggunError(
			await captureError(
				makeTaggunRequest('k', { method: 'POST', path: '/api/x' }),
			),
		);

		expect(error.status).toBe(403);
		expect(error.isAuthError).toBe(true);
		expect(error.isRateLimit).toBe(false);
	});

	it('reads Retry-After into the error on a 429', async () => {
		respond(fetchMock, RATE_LIMITED, 429, { 'Retry-After': '7' });

		const error = asTaggunError(
			await captureError(
				makeTaggunRequest('k', { method: 'POST', path: '/api/x' }),
			),
		);

		expect(error.status).toBe(429);
		expect(error.isRateLimit).toBe(true);
		// The header is in seconds; the error carries milliseconds.
		expect(error.retryAfter).toBe(7000);
	});

	it('leaves retryAfter undefined when Taggun omits the header', async () => {
		// The docs say a 429 may omit Retry-After, so the fallback has to be able
		// to tell its absence from a zero.
		respond(fetchMock, RATE_LIMITED, 429);

		const error = asTaggunError(
			await captureError(
				makeTaggunRequest('k', { method: 'POST', path: '/api/x' }),
			),
		);

		expect(error.retryAfter).toBeUndefined();
	});

	it('recognises a 400 that names the Campaign Validation feature', async () => {
		respond(fetchMock, FEATURE_UNAVAILABLE, 400);

		const error = asTaggunError(
			await captureError(
				makeTaggunRequest('k', { method: 'GET', path: '/api/x' }),
			),
		);

		expect(error.isFeatureUnavailable).toBe(true);
		expect(error.isAuthError).toBe(false);
	});

	it('does not read an ordinary 400 as a feature limit', async () => {
		respond(
			fetchMock,
			{
				statusCode: 400,
				error: 'Bad Request',
				message: 'Invalid request payload input',
			},
			400,
		);

		const error = asTaggunError(
			await captureError(
				makeTaggunRequest('k', { method: 'POST', path: '/api/x' }),
			),
		);

		expect(error.isFeatureUnavailable).toBe(false);
	});

	it('raises a body that reports its own failure status', async () => {
		respond(fetchMock, NOT_FOUND_ACK, 200);

		const error = asTaggunError(
			await captureError(
				makeTaggunRequest('k', { method: 'DELETE', path: '/api/x' }),
			),
		);

		expect(error.status).toBe(404);
		expect(error.message).toContain('Campaign ID not found');
		expect(error.method).toBe('DELETE');
	});

	it('keeps a body that reports its own success status', async () => {
		respond(fetchMock, { result: 'Settings deleted', statusCode: 200 });

		await expect(
			makeTaggunRequest('k', { method: 'DELETE', path: '/api/x' }),
		).resolves.toMatchObject({ result: 'Settings deleted' });
	});

	it('flags a transport failure as one, so no status is invented', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = asTaggunError(
			await captureError(
				makeTaggunRequest('k', { method: 'GET', path: '/api/x' }),
			),
		);

		expect(error.status).toBeUndefined();
		expect(error.isTransportError).toBe(true);
		expect(error.method).toBe('GET');
	});

	it('treats an HTML body as a failure, not as an empty receipt', async () => {
		respondRaw(fetchMock, '<html>504 Gateway Time-out</html>', 504);

		const error = asTaggunError(
			await captureError(
				makeTaggunRequest('k', { method: 'POST', path: '/api/x' }),
			),
		);

		expect(error.status).toBe(504);
	});
});

describe('key hygiene', () => {
	it('keeps the request body out of the error, so a document cannot leak', async () => {
		respond(
			fetchMock,
			{ statusCode: 400, error: 'Bad Request', message: 'Invalid payload' },
			400,
		);

		const error = asTaggunError(
			await captureError(
				makeTaggunRequest('secret-key', {
					method: 'POST',
					path: '/api/x',
					body: { url: 'https://example.com', referenceId: 'ref-1' },
				}),
			),
		);

		// `cause` is non-enumerable, so stringifying proves nothing; inspect is
		// what a logger prints.
		expect(inspect(error)).not.toContain('secret-key');
		expect(inspect(error)).not.toContain('ref-1');
		expect(JSON.stringify(error)).not.toContain('secret-key');
		expect(error.message).not.toContain('secret-key');
	});

	it('attaches no cause, so nothing walks back to the request body', async () => {
		// `ApiError.request` keeps the original body after redaction. A cause
		// would hand an error reporter the base64 document or a signed source
		// URL, so the fields are copied instead.
		respond(
			fetchMock,
			{ statusCode: 400, error: 'Bad Request', message: 'Invalid payload' },
			400,
		);

		const error = asTaggunError(
			await captureError(
				makeTaggunRequest('secret-key', {
					method: 'POST',
					path: '/api/x',
					body: { image: 'BASE64-DOCUMENT-CONTENT' },
				}),
			),
		);

		expect(error.cause).toBeUndefined();
		// The status and method still travel, which is what handlers read.
		expect(error.status).toBe(400);
		expect(error.method).toBe('POST');
	});

	it('keeps a transport cause, which never carried a document', async () => {
		// A dropped connection never reached Taggun, so its error holds no body
		// and the cause is safe to keep for diagnosis.
		const failure = new TypeError('fetch failed');
		fetchMock.mockRejectedValueOnce(failure);

		const error = asTaggunError(
			await captureError(
				makeTaggunRequest('k', { method: 'GET', path: '/api/x' }),
			),
		);

		expect(error.cause).toBe(failure);
		expect(error.isTransportError).toBe(true);
	});
});

describe('describeTaggunError', () => {
	it.each([
		[MISSING_KEY, 'No API key found in request'],
		[NOT_FOUND_ACK, 'Campaign ID not found - coffee-june-2026'],
		[{ statusCode: 400 }, 'fallback text'],
		[null, 'fallback text'],
		['plain text', 'fallback text'],
	])('describes %p as %p', (body, expected) => {
		expect(describeTaggunError(400, body, 'fallback text')).toBe(
			`Taggun 400: ${expected}`,
		);
	});

	it('omits the status when none is available', () => {
		expect(describeTaggunError(undefined, MISSING_KEY, 'fallback')).toBe(
			'No API key found in request',
		);
	});
});
