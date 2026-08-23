import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class GoogleCloudVisionAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'GoogleCloudVisionAPIError';
	}
}

const GOOGLECLOUDVISION_API_BASE = 'https://vision.googleapis.com/v1';
const MAX_ATTEMPTS = 3;
const MAX_RETRY_DELAY_MS = 30_000;

export type GoogleCloudVisionAuthType = 'api_key' | 'oauth_2';

export type GoogleCloudVisionRequestContext = {
	key?: string;
	authType?: GoogleCloudVisionAuthType;
	options?: { authType?: GoogleCloudVisionAuthType };
};

const GOOGLE_API_KEY_PREFIX = 'AIza';

export function resolveGoogleCloudVisionAuthType(
	ctx: GoogleCloudVisionRequestContext,
): GoogleCloudVisionAuthType {
	const declared = ctx.authType ?? ctx.options?.authType;
	if (declared) return declared;
	const credential = ctx.key ?? '';
	if (credential.startsWith(GOOGLE_API_KEY_PREFIX)) {
		return 'api_key';
	}
	if (credential) {
		return 'oauth_2';
	}
	return 'api_key';
}

export type GoogleCloudVisionRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	query?: Record<string, string | number | boolean | undefined>;
	baseUrl?: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isRetryable(status: number | undefined, method: string): boolean {
	if (status === 429) return method === 'GET';
	if (status !== undefined && status >= 500) return method === 'GET';
	return false;
}

function retryDelayMs(error: ApiError, attempt: number): number {
	const retryAfter = error.retryAfter;
	if (typeof retryAfter === 'number' && retryAfter > 0) {
		return Math.min(retryAfter, MAX_RETRY_DELAY_MS);
	}
	return Math.min(2 ** (attempt - 1) * 1000, MAX_RETRY_DELAY_MS);
}

export async function makeGoogleCloudVisionRequest<T>(
	endpoint: string,
	ctx: GoogleCloudVisionRequestContext,
	options: GoogleCloudVisionRequestOptions = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		baseUrl = GOOGLECLOUDVISION_API_BASE,
	} = options;
	const credential = ctx.key ?? '';
	const authType = resolveGoogleCloudVisionAuthType(ctx);

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};
	if (authType === 'oauth_2') {
		headers.Authorization = `Bearer ${credential}`;
	} else {
		headers['x-goog-api-key'] = credential;
	}

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: headers,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	let lastError: unknown;
	for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
		try {
			return await request<T>(config, requestOptions, {
				rateLimitConfig: {
					enabled: false,
					maxRetries: 0,
					initialRetryDelay: 1000,
					backoffMultiplier: 2,
					headerNames: {},
				},
			});
		} catch (error) {
			lastError = error;
			const canRetry =
				error instanceof ApiError &&
				attempt < MAX_ATTEMPTS &&
				isRetryable(error.status, method);
			if (!canRetry) break;
			await sleep(retryDelayMs(error, attempt));
		}
	}

	if (lastError instanceof ApiError) {
		throw lastError;
	}
	if (lastError instanceof Error) {
		throw new GoogleCloudVisionAPIError(lastError.message);
	}
	throw new GoogleCloudVisionAPIError('Unknown error');
}
