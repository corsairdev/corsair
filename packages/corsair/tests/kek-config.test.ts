import { slack } from '@corsair-dev/slack';
import { createCorsair } from '../core';
import { decryptDEK, encryptDEK, generateDEK } from '../core/auth/encryption';
import { CorsairKekMissingError } from '../core/auth/errors/kek-missing';
import { createMissingConfigProxy } from '../core/auth/errors/missing-config';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { createTestDatabase } from './setup-db';

describe('createCorsair — KEK validation', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env.cleanup());

	it('does not throw at construction when the KEK is empty', () => {
		env = createTestDatabase();
		expect(() =>
			createCorsair({
				plugins: [slack({ authType: 'api_key', key: 'fake-key' })],
				database: env.db,
				kek: '',
				multiTenancy: false,
			}),
		).not.toThrow();
	});

	it('stores the byte-exact KEK on the internal config', () => {
		env = createTestDatabase();
		const kek = '  byte-exact-kek  ';
		const corsair = createCorsair({
			plugins: [slack({ authType: 'api_key', key: 'fake-key' })],
			database: env.db,
			kek,
			multiTenancy: false,
		});

		expect(getCorsairInternal(corsair).kek).toBe(kek);
	});
});

describe('createMissingConfigProxy', () => {
	it('throws CorsairKekMissingError on access when a database is configured without a KEK', () => {
		const keys = createMissingConfigProxy<Record<string, unknown>>(true, false);
		expect(() => keys.get_integration_credentials).toThrow(
			CorsairKekMissingError,
		);
	});

	it('reports both missing pieces when database and KEK are absent', () => {
		const keys = createMissingConfigProxy<Record<string, unknown>>(
			false,
			false,
		);
		expect(() => keys.get_integration_credentials).toThrow(/database and kek/);
	});
});

describe('KEK byte-exactness', () => {
	it('a trimmed KEK cannot decrypt DEKs wrapped with the original', async () => {
		const kek = '  padded-kek  ';
		const dek = generateDEK();
		const encryptedDek = await encryptDEK(dek, kek);

		await expect(decryptDEK(encryptedDek, kek)).resolves.toBe(dek);
		await expect(decryptDEK(encryptedDek, kek.trim())).rejects.toThrow();
	});
});
