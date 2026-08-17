import { createHmac, randomUUID } from 'node:crypto';
import { CORSAIR_INTERNAL } from '../core';
import {
	decryptDEK,
	decryptWithDEK,
	encryptDEK,
	encryptWithDEK,
	generateDEK,
} from '../core/auth/encryption';
import { buildMigrationPayload } from '../hub/credentials-migrate-client';
import { resetDeliveryReplayGuardForTests } from '../hub/internal/delivery-replay-guard';
import { processCorsair } from '../tunnel/index';
import { createTestDatabase } from './setup-db';

const DEV_KEK = 'dev-master-key-with-at-least-32-chars!!';
const PROD_KEK = 'prod-master-key-with-at-least-32-chars!';
const PROD_SIGNING_SECRET = 'prod-signing-secret-with-32-plus-chars!!';

// Faithful copy of signDeliveryEnvelope's HMAC, taking a raw string type.
function signMigrateEnvelope(payload: unknown): {
	body: string;
	headers: Record<string, string>;
} {
	const body = JSON.stringify({ type: 'credentials.migrate', payload });
	const signature = createHmac('sha256', PROD_SIGNING_SECRET.trim())
		.update(body)
		.digest('hex');
	return {
		body,
		headers: {
			'x-corsair-signature': `sha256=${signature}`,
			'x-corsair-timestamp': String(Math.floor(Date.now() / 1000)),
			'x-corsair-nonce': randomUUID(),
		},
	};
}

describe('dev → prod credential migration (end to end)', () => {
	it('re-keys a real integration so prod decrypts it with the prod KEK', async () => {
		resetDeliveryReplayGuardForTests();

		// 1. Seed a dev database with a real, dev-KEK-encrypted integration.
		const dev = createTestDatabase();
		const rawDek = generateDEK();
		await dev.db
			.insertInto('corsair_integrations')
			.values({
				id: 'int-slack',
				created_at: new Date(),
				updated_at: new Date(),
				name: 'slack',
				config: { bot_token: encryptWithDEK('xoxb-real-secret', rawDek) },
				dek: await encryptDEK(rawDek, DEV_KEK),
			})
			.execute();

		// 2. Dev CLI reads the rows and re-wraps them for the prod KEK.
		const rows = await dev.db
			.selectFrom('corsair_integrations')
			.select(['name', 'dek', 'config'])
			.execute();
		const payload = await buildMigrationPayload(
			rows.map((r) => ({
				name: r.name,
				dek: r.dek,
				config: r.config as Record<string, unknown>,
			})),
			DEV_KEK,
			PROD_KEK,
		);

		// What the Hub relays must leak neither a KEK nor the plaintext secret.
		const onTheWire = JSON.stringify(payload);
		expect(onTheWire).not.toContain('xoxb-real-secret');
		expect(onTheWire).not.toContain(DEV_KEK);
		expect(onTheWire).not.toContain(PROD_KEK);

		// 3. Prod receives the signed delivery and stores it.
		const prod = createTestDatabase();
		const prodInstance = {
			[CORSAIR_INTERNAL]: {
				plugins: [],
				kek: PROD_KEK,
				multiTenancy: false,
				database: prod.database,
			},
		};
		const { body, headers } = signMigrateEnvelope(payload);
		const ack = await processCorsair(
			prodInstance,
			{ headers, body },
			{ signingSecret: PROD_SIGNING_SECRET },
		);
		expect(ack.status).toBe('ok');

		// 4. Prod can decrypt the secret using ONLY its prod KEK.
		const stored = await prod.db
			.selectFrom('corsair_integrations')
			.selectAll()
			.where('name', '=', 'slack')
			.executeTakeFirstOrThrow();
		const prodRawDek = await decryptDEK(stored.dek as string, PROD_KEK);
		const config = JSON.parse(stored.config as unknown as string) as {
			bot_token: string;
		};
		expect(decryptWithDEK(config.bot_token, prodRawDek)).toBe(
			'xoxb-real-secret',
		);

		// 5. The dev KEK must NOT be able to open the prod-stored DEK.
		await expect(decryptDEK(stored.dek as string, DEV_KEK)).rejects.toThrow();

		dev.cleanup();
		prod.cleanup();
	});
});
