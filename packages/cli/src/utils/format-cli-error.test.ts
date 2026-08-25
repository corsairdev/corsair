import { formatCliError } from './format-cli-error';

describe('formatCliError', () => {
	it('uses the Error message with the [#corsair] prefix', () => {
		expect(formatCliError(new Error('token exchange failed'))).toBe(
			'[#corsair]: token exchange failed',
		);
	});

	it('stringifies a non-Error throwable', () => {
		expect(formatCliError('boom')).toBe('[#corsair]: boom');
	});

	it('stringifies a nullish rejection', () => {
		expect(formatCliError(undefined)).toBe('[#corsair]: undefined');
	});
});
