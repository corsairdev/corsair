import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class HubPlannerAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'HubPlannerAPIError';
	}
}

export const HUBPLANNER_API_BASE = 'https://app.hubplanner.com/api/v1';

/**
 * Redacts API credentials in-place without replacing the ApiError instance.
 * Mutates headers and error message/body in-place so the original error type, HTTP status,
 * and retry headers remain intact for downstream retry logic and handlers.
 */
// `unknown` because catch blocks and untrusted error sources can produce any thrown value.
export function redactInPlace(error: unknown, apiKey?: string): void {
	if (!apiKey) return;

	if (error instanceof ApiError) {
		if (error.request?.headers) {
			if ('Authorization' in error.request.headers) {
				error.request.headers.Authorization = '[REDACTED]';
			}
			if ('authorization' in error.request.headers) {
				error.request.headers.authorization = '[REDACTED]';
			}
		}
		if (typeof error.message === 'string') {
			error.message = error.message.split(apiKey).join('[REDACTED]');
		}
		if (typeof error.body === 'string') {
			Object.defineProperty(error, 'body', {
				value: error.body.split(apiKey).join('[REDACTED]'),
				configurable: true,
				writable: true,
			});
		}
	} else if (error instanceof Error) {
		if (typeof error.message === 'string') {
			error.message = error.message.split(apiKey).join('[REDACTED]');
		}
	}
}

export async function makeHubPlannerRequest<T>(
	endpoint: string,
	apiKey?: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// `unknown` because body payloads vary across endpoints and are validated by Zod before transmission.
		body?: Record<string, unknown> | Array<unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		baseUrl?: string;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		baseUrl = HUBPLANNER_API_BASE,
	} = options;

	// Fail fast on explicitly empty key to avoid unauthenticated network calls
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('hubplanner', 'api_key');
	}

	// Hub Planner authentication: Authorization header with raw API key without 'Bearer' prefix
	const authHeaders: Record<string, string> = apiKey
		? { Authorization: apiKey }
		: {};

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...authHeaders,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' ||
			method === 'PUT' ||
			method === 'PATCH' ||
			(method === 'DELETE' && body !== undefined)
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		redactInPlace(error, apiKey);
		if (error instanceof Error) {
			throw error;
		}
		throw new HubPlannerAPIError('Unknown error');
	}
}
