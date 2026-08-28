import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class EmeliaAPIError extends Error {
	public readonly code?: string;
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number | string;

	constructor(message: string, options?: { code?: string; cause?: Error }) {
		super(message, options);
		this.name = 'EmeliaAPIError';
		this.code = options?.code;
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

export const EMELIA_API_BASE = 'https://graphql.emelia.io';

const EMELIA_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

interface GraphQLResponse<T> {
	data?: T;
	errors?: Array<{
		message: string;
		extensions?: { code?: string };
	}>;
}

export async function makeEmeliaRequest<T>(
	query: string,
	apiKey: string,
	variables?: Record<string, unknown>,
): Promise<T> {
	const authHeader = apiKey.startsWith('Bearer ') ? apiKey : apiKey;

	const config: OpenAPIConfig = {
		BASE: EMELIA_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: authHeader,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: '/graphql',
		body: {
			query,
			variables: variables ?? {},
		},
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		const response = await request<GraphQLResponse<T>>(config, requestOptions, {
			rateLimitConfig: EMELIA_RATE_LIMIT_CONFIG,
		});

		if (response.errors && response.errors.length > 0) {
			const firstError = response.errors[0]!;
			throw new EmeliaAPIError(firstError.message, {
				code: firstError.extensions?.code,
			});
		}

		if (response.data === undefined || response.data === null) {
			throw new EmeliaAPIError('No data returned from Emelia GraphQL API');
		}

		return response.data;
	} catch (error) {
		if (error instanceof EmeliaAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			const bodyDetail =
				error.body == null
					? ''
					: typeof error.body === 'string'
						? error.body
						: JSON.stringify(error.body);
			const message = bodyDetail
				? `${error.statusText || 'API Error'}: ${bodyDetail}`
				: error.statusText || 'Unknown API Error';
			throw new EmeliaAPIError(message, { cause: error });
		}
		if (error instanceof Error) {
			throw new EmeliaAPIError(error.message);
		}
		throw new EmeliaAPIError('Unknown error');
	}
}
