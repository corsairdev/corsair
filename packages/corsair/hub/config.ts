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

export class HubCredentialsMissingError extends Error {
	constructor() {
		super(
			'Hub credentials are missing. Pass hub: { projectApiKey, signingSecret } to createCorsair() ' +
				'with non-empty values, or omit `hub` entirely if you are not using Corsair Hub.',
		);
		this.name = 'HubCredentialsMissingError';
	}
}

export function normalizeHubConfig(input: HubConfigInput): HubConfig {
	const apiUrl = (input.apiUrl?.trim() || DEFAULT_HUB_API_URL).replace(
		/\/$/,
		'',
	);
	const projectApiKey = input.projectApiKey?.trim() ?? '';
	const signingSecret = input.signingSecret?.trim() ?? '';

	// ck_cloud_ keys don't sign anything Hub-side (the hosted runtime itself
	// holds the key) — signingSecret is only required for ck_dev_/ck_prod_.
	const isCloudKey = projectApiKey.startsWith('ck_cloud_');

	if (!projectApiKey || (!signingSecret && !isCloudKey)) {
		throw new HubCredentialsMissingError();
	}

	return {
		apiUrl,
		projectApiKey,
		signingSecret,
		oauthCallbackUrl: input.oauthCallbackUrl?.trim().replace(/\/$/, ''),
		redirectURL: input.redirectURL?.trim() || undefined,
		allowWorkflowExecution: input.allowWorkflowExecution ?? false,
		// Carry `undefined` (not `false`): a `ck_dev_` key tunnels by default, so
		// only an explicit `tunnel: false` should opt out.
		tunnel: input.tunnel,
	};
}

/**
 * Validates and normalizes hub config when `hub` is passed to createCorsair().
 * Omit `hub` entirely to disable Hub; when enabled, credentials are required at init.
 */
export function resolveHubConfigInput(input: HubConfigInput): HubConfig {
	return normalizeHubConfig(input);
}

function isHubConfigComplete(hub: HubConfig): boolean {
	// ck_cloud_ keys carry no signingSecret (see normalizeHubConfig) — the hosted
	// runtime is fully configured without one, so getHubConfig must not reject it.
	const isCloudKey = hub.projectApiKey.startsWith('ck_cloud_');
	return (
		hub.apiUrl.trim().length > 0 &&
		hub.projectApiKey.trim().length > 0 &&
		(isCloudKey || hub.signingSecret.trim().length > 0)
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
): 'development' | 'production' | 'cloud' {
	if (apiKey.startsWith('ck_dev_')) {
		return 'development';
	}
	if (apiKey.startsWith('ck_prod_')) {
		return 'production';
	}
	if (apiKey.startsWith('ck_cloud_')) {
		return 'cloud';
	}
	throw new Error(
		'Hub API key must start with ck_dev_ (development), ck_prod_ (production), or ck_cloud_ (cloud)',
	);
}
