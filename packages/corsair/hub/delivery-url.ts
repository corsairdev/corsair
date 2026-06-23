import type { HubConnectSource } from './types';

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

export function isLoopbackDeliveryUrl(deliveryUrl: string): boolean {
	try {
		const { hostname, protocol } = new URL(deliveryUrl);
		if (protocol !== 'http:' && protocol !== 'https:') return false;
		return LOOPBACK_HOSTS.has(hostname);
	} catch {
		return false;
	}
}

export function resolveConnectSourceFromDeliveryUrl(
	deliveryUrl: string,
): HubConnectSource {
	return isLoopbackDeliveryUrl(deliveryUrl) ? 'client' : 'server';
}
