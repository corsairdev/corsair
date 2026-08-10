import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';

export const AmbientWeatherCredentialsSchema = z.object({
	apiKey: z.string().min(1),
	applicationKey: z.string().min(1),
});

export type AmbientWeatherCredentials = z.infer<
	typeof AmbientWeatherCredentialsSchema
>;

export class AmbientWeatherAPIError extends Error {
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
		this.name = 'AmbientWeatherAPIError';

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

export class AmbientWeatherRateLimitError extends AmbientWeatherAPIError {
	constructor(message: string, options?: { cause?: Error }) {
		super(message, 429, options);
		this.name = 'AmbientWeatherRateLimitError';
	}
}

const AMBIENTWEATHER_API_BASE = 'https://api.ambientweather.net';

const AMBIENTWEATHER_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export type AmbientWeatherQueryValue = string | number | boolean | undefined;

export type AmbientWeatherRequestQuery = Record<
	string,
	AmbientWeatherQueryValue
>;

export function packAmbientWeatherCredentials(
	credentials: AmbientWeatherCredentials,
): string {
	return JSON.stringify(credentials);
}

export function parseAmbientWeatherKey(
	key: string,
): AmbientWeatherCredentials | null {
	try {
		const parsed = JSON.parse(key) as unknown;
		const credentials = AmbientWeatherCredentialsSchema.safeParse(parsed);
		return credentials.success ? credentials.data : null;
	} catch {
		return null;
	}
}

export async function makeAmbientWeatherRequest<T>(
	endpoint: string,
	apiKey: string,
	applicationKey: string,
	options: {
		query?: AmbientWeatherRequestQuery;
	} = {},
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: AMBIENTWEATHER_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint,
		query: {
			...options.query,
			apiKey,
			applicationKey,
		},
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: AMBIENTWEATHER_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			if (error.status === 429) {
				throw new AmbientWeatherRateLimitError(error.message, {
					cause: error,
				});
			}
			throw new AmbientWeatherAPIError(error.message, error.status, {
				cause: error,
			});
		}

		if (error instanceof Error) {
			throw new AmbientWeatherAPIError(error.message, undefined, {
				cause: error,
			});
		}

		throw new AmbientWeatherAPIError('Unknown Ambient Weather API error');
	}
}
