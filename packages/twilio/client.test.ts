import { getTwilioAuthToken } from './client';

describe('getTwilioAuthToken', () => {
	it('returns a plain token unchanged', () => {
		expect(getTwilioAuthToken('token123')).toBe('token123');
	});

	it('returns the token part of sid:token', () => {
		expect(getTwilioAuthToken('AC123:token123')).toBe('token123');
	});

	it('keeps colons inside the token', () => {
		expect(getTwilioAuthToken('AC123:tok:en:123')).toBe('tok:en:123');
	});
});
