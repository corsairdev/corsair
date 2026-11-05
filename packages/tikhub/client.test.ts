import {
	errorFromEnvelope,
	makeTikHubRequest,
	redactTokenEcho,
	TikHubAPIError,
} from './client';
import { envelope, errorBody } from './test-fixtures';

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

// unknown: callers pass any endpoint's promise, and a rejection can be any
// value until the instanceof check below narrows it.
async function failure(promise: Promise<unknown>): Promise<TikHubAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(TikHubAPIError);
	return error as TikHubAPIError;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeTikHubRequest', () => {
	it('sends an authenticated GET to api.tikhub.io and returns the JSON body', async () => {
		const body = envelope('/api/v1/tiktok/web/fetch_user_profile', {}, {});
		respond(body, 200);

		const result = await makeTikHubRequest(
			'/api/v1/tiktok/web/fetch_user_profile',
			'th-key',
			{ uniqueId: 'tiktok', secUid: undefined, count: 5, flag: false },
		);

		expect(result).toEqual(body);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(
			'https://api.tikhub.io/api/v1/tiktok/web/fetch_user_profile?uniqueId=tiktok&count=5&flag=false',
		);
		expect(init.method).toBe('GET');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe('Bearer th-key');
		expect(headers.get('content-type')).toBeNull();
		expect(init.signal).toBeInstanceOf(AbortSignal);
	});

	it('URL-encodes query values', async () => {
		respond(envelope('/x', {}, {}), 200);

		await makeTikHubRequest('/api/v1/instagram/v1/fetch_post_by_url', 'k', {
			post_url: 'https://www.instagram.com/p/DPwhVB-jo9k/?img_index=1',
		});

		const [url] = fetchMock.mock.calls[0] as [string];
		expect(url).toBe(
			'https://api.tikhub.io/api/v1/instagram/v1/fetch_post_by_url?post_url=https%3A%2F%2Fwww.instagram.com%2Fp%2FDPwhVB-jo9k%2F%3Fimg_index%3D1',
		);
	});

	it('turns a 401 into TikHubAPIError with the detail fields and no token echo', async () => {
		respond(
			errorBody(
				401,
				'/api/v1/tikhub/user/get_user_info',
				'Invalid API token, your submitted API token is abcd1234***. See the docs for more information: https://docs.tikhub.io/4592766m0#api-token-introduction',
			),
			401,
		);

		const error = await failure(
			makeTikHubRequest('/api/v1/tikhub/user/get_user_info', 'abcd1234-secret'),
		);

		expect(error.status).toBe(401);
		expect(error.code).toBe(401);
		expect(error.requestId).toBe('d714edd7-b26e-4c6b-8f73-f8ff1fc36e28');
		expect(error.router).toBe('/api/v1/tikhub/user/get_user_info');
		expect(error.message).toMatch(/^TikHub 401: Invalid API token/);
		expect(error.message).toContain('API token is [redacted]');
		expect(error.message).not.toContain('abcd1234');
	});

	it('reports a missing token from the 401 detail message', async () => {
		respond(
			errorBody(
				401,
				'/api/v1/tiktok/web/fetch_user_profile',
				'API token is missing in the request Header or Cookie, see the docs for more information',
			),
			401,
		);

		const error = await failure(
			makeTikHubRequest('/api/v1/tiktok/web/fetch_user_profile', ''),
		);

		expect(error.message).toBe(
			'TikHub 401: API token is missing in the request Header or Cookie, see the docs for more information',
		);
	});

	it('turns a 402 insufficient-balance response into TikHubAPIError', async () => {
		respond(
			errorBody(
				402,
				'/api/v1/tiktok/app/v3/fetch_video_search_result',
				'Insufficient balance, this endpoint requires payment and accepts free credits.',
			),
			402,
		);

		const error = await failure(
			makeTikHubRequest(
				'/api/v1/tiktok/app/v3/fetch_video_search_result',
				'k',
				{
					keyword: 'cats',
				},
			),
		);

		expect(error.status).toBe(402);
		expect(error.message).toBe(
			'TikHub 402: Insufficient balance, this endpoint requires payment and accepts free credits.',
		);
	});

	it('reads Retry-After into the error on a 429 and does not retry itself', async () => {
		respond(
			errorBody(
				429,
				'/api/v1/tiktok/web/fetch_user_profile',
				'Request too fast',
			),
			429,
			{ 'Retry-After': '3' },
		);

		const error = await failure(
			makeTikHubRequest('/api/v1/tiktok/web/fetch_user_profile', 'k'),
		);

		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(3000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('keeps a text error body from a proxy', async () => {
		respond('Bad gateway', 502);

		const error = await failure(makeTikHubRequest('/api/v1/health/check', 'k'));

		expect(error.status).toBe(502);
		expect(error.body).toBe('Bad gateway');
		expect(error.code).toBeUndefined();
		expect(error.message).toBe('TikHub 502: Bad Gateway');
	});

	it('wraps network failures', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(makeTikHubRequest('/api/v1/health/check', 'k'));

		expect(error.status).toBeUndefined();
		expect(error.message).toBe('fetch failed');
		expect(error.cause).toBeInstanceOf(TypeError);
	});
});

describe('errorFromEnvelope', () => {
	it('ignores successful envelopes and non-objects', () => {
		expect(errorFromEnvelope(envelope('/x', {}, {}))).toBeUndefined();
		expect(errorFromEnvelope(null)).toBeUndefined();
		expect(errorFromEnvelope('ok')).toBeUndefined();
		expect(errorFromEnvelope({ data: {} })).toBeUndefined();
	});

	it('returns an error for a failure code inside a 200 body', () => {
		const error = errorFromEnvelope({
			code: 402,
			message: 'Insufficient balance',
			request_id: 'r-1',
			router: '/api/v1/youtube/web_v2/get_video_info_v2',
		});

		expect(error).toBeInstanceOf(TikHubAPIError);
		expect(error?.status).toBe(402);
		expect(error?.code).toBe(402);
		expect(error?.requestId).toBe('r-1');
		expect(error?.message).toBe('TikHub 402: Insufficient balance');
	});
});

describe('redactTokenEcho', () => {
	it('removes every echoed token prefix and leaves other text alone', () => {
		expect(
			redactTokenEcho(
				'your submitted API token is 3kTq9***. Again: API token is zzz***',
			),
		).toBe(
			'your submitted API token is [redacted]. Again: API token is [redacted]',
		);
		expect(redactTokenEcho('API token is missing in the request Header')).toBe(
			'API token is missing in the request Header',
		);
	});
});
