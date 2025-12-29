import * as dotenv from 'dotenv';
import { OpenAPI } from '../core/OpenAPI';

dotenv.config();

beforeAll(() => {
    OpenAPI.BASE = process.env.GMAIL_BASE_URL || 'https://gmail.googleapis.com';
    OpenAPI.TOKEN = process.env.GMAIL_ACCESS_TOKEN;

    OpenAPI.HEADERS = {
        'Accept': 'application/json',
    };

    const timeout = process.env.TEST_TIMEOUT
        ? parseInt(process.env.TEST_TIMEOUT, 10)
        : 30000;

    jest.setTimeout(timeout);

    console.log('Gmail API Test Configuration:');
    console.log(`  Base URL: ${OpenAPI.BASE}`);
    console.log(`  Token: ${OpenAPI.TOKEN ? '***configured***' : 'NOT SET (tests may fail)'}`);
    console.log(`  User ID: ${getTestUserId()}`);
    console.log(`  Timeout: ${timeout}ms`);
});

export function isTokenConfigured(): boolean {
    return !!process.env.GMAIL_ACCESS_TOKEN;
}

export function requireToken(): boolean {
    if (!isTokenConfigured()) {
        console.warn('GMAIL_ACCESS_TOKEN not set - skipping test');
        return true;
    }
    return false;
}

export function getTestUserId(): string {
    return process.env.GMAIL_USER_ID || 'me';
}

export async function handleRateLimit(error: any): Promise<void> {
    if (error?.status === 429) {
        const retryAfter = error.headers?.['retry-after'];
        if (retryAfter) {
            console.warn(`Rate limit exceeded. Retry after: ${retryAfter}s`);
        }
        throw new Error('Rate limit exceeded. Please wait before running tests again.');
    }
    throw error;
}

export function generateTestId(): string {
    return `test-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function createTestEmail(to: string, subject: string, body: string): string {
    const email = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/plain; charset=utf-8',
        '',
        body,
    ].join('\n');

    return Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function getTestEmail(): string {
    return process.env.TEST_EMAIL || 'test@example.com';
}

