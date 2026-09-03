import {
	CONNECT_REQUEST_TTL_MS,
	clearConnectRequest,
	readConnectRequest,
	recordConnectRequest,
	recordConnectRequestBestEffort,
} from '../core/connect-request/store';
import type { CorsairDatabase } from '../db/kysely/database';
import { createTestDatabase } from './setup-db';

// A connect event's account_id is a foreign key into corsair_accounts, resolved
// from (tenant, plugin). Setup guarantees the row exists before a link is minted;
// the tests reproduce that invariant here.
async function seedAccount(
	database: CorsairDatabase,
	tenantId: string,
	plugin: string,
): Promise<void> {
	const now = new Date();
	const integrationId = `int-${plugin}`;
	const existing = await database.db
		.selectFrom('corsair_integrations')
		.select('id')
		.where('name', '=', plugin)
		.executeTakeFirst();
	if (!existing) {
		await database.db
			.insertInto('corsair_integrations')
			.values({
				id: integrationId,
				name: plugin,
				config: {},
				created_at: now,
				updated_at: now,
			})
			.execute();
	}
	await database.db
		.insertInto('corsair_accounts')
		.values({
			id: `acct-${tenantId}-${plugin}`,
			tenant_id: tenantId,
			integration_id: existing?.id ?? integrationId,
			config: {},
			created_at: now,
			updated_at: now,
		})
		.execute();
}

describe('connect-request store', () => {
	it('records a request and reads it back for the tenant', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database, 'acme', 'linear');
			await recordConnectRequest(database, {
				tenantId: 'acme',
				plugin: 'linear',
				connectUrl: 'https://hub.corsair.dev/connect/abc',
			});
			const req = await readConnectRequest(database, 'acme');
			expect(req).toEqual({
				plugin: 'linear',
				connectUrl: 'https://hub.corsair.dev/connect/abc',
				requestedAt: expect.any(String),
				tenantId: 'acme',
			});
		} finally {
			cleanup();
		}
	});

	it('keeps the latest request — the newest failure wins', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database, 'acme', 'linear');
			await seedAccount(database, 'acme', 'github');
			const t0 = 1_000_000_000_000;
			await recordConnectRequest(
				database,
				{
					tenantId: 'acme',
					plugin: 'linear',
					connectUrl: 'https://hub.corsair.dev/connect/one',
				},
				t0,
			);
			await recordConnectRequest(
				database,
				{
					tenantId: 'acme',
					plugin: 'github',
					connectUrl: 'https://hub.corsair.dev/connect/two',
				},
				t0 + 1,
			);
			const req = await readConnectRequest(database, 'acme', t0 + 2);
			expect(req?.plugin).toBe('github');
			expect(req?.connectUrl).toBe('https://hub.corsair.dev/connect/two');
		} finally {
			cleanup();
		}
	});

	it('scopes by tenant — another tenant sees nothing', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database, 'acme', 'linear');
			await recordConnectRequest(database, {
				tenantId: 'acme',
				plugin: 'linear',
				connectUrl: 'https://hub.corsair.dev/connect/abc',
			});
			expect(await readConnectRequest(database, 'other')).toBeNull();
		} finally {
			cleanup();
		}
	});

	it('treats an expired request as gone', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database, 'acme', 'linear');
			const t0 = 1_000_000_000_000;
			await recordConnectRequest(
				database,
				{
					tenantId: 'acme',
					plugin: 'linear',
					connectUrl: 'https://hub.corsair.dev/connect/abc',
				},
				t0,
			);
			// still live just before the TTL, gone just after
			expect(
				await readConnectRequest(
					database,
					'acme',
					t0 + CONNECT_REQUEST_TTL_MS - 1,
				),
			).not.toBeNull();
			expect(
				await readConnectRequest(
					database,
					'acme',
					t0 + CONNECT_REQUEST_TTL_MS + 1,
				),
			).toBeNull();
		} finally {
			cleanup();
		}
	});

	it('clears a request — a tombstone supersedes it', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database, 'acme', 'linear');
			const t0 = 1_000_000_000_000;
			await recordConnectRequest(
				database,
				{
					tenantId: 'acme',
					plugin: 'linear',
					connectUrl: 'https://hub.corsair.dev/connect/abc',
				},
				t0,
			);
			await clearConnectRequest(database, 'acme', t0 + 1);
			expect(await readConnectRequest(database, 'acme', t0 + 2)).toBeNull();
		} finally {
			cleanup();
		}
	});

	it('a request after a clear is live again', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database, 'acme', 'linear');
			const t0 = 1_000_000_000_000;
			await recordConnectRequest(
				database,
				{ tenantId: 'acme', plugin: 'linear', connectUrl: 'https://x/one' },
				t0,
			);
			await clearConnectRequest(database, 'acme', t0 + 1);
			await recordConnectRequest(
				database,
				{ tenantId: 'acme', plugin: 'linear', connectUrl: 'https://x/two' },
				t0 + 2,
			);
			const req = await readConnectRequest(database, 'acme', t0 + 3);
			expect(req?.connectUrl).toBe('https://x/two');
		} finally {
			cleanup();
		}
	});
});

describe('recordConnectRequestBestEffort', () => {
	it('no-ops without a database, plugin, or connectUrl — never throws', async () => {
		await expect(
			recordConnectRequestBestEffort(undefined, {
				tenantId: 'acme',
				plugin: 'linear',
				connectUrl: 'x',
			}),
		).resolves.toBeUndefined();

		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database, 'acme', 'linear');
			await recordConnectRequestBestEffort(database, {
				tenantId: 'acme',
				plugin: null,
				connectUrl: 'x',
			});
			await recordConnectRequestBestEffort(database, {
				tenantId: 'acme',
				plugin: 'linear',
				connectUrl: null,
			});
			expect(await readConnectRequest(database, 'acme')).toBeNull();
		} finally {
			cleanup();
		}
	});

	it('records when everything is present, defaulting a missing tenant', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database, 'default', 'linear');
			await recordConnectRequestBestEffort(database, {
				tenantId: undefined,
				plugin: 'linear',
				connectUrl: 'https://hub.corsair.dev/connect/abc',
			});
			expect(await readConnectRequest(database, 'default')).toMatchObject({
				plugin: 'linear',
				connectUrl: 'https://hub.corsair.dev/connect/abc',
			});
		} finally {
			cleanup();
		}
	});
});
