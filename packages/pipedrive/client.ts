import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const PIPEDRIVE_API_BASE = 'https://api.pipedrive.com/api/v2';
export const PIPEDRIVE_API_V1_BASE = 'https://api.pipedrive.com/v1';
export const PIPEDRIVE_RATE_LIMIT_CONFIG: RateLimitConfig = {
	// Error handlers own 429 retries so daily-budget exhaustion is not replayed.
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: {
		// Pipedrive documents this as the remaining burst-window reset duration.
		retryAfter: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

type PipedriveAuthType = 'api_key' | 'oauth_2';
type PipedriveQueryValue =
	| string
	| number
	| boolean
	| Array<string | number | boolean>
	| undefined;

export async function makePipedriveRequest<T>(
	endpoint: string,
	apiKey: string,
	authType: PipedriveAuthType,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// `unknown` because the operation-specific Zod schema validates JSON, form, or multipart bodies.
		body?: unknown;
		query?: Record<string, PipedriveQueryValue>;
		headers?: Record<string, string>;
		apiVersion?: 'v1' | 'v2';
		contentType?: string;
	} = {},
): Promise<T> {
	if (!apiKey) throw new AuthMissingError('pipedrive', authType);

	const { method = 'GET', body, query } = options;
	const base =
		options.apiVersion === 'v1' ? PIPEDRIVE_API_V1_BASE : PIPEDRIVE_API_BASE;
	const config: OpenAPIConfig = {
		BASE: base,
		VERSION: options.apiVersion === 'v1' ? '1.0.0' : '2.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		...(authType === 'oauth_2' ? { TOKEN: apiKey } : {}),
		HEADERS: {
			...(body instanceof FormData
				? {}
				: {
						'Content-Type': options.contentType ?? 'application/json',
					}),
			...(authType === 'api_key' ? { 'x-api-token': apiKey } : {}),
			...options.headers,
		},
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body: method === 'GET' ? undefined : body,
		...(body instanceof FormData || body === undefined
			? {}
			: {
					mediaType: options.contentType ?? 'application/json; charset=utf-8',
				}),
		query,
	};
	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: PIPEDRIVE_RATE_LIMIT_CONFIG,
		});
	} catch (error: unknown) {
		// `unknown` is required because transport failures may be non-Error rejection values.
		// Request bodies and search/query values can contain customer data or credentials.
		const hasQueryValues = Object.values(query ?? {}).some(
			(value) => value !== undefined,
		);
		const hasErrorQueryValues =
			error instanceof ApiError &&
			Object.values(error.request.query ?? {}).some(
				(value) => value !== undefined,
			);
		if (
			(body !== undefined || hasQueryValues || hasErrorQueryValues) &&
			error instanceof ApiError
		) {
			const {
				body: _requestBody,
				query: _requestQuery,
				headers: _requestHeaders,
				...safeRequest
			} = error.request;
			void _requestBody;
			void _requestQuery;
			void _requestHeaders;
			throw new ApiError(
				safeRequest,
				{
					url: error.url?.split('?', 1)[0] ?? `${base}${endpoint}`,
					ok: false,
					status: error.status,
					statusText: error.statusText,
					body: { error: 'Pipedrive request failed' },
				},
				`Pipedrive request failed with HTTP ${error.status}`,
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}
		throw error;
	}
}

const MAX_BINARY_RESPONSE_BYTES = 20 * 1024 * 1024;

export async function makePipedriveBinaryRequest(
	endpoint: string,
	apiKey: string,
	authType: PipedriveAuthType,
	options: {
		method: 'GET';
		query?: Record<string, PipedriveQueryValue>;
		headers?: Record<string, string>;
		apiVersion: 'v1' | 'v2';
	},
): Promise<{
	content_type: string;
	base64: string;
	byte_length: number;
}> {
	if (!apiKey) throw new AuthMissingError('pipedrive', authType);
	const base =
		options.apiVersion === 'v1' ? PIPEDRIVE_API_V1_BASE : PIPEDRIVE_API_BASE;
	const query = new URLSearchParams();
	for (const [key, value] of Object.entries(options.query ?? {})) {
		if (Array.isArray(value)) {
			for (const item of value) query.append(key, String(item));
		} else if (value !== undefined) {
			query.append(key, String(value));
		}
	}
	const url = `${base}${endpoint}${query.size ? `?${query.toString()}` : ''}`;
	const headers = new Headers({
		Accept: 'application/octet-stream',
		...(authType === 'api_key' ? { 'x-api-token': apiKey } : {}),
		...options.headers,
	});
	if (authType === 'oauth_2') headers.set('Authorization', `Bearer ${apiKey}`);
	try {
		const response = await fetch(url, {
			method: options.method,
			headers,
			signal: AbortSignal.timeout(20_000),
		});
		if (!response.ok) {
			const reset = Number(response.headers.get('x-ratelimit-reset'));
			const retryAfter =
				response.status === 429 && Number.isFinite(reset) && reset > 0
					? reset * 1000
					: undefined;
			await response.body?.cancel().catch(() => undefined);
			throw new ApiError(
				{ method: options.method, url: endpoint },
				{
					url,
					ok: false,
					status: response.status,
					statusText: response.statusText,
					body: { error: 'Pipedrive binary request failed' },
				},
				`Pipedrive request failed with HTTP ${response.status}`,
				retryAfter === undefined ? undefined : { retryAfter },
			);
		}
		const reader = response.body?.getReader();
		const chunks: Uint8Array[] = [];
		let byteLength = 0;
		if (reader) {
			while (true) {
				const chunk = await reader.read();
				if (chunk.done) break;
				byteLength += chunk.value.byteLength;
				if (byteLength > MAX_BINARY_RESPONSE_BYTES) {
					await reader.cancel();
					throw new Error('Pipedrive file exceeds the 20 MiB response limit');
				}
				chunks.push(chunk.value);
			}
		} else {
			const bytes = new Uint8Array(await response.arrayBuffer());
			byteLength = bytes.byteLength;
			if (byteLength > MAX_BINARY_RESPONSE_BYTES) {
				throw new Error('Pipedrive file exceeds the 20 MiB response limit');
			}
			chunks.push(bytes);
		}
		const bytes = new Uint8Array(byteLength);
		let offset = 0;
		for (const chunk of chunks) {
			bytes.set(chunk, offset);
			offset += chunk.byteLength;
		}
		return {
			content_type:
				response.headers.get('content-type')?.split(';', 1)[0] ??
				'application/octet-stream',
			base64: Buffer.from(bytes).toString('base64'),
			byte_length: byteLength,
		};
	} catch (error: unknown) {
		// `unknown` is necessary because fetch can reject with non-Error values.
		if (error instanceof ApiError || error instanceof Error) throw error;
		throw new Error('Pipedrive binary request failed');
	}
}

function hasOAuthRefresh(context: {
	key: string;
}): context is { key: string; _refreshAuth: () => Promise<string> } {
	return (
		'_refreshAuth' in context && typeof context._refreshAuth === 'function'
	);
}

/**
 * Core refreshes an OAuth token after a 401 only for reads. Every Pipedrive
 * endpoint sends a single request, so a write that got a 401 can refresh the
 * token once and send that request again without repeating anything that landed.
 */
export function withOAuthRetry<C extends { key: string }, I, O>(
	endpoint: (ctx: C, input: I) => Promise<O>,
): (ctx: C, input: I) => Promise<O> {
	return async (ctx, input) => {
		try {
			return await endpoint(ctx, input);
		} catch (error: unknown) {
			// `unknown`: transport failures may reject with non-Error values.
			if (
				!(error instanceof ApiError && error.status === 401) ||
				!hasOAuthRefresh(ctx)
			) {
				throw error;
			}
			const freshKey = await ctx._refreshAuth();
			return await endpoint({ ...ctx, key: freshKey }, input);
		}
	};
}
