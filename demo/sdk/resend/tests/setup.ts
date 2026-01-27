import * as dotenv from 'dotenv';
import { OpenAPI } from '../core/OpenAPI';

dotenv.config();

beforeAll(() => {
	OpenAPI.BASE = process.env.RESEND_API_BASE || 'https://api.resend.com';
	OpenAPI.TOKEN = process.env.RESEND_API_KEY;

	OpenAPI.HEADERS = {
		Accept: 'application/json',
	};

	const timeout = process.env.TEST_TIMEOUT
		? parseInt(process.env.TEST_TIMEOUT, 10)
		: 30000;

	jest.setTimeout(timeout);

	console.log('Resend API Test Configuration:');
	console.log(`  Base URL: ${OpenAPI.BASE}`);
	console.log(
		`  API Key: ${OpenAPI.TOKEN ? '***configured***' : 'NOT SET (tests may fail)'}`,
	);
	console.log(`  Timeout: ${timeout}ms`);
});

export function isTokenConfigured(): boolean {
	return !!process.env.RESEND_API_KEY;
}

export function requireToken(): boolean {
	if (!isTokenConfigured()) {
		console.warn('RESEND_API_KEY not set - skipping test');
		return true;
	}
	return false;
}

export async function handleRateLimit(error: any): Promise<void> {
	if (error?.status === 429) {
		const retryAfter = error.headers?.['retry-after'];
		if (retryAfter) {
			console.warn(`Rate limit exceeded. Retry after: ${retryAfter}s`);
		}
		console.warn('Skipping test due to rate limit');
		return;
	}
	throw error;
}

export function generateTestId(): string {
	return `test-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
