import {
	describeFollowUpBossError,
	FollowUpBossAPIError,
	makeFollowUpBossRequest,
	segment,
} from './client';

const API_KEY = 'fub-secret-test-key';
// Buffer.from(`${API_KEY}:`).toString('base64') — Basic auth with an empty
// password per the FUB Authentication guide.
const EXPECTED_BASIC = 'ZnViLXNlY3JldC10ZXN0LWtleTo=';

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

function respondEmpty(status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(
	promise: Promise<unknown>,
): Promise<FollowUpBossAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(FollowUpBossAPIError);
	if (!(error instanceof FollowUpBossAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeFollowUpBossRequest', () => {
	it('authenticates with Basic auth and no Bearer header', async () => {
		respond({ people: [] }, 200);

		const result = await makeFollowUpBossRequest(API_KEY, {
			method: 'GET',
			path: '/people',
			query: { offset: 0, limit: 10, sort: undefined },
		});

		expect(result).toEqual({ people: [] });
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(
			'https://api.followupboss.com/v1/people?offset=0&limit=10',
		);
		const headers = new Headers(init.headers);
		expect(init.method).toBe('GET');
		expect(headers.get('authorization')).toBe(`Basic ${EXPECTED_BASIC}`);
		expect(headers.get('authorization')).not.toContain('Bearer');
		expect(headers.get('x-system')).toBe('corsair');
		expect(headers.get('x-system-key')).toBeNull();
		expect(headers.get('content-type')).toBeNull();
	});

	it('sends the X-System identity headers when the caller registered', async () => {
		respondEmpty(204);

		await makeFollowUpBossRequest(
			API_KEY,
			{ method: 'DELETE', path: '/appointments/42' },
			{ systemName: 'MyIntegration', systemKey: 'sys-key-123' },
		);

		const headers = new Headers(
			(fetchMock.mock.calls[0] as [string, RequestInit])[1].headers,
		);
		expect(headers.get('x-system')).toBe('MyIntegration');
		expect(headers.get('x-system-key')).toBe('sys-key-123');
	});

	it('POSTs a JSON body with a JSON content type', async () => {
		respond({ id: 1 }, 201);

		await makeFollowUpBossRequest(API_KEY, {
			method: 'POST',
			path: '/people',
			body: { firstName: 'Wile', lastName: 'Fox' },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.method).toBe('POST');
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			firstName: 'Wile',
			lastName: 'Fox',
		});
	});

	it('forwards a JSON body on DELETE too', async () => {
		respondEmpty(204);

		await makeFollowUpBossRequest(API_KEY, {
			method: 'DELETE',
			path: '/reactions',
			body: { ids: [7, 8] },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.method).toBe('DELETE');
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({ ids: [7, 8] });
	});

	it('sends no body or content type on a bodyless POST', async () => {
		respondEmpty(204);

		await expect(
			makeFollowUpBossRequest(API_KEY, {
				method: 'POST',
				path: '/people/ignoreUnclaimed',
			}),
		).resolves.toBeUndefined();

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.body).toBeUndefined();
		expect(new Headers(init.headers).get('content-type')).toBeNull();
	});

	it('resolves a 204 as undefined', async () => {
		respondEmpty(204);

		await expect(
			makeFollowUpBossRequest(API_KEY, {
				method: 'GET',
				path: '/people/1',
			}),
		).resolves.toBeUndefined();
	});

	it('treats a 429 as a rate limit and converts Retry-After seconds to ms', async () => {
		respond({ errorMessage: 'Rate limit exceeded' }, 429, {
			'Retry-After': '8',
		});

		const error = await failure(
			makeFollowUpBossRequest(API_KEY, {
				method: 'GET',
				path: '/people',
			}),
		);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(8000);
		expect(error.message).toBe('Follow Up Boss 429: Rate limit exceeded');
		// The client makes one attempt; error-handlers.ts owns retries.
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('reads the errorMessage of a 4xx error body', async () => {
		respond({ errorMessage: 'Invalid json' }, 400);

		const error = await failure(
			makeFollowUpBossRequest(API_KEY, {
				method: 'POST',
				path: '/people',
				body: {},
			}),
		);
		expect(error.status).toBe(400);
		expect(error.method).toBe('POST');
		expect(error.message).toContain('Follow Up Boss 400: Invalid json');
	});

	it('still throws a FollowUpBossAPIError on a non-JSON error body', async () => {
		respond('<html>Gateway error</html>', 502);

		const error = await failure(
			makeFollowUpBossRequest(API_KEY, {
				method: 'GET',
				path: '/people',
			}),
		);
		expect(error).toBeInstanceOf(FollowUpBossAPIError);
		expect(error.status).toBe(502);
		expect(error.message).toBe('Follow Up Boss 502: Bad Gateway');
	});

	it('wraps network failures', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeFollowUpBossRequest(API_KEY, {
				method: 'GET',
				path: '/people',
			}),
		);
		expect(error.message).toContain('fetch failed');
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('GET');
		expect(error.cause).toBeInstanceOf(TypeError);
	});

	it('wraps a fetch timeout', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out', 'TimeoutError'),
		);

		const error = await failure(
			makeFollowUpBossRequest(API_KEY, {
				method: 'POST',
				path: '/people',
				body: {},
			}),
		);
		expect(error.message).toContain('timed out');
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('POST');
	});

	it('leaves the API key out of errors', async () => {
		respond({ errorMessage: 'Invalid API key' }, 401);

		const error = await failure(
			makeFollowUpBossRequest(API_KEY, {
				method: 'GET',
				path: '/people',
			}),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(JSON.stringify(error.cause)).not.toContain(API_KEY);
	});
});

describe('describeFollowUpBossError', () => {
	it('reads the errorMessage key', () => {
		expect(describeFollowUpBossError(500, { errorMessage: 'boom' }, 'x')).toBe(
			'Follow Up Boss 500: boom',
		);
	});

	it('falls back when the body has no error text', () => {
		expect(
			describeFollowUpBossError(503, '<html>down</html>', 'Unavailable'),
		).toBe('Follow Up Boss 503: Unavailable');
		expect(describeFollowUpBossError(undefined, undefined, 'timeout')).toBe(
			'timeout',
		);
	});
});

describe('segment', () => {
	it('encodes a value for one path segment', () => {
		expect(segment('a/b?c')).toBe('a%2Fb%3Fc');
		expect(segment(12)).toBe('12');
	});
});
