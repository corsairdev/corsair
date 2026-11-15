import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import {
	isQuotaExhausted,
	makeTombaRequest,
	TOMBA_API_BASE,
	tombaErrorType,
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

	it('lets core ApiError through with the 400 authentication_failed body', async () => {
		respond(noKey, 400);

		const error = await makeTombaRequest(CREDENTIALS, {
			method: 'GET',
			path: 'me',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(400);
		expect(tombaErrorType(error)).toBe('authentication_failed');
		expect((error as Error).message).toContain(
			'No user found for the API supplied',
		);
	});

	it('keeps a 402 status and type for the balance handler', async () => {
		respond(insufficientCredits, 402);

		const error = await makeTombaRequest(CREDENTIALS, {
			method: 'GET',
			path: 'email-finder',
		}).catch((caught: unknown) => caught);

		expect((error as ApiError).status).toBe(402);
		expect(tombaErrorType(error)).toBe(insufficientCredits.errors.type);
	});

	it('keeps a 451 legal block status', async () => {
		respond(legalBlock, 451);

		const error = await makeTombaRequest(CREDENTIALS, {
			method: 'GET',
			path: 'enrich',
		}).catch((caught: unknown) => caught);

		expect((error as ApiError).status).toBe(451);
		expect(tombaErrorType(error)).toBe('legal_block');
	});

	it('names the type of a 400 that is not about credentials', async () => {
		respond(unknownRecord, 400);

		const error = await makeTombaRequest(CREDENTIALS, {
			method: 'GET',
			path: 'domain-search',
		}).catch((caught: unknown) => caught);

		expect(tombaErrorType(error)).toBe('unknown_record');
		expect((error as Error).message).toContain('Tomba 400 unknown_record');
	});

	it('drops the looked-up address and name from the error it throws', async () => {
		respond(
			{ errors: { type: 'legal_block', message: 'jane@stripe.com opted out' } },
			451,
		);

		const error = await makeTombaRequest(CREDENTIALS, {
			method: 'GET',
			path: 'email-verifier',
			query: { email: 'jane@stripe.com', first_name: 'Jane' },
		}).catch((caught: unknown) => caught);

		for (const text of [
			(error as Error).message,
			inspect(error, { depth: 10 }),
			JSON.stringify(error),
		]) {
			expect(text).not.toContain('jane@stripe.com');
			expect(text).not.toContain('Jane');
		}
		expect((error as ApiError).request.method).toBe('GET');
	});

	it('leaves 429 retries to the error handlers and keeps Retry-After', async () => {
		respond(
			{
				errors: {
					type: 'rate_limit',
					message: 'Rate limit exceeded (daily). Limit is 5 requests.',
				},
			},
			429,
			{ 'Retry-After': '40000' },
		);

		const error = await makeTombaRequest(CREDENTIALS, {
			method: 'GET',
			path: 'email-finder',
		}).catch((caught: unknown) => caught);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect((error as ApiError).status).toBe(429);
		expect((error as ApiError).retryAfter).toBe(40000000);
		expect(isQuotaExhausted((error as ApiError).body)).toBe(true);
	});

	it('records the method so a non-read is not replayed', async () => {
		respond({}, 500);

		const error = await makeTombaRequest(CREDENTIALS, {
			method: 'POST',
			path: 'reveal/search',
			body: {},
		}).catch((caught: unknown) => caught);

		expect((error as ApiError).request.method).toBe('POST');
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

describe('isQuotaExhausted', () => {
	it('tells a used-up daily limit or balance from a short window', () => {
		const body = (message: string) => ({
			errors: { type: 'rate_limit', message },
		});
		expect(isQuotaExhausted(body('Rate limit exceeded (daily).'))).toBe(true);
		expect(isQuotaExhausted(body('Email count balance used up'))).toBe(true);
		expect(
			isQuotaExhausted(
				body('Rate limit exceeded (rpm). Retry after 42 seconds.'),
			),
		).toBe(false);
		expect(isQuotaExhausted('<html>')).toBe(false);
	});
});
