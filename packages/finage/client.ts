import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class FinageAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'FinageAPIError';
	}
}

export const FINAGE_API_BASE = 'https://api.finage.co.uk';

const RATE_LIMIT_CONFIG: RateLimitConfig = {
	// Single retry owner: the plugin error handler owns the 429 retry policy,
	// so the transport stays single-attempt (maxRetries 0). Keeping enabled
	// true makes the shared transport read Retry-After and attach it to the
	// thrown error without ever retrying on its own.
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

// unknown: provider error bodies arrive as unparsed JSON, so callers narrow each
// field they read instead of asserting a provider shape up front.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

// Finage sends three error bodies: { error: "<text>" } on the market data
// routes, { success, statusCode, message } on news and market status, and
// { error: { code, message } }. Surface the provider's own message in each case
// instead of discarding it for the generic status text.
// unknown: the transport hands back unparsed JSON, and providerError narrows
// only the documented fields rather than trusting the whole body.
function providerError(body: unknown): { code?: string; message?: string } {
	if (!isRecord(body)) return {};
	if (typeof body.error === 'string' && body.error.length > 0) {
		return { message: body.error };
	}
	const nested = isRecord(body.error) ? body.error : body;
	const code = typeof nested.code === 'string' ? nested.code : undefined;
	const message =
		typeof nested.message === 'string' ? nested.message : undefined;
	return { code, message };
}

export async function makeFinageRequest<T>(
	endpoint: string,
	apiKey: string,
	query: Record<string, string | number | boolean | undefined> = {},
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: FINAGE_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	};
	const requestOptions: ApiRequestOptions = {
		method: 'GET',
		url: endpoint,
		mediaType: 'application/json; charset=utf-8',
		query: { ...query, apikey: apiKey },
	};
	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: RATE_LIMIT_CONFIG,
		});
	} catch (error) {
		if (error instanceof ApiError) {
			const provider = providerError(error.body);
			const message = provider.code
				? `${provider.code}: ${provider.message ?? error.message}`
				: (provider.message ?? error.message);
			throw new FinageAPIError(
				message,
				error.status,
				provider.code,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			// A failure before a response (a bad URL, a dropped connection) can
			// quote the request URL, which carries the key in its query string.
			throw new FinageAPIError(
				apiKey ? error.message.split(apiKey).join('[redacted]') : error.message,
			);
		}
		throw new FinageAPIError('Unknown Finage API error');
	}
}
