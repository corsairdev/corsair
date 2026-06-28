import {
	getPluginAuthStatus,
	isOptionalAuthField,
} from '../core/auth/plugin-auth-status';
import type { AuthTypes } from '../core/constants';
import { formatProviderDisplayName } from '../core/constants';
import type { CorsairInternalConfig } from '../core/index';
import type { CorsairPlugin } from '../core/plugins';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { getAccountFields, getPluginAuthType } from '../core/utils/plugin-auth';
import type { CorsairDatabase } from '../db/kysely/database';
import { generateOAuthUrl } from '../oauth';
import { resolveHubOAuthCallbackUrl } from './config';
import type {
	ConnectAuthKind,
	ConnectPluginManifestEntry,
} from './contracts/connect-api';
import {
	resolveConnectSourceFromDeliveryUrl,
	validateExplicitConnectSource,
} from './contracts/delivery-mode';
import { ensureCorsairProvisionedForTenant } from './internal/provision';
import type { HubConfig, HubConnectSource, HubOAuthMode } from './types';

const CORSAIR_INTERNAL = Symbol.for('corsair:internal');

const OAUTH_SYSTEM_ACCOUNT_FIELDS = new Set([
	'access_token',
	'refresh_token',
	'expires_at',
	'scope',
]);

export type { ConnectPluginManifestEntry } from './contracts/connect-api';

export type ConnectManifestContext = {
	plugins: readonly CorsairPlugin[];
	database: CorsairDatabase | undefined;
	kek: string;
	hub: HubConfig;
};

export type BuildConnectPluginManifestOptions = {
	pluginIds?: string[];
	oauthModeOverrides?: Partial<Record<string, HubOAuthMode>>;
	providerNameOverrides?: Partial<Record<string, string>>;
	// Status introspection only needs auth kind + configured flag.
	skipOAuthUrlGeneration?: boolean;
};

function toConnectAuthKind(authType: AuthTypes): ConnectAuthKind {
	if (authType === 'oauth_2' || authType === 'managed') {
		return 'oauth';
	}
	if (authType === 'bot_token') {
		return 'bot_token';
	}
	return 'api_key';
}

function getEditableAccountFields(
	authType: AuthTypes,
	accountFields: readonly string[],
): string[] {
	if (authType === 'oauth_2' || authType === 'managed') {
		return accountFields.filter(
			(field) =>
				!isOptionalAuthField(field) && !OAUTH_SYSTEM_ACCOUNT_FIELDS.has(field),
		);
	}

	return accountFields.filter((field) => !isOptionalAuthField(field));
}

function toAuthStatusConfig(
	context: ConnectManifestContext,
): CorsairInternalConfig {
	return {
		plugins: context.plugins,
		database: context.database,
		kek: context.kek,
		multiTenancy: false,
	};
}

function toCorsairHandle(context: ConnectManifestContext): unknown {
	return { [CORSAIR_INTERNAL]: toAuthStatusConfig(context) };
}

export async function buildConnectPluginManifestFromContext(
	context: ConnectManifestContext,
	tenantId: string,
	options: BuildConnectPluginManifestOptions = {},
): Promise<ConnectPluginManifestEntry[]> {
	const oauthCallbackUrl = resolveHubOAuthCallbackUrl(context.hub);
	const manifest: ConnectPluginManifestEntry[] = [];
	const pluginIdFilter = options.pluginIds ? new Set(options.pluginIds) : null;
	const authStatusConfig = toAuthStatusConfig(context);
	const corsairHandle = toCorsairHandle(context);

	for (const plugin of context.plugins) {
		if (pluginIdFilter && !pluginIdFilter.has(plugin.id)) {
			continue;
		}

		const authType = getPluginAuthType(plugin);
		if (!authType) continue;

		const authKind = toConnectAuthKind(authType);
		const providerName =
			options.providerNameOverrides?.[plugin.id] ??
			formatProviderDisplayName(plugin.id);
		const authStatus = await getPluginAuthStatus(
			authStatusConfig,
			plugin,
			tenantId,
		);
		const accountFields = getAccountFields(plugin, authType);
		const credentialFields = getEditableAccountFields(authType, accountFields);

		const entry: ConnectPluginManifestEntry = {
			plugin: plugin.id,
			providerName,
			authKind,
			alreadyConfigured: authStatus?.connected ?? false,
		};

		if (credentialFields.length > 0) {
			entry.credentialFields = credentialFields;
		}

		if (authKind === 'oauth') {
			const oauthModeOverride = options.oauthModeOverrides?.[plugin.id];
			const oauthMode: HubOAuthMode =
				oauthModeOverride ?? (authType === 'managed' ? 'managed' : 'byo');
			entry.oauthMode = oauthMode;

			if (!options.skipOAuthUrlGeneration) {
				if (oauthMode !== 'managed') {
					try {
						const oauth = await generateOAuthUrl(corsairHandle, plugin.id, {
							tenantId,
							redirectUri: oauthCallbackUrl,
							hubConnect: true,
						});
						entry.oauthUrl = oauth.url;
					} catch (error) {
						entry.setupError =
							error instanceof Error
								? error.message
								: `Could not prepare OAuth for ${plugin.id}`;
					}
				}
			}
		}

		manifest.push(entry);
	}

	return manifest;
}

export async function buildConnectPluginManifest(
	corsair: unknown,
	tenantId: string,
	options: BuildConnectPluginManifestOptions = {},
): Promise<ConnectPluginManifestEntry[]> {
	const internal = getCorsairInternal(corsair);
	const hub = internal.hub;
	if (!hub) {
		throw new Error('Hub is not configured');
	}

	return buildConnectPluginManifestFromContext(
		{
			plugins: internal.plugins,
			database: internal.database,
			kek: internal.kek,
			hub,
		},
		tenantId,
		options,
	);
}

export function resolveConnectSessionSourceFromHub(
	hub: HubConfig,
	explicitSource?: HubConnectSource,
): HubConnectSource {
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

export function resolveConnectSessionSource(
	corsair: unknown,
	explicitSource?: HubConnectSource,
): HubConnectSource {
	const internal = getCorsairInternal(corsair);
	const hub = internal.hub;
	if (!hub) {
		throw new Error('Hub is not configured');
	}
	return resolveConnectSessionSourceFromHub(hub, explicitSource);
}

export async function ensureConnectAccountRowsFromContext(
	context: ConnectManifestContext,
	tenantId: string,
): Promise<void> {
	if (!context.database) {
		throw new Error(
			'A database must be configured to provision Corsair for connect',
		);
	}

	await ensureCorsairProvisionedForTenant(toCorsairHandle(context), tenantId);
}

export async function ensureConnectAccountRows(
	corsair: unknown,
	tenantId: string,
): Promise<void> {
	await ensureCorsairProvisionedForTenant(corsair, tenantId);
}

export type { AuthTypes, CorsairPlugin };
