export class CloudflareApiKeyAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: number,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'CloudflareApiKeyAPIError';
	}
}
