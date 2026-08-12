import type { CorsairErrorHandler } from 'corsair/core';
import type { OcrSpaceAPIError } from './client';

// Handlers receive the framework's base Error type. OcrSpaceAPIError adds these
// fields, so they are read through a Partial rather than an instanceof check.
function getStatus(error: Error): number | undefined {
	return (error as Partial<OcrSpaceAPIError>).status;
}

function getRetryAfter(error: Error): number | undefined {
	return (error as Partial<OcrSpaceAPIError>).retryAfter;
}

function getOcrExitCode(error: Error): number | undefined {
	return (error as Partial<OcrSpaceAPIError>).ocrExitCode;
}

// OCR.space reports quota and key problems inside a HTTP 200 body, so those
// errors reach the handlers with no status attached and have to be recognised
// from the message text.
function messageIncludes(error: Error, needles: string[]): boolean {
	const message = error.message.toLowerCase();
	return needles.some((needle) => message.includes(needle));
}

export const errorHandlers = {
	// Listed first: endpoints validate their input with zod before calling the
	// API, and a validation message can contain words the other matchers look
	// for. These never reach the network, so they are never retried.
	VALIDATION_ERROR: {
		match: (error: Error) => error.name === 'ZodError',
		handler: async () => ({ maxRetries: 0 }),
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			// The free plan caps usage per day and per month, and reports both in
			// the response body rather than as a 429. These phrases are specific
			// to quota exhaustion: broader words such as "maximum" also appear in
			// file-size rejections, which must not be retried.
			return messageIncludes(error, [
				'429',
				'rate limit',
				'too many requests',
				'number of times within',
				'per day',
				'daily limit',
				'monthly limit',
				'quota',
			]);
		},
		handler: async (error: Error) => ({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff' as const,
			headersRetryAfterMs: getRetryAfter(error),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status === 401 || status === 403) return true;
			return messageIncludes(error, [
				'unauthorized',
				'invalid api key',
				'invalid apikey',
				'api key is invalid',
				// The provider's own wording, observed on a rejected key.
				'api key not valid',
				'e555',
				'expired api key',
			]);
		},
		handler: async (error: Error, context) => {
			console.error(
				`[OCRSPACE:${context.operation}] Authentication failed - check your API key`,
			);
			return { maxRetries: 0 };
		},
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 400) return true;
			// A provider-level parse failure is a problem with the request or
			// the file, so retrying spends quota on a call that cannot succeed.
			if (getOcrExitCode(error) !== undefined) return true;
			return messageIncludes(error, [
				'bad request',
				'file size',
				'file type',
				'unable to recognize',
				'no file',
			]);
		},
		handler: async (error: Error, context) => {
			console.warn(
				`[OCRSPACE:${context.operation}] Request rejected: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			return status !== undefined && status >= 500;
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	TIMEOUT_ERROR: {
		match: (error: Error) =>
			messageIncludes(error, ['timeout', 'timed out', 'aborted']),
		handler: async () => ({
			maxRetries: 1,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async (error: Error, context) => {
			console.error(
				`[OCRSPACE:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
