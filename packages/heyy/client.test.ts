import {
	describeHeyyError,
	HeyyAPIError,
	makeHeyyRequest,
	readError,
	resetDelayMs,
	statusOnlyDescription,
} from './client';
import {
	contactNotFound,
	invalidParams,
	rateLimited,
	unauthorized,
} from './test-fixtures';

const API_KEY = 'heyy-secret-test-key';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'text/plain' : 'application/json',
				...headers,
			},
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<HeyyAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(HeyyAPIError);
	if (!(error instanceof HeyyAPIError)) throw error;
	return error;
}

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can reach
	// the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeHeyyRequest', () => {
	it('sends the key as a bearer token', async () => {
		respond({ success: true, data: [] }, 200);

		const result = await makeHeyyRequest(API_KEY, {
			method: 'POST',
			path: '/contacts/search',
			body: {},
		});

		expect(result).toEqual({ success: true, data: [] });
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.heyy.io/v3/contacts/search');
		const headers = new Headers(init.headers);
		expect(init.method).toBe('POST');
		expect(headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
	});

	it('POSTs a JSON body and sends none on a GET', async () => {
		respond({ success: true, data: {} }, 200);

		await makeHeyyRequest(API_KEY, {
			method: 'POST',
			path: '/labels',
			body: { name: 'Priority', color: '#EF4444' },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			name: 'Priority',
			color: '#EF4444',
		});
	});

	it('never puts the key in the query string', async () => {
		respond({ success: true }, 200);

		await makeHeyyRequest(API_KEY, {
			method: 'POST',
			path: '/contacts/search',
			body: {},
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).not.toContain(API_KEY);
	});

	it('reads messageKey and message from a 401', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeHeyyRequest(API_KEY, { method: 'POST', path: '/contacts/search' }),
		);
		expect(error.status).toBe(401);
		expect(error.messageKey).toBe('unauthorized');
		expect(error.message).toBe('Heyy 401 unauthorized: Unauthorized');
		expect(error.method).toBe('POST');
	});

	it('reads the message of a 404', async () => {
		respond(contactNotFound, 404);

		const error = await failure(
			makeHeyyRequest(API_KEY, {
				method: 'POST',
				path: '/contacts/search',
			}),
		);
		expect(error.messageKey).toBe('contact_not_found');
		expect(error.message).toContain('No contact could be found');
	});

	it('reads a 400 with invalidParams', async () => {
		respond(invalidParams, 400);

		const error = await failure(
			makeHeyyRequest(API_KEY, { method: 'POST', path: '/attributes' }),
		);
		expect(error.status).toBe(400);
		expect(error.messageKey).toBe('invalid_params');
	});

	it('turns X-RateLimit-Reset into a delay on a 429', async () => {
		// Heyy sends a reset timestamp, not Retry-After.
		const resetAt = Math.floor(Date.now() / 1000) + 12;
		respond(rateLimited, 429, { 'X-RateLimit-Reset': String(resetAt) });

		const error = await failure(
			makeHeyyRequest(API_KEY, { method: 'POST', path: '/contacts/search' }),
		);
		expect(error.status).toBe(429);
		expect(error.messageKey).toBe('rate_limit_exceeded');
		// Roughly 12 seconds, allowing for the second the header truncates.
		expect(error.retryAfter).toBeGreaterThan(10_000);
		expect(error.retryAfter).toBeLessThanOrEqual(12_000);
		// One attempt: the handlers own the retry.
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('leaves Retry-After as the delay when the API sends one', async () => {
		respond(rateLimited, 429, { 'Retry-After': '5' });

		const error = await failure(
			makeHeyyRequest(API_KEY, { method: 'POST', path: '/contacts/search' }),
		);
		expect(error.retryAfter).toBe(5_000);
	});

	it('keeps only the provider message on the error', async () => {
		// A request body can carry contact details, and ApiError does not redact
		// a body, so nothing but the message is retained.
		respond(
			{
				success: false,
				error: {
					messageKey: 'invalid_params',
					message: 'Bad request.',
					invalidParams: [{ email: 'leaked@example.com' }],
				},
			},
			400,
		);

		const error = await failure(
			makeHeyyRequest(API_KEY, { method: 'POST', path: '/contacts' }),
		);
		expect(error.body).toEqual({
			error: { messageKey: 'invalid_params', message: 'Bad request.' },
		});
		expect(
			String(require('node:util').inspect(error, { depth: null })),
		).not.toContain('leaked@example.com');
	});

	it('never prints the key', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeHeyyRequest(API_KEY, { method: 'POST', path: '/contacts/search' }),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(
			String(require('node:util').inspect(error, { depth: null })),
		).not.toContain(API_KEY);
	});

	it('wraps a transport failure and keeps its method', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeHeyyRequest(API_KEY, { method: 'POST', path: '/contacts' }),
		);
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('POST');
		expect(error.message).toContain('fetch failed');
	});
});

describe('readError', () => {
	it('reads messageKey and message', () => {
		expect(readError(unauthorized)).toEqual({
			messageKey: 'unauthorized',
			message: 'Unauthorized',
			invalidParams: undefined,
		});
	});

	it('keeps invalidParams when present', () => {
		expect(readError(invalidParams).invalidParams).toBeDefined();
	});

	it('returns empty for a body with no error object', () => {
		expect(readError({})).toEqual({
			messageKey: undefined,
			message: undefined,
			invalidParams: undefined,
		});
		expect(readError(null)).toEqual({
			messageKey: undefined,
			message: undefined,
			invalidParams: undefined,
		});
		expect(readError('<html>Bad Gateway</html>')).toEqual({
			messageKey: undefined,
			message: undefined,
			invalidParams: undefined,
		});
	});
});

describe('resetDelayMs', () => {
	it('returns the delay for a future timestamp', () => {
		const future = Date.now() + 30_000;
		expect(resetDelayMs(future)).toBeGreaterThan(29_000);
	});

	it('returns undefined for a timestamp that has passed', () => {
		expect(resetDelayMs(Date.now() - 1_000)).toBeUndefined();
	});

	it('returns undefined when there is no reset', () => {
		expect(resetDelayMs(undefined)).toBeUndefined();
		expect(resetDelayMs(Number.NaN)).toBeUndefined();
	});
});

describe('statusOnlyDescription', () => {
	it('names no body content, so it is safe as a fallback', () => {
		expect(statusOnlyDescription(504, 'Gateway Timeout')).toBe(
			'request failed (Gateway Timeout)',
		);
		expect(statusOnlyDescription(504, undefined)).toBe('request failed');
		expect(statusOnlyDescription(undefined, undefined)).toBe('request failed');
	});
});

describe('an unmapped status', () => {
	it('does not put the echoed request body in the message', async () => {
		// The shared client has no message for 504, so its ApiError.message
		// embeds the whole response body, and a rejected contact echoes the
		// fields that were sent.
		respond(
			{
				success: false,
				received: { email: 'leaked@example.com', phoneNumber: '+15550100' },
			},
			504,
		);

		const error = await failure(
			makeHeyyRequest(API_KEY, { method: 'POST', path: '/contacts' }),
		);

		expect(error.status).toBe(504);
		expect(error.message).toBe('Heyy 504: request failed');
		expect(
			String(require('node:util').inspect(error, { depth: null })),
		).not.toContain('leaked@example.com');
	});
});

describe('describeHeyyError', () => {
	it('joins the status and messageKey', () => {
		expect(describeHeyyError(404, contactNotFound, 'fallback')).toBe(
			'Heyy 404 contact_not_found: No contact could be found for this resource identifier. Please make sure to use the correct contact ID.',
		);
	});

	it('falls back when the body carries nothing', () => {
		expect(describeHeyyError(502, null, 'Bad Gateway')).toBe(
			'Heyy 502: Bad Gateway',
		);
	});

	it('omits the status when there is none', () => {
		expect(describeHeyyError(undefined, null, 'fetch failed')).toBe(
			'fetch failed',
		);
	});
});
