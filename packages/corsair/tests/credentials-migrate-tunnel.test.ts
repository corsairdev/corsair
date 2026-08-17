import { createHmac, randomUUID } from 'node:crypto';
import { CORSAIR_INTERNAL } from '../core';
import { resetDeliveryReplayGuardForTests } from '../hub/internal/delivery-replay-guard';
import { processCorsair } from '../tunnel/index';
import { createTestDatabase } from './setup-db';

const SECRET = 'prod-signing-secret-with-32-plus-chars!!';

// Mirrors signDeliveryEnvelope (hub/signing/envelope.ts) exactly, but takes the
// type as a raw string so the test drives the wire format, not the TS union.
function signMigrateEnvelope(
	payload: unknown,
	secret = SECRET,
): { body: string; headers: Record<string, string> } {
	const body = JSON.stringify({ type: 'credentials.migrate', payload });
	const signature = createHmac('sha256', secret.trim())
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

function createCorsair(env: ReturnType<typeof createTestDatabase>) {
	return {
		[CORSAIR_INTERNAL]: {
			plugins: [],
			kek: 'test-kek-with-at-least-32-characters!!',
			multiTenancy: false,
			database: env.database,
		},
	};
}

async function readIntegration(
	env: ReturnType<typeof createTestDatabase>,
	name: string,
) {
	const rows = await env.db
		.selectFrom('corsair_integrations')
		.selectAll()
		.where('name', '=', name)
		.execute();
	return rows;
}

describe('processCorsair — credentials.migrate', () => {
	let env: ReturnType<typeof createTestDatabase>;

	beforeEach(() => {
		env = createTestDatabase();
		resetDeliveryReplayGuardForTests();
	});

	afterEach(() => env.cleanup());

	it('stores a migrated integration verbatim (dek + sealed config)', async () => {
		const corsair = createCorsair(env);
		const dek = 'prod-wrapped-dek::salt::iv::tag::data';
		const config = { bot_token: 'iv::tag::sealed-ciphertext' };

		const { body, headers } = signMigrateEnvelope({
			integrations: [{ name: 'slack', dek, config }],
		});
		const ack = await processCorsair(
			corsair,
			{ headers, body },
			{ signingSecret: SECRET },
		);

		expect(ack.status).toBe('ok');
		const rows = await readIntegration(env, 'slack');
		expect(rows).toHaveLength(1);
		expect(rows[0].dek).toBe(dek);
		expect(JSON.parse(rows[0].config as unknown as string)).toEqual(config);
	});

	it('upserts by name — a second delivery updates the same row', async () => {
		const corsair = createCorsair(env);

		const first = signMigrateEnvelope({
			integrations: [
				{ name: 'slack', dek: 'dek-v1', config: { bot_token: 'v1' } },
			],
		});
		await processCorsair(
			corsair,
			{ headers: first.headers, body: first.body },
			{ signingSecret: SECRET },
		);

		const second = signMigrateEnvelope({
			integrations: [
				{ name: 'slack', dek: 'dek-v2', config: { bot_token: 'v2' } },
			],
		});
		const ack = await processCorsair(
			corsair,
			{ headers: second.headers, body: second.body },
			{ signingSecret: SECRET },
		);

		expect(ack.status).toBe('ok');
		const rows = await readIntegration(env, 'slack');
		expect(rows).toHaveLength(1);
		expect(rows[0].dek).toBe('dek-v2');
		expect(JSON.parse(rows[0].config as unknown as string)).toEqual({
			bot_token: 'v2',
		});
	});

	it('rejects a forged signature and writes nothing', async () => {
		const corsair = createCorsair(env);
		// Signed with an attacker secret; the app verifies with its own SECRET.
		const { body, headers } = signMigrateEnvelope(
			{ integrations: [{ name: 'slack', dek: 'x', config: {} }] },
			'attacker-secret-with-32-plus-characters!',
		);

		const ack = await processCorsair(
			corsair,
			{ headers, body },
			{ signingSecret: SECRET },
		);

		expect(ack.status).toBe('failed');
		expect(await readIntegration(env, 'slack')).toHaveLength(0);
	});
});
