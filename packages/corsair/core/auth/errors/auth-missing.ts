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
	/** 'revoked' when the provider refused the stored refresh token (the user
	 * removed access, or the grant expired), so the connection existed and must
	 * be made again. Unset when there were never any credentials. */
	reason?: 'revoked';

	constructor(
		pluginId: string,
		authType: string,
		message?: string,
		link?: {
			connectUrl: string | null;
			tenantId: string | null;
			reason?: 'revoked';
		},
	) {
		super(message ?? `[auth-missing:${pluginId}:${authType}]`);
		Object.setPrototypeOf(this, new.target.prototype);
		this.name = 'AuthMissingError';
		this.pluginId = pluginId;
		this.authType = authType;
		this.connectUrl = link?.connectUrl ?? null;
		this.tenantId = link?.tenantId ?? null;
		if (link?.reason) this.reason = link.reason;
	}
}
