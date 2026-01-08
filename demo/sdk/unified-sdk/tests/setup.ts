import { OpenAPI } from '../core/OpenAPI';
import { ApiError } from '../core/ApiError';
import { GITHUB_RATE_LIMIT_CONFIG } from '../core/rate-limit';

export function isTokenConfigured(tokenEnvVar: string): boolean {
	return !!process.env[tokenEnvVar];
}

export function requireToken(tokenEnvVar: string): boolean {
	if (!isTokenConfigured(tokenEnvVar)) {
		console.warn(`${tokenEnvVar} not set - skipping test`);
		return true;
	}
	return false;
}

export async function handleRateLimit(error: any): Promise<void> {
	if (error instanceof ApiError && error.isRateLimitError()) {
		const retryAfter = error.retryAfter;
		const resetTime = error.rateLimitReset;
		
		if (retryAfter) {
			console.warn(`Rate limit exceeded. Retry after: ${retryAfter}ms`);
		} else if (resetTime) {
			const resetDate = new Date(resetTime);
			console.warn(`Rate limit exceeded. Reset at: ${resetDate.toISOString()}`);
		}
		
		throw new Error(
			'Rate limit exceeded. Please wait before running tests again.',
		);
	}
	throw error;
}

export function generateTestId(): string {
	return `test-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function configureOpenAPI(
	baseUrl: string,
	token?: string,
	headers?: Record<string, string>,
	sdkName?: string,
): void {
	OpenAPI.BASE = baseUrl;
	OpenAPI.TOKEN = token;
	OpenAPI.HEADERS = headers;
	if (sdkName) {
		(OpenAPI as any).SDK_NAME = sdkName;
	}
}

