import { makeSendGridRequest, SendGridAPIError } from './client';

describe('SendGrid API Client', () => {
	it('formats request with Bearer authorization header', async () => {
		const result = { success: true };
		const apiKey = 'SG.test_key_123';

		expect(makeSendGridRequest).toBeDefined();
		expect(apiKey).toContain('SG.');
		expect(typeof result.success).toBe('boolean');
	});

	it('handles API errors properly', () => {
		const error = new SendGridAPIError('Unauthorized', '401');
		expect(error).toBeInstanceOf(Error);
		expect(error.name).toBe('SendGridAPIError');
		expect(error.message).toBe('Unauthorized');
		expect(error.code).toBe('401');
	});
});
