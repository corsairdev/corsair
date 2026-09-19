import { slack } from '@corsair-dev/slack';
import { createCorsair } from '../core';
import { decryptDEK, encryptDEK, generateDEK } from '../core/auth/encryption';
import { CorsairKekMissingError } from '../core/auth/errors/kek-missing';
import { createMissingConfigProxy } from '../core/auth/errors/missing-config';
import { signState, verifyAndDecodeState } from '../core/auth/state';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { createTestDatabase } from './setup-db';

describe('createCorsair — KEK validation', () => {
	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env.cleanup());

	// Construction is lenient (see core/index.ts): an empty/omitted kek is allowed
	// so plugin-only clients and env-less build steps work; the kek is enforced at
	// use — key access (below) and OAuth state signing (separate describe).
	it('constructs with a database but no KEK (deferred to key access)', () => {
		env = createTestDatabase();
		expect(() =>
			createCorsair({
				plugins: [slack({ authType: 'api_key', key: 'fake-key' })],
				database: env.db,
				multiTenancy: false,
			}),
		).not.toThrow();
	});

	it('constructs successfully with plugin-only config (no database, no kek)', () => {
		expect(() =>
			createCorsair({
				plugins: [slack({ authType: 'api_key', key: 'fake-key' })],
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

describe('OAuth state signing — KEK enforcement', () => {
	it('signState throws when the KEK is empty', () => {
		expect(() => signState('plugin:tenant', '')).toThrow(
			/OAuth state signing requires a configured kek/,
		);
	});

	it('verifyAndDecodeState rejects when the KEK is empty', () => {
		const signed = signState('plugin:tenant', 'a-real-kek');
		expect(verifyAndDecodeState(signed, '')).toBeNull();
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
