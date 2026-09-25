import { ApiError, request } from 'corsair/http';
import { makeRemoetRequest, REMOET_API_BASE, RemoetAPIError } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);

/**
 * Builds the error the core transport throws: its message is the fixed
 * status text, and Remoet's own explanation is only in `body.message`.
 */
function transportError(
	status: number,
	transportMessage: string,
	body: object,
	retryAfter?: number,
): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/user/full' },
		{
			url: `${REMOET_API_BASE}/user/full`,
			ok: false,
			status,
			statusText: transportMessage,
			body,
		},
		transportMessage,
		{ retryAfter },
	);
}

describe('Remoet client', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('sends GET requests to api.remoet.dev with a Bearer token', async () => {
		mockRequest.mockResolvedValueOnce({ match: null });

		await makeRemoetRequest('/user/job-context', 'secret-key', {
			method: 'GET',
			query: { url: 'https://example.com/jobs/1' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			{
				BASE: 'https://api.remoet.dev',
				VERSION: '1.0.0',
				WITH_CREDENTIALS: false,
				CREDENTIALS: 'omit',
				TOKEN: undefined,
				HEADERS: { Authorization: 'Bearer secret-key' },
			},
			{
				method: 'GET',
				url: '/user/job-context',
				body: undefined,
				query: { url: 'https://example.com/jobs/1' },
			},
			{
				rateLimitConfig: expect.objectContaining({
					enabled: true,
					maxRetries: 0,
					headerNames: { retryAfter: 'x-ratelimit-reset' },
				}),
			},
		);
	});

	it('passes write bodies through to the transport', async () => {
		mockRequest.mockResolvedValueOnce({ company: 'Starburst' });

		await makeRemoetRequest('/user/stars', 'secret-key', {
			method: 'POST',
			body: { companySlug: 'starburst' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			{
				method: 'POST',
				url: '/user/stars',
				body: { companySlug: 'starburst' },
				query: undefined,
			},
			expect.anything(),
		);
	});

	it('surfaces the Remoet message, status and retry delay on a 429', async () => {
		const body = {
			statusCode: 429,
			message: 'Rate limit exceeded',
			error: 'Too Many Requests',
		};
		mockRequest.mockRejectedValueOnce(
			transportError(429, 'Too Many Requests', body, 42_000),
		);

		await expect(
			makeRemoetRequest('/user/full', 'secret-key'),
		).rejects.toMatchObject({
			name: 'RemoetAPIError',
			message: 'Rate limit exceeded',
			status: 429,
			retryAfter: 42_000,
			body,
		});
	});

	it('surfaces the Remoet message on a 404', async () => {
		mockRequest.mockRejectedValueOnce(
			transportError(404, 'Not Found', {
				message: 'Link tree not found',
				error: 'Not Found',
				statusCode: 404,
			}),
		);

		await expect(
			makeRemoetRequest('/user/linktrees/missing', 'secret-key'),
		).rejects.toMatchObject({
			name: 'RemoetAPIError',
			message: 'Link tree not found',
			status: 404,
		});
	});

	it('falls back to the transport message when the body has none', async () => {
		mockRequest.mockRejectedValueOnce(
			transportError(401, 'Unauthorized', { statusCode: 401 }),
		);

		await expect(
			makeRemoetRequest('/user/full', 'bad-key'),
		).rejects.toMatchObject({ message: 'Unauthorized', status: 401 });
	});

	it('wraps unexpected failures without inventing a status', async () => {
		mockRequest.mockRejectedValueOnce(new Error('network down'));

		const call = makeRemoetRequest('/user/full', 'k');

		await expect(call).rejects.toBeInstanceOf(RemoetAPIError);
		await expect(call).rejects.toMatchObject({
			message: 'network down',
			status: undefined,
		});
	});
});
