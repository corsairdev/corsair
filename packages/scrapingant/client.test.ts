import type { ScrapingAntRawResponse } from './client';
import {
	makeScrapingAntRequest,
	parseJsonBody,
	parseJsonObject,
	SCRAPINGANT_API_BASE,
	ScrapingAntAPIError,
} from './client';
import {
	BAD_TOKEN_BODY,
	HTML_BODY,
	IP_BLOCKED_BODY,
	QUOTA_BODY,
	VALIDATION_BODY,
} from './test-fixtures';
import {
	fetchCallCount,
	installFetchMock,
	respond,
	restoreFetchMock,
	sentHeaders,
	sentQuery,
	sentUrl,
} from './test-helpers';

const API_KEY = 'sa-test-key';

/** The rejection as a ScrapingAntAPIError, so each test can assert on it. */
async function failure(
	promise: Promise<ScrapingAntRawResponse>,
): Promise<ScrapingAntAPIError> {
	// unknown: a rejection can carry any value, not just an Error, so this
	// catches it untyped and asserts on the class below.
	const error: unknown = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(ScrapingAntAPIError);
	if (!(error instanceof ScrapingAntAPIError)) {
		throw new Error('expected a ScrapingAntAPIError');
	}
	return error;
}

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('makeScrapingAntRequest', () => {
	it('sends the key as an x-api-key header, never in the query', async () => {
		respond(HTML_BODY, 200, { 'Ant-credits-cost': '10' });

		await makeScrapingAntRequest(API_KEY, '/v2/general', {
			query: { url: 'https://example.com/' },
		});

		expect(sentUrl().origin + sentUrl().pathname).toBe(
			`${SCRAPINGANT_API_BASE}/v2/general`,
		);
		expect(sentQuery().get('url')).toBe('https://example.com/');
		expect(sentQuery().has('x-api-key')).toBe(false);
		expect(sentHeaders().get('x-api-key')).toBe(API_KEY);
	});

	it('sends one query parameter per array item', async () => {
		respond(HTML_BODY);

		await makeScrapingAntRequest(API_KEY, '/v2/general', {
			query: { url: 'https://example.com/', block_resource: ['image', 'font'] },
		});

		expect(sentQuery().getAll('block_resource')).toEqual(['image', 'font']);
	});

	it('drops an unset option instead of sending it empty', async () => {
		respond(HTML_BODY);

		await makeScrapingAntRequest(API_KEY, '/v2/general', {
			query: {
				url: 'https://example.com/',
				browser: undefined,
				proxy_country: undefined,
			},
		});

		expect([...sentQuery().keys()]).toEqual(['url']);
	});

	it('prefixes custom headers with Ant- so the target receives them', async () => {
		respond(HTML_BODY);

		await makeScrapingAntRequest(API_KEY, '/v2/general', {
			query: { url: 'https://httpbin.org/headers' },
			antHeaders: { 'Accept-Language': 'de-DE' },
		});

		expect(sentHeaders().get('Ant-Accept-Language')).toBe('de-DE');
		// The prefix is ScrapingAnt's; the target never sees it.
		expect(sentHeaders().has('Accept-Language')).toBe(false);
	});

	it('reads the target status and credit cost from the answer headers', async () => {
		respond(HTML_BODY, 200, {
			'Ant-page-status-code': '404',
			'Ant-credits-cost': '25',
		});

		const raw = await makeScrapingAntRequest(API_KEY, '/v2/general', {
			query: { url: 'https://example.com/missing' },
		});

		expect(raw).toEqual({ body: HTML_BODY, pageStatus: 404, creditsCost: 25 });
	});

	it('keeps an HTML body as text even when the response claims JSON', async () => {
		// The published spec labels the /v2/general body `application/json`
		// while the body is HTML, so trusting the content type loses the page.
		respond(HTML_BODY, 200, { 'Content-Type': 'application/json' });

		const raw = await makeScrapingAntRequest(API_KEY, '/v2/general', {
			query: { url: 'https://example.com/' },
		});

		expect(raw.body).toBe(HTML_BODY);
	});

	it('reports a 403 with the provider detail and flags the bad key', async () => {
		respond(BAD_TOKEN_BODY, 403);

		const error = await failure(makeScrapingAntRequest(API_KEY, '/v2/usage'));

		expect(error.status).toBe(403);
		expect(error.isAuthError).toBe(true);
		expect(error.isQuotaExhausted).toBe(false);
		expect(error.isIpBlocked).toBe(false);
		expect(error.detail).toContain('API token is wrong');
	});

	it('tells the exhausted-credits 403 apart from the bad-key 403', async () => {
		respond(QUOTA_BODY, 403);

		const error = await failure(makeScrapingAntRequest(API_KEY, '/v2/usage'));

		expect(error.isQuotaExhausted).toBe(true);
		expect(error.isAuthError).toBe(false);
	});

	it('tells the IP allowlist 403 apart from the other two', async () => {
		respond(IP_BLOCKED_BODY, 403);

		const error = await failure(makeScrapingAntRequest(API_KEY, '/v2/usage'));

		expect(error.isIpBlocked).toBe(true);
		expect(error.isAuthError).toBe(false);
		expect(error.isQuotaExhausted).toBe(false);
	});

	it('joins the array form of a validation detail into one message', async () => {
		respond(VALIDATION_BODY, 422);

		const error = await failure(
			makeScrapingAntRequest(API_KEY, '/v2/general', {
				query: { url: 'https://example.com/' },
			}),
		);

		expect(error.status).toBe(422);
		expect(error.detail).toContain('Invalid url scheme');
		expect(error.message).toContain('Invalid url scheme');
	});

	it('carries Retry-After through as milliseconds', async () => {
		respond({ detail: 'slow down' }, 429, { 'Retry-After': '3' });

		const error = await failure(makeScrapingAntRequest(API_KEY, '/v2/usage'));

		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(3000);
	});

	it('flags a transport failure as replayable and not a timeout', async () => {
		(globalThis.fetch as jest.Mock).mockRejectedValueOnce(
			new TypeError('fetch failed'),
		);

		const error = await failure(makeScrapingAntRequest(API_KEY, '/v2/usage'));

		expect(error.isTransport).toBe(true);
		expect(error.isTimeout).toBe(false);
		expect(error.status).toBeUndefined();
	});

	it('flags the client deadline as a timeout', async () => {
		const timeoutError = new Error('The operation timed out.');
		timeoutError.name = 'TimeoutError';
		(globalThis.fetch as jest.Mock).mockRejectedValueOnce(timeoutError);

		const error = await failure(makeScrapingAntRequest(API_KEY, '/v2/usage'));

		expect(error.isTimeout).toBe(true);
		expect(error.isTransport).toBe(true);
	});

	it('keeps no key on the error', async () => {
		respond(BAD_TOKEN_BODY, 403);

		const error = await failure(makeScrapingAntRequest(API_KEY, '/v2/usage'));

		// The key rides in a header, so nothing in the error can echo it.
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(error.cause).toBeUndefined();
	});

	it('sends one request per call', async () => {
		respond(HTML_BODY);

		await makeScrapingAntRequest(API_KEY, '/v2/usage');

		expect(fetchCallCount()).toBe(1);
	});
});

describe('parseJsonBody', () => {
	it('parses a JSON answer', () => {
		expect(parseJsonBody({ body: '{"a":1}' })).toEqual({ a: 1 });
	});

	it('throws on a non-JSON body rather than returning it', () => {
		expect(() => parseJsonBody({ body: '<html>oops</html>' })).toThrow(
			ScrapingAntAPIError,
		);
	});
});

describe('parseJsonObject', () => {
	it('returns an object', () => {
		expect(parseJsonObject({ body: '{"url":"x"}' })).toEqual({ url: 'x' });
	});

	it('throws on a JSON array rather than treating it as an envelope', () => {
		expect(() => parseJsonObject({ body: '[1,2]' })).toThrow(
			ScrapingAntAPIError,
		);
	});

	it('throws on a bare JSON scalar', () => {
		expect(() => parseJsonObject({ body: '42' })).toThrow(ScrapingAntAPIError);
	});
});
