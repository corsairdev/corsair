import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ByteFormsAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;

	constructor(
		message: string,
		public readonly code?: string,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'ByteFormsAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
		}
	}
}

const BYTEFORMS_API_BASE = 'https://api.forms.bytesuite.io/api';

const BYTEFORMS_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

type QueryValue =
	| string
	| number
	| boolean
	| readonly string[]
	| readonly number[]
	| readonly boolean[]
	| undefined;

export async function makeByteFormsRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, QueryValue>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	const isWriteMethod =
		method === 'POST' || method === 'PUT' || method === 'PATCH';

	const config: OpenAPIConfig = {
		BASE: BYTEFORMS_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			// ByteForms uses "basic" auth: the raw API key is sent in the
			// Authorization header with no "Bearer" prefix.
			Authorization: apiKey,
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isWriteMethod ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query:
			method === 'GET'
				? (query as Record<string, string | number | boolean>)
				: undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: BYTEFORMS_RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new ByteFormsAPIError(error.message, String(error.status), {
				cause: error,
			});
		}
		if (error instanceof Error) {
			throw new ByteFormsAPIError(error.message, undefined, { cause: error });
		}
		throw new ByteFormsAPIError('Unknown error');
	}
}
