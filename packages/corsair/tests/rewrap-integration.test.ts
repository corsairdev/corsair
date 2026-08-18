import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	decryptDEK,
	decryptWithDEK,
	encryptDEK,
	encryptWithDEK,
	generateDEK,
} from '../core/auth/encryption';
import {
	rewrapIntegrationDek,
	rewrapIntegrationRow,
} from '../core/auth/rewrap-integration';

const DEV_KEK = 'dev-master-key-with-at-least-32-chars!!';
const PROD_KEK = 'prod-master-key-with-at-least-32-chars!';

describe('rewrapIntegrationDek', () => {
	it('re-wraps the DEK so it unwraps under the prod KEK to the same raw DEK', async () => {
		const rawDek = generateDEK();
		const wrappedDev = await encryptDEK(rawDek, DEV_KEK);

		const wrappedProd = await rewrapIntegrationDek(
			wrappedDev,
			DEV_KEK,
			PROD_KEK,
		);

		expect(await decryptDEK(wrappedProd, PROD_KEK)).toBe(rawDek);
	});

	it('throws on the wrong dev KEK instead of silently corrupting', async () => {
		const wrappedDev = await encryptDEK(generateDEK(), DEV_KEK);
		await expect(
			rewrapIntegrationDek(
				wrappedDev,
				'wrong-kek-still-32-characters-long!!!',
				PROD_KEK,
			),
		).rejects.toThrow();
	});
});

describe('rewrapIntegrationRow', () => {
	it('copies the secret config byte-for-byte and it still decrypts after re-wrap', async () => {
		const rawDek = generateDEK();
		const secretCipher = encryptWithDEK('xoxb-super-secret', rawDek);
		const row = {
			name: 'slack',
			dek: await encryptDEK(rawDek, DEV_KEK),
			config: { bot_token: secretCipher },
		};

		const migrated = await rewrapIntegrationRow(row, DEV_KEK, PROD_KEK);

		// config untouched
		expect(migrated.config).toEqual(row.config);
		expect(migrated.name).toBe('slack');
		// and the secret still decrypts once prod unwraps the re-wrapped DEK
		const prodRawDek = await decryptDEK(migrated.dek, PROD_KEK);
		expect(
			decryptWithDEK(migrated.config.bot_token as string, prodRawDek),
		).toBe('xoxb-super-secret');
	});

	it('works when dev and prod use the same KEK', async () => {
		const rawDek = generateDEK();
		const row = {
			name: 'github',
			dek: await encryptDEK(rawDek, DEV_KEK),
			config: {},
		};

		const migrated = await rewrapIntegrationRow(row, DEV_KEK, DEV_KEK);

		expect(await decryptDEK(migrated.dek, DEV_KEK)).toBe(rawDek);
	});

	it('throws when the row has no DEK to migrate', async () => {
		await expect(
			rewrapIntegrationRow(
				{ name: 'x', dek: null, config: {} },
				DEV_KEK,
				PROD_KEK,
			),
		).rejects.toThrow(/no DEK/i);
	});

	it('surfaces a clear, named error when the dev KEK is wrong', async () => {
		const row = {
			name: 'slack',
			dek: await encryptDEK(generateDEK(), DEV_KEK),
			config: {},
		};
		await expect(
			rewrapIntegrationRow(
				row,
				'wrong-kek-still-32-characters-long!!!',
				PROD_KEK,
			),
		).rejects.toThrow(/integration "slack".*CORSAIR_KEK/is);
	});
});

describe('rewrap-integration source', () => {
	it('never imports a secret-decrypting helper (config must stay sealed)', () => {
		const src = readFileSync(
			join(__dirname, '..', 'core', 'auth', 'rewrap-integration.ts'),
			'utf8',
		);
		expect(src).not.toMatch(
			/decryptConfig|decryptWithDEK|encryptConfig|reEncryptConfig/,
		);
	});
});
