import {
	describeEventzillaError,
	EventzillaAPIError,
	EventzillaTransportError,
	makeEventzillaRequest,
	segment,
} from './client';
import {
	categoriesKeyRejectedBody,
	keyRejectedBody,
	unknownRouteBody,
} from './test-fixtures';

const API_KEY = 'ez-secret-test-key';

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON or text until the client reads it.
function respond(
	// unknown: same reason as above; the caller picks the body.

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
async function failure(promise: Promise<unknown>): Promise<EventzillaAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(EventzillaAPIError);
	if (!(error instanceof EventzillaAPIError)) throw error;
	return error;
}

// unknown: the same rejection path, for the transport error class.
async function transportFailure(
	// unknown: a rejection can be any value until the instanceof check narrows it.
	promise: Promise<unknown>,
): Promise<EventzillaTransportError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(EventzillaTransportError);
	if (!(error instanceof EventzillaTransportError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
	jest.restoreAllMocks();
});

describe('makeEventzillaRequest', () => {
	it('sends the key in x-api-key and nowhere else', async () => {
		respond({ events: [] }, 200);

		await makeEventzillaRequest(API_KEY, { method: 'GET', path: '/events' });

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const headers = new Headers(init.headers);
		expect(headers.get('x-api-key')).toBe(API_KEY);
		expect(headers.get('authorization')).toBeNull();
		expect(url).not.toContain(API_KEY);
		expect(String(init.body ?? '')).not.toContain(API_KEY);
	});

	it('calls the documented host and path', async () => {
		respond({ categories: [] }, 200);

		await makeEventzillaRequest(API_KEY, {
			method: 'GET',
			path: '/categories',
		});

		const [url] = fetchMock.mock.calls[0] as [string];
		const parsed = new URL(url);
		expect(parsed.origin).toBe('https://www.eventzillaapi.net');
		expect(parsed.pathname).toBe('/api/v2/categories');
	});

	it('sends query parameters only on a GET', async () => {
		respond({ events: [] }, 200);
		await makeEventzillaRequest(API_KEY, {
			method: 'GET',
			path: '/events',
			query: { status: 'Live', offset: 0, limit: 20 },
		});
		const [getUrl] = fetchMock.mock.calls[0] as [string];
		const getSearch = new URL(getUrl).searchParams;
		expect(getSearch.get('status')).toBe('Live');
		expect(getSearch.get('offset')).toBe('0');

		respond({ orderconfirm: 'success' }, 200);
		await makeEventzillaRequest(API_KEY, {
			method: 'POST',
			path: '/events/order/confirm',
			query: { ignored: 'yes' },
			body: { checkout_id: 1 },
		});
		const [postUrl] = fetchMock.mock.calls[1] as [string];
		expect(new URL(postUrl).searchParams.toString()).toBe('');
	});

	it('drops undefined query values rather than sending "undefined"', async () => {
		respond({ events: [] }, 200);

		await makeEventzillaRequest(API_KEY, {
			method: 'GET',
			path: '/events',
			query: { status: undefined, limit: 5 },
		});

		const [url] = fetchMock.mock.calls[0] as [string];
		const search = new URL(url).searchParams;
		expect(search.has('status')).toBe(false);
		expect(search.get('limit')).toBe('5');
	});

	it('sends a JSON body with the media type set', async () => {
		respond({ eventstatus: 'published' }, 200);

		await makeEventzillaRequest(API_KEY, {
			method: 'POST',
			path: '/events/togglesales',
			body: { eventid: 1, status: true },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(JSON.parse(String(init.body))).toEqual({
			eventid: 1,
			status: true,
		});
		expect(new Headers(init.headers).get('content-type')).toContain(
			'application/json',
		);
	});

	it('returns the parsed body', async () => {
		respond({ categories: [{ category: 'Business' }] }, 200);

		const body = await makeEventzillaRequest(API_KEY, {
			method: 'GET',
			path: '/categories',
		});

		expect(body).toEqual({ categories: [{ category: 'Business' }] });
	});

	it('turns a 401 into an unauthorized error, dropping the body', async () => {
		respond(keyRejectedBody, 401);

		const error = await failure(
			makeEventzillaRequest(API_KEY, { method: 'GET', path: '/events' }),
		);

		expect(error.status).toBe(401);
		expect(error.kind).toBe('unauthorized');
		expect(error.method).toBe('GET');
		expect(error.message).toContain('API Key is not authorized');
		// The body is not kept: a caller printing the error must not print it.
		expect(JSON.stringify(error)).not.toContain('Northstar');
		expect(error).not.toHaveProperty('body');
	});

	it('calls a 403 "Missing Authentication Token" an invalid route', async () => {
		respond(unknownRouteBody, 403);

		const error = await failure(
			makeEventzillaRequest(API_KEY, {
				method: 'POST',
				path: '/attendee/checkin',
			}),
		);

		expect(error.kind).toBe('invalid_route');
		expect(error.status).toBe(403);
		expect(error.message).toContain('no such route');
	});

	it('calls a 403 with an application body a permission error', async () => {
		respond(
			{ status: 403, error_code: 'forbidden', message: 'Not your event.' },
			403,
		);

		const error = await failure(
			makeEventzillaRequest(API_KEY, { method: 'GET', path: '/events/1' }),
		);

		expect(error.kind).toBe('unauthorized');
		expect(error.code).toBe('forbidden');
	});

	it('reads the provider error_code when one is present', async () => {
		respond(
			{ status: 404, error_code: 'event_not_found', message: 'No such event.' },
			404,
		);

		const error = await failure(
			makeEventzillaRequest(API_KEY, { method: 'GET', path: '/events/9' }),
		);

		expect(error.code).toBe('event_not_found');
		expect(error.kind).toBe('not_found');
		expect(error.message).toContain('Eventzilla 404 event_not_found');
	});

	/**
	 * The one that matters: `GET /categories` answers a refused key with 200 and
	 * an error body. Without this a keyless caller gets a zod parse failure on a
	 * "successful" response, which names the wrong problem entirely.
	 */
	it('turns a 200 with an authorization error body into an auth error', async () => {
		respond(categoriesKeyRejectedBody, 200);

		const error = await failure(
			makeEventzillaRequest(API_KEY, {
				method: 'GET',
				path: '/categories',
			}),
		);

		expect(error.kind).toBe('unauthorized');
		expect(error.status).toBe(200);
		expect(error.message).toContain('answered HTTP 200 with an error');
	});

	it('does not mistake a real categories payload for an error', async () => {
		respond({ categories: [{ category: 'Business' }] }, 200);

		const body = await makeEventzillaRequest(API_KEY, {
			method: 'GET',
			path: '/categories',
		});

		expect(body).toEqual({ categories: [{ category: 'Business' }] });
	});

	it('keeps Retry-After on a 429', async () => {
		respond({ message: 'slow down' }, 429, { 'Retry-After': '7' });

		const error = await failure(
			makeEventzillaRequest(API_KEY, { method: 'GET', path: '/events' }),
		);

		expect(error.kind).toBe('rate_limited');
		expect(error.retryAfter).toBe(7000);
	});

	it('reports a 5xx as a server error', async () => {
		respond('gateway blew up', 502);

		const error = await failure(
			makeEventzillaRequest(API_KEY, { method: 'GET', path: '/events' }),
		);

		expect(error.kind).toBe('server');
		expect(error.status).toBe(502);
	});

	it('reports a transport failure without a response', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await transportFailure(
			makeEventzillaRequest(API_KEY, { method: 'GET', path: '/events' }),
		);

		expect(error.kind).toBe('network');
		expect(error.method).toBe('GET');
	});

	it('reports a timeout as a timeout, not a plain network failure', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out.', 'TimeoutError'),
		);

		const error = await transportFailure(
			makeEventzillaRequest(API_KEY, {
				method: 'POST',
				path: '/checkout/confirm',
			}),
		);

		expect(error.kind).toBe('timeout');
		expect(error.method).toBe('POST');
	});
});

describe('describeEventzillaError', () => {
	it('prefers the body message and adds status and code', () => {
		expect(
			describeEventzillaError(
				400,
				{ status: 400, error_code: 'bad_request', message: 'quantity is zero' },
				'Bad Request',
			),
		).toBe('Eventzilla 400 bad_request: quantity is zero');
	});

	it('falls back to the given message when the body has none', () => {
		expect(
			describeEventzillaError(500, undefined, 'Internal Server Error'),
		).toBe('Eventzilla 500: Internal Server Error');
	});

	it('accepts a null body', () => {
		expect(describeEventzillaError(undefined, null, 'Something failed')).toBe(
			'Something failed',
		);
	});
});

describe('segment', () => {
	it('encodes a value so it cannot leave its path segment', () => {
		expect(segment('../users')).toBe('..%2Fusers');
		expect(segment(42)).toBe('42');
	});

	it('leaves a reference number readable', () => {
		expect(segment('20260520145-178028')).toBe('20260520145-178028');
	});
});
