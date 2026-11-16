import { Buffer } from 'node:buffer';
import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const TEAMWORK_API_HOST_SUFFIX = '.teamwork.com';

export type TeamworkRequest = {
	apiKey: string;
	siteName: string;
	version?: string;
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	// `unknown` because each route validates its own path value schema before transport.
	pathParameters: Record<string, unknown>;
	// `unknown` because query parameter value types vary by OpenAPI operation.
	query: Record<string, unknown>;
	// `unknown` because route bodies have operation-specific JSON shapes validated before transport.
	body?: unknown;
};

/**
 * Accepts `acme`, `acme.teamwork.com`, an EU site (`acme.eu` or
 * `acme.eu.teamwork.com`) or the site URL as pasted from the browser. The host
 * always ends in `.teamwork.com`, so a stored value can't send the key elsewhere.
 */
export function resolveTeamworkBaseUrl(siteName: string): string {
	const normalized = siteName
		.trim()
		.toLowerCase()
		.replace(/^https:\/\//, '')
		.replace(/\/.*$/, '')
		.replace(/\.teamwork\.com$/, '');
	if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.eu)?$/.test(normalized)) {
		throw new Error('A valid Teamwork site name is required');
	}
	return `https://${normalized}${TEAMWORK_API_HOST_SUFFIX}`;
}

export function encodeTeamworkPathValue(value: string): string {
	if (value === '' || value === '.' || value === '..') {
		throw new Error('Invalid Teamwork path value');
	}
	return encodeURIComponent(value);
}

// `unknown` because response JSON is untrusted until its operation-specific schema validates it.
export async function makeTeamworkRequest(
	options: TeamworkRequest,
): Promise<unknown> {
	if (options.apiKey.length === 0) {
		throw new AuthMissingError('teamwork', 'api_key');
	}
	const config: OpenAPIConfig = {
		BASE: resolveTeamworkBaseUrl(options.siteName),
		VERSION: options.version ?? '1.0.0',
		WITH_CREDENTIALS: false,
		// Core's default encodeURI keeps `/` and `..`, so an id like `../people/1` would
		// reach another route than the one whose permission was checked.
		ENCODE_PATH: encodeTeamworkPathValue,
		CREDENTIALS: 'omit',
		HEADERS: {
			Authorization: `Basic ${Buffer.from(`${options.apiKey}:`).toString('base64')}`,
			'Content-Type': 'application/json',
		},
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: options.path,
		path: options.pathParameters,
		query: options.query,
		body: options.body,
		mediaType: 'application/json; charset=utf-8',
	};
	try {
		// `unknown` because the provider response is validated by the owning endpoint after transport.
		return await request<unknown>(config, requestOptions);
	} catch (error) {
		// Preserve core transport status and Retry-After metadata for handlers.
		if (error instanceof ApiError) throw error;
		// Network errors can include the tenant URL; keep them out of public errors.
		throw new Error('Teamwork request failed');
	}
}
