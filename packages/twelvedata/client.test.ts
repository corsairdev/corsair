import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import {
	assertOk,
	describeTwelveDataError,
	makeTwelveDataRequest,
	TWELVEDATA_API_BASE,
	TwelveDataAPIError,
} from './client';
import { badKey, planLimit, symbolNotFound } from './test-fixtures';

const KEY = 'td-live-key-1234567890';

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

describe('makeTwelveDataRequest', () => {
	it('sends the key in the Authorization header, never in the URL', async () => {
		respond({ price: '1' });

		await makeTwelveDataRequest(KEY, { method: 'GET', path: 'price' });

		const sent = lastRequest();
		expect(sent.url).toContain(`${TWELVEDATA_API_BASE}/price`);
		expect(sent.headers.get('Authorization')).toBe(`apikey ${KEY}`);
		expect(sent.url).not.toContain(KEY);
	});

	it('keeps the route parameters alongside the key', async () => {
		respond({});

		await makeTwelveDataRequest(KEY, {
			method: 'GET',
			path: 'time_series',
			query: { symbol: 'AAPL', interval: '1day', outputsize: 30 },
		});

		expect(lastRequest().params).toEqual({
			symbol: 'AAPL',
			interval: '1day',
			outputsize: '30',
		});
	});

	it('reads the 401 error body', async () => {
		respond(badKey, 401);

		const error = await makeTwelveDataRequest(KEY, {
			method: 'GET',
			path: 'quote',
		}).catch((caught: unknown) => caught);

		// Core's ApiError comes through unchanged, with the provider's body.
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(401);
		expect((error as ApiError).body).toEqual(badKey);
	});

	it('recognises a 403 as a plan limit', async () => {
		respond(planLimit, 403);

		const error = await makeTwelveDataRequest(KEY, {
			method: 'GET',
			path: 'earnings',
		}).catch((caught: unknown) => caught);

		expect((error as ApiError).status).toBe(403);
	});

	it('keeps Retry-After so the rate-limit handler can honour it', async () => {
		respond({ code: 429, message: 'too many' }, 429, { 'Retry-After': '6' });

		const error = await makeTwelveDataRequest(KEY, {
			method: 'GET',
			path: 'quote',
		}).catch((caught: unknown) => caught);

		expect((error as ApiError).retryAfter).toBe(6000);
		expect((error as ApiError).status).toBe(429);
	});

	it('records the method', async () => {
		respond({}, 500);

		const error = await makeTwelveDataRequest(KEY, {
			method: 'GET',
			path: 'quote',
		}).catch((caught: unknown) => caught);

		expect((error as ApiError).request.method).toBe('GET');
	});

	it('never puts the key in the message or its inspection', async () => {
		respond(badKey, 401);

		const error = await makeTwelveDataRequest(KEY, {
			method: 'GET',
			path: 'quote',
			query: { symbol: 'AAPL' },
		}).catch((caught: unknown) => caught);

		for (const text of [
			(error as Error).message,
			inspect(error),
			JSON.stringify(error),
		]) {
			expect(text).not.toContain(KEY);
		}
	});
});

describe('describeTwelveDataError', () => {
	it('includes the status and the provider code', () => {
		expect(describeTwelveDataError(401, badKey, 'x')).toEqual({
			message: expect.stringContaining('Twelve Data 401 code 401'),
			code: 401,
		});
	});

	it('reads a body with no code', () => {
		expect(describeTwelveDataError(500, { message: 'boom' }, 'x')).toEqual({
			message: 'Twelve Data 500: boom',
			code: undefined,
		});
	});

	it('falls back for a non-JSON body', () => {
		expect(describeTwelveDataError(502, '<html>', 'Bad Gateway').message).toBe(
			'Twelve Data 502: Bad Gateway',
		);
		expect(describeTwelveDataError(undefined, null, 'offline').message).toBe(
			'offline',
		);
	});
});

describe('assertOk', () => {
	it('throws on a 200 body that says error', () => {
		expect(() => assertOk(symbolNotFound, 'quote')).toThrow(TwelveDataAPIError);
	});

	it('names the operation in the message', () => {
		try {
			assertOk(symbolNotFound, 'market.quote');
		} catch (error) {
			expect((error as Error).message).toContain('market.quote');
			expect((error as Error).message).toContain('symbol');
		}
	});

	it('keeps the provider code on the thrown error', () => {
		try {
			assertOk(symbolNotFound, 'quote');
		} catch (error) {
			expect((error as TwelveDataAPIError).code).toBe(400);
			expect((error as TwelveDataAPIError).status).toBe(400);
		}
	});

	it('passes a body with status ok', () => {
		expect(() =>
			assertOk({ status: 'ok', values: [] }, 'timeSeries'),
		).not.toThrow();
	});

	it('passes a body with no status at all', () => {
		// A reference list and a price answer carry no status field.
		expect(() => assertOk({ data: [] }, 'stocks')).not.toThrow();
		expect(() => assertOk({ price: '1' }, 'price')).not.toThrow();
	});

	it('passes a non-object body', () => {
		expect(() => assertOk(null, 'price')).not.toThrow();
		expect(() => assertOk('<html>', 'price')).not.toThrow();
	});
});
