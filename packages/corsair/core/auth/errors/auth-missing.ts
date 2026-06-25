/**
 * Error thrown when a plugin endpoint is called but the required auth credentials
 * are missing. Corsair intercepts this error and, for OAuth auth types, returns a
 * connect link the agent can present to the user.
 */
export class AuthMissingError extends Error {
	pluginId: string;
	authType: string;

	constructor(pluginId: string, authType: string, message?: string) {
		super(message ?? `[auth-missing:${pluginId}:${authType}]`);
		Object.setPrototypeOf(this, new.target.prototype);
		this.name = 'AuthMissingError';
		this.pluginId = pluginId;
		this.authType = authType;
	}
}
