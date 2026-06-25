import { hubApiPost } from './client/http';
import { getHubConfig } from './config';
import { parseConnectSessionResponse } from './contracts/connect-api';
import {
	buildConnectPluginManifest,
	ensureConnectAccountRows,
	resolveConnectSessionSource,
} from './setup-introspect';
import type { HubConnectSessionInput, HubConnectSessionResult } from './types';

export async function createHubConnectSession(
	corsair: unknown,
	input: HubConnectSessionInput,
): Promise<HubConnectSessionResult> {
	const hub = getHubConfig(corsair);

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

	const source = resolveConnectSessionSource(corsair, input.source);

	return hubApiPost({
		hub,
		path: '/connect/sessions',
		notFoundMessage:
			'Hub REST API not found at /connect/sessions. Check HUB_API_URL and ensure the Hub API is deployed.',
		body: {
			tenantId: input.tenantId,
			deliveryUrl: hub.deliveryUrl,
			source,
			plugins,
		},
		parseResponse: parseConnectSessionResponse,
	});
}
