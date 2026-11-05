import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Better Stack's `errors` field is not one type. Captured live 2026-08-16:
 *
 *   404  {"errors":"Resource type monitor with id = 1 was not found"}
 *   422  {"errors":{"url":["can't be blank"]}}
 *   422  {"errors":"...missing some required attributes","required_attributes":[...]}
 *   422  {"errors":"...misspelled some attributes","invalid_attributes":[...]}
 *   403  {"errors":"Cannot modify status page advanced settings..."}
 *
 * A naive join() breaks on the object form and String() yields "[object
 * Object]", so both shapes are handled explicitly.
 */
export function formatBetterstackError(body: unknown): string | undefined {
	if (!body || typeof body !== 'object') return undefined;
	const record = body as Record<string, unknown>;
	const errors = record.errors;

	let message: string | undefined;
	if (typeof errors === 'string') {
		message = errors;
	} else if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
		message = Object.entries(errors as Record<string, unknown>)
			.map(([field, messages]) => {
				const list = Array.isArray(messages)
					? messages.join(', ')
					: String(messages);
				return `${field}: ${list}`;
			})
			.join('; ');
	} else if (Array.isArray(errors)) {
		message = errors.map((entry) => String(entry)).join('; ');
	}

	if (!message) return undefined;

	// The 422 variants name the offending fields in a sibling array.
	const extras: string[] = [];
	for (const key of ['required_attributes', 'invalid_attributes'] as const) {
		const value = record[key];
		if (Array.isArray(value) && value.length > 0) {
			extras.push(`${key.replace('_', ' ')}: ${value.join(', ')}`);
		}
	}
	return extras.length > 0 ? `${message} (${extras.join('; ')})` : message;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const message = error.message.toLowerCase();
			return message.includes('429') || message.includes('too many requests');
		},
		handler: async (error) => {
			let retryAfterMs: number | undefined;
			if (error instanceof ApiError && error.retryAfter !== undefined) {
				retryAfterMs = error.retryAfter;
			}
			return { maxRetries: 5, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('unauthorized') || message.includes('invalid token')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[BETTERSTACK:${context.operation}] Authentication failed - check the API token`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * 403 from Better Stack is plan gating, not a permission problem: a free
	 * account gets it for status page advanced settings. Retrying cannot help.
	 */
	PLAN_OR_PERMISSION_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 403) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('forbidden') || message.includes('please upgrade')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[BETTERSTACK:${context.operation}] Forbidden - the account plan may not include this feature: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	VALIDATION_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 422) return true;
			return error.message.toLowerCase().includes('unprocessable');
		},
		handler: async (error, context) => {
			console.warn(
				`[BETTERSTACK:${context.operation}] Request rejected: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			return error.message.toLowerCase().includes('was not found');
		},
		handler: async (error, context) => {
			console.warn(
				`[BETTERSTACK:${context.operation}] Resource not found: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	NETWORK_ERROR: {
		match: (error) => {
			const message = error.message.toLowerCase();
			return (
				message.includes('network') ||
				message.includes('econnrefused') ||
				message.includes('enotfound') ||
				message.includes('etimedout') ||
				message.includes('fetch failed')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[BETTERSTACK:${context.operation}] Network error: ${error.message}`,
			);
			return { maxRetries: 3 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[BETTERSTACK:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
