import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const ASHBY_API_BASE = 'https://api.ashbyhq.com';

export const ASHBY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export type AshbyErrorItem = {
	code?: string;
	message?: string;
};

export class AshbyAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly errors?: AshbyErrorItem[],
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'AshbyAPIError';
	}
}

export type AshbyRequestOptions = {
	body?: Record<string, unknown>;
	headers?: Record<string, string>;
};

export function buildAshbyBasicAuthHeader(apiKey: string): string {
	const encoded = Buffer.from(`${apiKey}:`).toString('base64');
	return `Basic ${encoded}`;
}

function statusFromAshbyCode(code?: string): number {
	if (code === 'resource_not_found') return 404;
	if (code === 'missing_endpoint_permission') return 403;
	if (code === 'rate_limit_exceeded') return 429;
	return 400;
}

export async function makeAshbyRequest<T>(
	endpoint: string,
	apiKey: string,
	options: AshbyRequestOptions = {},
): Promise<T> {
	if (!apiKey.trim()) {
		throw new AuthMissingError('ashby', 'api_key');
	}

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
			throw new AshbyAPIError(
				message,
				statusFromAshbyCode(code),
				code,
				failed.errors,
			);
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

			throw new AshbyAPIError(
				message,
				status,
				parsedCode,
				parsedErrors,
				error.retryAfter,
			);
		}

		if (error instanceof Error) {
			throw new AshbyAPIError(error.message);
		}
		throw new AshbyAPIError('Unknown Ashby error');
	}
}
