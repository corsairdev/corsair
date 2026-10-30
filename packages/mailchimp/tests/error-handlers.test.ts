import { errorHandlers, getMailchimpErrorDetail } from '../error-handlers';
import { mockApiError } from './utils';

describe('mailchimp errorHandlers', () => {
	describe('RATE_LIMIT_ERROR (E-4)', () => {
		const handler = errorHandlers.RATE_LIMIT_ERROR;

		it('matches ApiError 429', () => {
			expect(
				handler.match(mockApiError(429, 'slow down', { retryAfter: 5000 })),
			).toBe(true);
		});

		it('matches a message containing "rate"', () => {
			expect(handler.match(new Error('Rate limited'))).toBe(true);
		});

		it('returns retry config with headersRetryAfterMs', async () => {
			const res = await handler.handler(
				mockApiError(429, 'rl', { retryAfter: 12_000 }),
			);
			expect(res.maxRetries).toBe(5);
			expect(res.headersRetryAfterMs).toBe(12_000);
		});
	});

	describe('AUTH_ERROR (E-1)', () => {
		const handler = errorHandlers.AUTH_ERROR;

		it('matches ApiError 401', () => {
			expect(handler.match(mockApiError(401, 'API key invalid'))).toBe(true);
		});

		it('matches an unauthorized message', () => {
			expect(handler.match(new Error('Unauthorized'))).toBe(true);
		});

		it('returns maxRetries 0 (no retry on auth failure)', async () => {
			expect((await handler.handler()).maxRetries).toBe(0);
		});
	});

	describe('PERMISSION_ERROR (E-2)', () => {
		const handler = errorHandlers.PERMISSION_ERROR;

		it('matches ApiError 403', () => {
			expect(handler.match(mockApiError(403, 'missing scope'))).toBe(true);
		});

		it('does not match a 404', () => {
			expect(handler.match(mockApiError(404, 'nope'))).toBe(false);
		});

		it('returns maxRetries 0', async () => {
			expect((await handler.handler()).maxRetries).toBe(0);
		});
	});

	describe('NOT_FOUND_ERROR (E-3)', () => {
		const handler = errorHandlers.NOT_FOUND_ERROR;

		it('matches ApiError 404', () => {
			expect(handler.match(mockApiError(404, 'resource not found'))).toBe(true);
		});

		it('returns maxRetries 0', async () => {
			expect((await handler.handler()).maxRetries).toBe(0);
		});
	});

	describe('VALIDATION_ERROR (E-5)', () => {
		const handler = errorHandlers.VALIDATION_ERROR;

		it('matches ApiError 400', () => {
			expect(
				handler.match(
					mockApiError(400, 'Invalid Resource', {
						errors: [{ field: 'email_address', message: 'required' }],
					}),
				),
			).toBe(true);
		});

		it('returns maxRetries 0', async () => {
			expect((await handler.handler()).maxRetries).toBe(0);
		});
	});

	describe('DEFAULT (E-8)', () => {
		it('matches unconditionally', () => {
			expect(errorHandlers.DEFAULT.match()).toBe(true);
		});

		it('returns maxRetries 0', async () => {
			expect((await errorHandlers.DEFAULT.handler()).maxRetries).toBe(0);
		});
	});
});

describe('getMailchimpErrorDetail (E-6, E-7)', () => {
	it('E-6: extracts the RFC-7807 detail', () => {
		expect(getMailchimpErrorDetail(mockApiError(404, 'List not found'))).toBe(
			'List not found',
		);
	});

	it('E-5: appends field-level errors[] messages', () => {
		const detail = getMailchimpErrorDetail(
			mockApiError(400, 'Invalid Resource', {
				errors: [
					{ field: 'email_address', message: 'is required' },
					{ field: 'status', message: 'is invalid' },
				],
			}),
		);
		expect(detail).toContain('Invalid Resource');
		expect(detail).toContain('email_address: is required');
		expect(detail).toContain('status: is invalid');
	});

	it('E-7: returns undefined for a non-ApiError', () => {
		expect(getMailchimpErrorDetail(new Error('boom'))).toBeUndefined();
	});
});
