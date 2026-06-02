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
			executeTakeFirst: () => Promise<DbRow | undefined>;
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

function hasAuthConfig(
	internal: CorsairInternalConfig,
	pluginId: string,
): boolean {
	const plugin = internal.plugins.find((p) => p.id === pluginId);
	if (!plugin) return false;
	const options = plugin.options as { authType?: unknown } | undefined;
	return typeof options?.authType === 'string';
}

export const setupPlugin: HandlerFn = async (ctx) => {
	const body = await readJsonBody(ctx.req);
	const pluginId = String(body.pluginId ?? '').trim();
	const tenantId = String(body.tenantId ?? 'default').trim() || 'default';
	if (!pluginId) throw new Error('pluginId is required.');

	const { internal, instance, resolveClient } = await ctx.getCorsair();
	if (!internal.database) throw new Error('No database configured.');
	if (!hasAuthConfig(internal, pluginId)) {
		throw new Error(`Plugin '${pluginId}' has no credential setup.`);
	}

	const db = asDb(internal.database);
	const now = new Date();

	let integration = await db
		.selectFrom('corsair_integrations')
		.selectAll()
		.where('name', '=', pluginId)
		.executeTakeFirst();
	if (!integration) {
		const id = randomUUID();
		await db
			.insertInto('corsair_integrations')
			.values({
				id,
				name: pluginId,
				config: {},
				created_at: now,
				updated_at: now,
			})
			.execute();
		integration = await db
			.selectFrom('corsair_integrations')
			.selectAll()
			.where('id', '=', id)
			.executeTakeFirst();
	}
	if (!integration) {
		throw new Error(`Failed to create integration for '${pluginId}'.`);
	}

	const integrationId = integration.id;
	if (typeof integrationId !== 'string') {
		throw new Error(`Invalid integration row for '${pluginId}'.`);
	}

	let account = await db
		.selectFrom('corsair_accounts')
		.selectAll()
		.where('tenant_id', '=', tenantId)
		.where('integration_id', '=', integrationId)
		.executeTakeFirst();
	if (!account) {
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
		account = await db
			.selectFrom('corsair_accounts')
			.selectAll()
			.where('tenant_id', '=', tenantId)
			.where('integration_id', '=', integrationId)
			.executeTakeFirst();
	}

	const rootKeys = ((instance as Record<string, unknown>).keys ??
		null) as Record<string, unknown> | null;
	const integrationNamespace = (rootKeys?.[pluginId] ?? null) as Record<
		string,
		unknown
	> | null;
	if (!integration.dek) {
		const issueIntegrationDek = integrationNamespace?.issue_new_dek;
		if (typeof issueIntegrationDek === 'function') {
			await (issueIntegrationDek as () => Promise<void>)();
		}
	}

	if (account && !account.dek) {
		const tenantClient = resolveClient(tenantId);
		const pluginNamespace = (tenantClient[pluginId] ?? null) as Record<
			string,
			unknown
		> | null;
		const accountKeys = (pluginNamespace?.keys ?? null) as Record<
			string,
			unknown
		> | null;
		const issueAccountDek = accountKeys?.issue_new_dek;
		if (typeof issueAccountDek === 'function') {
			await (issueAccountDek as () => Promise<void>)();
		}
	}

	return { ok: true };
};
