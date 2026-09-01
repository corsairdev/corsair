import { createCorsair } from '../core';
import { decryptDEK, encryptDEK, generateDEK } from '../core/auth/encryption';
import {
	CorsairKekMissingError,
	resolveKekAtInit,
} from '../core/auth/errors/kek-missing';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { createTestDatabase } from './setup-db';

describe('resolveKekAtInit', () => {
	it('preserves byte-exact KEK including surrounding whitespace', () => {
		const kek = '  test-kek  ';
		expect(resolveKekAtInit(kek, true)).toBe(kek);
	});

	it('does not trim KEK — a trimmed key cannot decrypt DEKs wrapped with the original', async () => {
		const kek = '  padded-kek  ';
		const encryptedDek = await encryptDEK(generateDEK(), kek);

		await expect(decryptDEK(encryptedDek, kek)).resolves.toEqual(
			expect.any(String),
		);
		await expect(decryptDEK(encryptedDek, kek.trim())).rejects.toThrow();
	});

	it('throws CorsairKekMissingError when database is configured without KEK', () => {
		expect(() => resolveKekAtInit(undefined, true)).toThrow(
			CorsairKekMissingError,
		);
		expect(() => resolveKekAtInit('', true)).toThrow(CorsairKekMissingError);
	});

	it('allows missing KEK when no database is configured', () => {
		expect(resolveKekAtInit(undefined, false)).toBe('');
	});
});

describe('createCorsair — KEK validation', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	it('throws CorsairKekMissingError at init when database is configured without KEK', () => {
		env = createTestDatabase();
		expect(() =>
			createCorsair({
				plugins: [],
				database: env.db,
			} as any),
		).toThrow(CorsairKekMissingError);
	});

	it('stores the byte-exact KEK on the internal config when database is configured', () => {
		env = createTestDatabase();
		const kek = '  byte-exact-kek  ';
		const corsair = createCorsair({
			plugins: [],
			database: env.db,
			kek,
		} as any);

		expect(getCorsairInternal(corsair).kek).toBe(kek);
	});
});
