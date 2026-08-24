import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const ASHBY_API_BASE = 'https://api.ashbyhq.com';

/**
 * Ashby API rate limiting configuration.
 * When encountering 429 Too Many Requests, Corsair will retry with exponential backoff,
 * respecting the Retry-After header if present.
 */
export const ASHBY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export type AshbyErrorItem = {
	code?: string;
	message?: string;
};

/**
 * Custom error class representing an error returned by the Ashby API or transport layer.
 */
export class AshbyAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly errors?: AshbyErrorItem[],
	) {
		super(message);
		this.name = 'AshbyAPIError';
	}
}

export type AshbyRequestOptions = {
	body?: Record<string, unknown>;
	headers?: Record<string, string>;
};

/**
 * Encodes the Ashby API key into an HTTP Basic Authorization header.
 * Ashby expects the API key as the username with an empty password.
 */
export function buildAshbyBasicAuthHeader(apiKey: string): string {
	const encoded = Buffer.from(`${apiKey}:`).toString('base64');
	return `Basic ${encoded}`;
}

/**
 * Makes an RPC-style HTTP POST request to the Ashby API.
 * All Ashby API endpoints use the POST method with JSON bodies.
 */
export async function makeAshbyRequest<T>(
	endpoint: string,
	apiKey: string,
	options: AshbyRequestOptions = {},
): Promise<T> {
	const normalizedEndpoint = endpoint.startsWith('/')
		? endpoint
		: `/${endpoint}`;

	const config: OpenAPIConfig = {
		BASE: ASHBY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: buildAshbyBasicAuthHeader(apiKey),
			...options.headers,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: normalizedEndpoint,
		body: options.body ?? {},
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig: ASHBY_RATE_LIMIT_CONFIG,
		});

		// Check if response contains Ashby failure envelope { success: false, errors: [...], error: "..." }
		if (
			response &&
			typeof response === 'object' &&
			'success' in response &&
			(response as { success: boolean }).success === false
		) {
			const failed = response as {
				success: false;
				errors?: AshbyErrorItem[];
				error?: string;
			};
			const firstError = failed.errors?.[0];
			const message =
				firstError?.message || failed.error || 'Ashby API request failed';
			const code = firstError?.code;
			throw new AshbyAPIError(message, 400, code, failed.errors);
		}

		return response;
	} catch (error) {
		if (error instanceof AshbyAPIError) {
			throw error;
		}

		if (error instanceof ApiError) {
			const status = error.status;
			let parsedErrors: AshbyErrorItem[] | undefined;
			let parsedCode: string | undefined;
			let message = error.message;

			if (error.body && typeof error.body === 'object') {
				const bodyObj = error.body as {
					errors?: AshbyErrorItem[];
					error?: string;
					message?: string;
				};
				if (Array.isArray(bodyObj.errors) && bodyObj.errors.length > 0) {
					parsedErrors = bodyObj.errors;
					parsedCode = bodyObj.errors[0]?.code;
					message = bodyObj.errors[0]?.message || message;
				} else if (typeof bodyObj.error === 'string') {
					message = bodyObj.error;
				} else if (typeof bodyObj.message === 'string') {
					message = bodyObj.message;
				}
			}

			throw new AshbyAPIError(message, status, parsedCode, parsedErrors);
		}

		if (error instanceof Error) {
			throw new AshbyAPIError(error.message);
		}
		throw new AshbyAPIError('Unknown Ashby error');
	}
}
