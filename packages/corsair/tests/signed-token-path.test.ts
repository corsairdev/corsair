import { describe, expect, it } from '@jest/globals';
import {
	decodeTokenFromPath,
	encodeTokenForPath,
} from '../hub/signing/signed-token';

describe('encodeTokenForPath', () => {
	it('encodes the payload/signature separator dot for Next.js path segments', () => {
		const token = 'eyJqdGkiOiJ0ZXN0In0.signature-part';
		expect(encodeTokenForPath(token)).toBe(
			'eyJqdGkiOiJ0ZXN0In0%2Esignature-part',
		);
	});

	it('round-trips through decodeTokenFromPath', () => {
		const token = 'payload.signature';
		const encoded = encodeTokenForPath(token);
		expect(decodeTokenFromPath(encoded)).toBe(token);
	});
});
