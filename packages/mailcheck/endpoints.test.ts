import { ApiError } from 'corsair/http';
import type { MailcheckContext } from './index';

// Mock makeMailcheckRequest
const mockRequest = jest.fn();
jest.mock('./client', () => ({
	makeMailcheckRequest: (...args: unknown[]) => mockRequest(...args),
}));

// Import after mocking — dynamic import avoids hoisting before the mock is installed
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Mailcheck } = require('./endpoints') as typeof import('./endpoints');

// Narrow assertion: mockCtx only needs key for endpoint tests
const mockCtx = {
	key: 'test-api-key',
} as MailcheckContext;

describe('Mailcheck endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ email: 'test@example.com', trustRate: 95, mxExists: true, smtpExists: true, isNotDisposable: true, isNotSmtpCatchAll: true });
	});

	describe('verifyEmail', () => {
		it('calls makeMailcheckRequest with correct args', async () => {
			const input = { email: 'test@example.com' };
			await Mailcheck.verifyEmail(mockCtx, input);

			expect(mockRequest).toHaveBeenCalledWith('/v1/emails:checkSingle', 'test-api-key', {
				method: 'POST',
				body: { email: 'test@example.com' },
			});
		});

		it('returns the response from the API', async () => {
			const response = { email: 'test@example.com', trustRate: 95, mxExists: true, smtpExists: true, isNotDisposable: true, isNotSmtpCatchAll: true };
			mockRequest.mockResolvedValueOnce(response);

			const result = await Mailcheck.verifyEmail(mockCtx, { email: 'test@example.com' });
			expect(result).toEqual(response);
		});

		it('propagates ApiError', async () => {
			const apiError = new ApiError(
				{ method: 'POST', url: '/v1/emails:checkSingle' },
				{ url: '/v1/emails:checkSingle', ok: false, status: 429, statusText: 'Too Many Requests', body: 'rate limited' },
				'Too Many Requests',
			);
			mockRequest.mockRejectedValueOnce(apiError);

			await expect(
				Mailcheck.verifyEmail(mockCtx, { email: 'test@example.com' }),
			).rejects.toThrow(ApiError);
		});
	});

	describe('validateDomain', () => {
		it('calls makeMailcheckRequest with admin@domain email', async () => {
			const input = { domain: 'example.com' };
			await Mailcheck.validateDomain(mockCtx, input);

			expect(mockRequest).toHaveBeenCalledWith('/v1/emails:checkSingle', 'test-api-key', {
				method: 'POST',
				body: { email: 'admin@example.com' },
			});
		});

		it('returns domain-relevant fields from API', async () => {
			const response = { email: 'admin@example.com', trustRate: 80, mxExists: true, smtpExists: false, isNotDisposable: true, isNotSmtpCatchAll: false };
			mockRequest.mockResolvedValueOnce(response);

			const result = await Mailcheck.validateDomain(mockCtx, { domain: 'example.com' });
			expect(result).toEqual(response);
		});
	});
});