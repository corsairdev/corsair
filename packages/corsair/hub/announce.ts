import { deliveryUrlToAdvertise, hubApiPost } from './client/http';
import { getHubConfig } from './config';

// Keyed by project API key, so multiple Corsair instances in one process each
// register even when they share a delivery URL.
const lastAnnouncedByProject = new Map<string, string>();

/**
 * Self-registration — tells Hub where this app lives so nobody has to type the
 * delivery URL into the dashboard.
 *
 * The URL comes from the app's own trusted config (CORSAIR_DELIVERY_URL,
 * APP_URL, or PORT via resolveHubDeliveryUrl) — never from inbound request
 * headers, which an untrusted caller controls. Called from the request handler
 * so scripts that merely import the app never announce.
 *
 * Fire-and-forget: never blocks or fails the request that carried it. Hub
 * applies it for development keys only.
 */
export function announceAppFromRequest(corsair: unknown): void {
	let hub: ReturnType<typeof getHubConfig>;
	try {
		hub = getHubConfig(corsair);
	} catch {
		return; // Hub not configured — nothing to announce.
	}

	const deliveryUrl = deliveryUrlToAdvertise(hub);
	if (!deliveryUrl) {
		return; // No trustworthy URL to advertise (e.g. prod without an app URL).
	}

	if (lastAnnouncedByProject.get(hub.projectApiKey) === deliveryUrl) {
		return;
	}
	lastAnnouncedByProject.set(hub.projectApiKey, deliveryUrl);

	void hubApiPost({
		hub,
		path: '/apps/announce',
		body: { deliveryUrl },
		parseResponse: () => ({ ok: true as const }),
	}).catch(() => {
		// Push-only — hub availability must never affect the app. A failed
		// announce still leaves the header fallback (appDeliveryUrlHeader) to
		// register the URL on the next SDK call.
		lastAnnouncedByProject.delete(hub.projectApiKey);
	});
}
