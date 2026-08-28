import type { CorsairErrorHandler } from 'corsair/core';
import type { MailboxLayerAPIError } from './client';

function getStatus(error: Error): number | undefined {
	return (error as Partial<MailboxLayerAPIError>).status;
}

function getApiCode(error: Error): number | undefined {
	return (error as Partial<MailboxLayerAPIError>).apiCode;
}

/**
 * Error handlers for the mailboxlayer plugin.
 *
 * mailboxlayer returns HTTP 200 for every documented failure, with the real
 * error encoded in the JSON body as `{ success: false, error: { code, type,
 * info } }` (see client.ts, which throws MailboxLayerAPIError with `apiCode`
 * set from that body). HTTP-level status handling (429/5xx) is kept as a
 * fallback for transport-level failures the body-level codes don't cover.
 *
 * mailboxlayer error codes:
 * - 101 invalid_access_key: API key is missing/invalid
 * - 103 invalid_api_function: wrong endpoint called
 * - 104 usage_limit_reached: monthly quota exhausted
 * - 105 https_access_restricted: HTTPS requires a paid plan
 * - 106 inactive_user: account subscription inactive
 * - 210 no_email_address_supplied: `email` param missing
 * - 211 invalid_email_address: `email` param malformed
 */
export const errorHandlers = {
	AUTH_ERROR: {
		match: (error: Error) => {
			const code = getApiCode(error);
			if (code === 101 || code === 106) return true;
			if (getStatus(error) === 401) return true;
			const msg = error.message.toLowerCase();
			return (
				msg.includes('invalid_access_key') || msg.includes('inactive_user')
			);
		},
		handler: async () => {
			console.log(
				'[MAILBOXLAYER] Authentication failed — check that the access_key is valid and the account is active.',
			);
			return { maxRetries: 0 };
		},
	},
	QUOTA_ERROR: {
		match: (error: Error) => getApiCode(error) === 104,
		handler: async () => {
			console.warn(
				'[MAILBOXLAYER] Request rejected — the monthly usage quota for this plan has been exhausted.',
			);
			return { maxRetries: 0 };
		},
	},
	HTTPS_RESTRICTED_ERROR: {
		match: (error: Error) => getApiCode(error) === 105,
		handler: async () => {
			console.warn(
				'[MAILBOXLAYER] Request rejected — HTTPS access requires a paid mailboxlayer plan.',
			);
			return { maxRetries: 0 };
		},
	},
	VALIDATION_ERROR: {
		match: (error: Error) => {
			const code = getApiCode(error);
			return code === 103 || code === 210 || code === 211;
		},
		handler: async () => {
			console.warn(
				'[MAILBOXLAYER] Request rejected — the email parameter is missing or malformed.',
			);
			return { maxRetries: 0 };
		},
	},
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (getStatus(error) === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('429') || msg.includes('rate limit');
		},
		handler: async (error: Error) => {
			return {
				maxRetries: 3,
				retryStrategy: 'exponential_backoff' as const,
				headersRetryAfterMs: (error as Partial<MailboxLayerAPIError>)
					.retryAfter,
			};
		},
	},
	SERVER_ERROR: {
		match: (error: Error) => {
			const status = getStatus(error);
			if (status !== undefined && status >= 500) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('500') || msg.includes('internal server error');
		},
		handler: async () => ({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff' as const,
		}),
	},
	DEFAULT: {
		match: () => true,
		handler: async (error: Error) => {
			console.error(`[MAILBOXLAYER] Unhandled error: ${error.message}`);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
