import {
	describeWoodpeckerCoError,
	makeWoodpeckerCoRequest,
	segment,
	WoodpeckerCoAPIError,
} from './client';
import {
	campaign,
	prospectsNotAdded,
	v1BadKey,
	v1RateLimited,
	v2Domain,
	v2Problem,
} from './test-fixtures';

const API_KEY = 'wp-secret-test-key';

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
): Promise<WoodpeckerCoAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(WoodpeckerCoAPIError);
	if (!(error instanceof WoodpeckerCoAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeWoodpeckerCoRequest', () => {
	it('authenticates with x-api-key and no Authorization header', async () => {
		respond([campaign], 200);

		const result = await makeWoodpeckerCoRequest(API_KEY, {
			method: 'GET',
			path: '/v1/campaign_list',
			query: { status: 'RUNNING,PAUSED', id: undefined },
		});

		expect(result).toEqual([campaign]);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(
			'https://api.woodpecker.co/rest/v1/campaign_list?status=RUNNING%2CPAUSED',
		);
		const headers = new Headers(init.headers);
		expect(init.method).toBe('GET');
		expect(headers.get('x-api-key')).toBe(API_KEY);
		expect(headers.get('authorization')).toBeNull();
		expect(headers.get('content-type')).toBeNull();
	});

	it('POSTs a JSON body with a JSON content type', async () => {
		respond({ ok: true }, 200);

		await makeWoodpeckerCoRequest(API_KEY, {
			method: 'POST',
			path: '/v1/add_prospects_campaign',
			body: { force: false },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({ force: false });
	});

	it('sends no body or content type on a bodyless POST', async () => {
		respondEmpty(200);

		await expect(
			makeWoodpeckerCoRequest(API_KEY, {
				method: 'POST',
				path: '/v2/campaigns/1/run',
			}),
		).resolves.toBeUndefined();

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.body).toBeUndefined();
		expect(new Headers(init.headers).get('content-type')).toBeNull();
	});

	it('resolves a 204 as undefined', async () => {
		respondEmpty(204);

		await expect(
			makeWoodpeckerCoRequest(API_KEY, {
				method: 'GET',
				path: '/v1/campaign_list',
			}),
		).resolves.toBeUndefined();
	});

	it('percent-encodes the + that sort and diff values carry', async () => {
		respond([], 200);

		await makeWoodpeckerCoRequest(API_KEY, {
			method: 'GET',
			path: '/v1/prospects',
			query: {
				sort: '+company,-last_contacted',
				diff: '2025-01-15T00:00:00+0200',
			},
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toContain('sort=%2Bcompany%2C-last_contacted');
		expect(url).toContain('diff=2025-01-15T00%3A00%3A00%2B0200');
	});

	it('reads the code and message of a v1 error', async () => {
		respond(v1BadKey, 401);

		const error = await failure(
			makeWoodpeckerCoRequest(API_KEY, {
				method: 'GET',
				path: '/v1/campaign_list',
			}),
		);
		expect(error.status).toBe(401);
		expect(error.code).toBe('E_SESSION');
		expect(error.method).toBe('GET');
		expect(error.isRateLimit).toBe(false);
		expect(error.message).toContain('Woodpecker 401 E_SESSION');
		expect(error.message).toContain('no longer valid');
	});

	it('reads the detail of a v2 default error', async () => {
		respond(v2Problem(401, 'Unauthorized', 'Invalid api key'), 401);

		const error = await failure(
			makeWoodpeckerCoRequest(API_KEY, {
				method: 'POST',
				path: '/v2/campaigns/1/run',
			}),
		);
		expect(error.status).toBe(401);
		expect(error.code).toBeUndefined();
		expect(error.message).toBe('Woodpecker 401: Invalid api key');
	});

	it('reads the code, message and details of a v2 domain error', async () => {
		respond(
			v2Domain('VALIDATION_FAILURE', 'Validation failure', 'Subject is empty'),
			409,
		);

		const error = await failure(
			makeWoodpeckerCoRequest(API_KEY, {
				method: 'POST',
				path: '/v2/campaigns/1/run',
			}),
		);
		expect(error.status).toBe(409);
		expect(error.code).toBe('VALIDATION_FAILURE');
		expect(error.isRateLimit).toBe(false);
		expect(error.message).toBe(
			'Woodpecker 409 VALIDATION_FAILURE: Validation failure (Subject is empty)',
		);
	});

	it('keeps per-prospect reasons on a 400 where none were added', async () => {
		respond(prospectsNotAdded, 400);

		const error = await failure(
			makeWoodpeckerCoRequest(API_KEY, {
				method: 'POST',
				path: '/v1/add_prospects_campaign',
				body: {},
			}),
		);
		expect(error.code).toBe('E_INV_STATUS');
		expect(error.body).toEqual(prospectsNotAdded);
		expect(error.message).not.toContain('jordan@');
	});

	it('treats a 429 as a rate limit and reads Retry-After', async () => {
		respond(v2Problem(429, 'Too Many Requests', 'Too many requests.'), 429, {
			'Retry-After': '2',
		});

		const error = await failure(
			makeWoodpeckerCoRequest(API_KEY, {
				method: 'POST',
				path: '/v2/campaigns/1/pause',
			}),
		);
		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBe(2000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('treats a v1 409 E_TOO_MANY_REQUESTS as a rate limit', async () => {
		respond(v1RateLimited, 409, { 'Retry-After': '3' });

		const error = await failure(
			makeWoodpeckerCoRequest(API_KEY, {
				method: 'GET',
				path: '/v1/prospects',
			}),
		);
		expect(error.status).toBe(409);
		expect(error.code).toBe('E_TOO_MANY_REQUESTS');
		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBe(3000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('wraps network failures', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeWoodpeckerCoRequest(API_KEY, {
				method: 'GET',
				path: '/v1/campaign_list',
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
			makeWoodpeckerCoRequest(API_KEY, {
				method: 'POST',
				path: '/v1/add_prospects_campaign',
				body: {},
			}),
		);
		expect(error.message).toContain('timed out');
		expect(error.status).toBeUndefined();
	});

	it('leaves the API key out of errors', async () => {
		respond(v1BadKey, 401);

		const error = await failure(
			makeWoodpeckerCoRequest(API_KEY, {
				method: 'GET',
				path: '/v1/campaign_list',
			}),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(JSON.stringify(error.cause)).not.toContain(API_KEY);
	});
});

describe('describeWoodpeckerCoError', () => {
	it('reads the v2 unknown-error shape', () => {
		const body = {
			type: 'UNKNOWN',
			message: 'Unknown error during run campaign call',
			details: null,
		};
		expect(describeWoodpeckerCoError(500, body, 'x')).toBe(
			'Woodpecker 500: Unknown error during run campaign call',
		);
	});

	it('falls back when the body has no error text', () => {
		expect(
			describeWoodpeckerCoError(503, '<html>down</html>', 'Unavailable'),
		).toBe('Woodpecker 503: Unavailable');
		expect(describeWoodpeckerCoError(undefined, undefined, 'timeout')).toBe(
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
