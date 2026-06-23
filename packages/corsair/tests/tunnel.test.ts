import { createHmac } from 'node:crypto';
import { CORSAIR_INTERNAL } from '../core';
import { processCorsair } from '../tunnel/index';
import { createTestDatabase } from './setup-db';

function createMockCorsair() {
	return {
		[CORSAIR_INTERNAL]: {
			plugins: [],
			kek: 'test-kek-with-at-least-32-characters!!',
		},
	};
}

function signBody(body: string, secret: string): string {
	return createHmac('sha256', secret).update(body).digest('hex');
}

async function ensurePermissionsTable(
	db: ReturnType<typeof createTestDatabase>['db'],
) {
	await db.schema
		.createTable('corsair_permissions')
		.ifNotExists()
		.addColumn('id', 'text', (column) => column.primaryKey())
		.addColumn('created_at', 'integer', (column) => column.notNull())
		.addColumn('updated_at', 'integer', (column) => column.notNull())
		.addColumn('token', 'text', (column) => column.notNull())
		.addColumn('plugin', 'text', (column) => column.notNull())
		.addColumn('endpoint', 'text', (column) => column.notNull())
		.addColumn('args', 'text', (column) => column.notNull())
		.addColumn('tenant_id', 'text', (column) => column.notNull())
		.addColumn('status', 'text', (column) => column.notNull())
		.addColumn('expires_at', 'text', (column) => column.notNull())
		.addColumn('error', 'text')
		.execute();
}

describe('processCorsair', () => {
	it('rejects unsigned tunnel requests by default', async () => {
		const body = JSON.stringify({
			type: 'webhook',
			payload: { headers: {}, body: '{}' },
		});

		const ack = await processCorsair(
			createMockCorsair(),
			{ headers: {}, body },
			{},
		);

		expect(ack.status).toBe('failed');
		expect(ack.error).toBe('Tunnel signing secret is required');
	});

	it('rejects tunnel requests when signingSecret is empty or whitespace', async () => {
		const body = JSON.stringify({
			type: 'webhook',
			payload: { headers: {}, body: '{}' },
		});

		for (const signingSecret of ['', '   ']) {
			const ack = await processCorsair(
				createMockCorsair(),
				{ headers: {}, body },
				{ signingSecret },
			);

			expect(ack.status).toBe('failed');
			expect(ack.error).toBe('Tunnel signing secret is required');
		}
	});

	it('accepts signed tunnel requests when signingSecret is provided', async () => {
		const secret = 'tunnel-signing-secret';
		const body = JSON.stringify({
			type: 'webhook',
			payload: { headers: {}, body: '{}' },
		});
		const signature = signBody(body, secret);

		const ack = await processCorsair(
			createMockCorsair(),
			{
				headers: { 'x-corsair-signature': `sha256=${signature}` },
				body,
			},
			{ signingSecret: secret },
		);

		expect(ack.error).not.toBe('Tunnel signing secret is required');
		expect(ack.error).not.toBe('Invalid tunnel signature');
	});

	it('allows unsigned requests when allowUnsignedTunnel is enabled', async () => {
		const body = JSON.stringify({
			type: 'webhook',
			payload: { headers: {}, body: '{}' },
		});

		const ack = await processCorsair(
			createMockCorsair(),
			{ headers: {}, body },
			{ allowUnsignedTunnel: true },
		);

		expect(ack.error).not.toBe('Tunnel signing secret is required');
	});
});

describe('processCorsair — permission decisions', () => {
	let env: ReturnType<typeof createTestDatabase>;

	beforeEach(async () => {
		env = createTestDatabase();
		await ensurePermissionsTable(env.db);
	});

	afterEach(() => env.cleanup());

	it('approves a pending permission via permission.approve tunnel', async () => {
		const secret = 'tunnel-signing-secret';
		const token = 'perm-token-abc';
		const expiresAt = new Date(Date.now() + 60_000).toISOString();

		await env.db
			.insertInto('corsair_permissions')
			.values({
				id: 'perm-1',
				created_at: new Date(),
				updated_at: new Date(),
				token,
				plugin: 'slack',
				endpoint: 'messages.delete',
				args: JSON.stringify({ channel: 'C1' }),
				tenant_id: 'default',
				status: 'pending',
				expires_at: expiresAt,
			})
			.execute();

		const body = JSON.stringify({
			type: 'permission.approve',
			payload: { token },
		});
		const signature = signBody(body, secret);

		const corsair = {
			[CORSAIR_INTERNAL]: {
				plugins: [],
				kek: 'test-kek-with-at-least-32-characters!!',
				database: env.database,
			},
		};

		const ack = await processCorsair(
			corsair,
			{
				headers: { 'x-corsair-signature': `sha256=${signature}` },
				body,
			},
			{ signingSecret: secret },
		);

		expect(ack.status).toBe('ok');

		const record = await env.db
			.selectFrom('corsair_permissions')
			.selectAll()
			.where('id', '=', 'perm-1')
			.executeTakeFirst();

		expect(record?.status).toBe('approved');
	});

	it('denies a pending permission via permission.deny tunnel', async () => {
		const secret = 'tunnel-signing-secret';
		const token = 'perm-token-deny';
		const expiresAt = new Date(Date.now() + 60_000).toISOString();

		await env.db
			.insertInto('corsair_permissions')
			.values({
				id: 'perm-2',
				created_at: new Date(),
				updated_at: new Date(),
				token,
				plugin: 'slack',
				endpoint: 'messages.delete',
				args: JSON.stringify({ channel: 'C1' }),
				tenant_id: 'default',
				status: 'pending',
				expires_at: expiresAt,
			})
			.execute();

		const body = JSON.stringify({
			type: 'permission.deny',
			payload: { token },
		});
		const signature = signBody(body, secret);

		const corsair = {
			[CORSAIR_INTERNAL]: {
				plugins: [],
				kek: 'test-kek-with-at-least-32-characters!!',
				database: env.database,
			},
		};

		const ack = await processCorsair(
			corsair,
			{
				headers: { 'x-corsair-signature': `sha256=${signature}` },
				body,
			},
			{ signingSecret: secret },
		);

		expect(ack.status).toBe('ok');

		const record = await env.db
			.selectFrom('corsair_permissions')
			.selectAll()
			.where('id', '=', 'perm-2')
			.executeTakeFirst();

		expect(record?.status).toBe('denied');
	});
});
