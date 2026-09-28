import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class RemovebgAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'RemovebgAPIError';
	}
}

const REMOVEBG_API_BASE = 'https://api.remove.bg/v1.0';

const REMOVEBG_NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

type RemovebgError = { title?: unknown; detail?: unknown; code?: unknown };

function firstError(body: unknown): RemovebgError | undefined {
	if (typeof body !== 'object' || body === null) return undefined;
	const errors = (body as { errors?: unknown }).errors;
	if (!Array.isArray(errors) || errors.length === 0) return undefined;
	return errors[0] as RemovebgError;
}

function extractErrorMessage(body: unknown): string | undefined {
	const error = firstError(body);
	if (!error) return undefined;
	if (typeof error.detail === 'string' && error.detail) return error.detail;
	if (typeof error.title === 'string' && error.title) return error.title;
	return undefined;
}

function extractErrorCode(body: unknown): string | undefined {
	const error = firstError(body);
	return error && typeof error.code === 'string' ? error.code : undefined;
}

export async function makeRemovebgRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST';
		body?: Record<string, unknown>;
	} = {},
): Promise<T> {
	const { method = 'GET', body } = options;

	const config: OpenAPIConfig = {
		BASE: REMOVEBG_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'X-Api-Key': apiKey,
			// remove.bg returns a binary image by default; JSON with a base64
			// payload is only returned when the client asks for it explicitly.
			Accept: 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' ? body : undefined,
		mediaType:
			method === 'POST' ? 'application/json; charset=utf-8' : undefined,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: REMOVEBG_NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw new RemovebgAPIError(
				extractErrorMessage(error.body) || error.message,
				extractErrorCode(error.body),
				error.status,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new RemovebgAPIError(error.message);
		}
		throw new RemovebgAPIError('Unknown remove.bg API error');
	}
}
