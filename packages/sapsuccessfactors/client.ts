import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class SapsuccessfactorsAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'SapsuccessfactorsAPIError';
	}
}

export const SAP_SUCCESSFACTORS_DEFAULT_HOST = 'api10.successfactors.com';

const HOST_PATTERN = /^[a-z0-9]([a-z0-9.-]*[a-z0-9])?(:\d{1,5})?$/i;

const RATE_LIMIT: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

export type SapsuccessfactorsConnection = {
	host: string;
	companyId?: string;
};

export function normalizeSapsuccessfactorsHost(host: string): string {
	const trimmed = host.trim();
	if (!trimmed) throw new Error('[sapsuccessfactors] host is required');

	let value = trimmed;
	if (trimmed.includes('://')) {
		let url: URL;
		try {
			url = new URL(trimmed);
		} catch {
			throw new Error('[sapsuccessfactors] host is not a valid URL');
		}
		if (url.protocol !== 'https:') {
			throw new Error('[sapsuccessfactors] host must use https');
		}
		if (url.username || url.password) {
			throw new Error('[sapsuccessfactors] host must not contain credentials');
		}
		value = url.host;
	}

	while (value.endsWith('/')) {
		value = value.slice(0, -1);
	}
	if (value.includes('/')) {
		value = value.split('/')[0] ?? value;
	}
	if (!HOST_PATTERN.test(value)) {
		throw new Error('[sapsuccessfactors] host must be a bare hostname');
	}
	return value;
}

export function sapSuccessfactorsOAuthUrls(host: string) {
	const normalized = normalizeSapsuccessfactorsHost(host);
	const base = `https://${normalized}/oauth`;
	return {
		authUrl: `${base}/authorize`,
		tokenUrl: `${base}/token`,
	};
}

function isSapSandboxHost(host: string): boolean {
	return host === 'sandbox.api.sap.com';
}

function authorizationHeader(apiKey: string): string {
	if (apiKey.startsWith('Basic ') || apiKey.startsWith('Bearer '))
		return apiKey;
	return `Bearer ${apiKey}`;
}

export async function makeSapsuccessfactorsRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		host?: string;
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const host = normalizeSapsuccessfactorsHost(
		options.host ?? SAP_SUCCESSFACTORS_DEFAULT_HOST,
	);
	const sandbox = isSapSandboxHost(host);
	const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

	const config: OpenAPIConfig = {
		BASE: `https://${host}`,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: sandbox ? undefined : apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...(sandbox
				? { APIKey: apiKey, apikey: apiKey }
				: { Authorization: authorizationHeader(apiKey) }),
		},
	};

	const formattedQuery: Record<string, string | number | boolean | undefined> =
		url.includes('$metadata') ? {} : { $format: 'json' };
	if (query) {
		const odataKeys = new Set([
			'filter',
			'select',
			'expand',
			'top',
			'skip',
			'orderby',
		]);
		for (const [k, v] of Object.entries(query)) {
			if (v === undefined) continue;
			formattedQuery[odataKeys.has(k) ? `$${k}` : k] = v;
		}
	}

	const requestOptions: ApiRequestOptions = {
		method,
		url,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: Object.keys(formattedQuery).length > 0 ? formattedQuery : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT,
		});
	} catch (error) {
		if (error instanceof ApiError) throw error;
		if (error instanceof Error)
			throw new SapsuccessfactorsAPIError(error.message);
		throw new SapsuccessfactorsAPIError('Unknown error occurred');
	}
}
