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
	if (isLoopbackUrl(deliveryUrl)) {
		return 'Production delivery URL must be a public URL, not localhost';
	}
	return null;
}
