import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export type CannyAPIErrorOptions = {
	cause?: Error;
	status?: number;
	statusText?: string;
	body?: unknown;
	retryAfter?: number;
};

export class CannyAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
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

export async function makeCannyRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'POST';
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
			const errorBody = error.body;
			const message =
				typeof errorBody === 'object' &&
				errorBody !== null &&
				'error' in errorBody &&
				typeof (errorBody as { error?: unknown }).error === 'string'
					? (errorBody as { error: string }).error
					: error.message;

			const code = error.status?.toString();
			throw new CannyAPIError(message, code, { cause: error });
		}

		if (error instanceof Error) {
			throw new CannyAPIError(error.message);
		}

		throw new CannyAPIError('Unknown error');
	}
}
