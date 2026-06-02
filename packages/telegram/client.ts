import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

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

const hasFileValues = (body: Record<string, unknown>): boolean => {
	return Object.values(body).some(
		(v) => v instanceof File || v instanceof Blob,
	);
};

export async function makeTelegramRequest<T>(
	endpoint: string,
	botToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Request body for Telegram API can contain various parameter types - unknown ensures type safety
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
	const isWriteMethod =
		method === 'POST' || method === 'PUT' || method === 'PATCH';
	const isFileUpload = isWriteMethod && body != null && hasFileValues(body);

	const baseUrl = `${TELEGRAM_API_BASE}/bot${botToken}`;

	const config: OpenAPIConfig = {
		BASE: baseUrl,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: '',
		HEADERS: isFileUpload ? {} : { 'Content-Type': 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		...(isFileUpload
			? // FormData API requires `any` because file entries can be File, Blob, or string - no common typed alternative
				{ formData: body as Record<string, any> }
			: {
					body: isWriteMethod ? body : undefined,
					mediaType: 'application/json; charset=utf-8',
				}),
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
			// Telegram error responses follow a known shape not reflected in the generic T parameter
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
			throw new TelegramAPIError(
				description,
				errorCode,
				errorResponse.parameters,
			);
		}

		// Telegram API wraps successful payloads in a `result` field; T represents the unwrapped value
		const result = response as { result?: T };
		// Fall back to the raw response when `result` is absent (e.g. boolean responses)
		return (result.result ?? response) as T;
	} catch (error) {
		if (error instanceof TelegramAPIError) {
			throw error;
		}
		if (error instanceof ApiError) {
			// ApiError.body is typed as unknown; cast to the Telegram error shape to access structured fields
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

			if (
				errorBody &&
				typeof errorBody === 'object' &&
				'description' in errorBody
			) {
				const errorCode =
					errorBody.error_code?.toString() || error.status?.toString();
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
