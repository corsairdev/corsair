import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { ZodType } from 'zod';

export class BigDataCloudAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'BigDataCloudAPIError';
	}
}

/** @see https://www.bigdatacloud.com/docs */
export const BIGDATACLOUD_API_BASE = 'https://api-bdc.net/data';

export const BIGDATACLOUD_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
	},
};

export const BIGDATACLOUD_PATHS = {
	'asn-info-receiving-from': '/asn-info-receiving-from',
	'asn-info-transit-to': '/asn-info-transit-to',
	'asn-rank-list': '/asn-rank-list',
	'prefixes-list': '/prefixes-list',
	'network-by-ip': '/network-by-ip',
	'network-by-cidr': '/network-by-cidr',
	'country-info': '/country-info',
	'country-by-ip': '/country-by-ip',
	'reverse-geocode-with-timezone': '/reverse-geocode-with-timezone',
	'timezone-by-ip': '/timezone-by-ip',
	'am-i-roaming': '/am-i-roaming',
	'hazard-report': '/hazard-report',
	'tor-exit-nodes-list': '/tor-exit-nodes-list',
	'user-risk': '/user-risk',
	'email-verify': '/email-verify',
	'phone-number-validate-by-ip': '/phone-number-validate-by-ip',
	'user-agent-info': '/user-agent-info',
} as const;

export type BigDataCloudEndpoint = keyof typeof BIGDATACLOUD_PATHS;

export type BigDataCloudRequestOptions<T = unknown> = {
	method?: 'GET';
	query?: Record<string, string | number | boolean | undefined>;
	schema?: ZodType<T>;
};

function compactQuery(
	query: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> | undefined {
	const compacted: Record<string, string | number | boolean> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined && value !== '') {
			compacted[key] = value;
		}
	}
	return Object.keys(compacted).length > 0 ? compacted : undefined;
}

function resolvePath(endpoint: BigDataCloudEndpoint): string {
	switch (endpoint) {
		case 'asn-info-receiving-from':
			return '/asn-info-receiving-from';
		case 'asn-info-transit-to':
			return '/asn-info-transit-to';
		case 'asn-rank-list':
			return '/asn-rank-list';
		case 'prefixes-list':
			return '/prefixes-list';
		case 'network-by-ip':
			return '/network-by-ip';
		case 'network-by-cidr':
			return '/network-by-cidr';
		case 'country-info':
			return '/country-info';
		case 'country-by-ip':
			return '/country-by-ip';
		case 'reverse-geocode-with-timezone':
			return '/reverse-geocode-with-timezone';
		case 'timezone-by-ip':
			return '/timezone-by-ip';
		case 'am-i-roaming':
			return '/am-i-roaming';
		case 'hazard-report':
			return '/hazard-report';
		case 'tor-exit-nodes-list':
			return '/tor-exit-nodes-list';
		case 'user-risk':
			return '/user-risk';
		case 'email-verify':
			return '/email-verify';
		case 'phone-number-validate-by-ip':
			return '/phone-number-validate-by-ip';
		case 'user-agent-info':
			return '/user-agent-info';
	}
}

export async function makeBigDataCloudRequest<T>(
	endpoint: BigDataCloudEndpoint,
	apiKey: string,
	options: BigDataCloudRequestOptions<T> = {},
): Promise<T> {
	if (!apiKey?.trim()) {
		throw new BigDataCloudAPIError(
			'BigDataCloud API key is required',
			'AUTH_ERROR',
			401,
		);
	}

	const path = resolvePath(endpoint);
	const { method = 'GET', query = {}, schema } = options;

	const config: OpenAPIConfig = {
		BASE: BIGDATACLOUD_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		query: compactQuery({
			...query,
			key: apiKey.trim(),
		}),
		mediaType: 'application/json',
	};

	try {
		const result = await request<T>(config, requestOptions, {
			rateLimitConfig: BIGDATACLOUD_RATE_LIMIT_CONFIG,
		});
		if (schema) {
			return schema.parse(result);
		}
		return result;
	} catch (error) {
		if (error instanceof ApiError) {
			const status = error.status;
			let message = error.message;
			let code: string | undefined;

			if (error.body && typeof error.body === 'object') {
				const errorObj = error.body as Record<string, unknown>;
				if (typeof errorObj.message === 'string') {
					message = errorObj.message;
				} else if (typeof errorObj.description === 'string') {
					message = errorObj.description;
				} else if (typeof errorObj.error === 'string') {
					message = errorObj.error;
				}
				if (typeof errorObj.code === 'string') {
					code = errorObj.code;
				}
			}

			throw new BigDataCloudAPIError(
				message || `BigDataCloud API returned HTTP ${status}`,
				code,
				status,
				error.retryAfter,
			);
		}

		if (error instanceof BigDataCloudAPIError) {
			throw error;
		}

		throw new BigDataCloudAPIError(
			error instanceof Error ? error.message : 'Unknown BigDataCloud API error',
		);
	}
}
