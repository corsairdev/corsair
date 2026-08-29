import { ApiError } from 'corsair/http';
import type { MailcheckContext } from './index';

// Mock the client — endpoints go through checkSingleEmail
const mockCheckSingleEmail = jest.fn();
jest.mock('./client', () => ({
	checkSingleEmail: (...args: unknown[]) => mockCheckSingleEmail(...args),
}));

// Import after mocking — dynamic import avoids hoisting before the mock is installed
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Mailcheck } = require('./endpoints') as typeof import('./endpoints');

// Narrow assertion: mockCtx only needs key for endpoint tests
const mockCtx = {
	key: 'test-api-key',
} as MailcheckContext;

const sampleResult = {
	email: 'test@example.com',
	trustRate: 95,
	mxExists: true,
	smtpExists: true,
	isNotDisposable: true,
	isNotSmtpCatchAll: true,
};

describe('Mailcheck endpoints', () => {
	beforeEach(() => {
		mockCheckSingleEmail.mockReset();
		mockCheckSingleEmail.mockResolvedValue(sampleResult);
	});

	describe('verifyEmail', () => {
		it('calls checkSingleEmail with the requested email and context key', async () => {
			await Mailcheck.verifyEmail(mockCtx, { email: 'test@example.com' });

			expect(mockCheckSingleEmail).toHaveBeenCalledWith(
				'test@example.com',
				'test-api-key',
			);
		});

		it('returns the verification result', async () => {
			mockCheckSingleEmail.mockResolvedValueOnce(sampleResult);

			const result = await Mailcheck.verifyEmail(mockCtx, {
				email: 'test@example.com',
			});
			expect(result).toEqual(sampleResult);
		});

		it('propagates ApiError', async () => {
			const apiError = new ApiError(
				{ method: 'POST', url: '/v1/emails:check' },
				{
					url: '/v1/emails:check',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: 'rate limited',
				},
				'Too Many Requests',
			);
			mockCheckSingleEmail.mockRejectedValueOnce(apiError);

			await expect(
				Mailcheck.verifyEmail(mockCtx, { email: 'test@example.com' }),
			).rejects.toThrow(ApiError);
		});
	});

	describe('validateDomain', () => {
		it('checks admin@{domain} through checkSingleEmail', async () => {
			await Mailcheck.validateDomain(mockCtx, { domain: 'example.com' });

			expect(mockCheckSingleEmail).toHaveBeenCalledWith(
				'admin@example.com',
				'test-api-key',
			);
		});

		it('returns domain-relevant fields from the API', async () => {
			const response = {
				email: 'admin@example.com',
				trustRate: 80,
				mxExists: true,
				smtpExists: false,
				isNotDisposable: true,
				isNotSmtpCatchAll: false,
			};
			mockCheckSingleEmail.mockResolvedValueOnce(response);

			const result = await Mailcheck.validateDomain(mockCtx, {
				domain: 'example.com',
			});
			expect(result).toEqual(response);
		});
	});
});
