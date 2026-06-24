import type { AuthTypes } from '../core/constants';
import type { CorsairPlugin } from '../core/plugins';
import { encodeOAuthState, signState } from '../core/auth/state';
import { formatProviderDisplayName } from '../core/constants';
import { getCallableProperty } from '../core/utils/callable';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { getAccountFields, getPluginAuthType } from '../core/utils/plugin-auth';
import { generateOAuthUrl } from '../oauth';
import { getHubConfig, resolveHubOAuthCallbackUrl } from './config';
import type { ConnectAuthKind, ConnectPluginManifestEntry } from './contracts/connect-api';
import {
	resolveConnectSourceFromDeliveryUrl,
	validateExplicitConnectSource,
} from './contracts/delivery-mode';
import { ensureCorsairProvisionedForTenant } from './internal/provision';
import type { HubConnectSource, HubOAuthMode } from './types';

const OPTIONAL_ACCOUNT_FIELDS = new Set([
	'webhook_signature',
	'expires_at',
	'scope',
]);

export type { ConnectPluginManifestEntry } from './contracts/connect-api';

export type BuildConnectPluginManifestOptions = {
	pluginIds?: string[];
	oauthModeOverrides?: Partial<Record<string, HubOAuthMode>>;
	providerNameOverrides?: Partial<Record<string, string>>;
	// Status introspection only needs auth kind + configured flag.
	skipOAuthUrlGeneration?: boolean;
};

/** @deprecated Use ConnectPluginManifestEntry */
export type SetupPluginManifestEntry = ConnectPluginManifestEntry;

/** @deprecated Use ConnectAuthKind */
export type SetupAuthKind = ConnectAuthKind;

function toConnectAuthKind(authType: AuthTypes): ConnectAuthKind {
	if (authType === 'oauth_2' || authType === 'managed') {
		return 'oauth';
	}
	if (authType === 'bot_token') {
		return 'bot_token';
	}
	return 'api_key';
}

function getConfiguredAccountFields(authType: AuthTypes): readonly string[] {
	if (authType === 'oauth_2' || authType === 'managed') {
		return ['access_token'];
	}
	if (authType === 'api_key') {
		return ['api_key'];
	}
	if (authType === 'bot_token') {
		return ['bot_token'];
	}
	return [];
}

async function isAccountConfigured(
	corsair: unknown,
	plugin: CorsairPlugin,
	authType: AuthTypes,
	tenantId: string,
): Promise<boolean> {
	const accountFields = getConfiguredAccountFields(authType);

	if (accountFields.length === 0) {
		return true;
	}

	const tenantClient: Record<string, unknown> =
		typeof (corsair as { withTenant?: unknown }).withTenant === 'function'
			? (
					corsair as {
						withTenant: (tenantId: string) => Record<string, unknown>;
					}
				).withTenant(tenantId)
			: (corsair as Record<string, unknown>);

	const pluginNamespace = tenantClient[plugin.id];
	const accountKeys =
		pluginNamespace &&
		typeof pluginNamespace === 'object' &&
		'keys' in pluginNamespace
			? (pluginNamespace as { keys: unknown }).keys
			: null;

	if (!accountKeys) {
		return false;
	}

	for (const field of accountFields) {
		if (authType === 'oauth_2' || authType === 'managed') {
			if (field === 'refresh_token') continue;
		}

		const getter = getCallableProperty(accountKeys, `get_${field}`);
		if (!getter) continue;

		let value: string | null = null;
		try {
			const result = await getter();
			value = typeof result === 'string' ? result : null;
		} catch {
			value = null;
		}

		if (!value) {
			return false;
		}
	}

	return true;
}

function getCredentialFieldsForAuthType(
	authType: AuthTypes,
	accountFields: readonly string[],
): string[] {
	if (authType === 'oauth_2' || authType === 'managed') {
		return [];
	}

	return accountFields.filter((field) => !OPTIONAL_ACCOUNT_FIELDS.has(field));
}

export async function buildConnectPluginManifest(
	corsair: unknown,
	tenantId: string,
	options: BuildConnectPluginManifestOptions = {},
): Promise<ConnectPluginManifestEntry[]> {
	const internal = getCorsairInternal(corsair);
	const hub = getHubConfig(corsair);
	const oauthCallbackUrl = resolveHubOAuthCallbackUrl(hub);
	const manifest: ConnectPluginManifestEntry[] = [];
	const pluginIdFilter = options.pluginIds ? new Set(options.pluginIds) : null;

	for (const plugin of internal.plugins) {
		if (pluginIdFilter && !pluginIdFilter.has(plugin.id)) {
			continue;
		}

		const authType = getPluginAuthType(plugin);
		if (!authType) continue;

		const authKind = toConnectAuthKind(authType);
		const providerName =
			options.providerNameOverrides?.[plugin.id] ??
			formatProviderDisplayName(plugin.id);
		const alreadyConfigured = await isAccountConfigured(
			corsair,
			plugin,
			authType,
			tenantId,
		);
		const accountFields = getAccountFields(plugin, authType);

		const entry: ConnectPluginManifestEntry = {
			plugin: plugin.id,
			providerName,
			authKind,
			alreadyConfigured,
		};

		if (authKind === 'oauth') {
			const oauthModeOverride = options.oauthModeOverrides?.[plugin.id];
			const oauthMode: HubOAuthMode =
				oauthModeOverride ?? (authType === 'managed' ? 'managed' : 'byo');
			entry.oauthMode = oauthMode;

			if (!options.skipOAuthUrlGeneration) {
				if (oauthMode === 'managed') {
					entry.state = signState(
						encodeOAuthState(plugin.id, tenantId),
						internal.kek,
					);
				} else {
					try {
						const oauth = await generateOAuthUrl(corsair, plugin.id, {
							tenantId,
							redirectUri: oauthCallbackUrl,
						});
						entry.oauthUrl = oauth.url;
						entry.state = oauth.state;
					} catch (error) {
						entry.setupError =
							error instanceof Error
								? error.message
								: `Could not prepare OAuth for ${plugin.id}`;
					}
				}
			}
		} else {
			const credentialFields = getCredentialFieldsForAuthType(
				authType,
				accountFields,
			);
			if (credentialFields.length > 0) {
				entry.credentialFields = credentialFields;
			}
		}

		manifest.push(entry);
	}

	return manifest;
}

/** @deprecated Use buildConnectPluginManifest */
export const buildSetupPluginManifest = buildConnectPluginManifest;

export function resolveConnectSessionSource(
	corsair: unknown,
	explicitSource?: HubConnectSource,
): HubConnectSource {
	const hub = getHubConfig(corsair);
	if (explicitSource) {
		const validation = validateExplicitConnectSource({
			source: explicitSource,
			deliveryUrl: hub.deliveryUrl,
		});
		if (validation) {
			throw new Error(validation.error);
		}
		return explicitSource;
	}

	return resolveConnectSourceFromDeliveryUrl(hub.deliveryUrl);
}

/** @deprecated Use resolveConnectSessionSource */
export const resolveSetupConnectSource = resolveConnectSessionSource;

export async function ensureConnectAccountRows(
	corsair: unknown,
	tenantId: string,
): Promise<void> {
	await ensureCorsairProvisionedForTenant(corsair, tenantId);
}

export type { AuthTypes, CorsairPlugin };
