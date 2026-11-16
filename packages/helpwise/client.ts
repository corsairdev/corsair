import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';

export class HelpwiseAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'HelpwiseAPIError';
	}
}

export const HELPWISE_API_BASE = 'https://apis.helpwise.io';
export const HELPWISE_APP_BASE = 'https://app.helpwise.io';

export type HelpwiseCredentials = {
	apiKey: string;
	apiSecret: string;
};

/**
 * Parses Helpwise credentials from either JSON `{"apiKey": "...", "apiSecret": "..."}`
 * or colon-separated `"API_KEY:API_SECRET"`.
 */
export function splitKeyAndSecret(value: string): HelpwiseCredentials | null {
	if (!value) return null;

	const trimmed = value.trim();
	if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
		try {
			// `unknown` because JSON parsing yields untrusted payload that must be checked.
			const parsed: unknown = JSON.parse(trimmed);
			if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
				// `unknown` because parsed JSON properties are untrusted until checked.
				const apiKey: unknown = Reflect.get(parsed, 'apiKey');
				// `unknown` because parsed JSON properties are untrusted until checked.
				const apiSecret: unknown = Reflect.get(parsed, 'apiSecret');
				if (
					typeof apiKey === 'string' &&
					typeof apiSecret === 'string' &&
					apiKey.trim() &&
					apiSecret.trim()
				) {
					return {
						apiKey: apiKey.trim(),
						apiSecret: apiSecret.trim(),
					};
				}
			}
		} catch {
			// Invalid JSON
		}
		return null;
	}

	const colon = trimmed.indexOf(':');
	if (colon <= 0 || colon === trimmed.length - 1) {
		return null;
	}

	const apiKey = trimmed.slice(0, colon).trim();
	const apiSecret = trimmed.slice(colon + 1).trim();
	if (!apiKey || !apiSecret) {
		return null;
	}

	return { apiKey, apiSecret };
}

export type HelpwiseRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// `unknown` because request bodies vary by endpoint and are validated by Zod schemas prior to this call.
	body?: Record<string, unknown> | unknown[];
	query?: Record<string, string | number | boolean | number[] | undefined>;
	headers?: Record<string, string>;
	baseUrl?: string;
};

export async function makeHelpwiseRequest<T>(
	endpoint: string,
	credentialsString?: string,
	options: HelpwiseRequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, query, headers = {}, baseUrl } = options;

	if (credentialsString !== undefined && credentialsString.length === 0) {
		throw new AuthMissingError('helpwise', 'api_key');
	}

	if (!credentialsString) {
		throw new AuthMissingError('helpwise', 'api_key');
	}

	const credentials = splitKeyAndSecret(credentialsString);
	if (!credentials) {
		throw new AuthMissingError('helpwise', 'api_key');
	}

	const base = baseUrl ?? HELPWISE_API_BASE;
	// apis.helpwise.io takes HTTP Basic; the older app.helpwise.io/dev-apis
	// routes answer 401 to Basic and want `Authorization: <key>:<secret>`.
	const usesDevApis = base === HELPWISE_APP_BASE;
	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		...(usesDevApis
			? {}
			: { USERNAME: credentials.apiKey, PASSWORD: credentials.apiSecret }),
		HEADERS: {
			'Content-Type': 'application/json',
			...headers,
			...(usesDevApis
				? { Authorization: `${credentials.apiKey}:${credentials.apiSecret}` }
				: {}),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new HelpwiseAPIError('Unknown error');
	}
}
