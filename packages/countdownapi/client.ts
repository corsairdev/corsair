import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';

import { ApiError, request } from 'corsair/http';

export class CountdownApiAPIError extends Error {
	public readonly status?: number;
	public readonly statusText?: string;
	public readonly body?: unknown;
	public readonly retryAfter?: number;

	constructor(
		message: string,
		public readonly code?: number,
		options?: { cause?: Error },
	) {
		super(message, options);
		this.name = 'CountdownApiAPIError';

		if (options?.cause instanceof ApiError) {
			this.status = options.cause.status;
			this.statusText = options.cause.statusText;
			this.body = options.cause.body;
			this.retryAfter = options.cause.retryAfter;
		}
	}
}

const COUNTDOWNAPI_API_BASE = 'https://api.countdownapi.com';

export async function makeCountdownApiRequest<T>(
	endpoint: string,
	apiKey: string,
	query: Record<string, string | number | boolean | undefined>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: COUNTDOWNAPI_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint,
		query: {
			...query,
			api_key: apiKey,
		},
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw new CountdownApiAPIError(error.message, error.status, {
				cause: error,
			});
		}

		if (error instanceof Error) {
			throw new CountdownApiAPIError(error.message, undefined, {
				cause: error,
			});
		}

		throw new CountdownApiAPIError('Unknown Countdown API error');
	}
}
