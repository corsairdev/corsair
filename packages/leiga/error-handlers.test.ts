import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { LeigaAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { leiga } from './index';
import {
	installFetchMock,
	jsonResponse,
	mockFetch,
	restoreFetchMock,
} from './test-helpers';

const KEK = process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'leiga', 'default');
	const corsair = createCorsair({
		plugins: [leiga({ key: 'test-token' })],
		database: testDb.db,
		kek: KEK,
	});
	return { corsair, testDb };
}

function handler(name: keyof typeof errorHandlers) {
	return errorHandlers[name];
}

describe('Leiga error handler matching', () => {
	it('matches code 15 to the auth handler, not to DEFAULT', () => {
		const error = new LeigaAPIError('accessToken error', { code: '15' });
		expect(handler('AUTH_ERROR').match(error)).toBe(true);
		expect(handler('VALIDATION_ERROR').match(error)).toBe(false);
	});

	it('matches code 18 (a rejected client id) to the auth handler', () => {
		const error = new LeigaAPIError('client_id error', { code: '18' });
		expect(handler('AUTH_ERROR').match(error)).toBe(true);
	});

	it('matches code 5 to not-found, which never retries', () => {
		const error = new LeigaAPIError('object not exist', { code: '5' });
		expect(handler('NOT_FOUND_ERROR').match(error)).toBe(true);
	});

	it('matches code 100 to validation, which never retries', () => {
		const error = new LeigaAPIError('stateId should not be null', {
			code: '100',
		});
		expect(handler('VALIDATION_ERROR').match(error)).toBe(true);
	});

	it('matches a gateway 429 and keeps its Retry-After', async () => {
		const error = new LeigaAPIError('Too Many Requests', {
			status: 429,
			retryAfter: 3000,
		});

		expect(handler('RATE_LIMIT_ERROR').match(error)).toBe(true);
		const result = await handler('RATE_LIMIT_ERROR').handler(error);
		expect(result).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 3000,
			retryStrategy: 'exponential_backoff',
		});
	});

	it('replays a 5xx read but never a 5xx write', () => {
		const read = new LeigaAPIError('gateway', { status: 502, method: 'GET' });
		const write = new LeigaAPIError('gateway', { status: 502, method: 'POST' });

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
		expect(names).toContain('QUOTA_ERROR');
		expect(names.indexOf('QUOTA_ERROR')).toBeLessThan(names.indexOf('DEFAULT'));
		expect(names).toContain('RATE_LIMIT_ERROR');
	});
});

describe('Leiga retries through the bound client', () => {
	it('retries a rate-limited read and then succeeds', async () => {
		const { corsair, testDb } = await createClient();
		try {
			mockFetch(
				jsonResponse({ message: 'Too Many Requests' }, { status: 429 }),
			);
			mockFetch(jsonResponse({ code: '0', data: [] }));

			const result = await corsair.leiga.api.projects.list({});

			expect(result.projects).toEqual([]);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a code 15, because the token would be identical', async () => {
		const { corsair, testDb } = await createClient();
		try {
			mockFetch(jsonResponse({ code: '15', msg: 'accessToken error' }));

			await expect(corsair.leiga.api.projects.list({})).rejects.toThrow(
				/accessToken error/,
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a code 5', async () => {
		const { corsair, testDb } = await createClient();
		try {
			mockFetch(
				jsonResponse({
					code: '5',
					msg: 'object not exist:Project does not exist',
				}),
			);

			await expect(
				corsair.leiga.api.projects.get({ projectId: 1 }),
			).rejects.toThrow(/Project does not exist/);
		} finally {
			testDb.cleanup();
		}
	});
});
