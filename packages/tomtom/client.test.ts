import { inspect } from 'node:util';
import {
	describeTomTomError,
	makeTomTomRequest,
	point,
	TOMTOM_API_BASE,
	TomTomAPIError,
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

	it('reads the detailedError envelope', async () => {
		respond(unauthorized, 401);

		const error = await makeTomTomRequest(API_KEY, {
			method: 'GET',
			path: 'search/2/search/x.json',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(TomTomAPIError);
		expect((error as TomTomAPIError).status).toBe(401);
		expect((error as TomTomAPIError).code).toBe('Unauthorized');
		expect((error as Error).message).toContain(
			'You are missing valid authentication credentials',
		);
	});

	it('reads the older { error: { description } } envelope too', async () => {
		respond(legacyError, 403);

		const error = await makeTomTomRequest(API_KEY, {
			method: 'GET',
			path: 'traffic/services/5/incidentDetails',
		}).catch((caught: unknown) => caught);

		expect((error as TomTomAPIError).code).toBe('Forbidden');
		expect((error as TomTomAPIError).isPermission).toBe(true);
		expect((error as Error).message).toContain('not authorized');
	});

	it('keeps Retry-After so the rate-limit handler can honour it', async () => {
		respond({ detailedError: { code: 'TooManyRequests' } }, 429, {
			'Retry-After': '9',
		});

		const error = await makeTomTomRequest(API_KEY, {
			method: 'GET',
			path: 'search/2/search/x.json',
		}).catch((caught: unknown) => caught);

		expect((error as TomTomAPIError).retryAfter).toBe(9000);
		expect((error as TomTomAPIError).isRateLimit).toBe(true);
	});

	it('records the method', async () => {
		respond({}, 500);

		const error = await makeTomTomRequest(API_KEY, {
			method: 'GET',
			path: 'search/2/search/x.json',
		}).catch((caught: unknown) => caught);

		expect((error as TomTomAPIError).method).toBe('GET');
	});

	it('never puts the key in the message or its inspection', async () => {
		// `key` is one of the four names ApiError redacts, and this plugin keeps
		// the cause, so the redaction has to hold.
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
