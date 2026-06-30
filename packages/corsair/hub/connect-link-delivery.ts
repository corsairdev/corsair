import type { CorsairPlugin } from '../core/plugins';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import type { CorsairDatabase } from '../db/kysely/database';
import type { HubConfig } from './types';

export type ConnectCreateLinkDeliveryPayload = {
	tenantId: string;
	plugins: string[];
};

export type ConnectCreateLinkDeliveryResult = {
	connectUrl: string;
	expiresAt?: string;
};

export async function processConnectLinkDelivery(
	corsair: unknown,
	payload: ConnectCreateLinkDeliveryPayload,
): Promise<ConnectCreateLinkDeliveryResult> {
	const tenantId = payload.tenantId.trim();
	if (!tenantId) {
		throw new Error('tenantId is required');
	}

	const plugins = payload.plugins
		.map((plugin) => plugin.trim())
		.filter(Boolean);
	if (plugins.length === 0) {
		throw new Error('At least one plugin is required');
	}

	const internal = getCorsairInternal(corsair);
	if (!internal.hub) {
		throw new Error('Hub is not configured on this Corsair instance');
	}

	if (!internal.database) {
		throw new Error('Database not configured');
	}

	const session = await createHubConnectSessionForPlugins(
		internal.hub,
		{
			plugins: internal.plugins,
			database: internal.database,
			kek: internal.kek,
		},
		{
			tenantId,
			pluginIds: plugins,
		},
	);

	return {
		connectUrl: session.connectUrl,
		expiresAt: session.expiresAt,
	};
}

async function createHubConnectSessionForPlugins(
	hub: HubConfig,
	context: {
		plugins: readonly CorsairPlugin[];
		database: CorsairDatabase;
		kek: string;
	},
	input: {
		tenantId: string;
		pluginIds: string[];
	},
) {
	const {
		buildConnectPluginManifestFromContext,
		ensureConnectAccountRowsFromContext,
	} = await import('./setup-introspect');
	const { postHubConnectSession } = await import('./connect');

	const manifestContext = {
		plugins: context.plugins,
		database: context.database,
		kek: context.kek,
		hub,
	};

	await ensureConnectAccountRowsFromContext(manifestContext, input.tenantId);

	const manifestPlugins = await buildConnectPluginManifestFromContext(
		manifestContext,
		input.tenantId,
		{ pluginIds: input.pluginIds },
	);

	if (manifestPlugins.length === 0) {
		throw new Error('No connectable plugins found for this tenant');
	}

	const failedPlugin = manifestPlugins.find((entry) => entry.setupError);
	if (failedPlugin) {
		throw new Error(
			failedPlugin.setupError ??
				`Could not prepare connect link for ${failedPlugin.plugin}`,
		);
	}

	return postHubConnectSession(hub, {
		tenantId: input.tenantId,
		plugins: manifestPlugins,
	});
}
