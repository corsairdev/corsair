import { formatProviderDisplayName } from '../core/constants';

describe('formatProviderDisplayName', () => {
	it('returns the mapped display name for a known provider (slack)', () => {
		expect(formatProviderDisplayName('slack')).toBe('Slack');
	});

	it('returns the mapped display name for a known provider (github)', () => {
		expect(formatProviderDisplayName('github')).toBe('GitHub');
	});

	it('returns the official display name for Semantic Scholar', () => {
		expect(formatProviderDisplayName('semanticscholar')).toBe(
			'Semantic Scholar',
		);
	});

	it('capitalises the first letter as fallback for an unknown provider', () => {
		expect(formatProviderDisplayName('acme')).toBe('Acme');
	});
});
