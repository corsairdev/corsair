import {
	describeOpengraphError,
	makeOpengraphRequest,
	OpengraphAPIError,
	segment,
} from './client';
import {
	blockedError,
	brandOptionsError,
	flatError,
	nestedError,
	oembedResolutionError,
	rateLimitError,
	siteResponse,
} from './test-fixtures';

const APP_ID = 'og-secret-test-id';

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
async function failure(promise: Promise<unknown>): Promise<OpengraphAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(OpengraphAPIError);
	if (!(error instanceof OpengraphAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeOpengraphRequest', () => {
	it('authenticates with the app_id query parameter, not a header', async () => {
		respond(siteResponse, 200);

		const result = await makeOpengraphRequest(APP_ID, {
			method: 'GET',
			path: '/3.0/site/https%3A%2F%2Fgithub.com',
			query: { cache_ok: false, max_cache_age: undefined },
		});

		expect(result).toEqual(siteResponse);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(
			'https://opengraph.io/api/3.0/site/https%3A%2F%2Fgithub.com?cache_ok=false&app_id=og-secret-test-id',
		);
		expect(init.method).toBe('GET');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBeNull();
		expect(headers.get('x-api-key')).toBeNull();
	});

	it('POSTs a JSON body with a JSON content type', async () => {
		respond(extractBody(), 200);

		await makeOpengraphRequest(APP_ID, {
			method: 'POST',
			path: '/3.0/extract',
			body: extractBody(),
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual(extractBody());
	});

	it('sends no body or content type on a GET', async () => {
		respond(siteResponse, 200);

		await makeOpengraphRequest(APP_ID, {
			method: 'GET',
			path: '/3.0/site/https%3A%2F%2Fgithub.com',
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.body).toBeUndefined();
		expect(new Headers(init.headers).get('content-type')).toBeNull();
	});

	it('serializes booleans and numbers into the query string', async () => {
		respond({ screenshotUrl: 'https://cdn.opengraph.io/x.png' }, 200);

		await makeOpengraphRequest(APP_ID, {
			method: 'GET',
			path: '/3.0/screenshot/https%3A%2F%2Fexample.com',
			query: { full_page: true, quality: 80, dark_mode: false },
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toContain('full_page=true');
		expect(url).toContain('quality=80');
		expect(url).toContain('dark_mode=false');
	});

	it('reads the message and string code of a flat error', async () => {
		respond(flatError, 401);

		const error = await failure(
			makeOpengraphRequest(APP_ID, {
				method: 'GET',
				path: '/3.0/site/https%3A%2F%2Fgithub.com',
			}),
		);
		expect(error.status).toBe(401);
		expect(error.code).toBe('INVALID_APP_ID');
		expect(error.method).toBe('GET');
		expect(error.isRateLimit).toBe(false);
		expect(error.message).toBe(
			'OpenGraph.io 401 INVALID_APP_ID: Invalid App ID',
		);
	});

	it('reads the numeric code of a nested markdown error', async () => {
		respond(nestedError, 400);

		const error = await failure(
			makeOpengraphRequest(APP_ID, {
				method: 'GET',
				path: '/3.0/markdown/https%3A%2F%2Fexample.com',
			}),
		);
		expect(error.status).toBe(400);
		expect(error.code).toBe(-2201);
		expect(error.message).toContain('positive integer');
	});

	it('reads a string error, which brand sends for invalid options', async () => {
		respond(brandOptionsError, 400);

		const error = await failure(
			makeOpengraphRequest(APP_ID, {
				method: 'POST',
				path: '/1.1/brand/https%3A%2F%2Fexample.com',
				body: { questions: [] },
			}),
		);
		expect(error.code).toBeUndefined();
		expect(error.message).toBe(
			'OpenGraph.io 400: A maximum of 3 custom questions may be supplied per request.',
		);
	});

	it('keeps the stage of an oEmbed resolution failure on the body', async () => {
		respond(oembedResolutionError, 422);

		const error = await failure(
			makeOpengraphRequest(APP_ID, {
				method: 'GET',
				path: '/3.0/oembed/https%3A%2F%2Fexample.com',
			}),
		);
		expect(error.status).toBe(422);
		expect(error.code).toBe('oembed_resolution_failed');
		expect(error.body).toEqual(oembedResolutionError);
	});

	it('treats a 429 as a rate limit and reads Retry-After', async () => {
		respond(rateLimitError, 429, { 'Retry-After': '2' });

		const error = await failure(
			makeOpengraphRequest(APP_ID, {
				method: 'GET',
				path: '/3.0/site/https%3A%2F%2Fgithub.com',
			}),
		);
		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBe(2000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('wraps network failures', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeOpengraphRequest(APP_ID, {
				method: 'GET',
				path: '/3.0/site/https%3A%2F%2Fgithub.com',
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
			makeOpengraphRequest(APP_ID, {
				method: 'GET',
				path: '/3.0/site/https%3A%2F%2Fgithub.com',
			}),
		);
		expect(error.message).toContain('timed out');
		expect(error.status).toBeUndefined();
	});

	it('leaves the App ID out of errors', async () => {
		respond(flatError, 401);

		const error = await failure(
			makeOpengraphRequest(APP_ID, {
				method: 'GET',
				path: '/3.0/site/https%3A%2F%2Fgithub.com',
			}),
		);
		expect(error.message).not.toContain(APP_ID);
		expect(JSON.stringify(error)).not.toContain(APP_ID);
		const causeJson = error.cause ? JSON.stringify(error.cause) : '';
		expect(causeJson).not.toContain(APP_ID);
	});
});

describe('describeOpengraphError', () => {
	it('falls back when the body has no error text', async () => {
		expect(describeOpengraphError(403, blockedError, 'x')).toBe(
			'OpenGraph.io 403 TARGET_BLOCKED: Target site blocked the request',
		);
		expect(
			describeOpengraphError(503, '<html>down</html>', 'Unavailable'),
		).toBe('OpenGraph.io 503: Unavailable');
		expect(describeOpengraphError(undefined, undefined, 'timeout')).toBe(
			'timeout',
		);
	});
});

describe('segment', () => {
	it('encodes a URL for one path segment', () => {
		expect(segment('https://github.com/?tab=repositories')).toBe(
			'https%3A%2F%2Fgithub.com%2F%3Ftab%3Drepositories',
		);
		expect(segment(12)).toBe('12');
	});
});

// unknown: fixture helper returning the request body shape of extract.
function extractBody(): unknown {
	return {
		site: 'https://example.com',
		selectors: { heading: { selector: 'h1', type: 'text' } },
	};
}
