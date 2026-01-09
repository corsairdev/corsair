import type { ApiResult } from './ApiResult';

export interface RateLimitConfig {
	enabled: boolean;
	maxRetries: number;
	initialRetryDelay: number;
	backoffMultiplier: number;
	headerNames: {
		retryAfter?: string;
		resetTime?: string;
		remaining?: string;
		limit?: string;
	};
	isRateLimitError?: (status: number, body: any) => boolean;
}

export interface RateLimitInfo {
	retryAfter?: number;
	rateLimitReset?: number;
	rateLimitRemaining?: number;
	rateLimitLimit?: number;
}

export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'retry-after',
		resetTime: 'x-ratelimit-reset',
		remaining: 'x-ratelimit-remaining',
		limit: 'x-ratelimit-limit',
	},
};


export function extractRateLimitInfo(
	response: Response,
	config: RateLimitConfig,
): RateLimitInfo {
	const info: RateLimitInfo = {};

	if (config.headerNames.retryAfter) {
		const retryAfter = response.headers.get(config.headerNames.retryAfter);
		if (retryAfter) {
			const seconds = parseInt(retryAfter, 10);
			if (!isNaN(seconds)) {
				info.retryAfter = seconds * 1000;
			}
		}
	}

	if (config.headerNames.resetTime) {
		const resetTime = response.headers.get(config.headerNames.resetTime);
		if (resetTime) {
			const timestamp = parseInt(resetTime, 10);
			if (!isNaN(timestamp)) {
				const now = Date.now();
				const resetMs = timestamp > 1000000000000 ? timestamp : timestamp * 1000;
				info.rateLimitReset = resetMs;
				if (resetMs > now) {
					info.retryAfter = resetMs - now;
				}
			}
		}
	}

	if (config.headerNames.remaining) {
		const remaining = response.headers.get(config.headerNames.remaining);
		if (remaining) {
			const value = parseInt(remaining, 10);
			if (!isNaN(value)) {
				info.rateLimitRemaining = value;
			}
		}
	}

	if (config.headerNames.limit) {
		const limit = response.headers.get(config.headerNames.limit);
		if (limit) {
			const value = parseInt(limit, 10);
			if (!isNaN(value)) {
				info.rateLimitLimit = value;
			}
		}
	}

	return info;
}

export function isRateLimitError(
	status: number,
	body: any,
	config: RateLimitConfig,
): boolean {
	if (!config.enabled) {
		return false;
	}

	if (status === 429) {
		return true;
	}

	if (config.isRateLimitError) {
		return config.isRateLimitError(status, body);
	}

	return false;
}

export function calculateRetryDelay(
	attempt: number,
	rateLimitInfo: RateLimitInfo,
	config: RateLimitConfig,
): number {
	if (rateLimitInfo.retryAfter) {
		return rateLimitInfo.retryAfter;
	}

	const delay =
		config.initialRetryDelay *
		Math.pow(config.backoffMultiplier, attempt - 1);

	return Math.min(delay, 60000);
}

export async function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

