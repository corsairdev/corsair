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
	body?: unknown,
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
	const inferredGetQuery =
		method === 'GET' && isJsonBody
			? ((body as
					| Record<string, string | number | boolean | undefined>
					| undefined) ?? undefined)
			: undefined;
	const resolvedQuery =
		(query as
			| Record<string, string | number | boolean | undefined>
			| undefined) ?? inferredGetQuery;
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
			const maybeCode =
				typeof error.body === 'object' && error.body !== null
					? ((error.body as { code?: unknown }).code ??
						(error.body as { error?: { code?: unknown } }).error?.code)
					: undefined;
			throw new WriterAPIError(
				error.message,
				error.status,
				typeof maybeCode === 'string' ? maybeCode : undefined,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new WriterAPIError(error.message);
		}
		throw new WriterAPIError('Unknown Writer API error');
	}
}
