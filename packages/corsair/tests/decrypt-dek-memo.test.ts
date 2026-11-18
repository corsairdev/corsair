const scryptCalls = { n: 0 };
jest.mock('crypto', () => {
	const actual = jest.requireActual('crypto');
	return {
		...actual,
		// unknown: a pass-through to crypto.scrypt, whose overloads take several argument shapes.
		scrypt: (...args: unknown[]) => {
			scryptCalls.n++;
			return actual.scrypt(...args);
		},
	};
});

import { decryptDEK, encryptDEK, generateDEK } from '../core/auth/encryption';

const KEK = 'test-kek-with-at-least-32-characters!!';

describe('decryptDEK memo', () => {
	it('returns the same key for the same ciphertext', async () => {
		const dek = generateDEK();
		const wrapped = await encryptDEK(dek, KEK);
		expect(await decryptDEK(wrapped, KEK)).toBe(dek);
		expect(await decryptDEK(wrapped, KEK)).toBe(dek);
	});

	it('a wrong kek still fails after the right one succeeded', async () => {
		const wrapped = await encryptDEK(generateDEK(), KEK);
		await decryptDEK(wrapped, KEK);
		await expect(
			decryptDEK(wrapped, 'another-kek-32-characters-long!!!'),
		).rejects.toThrow();
	});

	it('a rotated key (new ciphertext) is not served from the old entry', async () => {
		const a = generateDEK();
		const b = generateDEK();
		const wa = await encryptDEK(a, KEK);
		const wb = await encryptDEK(b, KEK);
		expect(await decryptDEK(wa, KEK)).toBe(a);
		expect(await decryptDEK(wb, KEK)).toBe(b);
	});

	it('failures are not cached', async () => {
		const wrapped = await encryptDEK(generateDEK(), KEK);
		const bad = 'x' + wrapped;
		scryptCalls.n = 0;
		await expect(decryptDEK(bad, KEK)).rejects.toThrow();
		await expect(decryptDEK(bad, KEK)).rejects.toThrow();
		expect(scryptCalls.n).toBe(2);
	});
});
