import { ApiError, request } from 'corsair/http';
import {
	BetterProposalsAPIError,
	BetterProposalsRateLimitError,
	makeBetterProposalsRequest,
} from './client';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

describe('Better Proposals client and error handlers', () => {
	const mockRequest = request as jest.MockedFunction<typeof request>;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('makeBetterProposalsRequest sets Bptoken header and omits TOKEN', async () => {
		mockRequest.mockResolvedValueOnce({
			status: 'success',
			data: [],
		});

		const result = await makeBetterProposalsRequest('proposal', 'my_bp_token', {
			method: 'GET',
			query: { page: 1 },
		});

		expect(result).toEqual({ status: 'success', data: [] });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.betterproposals.io',
				HEADERS: { Bptoken: 'my_bp_token' },
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/proposal',
				query: { page: 1 },
			}),
		);
	});

	it('makeBetterProposalsRequest sends form urlencoded body on POST', async () => {
		mockRequest.mockResolvedValueOnce({
			status: 'success',
			data: { ID: '10' },
		});

		const result = await makeBetterProposalsRequest(
			'/company/create',
			'my_bp_token',
			{
				method: 'POST',
				body: { CompanyName: 'Test Inc' },
			},
		);

		expect(result).toEqual({ status: 'success', data: { ID: '10' } });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				method: 'POST',
				url: '/company/create',
				body: 'CompanyName=Test%20Inc',
				mediaType: 'application/x-www-form-urlencoded',
			}),
		);
	});

	it('throws BetterProposalsAPIError on 200 OK error payload', async () => {
		mockRequest.mockResolvedValueOnce({
			status: 'error',
			message: 'Invalid token',
		});

		await expect(
			makeBetterProposalsRequest('proposal', 'bad_token'),
		).rejects.toThrow(BetterProposalsAPIError);
	});

	it('throws BetterProposalsAPIError on HTTP ApiError', async () => {
		const apiError = new ApiError(
			{
				method: 'GET',
				url: 'https://api.betterproposals.io/proposal',
			},
			{
				status: 401,
				statusText: 'Unauthorized',
				url: 'https://api.betterproposals.io/proposal',
				ok: false,
				body: { message: 'Invalid token' },
			},
			'Unauthorized',
		);
		mockRequest.mockRejectedValueOnce(apiError);

		await expect(
			makeBetterProposalsRequest('proposal', 'bad_token'),
		).rejects.toThrow('Invalid token');
	});

	it('preserves Retry-After on HTTP 429', async () => {
		const apiError = new ApiError(
			{
				method: 'GET',
				url: 'https://api.betterproposals.io/proposal',
			},
			{
				status: 429,
				statusText: 'Too Many Requests',
				url: 'https://api.betterproposals.io/proposal',
				ok: false,
				body: { message: 'Too Many Requests' },
			},
			'Too Many Requests',
			{ retryAfter: 4000 },
		);
		mockRequest.mockRejectedValueOnce(apiError);

		const err = await makeBetterProposalsRequest('proposal', 'tok').catch(
			(error: unknown) => error,
		);
		expect(err).toBeInstanceOf(BetterProposalsRateLimitError);
		expect((err as BetterProposalsRateLimitError).retryAfterMs).toBe(4000);

		const res = await errorHandlers.RATE_LIMIT_ERROR.handler(
			err as BetterProposalsRateLimitError,
		);
		expect(res.headersRetryAfterMs).toBe(4000);
	});

	it('errorHandlers matches rate limit error', async () => {
		const err = new BetterProposalsRateLimitError('Rate limit exceeded', 2000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
		const res = await errorHandlers.RATE_LIMIT_ERROR.handler(err);
		expect(res.maxRetries).toBe(5);
		expect(res.headersRetryAfterMs).toBe(2000);
	});

	it('errorHandlers matches auth error', async () => {
		const err = new BetterProposalsAPIError('Invalid token', undefined, 401);
		expect(errorHandlers.AUTH_ERROR.match(err)).toBe(true);
		const res = await errorHandlers.AUTH_ERROR.handler();
		expect(res.maxRetries).toBe(0);
	});

	it('errorHandlers matches plan error', async () => {
		const err = new Error('Current Plan Not Supported');
		expect(errorHandlers.PLAN_ERROR.match(err)).toBe(true);
		const res = await errorHandlers.PLAN_ERROR.handler();
		expect(res.maxRetries).toBe(0);
	});

	it('errorHandlers matches client 4xx error', async () => {
		const err = new BetterProposalsAPIError(
			'Malformed request',
			undefined,
			400,
		);
		expect(errorHandlers.CLIENT_ERROR.match(err)).toBe(true);
		const res = await errorHandlers.CLIENT_ERROR.handler();
		expect(res.maxRetries).toBe(0);
	});

	it('errorHandlers matches server 5xx error', async () => {
		const err = new BetterProposalsAPIError('Server error', undefined, 500);
		expect(errorHandlers.SERVER_ERROR.match(err)).toBe(true);
		const res = await errorHandlers.SERVER_ERROR.handler();
		expect(res.maxRetries).toBe(2);
	});

	it('errorHandlers default matches anything else', async () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});
});
