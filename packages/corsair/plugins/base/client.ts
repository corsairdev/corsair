/**
 * Base client utilities for plugin API clients
 */

/**
 * Base API error class for plugin clients
 * Plugins can extend this for their specific error types
 */
export class BaseAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
		public readonly statusCode?: number,
	) {
		super(message);
		this.name = 'BaseAPIError';
	}
}

