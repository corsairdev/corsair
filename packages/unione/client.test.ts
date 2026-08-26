import { makeUnioneRequest, UNIONE_API_BASE, UnioneAPIError } from './client';
import { errorHandlers } from './error-handlers';

type Captured = {
	url: string;
	method: string;
	body?: string;
	headers?: Headers;
};

let captured: Captured | undefined;
const originalFetch = global.fetch;

function mockFetch(response: {
	ok?: boolean;
	status?: number;
	statusText?: string;
	body?: unknown;
	headers?: Record<string, string>;
}) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			body: init?.body as string | undefined,
			headers: new Headers(init?.headers),
		};
		const status = response.status ?? 200;
		const headers = new Headers();
		const rawHeaders = response.headers ?? {
			'Content-Type': 'application/json',
		};
		for (const [key, value] of Object.entries(rawHeaders)) {
			headers.set(key, value);
		}
		const payload = response.body ?? {};
		return {
			ok: response.ok ?? status < 400,
			status,
			statusText: response.statusText ?? 'OK',
			url: String(url),
			headers,
			json: async () => payload,
			text: async () =>
				typeof payload === 'string' ? payload : JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

describe('makeUnioneRequest', () => {
	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('POSTs JSON to the UniOne v1 base URL', async () => {
		mockFetch({ body: { status: 'success' } });
		await makeUnioneRequest('email/send.json', 'test-key', {
			body: { message: { subject: 'Hi' } },
		});
		expect(captured?.method).toBe('POST');
		expect(captured?.url.startsWith(`${UNIONE_API_BASE}/email/send.json`)).toBe(
			true,
		);
		expect(captured?.body).toContain('"subject":"Hi"');
	});

	it('sends the API key only in X-API-KEY', async () => {
		mockFetch({ body: { status: 'success' } });
		await makeUnioneRequest('system/info.json', 'secret-key', { body: {} });
		expect(captured?.headers?.get('X-API-KEY')).toBe('secret-key');
		// UniOne documents no bearer scheme, so the key must not be duplicated
		// onto Authorization, where it would be sent but never used.
		expect(captured?.headers?.get('Authorization')).toBeNull();
	});

	it('omits undefined body fields', async () => {
		mockFetch({ body: { status: 'success' } });
		await makeUnioneRequest('event-dump/create.json', 'k', {
			body: { start_time: '2024-01-01 00:00:00', end_time: undefined },
		});
		expect(captured?.body).toContain('start_time');
		expect(captured?.body).not.toContain('end_time');
	});

	it('wraps HTTP errors as UnioneAPIError', async () => {
		mockFetch({
			ok: false,
			status: 401,
			statusText: 'Unauthorized',
			body: { status: 'error', message: 'Your API key is wrong.', code: 1 },
		});
		await expect(
			makeUnioneRequest('system/info.json', 'bad', { body: {} }),
		).rejects.toBeInstanceOf(UnioneAPIError);
	});
});

describe('errorHandlers', () => {
	it('matches 429 as rate limit', async () => {
		const error = new UnioneAPIError('Too Many Requests', 429);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.maxRetries).toBe(5);
	});

	it('matches 401 as auth error with no retries', async () => {
		const error = new UnioneAPIError('unauthorized', 401);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		const result = await errorHandlers.AUTH_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});
});
