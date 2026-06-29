import { hubApiPost } from './client/http';
import { getHubConfig, inferHubEnvironmentSlug } from './config';
import { parseConnectSessionResponse } from './contracts/connect-api';
import {
	buildConnectPluginManifest,
	ensureConnectAccountRows,
} from './setup-introspect';
import { resolveHubDeliveryUrl } from './resolve-delivery-url';
import type { HubConnectSessionInput, HubConnectSessionResult } from './types';

export async function createHubConnectSession(
	corsair: unknown,
	input: HubConnectSessionInput,
): Promise<HubConnectSessionResult> {
	const hub = getHubConfig(corsair);
	const environmentSlug = inferHubEnvironmentSlug(hub.projectApiKey);

	await ensureConnectAccountRows(corsair, input.tenantId);

	const pluginIds = input.plugin ? [input.plugin] : undefined;
	const oauthModeOverrides =
		input.plugin && input.oauthMode
			? { [input.plugin]: input.oauthMode }
			: undefined;
	const providerNameOverrides =
		input.plugin && input.providerName
			? { [input.plugin]: input.providerName }
			: undefined;

	const plugins = await buildConnectPluginManifest(corsair, input.tenantId, {
		pluginIds,
		oauthModeOverrides,
		providerNameOverrides,
	});

	if (plugins.length === 0) {
		throw new Error(
			input.plugin
				? `Plugin '${input.plugin}' is not configured on this Corsair instance`
				: 'No plugins are configured on this Corsair instance',
		);
	}

	const body: Record<string, unknown> = {
		tenantId: input.tenantId,
		plugins,
	};

	if (environmentSlug === 'development') {
		body.deliveryUrl = resolveHubDeliveryUrl({ deliveryUrl: input.deliveryUrl });
	}

	return hubApiPost({
		hub,
		path: '/connect/sessions',
		notFoundMessage:
			'Hub REST API not found at /connect/sessions. Check HUB_API_URL and ensure the Hub API is deployed.',
		body,
		parseResponse: parseConnectSessionResponse,
	});
}
