import {
	errorMessage,
	makeScrapeDoRequest,
	parseJsonBody,
	SCRAPEDO_API_BASE,
	SCRAPEDO_ASYNC_BASE,
	ScrapeDoAPIError,
} from './client';
import {
	ASYNC_AUTH_ERROR_BODY,
	INACTIVE_TOKEN_BODY,
	INFO_RATE_LIMIT_BODY,
	MISSING_TOKEN_BODY,
	SCREENSHOT_NEEDS_JSON_BODY,
	TARGET_REJECTION_BODY,
} from './test-fixtures';
import {
	installFetchMock,
	rejectNextFetch,
	respond,
	restoreFetchMock,
	sentHeaders,
	sentQuery,
	sentUrl,
} from './test-helpers';

const TOKEN = 'sd-test-token';

/** The rejection as a ScrapeDoAPIError, so each test can assert on it. */
async function failure(
	promise: Promise<{ body: string; status: number }>,
): Promise<ScrapeDoAPIError> {
	// unknown: a rejection can carry any value, not just an Error, so this
	// catches it untyped and asserts on the class below.
	const error: unknown = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(ScrapeDoAPIError);
	if (!(error instanceof ScrapeDoAPIError)) {
		throw new Error('expected a ScrapeDoAPIError');
	}
	return error;
}

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('the scrape surface', () => {
	it('sends the token in the query, which is how this surface authenticates', async () => {
		respond('<html></html>');

		await makeScrapeDoRequest(TOKEN, {
			kind: 'scrape',
			method: 'GET',
			path: '/',
			query: { url: 'https://example.com/' },
		});

		expect(sentUrl().origin + sentUrl().pathname).toBe(`${SCRAPEDO_API_BASE}/`);
		expect(sentQuery().get('token')).toBe(TOKEN);
		expect(sentQuery().get('url')).toBe('https://example.com/');
		// The scrape surface does not use the header.
		expect(sentHeaders().has('X-Token')).toBe(false);
	});

	it('returns the page and its target status', async () => {
		respond('<html>page</html>', 200);

		const answer = await makeScrapeDoRequest(TOKEN, {
			kind: 'scrape',
			method: 'GET',
			path: '/',
			query: { url: 'https://example.com/' },
		});

		expect(answer.body).toBe('<html>page</html>');
		expect(answer.status).toBe(200);
		expect(answer.contentType).toContain('text/html');
	});

	it('returns a target 404 rather than throwing, because it costs a credit', async () => {
		respond('<html>not found page</html>', 404);

		const answer = await makeScrapeDoRequest(TOKEN, {
			kind: 'scrape',
			method: 'GET',
			path: '/',
			query: { url: 'https://example.com/missing' },
		});

		expect(answer.status).toBe(404);
		expect(answer.body).toBe('<html>not found page</html>');
	});

	it('returns a target 410 too, which the docs bill the same way', async () => {
		respond('<html>gone</html>', 410);

		const answer = await makeScrapeDoRequest(TOKEN, {
			kind: 'scrape',
			method: 'GET',
			path: '/',
			query: { url: 'https://example.com/gone' },
		});

		expect(answer.status).toBe(410);
	});

	it('throws a 401 with the provider message', async () => {
		respond(INACTIVE_TOKEN_BODY, 401);

		const error = await failure(
			makeScrapeDoRequest(TOKEN, {
				kind: 'scrape',
				method: 'GET',
				path: '/',
				query: { url: 'https://example.com/' },
			}),
		);

		expect(error.status).toBe(401);
		expect(error.isAuthError).toBe(true);
		expect(error.detail).toContain('inactive or incorrect');
	});

	it('reads a target 400 with an empty body as the target refusing', async () => {
		// Captured live: a target answering 400 comes back as status 400 with no
		// body at all, unlike Scrape.do's own errors.
		respond('', 400);

		const answer = await makeScrapeDoRequest(TOKEN, {
			kind: 'scrape',
			method: 'GET',
			path: '/',
			query: { url: 'https://example.com/' },
		});

		// It is the target's answer, so the page and status come back as a result.
		expect(answer.status).toBe(400);
		expect(answer.body).toBe('');
	});

	it("throws a 400 that carries Scrape.do's envelope, meaning it refused the request", async () => {
		respond(TARGET_REJECTION_BODY, 400);

		const error = await failure(
			makeScrapeDoRequest(TOKEN, {
				kind: 'scrape',
				method: 'GET',
				path: '/',
				query: { url: 'https://example.com/' },
			}),
		);

		// PossibleCauses is present on Scrape.do's refusals too, so it is the
		// envelope that marks a refusal, not that field.
		expect(error.status).toBe(400);
		expect(error.isTargetRejection).toBe(false);
		expect(error.detail).toContain('The target website returned a bad request');
	});

	it('passes a target 403 through in transparent mode instead of losing the body', async () => {
		respond('<html>target said no</html>', 403);

		const answer = await makeScrapeDoRequest(TOKEN, {
			kind: 'scrape',
			method: 'GET',
			path: '/',
			query: { url: 'https://example.com/', transparentResponse: true },
		});

		// The target's page is what transparentResponse promises; throwing here
		// would discard a response the caller asked for and was billed for.
		expect(answer.status).toBe(403);
		expect(answer.body).toBe('<html>target said no</html>');
	});

	it('passes a target 500 through, with the status on the result so it is not retried blindly', async () => {
		respond('<html>target broke</html>', 500);

		const answer = await makeScrapeDoRequest(TOKEN, {
			kind: 'scrape',
			method: 'GET',
			path: '/',
			query: { url: 'https://example.com/', transparentResponse: true },
		});

		expect(answer.status).toBe(500);
		expect(answer.body).toBe('<html>target broke</html>');
	});

	it("still throws Scrape.do's own 502, which is not a target page", async () => {
		respond({ Message: ['Request has failed. Please try again'] }, 502);

		const error = await failure(
			makeScrapeDoRequest(TOKEN, {
				kind: 'scrape',
				method: 'GET',
				path: '/',
				query: { url: 'https://example.com/', transparentResponse: true },
			}),
		);

		// 502 is the proxy's own failure and is documented as retryable, so it
		// must never be mistaken for a target page even in transparent mode.
		expect(error.status).toBe(502);
		expect(error.isRetryableServerError).toBe(true);
	});

	it('joins the Message array of a missing-token 400', async () => {
		respond(MISSING_TOKEN_BODY, 400);

		const error = await failure(
			makeScrapeDoRequest(TOKEN, {
				kind: 'scrape',
				method: 'GET',
				path: '/',
				query: { url: 'https://example.com/' },
			}),
		);

		expect(error.detail).toContain("'Token' is required!");
	});

	it('surfaces the screenshot dependency error', async () => {
		respond(SCREENSHOT_NEEDS_JSON_BODY, 400);

		const error = await failure(
			makeScrapeDoRequest(TOKEN, {
				kind: 'scrape',
				method: 'GET',
				path: '/',
				query: { url: 'https://example.com/' },
			}),
		);

		expect(error.detail).toContain('cannot be used without');
	});
});

describe('the async surface', () => {
	it('sends the token as X-Token to the async host, never in the query', async () => {
		respond({ Jobs: [], TotalCount: 0 });

		await makeScrapeDoRequest(TOKEN, {
			kind: 'async',
			method: 'GET',
			path: '/jobs',
		});

		expect(sentUrl().origin).toBe('https://q.scrape.do');
		expect(sentUrl().pathname).toBe('/api/v1/jobs');
		expect(sentHeaders().get('X-Token')).toBe(TOKEN);
		expect(sentQuery().has('token')).toBe(false);
	});

	it('reads the async { Error, Code } envelope', async () => {
		respond(ASYNC_AUTH_ERROR_BODY, 401);

		const error = await failure(
			makeScrapeDoRequest(TOKEN, {
				kind: 'async',
				method: 'GET',
				path: '/me',
			}),
		);

		expect(error.status).toBe(401);
		expect(error.isAuthError).toBe(true);
		expect(error.detail).toContain('Invalid token');
	});

	it('sends a JSON body with the content type', async () => {
		respond({ JobID: 'x', TaskIDs: [] });

		await makeScrapeDoRequest(TOKEN, {
			kind: 'async',
			method: 'POST',
			path: '/jobs',
			body: { Targets: ['https://example.com'] },
		});

		expect(sentHeaders().get('Content-Type')).toBe('application/json');
	});

	it('uses the async base', async () => {
		expect(SCRAPEDO_ASYNC_BASE).toBe('https://q.scrape.do/api/v1');
	});
});

describe('the info surface', () => {
	it('authenticates with the query token', async () => {
		respond({ IsActive: true });

		await makeScrapeDoRequest(TOKEN, {
			kind: 'info',
			method: 'GET',
			path: '/info',
		});

		expect(sentUrl().pathname).toBe('/info');
		expect(sentQuery().get('token')).toBe(TOKEN);
	});

	it('reads the lowercase message of the /info rate limit', async () => {
		respond(INFO_RATE_LIMIT_BODY, 429);

		const error = await failure(
			makeScrapeDoRequest(TOKEN, {
				kind: 'info',
				method: 'GET',
				path: '/info',
			}),
		);

		expect(error.status).toBe(429);
		expect(error.isConcurrencyLimit).toBe(true);
		// `/info` uses `message`, the scrape API uses `Message`: one client reads both.
		expect(error.detail).toContain('10 requests per minute');
	});
});

describe('errors shared by every surface', () => {
	it('flags a transport failure and whether it is replayable', async () => {
		rejectNextFetch(new TypeError('fetch failed'));

		const error = await failure(
			makeScrapeDoRequest(TOKEN, {
				kind: 'scrape',
				method: 'GET',
				path: '/',
				query: { url: 'https://example.com/' },
			}),
		);

		expect(error.isTransport).toBe(true);
		expect(error.isTimeout).toBe(false);
		expect(error.isReplayable).toBe(true);
	});

	it('does not treat a forwarded POST as replayable', async () => {
		rejectNextFetch(new TypeError('fetch failed'));

		const error = await failure(
			makeScrapeDoRequest(TOKEN, {
				kind: 'scrape',
				method: 'POST',
				path: '/',
				query: { url: 'https://example.com/api' },
				body: { write: true },
			}),
		);

		// A POST is forwarded to the target, so it may have been applied.
		expect(error.isReplayable).toBe(false);
	});

	it('flags the client deadline as a timeout', async () => {
		const timeout = new Error('The operation timed out.');
		timeout.name = 'TimeoutError';
		rejectNextFetch(timeout);

		const error = await failure(
			makeScrapeDoRequest(TOKEN, {
				kind: 'scrape',
				method: 'GET',
				path: '/',
				query: { url: 'https://example.com/' },
			}),
		);

		expect(error.isTimeout).toBe(true);
	});

	it('treats 502 as retryable, which the docs ask for', async () => {
		respond({ Message: ['Request has failed. Please try again'] }, 502);

		const error = await failure(
			makeScrapeDoRequest(TOKEN, {
				kind: 'scrape',
				method: 'GET',
				path: '/',
				query: { url: 'https://example.com/' },
			}),
		);

		expect(error.isRetryableServerError).toBe(true);
	});

	it('flags 510 as the caller cancelling', async () => {
		respond({ Message: ['canceled'] }, 510);

		const error = await failure(
			makeScrapeDoRequest(TOKEN, {
				kind: 'scrape',
				method: 'GET',
				path: '/',
				query: { url: 'https://example.com/' },
			}),
		);

		expect(error.isClientCancelled).toBe(true);
	});

	it('carries Retry-After through as milliseconds', async () => {
		respond({ Message: ['slow down'] }, 429, { 'Retry-After': '3' });

		const error = await failure(
			makeScrapeDoRequest(TOKEN, {
				kind: 'scrape',
				method: 'GET',
				path: '/',
				query: { url: 'https://example.com/' },
			}),
		);

		expect(error.retryAfter).toBe(3000);
	});

	it('keeps the token out of the error', async () => {
		respond(INACTIVE_TOKEN_BODY, 401);

		const error = await failure(
			makeScrapeDoRequest(TOKEN, {
				kind: 'scrape',
				method: 'GET',
				path: '/',
				query: { url: 'https://example.com/' },
			}),
		);

		// The token is in the query, and nothing in the error carries the URL.
		expect(JSON.stringify(error)).not.toContain(TOKEN);
		expect(error.message).not.toContain(TOKEN);
		expect(error.cause).toBeUndefined();
	});
});

describe('errorMessage', () => {
	it('reads the scrape Message array', () => {
		expect(errorMessage({ Message: ['a', 'b'] })).toBe('a; b');
	});

	it('reads the lowercase message', () => {
		expect(errorMessage({ message: 'slow down' })).toBe('slow down');
	});

	it('reads the async Error field', () => {
		expect(errorMessage({ Error: 'bad token' })).toBe('bad token');
	});

	it('returns undefined for a body with no message', () => {
		expect(errorMessage({ other: 1 })).toBeUndefined();
		expect(errorMessage('not an object')).toBeUndefined();
	});
});

describe('parseJsonBody', () => {
	it('parses JSON', () => {
		expect(parseJsonBody('{"a":1}')).toEqual({ a: 1 });
	});

	it('throws on a non-JSON body rather than returning it', () => {
		expect(() => parseJsonBody('<html>oops</html>')).toThrow(ScrapeDoAPIError);
	});
});
