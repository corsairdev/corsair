import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import {
	describeSpotlightrError,
	isAuthMessage,
	makeSpotlightrRequest,
	SPOTLIGHTR_API_BASE,
	SpotlightrAPIError,
} from './client';
import { htmlError, missingToken, unauthorized } from './test-fixtures';

const API_KEY = 'sl-test-key';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

function respondHtml(body: string, status = 500) {
	fetchMock.mockResolvedValueOnce(
		new Response(body, { status, headers: { 'Content-Type': 'text/html' } }),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		url: String(url),
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: a string body, JSON body or multipart form.
		body: init.body,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeSpotlightrRequest', () => {
	it('sends the key as the vooKey query parameter', async () => {
		respond([]);

		await makeSpotlightrRequest(API_KEY, { method: 'GET', path: 'groups' });

		const sent = lastRequest();
		expect(sent.url).toContain(`${SPOTLIGHTR_API_BASE}/groups`);
		expect(sent.query.vooKey).toBe(API_KEY);
		// Spotlightr reads the key from the query only; a header is ignored.
		expect(sent.headers.get('authorization')).toBeNull();
	});

	it('adds the key to a request that already has a query', async () => {
		respond(videoMetricsBody());

		await makeSpotlightrRequest(API_KEY, {
			method: 'GET',
			path: 'api/video/metrics',
			query: { videoID: 'abc' },
		});

		expect(lastRequest().query).toEqual({ videoID: 'abc', vooKey: API_KEY });
	});

	it('sends a multipart body without a JSON content type', async () => {
		respond('ok');

		await makeSpotlightrRequest(API_KEY, {
			method: 'POST',
			path: 'api/createVideo',
			formData: { name: 'Product tour', URL: 'https://youtu.be/x' },
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.body).toBeInstanceOf(FormData);
		expect((sent.body as FormData).get('name')).toBe('Product tour');
		expect((sent.body as FormData).get('URL')).toBe('https://youtu.be/x');
	});

	it('sends a JSON body for the routes that take one', async () => {
		respond({ ok: true });

		await makeSpotlightrRequest(API_KEY, {
			method: 'POST',
			path: 'video/updateSettings',
			body: { id: 'abc', settings: { autoplay: true } },
		});

		const sent = lastRequest();
		expect(sent.headers.get('content-type')).toBe('application/json');
		expect(JSON.parse(String(sent.body))).toEqual({
			id: 'abc',
			settings: { autoplay: true },
		});
	});

	it('lets core ApiError through on a 401, with the bare-string message', async () => {
		respond(unauthorized, 401);

		const error = await makeSpotlightrRequest(API_KEY, {
			method: 'GET',
			path: 'api/videos',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(401);
		// The body is the JSON string `"Unauthorized."`, so the quotes are gone.
		expect((error as ApiError).message).toBe('Spotlightr 401: Unauthorized.');
	});

	it('keeps the missing-token text distinct from a wrong key', async () => {
		respond(missingToken, 401);

		const error = await makeSpotlightrRequest(API_KEY, {
			method: 'GET',
			path: 'groups',
		}).catch((caught: unknown) => caught);

		expect((error as Error).message).toContain('Missing token');
	});

	it('reads an HTML 500 page without inventing a message', async () => {
		respondHtml(htmlError, 500);

		const error = await makeSpotlightrRequest(API_KEY, {
			method: 'GET',
			path: 'groups',
		}).catch((caught: unknown) => caught);

		expect((error as ApiError).status).toBe(500);
		expect((error as Error).message).toContain('Spotlightr 500');
		// The HTML page says nothing a caller can use, so it stays out.
		expect((error as Error).message).not.toContain('<html>');
	});

	it('keeps Retry-After so the rate-limit handler can honour it', async () => {
		respond({}, 429, { 'Retry-After': '3' });

		const error = await makeSpotlightrRequest(API_KEY, {
			method: 'GET',
			path: 'api/videos',
		}).catch((caught: unknown) => caught);

		expect((error as ApiError).retryAfter).toBe(3000);
		expect((error as ApiError).status).toBe(429);
	});

	it('records the method so writes are not replayed on a 5xx', async () => {
		respond({}, 500);

		const error = await makeSpotlightrRequest(API_KEY, {
			method: 'POST',
			path: 'api/createVideo',
			formData: { name: 'x' },
		}).catch((caught: unknown) => caught);

		expect((error as ApiError).request.method).toBe('POST');
	});

	it('never puts the key in the message or its inspection', async () => {
		// The key travels in the query string, which ApiError does not redact,
		// so the rebuilt ApiError masks it in url, request.url and request.query.
		respond(unauthorized, 401);

		const error = await makeSpotlightrRequest(API_KEY, {
			method: 'GET',
			path: 'api/videos',
			query: { videoID: 'abc' },
		}).catch((caught: unknown) => caught);

		for (const text of [
			(error as Error).message,
			inspect(error),
			JSON.stringify(error),
			String((error as Error).stack ?? ''),
		]) {
			expect(text).not.toContain(API_KEY);
		}
	});

	it('drops the cause so the query cannot leak through it', () => {
		const error = new SpotlightrAPIError('Spotlightr 401: Unauthorized.', {
			status: 401,
		});
		expect(inspect(error)).not.toContain('vooKey');
		expect((error as { cause?: unknown }).cause).toBeUndefined();
	});
});

describe('describeSpotlightrError', () => {
	it('unquotes a JSON string body', () => {
		expect(describeSpotlightrError(401, 'Unauthorized.', 'x')).toBe(
			'Spotlightr 401: Unauthorized.',
		);
	});

	it('reads a message field when the body is an object', () => {
		expect(describeSpotlightrError(400, { message: 'bad id' }, 'x')).toBe(
			'Spotlightr 400: bad id',
		);
	});

	it('falls back when there is no usable body', () => {
		expect(describeSpotlightrError(500, '', 'Server Error')).toBe(
			'Spotlightr 500: Server Error',
		);
		expect(describeSpotlightrError(undefined, null, 'offline')).toBe('offline');
	});
});

describe('isAuthMessage', () => {
	it.each(['Unauthorized.', 'Missing token.', 'invalid token supplied'])(
		'recognises %s',
		(message) => {
			expect(isAuthMessage(message)).toBe(true);
		},
	);

	it('does not match an unrelated message', () => {
		expect(isAuthMessage('Project not found')).toBe(false);
	});
});

/** The real metrics shape, reused by the query test above. */
function videoMetricsBody() {
	return {
		loads: 16,
		watched: 0,
		plays: 0,
		playRate: 0,
		completitionRate: 0,
		shares: 0,
	};
}
