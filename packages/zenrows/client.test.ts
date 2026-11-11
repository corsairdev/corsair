import {
	describeZenRowsError,
	makeZenrowsRequest,
	parseJsonBody,
	readProblemCode,
	segment,
	ZENROWS_API_BASE,
	ZenRowsAPIError,
} from './client';
import { captureError } from './test-fixtures';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	// A spy with no queued response falls through to the real fetch, so every
	// call a test did not stub fails here instead of reaching the network.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		throw new Error('unmocked fetch: queue a response first');
	});
});

afterEach(() => {
	fetchMock.mockRestore();
});

// unknown: response bodies are arbitrary provider JSON, and the test decides
// what shape each one has.
function respond(
	body: unknown,
	status = 200,
	contentType = 'application/json',
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': contentType },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		url,
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialised.
		body: init.body,
	};
}

const KEY = 'zr-test-key';

describe('auth transport', () => {
	it('sends the key as X-API-Key and never in the query by default', async () => {
		respond({ ok: true });

		await makeZenrowsRequest(KEY, { method: 'GET', path: '/v1/crawls' });

		const sent = lastRequest();
		expect(sent.origin).toBe(ZENROWS_API_BASE);
		expect(sent.headers.get('x-api-key')).toBe(KEY);
		expect(sent.headers.get('authorization')).toBeNull();
		expect(sent.query.apikey).toBeUndefined();
	});

	it('moves the key to the apikey query parameter when the caller forwards headers', async () => {
		respond({ ok: true });

		await makeZenrowsRequest(KEY, {
			method: 'GET',
			path: '/v1/',
			query: { url: 'https://example.com' },
			auth: 'query',
		});

		const sent = lastRequest();
		expect(sent.query.apikey).toBe(KEY);
		expect(sent.query.url).toBe('https://example.com');
		// Zenrows copies every request header onto the target when
		// custom_headers is on, so the key must not be among them.
		expect(sent.headers.get('x-api-key')).toBeNull();
	});
});

describe('request building', () => {
	it('serialises a JSON body with its media type', async () => {
		respond({ id: 'c_1' });

		await makeZenrowsRequest(KEY, {
			method: 'POST',
			path: '/v1/crawls',
			body: { url: 'https://example.com', max_pages: 2 },
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.headers.get('content-type')).toBe('application/json');
		expect(JSON.parse(String(sent.body))).toEqual({
			url: 'https://example.com',
			max_pages: 2,
		});
	});

	it('passes a urlencoded body through verbatim', async () => {
		respond({ ok: true });

		await makeZenrowsRequest(KEY, {
			method: 'POST',
			path: '/v1/',
			body: 'a=1&b=2',
			mediaType: 'application/x-www-form-urlencoded',
		});

		const sent = lastRequest();
		expect(sent.headers.get('content-type')).toBe(
			'application/x-www-form-urlencoded',
		);
		expect(sent.body).toBe('a=1&b=2');
	});

	it('sends extra headers such as Idempotency-Key', async () => {
		respond({ crawl_id: 'c_1' });

		await makeZenrowsRequest(KEY, {
			method: 'POST',
			path: '/v1/crawls',
			body: { url: 'https://example.com' },
			headers: { 'Idempotency-Key': 'abc' },
		});

		expect(lastRequest().headers.get('idempotency-key')).toBe('abc');
	});
});

describe('response reading', () => {
	it('parses a JSON answer and keeps it as text too', async () => {
		respond({ crawl_id: 'c_1', status: 'running' });

		const response = await makeZenrowsRequest(KEY, {
			method: 'GET',
			path: '/v1/crawls',
		});

		expect(response.bodyFormat).toBe('json');
		expect(response.json).toEqual({ crawl_id: 'c_1', status: 'running' });
		expect(JSON.parse(response.text)).toEqual(response.json);
	});

	it('keeps an HTML answer as text and does not invent JSON for it', async () => {
		// Zenrows labels every Fetch text mode text/plain, including HTML.
		respond('<!doctype html><html></html>', 200, 'text/plain');

		const response = await makeZenrowsRequest(KEY, {
			method: 'GET',
			path: '/v1/',
		});

		expect(response.text).toBe('<!doctype html><html></html>');
		expect(response.json).toBeUndefined();
	});

	it('parses a JSON body that arrived labelled text/plain', async () => {
		// The css_extractor, outputs and extract modes all answer JSON this way.
		respond('{"title":"Hoodie"}', 200, 'text/plain');

		const response = await makeZenrowsRequest(KEY, {
			method: 'GET',
			path: '/v1/',
		});

		expect(response.json).toEqual({ title: 'Hoodie' });
		expect(parseJsonBody(response, '/v1/')).toEqual({ title: 'Hoodie' });
	});

	it('throws rather than returning an empty object for a non-JSON body', () => {
		expect(() =>
			parseJsonBody(
				{ status: 200, bodyFormat: 'text', text: '<html></html>' },
				'/v1/',
			),
		).toThrow(ZenRowsAPIError);
	});
});

describe('error translation', () => {
	it('keeps the status, the code and Retry-After', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					code: 'AUTH004',
					status: 402,
					title: 'Usage exceeded (AUTH004)',
					detail: 'This account has used all its credits for the period.',
				}),
				{
					status: 402,
					headers: { 'Content-Type': 'application/problem+json' },
				},
			),
		);

		const error = await captureError(
			makeZenrowsRequest(KEY, {
				method: 'GET',
				path: '/v1/',
			}),
		);

		expect(error).toBeInstanceOf(ZenRowsAPIError);
		const apiError = error as ZenRowsAPIError;
		expect(apiError.status).toBe(402);
		expect(apiError.code).toBe('AUTH004');
		expect(apiError.isOutOfCredits).toBe(true);
		expect(apiError.isRateLimit).toBe(false);
		expect(apiError.message).toContain('Usage exceeded');
	});

	it('reads both 429 codes as a rate limit and a plain 429 without a body', async () => {
		for (const code of ['AUTH006', 'AUTH008']) {
			fetchMock.mockResolvedValueOnce(
				new Response(JSON.stringify({ code, status: 429, title: 'x' }), {
					status: 429,
					headers: { 'Content-Type': 'application/problem+json' },
				}),
			);
			const error = (await captureError(
				makeZenrowsRequest(KEY, {
					method: 'GET',
					path: '/v1/',
				}),
			)) as ZenRowsAPIError;
			expect(error.code).toBe(code);
			expect(error.isRateLimit).toBe(true);
		}

		fetchMock.mockResolvedValueOnce(new Response(null, { status: 429 }));
		const bare = (await captureError(
			makeZenrowsRequest(KEY, {
				method: 'GET',
				path: '/v1/',
			}),
		)) as ZenRowsAPIError;
		expect(bare.code).toBeUndefined();
		expect(bare.isRateLimit).toBe(true);
	});

	it('records the method so a write is never replayed on a 5xx', async () => {
		respond({ code: 'internal', status: 500 }, 500);

		const error = (await captureError(
			makeZenrowsRequest(KEY, {
				method: 'POST',
				path: '/v1/crawls',
				body: {},
			}),
		)) as ZenRowsAPIError;

		expect(error.method).toBe('POST');
		expect(error.status).toBe(500);
	});

	it('never puts the key in the message', async () => {
		respond(
			{
				code: 'AUTH002',
				status: 401,
				title: 'Invalid apikey provided (AUTH002)',
				detail: 'Invalid API key.',
			},
			401,
		);

		const error = (await captureError(
			makeZenrowsRequest(KEY, {
				method: 'GET',
				path: '/v1/',
				auth: 'query',
				query: { url: 'https://example.com' },
			}),
		)) as ZenRowsAPIError;

		expect(error.message).not.toContain(KEY);
		expect(JSON.stringify(error)).not.toContain(KEY);
		expect(require('node:util').inspect(error)).not.toContain(KEY);
	});
});

describe('problem body helpers', () => {
	it('reads a code and a description, falling back to the status line', () => {
		expect(readProblemCode({ code: 'RESP002' })).toBe('RESP002');
		expect(readProblemCode({ status: 404 })).toBeUndefined();
		expect(readProblemCode(null)).toBeUndefined();

		expect(
			describeZenRowsError(404, 'Not Found', {
				code: 'crawl_not_found',
				title: 'Crawl not found',
				detail: 'No crawl with this identifier exists for this account.',
			}),
		).toBe(
			'Zenrows 404 crawl_not_found: Crawl not found. No crawl with this identifier exists for this account.',
		);
		// An unknown route answers a bare `{ status: 404 }`.
		expect(describeZenRowsError(404, 'Not Found', { status: 404 })).toBe(
			'Zenrows request failed (Not Found)',
		);
	});

	it('encodes path segments', () => {
		expect(segment('c_01M72F709NDF8XFBYKBXRZ3QFA')).toBe(
			'c_01M72F709NDF8XFBYKBXRZ3QFA',
		);
		expect(segment('a/b c')).toBe('a%2Fb%20c');
	});
});
