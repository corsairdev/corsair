import * as dotenv from 'dotenv';
import { OpenAPI } from '../core/OpenAPI';

dotenv.config();

beforeAll(() => {
	OpenAPI.BASE =
		process.env.LINEAR_BASE_URL || 'https://api.linear.app/graphql';
	OpenAPI.TOKEN = process.env.LINEAR_API_KEY;

	OpenAPI.HEADERS = {
		'Content-Type': 'application/json',
	};

	const timeout = process.env.TEST_TIMEOUT
		? parseInt(process.env.TEST_TIMEOUT, 10)
		: 30000;

	jest.setTimeout(timeout);

	console.log('Linear API Test Configuration:');
	console.log(`  Base URL: ${OpenAPI.BASE}`);
	console.log(
		`  Token: ${OpenAPI.TOKEN ? '***configured***' : 'NOT SET (tests may fail)'}`,
	);
	console.log(`  Timeout: ${timeout}ms`);
});

export function isTokenConfigured(): boolean {
	return !!process.env.LINEAR_API_KEY;
}

export function requireToken(): boolean {
	if (!isTokenConfigured()) {
		console.warn('LINEAR_API_KEY not set - skipping test');
		return true;
	}
	return false;
}

export function generateTestId(): string {
	return `test-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getWebhookSecret(): string {
	return process.env.LINEAR_WEBHOOK_SECRET || '';
}

export function getTestTeamId(): string {
	return process.env.LINEAR_TEST_TEAM_ID || '';
}
