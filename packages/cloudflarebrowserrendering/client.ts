import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';
import type { JsonValue } from './endpoints/types';
import { JsonValueSchema } from './endpoints/types';

export class CloudflareBrowserRenderingAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
	) {
		super(message);
		this.name = 'CloudflareBrowserRenderingAPIError';
	}
}

export class CloudflareBrowserRenderingHTTPError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'CloudflareBrowserRenderingHTTPError';
	}
}

export const CLOUDFLARE_BROWSER_RUN_API_BASE =
	'https://api.cloudflare.com/client/v4';

/** Covers Browser Run's 5-minute action timeout plus navigation/wait time. */
export const DEFAULT_CLOUDFLARE_BROWSER_RUN_REQUEST_TIMEOUT_MS = 8 * 60 * 1000;

function resolveRequestTimeoutMs(timeoutMs?: number): number {
	if (timeoutMs === undefined || !Number.isFinite(timeoutMs)) {
		return DEFAULT_CLOUDFLARE_BROWSER_RUN_REQUEST_TIMEOUT_MS;
	}
	return Math.min(
		DEFAULT_CLOUDFLARE_BROWSER_RUN_REQUEST_TIMEOUT_MS,
		Math.max(1, Math.floor(timeoutMs)),
	);
}

export function getCloudflareBrowserRenderingRequestTimeoutOptions(
	timeoutMs?: number,
): { timeoutMs?: number } {
	return timeoutMs === undefined ? {} : { timeoutMs };
}

const BASE64_ALPHABET =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function encodeBase64(bytes: Uint8Array): string {
	let encoded = '';
	for (let index = 0; index < bytes.length; index += 3) {
		const first = bytes[index] ?? 0;
		const second = bytes[index + 1];
		const third = bytes[index + 2];
		encoded += BASE64_ALPHABET.charAt((first & 0xfc) >> 2);
		encoded += BASE64_ALPHABET.charAt(
			((first & 0x03) << 4) | (((second ?? 0) & 0xf0) >> 4),
		);
		encoded +=
			second === undefined
				? '='
				: BASE64_ALPHABET.charAt(
						((second & 0x0f) << 2) | (((third ?? 0) & 0xc0) >> 6),
					);
		encoded += third === undefined ? '=' : BASE64_ALPHABET.charAt(third & 0x3f);
	}
	return encoded;
}

function parseRetryAfter(response: Response): number | undefined {
	const retryAfter = response.headers.get('retry-after');
	if (retryAfter === null) return undefined;
	const seconds = Number.parseInt(retryAfter, 10);
	return Number.isNaN(seconds) ? undefined : seconds * 1000;
}

export async function makeCloudflareBrowserRenderingBinaryRequest(
	path: string,
	apiToken: string,
	body: Record<string, JsonValue | undefined>,
	options: {
		query?: Record<string, string | number | boolean | undefined>;
		timeoutMs?: number;
	} = {},
): Promise<{ contentType: string; byteLength: number; data: string }> {
	if (apiToken.length === 0) {
		throw new AuthMissingError('cloudflarebrowserrendering', 'api_key');
	}

	const controller = new AbortController();
	const timeout = setTimeout(
		() => controller.abort(),
		resolveRequestTimeoutMs(options.timeoutMs),
	);
	try {
		const url = new URL(`${CLOUDFLARE_BROWSER_RUN_API_BASE}${path}`);
		for (const [key, value] of Object.entries(options.query ?? {})) {
			if (value !== undefined) url.searchParams.set(key, String(value));
		}
		const response = await fetch(url.toString(), {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
			signal: controller.signal,
		});

		if (!response.ok) {
			const status = response.status;
			const retryAfter = status === 429 ? parseRetryAfter(response) : undefined;
			// Release the unread body before throwing so a failed transfer cannot
			// outlive the request deadline and retain connection resources.
			// Best-effort: cancelling an already-failed stream rejects too, and that
			// must not replace the HTTP status and Retry-After thrown below.
			await response.body?.cancel().catch(() => undefined);
			throw new CloudflareBrowserRenderingHTTPError(
				`Cloudflare Browser Run binary request failed with HTTP ${status}`,
				status,
				retryAfter,
			);
		}

		const bytes = new Uint8Array(await response.arrayBuffer());
		return {
			contentType:
				response.headers.get('content-type') ?? 'application/octet-stream',
			byteLength: bytes.byteLength,
			data: encodeBase64(bytes),
		};
	} catch (error) {
		if (error instanceof CloudflareBrowserRenderingHTTPError) throw error;
		throw new CloudflareBrowserRenderingHTTPError(
			'Cloudflare Browser Run binary request failed or timed out',
		);
	} finally {
		clearTimeout(timeout);
	}
}

const CloudflareErrorDetailSchema = z.object({
	code: z.number(),
	message: z.string(),
});

const CloudflareEnvelopeSchema = z
	.object({
		errors: z.array(CloudflareErrorDetailSchema).optional(),
		result: JsonValueSchema.optional(),
		success: z.boolean(),
	})
	.catchall(JsonValueSchema);

const CloudflareRateLimitConfig: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};

function redactTargetUrlQuery(
	query: ApiRequestOptions['query'],
): ApiRequestOptions['query'] {
	if (!query || !('url' in query)) {
		return query;
	}
	return { ...query, url: '[REDACTED]' };
}

function redactTargetUrlParam(url: string): string {
	const queryStart = url.indexOf('?');
	if (queryStart === -1) {
		return url;
	}
	const params = new URLSearchParams(url.slice(queryStart + 1));
	if (!params.has('url')) {
		return url;
	}
	params.set('url', '[REDACTED]');
	return `${url.slice(0, queryStart)}?${params.toString()}`;
}

export async function makeCloudflareBrowserRenderingRequest(
	path: string,
	apiToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
		body?: Record<string, JsonValue | undefined>;
		query?: Record<string, string | number | boolean | undefined>;
		timeoutMs?: number;
	} = {},
): Promise<JsonValue> {
	if (apiToken.length === 0) {
		throw new AuthMissingError('cloudflarebrowserrendering', 'api_key');
	}

	const { method = 'GET', body, query, timeoutMs } = options;
	const isWriteMethod = method === 'POST' || method === 'PUT';
	const config: OpenAPIConfig = {
		BASE: CLOUDFLARE_BROWSER_RUN_API_BASE,
		VERSION: '1.0.0',
		TIMEOUT: resolveRequestTimeoutMs(timeoutMs),
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Authorization: `Bearer ${apiToken}`,
		},
	};
	const requestOptions: ApiRequestOptions = {
		method,
		url: path,
		body: isWriteMethod ? body : undefined,
		mediaType: isWriteMethod ? 'application/json' : undefined,
		query,
	};

	try {
		// Browser Run responses are untrusted JSON or text; validate the wire value below.
		const wireResponse = await request<JsonValue>(config, requestOptions, {
			rateLimitConfig: CloudflareRateLimitConfig,
		});
		const response = JsonValueSchema.parse(wireResponse);
		const envelope = CloudflareEnvelopeSchema.safeParse(response);
		if (envelope.success) {
			if (!envelope.data.success) {
				const firstError = envelope.data.errors?.[0];
				const message =
					envelope.data.errors?.map((error) => error.message).join('; ') ||
					'Cloudflare Browser Run request failed';
				throw new CloudflareBrowserRenderingAPIError(message, firstError?.code);
			}
			if (envelope.data.result === undefined) {
				throw new CloudflareBrowserRenderingAPIError(
					'Cloudflare Browser Run response did not include a result',
				);
			}
			return envelope.data.result;
		}
		return response;
	} catch (error) {
		if (error instanceof ApiError) {
			// The target URL (targets.create) is customer data and may carry
			// credentials or a signed query; keep it out of the error.
			const safeRequest = {
				...error.request,
				body: undefined,
				query: redactTargetUrlQuery(error.request.query),
			};
			throw new ApiError(
				safeRequest,
				{
					url: redactTargetUrlParam(error.url),
					ok: false,
					status: error.status,
					statusText: error.statusText,
					body: error.body,
				},
				error.message,
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}
		if (error instanceof Error) {
			throw error;
		}
		throw new CloudflareBrowserRenderingAPIError('Unknown error');
	}
}
