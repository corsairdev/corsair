import { redactEmail } from './client';

describe('redactEmail', () => {
	it('keeps the first character and domain, masks the rest', () => {
		expect(redactEmail('support@apilayer.net')).toBe('s***@apilayer.net');
	});

	it('fully redacts an address with no @', () => {
		expect(redactEmail('not-an-email')).toBe('***');
	});

	it('fully redacts an address that starts with @', () => {
		expect(redactEmail('@apilayer.net')).toBe('***');
	});
});
