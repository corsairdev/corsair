import type { HubConnectSource, HubOAuthMode } from '../types';

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

export type ConnectSourceValidationError = {
	error: string;
	status: number;
};

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

export function shouldUseBrowserDelivery(
	source: HubConnectSource,
	deliveryUrl: string,
): boolean {
	return source === 'client' || isLoopbackDeliveryUrl(deliveryUrl);
}

/** @deprecated Use {@link shouldUseBrowserDelivery} */
export const shouldUseBrowserConnectDelivery = shouldUseBrowserDelivery;

export function validateExplicitConnectSource(input: {
	source?: HubConnectSource;
	deliveryUrl: string;
	oauthMode?: HubOAuthMode;
}): ConnectSourceValidationError | null {
	if (!input.source) {
		return null;
	}

	const loopback = isLoopbackDeliveryUrl(input.deliveryUrl);

	if (input.source === 'server' && loopback) {
		return {
			error:
				'source "server" cannot be used with a loopback delivery URL — omit source to auto-detect or use "client"',
			status: 400,
		};
	}

	if (input.oauthMode === 'managed' && input.source === 'client' && !loopback) {
		return {
			error:
				'managed OAuth with source "client" requires a loopback delivery URL — omit source for production server delivery',
			status: 400,
		};
	}

	return null;
}
