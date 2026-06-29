import { getCorsairInternal } from '../core/utils/corsair-instance';
import type { HubConfig, HubConfigInput } from './types';
import { DEFAULT_HUB_API_URL } from './types';

export { DEFAULT_HUB_API_URL } from './types';

export class HubNotConfiguredError extends Error {
	constructor() {
		super(
			'Hub is not configured. Pass hub: { projectApiKey, signingSecret } to createCorsair().',
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

	if (!projectApiKey || !signingSecret) {
		throw new Error(
			'Hub config requires non-empty projectApiKey and signingSecret',
		);
	}

	return {
		apiUrl,
		projectApiKey,
		signingSecret,
		oauthCallbackUrl: input.oauthCallbackUrl?.trim().replace(/\/$/, ''),
	};
}

function isHubConfigComplete(hub: HubConfig): boolean {
	return (
		hub.apiUrl.trim().length > 0 &&
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

function stripTrailingSlash(url: string): string {
	return url.replace(/\/$/, '');
}

export function resolveHubOAuthCallbackUrl(config: HubConfig): string {
	if (config.oauthCallbackUrl) {
		return stripTrailingSlash(config.oauthCallbackUrl.trim());
	}
	return `${stripTrailingSlash(config.apiUrl)}/oauth/callback`;
}

export function inferHubEnvironmentSlug(
	apiKey: string,
): 'development' | 'production' {
	if (apiKey.startsWith('ck_dev_')) {
		return 'development';
	}
	if (apiKey.startsWith('ck_prod_')) {
		return 'production';
	}
	throw new Error(
		'Hub API key must start with ck_dev_ (development) or ck_prod_ (production)',
	);
}
