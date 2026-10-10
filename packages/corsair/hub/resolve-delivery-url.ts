const DEFAULT_LOCAL_PORT = '3000';
const DELIVERY_PATH = '/api/corsair';

function stripTrailingSlash(url: string) {
	return url.replace(/\/$/, '');
}

function resolveLocalPort(port: string | undefined): string {
	const value = port?.trim();
	if (!value) return DEFAULT_LOCAL_PORT;

	if (!/^\d+$/.test(value)) {
		throw new Error('PORT must be a whole number between 1 and 65535');
	}

	const parsed = Number(value);
	if (parsed < 1 || parsed > 65535) {
		throw new Error('PORT must be a whole number between 1 and 65535');
	}

	return value;
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

	const port = resolveLocalPort(process.env.PORT);
	return `http://localhost:${port}${DELIVERY_PATH}`;
}
