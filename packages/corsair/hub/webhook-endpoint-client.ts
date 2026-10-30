import { hubApiGet } from './client/http';
import type { HubConfig } from './types';

/**
 * H1 client — asks Hub for this plugin's inbound webhook URL so a BYO subscribe
 * can pass it as the provider notificationUrl. Returns null on any failure:
 * a missing URL just skips subscribe, it never breaks the connect.
 */
export async function getWebhookEndpointUrl(
	hub: HubConfig,
	plugin: string,
): Promise<string | null> {
	try {
		return await hubApiGet<string | null>({
			hub,
			path: `/webhooks/endpoint?plugin=${encodeURIComponent(plugin)}`,
			parseResponse: (payload) => (payload as { url?: string })?.url ?? null,
		});
	} catch {
		return null;
	}
}
