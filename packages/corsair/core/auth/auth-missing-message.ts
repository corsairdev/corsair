import type { CorsairDatabase } from '../../db/kysely/database';
import type { HubConfig } from '../../hub';
import { createHubConnectSessionForPlugin } from '../../hub/connect';
import type { EndpointManualConfig } from '../config/manual-connect';
import { hasManualConnectConfig } from '../config/manual-connect';
import type { CorsairPlugin } from '../plugins';
import type { AuthMissingError } from './errors/auth-missing';
import { encodeOAuthState, signState } from './state';

/**
 * Default agent-facing message when auth is missing and a connect URL is available.
 *
 * @param pluginId - Plugin that needs credentials
 * @param connectUrl - Hosted or manual connect URL for the user to visit
 */
export function formatDefaultAuthMissingMessage(
	pluginId: string,
	connectUrl: string,
): string {
	return `[auth-missing:${pluginId}] Authentication required. Direct the user to connect their account: ${connectUrl}`;
}

type AuthMissingRoutingConfig = {
	manual?: EndpointManualConfig;
	hub?: HubConfig;
};

/**
 * Resolves a Hub connect URL for a plugin when auth credentials are missing.
 *
 * Mirrors {@link resolveApprovalUrl} for permissions: only needs `hub` from
 * `createCorsair({ hub })` plus explicit plugin/tenant/database/kek inputs.
 * Returns `null` when hub is not configured, database/kek are missing, or
 * session creation fails.
 *
 * @returns The hosted connect URL, or `null` if one could not be created.
 */
export async function resolveAuthMissingConnectUrl(
	routing: AuthMissingRoutingConfig,
	input: {
		plugin: CorsairPlugin;
		tenantId: string;
		database?: CorsairDatabase;
		kek?: string;
		plugins: readonly CorsairPlugin[];
	},
): Promise<string | null> {
	const hub = routing.hub;
	if (!hub || !input.database || !input.kek) {
		return null;
	}

	try {
		const session = await createHubConnectSessionForPlugin(hub, {
			tenantId: input.tenantId,
			plugin: input.plugin,
			database: input.database,
			kek: input.kek,
			plugins: input.plugins,
		});
		return session.connectUrl;
	} catch {
		return null;
	}
}

/**
 * Builds the agent-facing message returned when a keyBuilder raises AuthMissingError.
 *
 * When `hub` is configured, creates a hosted connect session via
 * {@link createHubConnectSessionForPlugin} and embeds the connect URL in the
 * message (or delegates to `manual.onAuthMissing` when set). Falls back to a
 * plain `[auth-missing:…]` tag when no link can be generated.
 *
 * Called from endpoint binding via {@link resolveAuthMissingEndpointResult} —
 * same role as {@link resolveAsyncApprovalMessage} for permission-gated operations.
 */
export async function resolveAuthMissingConnectMessage(input: {
	manual?: EndpointManualConfig;
	hub?: HubConfig;
	plugin: CorsairPlugin;
	pluginId: string;
	tenantId: string;
	authType: string;
	database?: CorsairDatabase;
	kek?: string;
	plugins: readonly CorsairPlugin[];
}): Promise<string> {
	const hub = input.hub;
	if (hub && input.database && input.kek) {
		try {
			const session = await createHubConnectSessionForPlugin(hub, {
				tenantId: input.tenantId,
				plugin: input.plugin,
				database: input.database,
				kek: input.kek,
				plugins: input.plugins,
			});

			if (input.manual?.onAuthMissing) {
				return input.manual.onAuthMissing({
					plugin: input.pluginId,
					connectUrl: session.connectUrl,
					state: session.token,
				});
			}

			return formatDefaultAuthMissingMessage(
				input.pluginId,
				session.connectUrl,
			);
		} catch {
			return `[auth-missing:${input.pluginId}:${input.authType}] Authentication required. Could not create connect link. Check hub configuration and server logs.`;
		}
	}

	const connectUrl = await resolveAuthMissingConnectUrl(
		{ manual: input.manual, hub: input.hub },
		{
			plugin: input.plugin,
			tenantId: input.tenantId,
			database: input.database,
			kek: input.kek,
			plugins: input.plugins,
		},
	);

	if (connectUrl) {
		return formatDefaultAuthMissingMessage(input.pluginId, connectUrl);
	}

	return `[auth-missing:${input.pluginId}:${input.authType}]`;
}

/**
 * Builds a manual (self-hosted) connect message with a signed OAuth state URL.
 *
 * Used when `createCorsair({ manual: { baseUrl, redirectUri } })` is configured
 * and the plugin uses OAuth.
 */
export function buildManualConnectMessage(
	pluginId: string,
	manualConfig: EndpointManualConfig & {
		baseUrl: string;
		kek: string;
	},
	fallbackTenantId: string | undefined,
): string {
	const state = signState(
		encodeOAuthState(
			pluginId,
			manualConfig.tenantId ?? fallbackTenantId ?? 'default',
		),
		manualConfig.kek,
	);
	const url = new URL(manualConfig.baseUrl);
	url.searchParams.set('state', state);
	const connectUrl = url.toString();

	if (manualConfig.onAuthMissing) {
		return manualConfig.onAuthMissing({ plugin: pluginId, connectUrl, state });
	}

	return formatDefaultAuthMissingMessage(pluginId, connectUrl);
}

/**
 * Resolves the string returned from a bound endpoint when auth credentials are missing.
 *
 * Prefers manual OAuth connect URLs, then hosted Hub connect URLs, then the raw
 * {@link AuthMissingError} message. Never throws — endpoint binding returns this
 * value directly instead of propagating an error.
 */
export async function resolveAuthMissingEndpointResult(input: {
	error: AuthMissingError;
	manual?: EndpointManualConfig;
	hub?: HubConfig;
	plugin?: CorsairPlugin;
	tenantId?: string;
	database?: CorsairDatabase;
	kek?: string;
	plugins?: readonly CorsairPlugin[];
}): Promise<string> {
	const tenantId = input.tenantId ?? 'default';
	const pluginId = input.error.pluginId;

	if (
		input.manual &&
		hasManualConnectConfig(input.manual) &&
		input.manual.oauthConfig &&
		input.manual.kek &&
		input.error.authType === 'oauth_2'
	) {
		return buildManualConnectMessage(
			pluginId,
			{
				...input.manual,
				baseUrl: input.manual.baseUrl!,
				kek: input.manual.kek,
			},
			input.tenantId,
		);
	}

	if (
		input.hub &&
		input.plugin &&
		input.kek &&
		input.database &&
		input.plugins
	) {
		return resolveAuthMissingConnectMessage({
			manual: input.manual,
			hub: input.hub,
			plugin: input.plugin,
			pluginId,
			tenantId,
			authType: input.error.authType,
			database: input.database,
			kek: input.kek,
			plugins: input.plugins,
		});
	}

	return input.error.message;
}
