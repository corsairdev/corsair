import { AuthMissingError } from 'corsair/core';
import { request } from 'corsair/http';
import { BREVO_RATE_LIMIT_CONFIG, makeBrevoRequest } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

describe('makeBrevoRequest', () => {
	const mockRequest = request as jest.MockedFunction<typeof request>;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('rejects empty or whitespace API keys before calling the transport', async () => {
		await expect(makeBrevoRequest('account', '')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		await expect(makeBrevoRequest('account', '   ')).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('keeps Retry-After parsing without transport retries', async () => {
		mockRequest.mockResolvedValueOnce({} as never);
		await makeBrevoRequest('account', 'test-api-key');
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			{
				rateLimitConfig: BREVO_RATE_LIMIT_CONFIG,
			},
		);
		expect(BREVO_RATE_LIMIT_CONFIG.enabled).toBe(true);
		expect(BREVO_RATE_LIMIT_CONFIG.maxRetries).toBe(0);
	});
});
