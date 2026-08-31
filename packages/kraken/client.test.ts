import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	KrakenAPIError,
	makeKrakenRequest,
	parseKrakenCredentials,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.MockedFunction<typeof request>;

function lastCall(): [OpenAPIConfig, ApiRequestOptions] {
	const call = mockRequest.mock.calls.at(-1);
	if (!call) throw new Error('request() was never called');
	return call as unknown as [OpenAPIConfig, ApiRequestOptions];
}

function apiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{ method: 'POST', url: 'url' },
		{
			url: 'https://api.kraken.io/v1/url',
			ok: false,
			status,
			statusText: 'Error',
			body: { message: 'boom' },
		},
		'Kraken request failed',
		{ retryAfter },
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('parseKrakenCredentials', () => {
	it('splits api_key:api_secret', () => {
		expect(parseKrakenCredentials('abc:def')).toEqual({
			apiKey: 'abc',
			apiSecret: 'def',
		});
	});

	it('handles secrets that themselves contain a colon', () => {
		expect(parseKrakenCredentials('abc:def:ghi')).toEqual({
			apiKey: 'abc',
			apiSecret: 'def:ghi',
		});
	});

	it('throws when there is no separator', () => {
		expect(() => parseKrakenCredentials('no-colon-here')).toThrow(
			KrakenAPIError,
		);
	});
});

describe('makeKrakenRequest', () => {
	const credentials = { apiKey: 'my-key', apiSecret: 'my-secret' };

	it('POSTs to the given endpoint with auth embedded in the JSON body', async () => {
		mockRequest.mockResolvedValue({ success: true, kraked_url: 'x' });

		await makeKrakenRequest('url', credentials, {
			url: 'https://ex.com/a.png',
		});

		const [config, options] = lastCall();
		expect(config.BASE).toBe('https://api.kraken.io');
		expect(options.method).toBe('POST');
		expect(options.url).toBe('url');
		expect(options.body).toEqual({
			url: 'https://ex.com/a.png',
			auth: { api_key: 'my-key', api_secret: 'my-secret' },
		});
	});

	it('never sends credentials via a bearer TOKEN or header', async () => {
		mockRequest.mockResolvedValue({ success: true });

		await makeKrakenRequest('user_status', credentials);

		const [config] = lastCall();
		expect(config.TOKEN).toBeUndefined();
		expect(config.HEADERS).toEqual({ 'Content-Type': 'application/json' });
	});

	it('returns the parsed body on success', async () => {
		mockRequest.mockResolvedValue({ success: true, quota_remaining: 100 });

		const result = await makeKrakenRequest('user_status', credentials);

		expect(result).toEqual({ success: true, quota_remaining: 100 });
	});

	it('throws KrakenAPIError when the body reports success: false', async () => {
		mockRequest.mockResolvedValue({
			success: false,
			message: 'Invalid api_key/api_secret pair',
		});

		await expect(
			makeKrakenRequest('user_status', credentials),
		).rejects.toMatchObject({
			name: 'KrakenAPIError',
			message: 'Invalid api_key/api_secret pair',
		});
	});

	it('wraps a transport-level ApiError, preserving status', async () => {
		mockRequest.mockRejectedValue(apiError(401));

		await expect(makeKrakenRequest('url', credentials)).rejects.toMatchObject({
			name: 'KrakenAPIError',
			status: 401,
			message: 'boom',
		});
	});

	it('preserves retryAfter (already in ms) from a transport-level ApiError', async () => {
		mockRequest.mockRejectedValue(apiError(429, 30_000));

		await expect(makeKrakenRequest('url', credentials)).rejects.toMatchObject({
			name: 'KrakenAPIError',
			status: 429,
			retryAfter: 30_000,
		});
	});

	it('wraps a non-ApiError failure without inventing a status', async () => {
		mockRequest.mockRejectedValue(new Error('socket hang up'));

		await expect(makeKrakenRequest('url', credentials)).rejects.toMatchObject({
			name: 'KrakenAPIError',
			message: 'socket hang up',
			status: undefined,
		});
	});
});
