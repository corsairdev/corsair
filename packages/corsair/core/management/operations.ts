import { getHubConfig } from '../../hub/config';
import { createHubConnectSession } from '../../hub/connect';
import {
	resolveConnectSourceFromDeliveryUrl,
	validateExplicitConnectSource,
} from '../../hub/contracts/delivery-mode';
import type { HubConnectSessionInput } from '../../hub/types';
import type { CorsairInternalConfig } from '..';
import { createIntegrationKeyManager } from '../auth/key-manager';
import {
	DEFAULT_CONNECT_LINK_TTL_MS,
	encodeOAuthState,
	signState,
} from '../auth/state';
import { BASE_AUTH_FIELDS } from '../auth/types';
import { ConnectError, resolveConnectLink } from '../connect';
import type { AuthTypes } from '../constants';
import { enrichPermissionWithApprovalUrl } from '../permissions';
import type { CorsairPlugin, OAuthConfig } from '../plugins';
import { requireCorsairPlugin } from '../utils/corsair-instance';
import { badRequest, ManagementApiError, notFound } from './errors';
import type {
	ConnectionStatus,
	ConnectLink,
	CreateConnectLinkInput,
	CreateTenantInput,
	ManagementOk,
	OAuthCallbackInput,
	OAuthCallbackResult,
	PermissionRecord,
	PluginConnectionState,
	PluginInfo,
	ResolvedConnectLink,
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
	return requireCorsairPlugin(internal, pluginId, (message) =>
		notFound(message),
	);
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
	return enrichPermissionWithApprovalUrl(internal, record);
}

// ── connect / OAuth ────────────────────────────────────────────────────────

function assertOAuthConfigured(plugin: CorsairPlugin): void {
	const cfg = (plugin as { oauthConfig?: OAuthConfig }).oauthConfig;
	if (!cfg) {
		throw badRequest(`Plugin '${plugin.id}' has no oauthConfig`);
	}
}

function requireManualConfig(
	internal: CorsairInternalConfig,
): NonNullable<CorsairInternalConfig['manual']> {
	if (!internal.manual) {
		throw new ManagementApiError(
			500,
			'connect_not_configured',
			'createCorsair was not given manual config. Set { manual: { baseUrl, redirectUri } } to enable manual connect routes.',
		);
	}
	return internal.manual;
}

function hasManualConnectConfig(
	manual: CorsairInternalConfig['manual'],
): boolean {
	return Boolean(manual?.baseUrl?.trim() && manual?.redirectUri?.trim());
}

function requireManualConnectConfig(
	internal: CorsairInternalConfig,
): NonNullable<CorsairInternalConfig['manual']> & {
	baseUrl: string;
	redirectUri: string;
} {
	const manual = requireManualConfig(internal);
	if (!manual.baseUrl?.trim() || !manual.redirectUri?.trim()) {
		throw new ManagementApiError(
			500,
			'connect_not_configured',
			'Manual connect requires manual.baseUrl and manual.redirectUri. Use hub for hosted connect, or set both URLs for manual OAuth.',
		);
	}
	return manual as NonNullable<CorsairInternalConfig['manual']> & {
		baseUrl: string;
		redirectUri: string;
	};
}

function assertConnectModeConfigured(internal: CorsairInternalConfig): void {
	const hasHub = Boolean(internal.hub);
	const hasManualConnect = hasManualConnectConfig(internal.manual);
	if (!hasHub && !hasManualConnect) {
		throw new ManagementApiError(
			500,
			'connect_not_configured',
			'createCorsair was not given connect config. Set hub: { ... } for Hub mode, or manual: { baseUrl, redirectUri } for manual connect.',
		);
	}
}

function requireDatabaseForConnect(internal: CorsairInternalConfig): void {
	if (!internal.database || !internal.kek) {
		throw new ManagementApiError(
			500,
			'database_not_configured',
			'A database and kek are required to issue connect links.',
		);
	}
}

async function createManualConnectLink(
	internal: CorsairInternalConfig,
	input: CreateConnectLinkInput,
): Promise<ConnectLink> {
	const pluginId = input?.plugin?.trim();
	if (!pluginId) {
		throw badRequest('Plugin id is required', { missingFields: ['plugin'] });
	}
	const tenantId = input.tenantId?.trim() || 'default';

	const plugin = findPlugin(internal, pluginId);
	assertOAuthConfigured(plugin);
	const manual = requireManualConnectConfig(internal);
	requireDatabaseForConnect(internal);

	// Surface unset client creds as data, matching /plugins behavior.
	const cred = await getIntegrationCredState(plugin, internal);
	if (!cred.configured) {
		throw new ManagementApiError(
			400,
			'missing_credentials',
			`Plugin '${pluginId}' is missing OAuth client credentials`,
			{ missingFields: cred.missingFields },
		);
	}

	const state = signState(encodeOAuthState(pluginId, tenantId), internal.kek);
	let url: URL;
	try {
		url = new URL(manual.baseUrl);
	} catch {
		throw new ManagementApiError(
			500,
			'connect_misconfigured',
			'manual.baseUrl is not a valid URL. Set a full URL including protocol (e.g. https://app.example.com/connect).',
		);
	}
	url.searchParams.set('state', state);

	return {
		connectUrl: url.toString(),
		expiresAt: new Date(Date.now() + DEFAULT_CONNECT_LINK_TTL_MS).toISOString(),
	};
}

async function createHubModeConnectLink(
	corsair: unknown,
	internal: CorsairInternalConfig,
	input: CreateConnectLinkInput,
): Promise<ConnectLink> {
	requireDatabaseForConnect(internal);

	const tenantId = input.tenantId?.trim() || 'default';
	const hub = getHubConfig(corsair);

	if (input.source) {
		const sourceValidation = validateExplicitConnectSource({
			source: input.source,
			deliveryUrl: hub.deliveryUrl,
			oauthMode: input.oauthMode,
		});
		if (sourceValidation) {
			throw badRequest(sourceValidation.error);
		}
	}

	const connectInput: HubConnectSessionInput = {
		tenantId,
		source:
			input.source ?? resolveConnectSourceFromDeliveryUrl(hub.deliveryUrl),
		oauthMode: input.oauthMode,
	};

	const pluginId = input.plugin?.trim();
	if (pluginId) {
		connectInput.plugin = pluginId;
	}
	const providerName = input.providerName?.trim();
	if (providerName) {
		connectInput.providerName = providerName;
	}

	const session = await createHubConnectSession(corsair, connectInput);
	return {
		connectUrl: session.connectUrl,
		expiresAt: session.expiresAt,
	};
}

export async function createConnectLink(
	corsair: unknown,
	internal: CorsairInternalConfig,
	input: CreateConnectLinkInput,
): Promise<ConnectLink> {
	assertConnectModeConfigured(internal);

	if (internal.hub) {
		return createHubModeConnectLink(corsair, internal, input);
	}

	return createManualConnectLink(internal, input);
}

export async function resolveConnect(
	// `unknown` matches the underlying `resolveConnectLink` signature — the
	// existing OAuth utilities read the CORSAIR_INTERNAL symbol and never
	// touch the public client shape. See managementHandler for the same
	// rationale.
	corsair: unknown,
	internal: CorsairInternalConfig,
	state: string,
): Promise<ResolvedConnectLink> {
	if (internal.hub && !hasManualConnectConfig(internal.manual)) {
		throw new ManagementApiError(
			400,
			'hub_mode',
			'resolve is not used with hub config. Redirect users to connectUrl from createLink.',
		);
	}

	const trimmed = state?.trim();
	if (!trimmed) {
		throw badRequest('state is required', { missingFields: ['state'] });
	}
	// Guard up front so a missing connect block returns the same
	// `connect_not_configured` code as the other connect routes, rather than
	// falling through to a generic resolve_failed when resolveConnectLink
	// throws on a missing redirectUri.
	requireManualConnectConfig(internal);
	try {
		return await resolveConnectLink(corsair, trimmed);
	} catch (err) {
		if (err instanceof ConnectError) {
			switch (err.code) {
				case 'invalid_state':
					throw badRequest('Invalid or expired state');
				case 'client_id_not_configured':
					throw new ManagementApiError(
						400,
						'missing_credentials',
						'OAuth client_id is not configured for this plugin',
						{ missingFields: ['client_id'] },
					);
				case 'no_redirect_uri':
					// Already guarded above via requireManualConfig; fall through.
					break;
			}
		}
		// Unknown causes surface as a generic resolve_failed — never the raw
		// upstream message, which could include details we don't want echoed.
		throw new ManagementApiError(
			500,
			'resolve_failed',
			'Could not resolve connect link. Check server logs for details.',
		);
	}
}

export async function completeOAuthCallback(
	// `unknown` matches the underlying `processOAuthCallback` signature — see
	// resolveConnect / managementHandler for the same rationale.
	corsair: unknown,
	internal: CorsairInternalConfig,
	input: OAuthCallbackInput,
): Promise<OAuthCallbackResult> {
	if (internal.hub && !hasManualConnectConfig(internal.manual)) {
		throw new ManagementApiError(
			400,
			'hub_mode',
			'oauthCallback is not used with hub config. Hub delivers tokens to your deliveryUrl.',
		);
	}

	const code = input?.code?.trim();
	const state = input?.state?.trim();
	const missing: string[] = [];
	if (!code) missing.push('code');
	if (!state) missing.push('state');
	if (missing.length) {
		throw badRequest('Missing required fields', { missingFields: missing });
	}

	const manual = requireManualConnectConfig(internal);

	// Lazy import to avoid a management → oauth → core import cycle at module
	// load. By call time the oauth module is fully resolved. The type-only
	// import below is erased and contributes no cycle.
	const { processOAuthCallback } = await import('../../oauth');
	type OAuthCallbackErrorShape = import('../../oauth').OAuthCallbackError;

	try {
		return await processOAuthCallback(corsair, {
			code: code!,
			state: state!,
			redirectUri: manual.redirectUri,
		});
	} catch (err) {
		// Class identity check via `name` so we don't have to import the class
		// value statically and reintroduce the cycle.
		if (err instanceof Error && err.name === 'OAuthCallbackError') {
			const oauthErr = err as OAuthCallbackErrorShape;
			switch (oauthErr.code) {
				case 'invalid_state':
					throw badRequest('Invalid or expired state');
				case 'credentials_not_configured':
					throw new ManagementApiError(
						400,
						'missing_credentials',
						'OAuth client credentials are not configured for this plugin',
						{ missingFields: ['client_id', 'client_secret'] },
					);
			}
		}
		// Unknown causes surface as a generic 502 — provider responses stay
		// on the server. processOAuthCallback wraps the OAuth provider's raw
		// response inside its thrown Error, so the message may carry
		// provider-specific details we don't want to echo to clients.
		throw new ManagementApiError(
			502,
			'oauth_callback_failed',
			'OAuth callback did not complete. Check server logs for details.',
		);
	}
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
	return enrichPermissionWithApprovalUrl(internal, record);
}

export async function lookupPermission(
	internal: CorsairInternalConfig,
	input: { id: string } | { token: string },
): Promise<PermissionRecord> {
	if ('id' in input) {
		return getPermission(internal, input.id);
	}
	return getPermissionByToken(internal, input.token);
}
