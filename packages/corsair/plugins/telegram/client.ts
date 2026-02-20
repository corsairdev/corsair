import type { ApiRequestOptions } from '../../async-core/ApiRequestOptions';
import { ApiError } from '../../async-core/ApiError';
import type { OpenAPIConfig } from '../../async-core/OpenAPI';
import type { RateLimitConfig } from '../../async-core/rate-limit';
import { request } from '../../async-core/request';

export class TelegramAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly parameters?: {
			retry_after?: number;
			migrate_to_chat_id?: number;
		},
	) {
		super(message);
		this.name = 'TelegramAPIError';
	}
}

const TELEGRAM_API_BASE = 'https://api.telegram.org';

const TELEGRAM_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

export async function makeTelegramRequest<T>(
	endpoint: string,
	botToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	if (!botToken || botToken.trim() === '') {
		throw new TelegramAPIError(
			'Bot token is required but was not provided. Please check your bot token configuration.',
			'401',
		);
	}

	const { method = 'POST', body, query } = options;

	const baseUrl = `${TELEGRAM_API_BASE}/bot${botToken}`;
	const url = `${baseUrl}/${endpoint}`;

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: '',
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'POST' || method === 'PUT' || method === 'PATCH' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig: TELEGRAM_RATE_LIMIT_CONFIG,
		});

		if (
			response &&
			typeof response === 'object' &&
			'ok' in response &&
			!response.ok
		) {
			const errorResponse = response as {
				error_code?: number;
				description?: string;
				parameters?: {
					retry_after?: number;
					migrate_to_chat_id?: number;
				};
			};
			const errorCode = errorResponse.error_code?.toString() || 'Unknown error';
			const description = errorResponse.description || 'Unknown error';
			throw new TelegramAPIError(description, errorCode, errorResponse.parameters);
		}

		const result = response as { result?: T };
		return (result.result ?? response) as T;
	} catch (error) {
		if (error instanceof TelegramAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			const errorBody = error.body as
				| {
						ok?: boolean;
						error_code?: number;
						description?: string;
						parameters?: {
							retry_after?: number;
							migrate_to_chat_id?: number;
						};
				  }
				| undefined;

			if (errorBody && typeof errorBody === 'object' && 'description' in errorBody) {
				const errorCode = errorBody.error_code?.toString() || error.status?.toString();
				throw new TelegramAPIError(
					errorBody.description || error.message,
					errorCode,
					errorBody.parameters,
				);
			}

			if (error.status === 404) {
				const errorMessage =
					error.message === 'Not Found'
						? 'Not Found - This usually means the bot token is invalid or the endpoint does not exist. Please verify your bot token is correct.'
						: error.message;
				throw new TelegramAPIError(errorMessage, error.status?.toString());
			}

			throw new TelegramAPIError(error.message, error.status?.toString());
		}
		if (error instanceof Error) {
			throw new TelegramAPIError(error.message);
		}
		throw new TelegramAPIError('Unknown error');
	}
}
