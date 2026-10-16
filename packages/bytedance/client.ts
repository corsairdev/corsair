import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

// ap-southeast-1 (Johor). Override with the `baseUrl` plugin option.
export const BYTEDANCE_ARK_API_BASE = 'https://ark.ap-southeast.bytepluses.com';

export type ArkQuery = Record<string, string | number | string[] | undefined>;

export class BytedanceAPIError extends Error {
	readonly status?: number;
	/** Ark error code, e.g. ModelNotOpen or RateLimitExceeded.EndpointRPMExceeded. */
	readonly code?: string;
	readonly retryAfter?: number;
	// unknown: error bodies are { error: { code, message } } but proxies can answer with text.
	readonly body?: unknown;

	constructor(message: string, cause?: Error) {
		super(message, cause ? { cause } : undefined);
		this.name = 'BytedanceAPIError';
		if (cause instanceof ApiError) {
			this.status = cause.status;
			this.body = cause.body;
			this.retryAfter = cause.retryAfter;
			this.code = readError(cause.body)?.code;
		}
	}
}

// unknown: error body shape is not guaranteed.
function readError(
	body: unknown,
): { code?: string; message?: string } | undefined {
	if (!body || typeof body !== 'object' || !('error' in body)) return undefined;
	const error = (body as { error: unknown }).error;
	if (!error || typeof error !== 'object') return undefined;
	const { code, message } = error as Record<string, unknown>;
	return {
		code: typeof code === 'string' ? code : undefined,
		message: typeof message === 'string' ? message : undefined,
	};
}

export async function makeArkRequest<T>(
	path: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'DELETE';
		path?: Record<string, string>;
		query?: ArkQuery;
		body?: object;
		baseUrl?: string;
	} = {},
): Promise<T> {
	const { method = 'GET', query, body } = options;

	const config: OpenAPIConfig = {
		BASE: options.baseUrl ?? BYTEDANCE_ARK_API_BASE,
		VERSION: '3',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: { Accept: 'application/json' },
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		path: options.path,
		query,
		body,
		mediaType: body ? 'application/json; charset=utf-8' : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			const detail = readError(error.body);
			throw new BytedanceAPIError(
				detail?.code || detail?.message
					? `${error.status} ${[detail.code, detail.message].filter(Boolean).join(': ')}`
					: error.message,
				error,
			);
		}
		if (error instanceof Error) {
			throw new BytedanceAPIError(error.message, error);
		}
		throw new BytedanceAPIError('Unknown ModelArk API error');
	}
}
