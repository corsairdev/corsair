import {
	COINMARKETCAP_API_BASE,
	CoinMarketCapAPIError,
	describeCoinMarketCapError,
	errorFromEnvelope,
	makeCoinMarketCapRequest,
} from './client';
import {
	errorResponse,
	listingsResponse,
	mapResponse,
	rateLimitResponse,
	unknownRouteResponse,
} from './test-fixtures';

const API_KEY = 'cmc-secret-test-key';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(
	body: unknown, // unknown: response bodies are arbitrary JSON or text.
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
	promise: Promise<unknown>, // unknown: the promise rejects with any value.
): Promise<CoinMarketCapAPIError> {
	// unknown: a rejection can be any value until the instanceof check narrows it.
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(CoinMarketCapAPIError);
	if (!(error instanceof CoinMarketCapAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeCoinMarketCapRequest', () => {
	it('sends the key in X-CMC_PRO_API_KEY and no Authorization header', async () => {
		respond(listingsResponse, 200);

		const result = await makeCoinMarketCapRequest(API_KEY, {
			method: 'GET',
			path: '/v3/cryptocurrency/listings/latest',
			query: { limit: 1, start: undefined },
		});

		expect(result).toEqual(listingsResponse);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(
			`${COINMARKETCAP_API_BASE}/v3/cryptocurrency/listings/latest?limit=1`,
		);
		const headers = new Headers(init.headers);
		expect(init.method).toBe('GET');
		expect(headers.get('x-cmc_pro_api_key')).toBe(API_KEY);
		expect(headers.get('authorization')).toBeNull();
		// A GET must never carry a body.
		expect(init.body).toBeUndefined();
	});

	it('never puts the key in the query string', async () => {
		respond(mapResponse, 200);

		await makeCoinMarketCapRequest(API_KEY, {
			method: 'GET',
			path: '/v1/cryptocurrency/map',
			query: { symbol: 'BTC' },
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).not.toContain(API_KEY);
		expect(url).not.toContain('api_key');
	});

	it('reads the numeric error_code of a /v2 error', async () => {
		respond(errorResponse, 400);

		const error = await failure(
			makeCoinMarketCapRequest(API_KEY, {
				method: 'GET',
				path: '/v1/cryptocurrency/map',
			}),
		);
		expect(error.status).toBe(400);
		// A string on the wire, a number on the error.
		expect(error.code).toBe(400);
		expect(error.message).toContain('CoinMarketCap 400, code 400');
		expect(error.message).toContain('positive number in range');
		expect(error.method).toBe('GET');
	});

	it('reads a numeric error_code as well as a string one', async () => {
		respond(
			{
				status: {
					timestamp: '2026-11-09T15:03:08.486Z',
					error_code: 1002,
					error_message: 'API key missing.',
					elapsed: 1,
					credit_count: 0,
					notice: null,
				},
			},
			401,
		);

		const error = await failure(
			makeCoinMarketCapRequest(API_KEY, {
				method: 'GET',
				path: '/v1/key/info',
			}),
		);
		expect(error.code).toBe(1002);
		expect(error.message).toBe(
			'CoinMarketCap 401, code 1002: API key missing.',
		);
	});

	it('treats a 429 as a rate limit and reads Retry-After', async () => {
		respond(rateLimitResponse, 429, { 'Retry-After': '5' });

		const error = await failure(
			makeCoinMarketCapRequest(API_KEY, {
				method: 'GET',
				path: '/v3/cryptocurrency/listings/latest',
			}),
		);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(5000);
		// 1022 is the anonymous allowance, which is a plan limit, not a throttle.
		expect(error.isRetryableThrottle).toBe(false);
		expect(error.isPlanLimit).toBe(true);
		// The client makes one attempt; error-handlers.ts owns the retry.
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('recognises the retryable throttle codes', async () => {
		respond(
			{
				status: {
					timestamp: '2026-11-09T15:08:53.298Z',
					error_code: '1008',
					error_message:
						"You've exceeded your API Key's HTTP request rate limit.",
					elapsed: 0,
					credit_count: 0,
				},
			},
			429,
		);

		const error = await failure(
			makeCoinMarketCapRequest(API_KEY, {
				method: 'GET',
				path: '/v1/key/info',
			}),
		);
		expect(error.isRetryableThrottle).toBe(true);
		expect(error.isPlanLimit).toBe(false);
	});

	it('keeps only the status object of an error body', async () => {
		respond(errorResponse, 400);

		const error = await failure(
			makeCoinMarketCapRequest(API_KEY, {
				method: 'GET',
				path: '/v1/cryptocurrency/map',
			}),
		);
		expect(error.body).toEqual({ status: errorResponse.status });
	});

	it('never prints the key, in the message or in util.inspect', async () => {
		respond(
			{ status: { error_code: '1001', error_message: 'Invalid key' } },
			401,
		);

		const error = await failure(
			makeCoinMarketCapRequest(API_KEY, {
				method: 'GET',
				path: '/v1/key/info',
			}),
		);

		expect(error.message).not.toContain(API_KEY);
		// cause is non-enumerable, so a test that only checked
		// JSON.stringify would prove nothing.
		expect(require('node:util').inspect(error, { depth: null })).not.toContain(
			API_KEY,
		);
		expect(error.status).toBe(401);
	});

	it('falls back to the message when the body is not the envelope', async () => {
		// A proxy in front of the API can answer JSON with no status object.
		respond('<html>Bad Gateway</html>', 502);

		const error = await failure(
			makeCoinMarketCapRequest(API_KEY, {
				method: 'GET',
				path: '/v1/key/info',
			}),
		);
		expect(error.status).toBe(502);
		expect(error.code).toBeUndefined();
		expect(error.message).toContain('CoinMarketCap 502');
	});

	it('wraps a transport failure and keeps its method', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeCoinMarketCapRequest(API_KEY, {
				method: 'GET',
				path: '/v1/key/info',
			}),
		);
		expect(error.status).toBeUndefined();
		expect(error.code).toBeUndefined();
		expect(error.method).toBe('GET');
		expect(error.message).toContain('fetch failed');
	});
});

describe('describeCoinMarketCapError', () => {
	it('joins the status and the code when both are known', () => {
		expect(describeCoinMarketCapError(400, errorResponse, 'fallback')).toBe(
			"CoinMarketCap 400, code 400: 'limit' should be a positive number in range [1, 5000]",
		);
	});

	it('omits the code when the body carries none', () => {
		expect(describeCoinMarketCapError(502, null, 'Bad Gateway')).toBe(
			'CoinMarketCap 502: Bad Gateway',
		);
	});
});

describe('errorFromEnvelope', () => {
	it('returns undefined for a successful status', () => {
		expect(errorFromEnvelope(listingsResponse)).toBeUndefined();
		// A v1 payload with error_code 0 as a number.
		expect(errorFromEnvelope(mapResponse)).toBeUndefined();
	});

	it('returns the error of a 200 body that reports a failure', () => {
		const error = errorFromEnvelope(unknownRouteResponse);
		expect(error).toBeInstanceOf(CoinMarketCapAPIError);
		expect(error?.code).toBe(500);
		expect(error?.message).toContain('The system is busy');
	});

	it('returns undefined when the body has no status object at all', () => {
		expect(errorFromEnvelope({ data: [] })).toBeUndefined();
		expect(errorFromEnvelope(null)).toBeUndefined();
	});
});
