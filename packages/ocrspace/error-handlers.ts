import type { CorsairErrorHandler } from 'corsair/core';
import type { OcrSpaceAPIError } from './client';

// Handlers receive the framework's base Error type. OcrSpaceAPIError adds these
// fields, so they are read through a Partial rather than an instanceof check.
function getStatus(error: Error): number | undefined {
	return (error as Partial<OcrSpaceAPIError>).status;
}

function getOcrExitCode(error: Error): number | undefined {
	return (error as Partial<OcrSpaceAPIError>).ocrExitCode;
}

function getBody(error: Error): unknown {
	return (error as Partial<OcrSpaceAPIError>).body;
}

function bodyText(body: unknown): string {
	if (body == null) {
		return '';
	}
	if (typeof body === 'string') {
		return body;
	}
	try {
		return JSON.stringify(body);
	} catch {
		return String(body);
	}
}

// OCR.space reports quota and key problems inside a HTTP 200 body, and
// throttle details on 403 responses live on `body` while `message` is just
// "Forbidden". Search both.
function messageIncludes(error: Error, needles: string[]): boolean {
	const haystack = `${error.message} ${bodyText(getBody(error))}`.toLowerCase();
	return needles.some((needle) => haystack.includes(needle));
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
			const status = getStatus(error);
			// Provider-confirmed: short-window throttling is HTTP 403, not 429.
			// Invalid keys are a HTTP 200 body error (E555 / "API key not valid"),
			// so 403 is not an auth failure on this API.
			if (status === 429 || status === 403) return true;
			return messageIncludes(error, [
				'rate limit',
				'too many requests',
				'number of times within',
			]);
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 401) return true;
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
				'conversion limit',
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
