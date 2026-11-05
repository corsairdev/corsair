import {
	describeTicketmasterError,
	makeTicketmasterRequest,
	segment,
	TicketmasterAPIError,
} from './client';
import {
	invalidApiKey,
	invalidParameter,
	missingApiKey,
	quotaExceeded,
	searchNotFound,
} from './test-fixtures';

const API_KEY = 'tm-secret-test-key';

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
async function failure(
	promise: Promise<unknown>,
): Promise<TicketmasterAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(TicketmasterAPIError);
	if (!(error instanceof TicketmasterAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeTicketmasterRequest', () => {
	it('sends the key in the apikey query parameter and no auth header', async () => {
		respond({ ok: true }, 200);

		const result = await makeTicketmasterRequest(API_KEY, {
			path: '/events.json',
			query: { keyword: 'devjam', countryCode: 'US' },
		});

		expect(result).toEqual({ ok: true });
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(
			'https://app.ticketmaster.com/discovery/v2/events.json?keyword=devjam&countryCode=US&apikey=tm-secret-test-key',
		);
		expect(init.method).toBe('GET');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBeNull();
		expect(headers.get('accept')).toBe('application/json');
	});

	it('sends an array filter as repeated parameters', async () => {
		respond({ ok: true }, 200);

		await makeTicketmasterRequest(API_KEY, {
			path: '/events.json',
			query: { city: ['Seattle', 'Portland'] },
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		const parsed = new URL(url);
		expect(parsed.searchParams.getAll('city')).toEqual(['Seattle', 'Portland']);
	});

	it('drops an undefined filter instead of sending it empty', async () => {
		respond({ ok: true }, 200);

		await makeTicketmasterRequest(API_KEY, {
			path: '/events.json',
			query: { keyword: undefined, page: 0 },
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toContain('page=0');
		expect(url).not.toContain('keyword');
	});

	it('does not retry a 429 itself; the error handlers do', async () => {
		respond(quotaExceeded, 429, { 'Retry-After': '2' });

		const error = await failure(
			makeTicketmasterRequest(API_KEY, { path: '/events.json' }),
		);
		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBe(2000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('reads the gateway fault of a rejected key', async () => {
		respond(invalidApiKey, 401);

		const error = await failure(
			makeTicketmasterRequest(API_KEY, { path: '/events.json' }),
		);
		expect(error.status).toBe(401);
		expect(error.code).toBe('oauth.v2.InvalidApiKey');
		expect(error.isAuthError).toBe(true);
		expect(error.message).toBe(
			'Ticketmaster 401 oauth.v2.InvalidApiKey: Invalid ApiKey',
		);
	});

	it('treats a missing key as an auth error too', async () => {
		respond(missingApiKey, 401);

		const error = await failure(
			makeTicketmasterRequest('', { path: '/events.json' }),
		);
		expect(error.status).toBe(401);
		expect(error.isAuthError).toBe(true);
		expect(error.code).toBe('steps.oauth.v2.FailedToResolveAPIKey');
	});

	it('reads the code and detail of a rejected parameter', async () => {
		respond(invalidParameter, 400);

		const error = await failure(
			makeTicketmasterRequest(API_KEY, {
				path: '/events.json',
				query: { size: 500 },
			}),
		);
		expect(error.status).toBe(400);
		expect(error.code).toBe('DIS1001');
		expect(error.message).toBe(
			'Ticketmaster 400 DIS1001: Invalid value for parameter [size]=500',
		);
	});

	it('reads an unknown ID as the documented 404', async () => {
		respond(searchNotFound, 404);

		const error = await failure(
			makeTicketmasterRequest(API_KEY, { path: '/events/abcde.json' }),
		);
		expect(error.status).toBe(404);
		expect(error.code).toBe('DIS1004');
		expect(error.message).toBe(
			'Ticketmaster 404 DIS1004: Resource not found with provided criteria (keyword=zzzznotarealevent)',
		);
	});

	it('does not treat a 429 as a not-found', async () => {
		respond(quotaExceeded, 429);

		const error = await failure(
			makeTicketmasterRequest(API_KEY, { path: '/events.json' }),
		);
		expect(error.isRateLimit).toBe(true);
	});

	it('wraps network failures', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeTicketmasterRequest(API_KEY, { path: '/events.json' }),
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
			makeTicketmasterRequest(API_KEY, { path: '/events.json' }),
		);
		expect(error.message).toContain('timed out');
		expect(error.status).toBeUndefined();
	});

	it('leaves the API key out of errors', async () => {
		respond(invalidApiKey, 401);

		const error = await failure(
			makeTicketmasterRequest(API_KEY, { path: '/events.json' }),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(JSON.stringify(error.cause)).not.toContain(API_KEY);
	});

	it('redacts a key the provider echoes in its error message', async () => {
		// The real 429 body names the key: "Identifier : <apikey>".
		respond(
			{
				fault: {
					faultstring: `Rate limit quota violation. Quota limit exceeded. Identifier : ${API_KEY}`,
					detail: { errorcode: 'policies.ratelimit.QuotaViolation' },
				},
			},
			429,
		);

		const error = await failure(
			makeTicketmasterRequest(API_KEY, { path: '/events.json' }),
		);
		expect(error.message).toContain('Rate limit quota violation');
		expect(error.message).not.toContain(API_KEY);
		expect(error.message).toContain('[REDACTED]');
		expect(JSON.stringify(error.body)).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
	});

	it('redacts the key from nested body strings and keeps the shape', async () => {
		respond(
			{
				fault: {
					faultstring: 'Rejected',
					detail: { errorcode: 'x', notes: [`key=${API_KEY}`, 'other'] },
				},
			},
			401,
		);

		const error = await failure(
			makeTicketmasterRequest(API_KEY, { path: '/events.json' }),
		);
		const body = error.body as {
			fault: { detail: { errorcode: string; notes: string[] } };
		};
		expect(body.fault.detail.errorcode).toBe('x');
		expect(body.fault.detail.notes).toEqual(['key=[REDACTED]', 'other']);
	});

	it('redacts the percent-encoded form of a key in a recorded URL', async () => {
		// A key with characters that encode differently would only be matched by
		// its encoded form, which is what the query string actually carries.
		const awkwardKey = 'a+b/c=d';
		respond(invalidApiKey, 401);

		const error = await failure(
			makeTicketmasterRequest(awkwardKey, { path: '/events.json' }),
		);
		const cause = error.cause as { url?: string; request?: { url?: string } };
		expect(cause.url).not.toContain(awkwardKey);
		expect(cause.url).not.toContain(encodeURIComponent(awkwardKey));
		expect(cause.request?.url).not.toContain(awkwardKey);
	});

	it('redacts the key from the recorded request URL', async () => {
		respond(invalidApiKey, 401);

		const error = await failure(
			makeTicketmasterRequest(API_KEY, { path: '/events.json' }),
		);
		const cause = error.cause as {
			url?: string;
			request?: { query?: unknown };
		};
		expect(cause.url).toBe(
			'https://app.ticketmaster.com/discovery/v2/events.json?apikey=[REDACTED]',
		);
		expect(JSON.stringify(cause.request)).not.toContain(API_KEY);
	});
});

describe('describeTicketmasterError', () => {
	it('reads the fault shape', () => {
		expect(describeTicketmasterError(401, invalidApiKey, 'x')).toBe(
			'Ticketmaster 401 oauth.v2.InvalidApiKey: Invalid ApiKey',
		);
	});

	it('reads the errors array shape', () => {
		expect(describeTicketmasterError(404, searchNotFound, 'x')).toBe(
			'Ticketmaster 404 DIS1004: Resource not found with provided criteria (keyword=zzzznotarealevent)',
		);
	});
	it('falls back when the body has no error text', () => {
		expect(
			describeTicketmasterError(503, '<html>down</html>', 'Unavailable'),
		).toBe('Ticketmaster 503: Unavailable');
		expect(describeTicketmasterError(undefined, undefined, 'timeout')).toBe(
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
