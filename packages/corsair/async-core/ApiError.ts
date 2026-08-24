import type { ApiRequestOptions } from './ApiRequestOptions';
import type { ApiResult } from './ApiResult';

const SENSITIVE_QUERY_PARAMS = new Set(['api_key', 'key', 'token', 'appid']);

function isSensitiveQueryParam(key: string): boolean {
	let normalized = key;
	try {
		normalized = decodeURIComponent(key);
	} catch {
		normalized = key;
	}
	return SENSITIVE_QUERY_PARAMS.has(normalized.toLowerCase());
}

function redactQueryStringFallback(urlStr: string): string {
	const queryIndex = urlStr.indexOf('?');
	if (queryIndex === -1) {
		return urlStr;
	}

	const hashIndex = urlStr.indexOf('#', queryIndex);
	const before = urlStr.slice(0, queryIndex + 1);
	const query =
		hashIndex === -1
			? urlStr.slice(queryIndex + 1)
			: urlStr.slice(queryIndex + 1, hashIndex);
	const after = hashIndex === -1 ? '' : urlStr.slice(hashIndex);

	let changed = false;
	const redacted = query
		.split('&')
		.map((pair) => {
			if (!pair) return pair;
			const eq = pair.indexOf('=');
			const key = eq === -1 ? pair : pair.slice(0, eq);
			if (!isSensitiveQueryParam(key)) {
				return pair;
			}
			changed = true;
			return `${key}=[REDACTED]`;
		})
		.join('&');

	return changed ? before + redacted + after : urlStr;
}

function redactUrl(urlStr: string): string {
	if (!urlStr) return urlStr;
	try {
		const hasProtocol = /^[a-z]+:\/\//i.test(urlStr);
		const base = hasProtocol ? undefined : 'http://localhost';
		const urlObj = new URL(urlStr, base);
		let changed = false;

		for (const key of [...urlObj.searchParams.keys()]) {
			if (isSensitiveQueryParam(key)) {
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
	} catch {
		return redactQueryStringFallback(urlStr);
	}
}

function redactRequest(request: ApiRequestOptions): ApiRequestOptions {
	const redactedUrl = redactUrl(request.url);
	let queryChanged = false;
	let redactedQuery = request.query;

	if (request.query) {
		redactedQuery = { ...request.query };
		for (const key of Object.keys(redactedQuery)) {
			if (isSensitiveQueryParam(key)) {
				redactedQuery[key] = '[REDACTED]';
				queryChanged = true;
			}
		}
	}

	if (!queryChanged && redactedUrl === request.url) {
		return request;
	}

	return {
		...request,
		url: redactedUrl,
		...(queryChanged ? { query: redactedQuery } : {}),
	};
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
