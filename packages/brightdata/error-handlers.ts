import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/** Keys whose values must not appear in logs (credentials, tokens, etc.). */
const SENSITIVE_INPUT_KEYS = new Set([
	'api_key',
	'apikey',
	'authorization',
	'password',
	'token',
	'secret',
	'webhooksecret',
	'key',
	'headers',
]);

function isSensitiveKey(key: string): boolean {
	const lower = key.toLowerCase();
	if (SENSITIVE_INPUT_KEYS.has(lower)) {
		return true;
	}
	if (
		lower.endsWith('_token') ||
		lower.endsWith('_secret') ||
		lower.endsWith('password') ||
		lower.includes('apikey')
	) {
		return true;
	}
	return false;
}

/** Redacts sensitive keys before logging. */
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
				msg.includes('rate_limited')
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
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 400) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('bad request') || msg.includes('validation error');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NETWORK_ERROR: {
		match: (error: Error) => {
			const message = error.message.toLowerCase();
			return (
				message.includes('network') ||
				message.includes('econnrefused') ||
				message.includes('enotfound') ||
				message.includes('etimedout') ||
				message.includes('fetch failed')
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
