import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class ChatworkAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
		public readonly errors?: string[],
	) {
		super(message);
		this.name = 'ChatworkAPIError';
	}
}

export const CHATWORK_API_BASE = 'https://api.chatwork.com/v2';

export const CHATWORK_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
		resetTime: 'X-RateLimit-Reset',
		remaining: 'X-RateLimit-Remaining',
		limit: 'X-RateLimit-Limit',
	},
};

export interface ChatworkRequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: Record<string, unknown> | string;
	query?: Record<string, string | number | boolean | undefined>;
	authType?: 'api_key' | 'oauth_2';
	mediaType?: string;
}

export async function makeChatworkRequest<T>(
	endpoint: string,
	token: string,
	options: ChatworkRequestOptions = {},
): Promise<T> {
	const {
		method = 'GET',
		body,
		query,
		authType = 'oauth_2',
		mediaType,
	} = options;

	const headers: Record<string, string> = {};

	if (authType === 'api_key') {
		headers['X-ChatWorkToken'] = token;
	} else {
		headers.Authorization = `Bearer ${token}`;
	}

	let requestBody: any;
	let effectiveMediaType = mediaType ?? 'application/json; charset=utf-8';

	if (method === 'POST' || method === 'PUT') {
		if (mediaType === 'application/x-www-form-urlencoded') {
			effectiveMediaType = 'application/x-www-form-urlencoded';
			if (typeof body === 'object' && body !== null) {
				const params = new URLSearchParams();
				for (const [key, value] of Object.entries(body)) {
					if (value !== undefined && value !== null) {
						params.append(key, String(value));
					}
				}
				requestBody = params.toString();
			} else {
				requestBody = body;
			}
		} else {
			requestBody = body;
		}
	}

	const config: OpenAPIConfig = {
		BASE: CHATWORK_API_BASE,
		VERSION: 'v2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: authType === 'oauth_2' ? token : undefined,
		HEADERS: headers,
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: requestBody,
		mediaType: effectiveMediaType,
		query: method === 'GET' ? query : undefined,
	};

	try {
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig: CHATWORK_RATE_LIMIT_CONFIG,
		});

		// Chatwork returns 204 No Content for endpoints like GET /rooms/{room_id}/messages when empty
		if (response === undefined || response === null) {
			return [] as unknown as T;
		}

		return response;
	} catch (error) {
		if (error instanceof ApiError) {
			const bodyData = error.body as { errors?: string[] } | undefined;
			const errorList = Array.isArray(bodyData?.errors)
				? bodyData.errors
				: undefined;
			const message =
				errorList && errorList.length > 0
					? errorList.join(', ')
					: error.message;
			throw new ChatworkAPIError(
				message,
				error.status,
				error.retryAfter,
				errorList,
			);
		}
		if (error instanceof Error) {
			throw new ChatworkAPIError(error.message);
		}
		throw new ChatworkAPIError('Unknown Chatwork API error');
	}
}
