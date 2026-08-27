import { normalizeBorneoBaseUrl } from './client';

describe('normalizeBorneoBaseUrl', () => {
	it('trims whitespace and trailing slashes', () => {
		expect(normalizeBorneoBaseUrl('  https://tenant.example.com///  ')).toBe(
			'https://tenant.example.com',
		);
	});

	it('rejects an empty base URL', () => {
		expect(() => normalizeBorneoBaseUrl('   ')).toThrow(
			'[borneo] baseUrl is required',
		);
	});

	it('rejects non-absolute URLs', () => {
		expect(() => normalizeBorneoBaseUrl('tenant.example.com')).toThrow(
			'[borneo] baseUrl must be a valid absolute HTTPS URL',
		);
	});

	it('rejects non-HTTPS URLs', () => {
		expect(() => normalizeBorneoBaseUrl('http://tenant.example.com')).toThrow(
			'[borneo] baseUrl must use https',
		);
	});
});
