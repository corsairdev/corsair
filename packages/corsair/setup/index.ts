import type { Kysely } from 'kysely';
import type { ZodTypeAny } from 'zod';
import {
	ZodBoolean,
	ZodDate,
	ZodEffects,
	ZodEnum,
	ZodNullable,
	ZodNumber,
	ZodObject,
	ZodOptional,
	ZodRecord,
	ZodString,
} from 'zod';
import type {
	CorsairInternalConfig,
	CorsairPlugin,
	CorsairSingleTenantClient,
} from '../core';
import { CORSAIR_INTERNAL, createCorsair } from '../core';
import type { CorsairKyselyDatabase } from '../db/kysely/database';
import { TABLE_SCHEMAS } from '../db/orm';

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
	 */
	backfill?: boolean;

	/**
	 * Credentials to store before checking auth status.
	 * Map of pluginId → { fieldName: value }.
	 * The system automatically determines whether each field belongs to the
	 * integration level (corsair.keys.plugin) or account level (corsair.plugin.keys).
	 *
	 * @example
	 * { github: { api_key: 'ghp_...' }, googlecalendar: { client_id: '...', client_secret: '...' } }
	 */
	credentials?: Record<string, Record<string, string>>;

	/**
	 * Whether setupCorsair is being called from the CLI or from a script.
	 * Defaults to 'script'. When 'cli', missing-credential messages are printed
	 * as runnable CLI flags instead of JS method calls.
	 */
	caller?: 'cli' | 'script';
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

type SetupLog = (msg: string) => void;
type SetupWarn = (msg: string) => void;

/**
 * Initialises a corsair instance end-to-end:
 *
 * 1. Checks that all required corsair_* tables exist (warns if any are missing).
 * 2. Ensures every configured plugin has rows in `corsair_integrations` and
 *    `corsair_accounts` (tenant_id = 'default') and issues DEKs where needed.
 * 3. Applies any credentials passed via `options.credentials`.
 * 4. Checks auth status for each plugin and logs guidance for any missing credentials.
 *    When `caller` is 'cli', guidance is printed as CLI flags instead of JS calls.
 * 5. If `{ backfill: true }`, calls the list endpoints defined in
 *    `setup/backfill.yaml` for each plugin that has auth configured.
 *
 * Only single-tenant corsair instances are accepted.
 *
 * Returns a newline-separated string of all setup output.
 */
export async function setupCorsair<
	const Plugins extends readonly CorsairPlugin[],
>(
	corsair: CorsairSingleTenantClient<Plugins>,
	options?: SetupCorsairOptions,
): Promise<string> {
	const messages: string[] = [];
	const log: SetupLog = (msg) => {
		messages.push(msg);
		console.log(msg);
	};
	const warn: SetupWarn = (msg) => {
		messages.push(msg);
		console.warn(msg);
	};

	const caller = options?.caller ?? 'script';

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

	const instance = createCorsair({
		plugins: internal.plugins as unknown as Plugins,
		database: internal.database.db,
		kek: internal.kek,
	}) as unknown as CorsairSingleTenantClient<readonly CorsairPlugin[]>;

	// 1. Verify schema
	await checkTables(db, warn);

	// 2. Create integration + account rows and issue DEKs for every plugin.
	await ensurePluginRowsAndDeks(db, instance, internal.plugins, log);

	// 3. Apply any credentials provided by the caller (CLI flags or programmatic).
	if (options?.credentials && Object.keys(options.credentials).length > 0) {
		await applyCredentials(instance, options.credentials, log, warn);
	}

	// 4. Check auth status for each plugin and log guidance for missing credentials.
	const authReadyPlugins = await checkAllPluginsAuthStatus(
		instance,
		internal.plugins,
		log,
		caller,
	);

	// 5. Optional backfill — only for plugins with auth configured.
	if (options?.backfill) {
		log('[corsair:setup] Starting backfill...');
		await runBackfill(instance, internal.plugins, authReadyPlugins, log, warn);
		log('[corsair:setup] Backfill complete.');
	}

	return messages.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Table check
// ─────────────────────────────────────────────────────────────────────────────

const REQUIRED_TABLES = {
	...TABLE_SCHEMAS,
} as const;

function describeZodSchema(schema: ZodTypeAny): unknown {
	if (schema instanceof ZodObject) {
		const shape: Record<string, unknown> = {};
		for (const [key, val] of Object.entries(
			schema.shape as Record<string, ZodTypeAny>,
		)) {
			shape[key] = describeZodSchema(val);
		}
		return shape;
	}
	if (schema instanceof ZodEffects)
		return describeZodSchema(schema.innerType());
	if (schema instanceof ZodNullable)
		return `${describeZodSchema(schema.unwrap())} | null`;
	if (schema instanceof ZodOptional)
		return `${describeZodSchema(schema.unwrap())} | undefined`;
	if (schema instanceof ZodEnum)
		return (schema.options as string[]).join(' | ');
	if (schema instanceof ZodString) return 'string';
	if (schema instanceof ZodNumber) return 'number';
	if (schema instanceof ZodBoolean) return 'boolean';
	if (schema instanceof ZodDate) return 'date';
	if (schema instanceof ZodRecord) return 'jsonb';
	return 'unknown';
}

async function checkTables(
	db: Kysely<CorsairKyselyDatabase>,
	warn: SetupWarn,
): Promise<void> {
	const existing = await db.introspection.getTables();
	const existingNames = new Set(existing.map((t) => t.name));

	for (const [table, schema] of Object.entries(REQUIRED_TABLES)) {
		if (!existingNames.has(table)) {
			warn(
				`[corsair:setup] Table "${table}" does not exist. ` +
					'Run your database migrations before calling setupCorsair.\n' +
					`Schema: ${JSON.stringify(describeZodSchema(schema), null, 2)}`,
			);
		}
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Row + DEK provisioning (no auth check)
// ─────────────────────────────────────────────────────────────────────────────

const TENANT_ID = 'default';

async function ensurePluginRowsAndDeks(
	db: Kysely<CorsairKyselyDatabase>,
	instance: CorsairSingleTenantClient<readonly CorsairPlugin[]>,
	plugins: readonly CorsairPlugin[],
	log: SetupLog,
): Promise<void> {
	const now = new Date();

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
				.values({ id, name: pluginId, config: {}, created_at: now, updated_at: now })
				.execute();
			integration = await db
				.selectFrom('corsair_integrations')
				.selectAll()
				.where('id', '=', id)
				.executeTakeFirst();
			log(`[corsair:setup] Created integration: ${pluginId}`);
		}

		// ── Integration-level DEK ──────────────────────────────────────────────
		const integrationKeyMgr = integrationKeys[pluginId];
		if (integration && !integration.dek && integrationKeyMgr) {
			await (integrationKeyMgr as { issue_new_dek: () => Promise<void> }).issue_new_dek();
			log(`[corsair:setup] Issued integration DEK: ${pluginId}`);
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
			log(`[corsair:setup] Created account: ${pluginId}`);
		}

		// ── Account-level DEK ─────────────────────────────────────────────────
		const accountKeyMgr = pluginNamespaces[pluginId]?.keys;
		if (account && !account.dek && accountKeyMgr) {
			await (accountKeyMgr as { issue_new_dek: () => Promise<void> }).issue_new_dek();
			log(`[corsair:setup] Issued account DEK: ${pluginId}`);
		}
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Credential application
// ─────────────────────────────────────────────────────────────────────────────

async function applyCredentials(
	instance: CorsairSingleTenantClient<readonly CorsairPlugin[]>,
	credentials: Record<string, Record<string, string>>,
	log: SetupLog,
	warn: SetupWarn,
): Promise<void> {
	const integrationKeys = instance.keys as unknown as Record<string, KeyManager | undefined>;
	const pluginNamespaces = instance as unknown as Record<string, { keys?: KeyManager } | undefined>;

	for (const [pluginId, fields] of Object.entries(credentials)) {
		const integrationKeyMgr = integrationKeys[pluginId];
		const accountKeyMgr = pluginNamespaces[pluginId]?.keys as KeyManager | undefined;

		for (const [field, value] of Object.entries(fields)) {
			const setter = `set_${field}`;

			if (integrationKeyMgr && typeof integrationKeyMgr[setter] === 'function') {
				await (integrationKeyMgr[setter] as (v: string) => Promise<void>)(value);
				log(`[corsair:setup] Set integration credential: ${pluginId}.${field}`);
			} else if (accountKeyMgr && typeof accountKeyMgr[setter] === 'function') {
				await (accountKeyMgr[setter] as (v: string) => Promise<void>)(value);
				log(`[corsair:setup] Set account credential: ${pluginId}.${field}`);
			} else {
				warn(`[corsair:setup] No setter found for '${pluginId}.${field}' — skipping.`);
			}
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

async function checkAuthStatus(
	pluginId: string,
	authType: string,
	integrationKeyMgr: KeyManager,
	accountKeyMgr: KeyManager,
	log: SetupLog,
	caller: 'cli' | 'script',
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
		let value: string | null = null;
		try { value = await getter(); } catch { /* treat as missing */ }
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
		let value: string | null = null;
		try { value = await getter(); } catch { /* treat as missing */ }
		if (!value) missingAccount.push(field);
	}

	const isReady = missingIntegration.length === 0 && missingAccount.length === 0;

	if (isReady) {
		log(`[corsair:setup] '${pluginId}' (${authType}) is configured ✓`);
	} else {
		const allMissing = [...missingIntegration, ...missingAccount];

		if (caller === 'cli') {
			const pairs = allMissing.map((f) => `${f}=VALUE`).join(' ');
			log(
				`[corsair:setup] '${pluginId}' (${authType}) needs credentials. Run:\n` +
				`  corsair setup --${pluginId} ${pairs}`,
			);
		} else {
			const lines: string[] = [
				`[corsair:setup] '${pluginId}' (${authType}) needs credentials. Call:`,
			];
			for (const field of missingIntegration) {
				lines.push(`  await corsair.keys.${pluginId}.set_${field}(value)`);
			}
			for (const field of missingAccount) {
				lines.push(`  await corsair.${pluginId}.keys.set_${field}(value)`);
			}
			log(lines.join('\n'));
		}
	}

	return isReady;
}

async function checkAllPluginsAuthStatus(
	instance: CorsairSingleTenantClient<readonly CorsairPlugin[]>,
	plugins: readonly CorsairPlugin[],
	log: SetupLog,
	caller: 'cli' | 'script',
): Promise<Set<string>> {
	const authReadyPlugins = new Set<string>();

	const integrationKeys = instance.keys as unknown as Record<string, KeyManager | undefined>;
	const pluginNamespaces = instance as unknown as Record<string, { keys?: KeyManager } | undefined>;

	for (const plugin of plugins) {
		const pluginId = plugin.id;
		const authType =
			((plugin.options as Record<string, unknown>)?.authType as string | undefined) ?? 'unknown';

		const integrationKeyMgr = integrationKeys[pluginId];
		const accountKeyMgr = pluginNamespaces[pluginId]?.keys as KeyManager | undefined;

		if (integrationKeyMgr && accountKeyMgr) {
			const isReady = await checkAuthStatus(
				pluginId,
				authType,
				integrationKeyMgr,
				accountKeyMgr,
				log,
				caller,
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
	log: SetupLog,
	warn: SetupWarn,
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
			log(`[corsair:setup] Skipping backfill for '${pluginId}' — auth not configured.`);
			continue;
		}

		const api = instanceRecord[pluginId]?.api;
		if (!api) continue;

		for (const [group, methods] of Object.entries(groups)) {
			for (const [method, params] of Object.entries(methods)) {
				log(`[corsair:setup] Backfilling ${pluginId} › ${group}.${method}...`);
				try {
					await api[group]?.[method]?.(params);
				} catch (error) {
					warn(
						`[corsair:setup] ${pluginId} › ${group}.${method} failed: ` +
							(error instanceof Error ? error.message : String(error)),
					);
				}
			}
		}
	}
}