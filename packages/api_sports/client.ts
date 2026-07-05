import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ApiSportsAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// API error bodies vary by sport endpoint; unknown forces callers to narrow before use.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'ApiSportsAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

export type ApiSport =
	| 'football'
	| 'basketball'
	| 'nba'
	| 'afl'
	| 'baseball'
	| 'formula1'
	| 'mma'
	| 'nfl';

export const API_SPORTS_BASE_URLS: Record<ApiSport, string> = {
	football: 'https://v3.football.api-sports.io',
	basketball: 'https://v1.basketball.api-sports.io',
	nba: 'https://v2.nba.api-sports.io',
	afl: 'https://v1.afl.api-sports.io',
	baseball: 'https://v1.baseball.api-sports.io',
	formula1: 'https://v1.formula-1.api-sports.io',
	mma: 'https://v1.mma.api-sports.io',
	nfl: 'https://v1.american-football.api-sports.io',
};

export type ApiSportsQueryValue =
	| string
	| number
	| boolean
	| Array<string | number>
	| undefined;

// Catch values are untyped at runtime; narrow to ApiError/Error before rethrowing.
async function handleRequestError(error: unknown): Promise<never> {
	if (error instanceof ApiError) {
		throw new ApiSportsAPIError(error.message, error.status, {
			cause: error,
		});
	}
	if (error instanceof Error) {
		throw new ApiSportsAPIError(error.message, undefined, { cause: error });
	}
	throw new ApiSportsAPIError('Unknown error');
}

/**
 * Performs a GET request to a sport-specific API-Sports REST API.
 *
 * Auth: API key via the `x-apisports-key` request header.
 */
export async function makeApiSportsRequest<T>(
	sport: ApiSport,
	path: string,
	options: {
		apiKey?: string;
		query?: Record<string, ApiSportsQueryValue>;
	} = {},
): Promise<T> {
	const { apiKey, query = {} } = options;

	const config: OpenAPIConfig = {
		BASE: API_SPORTS_BASE_URLS[sport],
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
			...(apiKey ? { 'x-apisports-key': apiKey } : {}),
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: path,
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		return handleRequestError(error);
	}
}
