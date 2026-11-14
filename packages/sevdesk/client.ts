import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const SEVDESK_API_BASE = 'https://my.sevdesk.de/api/v1';
export type SevdeskHttpMethod = ApiRequestOptions['method'];
const RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};
type Options = {
	path?: object;
	query?: object;
	body?: object;
	resourceVersion?: string;
};
// Unknown query values are documented JSON scalars, arrays, or nested filter objects passed to the shared query serializer.
function toRecord(
	value: object | undefined,
): Record<string, unknown> | undefined {
	if (!value) return undefined;
	const result: Record<string, unknown> = {};
	for (const [key, entry] of Object.entries(value)) result[key] = entry;
	return result;
}
function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
function safeError(caught: unknown, method: SevdeskHttpMethod): Error {
	// unknown because HTTP and fetch errors have no stable shape; narrow API errors before removing potentially sensitive data.
	if (caught instanceof ApiError)
		return new ApiError(
			{ method, url: SEVDESK_API_BASE },
			{
				url: SEVDESK_API_BASE,
				ok: false,
				status: caught.status,
				statusText: '',
				body: undefined,
			},
			'Sevdesk API request failed',
			{
				retryAfter: caught.retryAfter,
				rateLimitReset: caught.rateLimitReset,
				rateLimitRemaining: caught.rateLimitRemaining,
				rateLimitLimit: caught.rateLimitLimit,
			},
		);
	return new Error('Sevdesk request failed');
}
export async function makeSevdeskRequest<T>(
	method: SevdeskHttpMethod,
	endpoint: string,
	apiKey: string | undefined,
	options: Options = {},
): Promise<T> {
	if (!apiKey || !/^[a-f0-9]{32}$/iu.test(apiKey))
		throw new AuthMissingError('sevdesk', 'api_key');
	if (
		options.resourceVersion !== undefined &&
		options.resourceVersion !== 'default' &&
		!/^\d+\.\d+$/u.test(options.resourceVersion)
	)
		throw new Error('Invalid Sevdesk X-Version value');
	const headers: Record<string, string> = {
		Authorization: apiKey,
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'User-Agent': 'Corsair Sevdesk integration',
	};
	if (options.resourceVersion !== undefined)
		headers['X-Version'] = options.resourceVersion;
	const config: OpenAPIConfig = {
		BASE: SEVDESK_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: headers,
		ENCODE_PATH: encodeURIComponent,
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		path: toRecord(options.path),
		query: toRecord(options.query),
		body: ['POST', 'PUT', 'PATCH'].includes(method) ? options.body : undefined,
		mediaType: 'application/json; charset=utf-8',
	};
	for (let attempt = 0; attempt < 3; attempt += 1) {
		try {
			// unknown because provider JSON is untrusted until the operation's output Zod schema validates it.
			return await request<T>(config, requestOptions, {
				rateLimitConfig: RATE_LIMIT_CONFIG,
			});
		} catch (caught: unknown) {
			// unknown because transport failures may contain PII; sanitize before retrying or propagating them.
			const error = safeError(caught, method);
			if (
				method !== 'GET' ||
				(error instanceof ApiError && error.status < 500) ||
				attempt === 2
			)
				throw error;
			await delay(50 * 2 ** attempt);
		}
	}
	throw new Error('Sevdesk request failed');
}
