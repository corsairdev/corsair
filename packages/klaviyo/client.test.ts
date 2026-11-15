import {
	describeKlaviyoError,
	KLAVIYO_API_BASE,
	KLAVIYO_REVISION,
	KlaviyoAPIError,
	makeKlaviyoRequest,
	readErrors,
	statusOnlyDescription,
} from './client';
import {
	authenticationFailed,
	invalidField,
	multipleErrors,
	rateLimited,
} from './test-fixtures';

const API_KEY = 'pk_secret_test_key';

let fetchMock: jest.SpyInstance;

/**
 * A response as Klaviyo really sends it.
 *
 * The body is a JSON string, and the content type is `application/vnd.api+json`.
 * `corsair/http` only parses `application/json` and
 * `application/problem+json`, so the shared client hands this back as text:
 * which is what the client has to cope with.
 */
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
				'Content-Type': 'application/vnd.api+json',
				...headers,
			},
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<KlaviyoAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(KlaviyoAPIError);
	if (!(error instanceof KlaviyoAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeKlaviyoRequest', () => {
	it('sends the private key in its own Authorization scheme', async () => {
		respond({ data: [] }, 200);

		await makeKlaviyoRequest(API_KEY, { method: 'GET', path: '/api/profiles' });

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(`${KLAVIYO_API_BASE}/api/profiles`);
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(`Klaviyo-API-Key ${API_KEY}`);
		// Not a bearer token: Klaviyo uses its own scheme.
		expect(headers.get('authorization')).not.toContain('Bearer');
	});

	it('sends the revision header on every request', async () => {
		// Klaviyo versions by date, and a request without this header is rejected.
		respond({ data: [] }, 200);

		await makeKlaviyoRequest(API_KEY, { method: 'GET', path: '/api/lists' });

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('revision')).toBe(KLAVIYO_REVISION);
	});

	it('asks for and sends the JSON:API media type', async () => {
		respond({ data: {} }, 201);

		await makeKlaviyoRequest(API_KEY, {
			method: 'POST',
			path: '/api/profiles',
			body: { data: { type: 'profile', attributes: { email: 'a@b.co' } } },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const headers = new Headers(init.headers);
		expect(headers.get('content-type')).toBe('application/vnd.api+json');
		expect(headers.get('accept')).toBe('application/vnd.api+json');
	});

	it('percent-encodes bracket query keys', async () => {
		respond({ data: [] }, 200);

		await makeKlaviyoRequest(API_KEY, {
			method: 'GET',
			path: '/api/profiles',
			query: { 'page[cursor]': 'abc', 'page[size]': 20 },
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toContain('page%5Bcursor%5D=abc');
		expect(url).toContain('page%5Bsize%5D=20');
	});

	it('never puts the key in the query string', async () => {
		respond({ data: [] }, 200);

		await makeKlaviyoRequest(API_KEY, { method: 'GET', path: '/api/profiles' });

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).not.toContain(API_KEY);
	});

	it('reads the code and detail of a 401', async () => {
		respond(authenticationFailed, 401);

		const error = await failure(
			makeKlaviyoRequest(API_KEY, { method: 'GET', path: '/api/profiles' }),
		);
		expect(error.status).toBe(401);
		expect(error.code).toBe('authentication_failed');
		expect(error.message).toBe(
			'Klaviyo 401 authentication_failed: Incorrect authentication credentials.',
		);
		expect(error.method).toBe('GET');
	});

	it('keeps every error entry, not just the first', async () => {
		respond(multipleErrors, 400);

		const error = await failure(
			makeKlaviyoRequest(API_KEY, { method: 'POST', path: '/api/profiles' }),
		);
		expect(error.errors).toHaveLength(2);
		expect(error.errors?.[1]?.detail).toBe('Two.');
		// The message still names the first.
		expect(error.message).toContain('One.');
	});

	it('treats a 429 as a rate limit and reads Retry-After', async () => {
		respond(rateLimited, 429, { 'Retry-After': '12' });

		const error = await failure(
			makeKlaviyoRequest(API_KEY, { method: 'GET', path: '/api/profiles' }),
		);
		expect(error.status).toBe(429);
		expect(error.code).toBe('rate_limit_exceeded');
		expect(error.retryAfter).toBe(12_000);
		// One attempt: the handlers own the retry.
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('keeps only the provider errors on the error, never the request body', async () => {
		respond(
			{
				errors: [
					{
						status: 400,
						code: 'invalid',
						title: 'Invalid input.',
						detail: 'Bad email.',
						source: { pointer: '/data/attributes/email' },
					},
				],
			},
			400,
		);

		const error = await failure(
			makeKlaviyoRequest(API_KEY, { method: 'POST', path: '/api/profiles' }),
		);
		expect(error.body).toEqual({
			errors: [
				{ code: 'invalid', title: 'Invalid input.', detail: 'Bad email.' },
			],
		});
	});

	it('never prints the key', async () => {
		respond(authenticationFailed, 401);

		const error = await failure(
			makeKlaviyoRequest(API_KEY, { method: 'GET', path: '/api/profiles' }),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(
			String(require('node:util').inspect(error, { depth: null })),
		).not.toContain(API_KEY);
	});

	it('wraps a transport failure and keeps its method', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeKlaviyoRequest(API_KEY, { method: 'PATCH', path: '/api/profiles/x' }),
		);
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('PATCH');
		expect(error.message).toContain('fetch failed');
	});
});

describe('readErrors', () => {
	it('reads a single error', () => {
		const [first] = readErrors(invalidField);
		expect(first?.code).toBe('invalid');
		expect(first?.source?.pointer).toBe('/data/attributes/email');
	});

	it('parses a body that is still a JSON string', () => {
		// This is what the shared client hands back for Klaviyo: it only parses
		// application/json and application/problem+json, and Klaviyo answers
		// application/vnd.api+json, so the body arrives as raw text.
		const [first] = readErrors(JSON.stringify(authenticationFailed));
		expect(first?.code).toBe('authentication_failed');
		expect(first?.detail).toBe('Incorrect authentication credentials.');
	});

	it('reads several errors in order', () => {
		expect(readErrors(multipleErrors).map((e) => e.detail)).toEqual([
			'One.',
			'Two.',
		]);
	});

	it('returns nothing for a body with no errors array', () => {
		expect(readErrors({})).toEqual([]);
		expect(readErrors(null)).toEqual([]);
		expect(readErrors('<html>Bad Gateway</html>')).toEqual([]);
		expect(readErrors({ errors: 'nope' })).toEqual([]);
		// Malformed JSON must not throw.
		expect(readErrors('{"errors": [')).toEqual([]);
	});
});

describe('describeKlaviyoError', () => {
	it('joins the status and code', () => {
		expect(describeKlaviyoError(400, invalidField, 'fallback')).toBe(
			'Klaviyo 400 invalid: email is not a valid email address.',
		);
	});

	it('falls back when the body carries nothing', () => {
		expect(describeKlaviyoError(502, null, 'Bad Gateway')).toBe(
			'Klaviyo 502: Bad Gateway',
		);
	});
});

describe('statusOnlyDescription', () => {
	it('names no body content', () => {
		expect(statusOnlyDescription(504, 'Gateway Timeout')).toBe(
			'request failed (Gateway Timeout)',
		);
		expect(statusOnlyDescription(undefined, undefined)).toBe('request failed');
	});
});

describe('an unmapped status', () => {
	it('does not put the echoed body in the message', async () => {
		respond({ echoed: { email: 'leaked@example.com' } }, 504);

		const error = await failure(
			makeKlaviyoRequest(API_KEY, { method: 'POST', path: '/api/profiles' }),
		);

		expect(error.status).toBe(504);
		expect(error.message).toBe('Klaviyo 504: request failed');
		expect(
			String(require('node:util').inspect(error, { depth: null })),
		).not.toContain('leaked@example.com');
	});
});
