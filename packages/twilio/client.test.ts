import { parseTwilioCredentials } from './client';

describe('parseTwilioCredentials', () => {
	it('treats a plain token without a separator as both sid and token', () => {
		expect(parseTwilioCredentials('mockauthtoken123')).toEqual({
			accountSid: 'mockauthtoken123',
			authToken: 'mockauthtoken123',
		});
	});

	it('splits an account sid and token on the first colon', () => {
		expect(parseTwilioCredentials('AC123:mockauthtoken123')).toEqual({
			accountSid: 'AC123',
			authToken: 'mockauthtoken123',
		});
	});

	it('keeps extra colons as part of the token', () => {
		expect(parseTwilioCredentials('AC123:my:secret:with:colons')).toEqual({
			accountSid: 'AC123',
			authToken: 'my:secret:with:colons',
		});
	});

	it('preserves a trailing colon section instead of truncating it', () => {
		const parsed = parseTwilioCredentials('AC123:part1:part2');
		expect(parsed.accountSid).toBe('AC123');
		expect(parsed.authToken).toBe('part1:part2');
	});
});
