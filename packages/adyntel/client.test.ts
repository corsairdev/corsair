import {
	AdyntelAPIError,
	describeAdyntelError,
	makeAdyntelRequest,
} from './client';
import { detailErrorBody, errorBody, metaAdsResponse } from './test-fixtures';

const CREDENTIALS = {
	apiKey: 'hd-f66446a87912e93772eeb-6',
	email: 'mike@tyson.com',
};

let fetchMock: jest.SpyInstance;

function respond(
	// unknown: response bodies are arbitrary JSON or text.
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
async function failure(promise: Promise<unknown>): Promise<AdyntelAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(AdyntelAPIError);
	if (!(error instanceof AdyntelAPIError)) throw error;
	return error;
}

function lastCall() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return {
		url,
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the client serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeAdyntelRequest', () => {
	it('POSTs JSON to the endpoint path on the production host', async () => {
		respond(metaAdsResponse, 200);

		const result = await makeAdyntelRequest(CREDENTIALS, {
			path: 'facebook',
			operation: 'facebookAds',
			body: { company_domain: 'zoom.com' },
		});

		expect(result).toEqual({ kind: 'body', body: metaAdsResponse });
		const sent = lastCall();
		expect(sent.url).toBe('https://api.adyntel.com/facebook');
		expect(sent.method).toBe('POST');
		expect(sent.headers.get('content-type')).toBe('application/json');
		expect(sent.body).toEqual({
			company_domain: 'zoom.com',
			email: CREDENTIALS.email,
			api_key: CREDENTIALS.apiKey,
		});
	});

	it('sends both credentials in the body and no Authorization header', async () => {
		respond({}, 200);

		await makeAdyntelRequest(CREDENTIALS, {
			path: 'google',
			operation: 'googleAds',
			body: { company_domain: 'clay.com' },
		});

		const sent = lastCall();
		expect(sent.headers.get('authorization')).toBeNull();
		expect(sent.body).toMatchObject({
			email: CREDENTIALS.email,
			api_key: CREDENTIALS.apiKey,
		});
	});

	it('does not let an endpoint field overwrite a credential', async () => {
		respond({}, 200);

		await makeAdyntelRequest(CREDENTIALS, {
			path: 'google',
			operation: 'googleAds',
			body: { company_domain: 'clay.com', api_key: 'stale', email: 'x@y.z' },
		});

		expect(lastCall().body).toMatchObject({
			api_key: CREDENTIALS.apiKey,
			email: CREDENTIALS.email,
		});
	});

	it('reports a 204 as no-content, which is how "no ads found" arrives', async () => {
		respondEmpty(204);

		await expect(
			makeAdyntelRequest(CREDENTIALS, {
				path: 'facebook',
				operation: 'facebookAds',
				body: {},
			}),
		).resolves.toEqual({ kind: 'no-content' });
	});

	it('throws when a 200 body cannot be read, instead of reporting no-content', async () => {
		// The failure the review found: a dropped connection mid-body also yields
		// an undefined body. Only a real 204 may become an empty result.
		fetchMock.mockResolvedValueOnce(
			new Response('{not json', {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);

		const error = await failure(
			makeAdyntelRequest(CREDENTIALS, {
				path: 'tiktok_search',
				operation: 'tiktokSearch',
				body: {},
			}),
		);
		expect(error.operation).toBe('tiktokSearch');
	});

	it('reads the message of a 401', async () => {
		respond(errorBody, 401);

		const error = await failure(
			makeAdyntelRequest(CREDENTIALS, {
				path: 'google',
				operation: 'googleAds',
				body: {},
			}),
		);
		expect(error.status).toBe(401);
		expect(error.operation).toBe('googleAds');
		expect(error.isRateLimit).toBe(false);
		expect(error.message).toBe('Adyntel 401: Invalid username and api key');
	});

	it('reads the detail of a TikTok error', async () => {
		respond(detailErrorBody, 401);

		const error = await failure(
			makeAdyntelRequest(CREDENTIALS, {
				path: 'tiktok_search',
				operation: 'tiktokSearch',
				body: {},
			}),
		);
		expect(error.status).toBe(401);
		expect(error.message).toBe('Adyntel 401: Invalid credentials');
	});

	it('maps a 402 insufficient-credits answer to its status', async () => {
		respond({ message: 'Insufficient credits' }, 402);

		const error = await failure(
			makeAdyntelRequest(CREDENTIALS, {
				path: 'linkedin',
				operation: 'linkedinAds',
				body: {},
			}),
		);
		expect(error.status).toBe(402);
		expect(error.message).toBe('Adyntel 402: Insufficient credits');
	});

	it('treats a 429 as a rate limit and reads Retry-After', async () => {
		respond({ message: 'Too many requests' }, 429, { 'Retry-After': '2' });

		const error = await failure(
			makeAdyntelRequest(CREDENTIALS, {
				path: 'google',
				operation: 'googleAds',
				body: {},
			}),
		);
		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBe(2000);
		// The client makes one attempt; error-handlers owns retries.
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('wraps network failures', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeAdyntelRequest(CREDENTIALS, {
				path: 'google',
				operation: 'googleAds',
				body: {},
			}),
		);
		expect(error.message).toContain('fetch failed');
		expect(error.status).toBeUndefined();
		expect(error.operation).toBe('googleAds');
		expect(error.cause).toBeInstanceOf(TypeError);
	});

	it('wraps a fetch timeout', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out', 'TimeoutError'),
		);

		const error = await failure(
			makeAdyntelRequest(CREDENTIALS, {
				path: 'google',
				operation: 'googleAds',
				body: {},
			}),
		);
		expect(error.message).toContain('timed out');
		expect(error.status).toBeUndefined();
	});

	it('leaves the API key and email out of errors', async () => {
		respond(errorBody, 401);

		const error = await failure(
			makeAdyntelRequest(CREDENTIALS, {
				path: 'google',
				operation: 'googleAds',
				body: {},
			}),
		);
		expect(error.message).not.toContain(CREDENTIALS.apiKey);
		expect(error.message).not.toContain(CREDENTIALS.email);
		expect(JSON.stringify(error)).not.toContain(CREDENTIALS.apiKey);
	});

	it('keeps both credentials out of the nested cause', async () => {
		respond(errorBody, 401);

		const error = await failure(
			makeAdyntelRequest(CREDENTIALS, {
				path: 'google',
				operation: 'googleAds',
				body: {},
			}),
		);

		// `ApiError` retains the request options it was built from, and this
		// plugin's body carries both credentials. The cause must not hold them.
		const serialized = JSON.stringify(error.cause);
		expect(serialized).not.toContain(CREDENTIALS.apiKey);
		expect(serialized).not.toContain(CREDENTIALS.email);
		expect(error.cause).not.toHaveProperty('request');
		expect(error.cause).not.toHaveProperty('body');
	});

	it('still reports the status, URL and retry hint the caller needs', async () => {
		respond({ message: 'Too many requests' }, 429, { 'Retry-After': '3' });

		const error = await failure(
			makeAdyntelRequest(CREDENTIALS, {
				path: 'google',
				operation: 'googleAds',
				body: {},
			}),
		);

		// Sanitising must not cost the caller what it needs to react.
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(3000);
		expect(error.operation).toBe('googleAds');
		expect(error.message).toContain('Adyntel 429');
		expect(error.cause).toMatchObject({
			status: 429,
			url: 'https://api.adyntel.com/google',
		});
	});

	it('gives a scrape the longer timeout its 60 second sync limit needs', async () => {
		// Spy on the timeout factory rather than only asserting the request
		// resolved: a passing call proves nothing about the configured value, and
		// silently reverting to corsair/http's 20 second default would cut valid
		// scrapes short.
		const timeoutSpy = jest.spyOn(AbortSignal, 'timeout');
		respond({}, 200);

		try {
			await makeAdyntelRequest(CREDENTIALS, {
				path: 'google',
				operation: 'googleAds',
				body: {},
			});

			expect(timeoutSpy).toHaveBeenCalledWith(90_000);
		} finally {
			timeoutSpy.mockRestore();
		}
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(lastCall().method).toBe('POST');
	});
});

describe('describeAdyntelError', () => {
	it('reads `message`', () => {
		expect(describeAdyntelError(400, { message: 'Missing keyword' }, 'x')).toBe(
			'Adyntel 400: Missing keyword',
		);
	});

	it('reads `detail`', () => {
		expect(describeAdyntelError(500, { detail: 'Scrape failed' }, 'x')).toBe(
			'Adyntel 500: Scrape failed',
		);
	});

	it('falls back when the body has no error text', () => {
		expect(describeAdyntelError(503, '<html>down</html>', 'Unavailable')).toBe(
			'Adyntel 503: Unavailable',
		);
		expect(describeAdyntelError(undefined, undefined, 'timeout')).toBe(
			'timeout',
		);
	});
});
