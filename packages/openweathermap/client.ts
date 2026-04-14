import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class OpenWeatherMapAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;
	public readonly rateLimitReset?: number;
	public readonly rateLimitRemaining?: number;
	public readonly rateLimitLimit?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'OpenWeatherMapAPIError';

		// Preserve ApiError properties so error handlers can inspect status codes
		// and rate-limit headers without needing instanceof ApiError checks.
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
			this.rateLimitReset = options.cause.rateLimitReset;
			this.rateLimitRemaining = options.cause.rateLimitRemaining;
			this.rateLimitLimit = options.cause.rateLimitLimit;
		}
	}
}

const OPENWEATHERMAP_API_BASE = 'https://api.openweathermap.org/data/3.0';

/**
 * Performs a request to the OpenWeatherMap One Call API 3.0.
 *
 * Auth: API key passed as the `appid` query parameter (the only supported method).
 * All endpoints are GET-only.
 */
export async function makeOpenWeatherMapRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { query = {} } = options;

	const config: OpenAPIConfig = {
		BASE: OPENWEATHERMAP_API_BASE,
		VERSION: '3.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	// OpenWeatherMap authenticates via the `appid` query parameter
	const queryWithAuth: Record<string, string | number | boolean | undefined> = {
		...query,
		appid: apiKey,
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint,
		query: queryWithAuth,
	};

	try {
		const response = await request<T>(config, requestOptions);
		return response;
	} catch (error) {
		if (error instanceof ApiError) {
			throw new OpenWeatherMapAPIError(error.message, error.status, {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new OpenWeatherMapAPIError(error.message, undefined, {
				cause: error,
			});
		}
		throw new OpenWeatherMapAPIError('Unknown error');
	}
}
