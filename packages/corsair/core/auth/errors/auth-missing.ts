/**
 * Error thrown when a plugin endpoint is called but the required auth
 * credentials are missing.
 */
export class AuthMissingError extends Error {
	pluginId: string;
	authType: string;
	/** Scoped connect link when one could be minted — lets a UI open Connect
	 * without parsing the message. Null when no link was available. */
	connectUrl: string | null;
	tenantId: string | null;

	constructor(
		pluginId: string,
		authType: string,
		message?: string,
		link?: { connectUrl: string | null; tenantId: string | null },
	) {
		super(message ?? `[auth-missing:${pluginId}:${authType}]`);
		Object.setPrototypeOf(this, new.target.prototype);
		this.name = 'AuthMissingError';
		this.pluginId = pluginId;
		this.authType = authType;
		this.connectUrl = link?.connectUrl ?? null;
		this.tenantId = link?.tenantId ?? null;
	}
}
