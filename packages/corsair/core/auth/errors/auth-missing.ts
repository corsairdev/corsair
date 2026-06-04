/**
 * Error thrown when a plugin endpoint is called but the user has not authenticated
 * with the required OAuth provider. Corsair intercepts this error and returns a
 * connect link the agent can present to the user.
 */
export class AuthMissingError extends Error {
	pluginId: string;

	constructor(pluginId: string, message?: string) {
		super(message ?? `[auth-missing:${pluginId}]`);
		Object.setPrototypeOf(this, new.target.prototype);
		this.name = 'AuthMissingError';
		this.pluginId = pluginId;
	}
}
