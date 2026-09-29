import { getCodeInterpreterBaseUrl, parseRetryAfterMs } from './client';

describe('getCodeInterpreterBaseUrl', () => {
	it('defaults to the LibreChat code interpreter host', () => {
		expect(getCodeInterpreterBaseUrl()).toBe('https://code.librechat.ai/');
	});

	it('preserves path-prefixed self-hosted bases', () => {
		expect(getCodeInterpreterBaseUrl('https://host/api/v1')).toBe(
			'https://host/api/v1/',
		);
	});
});

describe('parseRetryAfterMs', () => {
	it('parses delay seconds', () => {
		expect(parseRetryAfterMs('30')).toBe(30_000);
	});

	it('parses HTTP-date values', () => {
		const future = new Date(Date.now() + 60_000).toUTCString();
		const parsed = parseRetryAfterMs(future);
		expect(parsed).toBeGreaterThan(59_000);
		expect(parsed).toBeLessThanOrEqual(60_000);
	});

	it('returns undefined for invalid values', () => {
		expect(parseRetryAfterMs('not-a-date')).toBeUndefined();
		expect(parseRetryAfterMs(null)).toBeUndefined();
	});
});
