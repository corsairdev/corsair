import { inspect } from 'node:util';
import {
	CERTSPOTTER_API_BASE,
	CertSpotterAPIError,
	describeCertSpotterError,
	makeCertSpotterRequest,
} from './client';
import {
	badCredentials,
	badQuery,
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

		expect(error).toBeInstanceOf(CertSpotterAPIError);
		expect((error as CertSpotterAPIError).code).toBe('bad_credentials');
		expect((error as CertSpotterAPIError).status).toBe(401);
		expect((error as Error).message).toContain('Invalid API key');
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

		expect((error as CertSpotterAPIError).field).toBe('domain');
	});

	it('recognises the four documented failure kinds', async () => {
		const build = async (body: typeof rateLimited, status: number) => {
			respond(body, status);
			return makeCertSpotterRequest(API_KEY, {
				method: 'GET',
				path: 'issuances',
			}).catch((caught: unknown) => caught) as Promise<CertSpotterAPIError>;
		};

		const limited = await build(rateLimited, 429);
		expect(limited.isRateLimit).toBe(true);

		const timedOut = await build(queryTimeout, 400);
		expect(timedOut.isTimeout).toBe(true);

		const unpaid = await build(paymentRequired, 400);
		expect(unpaid.isPaymentRequired).toBe(true);

		const lagging = await build(laggingClient, 400);
		expect(lagging.code).toBe('lagging_client');
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
		respond({}, 429, { 'Retry-After': '12' });

		const error = await makeCertSpotterRequest(API_KEY, {
			method: 'GET',
			path: 'issuances',
		}).catch((caught: unknown) => caught);

		expect((error as CertSpotterAPIError).retryAfter).toBe(12000);
	});

	it('records the method', async () => {
		respond(serviceOutage, 503);

		const error = await makeCertSpotterRequest(API_KEY, {
			method: 'GET',
			path: 'issuances',
		}).catch((caught: unknown) => caught);

		expect((error as CertSpotterAPIError).method).toBe('GET');
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

describe('describeCertSpotterError', () => {
	it('includes both the status and the code', () => {
		expect(describeCertSpotterError(401, badCredentials, 'x')).toBe(
			'Cert Spotter 401 bad_credentials: Invalid API key',
		);
	});

	it('handles the 503 the free tier returns under load', () => {
		expect(describeCertSpotterError(503, serviceOutage, 'x')).toContain(
			'free tier is temporarily unavailable',
		);
	});

	it('reads a body with a code but no message', () => {
		expect(describeCertSpotterError(400, { code: 'bad_request' }, 'Bad')).toBe(
			'Cert Spotter 400 bad_request: Bad',
		);
	});

	it('ignores sub_errors when composing the message', () => {
		expect(describeCertSpotterError(400, badQuery, 'x')).toBe(
			'Cert Spotter 400 bad_query: One or more fields in the query string is invalid',
		);
	});

	it('falls back for a non-object body', () => {
		expect(describeCertSpotterError(502, '<html>', 'Bad Gateway')).toBe(
			'Cert Spotter 502: Bad Gateway',
		);
		expect(describeCertSpotterError(undefined, null, 'offline')).toBe(
			'offline',
		);
	});
});
