import {
	decryptDEK,
	decryptWithDEK,
	encryptDEK,
	encryptWithDEK,
	generateDEK,
} from '../core/auth/encryption';
import {
	buildMigrationPayload,
	generateProdKek,
} from '../hub/credentials-migrate-client';

const DEV_KEK = 'dev-master-key-with-at-least-32-chars!!';
const PROD_KEK = 'prod-master-key-with-at-least-32-chars!';

describe('generateProdKek', () => {
	it('returns a fresh 256-bit key each call', () => {
		const a = generateProdKek();
		const b = generateProdKek();
		expect(a).not.toBe(b);
		expect(Buffer.from(a, 'base64')).toHaveLength(32);
	});
});

describe('buildMigrationPayload', () => {
	it('re-wraps each row so secrets stay decryptable under the prod KEK', async () => {
		const rawDek = generateDEK();
		const rows = [
			{
				name: 'slack',
				dek: await encryptDEK(rawDek, DEV_KEK),
				config: { bot_token: encryptWithDEK('xoxb-secret', rawDek) },
			},
		];

		const payload = await buildMigrationPayload(rows, DEV_KEK, PROD_KEK);

		expect(payload.integrations).toHaveLength(1);
		const [migrated] = payload.integrations;
		if (!migrated) throw new Error('expected one migrated integration');
		const prodRaw = await decryptDEK(migrated.dek, PROD_KEK);
		expect(decryptWithDEK(migrated.config.bot_token as string, prodRaw)).toBe(
			'xoxb-secret',
		);
	});

	it('skips rows with no DEK (nothing to migrate)', async () => {
		const rawDek = generateDEK();
		const rows = [
			{ name: 'slack', dek: await encryptDEK(rawDek, DEV_KEK), config: {} },
			{ name: 'empty', dek: null, config: {} },
		];

		const payload = await buildMigrationPayload(rows, DEV_KEK, PROD_KEK);

		expect(payload.integrations.map((i) => i.name)).toEqual(['slack']);
	});

	it('never leaks a KEK or plaintext secret into the payload', async () => {
		const rawDek = generateDEK();
		const rows = [
			{
				name: 'slack',
				dek: await encryptDEK(rawDek, DEV_KEK),
				config: { bot_token: encryptWithDEK('xoxb-PLAINTEXT-SECRET', rawDek) },
			},
		];

		const serialized = JSON.stringify(
			await buildMigrationPayload(rows, DEV_KEK, PROD_KEK),
		);

		expect(serialized).not.toContain('xoxb-PLAINTEXT-SECRET');
		expect(serialized).not.toContain(DEV_KEK);
		expect(serialized).not.toContain(PROD_KEK);
	});
});
