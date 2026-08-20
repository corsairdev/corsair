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
import { signDeliveryEnvelope } from '../hub/signing/envelope';
import { processCorsair } from '../tunnel/index';
import { createTestDatabase } from './setup-db';

const DEV_KEK = 'dev-master-key-with-at-least-32-chars!!';
const PROD_KEK = 'prod-master-key-with-at-least-32-chars!';
const PROD_SIGNING_SECRET = 'prod-signing-secret-with-32-plus-chars!!';

// Sign with the real production signer so the test can never drift from it.
function signMigrateEnvelope(payload: unknown) {
	return signDeliveryEnvelope({
		projectId: 'proj_test',
		signingSecret: PROD_SIGNING_SECRET,
		type: 'credentials.migrate',
		payload,
	});
}

describe('dev → prod credential migration (end to end)', () => {
	it('re-keys a real integration so prod decrypts it with the prod KEK', async () => {
		resetDeliveryReplayGuardForTests();

		const dev = createTestDatabase();
		let prod: ReturnType<typeof createTestDatabase> | undefined;
		try {
			// 1. Seed a dev database with a real, dev-KEK-encrypted integration.
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

			// 2. Dev CLI reads the rows, parses the stored config (the CLI does this
			//    via parseConfig), and re-wraps them for the prod KEK. Only the
			//    integrations go on the wire.
			const rows = await dev.db
				.selectFrom('corsair_integrations')
				.select(['name', 'dek', 'config'])
				.execute();
			const { integrations } = await buildMigrationPayload(
				rows.map((r) => ({
					name: r.name,
					dek: r.dek,
					config:
						typeof r.config === 'string'
							? (JSON.parse(r.config) as Record<string, unknown>)
							: (r.config as Record<string, unknown>),
				})),
				DEV_KEK,
				PROD_KEK,
			);
			const migrationPayload = { integrations };

			// What the Hub relays must leak neither a KEK nor the plaintext secret.
			const onTheWire = JSON.stringify(migrationPayload);
			expect(onTheWire).not.toContain('xoxb-real-secret');
			expect(onTheWire).not.toContain(DEV_KEK);
			expect(onTheWire).not.toContain(PROD_KEK);

			// 3. Prod receives the signed delivery and stores it.
			prod = createTestDatabase();
			const prodInstance = {
				[CORSAIR_INTERNAL]: {
					plugins: [],
					kek: PROD_KEK,
					multiTenancy: false,
					database: prod.database,
				},
			};
			const { body, headers } = signMigrateEnvelope(migrationPayload);
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
		} finally {
			dev.cleanup();
			prod?.cleanup();
		}
	});
});
