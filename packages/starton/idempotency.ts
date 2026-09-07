/**
 * Which Starton operations are safe to replay automatically.
 *
 * Starton's REST API exposes no idempotency key (there is no `Idempotency-Key`
 * header or equivalent anywhere in the official OpenAPI specification), so a
 * replayed write is a genuinely new write. For the operations that broadcast a
 * blockchain transaction that means a retry can deploy a second contract or
 * execute a contract call — and transfer value — a second time.
 *
 * Corsair can replay a failed operation at two independent layers:
 *
 *  1. `corsair/http`'s `request()` retries internally, but *only* when the
 *     response is a rate limit (HTTP 429). See `async-core/request.ts`.
 *  2. The endpoint binder re-invokes the entire endpoint function — issuing a
 *     brand new HTTP request — whenever this plugin's error handler returns
 *     `maxRetries > 0`. See `core/endpoints/bind.ts`.
 *
 * Both layers are disabled for the operations listed here. A 5xx or a dropped
 * connection is *ambiguous*: Starton may already have accepted and broadcast
 * the transaction before the response failed, so replaying is unsafe even
 * though the error itself looks transient.
 *
 * https://github.com/starton-io/starton-openapi
 */
export const NON_IDEMPOTENT_OPERATIONS = new Set([
	// POST /v3/kms/wallet — provisions a new KMS wallet each time it succeeds.
	'wallet.create',
	// POST /v3/smart-contract/from-template — deploys a contract on-chain.
	'smartContract.deployFromTemplate',
	// POST /v3/smart-contract/{network}/{address}/call — broadcasts a
	// state-changing transaction and can transfer value.
	'smartContract.call',
]);

/**
 * True when replaying `operation` could produce a duplicate side effect.
 *
 * `wallet.list`, `transaction.get` and `smartContract.read` are all safe: the
 * first two are GETs, and `read` is a POST only because Starton takes the
 * function arguments in a body — it never broadcasts a transaction.
 */
export function isNonIdempotentOperation(operation: string): boolean {
	return NON_IDEMPOTENT_OPERATIONS.has(operation);
}
