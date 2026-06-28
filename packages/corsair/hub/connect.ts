import type { CorsairDatabase } from '../db/kysely/database';
import type { CorsairPlugin } from '../core/plugins';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { hubApiPost } from './client/http';
import { getHubConfig } from './config';
import { parseConnectSessionResponse } from './contracts/connect-api';
import type { ConnectPluginManifestEntry } from './contracts/connect-api';
import {
	buildConnectPluginManifestFromContext,
	ensureConnectAccountRowsFromContext,
	resolveConnectSessionSourceFromHub,
} from './setup-introspect';
import type { ConnectManifestContext } from './setup-introspect';
import type {
	HubConfig,
	HubConnectSessionInput,
	HubConnectSessionResult,
	HubConnectSource,
} from './types';

/**
 * Posts a pre-built plugin manifest to the Hub `/connect/sessions` API.
 *
 * Low-level transport — mirrors {@link createHubPermissionSession} for permissions.
 * Does not introspect plugins or provision accounts; callers must supply the
 * manifest and resolve `source` themselves.
 *
 * @returns A hosted connect URL (e.g. `https://hub.corsair.dev/connect/[token]`),
 *   session token, project id, and optional expiry.
 */
export async function postHubConnectSession(
	hub: HubConfig,
	input: {
		tenantId: string;
		source: HubConnectSource;
		plugins: ConnectPluginManifestEntry[];
	},
): Promise<HubConnectSessionResult> {
	return hubApiPost({
		hub,
		path: '/connect/sessions',
		notFoundMessage:
			'Hub REST API not found at /connect/sessions. Check HUB_API_URL and ensure the Hub API is deployed.',
		body: {
			tenantId: input.tenantId,
			deliveryUrl: hub.deliveryUrl,
			source: input.source,
			plugins: input.plugins,
		},
		parseResponse: parseConnectSessionResponse,
	});
}

/**
 * Input for {@link createHubConnectSessionForPlugin}.
 *
 * Requires explicit plugin, database, and kek so a connect link can be minted
 * without a corsair instance handle (same pattern as permission approval URLs).
 */
export type CreateHubConnectSessionForPluginInput = {
	tenantId: string;
	plugin: CorsairPlugin;
	database: CorsairDatabase;
	kek: string;
	plugins: readonly CorsairPlugin[];
	source?: HubConnectSource;
};

/**
 * Creates a hosted Hub connect session scoped to a single plugin.
 *
 * Used when endpoint binding catches {@link AuthMissingError} — only `hub` config
 * and explicit runtime inputs are available (no corsair instance). Provisions
 * account rows, builds the connect manifest for the plugin, then calls
 * {@link postHubConnectSession}.
 *
 * Same Hub API and resulting URL shape as `manage.connect.createLink`.
 */
export async function createHubConnectSessionForPlugin(
	hub: HubConfig,
	input: CreateHubConnectSessionForPluginInput,
): Promise<HubConnectSessionResult> {
	const manifestContext: ConnectManifestContext = {
		plugins: input.plugins,
		database: input.database,
		kek: input.kek,
		hub,
	};

	await ensureConnectAccountRowsFromContext(manifestContext, input.tenantId);

	const plugins = await buildConnectPluginManifestFromContext(
		manifestContext,
		input.tenantId,
		{ pluginIds: [input.plugin.id] },
	);

	if (plugins.length === 0) {
		throw new Error(
			`Plugin '${input.plugin.id}' is not configured on this Corsair instance`,
		);
	}

	const source = resolveConnectSessionSourceFromHub(hub, input.source);

	return postHubConnectSession(hub, {
		tenantId: input.tenantId,
		source,
		plugins,
	});
}

/**
 * Creates a hosted Hub connect session from a corsair instance.
 *
 * Reads plugins, database, and kek from the instance, builds the connect
 * manifest (one plugin when `input.plugin` is set, otherwise all configured
 * plugins), provisions account rows, then calls {@link postHubConnectSession}.
 *
 * Used by `manage.connect.createLink` and other management APIs that already
 * hold the corsair instance.
 */
export async function createHubConnectSession(
	corsair: unknown,
	input: HubConnectSessionInput,
): Promise<HubConnectSessionResult> {
	const internal = getCorsairInternal(corsair);
	const hub = getHubConfig(corsair);
	const manifestContext: ConnectManifestContext = {
		plugins: internal.plugins,
		database: internal.database,
		kek: internal.kek,
		hub,
	};

	await ensureConnectAccountRowsFromContext(manifestContext, input.tenantId);

	const pluginIds = input.plugin ? [input.plugin] : undefined;
	const oauthModeOverrides =
		input.plugin && input.oauthMode
			? { [input.plugin]: input.oauthMode }
			: undefined;
	const providerNameOverrides =
		input.plugin && input.providerName
			? { [input.plugin]: input.providerName }
			: undefined;

	const plugins = await buildConnectPluginManifestFromContext(
		manifestContext,
		input.tenantId,
		{
			pluginIds,
			oauthModeOverrides,
			providerNameOverrides,
		},
	);

	if (plugins.length === 0) {
		throw new Error(
			input.plugin
				? `Plugin '${input.plugin}' is not configured on this Corsair instance`
				: 'No plugins are configured on this Corsair instance',
		);
	}

	const source = resolveConnectSessionSourceFromHub(hub, input.source);

	return postHubConnectSession(hub, {
		tenantId: input.tenantId,
		source,
		plugins,
	});
}
