const DEFAULT_LOCAL_PORT = '3000';
const DELIVERY_PATH = '/api/corsair';

function stripTrailingSlash(url: string) {
	return url.replace(/\/$/, '');
}

/**
 * One knob: `CORSAIR_DELIVERY_URL` (full endpoint, wins over everything).
 * Without it, auto-detects `http://localhost:{PORT}/api/corsair` — PORT is
 * set by the runtime, not something users configure for Corsair.
 */
export function resolveHubDeliveryUrl(input?: {
	deliveryUrl?: string;
}): string {
	const explicit =
		input?.deliveryUrl?.trim() || process.env.CORSAIR_DELIVERY_URL?.trim();
	if (explicit) {
		const absolute = /^https?:\/\//i.test(explicit)
			? explicit
			: `https://${explicit}`;
		return stripTrailingSlash(absolute);
	}

	const port = process.env.PORT?.trim() || DEFAULT_LOCAL_PORT;
	return `http://localhost:${port}${DELIVERY_PATH}`;
}
