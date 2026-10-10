import { ApiError, request } from 'corsair/http';
import { makeRootlyRequest, RootlyAPIError } from './client';

jest.mock('corsair/http', () => {
	const actual =
		jest.requireActual<typeof import('corsair/http')>('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockedRequest = jest.mocked(request);

describe('makeRootlyRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns structured object responses directly', async () => {
		const objectResponse = {
			data: {
				id: 'inc-123',
				type: 'incidents',
				attributes: { title: 'Outage' },
			},
		};
		mockedRequest.mockResolvedValueOnce(objectResponse);

		const result = await makeRootlyRequest<{ data: { id: string } }>(
			'incidents/inc-123',
			'test-key',
		);

		expect(result).toEqual(objectResponse);
	});

	it('preserves status and retryAfter metadata on 429 rate limit ApiError', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: 'incidents' },
			{
				url: 'https://api.rootly.com/v1/incidents',
				status: 429,
				statusText: 'Too Many Requests',
				body: { error: 'Rate limit exceeded' },
				ok: false,
			},
			'Too Many Requests',
			{ retryAfter: 2500 },
		);
		mockedRequest.mockRejectedValueOnce(apiError);

		// Justification for `unknown`: promise rejections are untyped, so the
		// rejection is typed `unknown` (never `any`), forcing the
		// `instanceof RootlyAPIError` narrowing that follows.
		const error = await makeRootlyRequest('incidents', 'test-key').catch(
			(err: unknown) => err,
		);

		expect(error).toBeInstanceOf(RootlyAPIError);
		if (!(error instanceof RootlyAPIError))
			throw new Error('expected RootlyAPIError');
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(2500);
		expect(error.isRateLimitError()).toBe(true);
		expect(error.cause).toBe(apiError);
	});

	it('preserves 401 status on authentication ApiError', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: 'incidents' },
			{
				url: 'https://api.rootly.com/v1/incidents',
				status: 401,
				statusText: 'Unauthorized',
				body: { error: 'Invalid token' },
				ok: false,
			},
			'Unauthorized',
		);
		mockedRequest.mockRejectedValueOnce(apiError);

		// Justification for `unknown`: promise rejections are untyped, so the
		// rejection is typed `unknown` (never `any`), forcing the
		// `instanceof RootlyAPIError` narrowing that follows.
		const error = await makeRootlyRequest('incidents', 'test-key').catch(
			(err: unknown) => err,
		);

		expect(error).toBeInstanceOf(RootlyAPIError);
		if (!(error instanceof RootlyAPIError))
			throw new Error('expected RootlyAPIError');
		expect(error.status).toBe(401);
		expect(error.isRateLimitError()).toBe(false);
	});

	it('wraps non-ApiError failures in RootlyAPIError', async () => {
		const networkError = new Error('socket hang up');
		mockedRequest.mockRejectedValueOnce(networkError);

		// Justification for `unknown`: promise rejections are untyped, so the
		// rejection is typed `unknown` (never `any`), forcing the
		// `instanceof RootlyAPIError` narrowing that follows.
		const error = await makeRootlyRequest('incidents', 'test-key').catch(
			(err: unknown) => err,
		);

		expect(error).toBeInstanceOf(RootlyAPIError);
		if (!(error instanceof RootlyAPIError))
			throw new Error('expected RootlyAPIError');
		expect(error.message).toBe('socket hang up');
		expect(error.status).toBeUndefined();
		expect(error.cause).toBe(networkError);
	});
});
