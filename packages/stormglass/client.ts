import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class StormglassAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly status?: number,
	) {
		super(message);
		this.name = 'StormglassAPIError';
	}
}

export class StormglassRateLimitError extends StormglassAPIError {
	constructor(
		message = 'Stormglass API rate limit exceeded',
		public readonly retryAfterMs?: number,
	) {
		super(message, 'RATE_LIMIT_ERROR', 429);
		this.name = 'StormglassRateLimitError';
	}
}

/** Official: https://docs.stormglass.io/#/ */
const STORMGLASS_API_BASE = 'https://api.stormglass.io/v2';

function errorMessage(error: ApiError): string {
	const body = error.body;
	if (body && typeof body === 'object') {
		const record = body as Record<string, unknown>;
		if (record.errors && typeof record.errors === 'object') {
			const values = Object.values(record.errors as Record<string, unknown>);
			if (values.length > 0) return values.map(String).join(', ');
		}
		if (typeof record.error === 'string') return record.error;
		if (typeof record.message === 'string') return record.message;
	}
	return error.message;
}

export async function makeStormglassRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { query } = options;

	const config: OpenAPIConfig = {
		BASE: STORMGLASS_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			// Stormglass expects the raw API key, not a Bearer token.
			Authorization: apiKey,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint,
		mediaType: 'application/json; charset=utf-8',
		query,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			if (error.status === 429) {
				throw new StormglassRateLimitError(
					errorMessage(error),
					error.retryAfter,
				);
			}
			throw new StormglassAPIError(
				errorMessage(error),
				undefined,
				error.status,
			);
		}
		if (error instanceof Error) {
			throw new StormglassAPIError(error.message);
		}
		throw new StormglassAPIError('Unknown error');
	}
}
