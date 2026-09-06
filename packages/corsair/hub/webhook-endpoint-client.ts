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
): Promise<{ url: string; clientState?: string } | null> {
	try {
		return await hubApiGet<{ url: string; clientState?: string } | null>({
			hub,
			path: `/webhooks/endpoint?plugin=${encodeURIComponent(plugin)}`,
			// clientState is present for Microsoft Graph plugins: the endpoint's
			// single shared secret every subscription must use (see Hub verifyMsGraph).
			parseResponse: (payload) => {
				const p = payload as { url?: string; clientState?: string };
				return p?.url ? { url: p.url, clientState: p.clientState } : null;
			},
		});
	} catch {
		return null;
	}
}
