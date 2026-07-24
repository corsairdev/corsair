/**
 * Error thrown when a plugin endpoint is called but the required auth credentials
 * are missing. Endpoint binding enriches the message with a connect link when hub
 * or manual config is available, then rethrows this error for callers to handle.
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
