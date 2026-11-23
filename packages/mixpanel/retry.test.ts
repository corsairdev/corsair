import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { mixpanel } from './index';
import {
	cohort,
	importOk,
	queryRateLimited,
	retentionResponse,
} from './test-fixtures';

/**
 * The endpoints call the HTTP client, which is configured with `maxRetries: 0`;
 * only the bound client retries, using this plugin's error handlers. This file
 * goes through `createCorsair` so that retry layer actually runs. It is not
 * named `integration.test.ts`, because CI skips that name.
 */
async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'mixpanel', 'default');
	const corsair = createCorsair({
		plugins: [
			mixpanel({
				serviceAccountUsername: 'sa-user',
				serviceAccountSecret: 'sa-secret',
				projectId: 3141592,
			}),
		],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown, // unknown: response bodies are arbitrary JSON.
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('retries through the bound client', () => {
	it('retries a 429 on a read and returns the good page', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(queryRateLimited, 429, { 'Retry-After': '1' });
			respond([cohort]);

			const result = await corsair.mixpanel.api.cohorts.list({});

			expect(result.cohorts).toHaveLength(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries an import batch on a 503, which Mixpanel documents as safe to replay', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond({ error: 'upstream unavailable', status: 0 }, 503);
			respond(importOk);

			const result = await corsair.mixpanel.api.events.import({
				events: [
					{
						event: 'Signed up',
						properties: {
							time: 1618716477000,
							distinct_id: '91304156-cafc-4673-a237-623d1129c801',
							$insert_id: '29fc2962-6d9c-455d-95ad-95b84f09b9e4',
						},
					},
				],
			});

			expect(result.num_records_imported).toBe(2);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after three retries and rethrows the rate limit', async () => {
		const { corsair, testDb } = await createClient();
		try {
			for (let i = 0; i < 4; i += 1) {
				respond(queryRateLimited, 429, { 'Retry-After': '1' });
			}

			await expect(
				corsair.mixpanel.api.insights.query({ bookmark_id: 12345 }),
			).rejects.toMatchObject({
				status: 429,
				code: 'query_api.request.rate_limited',
			});
			// One attempt plus the three retries RATE_LIMIT_ERROR allows.
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a 400 validation failure', async () => {
		const { corsair, testDb } = await createClient();
		try {
			respond(
				{
					code: 400,
					error: 'some data points in the request failed validation',
					status: 'Bad Request',
					num_records_imported: 0,
					failed_records: [],
				},
				400,
			);

			await expect(
				corsair.mixpanel.api.retention.query({
					from_date: '2026-04-01',
					to_date: '2026-04-03',
					born_event: 'Signed up',
				}),
			).rejects.toMatchObject({ status: 400 });
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replays a read after a transport failure and succeeds', async () => {
		const { corsair, testDb } = await createClient();
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			respond(retentionResponse);

			const result = await corsair.mixpanel.api.retention.query({
				from_date: '2026-04-01',
				to_date: '2026-04-03',
				born_event: 'Signed up',
			});

			expect(Object.keys(result)).toEqual([
				'2026-04-01',
				'2026-04-02',
				'2026-04-03',
			]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});
