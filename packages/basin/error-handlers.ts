import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { BasinAPIError } from './client';

/**
 * True when no HTTP status is available, so a handler may fall back to matching
 * on the message. `makeBasinRequest` wraps *every* failure in a BasinAPIError,
 * including transport errors that never reached Basin and therefore carry no
 * status — those must stay matchable by message.
 */
const hasNoStatus = (error: unknown): boolean => {
	if (error instanceof ApiError) return error.status === undefined;
	if (error instanceof BasinAPIError) return error.status === undefined;
	return true;
};

const getStatus = (error: unknown): number | undefined => {
	if (error instanceof ApiError) return error.status;
	if (error instanceof BasinAPIError) return error.status;
	return undefined;
};

/** Serialised response body, where Basin puts its human-readable detail. */
const getBodyText = (error: unknown): string => {
	const body =
		error instanceof ApiError || error instanceof BasinAPIError
			? error.body
			: undefined;
	if (body === undefined || body === null) return '';
	return typeof body === 'string' ? body : JSON.stringify(body);
};

const getRetryAfter = (error: unknown): number | undefined => {
	if (error instanceof ApiError) return error.retryAfter;
	if (error instanceof BasinAPIError) return error.retryAfter;
	return undefined;
};

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 429) return true;
			const msg = error.message.toLowerCase();
			return (
				hasNoStatus(error) &&
				(msg.includes('rate_limited') ||
					msg.includes('ratelimited') ||
					msg.includes('too many requests') ||
					msg.includes('429'))
			);
		},
		handler: async (error: Error) => {
			const retryAfterMs = getRetryAfter(error);
			// No binder-level retry, deliberately. `makeBasinRequest` already hands
			// the transport a BASIN_RATE_LIMIT_CONFIG that retries 429s and honours
			// Retry-After, so a 429 has been retried before it reaches here. The
			// binder's retry path also discards the value a successful retry
			// returns and rethrows the original error, so retrying again cannot
			// recover the call — it only replays requests, including writes.
			// Retry-After is still surfaced so callers can back off.
			return { maxRetries: 0, headersRetryAfterMs: retryAfterMs };
		},
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 401) return true;
			// Basin reports a bad or missing API key as 400, not 401, and puts the
			// detail in the body while `message` is only "Bad Request". Without
			// this, an auth failure is classified as a validation error and the
			// caller never sees the "check your API key" guidance below.
			if (
				status === 400 &&
				getBodyText(error).toLowerCase().includes('api key')
			) {
				return true;
			}
			const msg = error.message.toLowerCase();
			return (
				hasNoStatus(error) &&
				(msg.includes('unauthorized') ||
					msg.includes('invalid_auth') ||
					msg.includes('invalid_token') ||
					msg.includes('authentication failed'))
			);
		},
		handler: async (error: Error, context: { operation: string }) => {
			console.warn(
				`[BASIN:${context.operation}] Authentication failed - check your Basin API key`,
			);
			return { maxRetries: 0 };
		},
	},
	PERMISSION_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 403) return true;
			const msg = error.message.toLowerCase();
			return (
				hasNoStatus(error) &&
				(msg.includes('forbidden') ||
					msg.includes('permission_denied') ||
					msg.includes('access_denied'))
			);
		},
		handler: async (error: Error, context: { operation: string }) => {
			console.warn(
				`[BASIN:${context.operation}] Permission denied: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 404) return true;
			const msg = error.message.toLowerCase();
			return (
				hasNoStatus(error) && (msg.includes('not found') || msg.includes('404'))
			);
		},
		handler: async (error: Error, context: { operation: string }) => {
			console.warn(
				`[BASIN:${context.operation}] Resource not found: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 400 || status === 422) return true;
			const msg = error.message.toLowerCase();
			return (
				hasNoStatus(error) &&
				(msg.includes('bad request') ||
					msg.includes('unprocessable') ||
					msg.includes('invalid request') ||
					msg.includes('validation failed'))
			);
		},
		handler: async (error: Error, context: { operation: string }) => {
			console.warn(
				`[BASIN:${context.operation}] Invalid request / validation error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500 && status < 600) return true;
			const msg = error.message.toLowerCase();
			return (
				hasNoStatus(error) &&
				(msg.includes('internal server error') || msg.includes('server error'))
			);
		},
		handler: async (error: Error, context: { operation: string }) => {
			console.warn(
				`[BASIN:${context.operation}] Server error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error: Error, context: { operation: string }) => {
			console.error(
				`[BASIN:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
