import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export class MondayAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'MondayAPIError';
	}
}

const MONDAY_API_BASE = 'https://api.monday.com';

const MONDAY_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

interface MondayGraphQLResponse<T> {
	data: T;
	errors?: Array<{
		message: string;
		// any: follows the GraphQL spec — locations and path are arbitrarily shaped
		locations?: unknown;
		path?: unknown;
	}>;
}

export async function makeMondayRequest<T>(
	query: string,
	apiKey: string,
	variables?: Record<string, unknown>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: MONDAY_API_BASE,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: 'v2',
		body: {
			query,
			...(variables ? { variables } : {}),
		},
		mediaType: 'application/json; charset=utf-8',
	};

	const response = await request<MondayGraphQLResponse<T>>(
		config,
		requestOptions,
		{ rateLimitConfig: MONDAY_RATE_LIMIT_CONFIG },
	);

	if (response.errors && response.errors.length > 0) {
		const errorMessage = response.errors.map((e) => e.message).join(', ');
		throw new MondayAPIError(errorMessage);
	}

	return response.data;
}
