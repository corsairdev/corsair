import { CORSAIR_INTERNAL } from '../core';
import {
	encryptConfig,
	encryptDEK,
	generateDEK,
} from '../core/auth/encryption';
import type { RawWebhookRequest, WebhookResponse } from '../core/webhooks';
import { processWebhook } from '../webhooks/index';
import { setWebhookTenantLink } from '../webhooks/tenant-links';
import { createTestDatabase } from './setup-db';

const KEK = 'test-kek-with-at-least-32-characters!!';

type Db = ReturnType<typeof createTestDatabase>['database'];

async function seed(database: Db) {
	const now = new Date();
	const dek = generateDEK();
	const encryptedDek = await encryptDEK(dek, KEK);
	await database.db
		.insertInto('corsair_integrations')
		.values({
			id: 'int-slack',
			created_at: now,
			updated_at: now,
			name: 'slack',
			config: encryptConfig({}, dek),
			dek: encryptedDek,
		})
		.execute();
	for (const tenantId of ['tenant_a', 'tenant_b']) {
		await database.db
			.insertInto('corsair_accounts')
			.values({
				id: `acc-${tenantId}`,
				created_at: now,
				updated_at: now,
				tenant_id: tenantId,
				integration_id: 'int-slack',
				config: encryptConfig({}, dek),
				dek: encryptedDek,
			})
			.execute();
	}
	await setWebhookTenantLink({
		database,
		kek: KEK,
		pluginId: 'slack',
		tenantId: 'tenant_b',
		link: { linkType: 'team_id', externalId: 'T222' },
	});
}

// A stand-in multi-tenant instance: one plugin under a real provider id (so
// processWebhook's provider loop reaches it) whose handler records the tenant
// it ran under, and the internal config processWebhook reads the database from.
function instance(database: Db, seen: string[], reply?: WebhookResponse) {
	const teamOf = (request: RawWebhookRequest) =>
		(request.body as { team_id?: string }).team_id;
	return {
		withTenant: (tenantId: string) => ({
			slack: {
				pluginWebhookMatcher: () => true,
				webhooks: {
					events: {
						message: {
							match: () => true,
							handler: async () => {
								seen.push(tenantId);
								return reply ?? { success: true };
							},
						},
					},
				},
			},
		}),
		[CORSAIR_INTERNAL]: {
			multiTenancy: true,
			database,
			kek: KEK,
			plugins: [
				{
					id: 'slack',
					pluginWebhookMatcher: () => true,
					pluginTenantWebhookMatcher: (request: RawWebhookRequest) => {
						const externalId = teamOf(request);
						return externalId ? { linkType: 'team_id', externalId } : null;
					},
				},
			],
		},
		// processWebhook's instance type is built from registered plugins; this
		// stand-in carries only what the webhook path reads.
	} as unknown as Parameters<typeof processWebhook>[0];
}

const headers = { 'content-type': 'application/json' };

describe('processWebhook on a multi-tenant instance', () => {
	it('finds the tenant from the delivery when the URL names none', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seed(database);
			const seen: string[] = [];
			const result = await processWebhook(instance(database, seen), headers, {
				team_id: 'T222',
			});
			expect(result.plugin).toBe('slack');
			expect(seen).toEqual(['tenant_b']);
		} finally {
			cleanup();
		}
	});

	it('keeps an explicit tenantId over the delivery', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seed(database);
			const seen: string[] = [];
			await processWebhook(
				instance(database, seen),
				headers,
				{ team_id: 'T222' },
				{ tenantId: 'tenant_a' },
			);
			expect(seen).toEqual(['tenant_a']);
		} finally {
			cleanup();
		}
	});

	it('falls back to default when no link matches', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seed(database);
			const seen: string[] = [];
			await processWebhook(instance(database, seen), headers, {
				team_id: 'T999',
			});
			expect(seen).toEqual(['default']);
		} finally {
			cleanup();
		}
	});
});

describe('processWebhook with a handler that refuses the delivery', () => {
	it('reports the refusal, its error and status', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			const seen: string[] = [];
			const result = await processWebhook(
				instance(database, seen, {
					success: false,
					error: 'Invalid signature',
					statusCode: 401,
				}),
				headers,
				{ team_id: 'T222' },
				{ tenantId: 'tenant_a' },
			);
			expect(result.plugin).toBe('slack');
			expect(result.response).toEqual({
				success: false,
				error: 'Invalid signature',
				statusCode: 401,
			});
		} finally {
			cleanup();
		}
	});
});

// Two plugins whose matchers both accept the delivery, as Outlook's and
// OneDrive's do for MS Graph notifications. Dispatch tries onedrive first;
// the tenant must come from onedrive's link, not from whichever plugin is
// listed first in the instance.
function graphInstance(database: Db, seen: string[]) {
	const sub = (request: RawWebhookRequest) =>
		(request.body as { subscriptionId?: string }).subscriptionId;
	const bound = (id: string, tenantId: string) => ({
		pluginWebhookMatcher: () => true,
		webhooks: {
			notifications: {
				changed: {
					match: () => true,
					handler: async () => {
						seen.push(`${id}@${tenantId}`);
						return { success: true };
					},
				},
			},
		},
	});
	const matcher = (request: RawWebhookRequest) => {
		const externalId = sub(request);
		return externalId ? { linkType: 'subscription_id', externalId } : null;
	};
	return {
		withTenant: (tenantId: string) => ({
			onedrive: bound('onedrive', tenantId),
			outlook: bound('outlook', tenantId),
		}),
		[CORSAIR_INTERNAL]: {
			multiTenancy: true,
			database,
			kek: KEK,
			// Outlook listed first, as a host's plugin array might.
			plugins: [
				{
					id: 'outlook',
					pluginWebhookMatcher: () => true,
					pluginTenantWebhookMatcher: matcher,
				},
				{
					id: 'onedrive',
					pluginWebhookMatcher: () => true,
					pluginTenantWebhookMatcher: matcher,
				},
			],
		},
		// processWebhook's instance type is built from registered plugins; this
		// stand-in carries only what the webhook path reads.
	} as unknown as Parameters<typeof processWebhook>[0];
}

async function seedGraph(database: Db) {
	const now = new Date();
	const dek = generateDEK();
	const encryptedDek = await encryptDEK(dek, KEK);
	for (const name of ['outlook', 'onedrive']) {
		await database.db
			.insertInto('corsair_integrations')
			.values({
				id: `int-${name}`,
				created_at: now,
				updated_at: now,
				name,
				config: encryptConfig({}, dek),
				dek: encryptedDek,
			})
			.execute();
		await database.db
			.insertInto('corsair_accounts')
			.values({
				id: `acc-${name}`,
				created_at: now,
				updated_at: now,
				tenant_id: 'tenant_b',
				integration_id: `int-${name}`,
				config: encryptConfig({}, dek),
				dek: encryptedDek,
			})
			.execute();
	}
	// Only onedrive holds the link for this subscription.
	await setWebhookTenantLink({
		database,
		kek: KEK,
		pluginId: 'onedrive',
		tenantId: 'tenant_b',
		link: { linkType: 'subscription_id', externalId: 'sub-1' },
	});
}

describe('processWebhook when several plugins match', () => {
	it('takes the tenant from the plugin that handles the delivery', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			await seedGraph(database);
			const seen: string[] = [];
			const result = await processWebhook(
				graphInstance(database, seen),
				headers,
				{
					subscriptionId: 'sub-1',
				},
			);
			expect(result.plugin).toBe('onedrive');
			expect(seen).toEqual(['onedrive@tenant_b']);
		} finally {
			cleanup();
		}
	});
});

describe('processWebhook when the tenant lookup fails', () => {
	it('refuses the delivery instead of running it as default', async () => {
		const seen: string[] = [];
		// The lookup reads corsair_accounts; a database that throws on any
		// query stands in for an outage.
		const broken = {
			db: {
				selectFrom: () => {
					throw new Error('database unavailable');
				},
			},
			// A stand-in database: only the query entry point the lookup uses.
		} as unknown as Db;
		const result = await processWebhook(instance(broken, seen), headers, {
			team_id: 'T222',
		});
		expect(seen).toEqual([]);
		expect(result.response).toEqual({
			success: false,
			error: 'Could not look up the tenant for this delivery',
			statusCode: 500,
		});
	});
});
