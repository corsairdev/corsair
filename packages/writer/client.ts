import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class WriterAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'WriterAPIError';
	}
}

export const WRITER_API_BASE = 'https://api.writer.com/v1';
export const LLM_GATEWAY_BASE = 'https://llm.corsair.dev/v1';

export async function makeWriterRequest<T>(
	endpoint: string,
	apiKey: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
	// unknown is used because requests can pass structured JSON, binary FormData, or undefined
	body?: unknown,
	// unknown is used for query values because query parameters can include strings, numbers, booleans, or arrays
	query?: Record<string, unknown>,
	mediaType?: string,
	base = WRITER_API_BASE,
	sendApiKey = true,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		...(sendApiKey
			? {
					TOKEN: apiKey,
					HEADERS: {
						Authorization: `Bearer ${apiKey}`,
					},
				}
			: {}),
	};

	let effectiveMediaType = mediaType;
	if (!effectiveMediaType && !(body instanceof FormData)) {
		effectiveMediaType = 'application/json; charset=utf-8';
	}
	const isJsonBody = Boolean(effectiveMediaType?.includes('/json'));
	let inferredGetQuery: Record<string, unknown> | undefined;
	if (
		method === 'GET' &&
		isJsonBody &&
		typeof body === 'object' &&
		body !== null &&
		!(body instanceof FormData)
	) {
		// Narrow body safely to query record when passed as GET options
		inferredGetQuery = body as Record<string, unknown>;
	}
	const resolvedQuery = query ?? inferredGetQuery;
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method !== 'GET' ? body : undefined,
		mediaType: method !== 'GET' ? effectiveMediaType : undefined,
		query: resolvedQuery,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			// Safely inspect error payload using conditional type narrowing without unsafe assertions
			let maybeCode: string | undefined;
			if (typeof error.body === 'object' && error.body !== null) {
				if ('code' in error.body && typeof error.body.code === 'string') {
					maybeCode = error.body.code;
				} else if (
					'error' in error.body &&
					typeof error.body.error === 'object' &&
					error.body.error !== null &&
					'code' in error.body.error &&
					typeof error.body.error.code === 'string'
				) {
					maybeCode = error.body.error.code;
				}
			}
			throw new WriterAPIError(
				error.message,
				error.status,
				maybeCode,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new WriterAPIError(error.message);
		}
		throw new WriterAPIError('Unknown Writer API error');
	}
}
