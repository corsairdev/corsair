export type PermissionRequiredReason =
	| 'denied'
	| 'policy'
	| 'timeout'
	| 'pending';

/**
 * Thrown when an endpoint call is blocked by permission policy or pending user
 * approval. `reason` discriminates the cause so non-TS callers over `/call` can
 * branch — a hard deny versus an approval a human still has to grant.
 */
export class PermissionRequiredError extends Error {
	readonly reason: PermissionRequiredReason;

	constructor(message: string, reason: PermissionRequiredReason = 'pending') {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);
		this.name = 'PermissionRequiredError';
		this.reason = reason;
	}
}
