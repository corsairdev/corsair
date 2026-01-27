import * as dotenv from 'dotenv';
import { OpenAPI } from '../core/OpenAPI';

dotenv.config();

beforeAll(() => {
	OpenAPI.BASE = process.env.HUBSPOT_BASE_URL || 'https://api.hubapi.com';
	OpenAPI.TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;

	OpenAPI.HEADERS = {
		Accept: 'application/json',
	};

	const timeout = process.env.TEST_TIMEOUT
		? parseInt(process.env.TEST_TIMEOUT, 10)
		: 30000;

	jest.setTimeout(timeout);

	console.log('HubSpot API Test Configuration:');
	console.log(`  Base URL: ${OpenAPI.BASE}`);
	console.log(
		`  Token: ${OpenAPI.TOKEN ? '***configured***' : 'NOT SET (tests may fail)'}`,
	);
	console.log(`  Timeout: ${timeout}ms`);
});

export function isTokenConfigured(): boolean {
	return !!process.env.HUBSPOT_ACCESS_TOKEN;
}

export function requireToken(): boolean {
	if (!isTokenConfigured()) {
		console.warn('HUBSPOT_ACCESS_TOKEN not set - skipping test');
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

