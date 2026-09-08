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

const mockedRequest = request as jest.MockedFunction<typeof request>;

describe('makeRootlyRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('parses raw JSON string responses into objects (JSON:API media type)', async () => {
		const rawString = JSON.stringify({
			data: {
				id: 'inc-123',
				type: 'incidents',
				attributes: { title: 'Outage' },
			},
		});
		mockedRequest.mockResolvedValueOnce(rawString as never);

		const result = await makeRootlyRequest<{ data: { id: string } }>(
			'incidents/inc-123',
			'test-key',
		);

		expect(result).toEqual({
			data: {
				id: 'inc-123',
				type: 'incidents',
				attributes: { title: 'Outage' },
			},
		});
	});

	it('returns structured object responses directly', async () => {
		const objectResponse = {
			data: {
				id: 'inc-123',
				type: 'incidents',
				attributes: { title: 'Outage' },
			},
		};
		mockedRequest.mockResolvedValueOnce(objectResponse as never);

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

		await expect(makeRootlyRequest('incidents', 'test-key')).rejects.toThrow(
			RootlyAPIError,
		);

		try {
			await makeRootlyRequest('incidents', 'test-key');
		} catch (error) {
			expect(error).toBeInstanceOf(RootlyAPIError);
			const rootlyError = error as RootlyAPIError;
			expect(rootlyError.status).toBe(429);
			expect(rootlyError.retryAfter).toBe(2500);
			expect(rootlyError.isRateLimitError()).toBe(true);
			expect(rootlyError.cause).toBe(apiError);
		}
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

		try {
			await makeRootlyRequest('incidents', 'test-key');
		} catch (error) {
			expect(error).toBeInstanceOf(RootlyAPIError);
			const rootlyError = error as RootlyAPIError;
			expect(rootlyError.status).toBe(401);
			expect(rootlyError.isRateLimitError()).toBe(false);
		}
	});
});
