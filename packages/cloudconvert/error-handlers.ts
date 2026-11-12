import type { CorsairErrorHandler } from 'corsair/core';
import { asRecord } from 'corsair/core';
import { ApiError } from 'corsair/http';

/** Read the documented CloudConvert error code when the response body is an object. */
function codeOf(error: Error): string | undefined {
	if (!(error instanceof ApiError)) return undefined;
	const record = asRecord(error.body);
	const code = record?.code;
	return typeof code === 'string' ? code : undefined;
}

// CloudConvert documents INVALID_DATA, TOO_MANY_REQUESTS and Retry-After at
// https://cloudconvert.com/docs/getting-started/introduction#errors-and-rate-limiting.
export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError && error.status === 429) ||
			codeOf(error) === 'TOO_MANY_REQUESTS',
		// corsair/http owns 429 retries and exhausts its bounded Retry-After budget
		// before this handler runs; do not start a second retry loop here.
		handler: async () => ({ maxRetries: 0 }),
	},
	AUTH_ERROR: {
		match: (error: Error) =>
			error instanceof ApiError &&
			(error.status === 401 || error.status === 403),
		handler: async () => ({ maxRetries: 0 }),
	},
	NOT_FOUND_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status === 404,
		handler: async () => ({ maxRetries: 0 }),
	},
	BAD_REQUEST_ERROR: {
		match: (error: Error) =>
			(error instanceof ApiError &&
				(error.status === 400 || error.status === 422)) ||
			codeOf(error) === 'INVALID_DATA' ||
			error.name === 'ZodError',
		handler: async () => ({ maxRetries: 0 }),
	},
	SERVICE_ERROR: {
		match: (error: Error) => error instanceof ApiError && error.status >= 500,
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
