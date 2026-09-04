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

	it('returns the oldest live request across plugins — FIFO, does not drift', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database, 'acme', 'linear');
			await seedAccount(database, 'acme', 'slack');
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
					plugin: 'slack',
					connectUrl: 'https://hub.corsair.dev/connect/two',
				},
				t0 + 1,
			);
			const req = await readConnectRequest(database, 'acme', t0 + 2);
			expect(req?.plugin).toBe('linear');
			expect(req?.connectUrl).toBe('https://hub.corsair.dev/connect/one');
		} finally {
			cleanup();
		}
	});

	it('per-plugin independence — clearing one plugin surfaces the next', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database, 'acme', 'linear');
			await seedAccount(database, 'acme', 'slack');
			const t0 = 1_000_000_000_000;
			await recordConnectRequest(
				database,
				{ tenantId: 'acme', plugin: 'linear', connectUrl: 'https://x/linear' },
				t0,
			);
			await recordConnectRequest(
				database,
				{ tenantId: 'acme', plugin: 'slack', connectUrl: 'https://x/slack' },
				t0 + 1,
			);
			// linear is oldest → surfaces first
			expect((await readConnectRequest(database, 'acme', t0 + 2))?.plugin).toBe(
				'linear',
			);
			// clearing linear must not touch slack
			await clearConnectRequest(database, 'acme', t0 + 3, 'linear');
			const after = await readConnectRequest(database, 'acme', t0 + 4);
			expect(after?.plugin).toBe('slack');
			expect(after?.connectUrl).toBe('https://x/slack');
		} finally {
			cleanup();
		}
	});

	it('FIFO tiebreak is deterministic on equal created_at across accounts', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database, 'acme', 'linear');
			await seedAccount(database, 'acme', 'slack');
			const t0 = 1_000_000_000_000;
			await recordConnectRequest(
				database,
				{ tenantId: 'acme', plugin: 'linear', connectUrl: 'https://x/linear' },
				t0,
			);
			await recordConnectRequest(
				database,
				{ tenantId: 'acme', plugin: 'slack', connectUrl: 'https://x/slack' },
				t0,
			);
			// Same created_at on two accounts — result must be stable across reads.
			const a = await readConnectRequest(database, 'acme', t0 + 1);
			const b = await readConnectRequest(database, 'acme', t0 + 1);
			expect(a?.plugin).toBe(b?.plugin);
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

	it('clears a request — a tombstone supersedes it (no plugin arg, single live)', async () => {
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

	it('re-request after clear is live again — per plugin', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database, 'acme', 'linear');
			const t0 = 1_000_000_000_000;
			await recordConnectRequest(
				database,
				{ tenantId: 'acme', plugin: 'linear', connectUrl: 'https://x/one' },
				t0,
			);
			await clearConnectRequest(database, 'acme', t0 + 1, 'linear');
			await recordConnectRequest(
				database,
				{ tenantId: 'acme', plugin: 'linear', connectUrl: 'https://x/two' },
				t0 + 2,
			);
			const req = await readConnectRequest(database, 'acme', t0 + 3);
			expect(req?.plugin).toBe('linear');
			expect(req?.connectUrl).toBe('https://x/two');
		} finally {
			cleanup();
		}
	});

	// On one account, a request and a clear that land in the same millisecond must
	// resolve deterministically: the clear wins (prompt stays suppressed — safe default).
	it('same-ms tie: request then clear at equal timestamp → suppressed', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database, 'acme', 'linear');
			const t0 = 1_000_000_000_000;
			await recordConnectRequest(
				database,
				{ tenantId: 'acme', plugin: 'linear', connectUrl: 'https://x/one' },
				t0,
			);
			await clearConnectRequest(database, 'acme', t0, 'linear');
			expect(await readConnectRequest(database, 'acme', t0 + 1)).toBeNull();
		} finally {
			cleanup();
		}
	});

	// Append order — not event_type — decides a same-ms tie. A re-request landing
	// after a clear at the same millisecond must restore the live prompt.
	it('same-ms tie: clear then request at equal timestamp → request is live again', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database, 'acme', 'linear');
			const t0 = 1_000_000_000_000;
			await clearConnectRequest(database, 'acme', t0, 'linear');
			await recordConnectRequest(
				database,
				{ tenantId: 'acme', plugin: 'linear', connectUrl: 'https://x/one' },
				t0,
			);
			const req = await readConnectRequest(database, 'acme', t0 + 1);
			expect(req?.plugin).toBe('linear');
			expect(req?.connectUrl).toBe('https://x/one');
		} finally {
			cleanup();
		}
	});

	// Two requests to one plugin at the same millisecond — the later append wins.
	it('same-ms tie: two requests at equal timestamp → the second is live', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedAccount(database, 'acme', 'linear');
			const t0 = 1_000_000_000_000;
			await recordConnectRequest(
				database,
				{ tenantId: 'acme', plugin: 'linear', connectUrl: 'https://x/first' },
				t0,
			);
			await recordConnectRequest(
				database,
				{ tenantId: 'acme', plugin: 'linear', connectUrl: 'https://x/second' },
				t0,
			);
			const req = await readConnectRequest(database, 'acme', t0 + 1);
			expect(req?.connectUrl).toBe('https://x/second');
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
