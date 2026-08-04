import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Mailchimp returns errors as RFC-7807 problem documents:
 * `{ type, title, status, detail, instance, errors?: [{ field, message }] }`.
 * This extracts a human-readable detail string from an ApiError body.
 */
export function getMailchimpErrorDetail(error: Error): string | undefined {
	if (!(error instanceof ApiError)) return undefined;
	const body = error.body;
	if (!body || typeof body !== 'object') return undefined;
	const problem = body as {
		detail?: unknown;
		title?: unknown;
		errors?: Array<{ field?: unknown; message?: unknown }>;
	};

	const parts: string[] = [];
	if (typeof problem.detail === 'string') parts.push(problem.detail);
	else if (typeof problem.title === 'string') parts.push(problem.title);

	if (Array.isArray(problem.errors) && problem.errors.length > 0) {
		const fields = problem.errors
			.map((e) => {
				const field = typeof e.field === 'string' ? e.field : '';
				const message = typeof e.message === 'string' ? e.message : '';
				return field ? `${field}: ${message}` : message;
			})
			.filter(Boolean)
			.join('; ');
		if (fields) parts.push(fields);
	}

	return parts.length > 0 ? parts.join(' — ') : undefined;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate') || msg.includes('429');
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
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 403) return true;
			return error.message.toLowerCase().includes('forbidden');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 404) return true;
			return error.message.toLowerCase().includes('not found');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 400) return true;
			return error.message.toLowerCase().includes('invalid resource');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
