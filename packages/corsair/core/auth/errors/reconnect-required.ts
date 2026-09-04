/**
 * Thrown when Hub reports that a connection needs to be (re)established — a
 * refresh token was rejected, or there's no usable connection for the tenant.
 * Carries the scoped connect link Hub minted (null when it couldn't, e.g. no
 * OAuth app is configured) so a UI can send the user straight to it.
 */
export class ReconnectRequiredError extends Error {
	connectUrl: string | null;
	plugin: string | null;
	tenantId: string | null;
	reason?: string;

	constructor(input: {
		message?: string;
		connectUrl: string | null;
		plugin: string | null;
		tenantId: string | null;
		reason?: string;
	}) {
		super(input.message ?? 'Reconnect required');
		Object.setPrototypeOf(this, new.target.prototype);
		this.name = 'ReconnectRequiredError';
		this.connectUrl = input.connectUrl;
		this.plugin = input.plugin;
		this.tenantId = input.tenantId;
		this.reason = input.reason;
	}
}
