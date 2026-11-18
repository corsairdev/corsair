import type { RetryStrategy } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	authorizationHeader,
	estimatePath,
	HiggsfieldAPIError,
	HiggsfieldError,
	makeHiggsfieldRequest,
	normalizeModelPath,
	putToPresignedUrl,
	readErrorDetail,
	requestPath,
	submitPath,
} from './client';
import { errorHandlers } from './error-handlers';
import { API_KEY, jsonResponse, REQUEST_ID } from './test-fixtures';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('authorizationHeader', () => {
	it('sends the id and secret as one Key value', () => {
		expect(authorizationHeader(API_KEY)).toBe(`Key ${API_KEY}`);
		expect(authorizationHeader(`  ${API_KEY}\n`)).toBe(`Key ${API_KEY}`);
	});

	it.each(['nocolonhere', ':secret', 'id:', 'id:se cret', ''])(
		'refuses %p without repeating it',
		(key) => {
			// unknown: a catch hands over anything; the checks below narrow it.
			let caught: unknown;
			try {
				authorizationHeader(key);
			} catch (error) {
				caught = error;
			}
			expect(caught).toBeInstanceOf(HiggsfieldError);
			expect((caught as HiggsfieldError).code).toBe('invalid_key');
			const message = (caught as Error).message;
			expect(message).toContain('<key id>:<key secret>');
			if (key) expect(message).not.toContain(key);
		},
	);

	it('refuses a key with no colon before any network call', async () => {
		await expect(
			makeHiggsfieldRequest('nocolonhere', '/models'),
		).rejects.toThrow('<key id>:<key secret>');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('paths', () => {
	it('normalises surrounding slashes', () => {
		expect(normalizeModelPath('/a/b/')).toBe('a/b');
		expect(submitPath('z-image/turbo')).toBe('/z-image/turbo');
		expect(estimatePath('z-image/turbo')).toBe('/estimate/z-image/turbo');
	});

	it.each([
		'https://evil.example/x',
		'//evil.example/x',
		'a/../../b',
		'a/b?x=1',
		'requests/x/cancel',
	])('refuses %s', (modelPath) => {
		expect(() => submitPath(modelPath)).toThrow('modelPath must be');
		expect(() => estimatePath(modelPath)).toThrow('modelPath must be');
	});

	it('builds request paths from a checked id', () => {
		expect(requestPath(REQUEST_ID)).toBe(`/requests/${REQUEST_ID}`);
		expect(requestPath(REQUEST_ID, 'status')).toBe(
			`/requests/${REQUEST_ID}/status`,
		);
		expect(requestPath(REQUEST_ID, 'cancel')).toBe(
			`/requests/${REQUEST_ID}/cancel`,
		);
		expect(() => requestPath('../../models')).toThrow('requestId must be');
	});
});

describe('makeHiggsfieldRequest', () => {
	it('sends the key to the API host, refuses redirects and repeats array params', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));
		await makeHiggsfieldRequest(API_KEY, '/models/usage', {
			query: {
				model: ['a/b', 'c/d'],
				page: 2,
				absent: undefined,
				flag: false,
			},
		});
		const [url, init] = fetchMock.mock.calls[0];
		expect(String(url)).toBe(
			'https://api.higgsfield.ai/models/usage?model=a%2Fb&model=c%2Fd&page=2&flag=false',
		);
		expect(init.headers.Authorization).toBe(`Key ${API_KEY}`);
		expect(init.redirect).toBe('error');
		expect(init.signal).toBeDefined();
	});

	it.each(['//evil.example/steal', 'https://evil.example/steal'])(
		'refuses to send the key anywhere else: %s',
		async (path) => {
			await expect(makeHiggsfieldRequest(API_KEY, path)).rejects.toThrow(
				'another host',
			);
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('sends the JSON body and answers undefined for an empty 202', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 202 }));
		const answer = await makeHiggsfieldRequest(API_KEY, '/x', {
			method: 'POST',
			body: { prompt: 'p' },
		});
		const [, init] = fetchMock.mock.calls[0];
		expect(init.body).toBe('{"prompt":"p"}');
		expect(init.headers['Content-Type']).toBe('application/json');
		expect(answer).toBeUndefined();
	});

	it('reports a body that cannot be serialized as invalid input, sending nothing', async () => {
		const circular: Record<string, object> = {};
		circular.self = circular;
		for (const body of [{ seed: BigInt(1) }, circular]) {
			await expect(
				makeHiggsfieldRequest(API_KEY, '/a/b', { method: 'POST', body }),
			).rejects.toMatchObject({ code: 'invalid_input' });
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('leaves undefined headers out', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({}));
		await makeHiggsfieldRequest(API_KEY, '/x', {
			headers: { 'Hf-Expires-After': undefined, 'Idempotency-Key': 'k' },
		});
		const [, init] = fetchMock.mock.calls[0];
		expect(init.headers).not.toHaveProperty('Hf-Expires-After');
		expect(init.headers['Idempotency-Key']).toBe('k');
	});

	describe('errors', () => {
		const failWith = async (response: Response) => {
			fetchMock.mockResolvedValueOnce(response);
			try {
				await makeHiggsfieldRequest(API_KEY, '/requests/x/status');
			} catch (error) {
				return error as HiggsfieldAPIError;
			}
			throw new Error('expected a throw');
		};

		it('keeps the detail, the status and X-Correlation-ID, and never the key', async () => {
			const error = await failWith(
				jsonResponse({ detail: 'Invalid credentials' }, 401, {
					'X-Correlation-ID': 'abc123',
				}),
			);
			expect(error).toBeInstanceOf(HiggsfieldAPIError);
			expect(error).toBeInstanceOf(ApiError);
			expect(error.status).toBe(401);
			expect(error.correlationId).toBe('abc123');
			expect(error.message).toContain('Invalid credentials');
			expect(error.message).toContain('abc123');
			expect(JSON.stringify({ ...error, m: error.message })).not.toContain(
				'test-key-secret',
			);
		});

		it('says a 403 is about the balance', async () => {
			const error = await failWith(
				jsonResponse({ detail: 'Not enough credits' }, 403),
			);
			expect(error.message).toContain('Not enough credits');
			expect(error.message).toContain('balance');
		});

		it('says a 423 means nothing ran', async () => {
			const error = await failWith(jsonResponse({ detail: 'Blocked' }, 423));
			expect(error.message).toContain('temporarily blocked');
			expect(error.message).toContain('Nothing ran');
		});

		it('reads a full queue with its Retry-After and code', async () => {
			const error = await failWith(
				jsonResponse(
					{
						detail: {
							code: 'account_queue_full',
							message: 'Too many queued generations for this account',
							retryable: true,
							limit: 40,
							retry_after_seconds: 30,
						},
					},
					429,
					{ 'Retry-After': '30' },
				),
			);
			expect(error.retryAfter).toBe(30_000);
			expect(error.detailCode).toBe('account_queue_full');
			expect(error.retryable).toBe(true);
			expect(error.message).toContain('account_queue_full');
			expect(error.message).toContain('Retry after 30 s');
		});

		it('falls back to retry_after_seconds, and reads an HTTP date', async () => {
			const fromDetail = await failWith(
				jsonResponse({ detail: { retry_after_seconds: 7 } }, 429),
			);
			expect(fromDetail.retryAfter).toBe(7000);
			const fromDate = await failWith(
				jsonResponse({ detail: 'x' }, 429, {
					'Retry-After': new Date(Date.now() + 60_000).toUTCString(),
				}),
			);
			expect(fromDate.retryAfter).toBeGreaterThan(50_000);
		});

		it('joins a validation list', async () => {
			const error = await failWith(
				jsonResponse(
					{
						detail: [
							{ loc: ['body', 'prompt'], msg: 'Field required' },
							{ msg: 'Something else' },
						],
					},
					422,
				),
			);
			expect(error.message).toContain(
				'body.prompt: Field required; Something else',
			);
		});

		it('keeps the status when a validation list holds a null', async () => {
			const error = await failWith(jsonResponse({ detail: [null] }, 422));
			expect(error).toBeInstanceOf(HiggsfieldAPIError);
			expect(error.status).toBe(422);
			expect(error.message).toContain('invalid');
		});

		it('keeps a plain-text error body', async () => {
			const error = await failWith(
				new Response('upstream connect error', { status: 502 }),
			);
			expect(error.status).toBe(502);
			expect(error.message).toContain('upstream connect error');
		});

		it('leaves the query, where a webhook URL can sit, out of the error', async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse({ detail: 'nope' }, 400));
			let error: HiggsfieldAPIError | undefined;
			try {
				await makeHiggsfieldRequest(API_KEY, '/a/b', {
					method: 'POST',
					query: { hf_webhook: 'https://example.com/?token=private' },
				});
			} catch (caught) {
				error = caught as HiggsfieldAPIError;
			}
			expect(error?.url).toBe('/a/b');
			expect(JSON.stringify(error?.request)).not.toContain('private');
		});

		it('reports a timeout and a network failure by code, with no key', async () => {
			const timeout = new Error('timed out');
			timeout.name = 'TimeoutError';
			fetchMock.mockRejectedValueOnce(timeout);
			await expect(makeHiggsfieldRequest(API_KEY, '/x')).rejects.toMatchObject({
				code: 'timeout',
			});

			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			const failed = await makeHiggsfieldRequest(API_KEY, '/x').catch(
				(error: Error) => error,
			);
			expect(failed).toMatchObject({ code: 'network' });
			expect((failed as Error).message).not.toContain('test-key-secret');
		});
	});
});

describe('readErrorDetail', () => {
	it.each([
		[{ detail: 'text' }, 'text'],
		['plain body  ', 'plain body'],
		[undefined, ''],
		[{ other: 1 }, ''],
		[{ detail: { code: 'c', message: 'm' } }, 'c: m'],
		[{ detail: [{ msg: 5 }] }, 'invalid'],
		[{ detail: [null, { msg: 'Field required' }] }, 'invalid; Field required'],
	])('reads %j as %p', (body, text) => {
		expect(readErrorDetail(body).text).toBe(text);
	});
});

describe('putToPresignedUrl', () => {
	const signed =
		'https://bucket.s3.amazonaws.com/x.png?X-Amz-Signature=supersecretsig';

	it('sends every header it was given and no Higgsfield credentials', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));
		const bytes = new Uint8Array([1, 2, 3]);
		await putToPresignedUrl(signed, bytes, {
			'Content-Type': 'image/png',
			'x-amz-tagging': 'retention=temporary',
		});
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe(signed);
		expect(init.method).toBe('PUT');
		expect(init.body).toBe(bytes);
		expect(init.headers).toEqual({
			'Content-Type': 'image/png',
			'x-amz-tagging': 'retention=temporary',
		});
		expect(JSON.stringify(init.headers)).not.toMatch(/authorization/i);
		expect(init.signal).toBeDefined();
	});

	it('keeps the signed URL out of a failure', async () => {
		fetchMock.mockResolvedValueOnce(new Response('denied', { status: 403 }));
		const error = await putToPresignedUrl(signed, new Uint8Array(1), {}).catch(
			(caught: Error) => caught,
		);
		expect(error).toMatchObject({ code: 'upload_failed' });
		expect((error as Error).message).toContain('403');
		expect((error as Error).message).not.toContain('supersecretsig');
	});

	it('reports a timeout and refuses a non-https URL', async () => {
		const timeout = new Error('t');
		timeout.name = 'TimeoutError';
		fetchMock.mockRejectedValueOnce(timeout);
		await expect(
			putToPresignedUrl(signed, new Uint8Array(1), {}),
		).rejects.toThrow('timed out');
		await expect(
			putToPresignedUrl('http://bucket.example/x', new Uint8Array(1), {}),
		).rejects.toThrow('not https');
	});
});

describe('errorHandlers', () => {
	const apiError = (
		status: number,
		extra: { retryAfterMs?: number; retryable?: boolean } = {},
	) =>
		new HiggsfieldAPIError({
			method: 'POST',
			path: '/a/b',
			status,
			statusText: '',
			body: {},
			message: 'm',
			...extra,
		});

	const decide = async (error: Error) => {
		// The same pick core makes: the first match, else DEFAULT by name.
		const name =
			(Object.keys(errorHandlers) as (keyof typeof errorHandlers)[]).find(
				(key) => errorHandlers[key].match(error),
			) ?? 'DEFAULT';
		const entry = errorHandlers[name] as {
			handler: (caught: Error) => Promise<RetryStrategy>;
		};
		return { name, strategy: await entry.handler(error) };
	};

	it('retries a 429 after its Retry-After when that is short', async () => {
		const { name, strategy } = await decide(
			apiError(429, { retryAfterMs: 2000 }),
		);
		expect(name).toBe('RATE_LIMIT_ERROR');
		expect(strategy).toMatchObject({
			maxRetries: 2,
			headersRetryAfterMs: 2000,
		});
	});

	it('hands a long Retry-After back to the caller', async () => {
		const { strategy } = await decide(apiError(429, { retryAfterMs: 30_000 }));
		expect(strategy.maxRetries).toBe(0);
	});

	it('retries a 429 with no Retry-After by backing off', async () => {
		const { strategy } = await decide(apiError(429));
		expect(strategy).toMatchObject({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff_jitter',
		});
	});

	it.each([401, 403])('never retries a %i', async (status) => {
		const { name, strategy } = await decide(apiError(status));
		expect(name).toBe('AUTH_ERROR');
		expect(strategy.maxRetries).toBe(0);
	});

	it('never retries an unusable key', async () => {
		const { name, strategy } = await decide(
			new HiggsfieldError('bad', 'invalid_key'),
		);
		expect(name).toBe('AUTH_ERROR');
		expect(strategy.maxRetries).toBe(0);
	});

	it.each([500, 502, 504])('retries a %i', async (status) => {
		const { name, strategy } = await decide(apiError(status));
		expect(name).toBe('SERVER_ERROR');
		expect(strategy.maxRetries).toBe(2);
	});

	it('retries a 503 only when Higgsfield marks it retryable', async () => {
		expect((await decide(apiError(503))).strategy.maxRetries).toBe(0);
		expect(
			(await decide(apiError(503, { retryable: true }))).strategy.maxRetries,
		).toBe(2);
	});

	it.each([400, 404, 409, 422, 423])('does not retry a %i', async (status) => {
		const { name, strategy } = await decide(apiError(status));
		expect(name).toBe('DEFAULT');
		expect(strategy.maxRetries).toBe(0);
	});

	it('holds a retryable 503 to the same Retry-After rule as a 429', async () => {
		const short = await decide(
			apiError(503, { retryable: true, retryAfterMs: 2000 }),
		);
		expect(short.strategy).toMatchObject({
			maxRetries: 2,
			headersRetryAfterMs: 2000,
		});
		const long = await decide(
			apiError(503, { retryable: true, retryAfterMs: 30_000 }),
		);
		expect(long.strategy.maxRetries).toBe(0);
		const notRetryable = await decide(apiError(503, { retryAfterMs: 2000 }));
		expect(notRetryable.strategy.maxRetries).toBe(0);
	});

	it('leaves a retry-free answer for what nothing else matches', () => {
		expect(errorHandlers.DEFAULT.match()).toBe(false);
	});

	it('retries network failures and timeouts, but not a refused upload', async () => {
		expect(
			(await decide(new HiggsfieldError('n', 'network'))).strategy.maxRetries,
		).toBe(2);
		expect(
			(await decide(new HiggsfieldError('t', 'timeout'))).strategy.maxRetries,
		).toBe(1);
		expect(
			(await decide(new HiggsfieldError('u', 'upload_failed'))).strategy
				.maxRetries,
		).toBe(0);
	});
});
