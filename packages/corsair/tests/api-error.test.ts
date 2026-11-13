import { ApiError } from '../async-core/ApiError';
import type { ApiRequestOptions } from '../async-core/ApiRequestOptions';
import type { ApiResult } from '../async-core/ApiResult';

describe('ApiError Redaction', () => {
	it('should redact sensitive query parameters from both URL and request query', () => {
		const request: ApiRequestOptions = {
			method: 'GET',
			url: '/v1/test',
			query: {
				api_key: 'secret-key-123',
				token: 'secret-token-abc',
				appid: 'secret-appid-xyz',
				key: 'secret-key-xyz',
				normal_param: 'public-data',
			},
		};

		const response: ApiResult = {
			url: 'https://api.example.com/v1/test?api_key=secret-key-123&token=secret-token-abc&appid=secret-appid-xyz&key=secret-key-xyz&normal_param=public-data',
			ok: false,
			status: 401,
			statusText: 'Unauthorized',
			body: { error: 'Invalid auth' },
		};

		const apiError = new ApiError(request, response, 'Unauthorized');

		expect(apiError.url).not.toContain('secret-key-123');
		expect(apiError.url).not.toContain('secret-token-abc');
		expect(apiError.url).not.toContain('secret-appid-xyz');
		expect(apiError.url).not.toContain('secret-key-xyz');
		expect(apiError.url).toContain('api_key=%5BREDACTED%5D');
		expect(apiError.url).toContain('token=%5BREDACTED%5D');
		expect(apiError.url).toContain('appid=%5BREDACTED%5D');
		expect(apiError.url).toContain('key=%5BREDACTED%5D');
		expect(apiError.url).toContain('normal_param=public-data');

		expect(apiError.request.query).toBeDefined();
		expect(apiError.request.query?.api_key).toBe('[REDACTED]');
		expect(apiError.request.query?.token).toBe('[REDACTED]');
		expect(apiError.request.query?.appid).toBe('[REDACTED]');
		expect(apiError.request.query?.key).toBe('[REDACTED]');
		expect(apiError.request.query?.normal_param).toBe('public-data');

		expect(request.query?.api_key).toBe('secret-key-123');
		expect(request.query?.token).toBe('secret-token-abc');
		expect(apiError.request).not.toBe(request);
		expect(apiError.request.query).not.toBe(request.query);
	});

	it('should handle case-insensitive query parameter matching', () => {
		const request: ApiRequestOptions = {
			method: 'GET',
			url: '/v1/test',
			query: {
				API_KEY: 'secret-key-123',
			},
		};

		const response: ApiResult = {
			url: 'https://api.example.com/v1/test?API_KEY=secret-key-123',
			ok: false,
			status: 401,
			statusText: 'Unauthorized',
			body: { error: 'Invalid auth' },
		};

		const apiError = new ApiError(request, response, 'Unauthorized');

		expect(apiError.url).not.toContain('secret-key-123');
		expect(apiError.url).toContain('API_KEY=%5BREDACTED%5D');
		expect(apiError.request.query?.API_KEY).toBe('[REDACTED]');
	});

	it('should handle relative URLs and no query params without crashing', () => {
		const request: ApiRequestOptions = {
			method: 'GET',
			url: '/v1/test',
		};

		const response: ApiResult = {
			url: '/v1/test',
			ok: false,
			status: 404,
			statusText: 'Not Found',
			body: { error: 'Not found' },
		};

		const apiError = new ApiError(request, response, 'Not Found');

		expect(apiError.url).toBe('/v1/test');
		expect(apiError.request).toBe(request);
		expect(apiError.request.query).toBeUndefined();
	});

	it('should redact sensitive params embedded in request.url', () => {
		const request: ApiRequestOptions = {
			method: 'GET',
			url: '/v1/test?token=secret-in-url&normal_param=public-data',
		};

		const response: ApiResult = {
			url: 'https://api.example.com/v1/test',
			ok: false,
			status: 401,
			statusText: 'Unauthorized',
			body: { error: 'Invalid auth' },
		};

		const apiError = new ApiError(request, response, 'Unauthorized');

		expect(apiError.request.url).not.toContain('secret-in-url');
		expect(apiError.request.url).toContain('token=%5BREDACTED%5D');
		expect(apiError.request.url).toContain('normal_param=public-data');
		expect(request.url).toContain('secret-in-url');
	});

	it('should redact sensitive params from malformed response URLs', () => {
		const request: ApiRequestOptions = {
			method: 'GET',
			url: '/v1/test',
		};

		const response: ApiResult = {
			url: 'http://[::1/?token=secret&normal_param=public-data#frag',
			ok: false,
			status: 401,
			statusText: 'Unauthorized',
			body: { error: 'Invalid auth' },
		};

		const apiError = new ApiError(request, response, 'Unauthorized');

		expect(apiError.url).not.toContain('secret');
		expect(apiError.url).toContain('token=[REDACTED]');
		expect(apiError.url).toContain('normal_param=public-data');
		expect(apiError.url).toContain('#frag');
	});
});

describe('ApiError redaction of spelling variants', () => {
	it.each([
		'apiKey',
		'API_KEY',
		'x-api-key',
		'accessToken',
		'access_token',
		'apiToken',
		'client_secret',
		'password',
	])('redacts %s in the URL and the query', (name) => {
		const request: ApiRequestOptions = {
			method: 'GET',
			url: `/v1/events?${name}=s3cr3t&page=2`,
			query: { [name]: 's3cr3t', page: 2 },
		};
		const response: ApiResult = {
			url: `https://api.example.com/v1/events?${name}=s3cr3t&page=2`,
			ok: false,
			status: 404,
			statusText: 'Not Found',
			body: { message: 'no such route' },
		};

		const apiError = new ApiError(request, response, 'Not Found');

		expect(apiError.url).not.toContain('s3cr3t');
		expect(apiError.request.url).not.toContain('s3cr3t');
		expect(apiError.request.query?.[name]).toBe('[REDACTED]');
		expect(apiError.url).toContain('page=2');
		expect(apiError.request.query?.page).toBe(2);
	});

	it('leaves look-alike names alone', () => {
		const request: ApiRequestOptions = {
			method: 'GET',
			url: '/v1/items',
			query: { page_token: 'p2', keyword: 'shoes', monkey: 'yes' },
		};
		const response: ApiResult = {
			url: 'https://api.example.com/v1/items?page_token=p2&keyword=shoes',
			ok: false,
			status: 500,
			statusText: 'Internal Server Error',
			body: undefined,
		};

		const apiError = new ApiError(request, response, 'boom');

		expect(apiError.request).toBe(request);
		expect(apiError.url).toBe(response.url);
	});
});
