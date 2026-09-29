import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import type { z } from 'zod';

const BASE = 'https://core.callpage.io';

const CALLPAGE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

type CallPageEnvelope<T> = {
	hasError?: boolean;
	errorCode?: string | number;
	message?: string;
	data?: T;
};

export class CallPageAPIError extends Error {
	public readonly status?: number;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string | number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'CallPageAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

function unwrapCallPagePayload<T>(response: CallPageEnvelope<T> | T): T {
	if (
		response &&
		typeof response === 'object' &&
		'data' in response &&
		(hasErrorKey(response) || 'errorCode' in response || 'message' in response)
	) {
		return (response as CallPageEnvelope<T>).data as T;
	}
	return response as T;
}

function hasErrorKey(response: object): boolean {
	return 'hasError' in response;
}

export async function makeCallPageRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
		body?: unknown;
		query?: Record<string, unknown>;
		schema?: z.ZodType<T>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query, schema } = options;
	const config: OpenAPIConfig = {
		BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: apiKey,
		},
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' || method === 'PATCH' ? body : undefined,
		mediaType: 'application/json',
		query: query as Record<string, string | number | boolean | undefined>,
	};

	try {
		const response = await request<CallPageEnvelope<T>>(
			config,
			requestOptions,
			{
				rateLimitConfig: CALLPAGE_RATE_LIMIT_CONFIG,
			},
		);

		if (response.hasError) {
			throw new CallPageAPIError(
				response.message || 'CallPage API request failed',
				response.errorCode,
			);
		}

		const payload = unwrapCallPagePayload(response);
		return schema ? schema.parse(payload) : (payload as T);
	} catch (error) {
		if (error instanceof CallPageAPIError) throw error;
		if (error instanceof ApiError) {
			throw new CallPageAPIError(error.message, error.status, { cause: error });
		}
		if (error instanceof Error) {
			throw new CallPageAPIError(error.message);
		}
		throw new CallPageAPIError('Unknown CallPage API error');
	}
}
