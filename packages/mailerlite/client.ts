import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const MAILERLITE_API_BASE = 'https://connect.mailerlite.com/api';
export const MAILERLITE_API_VERSION = '2026-11-21';

export type MailerLiteRequestOptions = {
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	url: string;
	query?: Record<string, string | number | boolean | undefined>;
	body?: object | readonly object[];
	headers?: Record<string, string>;
};

const WRITE_RATE_LIMIT_CONFIG = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
} as const;

export async function makeMailerLiteRequest<T>(
	requestOptions: MailerLiteRequestOptions,
	apiKey?: string,
): Promise<T> {
	if (apiKey !== undefined && apiKey.length === 0) {
		throw new AuthMissingError('mailerlite', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: MAILERLITE_API_BASE,
		VERSION: MAILERLITE_API_VERSION,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-Version': MAILERLITE_API_VERSION,
			...(apiKey === undefined ? {} : { Authorization: `Bearer ${apiKey}` }),
		},
	};

	const options: ApiRequestOptions = {
		...requestOptions,
		mediaType: 'application/json; charset=utf-8',
	};

	try {
		// Keep Retry-After extraction enabled for writes, but never replay a
		// write automatically: MailerLite only documents idempotency on select
		// email routes, and many writes can send mail or change consent/data.
		return await request<T>(
			config,
			options,
			requestOptions.method === 'GET'
				? undefined
				: { rateLimitConfig: WRITE_RATE_LIMIT_CONFIG },
		);
	} catch (error) {
		// `unknown` because transport failures are not guaranteed to be Error
		// instances; narrowing below preserves status/retryAfter without leaking
		// MailerLite request bodies, subscriber PII, or resource IDs.
		const caught: unknown = error;
		if (caught instanceof ApiError) {
			throw new ApiError(
				{ method: caught.request.method, url: '/api/[redacted]' },
				{
					url: `${MAILERLITE_API_BASE}/[redacted]`,
					ok: false,
					status: caught.status,
					statusText: 'MailerLite API request failed',
					body: {},
				},
				`MailerLite API request failed (HTTP ${caught.status})`,
				{
					retryAfter: caught.retryAfter,
					rateLimitReset: caught.rateLimitReset,
					rateLimitRemaining: caught.rateLimitRemaining,
					rateLimitLimit: caught.rateLimitLimit,
				},
			);
		}
		throw new Error('MailerLite API request failed');
	}
}
