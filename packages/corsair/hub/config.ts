import { getCorsairInternal } from '../core/utils/corsair-instance';
import type { HubConfig, HubConfigInput } from './types';
import { DEFAULT_HUB_API_URL } from './types';

export { DEFAULT_HUB_API_URL } from './types';

export class HubNotConfiguredError extends Error {
	constructor() {
		super(
			'Hub is not configured. Pass hub: { projectApiKey, signingSecret, deliveryUrl } to createCorsair().',
		);
		this.name = 'HubNotConfiguredError';
	}
}

export function normalizeHubConfig(input: HubConfigInput): HubConfig {
	const apiUrl = (input.apiUrl?.trim() || DEFAULT_HUB_API_URL).replace(
		/\/$/,
		'',
	);
	const projectApiKey = input.projectApiKey.trim();
	const signingSecret = input.signingSecret.trim();
	const deliveryUrl = input.deliveryUrl.trim();

	if (!projectApiKey || !signingSecret || !deliveryUrl) {
		throw new Error(
			'Hub config requires non-empty projectApiKey, signingSecret, and deliveryUrl',
		);
	}

	return {
		apiUrl,
		projectApiKey,
		signingSecret,
		deliveryUrl,
		oauthCallbackUrl: input.oauthCallbackUrl?.trim(),
	};
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
	const hub = getCorsairInternal(corsair).hub;
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
