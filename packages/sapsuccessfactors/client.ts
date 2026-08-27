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

export const SAP_SUCCESSFACTORS_DEFAULT_API_BASE =
	'https://api10.successfactors.com';

const SAP_SUCCESSFACTORS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

function isSapSandboxHost(urlStr: string): boolean {
	try {
		const parsed = new URL(urlStr);
		return parsed.hostname === 'sandbox.api.sap.com';
	} catch {
		return false;
	}
}

export async function makeSapsuccessfactorsRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		apiBaseUrl?: string;
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		apiBaseUrl = SAP_SUCCESSFACTORS_DEFAULT_API_BASE,
		body,
		query,
	} = options;

	let base = (apiBaseUrl || SAP_SUCCESSFACTORS_DEFAULT_API_BASE)
		.replace(/\s+/g, '')
		.replace(/\/+$/, '');
	if (!base.startsWith('http://') && !base.startsWith('https://')) {
		base = `https://${base}`;
	}
	const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
	if (base.endsWith('/odata/v2') && url.startsWith('/odata/v2')) {
		base = base.slice(0, -'/odata/v2'.length);
	}

	const isSandbox = isSapSandboxHost(base);

	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: isSandbox ? undefined : apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...(isSandbox
				? { APIKey: apiKey, apikey: apiKey }
				: {
						Authorization:
							apiKey.startsWith('Basic ') || apiKey.startsWith('Bearer ')
								? apiKey
								: `Bearer ${apiKey}`,
					}),
		},
	};

	// Map query keys to standard OData v2 parameters
	const formattedQuery: Record<string, string | number | boolean | undefined> =
		{
			$format: 'json',
		};
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
			if (v !== undefined) {
				const targetKey = odataKeys.has(k) ? `$${k}` : k;
				formattedQuery[targetKey] = v;
			}
		}
	}

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? formattedQuery : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: SAP_SUCCESSFACTORS_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) throw error;
		if (error instanceof Error)
			throw new SapsuccessfactorsAPIError(error.message);
		throw new SapsuccessfactorsAPIError('Unknown error occurred');
	}
}
