import { redactEmail, redactIban } from './client';

describe('redactEmail', () => {
	it('keeps the first character and domain, masks the rest', () => {
		expect(redactEmail('support@abstractapi.com')).toBe('s***@abstractapi.com');
	});

	it('fully redacts an address with no @', () => {
		expect(redactEmail('not-an-email')).toBe('***');
	});
});

describe('redactIban', () => {
	it('keeps the country code and last 4 characters, masks the rest', () => {
		expect(redactIban('DE89370400440532013000')).toBe('DE****************3000');
	});

	it('strips whitespace before redacting', () => {
		expect(redactIban('DE89 3704 0044 0532 0130 00')).toBe(
			'DE****************3000',
		);
	});

	it('fully redacts a value too short to safely partially mask', () => {
		expect(redactIban('AB1234')).toBe('***');
	});
});
