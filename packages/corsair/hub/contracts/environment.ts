export type HubEnvironmentSlug = 'development' | 'production';

export type DeliveryTransport = 'browser' | 'server';

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

export function isLoopbackUrl(url: string): boolean {
	try {
		const { hostname, protocol } = new URL(url);
		if (protocol !== 'http:' && protocol !== 'https:') return false;
		return LOOPBACK_HOSTS.has(hostname);
	} catch {
		return false;
	}
}

export function resolveDeliveryTransport(
	slug: HubEnvironmentSlug,
): DeliveryTransport {
	return slug === 'development' ? 'browser' : 'server';
}

export function usesBrowserDelivery(slug: HubEnvironmentSlug): boolean {
	return resolveDeliveryTransport(slug) === 'browser';
}

export function validateProductionDeliveryUrl(
	deliveryUrl: string,
): string | null {
	let parsed: URL;
	try {
		parsed = new URL(deliveryUrl);
	} catch {
		return 'Production delivery URL must be a full URL, e.g. https://your-app.com/api/corsair';
	}
	if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
		return 'Production delivery URL must start with http:// or https://';
	}
	if (LOOPBACK_HOSTS.has(parsed.hostname)) {
		return 'Production delivery URL must be a public URL, not localhost';
	}
	return null;
}
