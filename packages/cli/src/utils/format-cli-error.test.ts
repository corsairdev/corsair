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

	it('collapses a multiline error message onto one line', () => {
		expect(formatCliError(new Error('line one\n  line two'))).toBe(
			'[#corsair]: line one line two',
		);
	});

	it('does not double-prefix an already prefixed message', () => {
		expect(formatCliError(new Error('[#corsair]: token exchange failed'))).toBe(
			'[#corsair]: token exchange failed',
		);
	});

	it('trims a trailing newline so the diagnostic has no trailing space', () => {
		expect(formatCliError(new Error('hello\n'))).toBe('[#corsair]: hello');
	});
});
