import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';

const mockRequest = jest.fn();

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: (...args: unknown[]) => mockRequest(...args),
	};
});

import { makeMailcheckRequest } from './client';

const sampleResult = {
	email: 'user@example.com',
	trustRate: 95,
	mxExists: true,
	smtpExists: true,
	isNotDisposable: true,
	isNotSmtpCatchAll: true,
};

describe('makeMailcheckRequest', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue(sampleResult);
	});

	it('POSTs /v1/singleEmail:check with the email and Bearer token config', async () => {
		await makeMailcheckRequest('/v1/singleEmail:check', 'test-key', {
			method: 'POST',
			body: { email: 'user@example.com' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.mailcheck.co',
				TOKEN: 'test-key',
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/v1/singleEmail:check',
				body: { email: 'user@example.com' },
			}),
		);
	});

	it('throws AuthMissingError when the api key is missing', async () => {
		await expect(
			makeMailcheckRequest('/v1/singleEmail:check', '', {
				method: 'POST',
				body: { email: 'user@example.com' },
			}),
		).rejects.toThrow(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rethrows ApiError', async () => {
		const apiError = new ApiError(
			{ method: 'POST', url: '/v1/singleEmail:check' },
			{
				url: '/v1/singleEmail:check',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: 'rate limited',
			},
			'Too Many Requests',
		);
		mockRequest.mockRejectedValueOnce(apiError);

		await expect(
			makeMailcheckRequest('/v1/singleEmail:check', 'test-key', {
				method: 'POST',
				body: { email: 'user@example.com' },
			}),
		).rejects.toBe(apiError);
	});
});
