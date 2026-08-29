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
		mockRequest.mockResolvedValue({ email: 'test@example.com', status: 'valid' });
	});

	describe('verifyEmail', () => {
		it('calls makeMailcheckRequest with correct args', async () => {
			const input = { email: 'test@example.com', verify: true, check_breach: false };
			await Mailcheck.verifyEmail(mockCtx, input);

			expect(mockRequest).toHaveBeenCalledWith('verify', 'test-api-key', {
				method: 'POST',
				body: {
					email: 'test@example.com',
					verify: true,
					check_breach: false,
				},
			});
		});

		it('uses defaults for optional params', async () => {
			const input = { email: 'user@domain.com' };
			await Mailcheck.verifyEmail(mockCtx, input);

			expect(mockRequest).toHaveBeenCalledWith('verify', 'test-api-key', {
				method: 'POST',
				body: {
					email: 'user@domain.com',
					verify: true,
					check_breach: false,
				},
			});
		});

		it('returns the response from the API', async () => {
			const response = { email: 'test@example.com', status: 'valid', mx_status: 'ok', smtp_status: 'ok' };
			mockRequest.mockResolvedValueOnce(response);

			const result = await Mailcheck.verifyEmail(mockCtx, { email: 'test@example.com' });
			expect(result).toEqual(response);
		});
	});

	describe('validateDomain', () => {
		it('calls makeMailcheckRequest with correct args', async () => {
			const input = { domain: 'example.com' };
			await Mailcheck.validateDomain(mockCtx, input);

			expect(mockRequest).toHaveBeenCalledWith('domain/example.com', 'test-api-key', {
				method: 'GET',
			});
		});

		it('returns the response from the API', async () => {
			const response = { domain: 'example.com', is_disposable: false, mx_records: true };
			mockRequest.mockResolvedValueOnce(response);

			const result = await Mailcheck.validateDomain(mockCtx, { domain: 'example.com' });
			expect(result).toEqual(response);
		});

		it('propagates ApiError', async () => {
			const apiError = new ApiError(429, 'Too Many Requests', 'Too Many Requests', undefined, {
				'Retry-After': '30',
			});
			mockRequest.mockRejectedValueOnce(apiError);

			await expect(
				Mailcheck.validateDomain(mockCtx, { domain: 'example.com' }),
			).rejects.toThrow(ApiError);
		});
	});
});