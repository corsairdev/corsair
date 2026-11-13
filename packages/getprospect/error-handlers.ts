import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { z } from 'zod';

const SanitizedErrorEnvelopeSchema = z
	.object({
		errors: z
			.array(
				z
					.object({
						payload: z.record(z.string(), z.json()).optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();

const DAILY_QUOTA_CODES = new Set([
	'rate_limit_exceeded',
	'job_exceeds_plan_limit',
	'ai_daily_limit',
]);

function isDailyQuotaRefusal(error: ApiError): boolean {
	// `unknown` because core ApiError bodies are untrusted provider JSON; validate before reading quota fields.
	const body: unknown = error.body;
	const parsed = SanitizedErrorEnvelopeSchema.safeParse(body);
	if (!parsed.success) return false;
	return (
		parsed.data.errors?.some(({ payload }) => {
			const code = payload?.code;
			return (
				payload?.window === 'day' ||
				(typeof code === 'string' && DAILY_QUOTA_CODES.has(code))
			);
		}) ?? false
	);
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 429,
		// The transport extracts Retry-After; retry short request limits here, never daily job/quota refusals.
		handler: async (error: Error) => {
			const retryAfterMs =
				error instanceof ApiError ? error.retryAfter : undefined;
			const dailyQuotaRefusal =
				error instanceof ApiError && isDailyQuotaRefusal(error);
			return {
				maxRetries:
					!dailyQuotaRefusal &&
					retryAfterMs !== undefined &&
					retryAfterMs > 0 &&
					retryAfterMs <= 60_000
						? 2
						: 0,
				headersRetryAfterMs: retryAfterMs,
			};
		},
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			(error.status === 401 || error.status === 403),
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			(error.status === 400 || error.status === 422),
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	PAYMENT_REQUIRED_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 402,
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
