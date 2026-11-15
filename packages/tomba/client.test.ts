import { inspect } from 'node:util';
import {
	describeTombaError,
	makeTombaRequest,
	TOMBA_API_BASE,
	TombaAPIError,
} from './client';
import {
	badKey,
	insufficientCredits,
	legalBlock,
	noKey,
	unknownRecord,
} from './test-fixtures';

const CREDENTIALS = { apiKey: 'tb-key', apiSecret: 'tb-secret' };

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
	return {
		url: String(url),
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

describe('makeTombaRequest', () => {
	it('sends both credentials as the two documented headers', async () => {
		respond({ data: {} });

		await makeTombaRequest(CREDENTIALS, { method: 'GET', path: 'me' });

		const sent = lastRequest();
		expect(sent.url).toBe(`${TOMBA_API_BASE}/me`);
		expect(sent.headers.get('x-tomba-key')).toBe('tb-key');
		expect(sent.headers.get('x-tomba-secret')).toBe('tb-secret');
	});

	it('never puts either credential in the URL', async () => {
		respond({ data: {} });

		await makeTombaRequest(CREDENTIALS, {
			method: 'GET',
			path: 'email-finder',
			query: { domain: 'stripe.com', first_name: 'Jane' },
		});

		expect(lastRequest().url).not.toContain('tb-key');
		expect(lastRequest().url).not.toContain('tb-secret');
	});

	it('serializes query values and drops the unset ones', async () => {
		respond({ data: {} });

		await makeTombaRequest(CREDENTIALS, {
			method: 'GET',
			path: 'domain-search',
			query: {
				domain: 'stripe.com',
				limit: 50,
				enrich_mobile: true,
				page: undefined,
			},
		});

		const url = new URL(lastRequest().url);
		expect(url.searchParams.get('domain')).toBe('stripe.com');
		expect(url.searchParams.get('limit')).toBe('50');
		expect(url.searchParams.get('enrich_mobile')).toBe('true');
		expect(url.searchParams.has('page')).toBe(false);
	});

	it('reads the 400 authentication_failed envelope', async () => {
		respond(noKey, 400);

		const error = await makeTombaRequest(CREDENTIALS, {
			method: 'GET',
			path: 'me',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(TombaAPIError);
		expect((error as TombaAPIError).status).toBe(400);
		expect((error as TombaAPIError).type).toBe('authentication_failed');
		expect((error as Error).message).toContain(
			'No user found for the API supplied',
		);
	});

	it('distinguishes a 402 from a 401', async () => {
		respond(insufficientCredits, 402);

		const error = await makeTombaRequest(CREDENTIALS, {
			method: 'GET',
			path: 'email-finder',
		}).catch((caught: unknown) => caught);

		expect((error as TombaAPIError).isInsufficientCredits).toBe(true);
		expect((error as TombaAPIError).status).toBe(402);
	});

	it('recognises a 451 as a permanent legal block', async () => {
		respond(legalBlock, 451);

		const error = await makeTombaRequest(CREDENTIALS, {
			method: 'GET',
			path: 'enrich',
		}).catch((caught: unknown) => caught);

		expect((error as TombaAPIError).isLegalBlock).toBe(true);
	});

	it('keeps the type of a 400 that is not about credentials', async () => {
		respond(unknownRecord, 400);

		const error = await makeTombaRequest(CREDENTIALS, {
			method: 'GET',
			path: 'domain-search',
		}).catch((caught: unknown) => caught);

		expect((error as TombaAPIError).type).toBe('unknown_record');
		expect((error as Error).message).toContain('Tomba 400 unknown_record');
	});

	it('keeps Retry-After so the rate-limit handler can honour it', async () => {
		respond({ errors: { type: 'rate_limit', message: 'slow down' } }, 429, {
			'Retry-After': '30',
		});

		const error = await makeTombaRequest(CREDENTIALS, {
			method: 'GET',
			path: 'me',
		}).catch((caught: unknown) => caught);

		expect((error as TombaAPIError).retryAfter).toBe(30000);
		expect((error as TombaAPIError).isRateLimit).toBe(true);
	});

	it('records the method so a non-read is not replayed', async () => {
		respond({}, 500);

		const error = await makeTombaRequest(CREDENTIALS, {
			method: 'POST',
			path: 'reveal/search',
			body: {},
		}).catch((caught: unknown) => caught);

		expect((error as TombaAPIError).method).toBe('POST');
	});

	it('never puts either credential in the message or its inspection', async () => {
		respond(badKey, 401);

		const error = await makeTombaRequest(CREDENTIALS, {
			method: 'GET',
			path: 'email-finder',
			query: { domain: 'stripe.com' },
		}).catch((caught: unknown) => caught);

		for (const text of [
			(error as Error).message,
			inspect(error),
			JSON.stringify(error),
		]) {
			expect(text).not.toContain('tb-key');
			expect(text).not.toContain('tb-secret');
		}
	});
});

describe('describeTombaError', () => {
	it('includes the status and the error type', () => {
		expect(describeTombaError(400, noKey, 'x')).toEqual({
			message:
				'Tomba 400 authentication_failed: No user found for the API supplied. . Sign up at https://tomba.io',
			type: 'authentication_failed',
		});
	});

	it('reads a body with a message but no errors object', () => {
		expect(describeTombaError(500, { message: 'boom' }, 'x')).toEqual({
			message: 'Tomba 500: boom',
			type: undefined,
		});
	});

	it('falls back for a non-JSON body', () => {
		expect(describeTombaError(502, '<html>', 'Bad Gateway').message).toBe(
			'Tomba 502: Bad Gateway',
		);
		expect(describeTombaError(undefined, null, 'offline').message).toBe(
			'offline',
		);
	});

	it('ignores a non-string type', () => {
		expect(
			describeTombaError(400, { errors: { type: 42, message: 'x' } }, 'y').type,
		).toBeUndefined();
	});
});
