import type { CorsairInternalConfig } from '..';
import { createIntegrationKeyManager } from '../auth/key-manager';
import { BASE_AUTH_FIELDS } from '../auth/types';
import type { AuthTypes } from '../constants';
import type { CorsairPlugin, OAuthConfig } from '../plugins';
import { badRequest, notFound } from './errors';
import type {
	ConnectionStatus,
	CreateTenantInput,
	ManagementOk,
	PermissionRecord,
	PluginConnectionState,
	PluginInfo,
	Tenant,
} from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Core operations for the management control plane.
//
// These pure functions are the single source of truth. Both the HTTP handler
// and the in-process `corsair.manage.*` namespace dispatch into the same ops,
// so HTTP and in-process callers see identical behavior.
// ─────────────────────────────────────────────────────────────────────────────

// ── plugin describe ────────────────────────────────────────────────────────

function findPlugin(
	internal: CorsairInternalConfig,
	pluginId: string,
): CorsairPlugin {
	const plugin = internal.plugins.find((p) => p.id === pluginId);
	if (!plugin) throw notFound(`Plugin '${pluginId}' not found`);
	return plugin;
}

type PluginCredState = {
	configured: boolean;
	missingFields: string[];
};

async function getIntegrationCredState(
	plugin: CorsairPlugin,
	internal: CorsairInternalConfig,
): Promise<PluginCredState> {
	const authType = (plugin.options as { authType?: AuthTypes } | undefined)
		?.authType;
	if (!authType || !internal.database || !internal.kek) {
		return { configured: false, missingFields: [] };
	}

	const km = createIntegrationKeyManager({
		authType,
		integrationName: plugin.id,
		kek: internal.kek,
		database: internal.database,
	});

	const fieldNames = BASE_AUTH_FIELDS[authType]
		.integration as readonly string[];
	// `IntegrationKeyManagerFor<AuthTypes>` is a public type whose accessors are
	// generated per-auth-type via template literals; indexing it with a runtime
	// `get_${field}` string isn't expressible in TS without a structural shim,
	// and exposing a public `Record<string, ...>` interface would weaken the
	// stricter type used elsewhere. The unknown→record double cast is local to
	// this loop and bounded by `BASE_AUTH_FIELDS[authType].integration`.
	const kmAny = km as unknown as Record<string, () => Promise<string | null>>;
	// If the integration row or DEK hasn't been seeded yet (setupCorsair not
	// run), the underlying getter throws. Treat that as "all fields missing"
	// so /plugins and /connection-status stay 200 on a fresh install.
	let values: Array<string | null>;
	try {
		values = await Promise.all(fieldNames.map((f) => kmAny[`get_${f}`]!()));
	} catch {
		values = fieldNames.map(() => null);
	}
	const missingFields = fieldNames.filter((_, i) => values[i] == null);

	// For OAuth2, "configured" means client_id + client_secret are present.
	// redirect_url is treated as optional. For non-OAuth types, configured
	// means every required field is present.
	let configured: boolean;
	if (authType === 'oauth_2') {
		configured =
			!missingFields.includes('client_id') &&
			!missingFields.includes('client_secret');
	} else {
		configured = missingFields.length === 0;
	}

	return { configured, missingFields };
}

export async function describePlugin(
	plugin: CorsairPlugin,
	internal: CorsairInternalConfig,
): Promise<PluginInfo> {
	const authType =
		(plugin.options as { authType?: AuthTypes } | undefined)?.authType ?? null;
	const oauthConfig = (plugin as { oauthConfig?: OAuthConfig }).oauthConfig;
	const { configured, missingFields } = await getIntegrationCredState(
		plugin,
		internal,
	);

	return {
		id: plugin.id,
		authType,
		configured,
		missingFields,
		oauth: oauthConfig
			? {
					providerName: oauthConfig.providerName,
					scopes: oauthConfig.scopes,
					requiresRegisteredRedirect: !!oauthConfig.requiresRegisteredRedirect,
				}
			: null,
	};
}

// ── ok ─────────────────────────────────────────────────────────────────────

export function ok(): ManagementOk {
	return { ok: true };
}

// ── plugins ────────────────────────────────────────────────────────────────

export async function listPlugins(
	internal: CorsairInternalConfig,
): Promise<PluginInfo[]> {
	return Promise.all(internal.plugins.map((p) => describePlugin(p, internal)));
}

export async function getPlugin(
	internal: CorsairInternalConfig,
	pluginId: string,
): Promise<PluginInfo> {
	const plugin = findPlugin(internal, pluginId);
	return describePlugin(plugin, internal);
}

// ── tenants ────────────────────────────────────────────────────────────────

async function listAccountSummariesForTenant(
	internal: CorsairInternalConfig,
	tenantId: string,
): Promise<Tenant['accounts']> {
	if (!internal.database) return [];

	const rows = await internal.database.db
		.selectFrom('corsair_accounts as a')
		.innerJoin('corsair_integrations as i', 'i.id', 'a.integration_id')
		.select(['a.id as accountId', 'a.dek as dek', 'i.name as integrationName'])
		.where('a.tenant_id', '=', tenantId)
		.execute();

	return rows.map((r) => ({
		integrationName: r.integrationName,
		hasCredentials: !!r.dek,
	}));
}

export async function describeTenant(
	internal: CorsairInternalConfig,
	tenantId: string,
): Promise<Tenant> {
	const accounts = await listAccountSummariesForTenant(internal, tenantId);
	const connectedPlugins = accounts
		.filter((a) => a.hasCredentials)
		.map((a) => a.integrationName);
	return { id: tenantId, accounts, connectedPlugins };
}

export async function listTenants(
	internal: CorsairInternalConfig,
): Promise<Tenant[]> {
	// Single grouped JOIN, assembled in memory. Previously this fanned out one
	// `describeTenant` query per tenant, which N+1'd dashboards with many
	// tenants (51 queries at 50 tenants). Now: one query, bounded cost.
	const tenants = new Map<string, Tenant>();
	tenants.set('default', { id: 'default', accounts: [], connectedPlugins: [] });

	if (internal.database) {
		const rows = await internal.database.db
			.selectFrom('corsair_accounts as a')
			.innerJoin('corsair_integrations as i', 'i.id', 'a.integration_id')
			.select(['a.tenant_id', 'a.dek as dek', 'i.name as integrationName'])
			.execute();

		for (const r of rows) {
			const tenantId = r.tenant_id;
			if (!tenantId) continue;
			let t = tenants.get(tenantId);
			if (!t) {
				t = { id: tenantId, accounts: [], connectedPlugins: [] };
				tenants.set(tenantId, t);
			}
			const hasCredentials = !!r.dek;
			t.accounts.push({
				integrationName: r.integrationName,
				hasCredentials,
			});
			if (hasCredentials) t.connectedPlugins.push(r.integrationName);
		}
	}

	return [...tenants.values()];
}

export async function getTenant(
	internal: CorsairInternalConfig,
	id: string,
): Promise<Tenant> {
	if (!id) throw badRequest('Tenant id must be a non-empty string');
	return describeTenant(internal, id);
}

export async function createTenant(
	internal: CorsairInternalConfig,
	input: CreateTenantInput,
): Promise<Tenant> {
	const id = input?.id?.trim();
	if (!id) {
		throw badRequest('Tenant id is required', {
			missingFields: ['id'],
		});
	}
	// Implicit tenant model: no row written. Materializes when first
	// account is linked. We just describe and return.
	return describeTenant(internal, id);
}

// ── connection status ──────────────────────────────────────────────────────

export async function getConnectionStatus(
	internal: CorsairInternalConfig,
	tenantId: string | undefined,
): Promise<ConnectionStatus> {
	const effectiveTenantId = tenantId?.trim() || 'default';
	const result: ConnectionStatus = {};

	const accounts = internal.database
		? await listAccountSummariesForTenant(internal, effectiveTenantId)
		: [];
	const accountsByPlugin = new Map(accounts.map((a) => [a.integrationName, a]));

	for (const plugin of internal.plugins) {
		const cred = await getIntegrationCredState(plugin, internal);
		if (!cred.configured) {
			result[plugin.id] = 'missing_credentials';
			continue;
		}
		const account = accountsByPlugin.get(plugin.id);
		let state: PluginConnectionState;
		if (account && account.hasCredentials) {
			state = 'connected';
		} else {
			state = 'not_connected';
		}
		result[plugin.id] = state;
	}

	return result;
}

// ── permissions ────────────────────────────────────────────────────────────

export async function getPermission(
	internal: CorsairInternalConfig,
	id: string,
): Promise<PermissionRecord> {
	if (!internal.database) {
		throw notFound(`Permission '${id}' not found`);
	}
	const record = await internal.database.db
		.selectFrom('corsair_permissions')
		.selectAll()
		.where('id', '=', id)
		.executeTakeFirst();
	if (!record) throw notFound(`Permission '${id}' not found`);
	return record;
}

export async function getPermissionByToken(
	internal: CorsairInternalConfig,
	token: string,
): Promise<PermissionRecord> {
	// Token is a short-lived authorization credential — never echo it back in
	// error messages or response bodies where it could end up in logs.
	if (!internal.database) {
		throw notFound('Permission not found');
	}
	const record = await internal.database.db
		.selectFrom('corsair_permissions')
		.selectAll()
		.where('token', '=', token)
		.executeTakeFirst();
	if (!record) {
		throw notFound('Permission not found');
	}
	return record;
}
