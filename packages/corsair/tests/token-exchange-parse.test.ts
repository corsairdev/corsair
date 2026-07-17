import { parseTokenResponse } from '../core/auth/exchange';

describe('parseTokenResponse', () => {
	it('parses a JSON token response with numeric fields intact', () => {
		const result = parseTokenResponse(
			'{"access_token":"a","expires_in":3600,"token_type":"bearer"}',
		);
		expect(result).not.toBeNull();
		expect(result?.access_token).toBe('a');
		expect(result?.expires_in).toBe(3600);
	});

	it('parses GitHub form-urlencoded responses and coerces numeric fields', () => {
		// GitHub returns form-encoded unless Accept: application/json is honored.
		const result = parseTokenResponse(
			'access_token=ghu_x&expires_in=28800&refresh_token=ghr_y&refresh_token_expires_in=15897600&token_type=bearer',
		);
		expect(result).not.toBeNull();
		expect(result?.access_token).toBe('ghu_x');
		expect(result?.refresh_token).toBe('ghr_y');
		expect(result?.token_type).toBe('bearer');
		// numeric fields become numbers, not strings
		expect(result?.expires_in).toBe(28800);
		expect(result?.refresh_token_expires_in).toBe(15897600);
	});

	it('parses a form-urlencoded error response', () => {
		const result = parseTokenResponse(
			'error=bad_verification_code&error_description=The+code+is+incorrect',
		);
		expect(result).not.toBeNull();
		expect(result?.error).toBe('bad_verification_code');
	});

	it('returns null for a non-token body (e.g. an HTML error page)', () => {
		expect(parseTokenResponse('<html>Gateway Timeout</html>')).toBeNull();
	});
});
