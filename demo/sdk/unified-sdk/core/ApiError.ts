import type { ApiRequestOptions } from './ApiRequestOptions';
import type { ApiResult } from './ApiResult';

export class ApiError extends Error {
	public readonly url: string;
	public readonly status: number;
	public readonly statusText: string;
	public readonly body: any;
	public readonly request: ApiRequestOptions;
	public readonly retryAfter?: number;
	public readonly rateLimitReset?: number;
	public readonly rateLimitRemaining?: number;
	public readonly rateLimitLimit?: number;

	constructor(
		request: ApiRequestOptions,
		response: ApiResult,
		message: string,
		rateLimitInfo?: {
			retryAfter?: number;
			rateLimitReset?: number;
			rateLimitRemaining?: number;
			rateLimitLimit?: number;
		},
	) {
		super(message);

		this.name = 'ApiError';
		this.url = response.url;
		this.status = response.status;
		this.statusText = response.statusText;
		this.body = response.body;
		this.request = request;
		this.retryAfter = rateLimitInfo?.retryAfter;
		this.rateLimitReset = rateLimitInfo?.rateLimitReset;
		this.rateLimitRemaining = rateLimitInfo?.rateLimitRemaining;
		this.rateLimitLimit = rateLimitInfo?.rateLimitLimit;
	}

	public isRateLimitError(): boolean {
		return this.status === 429 || (this.status === 403 && this.isGitHubRateLimit());
	}

	private isGitHubRateLimit(): boolean {
		return (
			typeof this.body === 'object' &&
			this.body !== null &&
			typeof this.body.message === 'string' &&
			this.body.message.toLowerCase().includes('rate limit')
		);
	}
}

