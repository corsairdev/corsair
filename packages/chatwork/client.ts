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

type ChatworkParamValue =
	| string
	| number
	| boolean
	| readonly number[]
	| undefined
	| null;

export type ChatworkParams = Record<string, ChatworkParamValue>;

export interface ChatworkRequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	form?: ChatworkParams;
	multipart?: FormData;
	query?: ChatworkParams;
	authType?: 'api_key' | 'oauth_2';
	defaultEmptyArray?: boolean;
}

export function pathSegment(value: string | number): string {
	return encodeURIComponent(String(value));
}

// Chatwork encodes booleans as 1/0 and id lists as comma-separated strings.
function encodeParams(params: ChatworkParams): Record<string, string> {
	const encoded: Record<string, string> = {};
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null) continue;
		if (typeof value === 'boolean') {
			encoded[key] = value ? '1' : '0';
		} else if (Array.isArray(value)) {
			encoded[key] = value.join(',');
		} else {
			encoded[key] = String(value);
		}
	}
	return encoded;
}

export async function makeChatworkRequest<T>(
	endpoint: string,
	token: string,
	options: ChatworkRequestOptions = {},
): Promise<T> {
	const {
		method = 'GET',
		form,
		multipart,
		query,
		authType = 'oauth_2',
		defaultEmptyArray = false,
	} = options;

	const headers: Record<string, string> = {};

	if (authType === 'api_key') {
		headers['X-ChatWorkToken'] = token;
	}

	let body: string | FormData | undefined;
	let mediaType: string | undefined;
	if (multipart) {
		body = multipart;
	} else if (form) {
		body = new URLSearchParams(encodeParams(form)).toString();
		mediaType = 'application/x-www-form-urlencoded';
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
		body,
		mediaType,
		query: query ? encodeParams(query) : undefined,
	};

	try {
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig: CHATWORK_RATE_LIMIT_CONFIG,
		});

		if (defaultEmptyArray && (response === undefined || response === null)) {
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
