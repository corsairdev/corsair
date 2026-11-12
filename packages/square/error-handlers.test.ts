import type { RetryStrategy } from 'corsair/core';
import { makeSquareRequest, SquareAPIError } from './client';
import { errorHandlers } from './error-handlers';

// unknown: response bodies are arbitrary JSON, as Square sends them.
function jsonResponse(
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', ...headers },
	});
}

const rateLimited = {
	errors: [
		{
			category: 'RATE_LIMIT_ERROR',
			code: 'RATE_LIMITED',
			detail: 'Too many requests.',
		},
	],
};
const serverError = {
	errors: [{ category: 'API_ERROR', code: 'INTERNAL_SERVER_ERROR' }],
};

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		throw new Error('unmocked fetch: queue a response first');
	});
});

afterEach(() => {
	jest.restoreAllMocks();
});

// Core picks the first handler (in key order) whose match passes.
async function strategyFor(error: Error): Promise<RetryStrategy> {
	const chosen = Object.values(errorHandlers).find((h) => h.match(error));
	if (!chosen) throw new Error('no handler matched');
	return chosen.handler(error);
}

// unknown: the error body is arbitrary JSON, as Square sends it.
async function failureOf(
	status: number,
	body: unknown,
	options: Parameters<typeof makeSquareRequest>[2],
	headers: Record<string, string> = {},
): Promise<SquareAPIError> {
	fetchMock.mockResolvedValueOnce(jsonResponse(body, status, headers));
	const error = await makeSquareRequest('/v2/payments', 'tok', options).catch(
		// unknown: a rejection can carry any value; the check below narrows it.
		(e: unknown) => e,
	);
	if (!(error instanceof SquareAPIError)) throw new Error('expected a failure');
	return error;
}

const keyed = {
	method: 'POST',
	body: { idempotency_key: 'order-17-charge', source_id: 'cnon:card-nonce-ok' },
} as const;
const keyless = {
	method: 'POST',
	body: { source_id: 'cnon:card-nonce-ok' },
} as const;

describe('Square retry policy on a 5xx', () => {
	it('retries a POST that carries the caller idempotency_key', async () => {
		const error = await failureOf(500, serverError, keyed);
		expect(await strategyFor(error)).toMatchObject({ maxRetries: 2 });
	});

	it('never retries a keyless mutating POST', async () => {
		const error = await failureOf(500, serverError, keyless);
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('does not count an empty idempotency_key as a key', async () => {
		const error = await failureOf(500, serverError, {
			method: 'POST',
			body: { idempotency_key: '' },
		});
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it.each(['GET', 'PUT', 'DELETE'] as const)(
		'retries a keyless %s',
		async (method) => {
			const error = await failureOf(503, serverError, { method });
			expect(await strategyFor(error)).toMatchObject({ maxRetries: 2 });
		},
	);

	it('retries a read-only POST such as a search', async () => {
		const error = await failureOf(502, serverError, {
			method: 'POST',
			body: { query: {} },
			readOnly: true,
		});
		expect(await strategyFor(error)).toMatchObject({ maxRetries: 2 });
	});

	it('retries a keyed POST after a timeout, and not a keyless one', async () => {
		fetchMock.mockRejectedValue(new DOMException('timed out', 'TimeoutError'));
		// unknown: a rejection can carry any value; the check below narrows it.
		const keyedError = await makeSquareRequest('/v2/payments', 'tok', keyed)
			.then(() => undefined)
			.catch((e: unknown) => e);
		const keylessError = await makeSquareRequest('/v2/payments', 'tok', keyless)
			.then(() => undefined)
			.catch((e: unknown) => e);
		if (
			!(keyedError instanceof SquareAPIError) ||
			!(keylessError instanceof SquareAPIError)
		) {
			throw new Error('expected failures');
		}
		expect(keyedError.status).toBeUndefined();
		expect(await strategyFor(keyedError)).toMatchObject({ maxRetries: 2 });
		expect(await strategyFor(keylessError)).toEqual({ maxRetries: 0 });
	});
});

describe('Square retry policy on a 429', () => {
	it('retries a keyless mutating POST: it was rejected, not run', async () => {
		const error = await failureOf(429, rateLimited, keyless);
		expect(await strategyFor(error)).toMatchObject({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('retries a keyed POST and a GET too', async () => {
		const keyedError = await failureOf(429, rateLimited, keyed);
		const getError = await failureOf(429, rateLimited, { method: 'GET' });
		expect(await strategyFor(keyedError)).toMatchObject({ maxRetries: 3 });
		expect(await strategyFor(getError)).toMatchObject({ maxRetries: 3 });
	});

	it('passes no Retry-After on, because Square documents none', async () => {
		const error = await failureOf(429, rateLimited, keyless);
		expect((await strategyFor(error)).headersRetryAfterMs).toBeUndefined();
	});

	it('honours a Retry-After when one is present', async () => {
		const error = await failureOf(429, rateLimited, keyless, {
			'Retry-After': '2',
		});
		expect((await strategyFor(error)).headersRetryAfterMs).toBe(2000);
	});
});

describe('Square errors that are never retried', () => {
	it('treats a declined card as Square answering, not a fault', async () => {
		const error = await failureOf(
			402,
			{
				errors: [
					{
						category: 'PAYMENT_METHOD_ERROR',
						code: 'CARD_DECLINED',
						detail: 'Card declined.',
					},
				],
			},
			keyed,
		);
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry an expired or under-scoped token', async () => {
		const error = await failureOf(
			401,
			{
				errors: [
					{
						category: 'AUTHENTICATION_ERROR',
						code: 'UNAUTHORIZED',
					},
				],
			},
			{ method: 'GET' },
		);
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});

	it('does not retry a 400 on a keyed write', async () => {
		const error = await failureOf(
			400,
			{
				errors: [
					{
						category: 'INVALID_REQUEST_ERROR',
						code: 'IDEMPOTENCY_KEY_REUSED',
					},
				],
			},
			keyed,
		);
		expect(await strategyFor(error)).toEqual({ maxRetries: 0 });
	});
});

describe('Square idempotency_key pass-through', () => {
	it('sends the caller key unchanged on every attempt', async () => {
		fetchMock.mockImplementation(async () => jsonResponse(serverError, 500));
		for (let attempt = 0; attempt < 3; attempt++) {
			await makeSquareRequest('/v2/payments', 'tok', keyed).catch(
				() => undefined,
			);
		}
		const bodies = fetchMock.mock.calls.map(([, init]) =>
			JSON.parse(String((init as RequestInit).body)),
		);
		expect(bodies).toHaveLength(3);
		for (const body of bodies) {
			expect(body.idempotency_key).toBe('order-17-charge');
		}
	});

	it('never adds a key to a keyless request', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ payment: {} }, 200));
		await makeSquareRequest('/v2/payments', 'tok', keyless);
		const [, init] = fetchMock.mock.calls[0] ?? [];
		expect(JSON.parse(String((init as RequestInit).body))).toEqual(
			keyless.body,
		);
	});

	it('sends Square-Version and a Bearer token', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ locations: [] }, 200));
		await makeSquareRequest('/v2/locations', 'tok');
		const [url, init] = fetchMock.mock.calls[0] ?? [];
		expect(String(url)).toBe('https://connect.squareup.com/v2/locations');
		const headers = new Headers((init as RequestInit).headers);
		expect(headers.get('Authorization')).toBe('Bearer tok');
		expect(headers.get('Square-Version')).toBe('2026-09-16');
	});

	it('uses the sandbox host for environment: sandbox', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ locations: [] }, 200));
		await makeSquareRequest('/v2/locations', 'tok', {
			environment: 'sandbox',
		});
		const [url] = fetchMock.mock.calls[0] ?? [];
		expect(String(url)).toBe(
			'https://connect.squareupsandbox.com/v2/locations',
		);
	});
});

describe('Square error messages', () => {
	it('turns errors[] into one CODE: detail (field) line per entry', async () => {
		const error = await failureOf(
			400,
			{
				errors: [
					{
						category: 'INVALID_REQUEST_ERROR',
						code: 'MISSING_REQUIRED_PARAMETER',
						detail: "Missing required parameter 'source_id'.",
						field: 'source_id',
					},
					{ category: 'INVALID_REQUEST_ERROR', code: 'VALUE_TOO_LOW' },
				],
			},
			keyed,
		);
		expect(error.message).toBe(
			"MISSING_REQUIRED_PARAMETER: Missing required parameter 'source_id'. (source_id)\nVALUE_TOO_LOW",
		);
	});
});
