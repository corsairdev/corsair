import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { TldvAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { tldv } from './index';
import { basicErrorBody, meetingsListResponse } from './test-fixtures';
import {
	installFetchMock,
	jsonResponse,
	mockFetch,
	restoreFetchMock,
} from './test-helpers';

const KEK = process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

function handler(name: keyof typeof errorHandlers) {
	return errorHandlers[name];
}

describe('tl;dv error handler matching', () => {
	it('matches a 429 and keeps Retry-After', async () => {
		const error = new TldvAPIError('Too Many Requests', {
			status: 429,
			retryAfter: 4000,
		});

		expect(handler('RATE_LIMIT_ERROR').match(error)).toBe(true);
		expect(await handler('RATE_LIMIT_ERROR').handler(error)).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 4000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('treats 401 and 403 as auth errors that never retry', async () => {
		const unauthorized = new TldvAPIError('nope', {
			status: 401,
			code: 'AuthorizationRequiredError',
		});
		const forbidden = new TldvAPIError('blocked', { status: 403 });

		expect(handler('AUTH_ERROR').match(unauthorized)).toBe(true);
		expect(handler('AUTH_ERROR').match(forbidden)).toBe(true);
		expect(await handler('AUTH_ERROR').handler(unauthorized)).toEqual({
			maxRetries: 0,
		});
	});

	it('identifies the User-Agent block as a 403 with no code', () => {
		const blocked = new TldvAPIError('error code: 1010', { status: 403 });

		expect(blocked.isUserAgentBlocked).toBe(true);
		expect(blocked.isAuthError).toBe(true);
	});

	it('matches a 400 validation error and a ZodError', () => {
		const bad = new TldvAPIError('invalid', { status: 400 });
		const zod = Object.assign(new Error('invalid input'), { name: 'ZodError' });

		expect(handler('VALIDATION_ERROR').match(bad)).toBe(true);
		expect(handler('VALIDATION_ERROR').match(zod)).toBe(true);
	});

	it('matches a 404 by status or by name', () => {
		expect(
			handler('NOT_FOUND_ERROR').match(
				new TldvAPIError('gone', { status: 404 }),
			),
		).toBe(true);
		expect(
			handler('NOT_FOUND_ERROR').match(
				new TldvAPIError('gone', { code: 'NotFoundError' }),
			),
		).toBe(true);
	});

	it('replays a 5xx read but never a 5xx import', () => {
		const read = new TldvAPIError('gateway', { status: 502, method: 'GET' });
		const write = new TldvAPIError('gateway', { status: 502, method: 'POST' });

		expect(handler('SERVER_ERROR').match(read)).toBe(true);
		expect(handler('SERVER_ERROR').match(write)).toBe(false);
	});

	it('keeps DEFAULT last after a caller adds a handler', () => {
		const merged = mergeErrorHandlers(errorHandlers, {
			QUOTA_ERROR: {
				match: () => false,
				handler: async () => ({ maxRetries: 0 }),
			},
		});
		const names = Object.keys(merged);

		expect(names.at(-1)).toBe('DEFAULT');
		expect(names.indexOf('QUOTA_ERROR')).toBeLessThan(names.indexOf('DEFAULT'));
		expect(names).toContain('RATE_LIMIT_ERROR');
	});
});

describe('tl;dv retries through the bound client', () => {
	async function createClient() {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'tldv', 'default');
		const corsair = createCorsair({
			plugins: [tldv({ key: 'test-key' })],
			database: testDb.db,
			kek: KEK,
		});
		return { corsair, testDb };
	}

	it('retries a rate-limited read and then succeeds', async () => {
		const { corsair, testDb } = await createClient();
		try {
			mockFetch(
				jsonResponse({ message: 'Too Many Requests' }, { status: 429 }),
			);
			mockFetch(jsonResponse(meetingsListResponse));

			const result = await corsair.tldv.api.meetings.list({});

			expect(result.results).toHaveLength(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 401', async () => {
		const { corsair, testDb } = await createClient();
		try {
			mockFetch(jsonResponse(basicErrorBody, { status: 401 }));

			await expect(corsair.tldv.api.meetings.list({})).rejects.toThrow(
				/AuthorizationRequiredError/,
			);
		} finally {
			testDb.cleanup();
		}
	});
});
