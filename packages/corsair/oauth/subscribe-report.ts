import type { CorsairPlugin } from '../core';
import { getHubConfig } from '../hub/config';
import { reportPluginConnectionStatus } from '../hub/report-connection-status';
import { getWebhookEndpointUrl } from '../hub/webhook-endpoint-client';

/**
 * The BYO subscribe-and-report step shared by connect (processOAuthCallback)
 * and renewal: fetch this plugin's Hub inbound URL, arm the provider
 * subscription with the app-held token, and report the routing link +
 * verification secret to Hub. Hub never sees the token. Throws are the
 * caller's to swallow — a failure must never break a connect.
 */
export async function subscribeAndReport(
	corsair: unknown,
	plugin: CorsairPlugin,
	tenantId: string,
	keys: unknown,
): Promise<void> {
	if (!plugin.subscribe) return;
	const hub = getHubConfig(corsair);
	const webhookUrl = await getWebhookEndpointUrl(hub, plugin.id);
	if (!webhookUrl) return;
	const result = await plugin.subscribe({ keys }, { webhookUrl });
	if (!result) return;
	await reportPluginConnectionStatus(corsair, {
		plugin,
		tenantId,
		verified: true,
		webhookLink: result.webhookLink,
		webhookSecret: result.webhookSecret,
	});
}
