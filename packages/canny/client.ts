import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export type CannyAPIErrorOptions = {
	cause?: Error;
	status?: number;
	statusText?: string;
	// `unknown` body: mirrors `ApiError.body` (unvalidated provider payload).
	// Safe because callers only read it after narrowing or pass it through.
	body?: unknown;
	retryAfter?: number;
};

export class CannyAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	// `unknown` body: mirrors `ApiError.body`. Safe for the same reason as above.
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: string,
		options: CannyAPIErrorOptions = {},
	) {
		super(message, options);
		this.name = 'CannyAPIError';

		if (options.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		} else {
			this.status = options.status;
			this.statusText = options.statusText;
			this.body = options.body;
			this.retryAfter = options.retryAfter;
		}
	}
}

const CANNY_API_BASE = 'https://canny.io/api/v1';

// Type guard for Canny error envelopes. `error.body` is typed `unknown`
// (unvalidated provider data), so we narrow with `in` + `typeof` before
// reading `.error`. Safe because every property access is guarded; a plain
// `Record` type would hide that the shape is unvalidated.
function getProviderErrorMessage(body: unknown): string | undefined {
	if (typeof body === 'object' && body !== null && 'error' in body) {
		// Narrow assertion: safe because the `in` check above proves `body`
		// is an object with an `error` key; no better static type exists for
		// the unvalidated provider envelope.
		const errorField = (body as { error?: unknown }).error;
		if (typeof errorField === 'string') {
			return errorField;
		}
	}
	return undefined;
}

export async function makeCannyRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'POST';
		// `unknown` values: safe because the request body carries caller-provided
		// fields that are validated by zod input schemas before this call, and
		// the `T` response stays `unknown` at call sites until validated by a
		// zod output schema immediately after `await`.
		body?: Record<string, unknown>;
	} = {},
): Promise<T> {
	const { body = {} } = options;

	const config: OpenAPIConfig = {
		BASE: CANNY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const formattedEndpoint = endpoint.startsWith('/')
		? endpoint
		: `/${endpoint}`;

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: formattedEndpoint,
		body: {
			apiKey,
			...body,
		},
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			if (error.status === 429) {
				throw error;
			}

			const errorBody = error.body;
			const message = getProviderErrorMessage(errorBody) ?? error.message;

			const code = error.status?.toString();
			throw new CannyAPIError(message, code, { cause: error });
		}

		if (error instanceof Error) {
			throw new CannyAPIError(error.message);
		}

		// No assertion: `typeof` narrowing safely renders string rejections
		// (transport layers sometimes reject with plain strings); anything
		// else keeps the generic message so failures never surface empty.
		throw new CannyAPIError(
			typeof error === 'string' && error !== '' ? error : 'Unknown error',
		);
	}
}
