import {
	describeOmnisendError,
	makeOmnisendRequest,
	OMNISEND_API_BASE,
	OMNISEND_API_VERSION,
	OmnisendAPIError,
	readProblem,
	retryAfterMs,
	statusOnlyDescription,
} from './client';
import {
	contact,
	rateLimited,
	unauthorized,
	validationFailed,
} from './test-fixtures';

const API_KEY = 'omnisend_test_key';

let fetchMock: jest.SpyInstance;

/** A response as Omnisend sends it: JSON under a standard content type. */
// unknown: response bodies are arbitrary JSON or text.
function respond(
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<OmnisendAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(OmnisendAPIError);
	if (!(error instanceof OmnisendAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeOmnisendRequest', () => {
	it('sends the key in the Omnisend-API-Key scheme', async () => {
		respond({ contacts: [] }, 200);

		await makeOmnisendRequest(API_KEY, {
			method: 'GET',
			path: '/api/contacts',
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(`${OMNISEND_API_BASE}/api/contacts`);
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(`Omnisend-API-Key ${API_KEY}`);
		// The legacy v3 header must never appear: it belongs to /v3/ only.
		expect(headers.get('x-api-key')).toBeNull();
		expect(headers.get('authorization')).not.toContain('Bearer');
	});

	it('sends the version header on every request', async () => {
		respond({ contacts: [] }, 200);

		await makeOmnisendRequest(API_KEY, {
			method: 'GET',
			path: '/api/contacts',
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('omnisend-version')).toBe(
			OMNISEND_API_VERSION,
		);
	});

	it('repeats array query values as separate parameters', async () => {
		respond({ campaigns: [] }, 200);

		await makeOmnisendRequest(API_KEY, {
			method: 'GET',
			path: '/api/campaigns',
			query: { status: ['draft', 'scheduled'], limit: 10 },
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toContain('status=draft&status=scheduled');
		expect(url).toContain('limit=10');
	});

	it('never puts the key in the query string', async () => {
		respond({ contacts: [] }, 200);

		await makeOmnisendRequest(API_KEY, {
			method: 'GET',
			path: '/api/contacts',
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).not.toContain(API_KEY);
	});

	it('reads title and detail of a 401 problem body', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeOmnisendRequest(API_KEY, { method: 'GET', path: '/api/contacts' }),
		);
		expect(error.status).toBe(401);
		expect(error.problemType).toBe(
			'https://problems.omnisend.com/unauthorized',
		);
		expect(error.message).toBe('Omnisend 401 (Unauthorized): Unauthorized');
		expect(error.method).toBe('GET');
	});

	it('carries the validation errors of a 400', async () => {
		respond(validationFailed, 400);

		const error = await failure(
			makeOmnisendRequest(API_KEY, {
				method: 'POST',
				path: '/api/contacts',
				body: contact,
			}),
		);
		expect(error.status).toBe(400);
		expect(error.errors).toEqual([
			{
				field: 'identifiers',
				code: 'required',
				message: 'Identifier is required.',
			},
		]);
		// The first validation error names the reason in the message itself.
		expect(error.message).toBe(
			'Omnisend 400 (Validation failed): Identifier is required.',
		);
	});

	it('reads the 429 delay from the problem body, not a header', async () => {
		// Omnisend documents `retryAfter` (seconds) in the body; a Retry-After
		// header is not part of the contract.
		respond(rateLimited, 429);

		const error = await failure(
			makeOmnisendRequest(API_KEY, { method: 'GET', path: '/api/contacts' }),
		);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(5_000);
		// One attempt: error-handlers.ts owns the retry.
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('falls back to a Retry-After header when the body has none', async () => {
		respond(
			{
				type: 'https://problems.omnisend.com/rate-limit-exceeded',
				status: 429,
			},
			429,
			{ 'Retry-After': '3' },
		);

		const error = await failure(
			makeOmnisendRequest(API_KEY, { method: 'GET', path: '/api/contacts' }),
		);
		expect(error.retryAfter).toBe(3_000);
	});

	it('never prints the key or the echoed request body', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeOmnisendRequest(API_KEY, {
				method: 'POST',
				path: '/api/contacts',
				body: { email: 'secret-person@example.com', firstName: 'Secret' },
			}),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(error.message).not.toContain('secret-person@example.com');
		const printed = String(
			require('node:util').inspect(error, { depth: null }),
		);
		expect(printed).not.toContain(API_KEY);
		expect(printed).not.toContain('secret-person@example.com');
	});

	it('wraps a transport failure and keeps its method', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeOmnisendRequest(API_KEY, {
				method: 'PATCH',
				path: '/api/contacts/x',
			}),
		);
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('PATCH');
		expect(error.message).toContain('fetch failed');
	});

	it('parses a problem body that arrives as text', async () => {
		// The gateway can answer a content type the shared client does not parse,
		// which hands the body back as a string.
		respond(JSON.stringify(unauthorized), 401, {
			'Content-Type': 'text/plain',
		});

		const error = await failure(
			makeOmnisendRequest(API_KEY, { method: 'GET', path: '/api/contacts' }),
		);
		expect(error.problemType).toBe(
			'https://problems.omnisend.com/unauthorized',
		);
	});
});

describe('readProblem', () => {
	it('reads a full problem body', () => {
		const problem = readProblem({
			type: 'https://problems.omnisend.com/validation-failed',
			title: 'Validation failed',
			detail: 'Two fields were invalid.',
			status: 400,
			instance: '/api/contacts',
			retryAfter: 7,
			errors: [{ field: 'a', code: 'b', message: 'c' }, 'junk'],
		});
		expect(problem.title).toBe('Validation failed');
		expect(problem.detail).toBe('Two fields were invalid.');
		expect(problem.retryAfterSeconds).toBe(7);
		expect(problem.errors).toEqual([{ field: 'a', code: 'b', message: 'c' }]);
	});

	it('returns nothing for junk', () => {
		expect(readProblem(null)).toEqual({});
		expect(readProblem('<html>Bad Gateway</html>')).toEqual({});
		expect(readProblem('{"broken":')).toEqual({});
	});
});

describe('describeOmnisendError', () => {
	it('prefers detail over title', () => {
		const described = describeOmnisendError(
			402,
			{
				title: 'Payment required',
				detail: 'Audience size exceeds your billing tier.',
			},
			'fallback',
		);
		expect(described.message).toBe(
			'Omnisend 402 (Payment required): Audience size exceeds your billing tier.',
		);
	});

	it('falls back when the body carries nothing', () => {
		expect(describeOmnisendError(502, null, 'Bad Gateway').message).toBe(
			'Omnisend 502: Bad Gateway',
		);
	});
});

describe('retryAfterMs', () => {
	it('converts the body seconds to milliseconds', () => {
		expect(retryAfterMs({ retryAfterSeconds: 12 }, 999)).toBe(12_000);
	});

	it('uses the header when the body has none', () => {
		expect(retryAfterMs({}, 999)).toBe(999);
		expect(retryAfterMs({}, undefined)).toBeUndefined();
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
