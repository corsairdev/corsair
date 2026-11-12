import { ApiError } from 'corsair/http';
import {
	describeWebscraperioError,
	isWebscraperioFailure,
	makeWebscraperioRequest,
	segment,
	WEBSCRAPERIO_API_BASE,
	WebscraperioAPIError,
} from './client';
import {
	badRequest,
	invalidToken,
	routeNotFound,
	sitemapNotFound,
} from './test-fixtures';
import {
	API_KEY,
	installFetchMock,
	lastRequest,
	respond,
} from './test-support';

describe('makeWebscraperioRequest', () => {
	const fetchMock = installFetchMock();

	it('sends the token as a Bearer header, never in the URL', async () => {
		respond(fetchMock, { success: true, data: [] });

		await makeWebscraperioRequest(API_KEY, {
			method: 'GET',
			path: '/sitemaps',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.origin).toBe('https://api.webscraper.io');
		expect(sent.path).toBe('/api/v1/sitemaps');
		expect(sent.headers['authorization']).toBe(`Bearer ${API_KEY}`);
		expect(sent.query.api_token).toBeUndefined();
		expect(fetchMock.mock.calls.at(-1)?.[0]).not.toContain(API_KEY);
	});

	it('keeps the endpoint query and adds no token to it', async () => {
		respond(fetchMock, { success: true, data: [] });

		await makeWebscraperioRequest(API_KEY, {
			method: 'GET',
			path: '/sitemaps',
			query: { page: 2 },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.queryPairs).toEqual([['page', '2']]);
	});

	it('serializes a POST body as JSON', async () => {
		respond(fetchMock, { success: true, data: { id: 1 } });

		await makeWebscraperioRequest(API_KEY, {
			method: 'POST',
			path: '/sitemap',
			body: { _id: 'x', name: 'Catalogue' },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.headers['content-type']).toContain('application/json');
		expect(sent.body).toEqual({ _id: 'x', name: 'Catalogue' });
	});

	it('keeps a path segment encoded', () => {
		expect(segment('a/b')).toBe('a%2Fb');
		expect(segment(42)).toBe('42');
	});

	it('throws a WebscraperioAPIError carrying the handled flag', async () => {
		respond(fetchMock, invalidToken, 401);

		const error = (await makeWebscraperioRequest(API_KEY, {
			method: 'GET',
			path: '/sitemaps',
		}).catch((thrown: unknown) => thrown)) as WebscraperioAPIError;

		expect(error).toBeInstanceOf(WebscraperioAPIError);
		expect(error.status).toBe(401);
		// The application answered, so `handled` is true.
		expect(error.handled).toBe(true);
		expect(error.isAuthError).toBe(true);
	});

	it('marks an unrouted path as not handled', async () => {
		respond(fetchMock, routeNotFound, 404);

		const error = (await makeWebscraperioRequest(API_KEY, {
			method: 'GET',
			path: '/nope',
		}).catch((thrown: unknown) => thrown)) as WebscraperioAPIError;

		expect(error.handled).toBe(false);
		expect(error.isRouteNotFound).toBe(true);
		expect(error.isNotFound).toBe(false);
	});

	it('reads the 429 wait from X-RateLimit-Reset, the header the spec sends', async () => {
		const resetAt = Math.floor(Date.now() / 1000) + 30;
		fetchMock.mockResolvedValueOnce(
			new Response(
				JSON.stringify({ success: false, error: 'Too many requests' }),
				{
					status: 429,
					headers: {
						'Content-Type': 'application/json',
						'X-RateLimit-Limit': '200',
						'X-RateLimit-Remaining': '0',
						'X-RateLimit-Reset': String(resetAt),
					},
				},
			),
		);

		const error = (await makeWebscraperioRequest(API_KEY, {
			method: 'GET',
			path: '/sitemaps',
		}).catch((thrown: unknown) => thrown)) as WebscraperioAPIError;

		expect(error.status).toBe(429);
		expect(error.retryAfter).toBeGreaterThan(25_000);
		expect(error.retryAfter).toBeLessThanOrEqual(30_000);
	});

	it('wraps a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await makeWebscraperioRequest(API_KEY, {
			method: 'POST',
			path: '/sitemap',
		}).catch((thrown: unknown) => thrown)) as WebscraperioAPIError;

		expect(error.message).toBe('fetch failed');
		expect(error.method).toBe('POST');
	});

	it('never leaves the token in the error message or the body', async () => {
		// The provider echoes the submitted token in its bad-key message.
		respond(
			fetchMock,
			{ success: false, error: 'Unauthorized, invalid api_token BADTOKEN.' },
			401,
		);

		const error = (await makeWebscraperioRequest('BADTOKEN', {
			method: 'GET',
			path: '/sitemaps',
		}).catch((thrown: unknown) => thrown)) as WebscraperioAPIError;

		expect(error.message).not.toContain('BADTOKEN');
		expect(error.message).toContain('[redacted]');
		// The body is kept for `handled`, with the token removed.
		expect(JSON.stringify(error.body)).not.toContain('BADTOKEN');
		// No cause is attached, so the request URL cannot carry it either.
		expect((error as { cause?: unknown }).cause).toBeUndefined();
		expect(require('node:util').inspect(error)).not.toContain('BADTOKEN');
	});
});

describe('WebscraperioAPIError', () => {
	it('treats 401 as an auth error', () => {
		expect(new WebscraperioAPIError('x', { status: 401 }).isAuthError).toBe(
			true,
		);
	});

	it('recognises the legacy api_token message without a status', () => {
		const error = new WebscraperioAPIError('x', {
			body: { success: false, error: 'Unauthorized, invalid api_token.' },
		});
		expect(error.isAuthError).toBe(true);
	});

	it('recognises the Bearer token messages without a status', () => {
		for (const message of [
			'Unauthorized, invalid Bearer token.',
			'Unauthorized, Bearer token was not passed along with request.',
		]) {
			const error = new WebscraperioAPIError('x', {
				body: { success: false, error: message },
			});
			expect(error.isAuthError).toBe(true);
			expect(error.isInvalidToken).toBe(true);
		}
	});

	it('treats a 403 as auth too, since the token lacks access', () => {
		expect(new WebscraperioAPIError('x', { status: 403 }).isAuthError).toBe(
			true,
		);
	});

	it('tells a mistyped route from a missing sitemap', () => {
		const route = new WebscraperioAPIError('x', {
			status: 404,
			body: routeNotFound,
		});
		const missing = new WebscraperioAPIError('x', {
			status: 404,
			body: sitemapNotFound,
		});

		// The route 404 is a typo in the path; the other is a real absence.
		expect(route.isRouteNotFound).toBe(true);
		expect(route.isNotFound).toBe(false);

		expect(missing.isRouteNotFound).toBe(false);
		expect(missing.isNotFound).toBe(true);
	});

	it('is not an auth error for a validation failure', () => {
		const error = new WebscraperioAPIError('x', {
			status: 400,
			body: badRequest,
		});
		expect(error.isAuthError).toBe(false);
	});

	it('reads the status from a wrapped ApiError', () => {
		const cause = new ApiError(
			{ method: 'GET', url: '/api/v1/sitemaps' },
			{
				url: 'https://api.webscraper.io/api/v1/sitemaps',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: invalidToken,
			},
			'Unauthorized',
		);
		const error = new WebscraperioAPIError('wrapped', { cause });
		expect(error.status).toBe(401);
		expect(error.handled).toBe(true);
	});
});

describe('describeWebscraperioError', () => {
	it('reads the handled error field', () => {
		expect(describeWebscraperioError(401, invalidToken, 'fallback')).toBe(
			'Web Scraper Cloud 401: Unauthorized, invalid Bearer token.',
		);
	});

	it('reads the unrouted message field', () => {
		expect(describeWebscraperioError(404, routeNotFound, 'fallback')).toContain(
			'could not be found',
		);
	});

	it('falls back when the body is not an error shape', () => {
		expect(
			describeWebscraperioError(502, '<html>bad</html>', 'Bad gateway'),
		).toBe('Web Scraper Cloud 502: Bad gateway');
	});

	it('drops the label when there is no status', () => {
		expect(describeWebscraperioError(undefined, null, 'Network error')).toBe(
			'Network error',
		);
	});
});

describe('the exported constants', () => {
	it('is the documented v1 base', () => {
		expect(WEBSCRAPERIO_API_BASE).toBe('https://api.webscraper.io/api/v1');
	});
});

describe('isWebscraperioFailure', () => {
	it('narrows a thrown error', () => {
		expect(isWebscraperioFailure(new WebscraperioAPIError('x'))).toBe(true);
	});

	it('rejects anything else', () => {
		expect(isWebscraperioFailure(new Error('other'))).toBe(false);
		expect(isWebscraperioFailure(null)).toBe(false);
	});
});
