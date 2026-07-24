/**
 * Error thrown when an endpoint call is blocked pending user approval or by
 * permission policy. Endpoint binding enriches the message with an approval URL
 * when hub/manual config is available, then rethrows for callers to handle.
 */
export class PermissionRequiredError extends Error {
	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);
		this.name = 'PermissionRequiredError';
	}
}
