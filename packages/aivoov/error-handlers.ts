import type { CorsairErrorHandler } from 'corsair/core';
import type { AivoovAPIError } from './client';

// The framework hands these handlers a base Error. AivoovAPIError's extra
// fields are read through a Partial view so a plain Error stays safe to pass.
function getStatus(error: Error): number | undefined {
	return (error as Partial<AivoovAPIError>).status;
}

function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<AivoovAPIError>).retryAfter;
}

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (getStatus(error) === 429) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('429') ||
				message.includes('rate limit') ||
				message.includes('too many requests') ||
				// `/voices` is capped at 20 calls per day and reports the cap in prose.
				message.includes('daily limit')
			);
		},
		handler: async (error) => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		// AiVOOV answers a bad or missing key with HTTP 403 and
		// `{"status":false,"error":"Invalid API key"}` rather than a 401.
		match: (error) => {
			const status = getStatus(error);
			if (status === 401 || status === 403) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('invalid api key') ||
				message.includes('unauthorized') ||
				message.includes('forbidden')
			);
		},
		handler: async (error, context) => {
			console.error(
				`[AIVOOV:${context.operation}] Authentication failed - check your X-API-KEY`,
			);
			return { maxRetries: 0 };
		},
	},
	INSUFFICIENT_CREDITS_ERROR: {
		// Synthesis is billed against a character credit balance; retrying a
		// request that ran out of credits just burns quota.
		match: (error) => {
			const message = error.message.toLowerCase();
			return (
				message.includes('credit') ||
				message.includes('quota') ||
				message.includes('insufficient')
			);
		},
		handler: async (error, context) => {
			console.error(
				`[AIVOOV:${context.operation}] Out of character credits: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	BAD_REQUEST_ERROR: {
		match: (error) => {
			if (getStatus(error) === 400) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('bad request') ||
				message.includes('invalid request') ||
				message.includes('validation')
			);
		},
		handler: async (error, context) => {
			console.warn(
				`[AIVOOV:${context.operation}] Bad request: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	SERVER_ERROR: {
		match: (error) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500) return true;
			const message = error.message.toLowerCase();
			return (
				message.includes('server error') || message.includes('bad gateway')
			);
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[AIVOOV:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
