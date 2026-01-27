import * as dotenv from 'dotenv';
import { OpenAPI } from '../../core/OpenAPI';

declare global {
	var getTestOwner: () => string;
	var getTestUsername: () => string;
	var getTestRepo: () => string;
}

// Load environment variables from .env file
dotenv.config();

// Configure OpenAPI client with GitHub token
beforeAll(() => {
	// Set base URL for GitHub API
	OpenAPI.BASE = process.env.GITHUB_BASE_URL || 'https://api.github.com';

	// Set authentication token
	OpenAPI.TOKEN = process.env.GITHUB_TOKEN;

	// Set custom headers for GitHub API
	OpenAPI.HEADERS = {
		Accept: 'application/vnd.github+json',
		'X-GitHub-Api-Version': '2022-11-28',
	};

	// Set timeout
	const timeout = process.env.TEST_TIMEOUT
		? parseInt(process.env.TEST_TIMEOUT, 10)
		: 30000;

	// Update jest timeout
	jest.setTimeout(timeout);

	// Log configuration (without token for security)
	console.log('GitHub API Test Configuration:');
	console.log(`  Base URL: ${OpenAPI.BASE}`);
	console.log(
		`  Token: ${OpenAPI.TOKEN ? '***configured***' : 'NOT SET (tests may fail)'}`,
	);
	console.log(`  Test Repo: ${getTestOwner()}/${getTestRepo()}`);
	console.log(`  Timeout: ${timeout}ms`);
});

// Helper function to check if token is configured
export function isTokenConfigured(): boolean {
	return !!process.env.GITHUB_TOKEN;
}

// Helper function to skip tests if no token is configured
export function requireToken(): boolean {
	if (!isTokenConfigured()) {
		console.warn('GITHUB_TOKEN not set - skipping test');
		return true;
	}
	return false;
}

// Helper function to get test owner (username)
export function getTestOwner(): string {
	return process.env.TEST_GITHUB_USERNAME || 'mukul7661';
}

// Alias for backwards compatibility
export function getTestUsername(): string {
	return getTestOwner();
}

// Helper function to get test repo
export function getTestRepo(): string {
	return process.env.TEST_GITHUB_REPO || 'react-boilerplate';
}

// Helper to wait for rate limit reset if needed
export async function handleRateLimit(error: any): Promise<void> {
	const { ApiError } = await import('../../core/ApiError');
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

// Helper to generate unique test identifiers
export function generateTestId(): string {
	return `test-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

// Helper to wait (for rate limiting)
export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
