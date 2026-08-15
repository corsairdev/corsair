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
 * `Content-Type` header is present, so the empty-body statuses (401, 404
 * unknown-route, 405, 429) all arrive here with `error.body === undefined`.
 * Handlers below match on `error.status` for that reason rather than reading
 * the body, and supply their own message where the provider supplies none.
 */
export const errorHandlers = {
	/**
	 * Measured live: the quota is exactly 100 requests over a rolling window.
	 * `Retry-After` is authoritative (confirmed: honouring it produced an
	 * immediate 200 both times it was measured) and `ApiError.retryAfter` is
	 * already in milliseconds, parsed from the same header this plugin's rate
	 * limit config declares.
	 */
	RATE_LIMIT_ERROR: {
		match: (error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			return error.message.toLowerCase().includes('too many requests');
		},
		handler: async (error, context) => {
			const retryAfterMs =
				error instanceof ApiError ? error.retryAfter : undefined;
			return {
				maxRetries: isNonIdempotent(context.operation) ? 0 : 3,
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
			const body = error instanceof ApiError ? error.body : undefined;
			const message =
				body && typeof body === 'object' && 'message' in body
					? String((body as { message?: unknown }).message)
					: error.message;
			console.warn(`[ALTOVIZ:${context.operation}] Conflict: ${message}`);
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
			const body = error instanceof ApiError ? error.body : undefined;
			const message =
				body && typeof body === 'object' && 'message' in body
					? String((body as { message?: unknown }).message)
					: 'not found';
			console.warn(`[ALTOVIZ:${context.operation}] ${message}`);
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
			const body = error instanceof ApiError ? error.body : undefined;
			const message =
				body && typeof body === 'object' && 'message' in body
					? String((body as { message?: unknown }).message)
					: error.message;
			console.warn(
				`[ALTOVIZ:${context.operation}] Invalid request: ${message}`,
			);
			return { maxRetries: 0 };
		},
	},
	/**
	 * A server fault. Retried with backoff for reads and idempotent writes;
	 * never for a non-idempotent operation, where a lost response and a
	 * genuine failure look identical from the caller's side.
	 */
	SERVER_ERROR: {
		match: (error) =>
			error instanceof ApiError &&
			error.status !== undefined &&
			error.status >= 500,
		handler: async (error, context) => {
			console.warn(
				`[ALTOVIZ:${context.operation}] Server error (${
					error instanceof ApiError ? error.status : 'unknown'
				}): ${error.message}`,
			);
			return { maxRetries: isNonIdempotent(context.operation) ? 0 : 2 };
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
				`[ALTOVIZ:${context.operation}] Network error: ${error.message}`,
			);
			return { maxRetries: isNonIdempotent(context.operation) ? 0 : 2 };
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
