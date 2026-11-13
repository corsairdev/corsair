import { processWebhook } from 'corsair';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { sanity } from './index';
import {
	DELIVERY_BODY,
	deliveryHeaders,
	jsonResponse,
	PROJECT_ID,
	REAL_DELIVERY,
	TOKEN,
	WEBHOOK_SECRET,
} from './test-fixtures';

const KEK = process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef';

async function createClient(
	options: Parameters<typeof sanity>[0] = {},
	{ issueDek = true } = {},
) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'sanity', 'default');
	const corsair = createCorsair({
		plugins: [sanity(options)],
		database: testDb.db,
		kek: KEK,
	});
	if (issueDek) await corsair.sanity.keys.issue_new_dek();
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('sanity plugin through createCorsair', () => {
	it('fails fast with auth-missing when no token is stored', async () => {
		const { corsair, testDb } = await createClient({ projectId: PROJECT_ID });
		try {
			await expect(
				corsair.sanity.api.documents.query({ query: 'count(*)' }),
			).rejects.toThrow(/auth-missing/);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('uses the stored token, project id and dataset, and logs the call', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.sanity.keys.set_api_key(TOKEN);
			await corsair.sanity.keys.set_project_id(PROJECT_ID);
			await corsair.sanity.keys.set_dataset('staging');
			fetchMock.mockResolvedValueOnce(jsonResponse({ result: 3, ms: 1 }));
			const response = await corsair.sanity.api.documents.query({
				query: 'count(*)',
			});
			expect(response.result).toBe(3);
			const [url, init] = fetchMock.mock.calls[0];
			expect(String(url)).toBe(
				`https://${PROJECT_ID}.api.sanity.io/v2025-02-19/data/query/staging?returnQuery=false`,
			);
			expect(init.headers.Authorization).toBe(`Bearer ${TOKEN}`);
			const events = await createCorsairOrm(testDb.database).events.findMany({
				where: { event_type: 'sanity.documents.query' },
			});
			expect(events).toHaveLength(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('raises auth-missing for the project id when only the token is stored', async () => {
		const { corsair, testDb } = await createClient();
		try {
			await corsair.sanity.keys.set_api_key(TOKEN);
			await expect(corsair.sanity.api.datasets.list({})).rejects.toThrow(
				/project_id/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a read after a 502', async () => {
		const { corsair, testDb } = await createClient({
			key: TOKEN,
			projectId: PROJECT_ID,
		});
		try {
			fetchMock
				.mockResolvedValueOnce(
					jsonResponse({ error: { description: 'bad gateway' } }, 502),
				)
				.mockResolvedValueOnce(jsonResponse({ documents: [], omitted: [] }));
			const response = await corsair.sanity.api.documents.get({ ids: ['a'] });
			expect(response.documents).toEqual([]);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('never repeats a write after a 502, which may have landed', async () => {
		const { corsair, testDb } = await createClient({
			key: TOKEN,
			projectId: PROJECT_ID,
		});
		try {
			fetchMock.mockResolvedValue(
				jsonResponse({ error: { description: 'bad gateway' } }, 502),
			);
			await expect(
				corsair.sanity.api.documents.patch({ id: 'a', inc: { views: 1 } }),
			).rejects.toThrow(/Sanity 502/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a write that Sanity refused with 429', async () => {
		const { corsair, testDb } = await createClient({
			key: TOKEN,
			projectId: PROJECT_ID,
		});
		try {
			fetchMock
				.mockResolvedValueOnce(
					jsonResponse({ error: { description: 'rate' } }, 429, {
						'retry-after': '0',
					}),
				)
				.mockResolvedValueOnce(jsonResponse({ transactionId: 'tx' }));
			const response = await corsair.sanity.api.documents.publish({ id: 'a' });
			expect(response.transactionId).toBe('tx');
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	describe('webhooks', () => {
		it('verifies a real Sanity delivery with the stored secret and hands the event to the after hook', async () => {
			jest.spyOn(Date, 'now').mockReturnValue(REAL_DELIVERY.signedAt + 2000);
			const after = jest.fn();
			const { corsair, testDb } = await createClient({
				webhookHooks: { documents: { changed: { after } } },
			});
			try {
				await corsair.sanity.keys.set_webhook_signature(REAL_DELIVERY.secret);
				const result = await processWebhook(
					corsair,
					{ ...REAL_DELIVERY.headers },
					REAL_DELIVERY.rawBody,
				);
				expect(result.plugin).toBe('sanity');
				expect(result.action).toBe('documents.changed');
				expect(result.response?.success).toBe(true);
				expect(after).toHaveBeenCalledTimes(1);
				expect(after.mock.calls[0][1].data).toEqual({
					operation: 'create',
					documentId: 'corsair-live-40ebcfbe',
					projectId: 'mlz37d9m',
					dataset: 'corsair-plugin-test',
					webhookId: 'v6YLvHAsMjKJDxgN',
					transactionId: '5X82i8ToXfK0Fz5m5f8ns3',
					transactionTime: '2026-11-10T18:06:08Z',
					idempotencyKey: 'Ijl6wS57jhw9+6Jmk6KXSg',
					body: {
						_id: 'corsair-live-40ebcfbe',
						_type: 'post',
						slug: 'delivery-test',
						title: 'Delivery test',
					},
				});
				const events = await createCorsairOrm(testDb.database).events.findMany({
					where: { event_type: 'sanity.webhook.documents.changed' },
				});
				expect(events).toHaveLength(1);
			} finally {
				testDb.cleanup();
			}
		});

		it('reports a forged delivery as a failure, so the handler answers 5xx, and runs no after hook', async () => {
			const after = jest.fn();
			const { corsair, testDb } = await createClient({
				webhookSecret: WEBHOOK_SECRET,
				webhookHooks: { documents: { changed: { after } } },
			});
			try {
				const result = await processWebhook(
					corsair,
					deliveryHeaders(DELIVERY_BODY, { secret: 'not-the-secret' }),
					DELIVERY_BODY,
				);
				expect(result.plugin).toBe('sanity');
				// Newer core also sets statusCode 500 on a handler that threw.
				expect(result.response).toMatchObject({
					success: false,
					error: expect.stringMatching(
						/Sanity webhook refused: The signature does not match/,
					),
				});
				// Absent on older core, 500 on newer: never a success status.
				expect([undefined, 500]).toContain(result.response?.statusCode);
				expect(after).not.toHaveBeenCalled();
			} finally {
				testDb.cleanup();
			}
		});

		it("uses the tenant's stored secret over the webhookSecret option", async () => {
			const { corsair, testDb } = await createClient({
				webhookSecret: WEBHOOK_SECRET,
			});
			try {
				await corsair.sanity.keys.set_webhook_signature(
					'this-tenants-own-secret',
				);
				const signedWithOption = await processWebhook(
					corsair,
					deliveryHeaders(DELIVERY_BODY, { secret: WEBHOOK_SECRET }),
					DELIVERY_BODY,
				);
				expect(signedWithOption.response?.success).toBe(false);
				const signedWithStored = await processWebhook(
					corsair,
					deliveryHeaders(DELIVERY_BODY, { secret: 'this-tenants-own-secret' }),
					DELIVERY_BODY,
				);
				expect(signedWithStored.response?.success).toBe(true);
			} finally {
				testDb.cleanup();
			}
		});

		it('uses the option in an app with no database or kek at all', async () => {
			const corsair = createCorsair({
				plugins: [sanity({ webhookSecret: WEBHOOK_SECRET })],
			});
			const result = await processWebhook(
				corsair,
				deliveryHeaders(DELIVERY_BODY),
				DELIVERY_BODY,
			);
			expect(result.response?.success).toBe(true);
		});

		it('uses the option for an account with no data key yet, as an option-only app has', async () => {
			const { corsair, testDb } = await createClient(
				{ webhookSecret: WEBHOOK_SECRET },
				{ issueDek: false },
			);
			try {
				const result = await processWebhook(
					corsair,
					deliveryHeaders(DELIVERY_BODY),
					DELIVERY_BODY,
				);
				expect(result.response?.success).toBe(true);
			} finally {
				testDb.cleanup();
			}
		});

		it("refuses, rather than falling back to the option, when the tenant's stored secret can't be decrypted", async () => {
			const { corsair, testDb } = await createClient();
			try {
				await corsair.sanity.keys.set_webhook_signature(
					'this-tenants-own-secret',
				);
				// The same database read with another encryption key: decryption fails.
				const wrongKek = createCorsair({
					plugins: [sanity({ webhookSecret: WEBHOOK_SECRET })],
					database: testDb.db,
					kek: 'fedcba9876543210fedcba9876543210',
				});
				const result = await processWebhook(
					wrongKek,
					deliveryHeaders(DELIVERY_BODY, { secret: WEBHOOK_SECRET }),
					DELIVERY_BODY,
				);
				expect(result.response?.success).not.toBe(true);
			} finally {
				testDb.cleanup();
			}
		});

		it('falls back to the webhookSecret option when the account stores none', async () => {
			const { corsair, testDb } = await createClient({
				webhookSecret: WEBHOOK_SECRET,
			});
			try {
				const result = await processWebhook(
					corsair,
					deliveryHeaders(DELIVERY_BODY),
					DELIVERY_BODY,
				);
				expect(result.response?.success).toBe(true);
			} finally {
				testDb.cleanup();
			}
		});

		it('refuses an unsigned delivery and says how to set the secret when none is stored', async () => {
			const { corsair, testDb } = await createClient();
			try {
				const result = await processWebhook(
					corsair,
					deliveryHeaders(DELIVERY_BODY),
					DELIVERY_BODY,
				);
				expect(result.response?.success).toBe(false);
				expect(result.response?.error).toMatch(/keys\.set_webhook_signature/);
			} finally {
				testDb.cleanup();
			}
		});

		it('refuses a parsed body, which cannot verify', async () => {
			const { corsair, testDb } = await createClient({
				webhookSecret: WEBHOOK_SECRET,
			});
			try {
				const result = await processWebhook(
					corsair,
					deliveryHeaders(DELIVERY_BODY),
					// A parsed body re-serialized with different spacing.
					JSON.stringify(JSON.parse(DELIVERY_BODY), null, 2),
				);
				expect(result.response?.success).toBe(false);
			} finally {
				testDb.cleanup();
			}
		});
	});
});
