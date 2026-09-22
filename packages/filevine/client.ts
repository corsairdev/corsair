import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class FilevineAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'FilevineAPIError';
		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

export const FILEVINE_API_BASE_US = 'https://api.filevineapp.com';
export const FILEVINE_API_BASE_CA = 'https://api.filevineapp.ca';
export const FILEVINE_IDENTITY_BASE = 'https://identity.filevine.io';

export const FILEVINE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
		remaining: 'X-RateLimit-Remaining',
		limit: 'X-RateLimit-Limit',
		resetTime: 'X-RateLimit-Reset',
	},
};

export async function makeFilevineRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		formData?: FormData;
		headers?: Record<string, string>;
		baseUrl?: string;
		orgId?: string | number;
		userId?: string | number;
	} = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		formData,
		headers,
		baseUrl,
		orgId,
		userId,
	} = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl ?? FILEVINE_API_BASE_US,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			Authorization: `Bearer ${apiKey}`,
			...(orgId !== undefined ? { 'x-fv-orgid': String(orgId) } : {}),
			...(userId !== undefined ? { 'x-fv-userid': String(userId) } : {}),
			...headers,
		},
	};

	// Content-Type is set via mediaType; for JSON we set application/json,
	// for FormData we let fetch set the multipart boundary automatically.
	const isFormData = !!formData;
	if (!isFormData && !headers?.['Content-Type']) {
		(config.HEADERS as Record<string, string>)['Content-Type'] =
			'application/json';
	}

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: isFormData
			? undefined
			: method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		formData: isFormData ? formData : undefined,
		mediaType: isFormData ? 'multipart/form-data' : 'application/json',
		query,
	};

	try {
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig: FILEVINE_RATE_LIMIT_CONFIG,
		});
		return response;
	} catch (error: unknown) {
		if (error instanceof ApiError) {
			const msg =
				(error.body as { message?: string })?.message || error.message;
			throw new FilevineAPIError(msg, String(error.status), { cause: error });
		}
		if (error instanceof Error) {
			throw new FilevineAPIError(error.message, undefined, { cause: error });
		}
		throw new FilevineAPIError('Unknown Filevine error');
	}
}

export async function makeFilevineIdentityRequest<T>(
	endpoint: string,
	body: Record<string, string>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: FILEVINE_IDENTITY_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	};

	const formBody = new URLSearchParams(body).toString();

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: endpoint,
		body: formBody as unknown as Record<string, unknown>,
		mediaType: 'application/x-www-form-urlencoded',
	};

	try {
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig: FILEVINE_RATE_LIMIT_CONFIG,
		});
		return response;
	} catch (error: unknown) {
		if (error instanceof ApiError) {
			const msg =
				(error.body as { message?: string; error?: string })?.message ||
				(error.body as { error?: string })?.error ||
				error.message;
			throw new FilevineAPIError(msg, String(error.status), { cause: error });
		}
		if (error instanceof Error) {
			throw new FilevineAPIError(error.message, undefined, { cause: error });
		}
		throw new FilevineAPIError('Unknown Filevine identity error');
	}
}
