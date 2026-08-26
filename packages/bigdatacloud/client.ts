import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
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

export const BIGDATACLOUD_API_BASE = 'https://api-bdc.net/data';

export type BigDataCloudEndpoint =
	| 'asn-info-receiving-from'
	| 'asn-info-transit-to'
	| 'asn-rank-list'
	| 'prefixes-list'
	| 'network-by-ip'
	| 'network-by-cidr'
	| 'country-info'
	| 'country-by-ip'
	| 'reverse-geocode-with-timezone'
	| 'timezone-by-ip'
	| 'am-i-roaming'
	| 'hazard-report'
	| 'tor-exit-nodes-list'
	| 'user-risk'
	| 'email-verify'
	| 'phone-number-validate-by-ip'
	| 'user-agent-info';

export type BigDataCloudRequestOptions<T = unknown> = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: unknown;
	query?: Record<string, string | number | boolean | undefined>;
	headers?: Record<string, string>;
	customBase?: string;
	timeout?: number;
	schema?: ZodType<T>;
};

function compactQuery(
	query: Record<string, string | number | boolean | undefined>,
): Record<string, string> {
	const compacted: Record<string, string> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined && value !== null && value !== '') {
			compacted[key] = String(value);
		}
	}
	return compacted;
}

/**
 * Make a request to the BigDataCloud API.
 *
 * BigDataCloud authenticates via `?key=<api-key>` query parameter.
 *
 * @param endpoint - The API endpoint path (e.g. 'country-info', 'hazard-report')
 * @param apiKey - The BigDataCloud API key
 * @param options - Request options including method, body, query params, schema
 */
export async function makeBigDataCloudRequest<T>(
	endpoint: BigDataCloudEndpoint | (string & {}),
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

	const {
		method = 'GET',
		body,
		query = {},
		headers,
		customBase,
		timeout,
		schema,
	} = options;

	const baseUrl = customBase ?? BIGDATACLOUD_API_BASE;

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		TIMEOUT: timeout,
		HEADERS: {
			Accept: 'application/json',
			...headers,
		},
	};

	const queryWithKey = compactQuery({
		...query,
		key: apiKey.trim(),
	});

	const cleanEndpoint = endpoint.replace(/[{}]/g, '');
	const requestOptions: ApiRequestOptions = {
		method,
		url: cleanEndpoint.startsWith('/') ? cleanEndpoint : `/${cleanEndpoint}`,
		body:
			method === 'POST' ||
			method === 'PUT' ||
			method === 'PATCH' ||
			method === 'DELETE'
				? body
				: undefined,
		query: queryWithKey,
		mediaType: 'application/json',
	};

	try {
		const result = await request<T>(config, requestOptions);
		if (schema) {
			return schema.parse(result);
		}
		return result;
	} catch (error) {
		if (error instanceof ApiError) {
			const status = error.status;
			const retryAfter = error.retryAfter;

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
				retryAfter,
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
