import { randomUUID } from 'node:crypto';
import type { CorsairInternalConfig } from 'corsair/core';
import { readJsonBody } from '../router';
import type { HandlerFn } from '../types';

type DbRow = Record<string, unknown>;

type KyselyDb = {
	selectFrom: (table: string) => {
		selectAll: () => {
			where: (
				column: string,
				op: '=' | 'in',
				value: unknown,
			) => {
				execute: () => Promise<DbRow[]>;
				executeTakeFirst: () => Promise<DbRow | undefined>;
				where: (
					column: string,
					op: '=' | 'in',
					value: unknown,
				) => {
					execute: () => Promise<DbRow[]>;
					executeTakeFirst: () => Promise<DbRow | undefined>;
				};
			};
			execute: () => Promise<DbRow[]>;
		};
	};
	insertInto: (table: string) => {
		values: (row: DbRow) => {
			execute: () => Promise<unknown>;
		};
	};
};

function asDb(internalDatabase: unknown): KyselyDb {
	const wrapped = internalDatabase as { db?: unknown };
	const candidate = wrapped.db ?? internalDatabase;
	if (
		!candidate ||
		typeof candidate !== 'object' ||
		!(
			'selectFrom' in candidate &&
			typeof (candidate as { selectFrom?: unknown }).selectFrom === 'function'
		) ||
		!(
			'insertInto' in candidate &&
			typeof (candidate as { insertInto?: unknown }).insertInto === 'function'
		)
	) {
		throw new Error('Could not access kysely db handle.');
	}
	return candidate as KyselyDb;
}

function getAuthPluginIds(internal: CorsairInternalConfig): string[] {
	return internal.plugins
		.filter((plugin) => {
			const options = plugin.options as { authType?: unknown } | undefined;
			return typeof options?.authType === 'string';
		})
		.map((plugin) => plugin.id);
}

export const listTenants: HandlerFn = async (ctx) => {
	const { internal } = await ctx.getCorsair();
	if (!internal.multiTenancy) {
		return { tenants: ['default'] };
	}
	if (!internal.database) throw new Error('No database configured.');
	const db = asDb(internal.database);
	const rows = await db.selectFrom('corsair_accounts').selectAll().execute();
	const ids = new Set<string>(['default']);
	for (const row of rows) {
		const tenantId = row.tenant_id;
		if (typeof tenantId === 'string' && tenantId.trim()) {
			ids.add(tenantId);
		}
	}
	return { tenants: Array.from(ids).sort() };
};

export const createTenant: HandlerFn = async (ctx) => {
	const body = await readJsonBody(ctx.req);
	const tenantId = String(body.tenantId ?? '').trim();
	if (!tenantId) {
		throw new Error('tenantId is required.');
	}
	if (tenantId === 'main') {
		throw new Error('"main" is reserved. Pick another tenant id.');
	}

	const { internal, resolveClient } = await ctx.getCorsair();
	if (!internal.multiTenancy) {
		throw new Error('Multi-tenancy is not enabled for this Corsair instance.');
	}
	if (!internal.database) throw new Error('No database configured.');
	const db = asDb(internal.database);

	const now = new Date();
	const authPluginIds = getAuthPluginIds(internal);
	if (authPluginIds.length === 0) {
		return { ok: true, created: false };
	}

	const integrations = await db
		.selectFrom('corsair_integrations')
		.selectAll()
		.execute();
	const integrationByName = new Map<string, DbRow>();
	for (const row of integrations) {
		const name = row.name;
		if (typeof name === 'string') integrationByName.set(name, row);
	}

	for (const pluginId of authPluginIds) {
		if (integrationByName.has(pluginId)) continue;
		const id = randomUUID();
		const row = {
			id,
			name: pluginId,
			config: {},
			created_at: now,
			updated_at: now,
		};
		await db.insertInto('corsair_integrations').values(row).execute();
		integrationByName.set(pluginId, row);
	}

	const existingAccounts = await db
		.selectFrom('corsair_accounts')
		.selectAll()
		.where('tenant_id', '=', tenantId)
		.execute();
	const accountByIntegrationId = new Map<string, DbRow>();
	for (const row of existingAccounts) {
		const integrationId = row.integration_id;
		if (typeof integrationId === 'string') {
			accountByIntegrationId.set(integrationId, row);
		}
	}

	let createdAny = false;
	const pluginsMissingDek = new Set<string>();

	for (const pluginId of authPluginIds) {
		const integration = integrationByName.get(pluginId);
		const integrationId = integration?.id;
		if (typeof integrationId !== 'string') continue;

		const existing = accountByIntegrationId.get(integrationId);
		if (!existing) {
			createdAny = true;
			pluginsMissingDek.add(pluginId);
			await db
				.insertInto('corsair_accounts')
				.values({
					id: randomUUID(),
					tenant_id: tenantId,
					integration_id: integrationId,
					config: {},
					created_at: now,
					updated_at: now,
				})
				.execute();
			continue;
		}

		if (!existing.dek) {
			pluginsMissingDek.add(pluginId);
		}
	}

	if (pluginsMissingDek.size > 0) {
		const tenantClient = resolveClient(tenantId);
		for (const pluginId of pluginsMissingDek) {
			const pluginNamespace = (tenantClient as Record<string, unknown>)[
				pluginId
			] as Record<string, unknown> | undefined;
			const keyNamespace = pluginNamespace?.keys as
				| Record<string, unknown>
				| undefined;
			const issueDek = keyNamespace?.issue_new_dek;
			if (typeof issueDek === 'function') {
				await (issueDek as () => Promise<void>)();
			}
		}
	}

	return { ok: true, created: createdAny };
};
