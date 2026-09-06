import type { CorsairDatabase } from '../../db/kysely/database';
import type { HubConfig } from '../../hub';
import { createHubConnectSessionForPlugin } from '../../hub/connect';
import type { EndpointManualConfig } from '../config/manual-connect';
import { hasManualConnectConfig } from '../config/manual-connect';
import type { CorsairPlugin } from '../plugins';
import { AuthMissingError } from './errors/auth-missing';
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

/** The agent-facing message plus the connect link that produced it (null when
 * no link could be minted), so the error can carry both. */
export type ResolvedAuthMissingMessage = {
	message: string;
	connectUrl: string | null;
};

/**
 * Builds the agent-facing message returned when a keyBuilder raises AuthMissingError.
 *
 * When `hub` is configured, creates a hosted connect session via
 * {@link createHubConnectSessionForPlugin} and embeds the connect URL in the
 * message (or delegates to `manual.onAuthMissing` when set). Falls back to a
 * plain `[auth-missing:…]` tag when no link can be generated.
 *
 * Called from endpoint binding via {@link throwAuthMissingEndpointError} —
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
	multiTenancy?: boolean;
}): Promise<ResolvedAuthMissingMessage> {
	const hub = input.hub;
	if (hub && input.database && input.kek) {
		try {
			const session = await createHubConnectSessionForPlugin(hub, {
				tenantId: input.tenantId,
				plugin: input.plugin,
				database: input.database,
				kek: input.kek,
				plugins: input.plugins,
				multiTenancy: input.multiTenancy,
			});

			const message = input.manual?.onAuthMissing
				? input.manual.onAuthMissing({
						plugin: input.pluginId,
						connectUrl: session.connectUrl,
						state: session.token,
					})
				: formatDefaultAuthMissingMessage(input.pluginId, session.connectUrl);
			return { message, connectUrl: session.connectUrl };
		} catch {
			return {
				message: `[auth-missing:${input.pluginId}:${input.authType}] Authentication required. Could not create connect link. Check hub configuration and server logs.`,
				connectUrl: null,
			};
		}
	}

	// hub/database/kek were all required above; reaching here means one is
	// missing, so no link can be minted.
	return {
		message: `[auth-missing:${input.pluginId}:${input.authType}]`,
		connectUrl: null,
	};
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
): ResolvedAuthMissingMessage {
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

	const message = manualConfig.onAuthMissing
		? manualConfig.onAuthMissing({ plugin: pluginId, connectUrl, state })
		: formatDefaultAuthMissingMessage(pluginId, connectUrl);
	return { message, connectUrl };
}

/**
 * Resolves the agent-facing message when auth credentials are missing.
 */
export async function resolveAuthMissingEndpointMessage(input: {
	error: AuthMissingError;
	manual?: EndpointManualConfig;
	hub?: HubConfig;
	plugin?: CorsairPlugin;
	tenantId?: string;
	database?: CorsairDatabase;
	kek?: string;
	plugins?: readonly CorsairPlugin[];
	multiTenancy?: boolean;
}): Promise<ResolvedAuthMissingMessage> {
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
			multiTenancy: input.multiTenancy,
		});
	}

	return { message: input.error.message, connectUrl: null };
}

/**
 * Resolves a connect message and throws {@link AuthMissingError} for endpoint callers.
 */
export async function throwAuthMissingEndpointError(input: {
	error: AuthMissingError;
	manual?: EndpointManualConfig;
	hub?: HubConfig;
	plugin?: CorsairPlugin;
	tenantId?: string;
	database?: CorsairDatabase;
	kek?: string;
	plugins?: readonly CorsairPlugin[];
	multiTenancy?: boolean;
}): Promise<never> {
	const { message, connectUrl } =
		await resolveAuthMissingEndpointMessage(input);
	throw new AuthMissingError(
		input.error.pluginId,
		input.error.authType,
		message,
		{
			connectUrl,
			tenantId: input.tenantId ?? 'default',
		},
	);
}
