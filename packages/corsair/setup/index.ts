import type { Kysely } from 'kysely';
import type {
	CorsairInternalConfig,
	CorsairPlugin,
	CorsairSingleTenantClient,
} from '../core';
import { CORSAIR_INTERNAL, createCorsair } from '../core';
import type { CorsairKyselyDatabase } from '../db/kysely/database';

// Inlined at build time by the esbuild YAML plugin in tsup.config.ts.
// Edit setup/backfill.yaml to add or change plugin backfill steps.
import backfillConfig from './backfill.yaml';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

// backfill.yaml shape: { [pluginId]: { [group]: { [method]: params } } }
type BackfillYaml = Record<
	string,
	Record<string, Record<string, Record<string, unknown>>>
>;

type KeyManager = Record<string, unknown>;

export interface SetupCorsairOptions {
	/**
	 * When true, calls list endpoints for every plugin defined in
	 * setup/backfill.yaml to seed the local database with initial data.
	 *
	 * Requires credentials to already be stored in the database. Typical flow:
	 *   1. `setupCorsair(corsair)`                    — creates plugin rows + DEKs
	 *   2. Store API keys / OAuth tokens
	 *   3. `setupCorsair(corsair, { backfill: true })` — seeds initial data
	 */
	backfill?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Initialises a corsair instance end-to-end:
 *
 * 1. Checks that all required corsair_* tables exist (warns if any are missing).
 * 2. Ensures every configured plugin has rows in `corsair_integrations` and
 *    `corsair_accounts` (tenant_id = 'default').
 * 3. Issues DEKs for any plugin that does not yet have one at either level.
 * 4. Checks auth status for each plugin and logs guidance for any missing credentials.
 * 5. If `{ backfill: true }`, calls the list endpoints defined in
 *    `setup/backfill.yaml` for each plugin that has auth configured.
 *
 * Only single-tenant corsair instances are accepted.
 */
export async function setupCorsair<
	const Plugins extends readonly CorsairPlugin[],
>(
	corsair: CorsairSingleTenantClient<Plugins>,
	options?: SetupCorsairOptions,
): Promise<void> {
	const internal = (corsair as unknown as Record<symbol, unknown>)[
		CORSAIR_INTERNAL
	] as CorsairInternalConfig | undefined;

	if (!internal) {
		throw new Error('setupCorsair: invalid corsair instance');
	}

	if (internal.multiTenancy) {
		throw new Error(
			'setupCorsair: multi-tenancy instances are not supported. ' +
				'Create your corsair instance without multiTenancy: true.',
		);
	}

	if (!internal.database) {
		throw new Error(
			'setupCorsair: a database must be configured on the corsair instance',
		);
	}

	const db = internal.database.db as Kysely<CorsairKyselyDatabase>;

	// Re-create a typed instance from the extracted config so operations go
	// through corsair's strongly-typed API rather than raw record access.
	const instance = createCorsair({
		plugins: internal.plugins as unknown as Plugins,
		database: internal.database.db,
		kek: internal.kek,
	}) as unknown as CorsairSingleTenantClient<readonly CorsairPlugin[]>;

	// 1. Verify schema
	await checkTables(db);

	// 2. Ensure integration + account rows and DEKs for every plugin,
	//    then check auth status and log guidance for missing credentials.
	const authReadyPlugins = await ensurePluginRows(
		db,
		instance,
		internal.plugins,
	);

	// 3. Optional backfill — only for plugins with auth configured
	if (options?.backfill) {
		console.log('[corsair:setup] Starting backfill...');
		await runBackfill(instance, internal.plugins, authReadyPlugins);
		console.log('[corsair:setup] Backfill complete.');
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Table check
// ─────────────────────────────────────────────────────────────────────────────

const REQUIRED_TABLES = [
	'corsair_integrations',
	'corsair_accounts',
	'corsair_entities',
	'corsair_events',
	'corsair_permissions',
] as const;

async function checkTables(db: Kysely<CorsairKyselyDatabase>): Promise<void> {
	const existing = await db.introspection.getTables();
	const existingNames = new Set(existing.map((t) => t.name));

	for (const table of REQUIRED_TABLES) {
		if (!existingNames.has(table)) {
			console.warn(
				`[corsair:setup] Table "${table}" does not exist. ` +
					'Run your database migrations before calling setupCorsair.',
			);
		}
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth status check
// ─────────────────────────────────────────────────────────────────────────────

// Fields that are optional or system-managed — don't require manual user input.
const OPTIONAL_FIELDS = new Set([
	'webhook_signature',
	'expires_at',
	'scope',
	'redirect_url',
]);

/**
 * Inspects the key managers for a plugin via Object.keys(), finds all set_*
 * methods, and calls the corresponding get_* to see if credentials are present.
 *
 * Returns true when all required credentials are in place, false otherwise.
 * When false, logs actionable guidance so the agent knows exactly what to call.
 */
async function checkAuthStatus(
	pluginId: string,
	authType: string,
	integrationKeyMgr: KeyManager,
	accountKeyMgr: KeyManager,
): Promise<boolean> {
	const missingIntegration: string[] = [];
	const missingAccount: string[] = [];

	for (const key of Object.keys(integrationKeyMgr)) {
		if (!key.startsWith('set_')) continue;
		const field = key.slice(4);
		if (OPTIONAL_FIELDS.has(field)) continue;
		const getter = integrationKeyMgr[`get_${field}`] as
			| (() => Promise<string | null>)
			| undefined;
		if (!getter) continue;
		const value = await getter();
		if (!value) missingIntegration.push(field);
	}

	for (const key of Object.keys(accountKeyMgr)) {
		if (!key.startsWith('set_')) continue;
		const field = key.slice(4);
		if (OPTIONAL_FIELDS.has(field)) continue;
		const getter = accountKeyMgr[`get_${field}`] as
			| (() => Promise<string | null>)
			| undefined;
		if (!getter) continue;
		const value = await getter();
		if (!value) missingAccount.push(field);
	}

	const isReady =
		missingIntegration.length === 0 && missingAccount.length === 0;

	if (!isReady) {
		const lines: string[] = [
			`[corsair:setup] '${pluginId}' (${authType}) needs credentials. Call:`,
		];
		for (const field of missingIntegration) {
			lines.push(`  corsair.keys.${pluginId}.set_${field}(value)`);
		}
		for (const field of missingAccount) {
			lines.push(`  corsair.${pluginId}.keys.set_${field}(value)`);
		}
		console.log(lines.join('\n'));
	}

	return isReady;
}

// ─────────────────────────────────────────────────────────────────────────────
// Integration + account row provisioning
// ─────────────────────────────────────────────────────────────────────────────

const TENANT_ID = 'default';

async function ensurePluginRows(
	db: Kysely<CorsairKyselyDatabase>,
	instance: CorsairSingleTenantClient<readonly CorsairPlugin[]>,
	plugins: readonly CorsairPlugin[],
): Promise<Set<string>> {
	const now = new Date();
	const authReadyPlugins = new Set<string>();

	// Cast to plain records for dynamic plugin-id access.
	const integrationKeys = instance.keys as unknown as Record<
		string,
		KeyManager | undefined
	>;
	const pluginNamespaces = instance as unknown as Record<
		string,
		{ keys?: KeyManager } | undefined
	>;

	for (const plugin of plugins) {
		const pluginId = plugin.id;
		const authType =
			((plugin.options as Record<string, unknown>)?.authType as
				| string
				| undefined) ?? 'unknown';

		// ── Integration row ────────────────────────────────────────────────────

		let integration = await db
			.selectFrom('corsair_integrations')
			.selectAll()
			.where('name', '=', pluginId)
			.executeTakeFirst();

		if (!integration) {
			const id = crypto.randomUUID();
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
			console.log(`[corsair:setup] Created integration: ${pluginId}`);
		}

		// ── Integration-level DEK ──────────────────────────────────────────────

		const integrationKeyMgr = integrationKeys[pluginId];

		if (integration && !integration.dek && integrationKeyMgr) {
			await (
				integrationKeyMgr as { issue_new_dek: () => Promise<void> }
			).issue_new_dek();
			console.log(`[corsair:setup] Issued integration DEK: ${pluginId}`);
		}

		if (!integration) continue;

		// ── Account row ───────────────────────────────────────────────────────

		let account = await db
			.selectFrom('corsair_accounts')
			.selectAll()
			.where('tenant_id', '=', TENANT_ID)
			.where('integration_id', '=', integration.id)
			.executeTakeFirst();

		if (!account) {
			const id = crypto.randomUUID();
			await db
				.insertInto('corsair_accounts')
				.values({
					id,
					tenant_id: TENANT_ID,
					integration_id: integration.id,
					config: {},
					created_at: now,
					updated_at: now,
				})
				.execute();
			account = await db
				.selectFrom('corsair_accounts')
				.selectAll()
				.where('id', '=', id)
				.executeTakeFirst();
			console.log(`[corsair:setup] Created account: ${pluginId}`);
		}

		// ── Account-level DEK ─────────────────────────────────────────────────

		const accountKeyMgr = pluginNamespaces[pluginId]?.keys;

		if (account && !account.dek && accountKeyMgr) {
			await (
				accountKeyMgr as { issue_new_dek: () => Promise<void> }
			).issue_new_dek();
			console.log(`[corsair:setup] Issued account DEK: ${pluginId}`);
		}

		// ── Auth status check ─────────────────────────────────────────────────

		if (integrationKeyMgr && accountKeyMgr) {
			const isReady = await checkAuthStatus(
				pluginId,
				authType,
				integrationKeyMgr,
				accountKeyMgr,
			);
			if (isReady) authReadyPlugins.add(pluginId);
		}
	}

	return authReadyPlugins;
}

// ─────────────────────────────────────────────────────────────────────────────
// Backfill
// ─────────────────────────────────────────────────────────────────────────────

async function runBackfill(
	instance: CorsairSingleTenantClient<readonly CorsairPlugin[]>,
	plugins: readonly CorsairPlugin[],
	authReadyPlugins: Set<string>,
): Promise<void> {
	const config = backfillConfig as BackfillYaml;
	const activePluginIds = new Set(plugins.map((p) => p.id));
	const instanceRecord = instance as unknown as Record<
		string,
		| {
				api: Record<
					string,
					Record<string, (params: unknown) => Promise<unknown>>
				>;
		  }
		| undefined
	>;

	for (const [pluginId, groups] of Object.entries(config)) {
		if (!activePluginIds.has(pluginId)) continue;

		if (!authReadyPlugins.has(pluginId)) {
			console.log(
				`[corsair:setup] Skipping backfill for '${pluginId}' — auth not configured.`,
			);
			continue;
		}

		const api = instanceRecord[pluginId]?.api;
		if (!api) continue;

		for (const [group, methods] of Object.entries(groups)) {
			for (const [method, params] of Object.entries(methods)) {
				console.log(
					`[corsair:setup] Backfilling ${pluginId} › ${group}.${method}...`,
				);
				try {
					await api[group]?.[method]?.(params);
				} catch (error) {
					console.warn(
						`[corsair:setup] ${pluginId} › ${group}.${method} failed:`,
						error instanceof Error ? error.message : error,
					);
				}
			}
		}
	}
}
