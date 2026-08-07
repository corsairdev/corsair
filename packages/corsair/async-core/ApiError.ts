import type { ApiRequestOptions } from './ApiRequestOptions';
import type { ApiResult } from './ApiResult';

const SENSITIVE_QUERY_PARAMS = ['api_key', 'key', 'token', 'appid'];

function redactUrl(urlStr: string): string {
	if (!urlStr) return urlStr;
	try {
		const hasProtocol = /^[a-z]+:\/\//i.test(urlStr);
		const base = hasProtocol ? undefined : 'http://localhost';
		const urlObj = new URL(urlStr, base);
		let changed = false;

		for (const key of urlObj.searchParams.keys()) {
			if (SENSITIVE_QUERY_PARAMS.includes(key.toLowerCase())) {
				urlObj.searchParams.set(key, '[REDACTED]');
				changed = true;
			}
		}

		if (changed) {
			return hasProtocol
				? urlObj.toString()
				: urlObj.pathname + urlObj.search + urlObj.hash;
		}
		return urlStr;
	} catch (e) {
		return urlStr;
	}
}

function redactRequest(request: ApiRequestOptions): ApiRequestOptions {
	if (!request.query) {
		return request;
	}

	const redactedQuery = { ...request.query };
	let changed = false;

	for (const key of Object.keys(redactedQuery)) {
		if (SENSITIVE_QUERY_PARAMS.includes(key.toLowerCase())) {
			redactedQuery[key] = '[REDACTED]';
			changed = true;
		}
	}

	if (changed) {
		return {
			...request,
			query: redactedQuery,
		};
	}

	return request;
}

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
		this.url = redactUrl(response.url);
		this.status = response.status;
		this.statusText = response.statusText;
		this.body = response.body;
		this.request = redactRequest(request);
		this.retryAfter = rateLimitInfo?.retryAfter;
		this.rateLimitReset = rateLimitInfo?.rateLimitReset;
		this.rateLimitRemaining = rateLimitInfo?.rateLimitRemaining;
		this.rateLimitLimit = rateLimitInfo?.rateLimitLimit;
	}

	public isRateLimitError(): boolean {
		return this.status === 429;
	}
}
