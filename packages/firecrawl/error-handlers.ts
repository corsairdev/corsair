import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/** Keys whose values must not appear in logs (credentials, tokens, etc.). */
const SENSITIVE_INPUT_KEYS = new Set([
	'api_key',
	'apiKey',
	'authorization',
	'password',
	'token',
	'secret',
	'webhookSecret',
	'client_secret',
	'clientSecret',
	'access_token',
	'accessToken',
	'refresh_token',
	'refreshToken',
	'webhook_signature',
	'headers',
]);

function isSensitiveKey(key: string): boolean {
	const lower = key.toLowerCase();
	if (SENSITIVE_INPUT_KEYS.has(key) || SENSITIVE_INPUT_KEYS.has(lower)) {
		return true;
	}
	if (
		lower.endsWith('_token') ||
		lower.endsWith('_secret') ||
		lower.endsWith('password')
	) {
		return true;
	}
	if (lower.includes('apikey') || lower === 'bearer') {
		return true;
	}
	return false;
}

/** Shallow + nested object redaction for error logging (avoids leaking secrets). */
function redactSensitiveInput(input: unknown): unknown {
	if (input === null || input === undefined) {
		return input;
	}
	if (Array.isArray(input)) {
		return input.map((item) => redactSensitiveInput(item));
	}
	if (typeof input !== 'object') {
		return input;
	}
	const out: Record<string, unknown> = {};
	for (const [key, val] of Object.entries(input as Record<string, unknown>)) {
		if (isSensitiveKey(key)) {
			out[key] = '[redacted]';
		} else if (val !== null && typeof val === 'object') {
			out[key] = redactSensitiveInput(val);
		} else {
			out[key] = val;
		}
	}
	return out;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('rate limit') ||
				msg.includes('too many requests') ||
				msg.includes('429') ||
				msg.includes('request rate limit exceeded')
			);
		},
		handler: async (error: Error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (
				error instanceof ApiError &&
				(error.status === 401 || error.status === 403)
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				msg.includes('unauthorized') ||
				msg.includes('invalid api key') ||
				msg.includes('api key is missing') ||
				msg.includes('authentication') ||
				msg.includes('forbidden')
			);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async (error: Error, context) => {
			console.error(`[corsair:${context.pluginId}:${context.operation}]`, {
				error: error.message,
				input: redactSensitiveInput(context.input),
			});
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
