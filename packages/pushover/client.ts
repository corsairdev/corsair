import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { ZodType } from 'zod';

export const PUSHOVER_API_BASE = 'https://api.pushover.net/1';

// NUL cannot appear in a token or user key, so the pair cannot be forged by a
// value that contains the separator.
const KEY_SEPARATOR = '\u0000';

export function joinPushoverKey(token: string, userKey: string): string {
	return `${token}${KEY_SEPARATOR}${userKey}`;
}

/** Splits the key built by the plugin's keyBuilder into token and user key. */
export function splitPushoverKey(key: string): {
	token: string;
	userKey?: string;
} {
	const [token = '', userKey] = key.split(KEY_SEPARATOR);
	return { token, userKey: userKey?.trim() ? userKey : undefined };
}

/**
 * The `user` an operation targets: the caller's value, else the connection
 * owner's stored user key.
 */
export function resolvePushoverUser(key: string, user?: string): string {
	const target = user ?? splitPushoverKey(key).userKey;
	if (!target) throw new AuthMissingError('pushover', 'user_key');
	return target;
}

function redactTag(url: string): string {
	return url.replace(/(cancel_by_tag\/)[^/?#]+?(\.json)/, '$1[REDACTED]$2');
}

export async function makePushoverRequest<T>(
	key: string,
	method: 'GET' | 'POST',
	url: string,
	parameters: Record<string, string | number | undefined>,
	schema: ZodType<T>,
): Promise<T> {
	const { token } = splitPushoverKey(key);
	if (!token.trim()) throw new AuthMissingError('pushover', 'api_key');
	// HTTP data is untrusted until validated; the shared transport cannot assume a response type.
	try {
		const response = await request<unknown>(
			{
				BASE: PUSHOVER_API_BASE,
				VERSION: '1',
				WITH_CREDENTIALS: false,
				CREDENTIALS: 'omit',
			},
			{
				method,
				url,
				...(method === 'GET'
					? { query: { ...parameters, token } }
					: {
							body: { ...parameters, token },
							mediaType: 'application/json',
						}),
			},
			// Pushover's 429 may mean a monthly quota is exhausted; do not replay.
			{
				rateLimitConfig: {
					enabled: true,
					maxRetries: 0,
					initialRetryDelay: 5000,
					backoffMultiplier: 2,
					headerNames: { retryAfter: 'retry-after' },
				},
			},
		);
		return schema.parse(response);
	} catch (error) {
		if (error instanceof ApiError) {
			if (method === 'POST') {
				// Retained request bodies can contain credentials and private data.
				Object.assign(error.request, { body: '[REDACTED]' });
			}
			// Cancel tags are caller-chosen text (often a customer id or email).
			Object.assign(error, { url: redactTag(error.url) });
			Object.assign(error.request, { url: redactTag(error.request.url) });
		}
		throw error;
	}
}
