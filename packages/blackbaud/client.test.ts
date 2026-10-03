import { ApiError, request } from 'corsair/http';
import { BlackbaudAPIError, makeBlackbaudRequest } from './client';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);

beforeEach(() => {
	jest.clearAllMocks();
});

describe('makeBlackbaudRequest URL construction', () => {
	it('joins relative endpoints onto the SKY API base', async () => {
		mockRequest.mockResolvedValue({ id: 'g1' });

		await makeBlackbaudRequest('gift/v1/gifts/g1', 'token', {
			subscriptionKey: 'sub-key',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://api.sky.blackbaud.com' }),
			expect.objectContaining({ url: 'gift/v1/gifts/g1' }),
		);
	});

	it('keeps absolute endpoints absolute (origin plus pathname)', async () => {
		mockRequest.mockResolvedValue({ issuer: 'x' });

		await makeBlackbaudRequest(
			'https://oauth2.sky.blackbaud.com/.well-known/openid-configuration',
			'token',
		);

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://oauth2.sky.blackbaud.com' }),
			expect.objectContaining({
				url: '/.well-known/openid-configuration',
			}),
		);
		const calledUrl = mockRequest.mock.calls[0]?.[1]?.url ?? '';
		expect(calledUrl).not.toContain('https://oauth2');
	});

	it('sends bearer and subscription headers', async () => {
		mockRequest.mockResolvedValue({});

		await makeBlackbaudRequest('gift/v1/gifts', 'token', {
			subscriptionKey: 'sub-key',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer token',
					'Bb-Api-Subscription-Key': 'sub-key',
				}),
			}),
			expect.anything(),
		);
	});

	it('rethrows ApiError unchanged and wraps other errors', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: 'gift/v1/gifts/g1' },
			{
				url: 'gift/v1/gifts/g1',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { message: 'rate limited' },
			},
			'Too Many Requests',
		);
		mockRequest.mockRejectedValueOnce(apiError);
		await expect(makeBlackbaudRequest('gift/v1/gifts/g1', 't')).rejects.toBe(
			apiError,
		);

		mockRequest.mockRejectedValueOnce(new Error('boom'));
		await expect(
			makeBlackbaudRequest('gift/v1/gifts/g1', 't'),
		).rejects.toBeInstanceOf(BlackbaudAPIError);
	});
});
