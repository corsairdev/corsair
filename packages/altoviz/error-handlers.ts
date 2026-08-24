import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

/**
 * Whether replaying an operation could duplicate or corrupt data.
 *
 * Corsair re-invokes the whole endpoint when a handler asks for a retry. Every
 * write here is a POST that creates a document or record (a replayed
 * `saleinvoices.create` is a duplicate invoice, not a retry) or a PUT that -
 * because Altoviz's PUT clears every field the body omits - is not safe to
 * blind-replay if the first attempt's response was lost. Every destructive
 * operation deletes something the provider will not undo.
 *
 * Listed explicitly per operation path rather than by name pattern, so a
 * future operation is not silently included or excluded. `endpoints.test.ts`
 * asserts this set is exactly the set of non-read operations in the registry.
 */
export const NON_IDEMPOTENT_OPERATIONS = new Set<string>([
	'customers.create',
	'customers.update',
	'customers.delete',
	'customerFamilies.create',
	'customerFamilies.delete',
	'suppliers.update',
	'suppliers.delete',
	'contacts.create',
	'colleagues.update',
	'colleagues.delete',
	'webhookSubscriptions.register',
	'webhookSubscriptions.unregister',
	'products.create',
	'products.delete',
	'productFamilies.create',
	'productFamilies.delete',
	'saleInvoices.create',
	'saleInvoices.delete',
	'saleCredits.create',
	'saleCredits.update',
	'saleCredits.delete',
	'saleQuotes.delete',
	'receipts.create',
	'receipts.update',
	'receipts.delete',
	'purchaseInvoices.upload',
]);

export const isNonIdempotent = (operation: string): boolean =>
	NON_IDEMPOTENT_OPERATIONS.has(operation);

function providerMessage(error: Error, fallback: string): string {
	const body = error instanceof ApiError ? error.body : undefined;
	if (
		body &&
		typeof body === 'object' &&
		'message' in body &&
		(body as { message?: unknown }).message != null
	) {
		return String((body as { message: unknown }).message);
	}
	return fallback;
}

/**
 * Altoviz's error surface, captured live rather than from documentation:
 *
 *   400  three shapes - {errors:[...],message:"Validation failed"},
 *        {errors:[],message:"<specific>"}, {errors:null,message:"<French>"}
 *   401  a missing or invalid key - EMPTY body, zero bytes, no content-type
 *   404  a known route with an absent record (message), OR an unknown route
 *        (empty body), OR RFC 9110 ProblemDetails on one route family
 *   405  wrong method on a real route - empty body
 *   409  a delete refused because the record is still in use - French message
 *   429  quota exhausted - plain text, no content-type, with Retry-After
 *   500  two shapes - {errors:[...],message:"Internal error"} and
 *        {errors:[],message:"An error occured"} (the provider's spelling)
 *
 * `corsair/async-core`'s `getResponseBody` only parses a body when a
 * `Content-Type` header is present, so the four empty-body statuses (401, 404
 * unknown-route, 405, 429) all arrive here with `error.body === undefined`.
 * Handlers below match on `error.status` for that reason rather than reading
 * the body, and supply their own message where the provider supplies none.
 */
export const errorHandlers = {
	/**
	 * Measured live: the quota is exactly 100 requests over a rolling window.
	 * Bind retries are never requested: corsair/core awaits a successful retry
	 * then still throws the original error. GET 429s retry in the client.
	 */
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			return error.message.toLowerCase().includes('too many requests');
		},
		handler: async (error, context) => {
			// corsair/http stored header*1000 assuming seconds; Altoviz sent ms.
			const retryAfterMs =
				error instanceof ApiError && error.retryAfter != null
					? error.retryAfter / 1000
					: undefined;
			return {
				maxRetries: 0,
				headersRetryAfterMs: retryAfterMs,
			};
		},
	},
	/**
	 * A missing or invalid X-API-KEY answers 401 with a completely empty body -
	 * confirmed for a blank header and for a well-formed key that does not
	 * exist. There is no body to read, so this is matched on status alone.
	 */
	AUTH_ERROR: {
		match: (error) => error instanceof ApiError && error.status === 401,
		handler: async (error, context) => {
			console.warn(
				`[ALTOVIZ:${context.operation}] Authentication failed - the X-API-KEY header is missing or invalid`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * A delete refused because the record is still referenced - a customer
	 * family or product family that still has members. Not a transient
	 * failure: retrying without first removing the members fails identically.
	 */
	CONFLICT_ERROR: {
		match: (error) => error instanceof ApiError && error.status === 409,
		handler: async (error, context) => {
			const status = error instanceof ApiError ? error.status : undefined;
			console.warn(
				`[ALTOVIZ:${context.operation}] ${status} Conflict: ${providerMessage(error, error.message)}`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * A known route with an absent record, or an unknown route entirely (empty
	 * body). Either way, retrying the same request cannot succeed.
	 */
	NOT_FOUND_ERROR: {
		match: (error) => error instanceof ApiError && error.status === 404,
		handler: async (error, context) => {
			const status = error instanceof ApiError ? error.status : undefined;
			console.warn(
				`[ALTOVIZ:${context.operation}] ${status}: ${providerMessage(error, 'not found')}`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * Wrong HTTP method on a real route - a plugin bug, not a transient state.
	 */
	METHOD_ERROR: {
		match: (error) => error instanceof ApiError && error.status === 405,
		handler: async (error, context) => {
			console.warn(
				`[ALTOVIZ:${context.operation}] Method not allowed on this route`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * Validation failures, including the numbering-sequence precondition
	 * ("La numerotation des ... n'a pas ete initialisee") and the nested
	 * reference-by-id rejection ("La TVA n'existe pas."). Message language is
	 * inconsistent - English for structural validation, French for business
	 * rules - so neither is matched on text, only on status.
	 */
	VALIDATION_ERROR: {
		match: (error) => error instanceof ApiError && error.status === 400,
		handler: async (error, context) => {
			const status = error instanceof ApiError ? error.status : undefined;
			console.warn(
				`[ALTOVIZ:${context.operation}] ${status} Invalid request: ${providerMessage(error, error.message)}`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * A server fault. Bind retries are never requested: corsair/core awaits a
	 * successful retry then still throws the original error.
	 */
	SERVER_ERROR: {
		match: (error) =>
			error instanceof ApiError &&
			error.status !== undefined &&
			error.status >= 500,
		handler: async (error, context) => {
			const status = error instanceof ApiError ? error.status : 'unknown';
			console.warn(
				`[ALTOVIZ:${context.operation}] ${status}: ${providerMessage(error, error.message)}`,
			);
			return { maxRetries: 0 };
		},
	},
	NETWORK_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status !== undefined) return false;
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
				`[ALTOVIZ:${context.operation}] Network error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
	DEFAULT: {
		match: () => true,
		handler: async (error, context) => {
			console.error(
				`[ALTOVIZ:${context.operation}] Unhandled error: ${error.message}`,
			);
			return { maxRetries: 0 };
		},
	},
} satisfies CorsairErrorHandler;
