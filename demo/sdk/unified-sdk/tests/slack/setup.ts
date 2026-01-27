import * as dotenv from 'dotenv';
import { OpenAPI } from '../../core/OpenAPI';

dotenv.config();

beforeAll(() => {
	OpenAPI.BASE = process.env.SLACK_BASE_URL || 'https://slack.com/api';
	OpenAPI.TOKEN = process.env.SLACK_BOT_TOKEN;

	OpenAPI.HEADERS = {
		Accept: 'application/json',
	};

	const timeout = process.env.TEST_TIMEOUT
		? parseInt(process.env.TEST_TIMEOUT, 10)
		: 30000;

	jest.setTimeout(timeout);

	console.log('Slack API Test Configuration:');
	console.log(`  Base URL: ${OpenAPI.BASE}`);
	console.log(
		`  Token: ${OpenAPI.TOKEN ? '***configured***' : 'NOT SET (tests may fail)'}`,
	);
	console.log(`  Timeout: ${timeout}ms`);
});

export function isTokenConfigured(): boolean {
	return !!process.env.SLACK_BOT_TOKEN;
}

export function requireToken(): boolean {
	if (!isTokenConfigured()) {
		console.warn('SLACK_BOT_TOKEN not set - skipping test');
		return true;
	}
	return false;
}

export function getTestChannel(): string {
	return process.env.TEST_SLACK_CHANNEL || 'C0123456789';
}

export function getTestUser(): string {
	return process.env.TEST_SLACK_USER || 'U0123456789';
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

export function isMissingScope(error: any): boolean {
	const errorCode = error?.body?.error || error?.message;
	return errorCode === 'missing_scope';
}

export function isNotAllowed(error: any): boolean {
	const errorCode = error?.body?.error || error?.message;
	return [
		'not_allowed_token_type',
		'missing_scope',
		'paid_teams_only',
		'not_allowed',
	].includes(errorCode);
}

export function skipOnMissingScope(error: any, scope?: string): boolean {
	if (isMissingScope(error)) {
		const neededScope = error?.body?.needed || scope || 'unknown';
		console.log(`Missing scope: ${neededScope} - skipping test`);
		return true;
	}
	return false;
}

export function skipOnNotAllowed(error: any): boolean {
	if (isNotAllowed(error)) {
		const errorCode = error?.body?.error || error?.message;
		console.log(`Not allowed: ${errorCode} - skipping test`);
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
