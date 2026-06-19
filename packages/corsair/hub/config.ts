import type { CorsairInternalConfig } from '../core';
import { CORSAIR_INTERNAL } from '../core';
import type { HubConfig } from './types';

export class HubNotConfiguredError extends Error {
	constructor() {
		super(
			'Hub is not configured. Pass hub: { apiUrl, projectApiKey, signingSecret, deliveryUrl } to createCorsair().',
		);
		this.name = 'HubNotConfiguredError';
	}
}

function getInternal(corsair: unknown): CorsairInternalConfig {
	const internal = (corsair as Record<symbol, unknown>)[CORSAIR_INTERNAL] as
		| CorsairInternalConfig
		| undefined;
	if (!internal) {
		throw new Error('Invalid corsair instance');
	}
	return internal;
}

function isHubConfigComplete(hub: HubConfig): boolean {
	return (
		hub.apiUrl.trim().length > 0 &&
		hub.deliveryUrl.trim().length > 0 &&
		hub.projectApiKey.trim().length > 0 &&
		hub.signingSecret.trim().length > 0
	);
}

export function getHubConfig(corsair: unknown): HubConfig {
	const hub = getInternal(corsair).hub;
	if (!hub || !isHubConfigComplete(hub)) {
		throw new HubNotConfiguredError();
	}
	return hub;
}

export function resolveHubOAuthCallbackUrl(config: HubConfig): string {
	if (config.oauthCallbackUrl) {
		return config.oauthCallbackUrl;
	}
	return `${config.apiUrl.replace(/\/$/, '')}/oauth/callback`;
}
