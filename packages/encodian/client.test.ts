import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError } from 'corsair/http';
import { makeEncodianRequest } from './client';
import { EncodianOperationRoutes } from './endpoints/generated';
import { callEncodianOperation } from './endpoints/runtime';

const API_KEY = 'encodian-test-key';
const originalFetch = global.fetch;

afterEach(() => {
	global.fetch = originalFetch;
	jest.restoreAllMocks();
});

describe('Encodian HTTP client', () => {
	it('sends the documented X-ApiKey header to the official API host', async () => {
		let observedUrl = '';
		let observedHeaders = new Headers();
		global.fetch = async (input, init) => {
			observedUrl = String(input);
			observedHeaders = new Headers(init?.headers);
			return new Response('{}', {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		};

		await makeEncodianRequest(
			EncodianOperationRoutes['barcodes.createBarcode'],
			API_KEY,
			{ body: {}, query: { barcodeTypeParameter: 'Code128' } },
		);

		expect(new URL(observedUrl).origin).toBe('https://api.apps-encodian.com');
		expect(observedHeaders.get('X-ApiKey')).toBe(API_KEY);
		expect(observedHeaders.get('Authorization')).toBeNull();
	});

	it('polls a queued request by its Location using authenticated GET only', async () => {
		const observedMethods: string[] = [];
		const observedUrls: string[] = [];
		const observedKeys: Array<string | null> = [];
		global.fetch = async (input, init) => {
			observedMethods.push(init?.method ?? '');
			observedUrls.push(String(input));
			observedKeys.push(new Headers(init?.headers).get('X-ApiKey'));
			if (observedMethods.length === 1) {
				return new Response(null, {
					status: 202,
					headers: {
						Location: '/api/v1/Conversion/GetOperationStatus?operationId=job-1',
					},
				});
			}
			return new Response('{"Filename":"result.pdf"}', {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		};

		const result = await makeEncodianRequest(
			EncodianOperationRoutes['barcodes.createBarcode'],
			API_KEY,
			{ body: { value: 'sample' } },
		);

		expect(result).toEqual({ Filename: 'result.pdf' });
		expect(observedMethods).toEqual(['POST', 'GET']);
		expect(observedUrls).toEqual([
			'https://api.apps-encodian.com/api/v1/Barcodes/CreateBarcode',
			'https://api.apps-encodian.com/api/v1/Conversion/GetOperationStatus?operationId=job-1',
		]);
		expect(observedKeys).toEqual([API_KEY, API_KEY]);
	});

	it('does not send the API key to a queued URL outside the Encodian origin', async () => {
		let fetchCount = 0;
		global.fetch = async () => {
			fetchCount += 1;
			return new Response(null, {
				status: 202,
				headers: { Location: 'https://example.invalid/job-1' },
			});
		};

		await expect(
			makeEncodianRequest(
				EncodianOperationRoutes['barcodes.createBarcode'],
				API_KEY,
				{ body: { value: 'sample' } },
			),
		).rejects.toThrow('unsafe queued-operation URL');
		expect(fetchCount).toBe(1);
	});

	it('stops polling after the configured attempt bound without replaying the POST', async () => {
		const observedMethods: string[] = [];
		global.fetch = async (_input, init) => {
			observedMethods.push(init?.method ?? '');
			return new Response(null, {
				status: 202,
				headers: {
					Location: '/api/v1/Conversion/GetOperationStatus?operationId=job-1',
					'Retry-After': '0',
				},
			});
		};

		await expect(
			makeEncodianRequest(
				EncodianOperationRoutes['barcodes.createBarcode'],
				API_KEY,
				{ body: { value: 'sample' } },
			),
		).rejects.toThrow('polling limit');
		expect(observedMethods).toHaveLength(31);
		expect(observedMethods[0]).toBe('POST');
		expect(observedMethods.slice(1).every((method) => method === 'GET')).toBe(
			true,
		);
	});

	it('stops polling at the overall deadline', async () => {
		let now = 0;
		const nowSpy = jest.spyOn(Date, 'now').mockImplementation(() => now);
		let fetchCount = 0;
		global.fetch = async () => {
			fetchCount += 1;
			if (fetchCount > 1) now = 120_000;
			return new Response(null, {
				status: 202,
				headers: {
					Location: '/api/v1/Conversion/GetOperationStatus?operationId=job-1',
					'Retry-After': '0',
				},
			});
		};

		await expect(
			makeEncodianRequest(
				EncodianOperationRoutes['barcodes.createBarcode'],
				API_KEY,
				{ body: { value: 'sample' } },
			),
		).rejects.toThrow('timed out');
		expect(fetchCount).toBe(2);
		nowSpy.mockRestore();
	});

	it('limits an in-flight poll timeout to the remaining overall deadline', async () => {
		let now = 0;
		jest.spyOn(Date, 'now').mockImplementation(() => now);
		const timeouts: number[] = [];
		jest.spyOn(AbortSignal, 'timeout').mockImplementation((milliseconds) => {
			timeouts.push(milliseconds);
			const controller = new AbortController();
			queueMicrotask(() =>
				controller.abort(new DOMException('Poll timed out', 'TimeoutError')),
			);
			return controller.signal;
		});
		let pollCount = 0;
		global.fetch = async (_input, init) => {
			if (init?.method === 'POST') {
				return new Response(null, {
					status: 202,
					headers: {
						Location: '/api/v1/Conversion/GetOperationStatus?operationId=job-1',
					},
				});
			}
			pollCount += 1;
			if (pollCount === 1) {
				now = 110_000;
				return new Response(null, {
					status: 202,
					headers: { 'Retry-After': '0' },
				});
			}
			const signal = init?.signal;
			if (!signal) throw new Error('Expected a poll timeout signal');
			return new Promise<Response>((_resolve, reject) => {
				const rejectOnAbort = () =>
					reject(new DOMException('Poll exceeded its timeout', 'TimeoutError'));
				if (signal.aborted) {
					rejectOnAbort();
					return;
				}
				signal.addEventListener('abort', rejectOnAbort, { once: true });
			});
		};

		await expect(
			makeEncodianRequest(
				EncodianOperationRoutes['barcodes.createBarcode'],
				API_KEY,
				{ body: { value: 'sample' } },
			),
		).rejects.toThrow('Poll exceeded its timeout');
		expect(timeouts.slice(-2)).toEqual([20_000, 10_000]);
	});

	it('fails with AuthMissingError before calling the API when the key is absent', async () => {
		const fetchMock = jest.fn(global.fetch);
		global.fetch = fetchMock;
		// `unknown` because endpoint rejection values are untyped until checked below.
		const error: unknown = await callEncodianOperation(
			'barcodes.createBarcode',
			undefined,
			{},
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('preserves Retry-After metadata and does not retry POST operations', async () => {
		let fetchCount = 0;
		global.fetch = async () => {
			fetchCount += 1;
			return new Response('{"error":"limited"}', {
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '4' },
			});
		};
		// `unknown` because the rejected transport value has no static type.
		const error: unknown = await makeEncodianRequest(
			EncodianOperationRoutes['barcodes.createBarcode'],
			API_KEY,
			{ body: {} },
		).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) throw new Error('Expected ApiError');
		expect(error.retryAfter).toBe(4000);
		expect(error.message).toBe('Encodian request failed with HTTP 429');
		expect(error.body).toBe('[REDACTED]');
		expect(fetchCount).toBe(1);
	});

	it('extracts Retry-After through Corsair’s real HTTP transport', async () => {
		let fetchCount = 0;
		global.fetch = async () => {
			fetchCount += 1;
			return new Response('{"error":"limited"}', {
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '4' },
			});
		};
		const actualRequest =
			jest.requireActual<typeof import('corsair/http')>('corsair/http').request;
		const config: OpenAPIConfig = {
			BASE: 'https://api.apps-encodian.com',
			VERSION: 'v1',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
			TOKEN: undefined,
			HEADERS: {},
		};
		const options: ApiRequestOptions = {
			method: 'GET',
			url: '/api/v1/General/GetSubscriptionStatus',
		};
		const rateLimitConfig: RateLimitConfig = {
			enabled: true,
			maxRetries: 0,
			initialRetryDelay: 0,
			backoffMultiplier: 1,
			headerNames: { retryAfter: 'retry-after' },
		};
		// `unknown` because the actual shared transport rejects with a runtime ApiError.
		const error: unknown = await actualRequest<unknown>(config, options, {
			rateLimitConfig,
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) throw new Error('Expected ApiError');
		expect(error.retryAfter).toBe(4000);
		expect(fetchCount).toBe(1);
	});
});
