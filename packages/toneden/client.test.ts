import { inspect } from 'node:util';
import {
	describeToneDenError,
	makeToneDenRequest,
	TONEDEN_API_BASE,
	TONEDEN_OAUTH_AUTHORIZE_URL,
	TONEDEN_OAUTH_TOKEN_URL,
	ToneDenAPIError,
} from './client';
import { unauthorized } from './test-fixtures';

const TOKEN = 'td-live-token-1234567890';

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
		// unknown: the parsed request body, whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('OAuth endpoints', () => {
	it('points at the documented authorize and token URLs', () => {
		expect(TONEDEN_OAUTH_AUTHORIZE_URL).toBe(
			'https://www.toneden.io/auth/oauth2/authorize',
		);
		expect(TONEDEN_OAUTH_TOKEN_URL).toBe(
			'https://www.toneden.io/auth/oauth2/token',
		);
	});
});

describe('makeToneDenRequest', () => {
	it('sends the access token as a Bearer token', async () => {
		respond({ link: {} });

		await makeToneDenRequest(TOKEN, { method: 'GET', path: 'links/1' });

		const sent = lastRequest();
		expect(sent.url).toBe(`${TONEDEN_API_BASE}/links/1`);
		expect(sent.headers.get('authorization')).toBe(`Bearer ${TOKEN}`);
	});

	it('serializes paging and filters', async () => {
		respond({ links: [] });

		await makeToneDenRequest(TOKEN, {
			method: 'GET',
			path: 'links',
			query: { target_type: 'music', offset: 0, limit: 25, empty: undefined },
		});

		expect(lastRequest().params).toEqual({
			target_type: 'music',
			offset: '0',
			limit: '25',
		});
	});

	it('sends a JSON body on a write', async () => {
		respond({ link: {} });

		await makeToneDenRequest(TOKEN, {
			method: 'POST',
			path: 'links',
			body: { title: 'New single' },
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.headers.get('content-type')).toBe('application/json');
		expect(sent.body).toEqual({ title: 'New single' });
	});

	it('sends no body on a DELETE', async () => {
		respond({ success: true });

		await makeToneDenRequest(TOKEN, { method: 'DELETE', path: 'links/1' });

		expect(lastRequest().body).toBeUndefined();
	});

	it('reads the error message out of the body', async () => {
		respond(unauthorized, 401);

		const error = await makeToneDenRequest(TOKEN, {
			method: 'GET',
			path: 'links',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ToneDenAPIError);
		expect((error as ToneDenAPIError).status).toBe(401);
		expect((error as ToneDenAPIError).isAuthError).toBe(true);
		expect((error as Error).message).toContain('Unauthenticated');
	});

	it('keeps Retry-After so the rate-limit handler can honour it', async () => {
		respond({ message: 'slow down' }, 429, { 'Retry-After': '20' });

		const error = await makeToneDenRequest(TOKEN, {
			method: 'GET',
			path: 'links',
		}).catch((caught: unknown) => caught);

		expect((error as ToneDenAPIError).retryAfter).toBe(20000);
		expect((error as ToneDenAPIError).isRateLimit).toBe(true);
	});

	it('records the method so writes are not replayed on a 5xx', async () => {
		respond({}, 500);

		const error = await makeToneDenRequest(TOKEN, {
			method: 'POST',
			path: 'advertising/campaigns',
			body: {},
		}).catch((caught: unknown) => caught);

		expect((error as ToneDenAPIError).method).toBe('POST');
	});

	it('never puts the token in the message or its inspection', async () => {
		respond(unauthorized, 401);

		const error = await makeToneDenRequest(TOKEN, {
			method: 'GET',
			path: 'links',
		}).catch((caught: unknown) => caught);

		for (const text of [
			(error as Error).message,
			inspect(error),
			JSON.stringify(error),
		]) {
			expect(text).not.toContain(TOKEN);
		}
	});
});

describe('describeToneDenError', () => {
	it('prefers `message`', () => {
		expect(describeToneDenError(401, unauthorized, 'x')).toBe(
			'ToneDen 401: Unauthenticated.',
		);
	});

	it('reads `error` and `error_description` as fallbacks', () => {
		expect(describeToneDenError(400, { error: 'invalid_request' }, 'x')).toBe(
			'ToneDen 400: invalid_request',
		);
		expect(
			describeToneDenError(400, { error_description: 'bad scope' }, 'x'),
		).toBe('ToneDen 400: bad scope');
	});

	it('falls back for a non-JSON body', () => {
		expect(describeToneDenError(502, '<html>', 'Bad Gateway')).toBe(
			'ToneDen 502: Bad Gateway',
		);
		expect(describeToneDenError(undefined, null, 'offline')).toBe('offline');
	});
});
