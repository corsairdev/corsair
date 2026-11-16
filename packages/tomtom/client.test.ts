import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import {
	describeTomTomError,
	makeTomTomRequest,
	point,
	TOMTOM_API_BASE,
	tomTomErrorCode,
} from './client';
import { badRequest, legacyError, unauthorized } from './test-fixtures';

const API_KEY = 'tt-live-test-key-1234567890';

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

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		url: String(url),
		path: parsed.pathname,
		params: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeTomTomRequest', () => {
	it('sends the key as the documented query parameter', async () => {
		respond({});

		await makeTomTomRequest(API_KEY, {
			method: 'GET',
			path: 'search/2/search/x.json',
		});

		const sent = lastRequest();
		expect(sent.url).toContain(`${TOMTOM_API_BASE}/search/2/search/x.json`);
		expect(sent.params.key).toBe(API_KEY);
		expect(sent.headers.get('authorization')).toBeNull();
	});

	it('keeps the route query alongside the key', async () => {
		respond({});

		await makeTomTomRequest(API_KEY, {
			method: 'GET',
			path: 'search/2/search/pizza.json',
			query: { limit: 5, countrySet: 'NL', ofs: 0 },
		});

		expect(lastRequest().params).toEqual({
			limit: '5',
			countrySet: 'NL',
			ofs: '0',
			key: API_KEY,
		});
	});

	it('lets core ApiError through with the detailedError envelope', async () => {
		respond(unauthorized, 401);

		const error = await makeTomTomRequest(API_KEY, {
			method: 'GET',
			path: 'search/2/search/x.json',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(401);
		expect(tomTomErrorCode((error as ApiError).body)).toBe('Unauthorized');
		expect(
			describeTomTomError(401, (error as ApiError).body, 'x').message,
		).toContain('You are missing valid authentication credentials');
	});

	it('reads the older { error: { description } } envelope too', async () => {
		respond(legacyError, 403);

		const error = await makeTomTomRequest(API_KEY, {
			method: 'GET',
			path: 'traffic/services/5/incidentDetails',
		}).catch((caught: unknown) => caught);

		expect((error as ApiError).status).toBe(403);
		expect(tomTomErrorCode((error as ApiError).body)).toBe('Forbidden');
		expect(
			describeTomTomError(403, (error as ApiError).body, 'x').message,
		).toContain('not authorized');
	});

	it('lets core retry a 429 three times, honouring Retry-After', async () => {
		jest.useFakeTimers();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond({ detailedError: { code: 'TooManyRequests' } }, 429, {
					'Retry-After': '9',
				});
			}

			const pending = makeTomTomRequest(API_KEY, {
				method: 'GET',
				path: 'search/2/search/x.json',
			}).catch((caught: unknown) => caught);
			await jest.advanceTimersByTimeAsync(8_500);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			await jest.advanceTimersByTimeAsync(30_000);
			const error = await pending;

			expect(fetchMock).toHaveBeenCalledTimes(4);
			expect((error as ApiError).status).toBe(429);
			expect((error as ApiError).retryAfter).toBe(9000);
		} finally {
			jest.useRealTimers();
		}
	});

	it('records the method', async () => {
		respond({}, 500);

		const error = await makeTomTomRequest(API_KEY, {
			method: 'GET',
			path: 'search/2/search/x.json',
		}).catch((caught: unknown) => caught);

		expect((error as ApiError).request.method).toBe('GET');
	});

	it('never puts the key in the message or its inspection', async () => {
		// `key` is one of the names core's ApiError redacts, and the error now
		// passes through unchanged, so that redaction has to hold.
		respond(badRequest, 400);

		const error = await makeTomTomRequest(API_KEY, {
			method: 'GET',
			path: 'search/2/search/x.json',
			query: { limit: 5 },
		}).catch((caught: unknown) => caught);

		for (const text of [
			(error as Error).message,
			inspect(error),
			JSON.stringify(error),
		]) {
			expect(text).not.toContain(API_KEY);
		}
	});
});

describe('describeTomTomError', () => {
	it('includes the status and the code', () => {
		expect(describeTomTomError(401, unauthorized, 'x')).toEqual({
			message:
				'TomTom 401 Unauthorized: You are missing valid authentication credentials',
			code: 'Unauthorized',
		});
	});

	it('handles the legacy envelope', () => {
		expect(describeTomTomError(403, legacyError, 'x')).toEqual({
			message:
				'TomTom 403 Forbidden: The API key is not authorized for this service',
			code: 'Forbidden',
		});
	});

	it('falls back for a non-JSON body', () => {
		expect(describeTomTomError(502, '<html>', 'Bad Gateway').message).toBe(
			'TomTom 502: Bad Gateway',
		);
		expect(describeTomTomError(undefined, null, 'offline').message).toBe(
			'offline',
		);
	});
});

describe('point', () => {
	it('joins latitude and longitude in that order', () => {
		expect(point(52.37, 4.89)).toBe('52.37,4.89');
		expect(point(-33.9, 151.2)).toBe('-33.9,151.2');
	});
});
