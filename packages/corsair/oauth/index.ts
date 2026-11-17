import { randomBytes } from 'node:crypto';
import type {
	CorsairInternalConfig,
	CorsairPlugin,
	OAuthConfig,
} from '../core';
import {
	createAccountKeyManager,
	createIntegrationKeyManager,
	exchangeCodeForTokens,
} from '../core';
import {
	AccountSelectionError,
	listAccountSummaries,
	MAX_ACCOUNTS_PER_INTEGRATION,
	resolveAccount,
	upsertAccount,
} from '../core/account-lookup';
import type { OAuthAccountTarget } from '../core/auth/state';
import {
	encodeOAuthState,
	signState,
	verifyAndDecodeState,
} from '../core/auth/state';
import {
	getCorsairInternal,
	requireCorsairPlugin,
} from '../core/utils/corsair-instance';
import {
	registerHubWebhookTenantLink,
	reportPluginConnectionStatus,
} from '../hub/report-connection-status';
import { resolveOAuthWebhookTenantLink } from '../webhooks/resolve-oauth-tenant-link';
import { setWebhookTenantLink } from '../webhooks/tenant-links';
import { buildOAuthAuthorizeUrl } from './authorize-url';
import { subscribeAndStoreLink } from './subscribe-and-store';

// Re-export state utilities for backward compatibility (barrel oauth.ts re-exports these)
export { decodeOAuthState, encodeOAuthState } from '../core/auth/state';
export {
	type BuildOAuthAuthorizeUrlInput,
	buildOAuthAuthorizeUrl,
} from './authorize-url';

// ─────────────────────────────────────────────────────────────────────────────
// Structured errors
//
// Callers (e.g. the management handler) need to map specific failure modes to
// distinct HTTP responses. Matching on free-form `error.message` strings is
// brittle; the `code` field is the contract — `message` is for humans.
// ─────────────────────────────────────────────────────────────────────────────

export type OAuthCallbackErrorCode =
	| 'invalid_corsair_instance'
	| 'no_database'
	| 'invalid_state'
	| 'plugin_not_found'
	| 'plugin_has_no_oauth_config'
	| 'credentials_not_configured'
	| 'no_access_token'
	// Multi-account: which account a connect is for.
	| 'account_required'
	| 'account_not_found'
	| 'account_unnamed'
	| 'account_limit';

export class OAuthCallbackError extends Error {
	readonly code: OAuthCallbackErrorCode;

	constructor(code: OAuthCallbackErrorCode, message: string) {
		super(message);
		this.name = 'OAuthCallbackError';
		this.code = code;
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

function getOAuthConfig(plugin: CorsairPlugin): OAuthConfig {
	const cfg = (plugin as { oauthConfig?: OAuthConfig }).oauthConfig;
	if (!cfg) {
		throw new OAuthCallbackError(
			'plugin_has_no_oauth_config',
			`Plugin '${plugin.id}' has no oauthConfig`,
		);
	}
	return cfg;
}

async function ensureAccount(
	database: NonNullable<CorsairInternalConfig['database']>,
	pluginId: string,
	tenantId: string,
	kek: string,
	allowMany: boolean,
): Promise<void> {
	await upsertAccount({
		database,
		kek,
		integrationName: pluginId,
		tenantId,
		allowMany,
	});
}

type AccountPlan =
	| { kind: 'only' }
	| { kind: 'row'; id: string; unnamed: boolean }
	| { kind: 'new' };

// A rejection is unknown; only an account selection error is translated.
const asCallbackError = (err: unknown): unknown =>
	err instanceof AccountSelectionError
		? new OAuthCallbackError(err.code, err.message)
		: err;

/**
 * Which account a connect is for, decided from the click signed into its
 * state and written nowhere yet: the code is exchanged only once this holds,
 * and an account is created only once that exchange worked. Without
 * multi-account there is one account, as before. With it the provider isn't
 * asked who signed in, so the caller says whether this is a new account or a
 * reconnect, and a new one is named "Account N".
 */
async function planAccount(
	database: NonNullable<CorsairInternalConfig['database']>,
	kek: string,
	multiAccount: boolean,
	pluginId: string,
	tenantId: string,
	target: OAuthAccountTarget | undefined,
): Promise<AccountPlan> {
	if (!multiAccount) return { kind: 'only' };
	const integration = await database.db
		.selectFrom('corsair_integrations')
		.select('id')
		.where('name', '=', pluginId)
		.executeTakeFirst();
	const scope = {
		db: database.db,
		kek,
		tenantId,
		integrationId: integration?.id ?? '',
	};
	const accounts = integration
		? await listAccountSummaries({
				db: database.db,
				kek,
				integrationName: pluginId,
				tenantId,
			})
		: [];
	if (target && 'reconnect' in target) {
		// resolveAccount's own rules: id first, then ref, and a label two
		// accounts share is refused rather than guessed.
		const found = await resolveAccount({
			...scope,
			ref: target.reconnect,
		}).catch((err) => {
			throw asCallbackError(err);
		});
		if (!found) {
			throw new OAuthCallbackError(
				'account_not_found',
				`No ${pluginId} account "${target.reconnect}" to reconnect for tenant "${tenantId}"`,
			);
		}
		const summary = accounts.find((a) => a.id === found.id);
		return { kind: 'row', id: found.id, unnamed: !summary?.ref };
	}
	if (!target) {
		if (accounts.length > 1) {
			throw new OAuthCallbackError(
				'account_required',
				`${pluginId} has ${accounts.length} accounts for tenant "${tenantId}": say which one to reconnect, or add one`,
			);
		}
		const only = accounts[0];
		return only
			? { kind: 'row', id: only.id, unnamed: !only.ref }
			: { kind: 'new' };
	}
	// upsertAccount gives a new identity to an unnamed row, so adding beside
	// one would hand that account's row to the new sign-in.
	if (accounts.some((a) => !a.ref)) {
		throw new OAuthCallbackError(
			'account_unnamed',
			`Reconnect the existing ${pluginId} account before adding another`,
		);
	}
	if (accounts.length >= MAX_ACCOUNTS_PER_INTEGRATION) {
		throw new OAuthCallbackError(
			'account_limit',
			`${pluginId} already has ${accounts.length} accounts for tenant "${tenantId}"`,
		);
	}
	return { kind: 'new' };
}

/** Writes the planned account, now that the provider has handed over tokens. */
async function commitAccount(
	database: NonNullable<CorsairInternalConfig['database']>,
	kek: string,
	pluginId: string,
	tenantId: string,
	plan: AccountPlan,
): Promise<string | undefined> {
	if (plan.kind === 'only') {
		await ensureAccount(database, pluginId, tenantId, kek, false);
		return undefined;
	}
	if (plan.kind === 'row' && !plan.unnamed) return plan.id;
	// A new account, or an unnamed one taking a name so Add can follow it.
	const { accountId } = await upsertAccount({
		database,
		kek,
		integrationName: pluginId,
		tenantId,
		allowMany: true,
		nameNew: true,
		...(plan.kind === 'row' && { rowId: plan.id }),
		// Random, not a v7 UUID: two adds in one millisecond share a v7's prefix.
		identity: { id: `acct_${randomBytes(12).toString('base64url')}` },
	}).catch((err) => {
		throw asCallbackError(err);
	});
	return accountId;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

export type GenerateOAuthUrlOptions = {
	tenantId: string;
	redirectUri: string;
	/** Hub generates OAuth state server-side and injects it into the authorize URL. */
	hubConnect?: boolean;
	/** With multiAccount: add an account, or reconnect one by its id, ref or label. */
	account?: OAuthAccountTarget;
};

export type GenerateOAuthUrlResult = {
	url: string;
	state: string;
};

/**
 * Builds an OAuth authorization URL for the given plugin and tenant.
 *
 * Embed the returned `url` in a button or link for the customer to click.
 * The returned `state` is HMAC-signed — pass it to processOAuthCallback as-is.
 *
 * Requires the plugin to have an oauthConfig (e.g. googlecalendar, gmail,
 * notion, spotify). Plugins like slack and linear use API keys, not OAuth.
 * The plugin's client_id and client_secret must be set via `corsair setup`.
 *
 * Works for both multi-tenant and single-tenant corsair instances.
 */
export async function generateOAuthUrl(
	corsair: unknown,
	pluginId: string,
	options: GenerateOAuthUrlOptions,
): Promise<GenerateOAuthUrlResult> {
	const { tenantId, redirectUri, hubConnect = false } = options;
	const internal = getCorsairInternal(
		corsair,
		() =>
			new OAuthCallbackError(
				'invalid_corsair_instance',
				'Invalid corsair instance',
			),
	);

	if (!internal.database) {
		throw new Error('No database configured on corsair instance');
	}

	const plugin = requireCorsairPlugin(
		internal,
		pluginId,
		(message) => new OAuthCallbackError('plugin_not_found', message),
	);
	const oauthCfg = getOAuthConfig(plugin);

	const integrationKm = createIntegrationKeyManager({
		authType: 'oauth_2',
		integrationName: pluginId,
		kek: internal.kek,
		database: internal.database,
	});

	const clientId = await integrationKm.get_client_id();
	if (!clientId) {
		throw new Error(`client_id not configured for '${pluginId}'`);
	}

	if (hubConnect) {
		const authorizeUrl = new URL(
			buildOAuthAuthorizeUrl({
				oauthConfig: oauthCfg,
				clientId,
				redirectUri,
				state: '',
			}),
		);
		authorizeUrl.searchParams.delete('state');
		return { url: authorizeUrl.toString(), state: '' };
	}

	const state = signState(
		encodeOAuthState(pluginId, tenantId, options.account),
		internal.kek,
	);

	return {
		url: buildOAuthAuthorizeUrl({
			oauthConfig: oauthCfg,
			clientId,
			redirectUri,
			state,
		}),
		state,
	};
}

export type ProcessOAuthCallbackOptions = {
	code: string;
	state: string;
	/** Must exactly match the redirectUri passed to generateOAuthUrl. */
	redirectUri: string;
	/**
	 * Set ONLY by a caller that has already verified the request signature (a
	 * Hub-signed delivery envelope). When true, `state` is not HMAC-verified and
	 * `plugin`/`tenantId` are read from here instead — Hub cannot sign a Corsair
	 * state because it never holds the project KEK. Never set this from a wire
	 * field; the whole security of the bypass rests on it being caller-asserted.
	 */
	trusted?: boolean;
	/** Required when `trusted` is true. Ignored otherwise (state is decoded). */
	plugin?: string;
	tenantId?: string;
	// Provider callback params (e.g. GitHub's installation_id) absent from the token body.
	callbackParams?: Record<string, string>;
};

export type ProcessOAuthCallbackResult = {
	plugin: string;
	tenantId: string;
};

// Token body wins on collision; callback params only fill gaps.
export function mergeOAuthProviderData(
	tokens: Record<string, unknown>,
	callbackParams?: Record<string, string>,
): Record<string, unknown> {
	return { ...(callbackParams ?? {}), ...tokens };
}

/**
 * Completes the OAuth flow by exchanging the authorization code for tokens
 * and storing them encrypted in the database for the tenant.
 *
 * Call this inside your /api/auth route after receiving `code` and `state`
 * from the provider redirect.
 *
 * @throws if state is invalid, credentials are missing, or token exchange fails
 */
export async function processOAuthCallback(
	corsair: unknown,
	options: ProcessOAuthCallbackOptions,
): Promise<ProcessOAuthCallbackResult> {
	const { code, state, redirectUri } = options;

	const internal = getCorsairInternal(
		corsair,
		() =>
			new OAuthCallbackError(
				'invalid_corsair_instance',
				'Invalid corsair instance',
			),
	);

	// Trusted path: caller verified the request signature and asserts plugin/
	// tenant. Hub's `state` is an opaque session id it cannot sign, so verifying
	// it here would always fail. Gated on the explicit `trusted` flag, not just
	// the presence of plugin/tenant, so no future caller bypasses by accident.
	let pluginId: string;
	let tenantId: string;
	let target: OAuthAccountTarget | undefined;
	if (options.trusted) {
		if (!options.plugin || !options.tenantId) {
			throw new OAuthCallbackError(
				'invalid_state',
				'trusted callback requires plugin and tenantId',
			);
		}
		pluginId = options.plugin;
		tenantId = options.tenantId;
	} else {
		const decoded = verifyAndDecodeState(state, internal.kek);
		if (!decoded) {
			throw new OAuthCallbackError(
				'invalid_state',
				'Invalid or tampered state parameter',
			);
		}
		pluginId = decoded.plugin;
		tenantId = decoded.tenantId;
		target = decoded.account;
	}

	if (!internal.database) {
		throw new OAuthCallbackError(
			'no_database',
			'No database configured on corsair instance',
		);
	}

	const plugin = requireCorsairPlugin(
		internal,
		pluginId,
		(message) => new OAuthCallbackError('plugin_not_found', message),
	);
	const oauthCfg = getOAuthConfig(plugin);

	const integrationKm = createIntegrationKeyManager({
		authType: 'oauth_2',
		integrationName: pluginId,
		kek: internal.kek,
		database: internal.database,
	});

	const clientId = await integrationKm.get_client_id();
	const clientSecret = await integrationKm.get_client_secret();
	if (!clientId || !clientSecret) {
		throw new OAuthCallbackError(
			'credentials_not_configured',
			`Credentials not configured for '${pluginId}'`,
		);
	}

	// Before the code is spent, so a refused account costs no sign-in.
	const plan = await planAccount(
		internal.database,
		internal.kek,
		internal.multiAccount,
		pluginId,
		tenantId,
		target,
	);

	const tokens = await exchangeCodeForTokens(
		code,
		clientId,
		clientSecret,
		oauthCfg,
		redirectUri,
	);

	if (!tokens.access_token) {
		throw new OAuthCallbackError(
			'no_access_token',
			`No access_token returned from ${oauthCfg.providerName}`,
		);
	}

	const accountId = await commitAccount(
		internal.database,
		internal.kek,
		pluginId,
		tenantId,
		plan,
	);

	const accountKm = createAccountKeyManager({
		authType: 'oauth_2',
		integrationName: pluginId,
		tenantId,
		kek: internal.kek,
		database: internal.database,
		// Include the plugin's extension fields so subscribe/resolvers can
		// persist them (e.g. Outlook subscription_id) — without this only the
		// base oauth_2 setters exist and extension setters throw.
		extraAccountFields: [...(plugin.authConfig?.oauth_2?.account ?? [])],
		...(accountId && { account: { ref: accountId } }),
	});

	await accountKm.set_access_token(tokens.access_token);
	if (tokens.refresh_token) {
		await accountKm.set_refresh_token(tokens.refresh_token);
	}
	if (tokens.expires_in) {
		await accountKm.set_expires_at(
			String(Math.floor(Date.now() / 1000) + tokens.expires_in),
		);
	}

	// Ack the stored token to Hub so the grid and list_connections flip to
	// connected. The webhook-link and subscribe blocks below only add inbound
	// routing — connection status must not depend on either.
	await reportPluginConnectionStatus(corsair, {
		plugin,
		tenantId,
	}).catch(() => {});

	try {
		const providerData = mergeOAuthProviderData(tokens, options.callbackParams);
		const tenantLink = await resolveOAuthWebhookTenantLink(
			internal.plugins,
			pluginId,
			providerData,
		);
		if (tenantLink) {
			try {
				const extraAccountFields = plugin.authConfig?.oauth_2?.account ?? [];
				await setWebhookTenantLink({
					database: internal.database,
					kek: internal.kek,
					pluginId,
					tenantId,
					link: tenantLink,
					authType: 'oauth_2',
					extraAccountFields,
					...(accountId && { accountId }),
				});
			} catch (error) {
				console.warn(
					`[corsair:oauth] Failed to persist webhook tenant link for '${pluginId}' tenant '${tenantId}':`,
					error,
				);
			}

			// Hub mode: forward the identity so Hub can route inbound webhooks.
			// Fire-and-forget: never block the OAuth callback on Hub availability.
			if (internal.hub) {
				void registerHubWebhookTenantLink(internal.hub, {
					plugin: pluginId,
					tenantId,
					link: tenantLink,
					authType: 'oauth_2',
				});
			}
		}
	} catch (error) {
		console.warn(
			`[corsair:oauth] Failed to resolve webhook tenant link for '${pluginId}' tenant '${tenantId}':`,
			error,
		);
	}

	// BYO subscribe-on-connect: class-1 providers (Outlook, Gmail) only send
	// events after a token-authenticated subscribe. The app holds the token, so
	// the app arms the subscription here and reports the routing link +
	// verification secret to Hub. Hub never sees the token — only an opaque
	// routing id and a random clientState. Best-effort: a failure never breaks
	// the connect (mirrors the tenant-link block above). Plugins without a
	// subscribe capability (class-2 webhooks) skip this entirely.
	if (plugin.subscribe) {
		try {
			await subscribeAndStoreLink({
				corsair,
				internal,
				plugin,
				tenantId,
				keys: accountKm,
				authType: 'oauth_2',
				accountId,
			});
		} catch (error) {
			console.warn(
				`[corsair:oauth] BYO subscribe failed for '${pluginId}' tenant '${tenantId}':`,
				error,
			);
		}
	}

	return { plugin: pluginId, tenantId };
}
