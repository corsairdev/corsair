import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { request } from 'corsair/http';

export class TrelloAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'TrelloAPIError';
	}
}

const TRELLO_API_BASE = 'https://api.trello.com/1';

const TRELLO_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export async function makeTrelloRequest<T>(
	endpoint: string,
	token: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// unknown values allow any JSON-serializable type without committing to specific field types
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
	trelloApiKey?: string,
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const authQuery: Record<string, string | undefined> = {
		...(trelloApiKey ? { key: trelloApiKey } : {}),
		token,
	};

	const config: OpenAPIConfig = {
		BASE: TRELLO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: {
			...authQuery,
			...(method === 'GET' ? query : undefined),
		},
	};

	const response = await request<T>(config, requestOptions, {
		rateLimitConfig: TRELLO_RATE_LIMIT_CONFIG,
	});

	return response;
}
