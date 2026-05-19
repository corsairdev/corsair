import { Kysely } from 'kysely';
import type { ZodTypeAny } from 'zod';
import {
	ZodBoolean,
	ZodDate,
	ZodEnum,
	ZodNullable,
	ZodNumber,
	ZodObject,
	ZodOptional,
	ZodRecord,
	ZodString,
	ZodType,
} from 'zod';
import type {
	AuthTypes,
	BaseKeyManager,
	CorsairInternalConfig,
	CorsairPlugin,
	CorsairSingleTenantClient,
	CorsairTenantWrapper,
} from '../core';
import {
	BASE_AUTH_FIELDS,
	CORSAIR_INTERNAL,
	createAccountKeyManager,
	createCorsair,
	createIntegrationKeyManager,
} from '../core';
import type {
	CorsairDatabase,
	CorsairKyselyDatabase,
} from '../db/kysely/database';
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

export interface SetupCorsairOptions {
	/**
	 * Tenant to provision rows for. Defaults to "default".
	 * Pass a specific tenant ID to create that tenant's `corsair_accounts` rows
	 * and issue DEKs without touching other tenants.
	 */
	tenantId?: string;

	/**
	 * When true, calls list endpoints for every plugin defined in
	 * setup/backfill.yaml to seed the local database with initial data.
	 */
	backfill?: boolean;

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
type SetupCorsairInstance<Plugins extends readonly CorsairPlugin[]> =
	| CorsairSingleTenantClient<Plugins>
	| CorsairTenantWrapper<Plugins>;
type SetupInternalConfig = CorsairInternalConfig & {
	database: CorsairDatabase;
};

type CallableProperty = (...args: readonly unknown[]) => unknown;

type PluginSetupAuth = {
	pluginId: string;
	authType: AuthTypes;
	integration: BaseKeyManager;
	account: BaseKeyManager;
	integrationFields: readonly string[];
	accountFields: readonly string[];
};

/**
 * Initialises a corsair instance end-to-end:
 *
 * 1. Checks that all required corsair_* tables exist (warns if any are missing).
 * 2. Ensures every configured plugin has rows in `corsair_integrations` and
 *    `corsair_accounts` for the requested tenant and issues DEKs where needed.
 * 3. Checks auth status for each plugin and logs guidance for any missing credentials.
 *    When `caller` is 'cli', guidance is printed as CLI flags instead of JS calls.
 * 4. If `{ backfill: true }`, calls the list endpoints defined in
 *    `setup/backfill.yaml` for each plugin that has auth configured.
 *
 * To set credentials, use the corsair client API directly after setup:
 *   - Integration-level (shared across all tenants): `corsair.keys.plugin.set_*(value)`
 *   - Account-level (per-tenant): `corsair.withTenant(tenantId).plugin.keys.set_*(value)`
 *
 * Multi-tenant corsair instances are accepted; pass `options.tenantId` to provision
 * rows for a specific tenant instead of the default account.
 *
 * Returns a newline-separated string of all setup output.
 */
export async function setupCorsair<
	const Plugins extends readonly CorsairPlugin[],
>(
	corsair: SetupCorsairInstance<Plugins>,
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
	let tenantId = options?.tenantId;

	if (!tenantId) {
		if ((corsair as unknown as any)?.withTenant) {
			throw new Error('setupCorsair: tenantId must be a non-empty string');
		}
		tenantId = 'default';
	}

	const internal = getCorsairInternal(corsair);

	if (!internal) {
		throw new Error('setupCorsair: invalid corsair instance');
	}
	if (!internal.database) {
		throw new Error(
			'setupCorsair: a database must be configured on the corsair instance',
		);
	}

	const setupInternal: SetupInternalConfig = {
		...internal,
		database: internal.database,
	};
	const db = setupInternal.database.db;

	// 1. Verify schema
	await checkTables(db, warn);

	// 2. Create integration + account rows and issue DEKs for every plugin.
	const pluginAuth = await ensurePluginRowsAndDeks(
		db,
		setupInternal,
		tenantId,
		log,
	);

	// 3. Check auth status for each plugin and log guidance for missing credentials.
	const authReadyPlugins = await checkAllPluginsAuthStatus(
		pluginAuth,
		tenantId,
		log,
		caller,
	);

	// 4. Optional backfill — only for plugins with auth configured.
	if (options?.backfill) {
		log('[corsair:setup] Starting backfill...');
		const instance = createCorsair({
			plugins: internal.plugins,
			database: db,
			kek: internal.kek,
			multiTenancy: true,
		}).withTenant(tenantId);
		await runBackfill(instance, internal.plugins, authReadyPlugins, log, warn);
		log('[corsair:setup] Backfill complete.');
	}

	return messages.join('\n');
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function isCorsairInternalConfig(
	value: unknown,
): value is CorsairInternalConfig {
	if (!isObjectRecord(value)) return false;
	if (!Array.isArray(value.plugins)) return false;
	if (typeof value.kek !== 'string') return false;
	if (typeof value.multiTenancy !== 'boolean') return false;
	if (value.database === undefined) return true;
	if (!isObjectRecord(value.database)) return false;
	return value.database.db instanceof Kysely;
}

function getCorsairInternal(
	corsair: object,
): CorsairInternalConfig | undefined {
	const descriptor = Object.getOwnPropertyDescriptor(corsair, CORSAIR_INTERNAL);
	if (!descriptor) return undefined;
	return isCorsairInternalConfig(descriptor.value)
		? descriptor.value
		: undefined;
}

function isAuthType(value: unknown): value is AuthTypes {
	return value === 'oauth_2' || value === 'api_key' || value === 'bot_token';
}

function getPluginAuthType(plugin: CorsairPlugin): AuthTypes | undefined {
	const authType = plugin.options?.authType;
	return isAuthType(authType) ? authType : undefined;
}

function getCallableProperty(
	value: unknown,
	key: string,
): CallableProperty | undefined {
	if (!isObjectRecord(value)) return undefined;
	const property = value[key];
	return typeof property === 'function'
		? (...args) => Reflect.apply(property, value, args)
		: undefined;
}

function isNestedRecord(value: unknown, depth: number): boolean {
	if (!isObjectRecord(value)) return false;
	if (depth === 0) return true;
	return Object.values(value).every((child) =>
		isNestedRecord(child, depth - 1),
	);
}

function isBackfillYaml(value: unknown): value is BackfillYaml {
	return isNestedRecord(value, 4);
}

// ─────────────────────────────────────────────────────────────────────────────
// Table check
// ─────────────────────────────────────────────────────────────────────────────

const REQUIRED_TABLES = {
	...TABLE_SCHEMAS,
};

function describeZodSchema(schema: ZodTypeAny): unknown {
	if (schema instanceof ZodObject) {
		const shape: Record<string, unknown> = {};
		for (const [key, val] of Object.entries(schema.shape)) {
			shape[key] = val instanceof ZodType ? describeZodSchema(val) : 'unknown';
		}
		return shape;
	}
	if (schema instanceof ZodNullable)
		return `${describeZodSchema(schema.unwrap() as ZodTypeAny)} | null`;
	if (schema instanceof ZodOptional)
		return `${describeZodSchema(schema.unwrap() as ZodTypeAny)} | undefined`;
	if (schema instanceof ZodEnum) return schema.options.join(' | ');
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

async function ensurePluginRowsAndDeks(
	db: Kysely<CorsairKyselyDatabase>,
	internal: SetupInternalConfig,
	tenantId: string,
	log: SetupLog,
): Promise<Map<string, PluginSetupAuth>> {
	const now = new Date();
	const pluginAuth = new Map<string, PluginSetupAuth>();

	for (const plugin of internal.plugins) {
		const pluginId = plugin.id;
		const authType = getPluginAuthType(plugin);

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
			log(`[corsair:setup] Created integration: ${pluginId}`);
		}

		// ── Integration-level DEK ──────────────────────────────────────────────
		const extraIntegrationFields = authType
			? (plugin.authConfig?.[authType]?.integration ?? [])
			: [];
		const extraAccountFields = authType
			? (plugin.authConfig?.[authType]?.account ?? [])
			: [];
		const integrationKeyMgr =
			authType && integration
				? createIntegrationKeyManager({
						authType,
						integrationName: pluginId,
						kek: internal.kek,
						database: internal.database,
						extraIntegrationFields,
					})
				: undefined;

		if (integration && !integration.dek && integrationKeyMgr) {
			await integrationKeyMgr.issue_new_dek();
			log(`[corsair:setup] Issued integration DEK: ${pluginId}`);
		}

		if (!integration) continue;

		// ── Account row ───────────────────────────────────────────────────────
		let account = await db
			.selectFrom('corsair_accounts')
			.selectAll()
			.where('tenant_id', '=', tenantId)
			.where('integration_id', '=', integration.id)
			.executeTakeFirst();

		if (!account) {
			const id = crypto.randomUUID();
			await db
				.insertInto('corsair_accounts')
				.values({
					id,
					tenant_id: tenantId,
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
		const accountKeyMgr =
			authType && account
				? createAccountKeyManager({
						authType,
						integrationName: pluginId,
						tenantId,
						kek: internal.kek,
						database: internal.database,
						extraAccountFields,
					})
				: undefined;
		if (account && !account.dek && accountKeyMgr) {
			await accountKeyMgr.issue_new_dek();
			log(`[corsair:setup] Issued account DEK: ${pluginId}`);
		}

		if (authType && integrationKeyMgr && accountKeyMgr) {
			pluginAuth.set(pluginId, {
				pluginId,
				authType,
				integration: integrationKeyMgr,
				account: accountKeyMgr,
				integrationFields: [
					...BASE_AUTH_FIELDS[authType].integration,
					...extraIntegrationFields,
				],
				accountFields: [
					...BASE_AUTH_FIELDS[authType].account,
					...extraAccountFields,
				],
			});
		}
	}

	return pluginAuth;
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
	authType: AuthTypes,
	integrationKeyMgr: BaseKeyManager,
	accountKeyMgr: BaseKeyManager,
	integrationFields: readonly string[],
	accountFields: readonly string[],
	tenantId: string,
	log: SetupLog,
	caller: 'cli' | 'script',
): Promise<boolean> {
	const missingIntegration: string[] = [];
	const missingAccount: string[] = [];

	for (const field of integrationFields) {
		if (OPTIONAL_FIELDS.has(field)) continue;
		const getter = getCallableProperty(integrationKeyMgr, `get_${field}`);
		if (!getter) continue;
		let value: string | null = null;
		try {
			const result = await getter();
			value = typeof result === 'string' ? result : null;
		} catch {
			/* treat as missing */
		}
		if (!value) missingIntegration.push(field);
	}

	for (const field of accountFields) {
		if (OPTIONAL_FIELDS.has(field)) continue;
		const getter = getCallableProperty(accountKeyMgr, `get_${field}`);
		if (!getter) continue;
		let value: string | null = null;
		try {
			const result = await getter();
			value = typeof result === 'string' ? result : null;
		} catch {
			/* treat as missing */
		}
		if (!value) missingAccount.push(field);
	}

	const isReady =
		missingIntegration.length === 0 && missingAccount.length === 0;

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
				const accountNamespace =
					tenantId === 'default'
						? `corsair.${pluginId}`
						: `corsair.withTenant(${JSON.stringify(tenantId)}).${pluginId}`;
				lines.push(`  await ${accountNamespace}.keys.set_${field}(value)`);
			}
			log(lines.join('\n'));
		}
	}

	return isReady;
}

async function checkAllPluginsAuthStatus(
	pluginAuth: Map<string, PluginSetupAuth>,
	tenantId: string,
	log: SetupLog,
	caller: 'cli' | 'script',
): Promise<Set<string>> {
	const authReadyPlugins = new Set<string>();

	for (const auth of pluginAuth.values()) {
		const isReady = await checkAuthStatus(
			auth.pluginId,
			auth.authType,
			auth.integration,
			auth.account,
			auth.integrationFields,
			auth.accountFields,
			tenantId,
			log,
			caller,
		);
		if (isReady) authReadyPlugins.add(auth.pluginId);
	}

	return authReadyPlugins;
}

// ─────────────────────────────────────────────────────────────────────────────
// Backfill
// ─────────────────────────────────────────────────────────────────────────────

async function runBackfill(
	instance: object,
	plugins: readonly CorsairPlugin[],
	authReadyPlugins: Set<string>,
	log: SetupLog,
	warn: SetupWarn,
): Promise<void> {
	if (!isBackfillYaml(backfillConfig)) {
		warn('[corsair:setup] Backfill config is invalid - skipping backfill.');
		return;
	}
	const config = backfillConfig;
	const activePluginIds = new Set(plugins.map((p) => p.id));

	for (const [pluginId, groups] of Object.entries(config)) {
		if (!activePluginIds.has(pluginId)) continue;

		if (!authReadyPlugins.has(pluginId)) {
			log(
				`[corsair:setup] Skipping backfill for '${pluginId}' — auth not configured.`,
			);
			continue;
		}

		const pluginNamespace = isObjectRecord(instance)
			? instance[pluginId]
			: undefined;
		const api = isObjectRecord(pluginNamespace)
			? pluginNamespace.api
			: undefined;
		if (!api) continue;

		for (const [group, methods] of Object.entries(groups)) {
			for (const [method, params] of Object.entries(methods)) {
				log(`[corsair:setup] Backfilling ${pluginId} › ${group}.${method}...`);
				try {
					const groupNamespace = isObjectRecord(api) ? api[group] : undefined;
					const endpoint = getCallableProperty(groupNamespace, method);
					await endpoint?.(params);
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
