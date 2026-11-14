import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const FIREBERRY_API_BASE = 'https://api.fireberry.com';
const NO_TRANSPORT_RETRIES: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

export class FireberryAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'FireberryAPIError';
	}
}

// Core's ApiError goes through (R8) so its status, retryAfter and rate-limit fields reach core and the
// error handlers. It is rebuilt without the sent body, the query (metadata calls carry tokenid there),
// the URL's query string and Fireberry's reply, whose messages can echo CRM field values.
function sanitizedApiError(error: ApiError): ApiError {
	const url = new URL(error.url, FIREBERRY_API_BASE);
	url.search = '';
	return new ApiError(
		{
			...error.request,
			body: undefined,
			formData: undefined,
			query: undefined,
		},
		{
			url: url.toString(),
			ok: false,
			status: error.status,
			statusText: error.statusText,
			body: undefined,
		},
		`Fireberry request failed with status ${error.status}`,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

export async function makeFireberryRequest<T>(
	path: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
		// Request field values are tenant-defined JSON and already validated by operation Zod schemas.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		metadata?: boolean;
	} = {},
): Promise<T> {
	if (apiKey.length === 0) throw new AuthMissingError('fireberry', 'api_key');
	const { method = 'GET', body, query, metadata = false } = options;
	const config: OpenAPIConfig = {
		BASE: FIREBERRY_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: metadata
			? {}
			: { tokenid: apiKey, 'Content-Type': 'application/json' },
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body: method === 'POST' || method === 'PUT' ? body : undefined,
		mediaType: 'application/json; charset=utf-8',
		query: metadata ? { ...query, tokenid: apiKey } : query,
	};
	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: NO_TRANSPORT_RETRIES,
		});
	} catch (error) {
		if (error instanceof ApiError) throw sanitizedApiError(error);
		if (error instanceof Error)
			throw new FireberryAPIError('Fireberry request failed');
		// `unknown` because JavaScript permits throwing non-Error values.
		throw new FireberryAPIError('Fireberry request failed');
	}
}

// Returns raw provider JSON so the registered file endpoint output schema can validate it.
export async function makeFireberryUploadRequest(
	objectId: string,
	recordId: string,
	fileName: string,
	fileBase64: string,
	apiKey: string,
): Promise<unknown> {
	if (apiKey.length === 0) throw new AuthMissingError('fireberry', 'api_key');
	const form = new FormData();
	const fileBytes = new Uint8Array(Buffer.from(fileBase64, 'base64'));
	form.append('file', new Blob([fileBytes]), fileName);
	const path = `/api/v2/record/${encodeURIComponent(objectId)}/${encodeURIComponent(recordId)}/files`;
	try {
		const response = await fetch(`${FIREBERRY_API_BASE}${path}`, {
			method: 'POST',
			headers: { tokenid: apiKey },
			body: form,
			signal: AbortSignal.timeout(20_000),
		});
		if (!response.ok) {
			const retryAfterHeader = response.headers.get('retry-after');
			const retrySeconds =
				retryAfterHeader === null ? Number.NaN : Number(retryAfterHeader);
			const retryDate =
				retryAfterHeader === null ? Number.NaN : Date.parse(retryAfterHeader);
			const retryAfter = Number.isFinite(retrySeconds)
				? retrySeconds * 1000
				: Number.isFinite(retryDate)
					? Math.max(0, retryDate - Date.now())
					: undefined;
			await response.body?.cancel().catch(() => undefined);
			throw new ApiError(
				{ method: 'POST', url: path },
				{
					url: `${FIREBERRY_API_BASE}${path}`,
					ok: false,
					status: response.status,
					statusText: response.statusText,
					body: undefined,
				},
				`Fireberry file upload failed with status ${response.status}`,
				{ retryAfter },
			);
		}
		// `unknown` because provider response JSON is untrusted until parsed by the upload response schema.
		const result: unknown = await response.json();
		return result;
	} catch (error) {
		if (error instanceof ApiError) throw error;
		if (error instanceof Error)
			throw new FireberryAPIError('Fireberry file upload failed');
		// `unknown` because JavaScript permits throwing non-Error values.
		throw new FireberryAPIError('Fireberry file upload failed');
	}
}
