import { request } from 'corsair/http';
import { makeTwoChatRequest, TwoChatAPIError } from './client';

// Mock corsair/http so we can control request() without real HTTP
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.Mock;

describe('makeTwoChatRequest — error wrapping', () => {
	beforeEach(() => jest.clearAllMocks());

	it('wraps a 429 ApiError into TwoChatAPIError preserving status and retryAfter', async () => {
		// ApiError cannot be instantiated directly without real ApiRequestOptions /
		// ApiResult, so we construct a plain Error that looks like an ApiError.
		const apiErr = Object.assign(new Error('rate limited'), {
			name: 'ApiError',
			status: 429,
			statusText: 'Too Many Requests',
			body: { message: 'rate limited' },
			retryAfter: 5_000,
			url: 'https://api.p.2chat.io/open/info',
			request: {},
		});
		// Make it pass the `instanceof ApiError` check
		Object.setPrototypeOf(
			apiErr,
			// eslint-disable-next-line @typescript-eslint/no-require-imports
			require('corsair/http').ApiError.prototype,
		);
		mockRequest.mockRejectedValueOnce(apiErr);

		let thrown: unknown;
		try {
			await makeTwoChatRequest('open/info', 'key');
		} catch (e) {
			thrown = e;
		}

		expect(thrown).toBeInstanceOf(TwoChatAPIError);
		const err = thrown as TwoChatAPIError;
		expect(err.status).toBe(429);
		expect(err.retryAfter).toBe(5_000);
		expect(err.code).toBe('429');
	});

	it('wraps a 401 ApiError into TwoChatAPIError with status 401', async () => {
		const apiErr = Object.assign(new Error('unauthorized'), {
			name: 'ApiError',
			status: 401,
			statusText: 'Unauthorized',
			body: {},
			url: 'https://api.p.2chat.io/open/info',
			request: {},
		});
		Object.setPrototypeOf(
			apiErr,
			// eslint-disable-next-line @typescript-eslint/no-require-imports
			require('corsair/http').ApiError.prototype,
		);
		mockRequest.mockRejectedValueOnce(apiErr);

		let thrown: unknown;
		try {
			await makeTwoChatRequest('open/info', 'key');
		} catch (e) {
			thrown = e;
		}

		expect(thrown).toBeInstanceOf(TwoChatAPIError);
		expect((thrown as TwoChatAPIError).status).toBe(401);
	});

	it('wraps a generic Error into TwoChatAPIError without a status', async () => {
		mockRequest.mockRejectedValueOnce(new Error('network failure'));

		let thrown: unknown;
		try {
			await makeTwoChatRequest('open/info', 'key');
		} catch (e) {
			thrown = e;
		}

		expect(thrown).toBeInstanceOf(TwoChatAPIError);
		expect((thrown as TwoChatAPIError).status).toBeUndefined();
		expect((thrown as TwoChatAPIError).message).toBe('network failure');
	});

	it('targets api.p.2chat.io and sets the X-User-API-Key header', async () => {
		mockRequest.mockResolvedValueOnce({});
		await makeTwoChatRequest('open/info', 'my-test-key');

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [config] = mockRequest.mock.calls[0]!;
		expect(config.BASE).toBe('https://api.p.2chat.io');
		expect(config.HEADERS['X-User-API-Key']).toBe('my-test-key');
	});
});
