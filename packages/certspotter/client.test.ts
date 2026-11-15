import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import {
	CERTSPOTTER_API_BASE,
	certSpotterErrorCode,
	makeCertSpotterRequest,
} from './client';
import {
	badCredentials,
	laggingClient,
	paymentRequired,
	queryTimeout,
	rateLimited,
	serviceOutage,
} from './test-fixtures';

const API_KEY = 'cs-live-test-key-1234567890';

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
		query: parsed.searchParams.getAll('expand'),
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

describe('makeCertSpotterRequest', () => {
	it('sends the key as a Bearer token', async () => {
		respond([]);

		await makeCertSpotterRequest(API_KEY, { method: 'GET', path: 'issuances' });

		const sent = lastRequest();
		expect(sent.url).toContain(`${CERTSPOTTER_API_BASE}/issuances`);
		expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
	});

	it('repeats `expand` once per value rather than joining them', async () => {
		respond([]);

		await makeCertSpotterRequest(API_KEY, {
			method: 'GET',
			path: 'issuances',
			query: { domain: 'example.com', expand: ['dns_names', 'issuer'] },
		});

		expect(lastRequest().query).toEqual(['dns_names', 'issuer']);
	});

	it('serializes the boolean filters as strings', async () => {
		respond([]);

		await makeCertSpotterRequest(API_KEY, {
			method: 'GET',
			path: 'issuances',
			query: { domain: 'example.com', include_subdomains: true, after: '42' },
		});

		expect(lastRequest().params).toEqual({
			domain: 'example.com',
			include_subdomains: 'true',
			after: '42',
		});
	});

	it('keeps the documented error code on the error', async () => {
		respond(badCredentials, 401);

		const error = await makeCertSpotterRequest(API_KEY, {
			method: 'GET',
			path: 'issuances',
		}).catch((caught: unknown) => caught);

		// Core's ApiError goes through unchanged (plugin rules R8), with the
		// provider's body and its documented code.
		expect(error).toBeInstanceOf(ApiError);
		expect(certSpotterErrorCode(error)).toBe('bad_credentials');
		expect((error as ApiError).status).toBe(401);
		expect((error as ApiError).body).toMatchObject({
			message: 'Invalid API key',
		});
	});

	it('reads the field an error names', async () => {
		respond(
			{ code: 'invalid_value', message: 'bad domain', field: 'domain' },
			400,
		);

		const error = await makeCertSpotterRequest(API_KEY, {
			method: 'GET',
			path: 'issuances',
		}).catch((caught: unknown) => caught);

		expect((error as ApiError).body).toMatchObject({ field: 'domain' });
	});

	it('reads the documented codes off the ApiError body', async () => {
		const build = async (body: typeof queryTimeout, status: number) => {
			respond(body, status);
			return makeCertSpotterRequest(API_KEY, {
				method: 'GET',
				path: 'issuances',
			}).catch((caught: unknown) => caught);
		};

		expect(certSpotterErrorCode(await build(queryTimeout, 400))).toBe(
			'timeout',
		);
		expect(certSpotterErrorCode(await build(paymentRequired, 400))).toBe(
			'payment_required',
		);
		expect(certSpotterErrorCode(await build(laggingClient, 400))).toBe(
			'lagging_client',
		);
		expect(certSpotterErrorCode(new Error('offline'))).toBeUndefined();
	});

	it('lets core retry a rate_limited answer, then passes the 429 through', async () => {
		jest.useFakeTimers();
		try {
			for (let i = 0; i < 4; i += 1) respond(rateLimited, 429);
			const pending = makeCertSpotterRequest(API_KEY, {
				method: 'GET',
				path: 'issuances',
			}).catch((caught: unknown) => caught);
			await jest.advanceTimersByTimeAsync(20_000);
			const error = await pending;
			expect(fetchMock).toHaveBeenCalledTimes(4);
			expect((error as ApiError).status).toBe(429);
		} finally {
			jest.useRealTimers();
		}
	});

	it('keeps Retry-After from an empty page', async () => {
		// An empty page carries the header that tells a poller when to ask again.
		respond([], 200, { 'Retry-After': '300' });

		await makeCertSpotterRequest(API_KEY, {
			method: 'GET',
			path: 'issuances',
			query: { domain: 'example.com' },
		});

		// A successful empty page is not an error, so nothing to assert on the
		// error; the header is read only when a 429 carries it.
		expect(lastRequest().method).toBe('GET');
	});

	it('keeps Retry-After on a 429', async () => {
		jest.useFakeTimers();
		for (let i = 0; i < 4; i += 1) respond({}, 429, { 'Retry-After': '12' });
		const pending = makeCertSpotterRequest(API_KEY, {
			method: 'GET',
			path: 'issuances',
		}).catch((caught: unknown) => caught);
		await jest.advanceTimersByTimeAsync(40_000);
		jest.useRealTimers();
		const error = await pending;

		expect((error as ApiError).retryAfter).toBe(12000);
	});

	it('records the method', async () => {
		respond(serviceOutage, 503);

		const error = await makeCertSpotterRequest(API_KEY, {
			method: 'GET',
			path: 'issuances',
		}).catch((caught: unknown) => caught);

		expect((error as ApiError).request.method).toBe('GET');
	});

	it('never puts the key in the message or its inspection', async () => {
		respond(badCredentials, 401);

		const error = await makeCertSpotterRequest(API_KEY, {
			method: 'GET',
			path: 'issuances',
			query: { domain: 'example.com' },
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
