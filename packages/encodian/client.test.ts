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
