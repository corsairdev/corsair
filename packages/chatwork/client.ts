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
	errors?: Record<number, string>;
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
		errors,
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
		errors,
	};

	try {
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig: CHATWORK_RATE_LIMIT_CONFIG,
		});

		return response;
	} catch (error) {
		if (error instanceof ApiError) {
			// error.body is arbitrary JSON from the provider; narrowed with typeof/in checks below.
			const body: unknown = error.body;
			const rawErrors =
				body !== null && typeof body === 'object' && 'errors' in body
					? body.errors
					: undefined;
			const errorList = Array.isArray(rawErrors)
				? rawErrors.filter((e): e is string => typeof e === 'string')
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

// Chatwork answers an empty list with 204 No Content, and corsair/http returns
// undefined for both that and an unparseable body. Treating 204 as an error
// here keeps the two apart: only a real 204 becomes an empty list, anything
// else reaches the caller's output schema and fails validation.
// Return value is the raw JSON body (or empty for 204); callers validate or ignore it.
export async function makeChatworkListRequest(
	endpoint: string,
	token: string,
	options: Omit<ChatworkRequestOptions, 'errors'> = {},
): Promise<unknown> {
	try {
		// Generic is unknown because 204 and JSON bodies differ; result is returned unparsed.
		return await makeChatworkRequest<unknown>(endpoint, token, {
			...options,
			errors: { 204: 'No Content' },
		});
	} catch (error) {
		if (error instanceof ChatworkAPIError && error.status === 204) {
			return [];
		}
		throw error;
	}
}
