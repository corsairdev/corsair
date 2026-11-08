import { processWebhook } from 'corsair';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { higgsfield } from './index';
import {
	API_KEY,
	acceptedBody,
	COMPLETED_RAW_BODY,
	completedStatusBody,
	jsonResponse,
	REQUEST_ID,
	signedHeaders,
	WEBHOOK_SECRET,
} from './test-fixtures';

async function createClient(options: Parameters<typeof higgsfield>[0]) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'higgsfield', 'default');
	const corsair = createCorsair({
		plugins: [higgsfield(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

const MODEL = 'higgsfield-ai/soul/v2/standard';
const INPUT = { prompt: 'A paper boat on a calm pond' };

let fetchMock: jest.SpyInstance;

const posts = () =>
	fetchMock.mock.calls.filter(([, init]) => init?.method === 'POST');
const keysSent = () =>
	posts().map(([, init]) => init.headers['Idempotency-Key'] as string);

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('higgsfield plugin through createCorsair', () => {
	it('fails fast with AuthMissingError when no key is stored', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.higgsfield.keys.issue_new_dek();
			await expect(corsair.higgsfield.api.models.list({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the stored key to the API and logs the call', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.higgsfield.keys.issue_new_dek();
			await corsair.higgsfield.keys.set_api_key(API_KEY);
			fetchMock.mockResolvedValueOnce(jsonResponse(acceptedBody));
			const response = await corsair.higgsfield.api.generations.submit({
				modelPath: MODEL,
				input: INPUT,
			});
			expect(response.request_id).toBe(REQUEST_ID);
			const [url, init] = fetchMock.mock.calls[0];
			expect(String(url)).toBe(`https://api.higgsfield.ai/${MODEL}`);
			expect(init.headers.Authorization).toBe(`Key ${API_KEY}`);
			const events = await createCorsairOrm(testDb.database).events.findMany({
				where: { event_type: 'higgsfield.generations.submit' },
			});
			expect(events).toHaveLength(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('refuses a stored key with no colon, once, without sending it', async () => {
		const { corsair, testDb } = await createClient({ key: 'nocolonkey' });
		try {
			const error = await corsair.higgsfield.api.models
				.list({})
				.catch((caught: Error) => caught);
			expect((error as Error).message).toContain('<key id>:<key secret>');
			expect((error as Error).message).not.toContain('nocolonkey');
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	describe('no double charge across core retries', () => {
		it.each([
			['a 500', () => jsonResponse({ detail: 'boom' }, 500)],
			['a 502', () => new Response('bad gateway', { status: 502 })],
			[
				'a retryable 503',
				() =>
					jsonResponse(
						{
							detail: {
								code: 'admission_control_unavailable',
								retryable: true,
							},
						},
						503,
					),
			],
			[
				'a 429 with a short Retry-After',
				() =>
					jsonResponse({ detail: 'queue full' }, 429, { 'Retry-After': '0' }),
			],
		])(
			'reuses one key when %s is retried',
			async (_label, failure) => {
				const { corsair, testDb } = await createClient({ key: API_KEY });
				try {
					fetchMock
						.mockImplementationOnce(async () => failure())
						.mockResolvedValueOnce(jsonResponse(acceptedBody));
					const response = await corsair.higgsfield.api.generations.submit({
						modelPath: MODEL,
						input: INPUT,
					});
					const keys = keysSent();
					expect(keys).toHaveLength(2);
					expect(keys[0]).toBe(keys[1]);
					expect(response.idempotency_key).toBe(keys[0]);
				} finally {
					testDb.cleanup();
				}
			},
			20_000,
		);

		it('reuses one key when the network fails', async () => {
			const { corsair, testDb } = await createClient({ key: API_KEY });
			try {
				fetchMock
					.mockRejectedValueOnce(new TypeError('fetch failed'))
					.mockResolvedValueOnce(jsonResponse(acceptedBody));
				await corsair.higgsfield.api.generations.submit({
					modelPath: MODEL,
					input: INPUT,
				});
				const keys = keysSent();
				expect(keys).toHaveLength(2);
				expect(keys[0]).toBe(keys[1]);
			} finally {
				testDb.cleanup();
			}
		}, 20_000);

		it('generations.run reuses one key across a retry of its submit too', async () => {
			const { corsair, testDb } = await createClient({ key: API_KEY });
			try {
				fetchMock
					.mockResolvedValueOnce(jsonResponse({ detail: 'boom' }, 500))
					.mockResolvedValueOnce(jsonResponse(acceptedBody))
					.mockResolvedValueOnce(jsonResponse(completedStatusBody));
				const response = await corsair.higgsfield.api.generations.run({
					modelPath: MODEL,
					input: INPUT,
					waitSeconds: 1,
				});
				const keys = keysSent();
				expect(keys).toHaveLength(2);
				expect(keys[0]).toBe(keys[1]);
				expect(response.status).toBe('completed');
			} finally {
				testDb.cleanup();
			}
		}, 20_000);

		it('a read failing after acceptance is not retried into a second submit', async () => {
			const { corsair, testDb } = await createClient({ key: API_KEY });
			try {
				fetchMock
					.mockResolvedValueOnce(jsonResponse(acceptedBody))
					.mockImplementation(async () =>
						jsonResponse({ detail: 'slow down' }, 429, { 'Retry-After': '1' }),
					);
				const response = await corsair.higgsfield.api.generations.run({
					modelPath: MODEL,
					input: INPUT,
					waitSeconds: 1,
				});
				expect(response.status).toBe('queued');
				expect(posts()).toHaveLength(1);
			} finally {
				testDb.cleanup();
			}
		});

		it('does not retry a low balance, a blocked model or a long Retry-After', async () => {
			const { corsair, testDb } = await createClient({ key: API_KEY });
			try {
				for (const answer of [
					jsonResponse({ detail: 'Not enough credits' }, 403),
					jsonResponse({ detail: 'Blocked' }, 423),
					jsonResponse({ detail: 'queue full' }, 429, { 'Retry-After': '30' }),
				]) {
					fetchMock.mockClear();
					fetchMock.mockResolvedValueOnce(answer);
					await expect(
						corsair.higgsfield.api.generations.submit({
							modelPath: MODEL,
							input: INPUT,
						}),
					).rejects.toThrow();
					expect(fetchMock).toHaveBeenCalledTimes(1);
				}
			} finally {
				testDb.cleanup();
			}
		});

		it('two separate calls with equal arguments are two generations', async () => {
			const { corsair, testDb } = await createClient({ key: API_KEY });
			try {
				fetchMock
					.mockResolvedValueOnce(jsonResponse(acceptedBody))
					.mockResolvedValueOnce(jsonResponse(acceptedBody));
				const args = { modelPath: MODEL, input: INPUT };
				await corsair.higgsfield.api.generations.submit(args);
				await corsair.higgsfield.api.generations.submit(args);
				const keys = keysSent();
				expect(keys[0]).not.toBe(keys[1]);
			} finally {
				testDb.cleanup();
			}
		});
	});
});

describe('higgsfield webhooks through processWebhook', () => {
	it('routes a signed delivery to requests.completed and logs it', async () => {
		const { corsair, testDb } = await createClient({
			key: API_KEY,
			webhookSecret: WEBHOOK_SECRET,
		});
		try {
			const result = await processWebhook(
				corsair,
				signedHeaders(COMPLETED_RAW_BODY),
				COMPLETED_RAW_BODY,
			);
			expect(result.plugin).toBe('higgsfield');
			expect(result.action).toBe('requests.completed');
			expect(result.response?.success).toBe(true);
			const events = await createCorsairOrm(testDb.database).events.findMany({
				where: { event_type: 'higgsfield.webhook.requests.completed' },
			});
			expect(events).toHaveLength(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('reads the secret from the key store', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.higgsfield.keys.issue_new_dek();
			await corsair.higgsfield.keys.set_webhook_signature(WEBHOOK_SECRET);
			const result = await processWebhook(
				corsair,
				signedHeaders(COMPLETED_RAW_BODY),
				COMPLETED_RAW_BODY,
			);
			expect(result.action).toBe('requests.completed');
			const events = await createCorsairOrm(testDb.database).events.findMany({
				where: { event_type: 'higgsfield.webhook.requests.completed' },
			});
			expect(events).toHaveLength(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('hands the verified event to an after hook', async () => {
		const after = jest.fn();
		const { corsair, testDb } = await createClient({
			key: API_KEY,
			webhookSecret: WEBHOOK_SECRET,
			webhookHooks: { requests: { completed: { after } } },
		});
		try {
			await processWebhook(
				corsair,
				signedHeaders(COMPLETED_RAW_BODY),
				COMPLETED_RAW_BODY,
			);
			expect(after).toHaveBeenCalledTimes(1);
			expect(after.mock.calls[0][1].data).toMatchObject({
				request_id: REQUEST_ID,
				status: 'completed',
				webhook_id: 'msg_01TESTDELIVERY',
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('reports a failure with no secret set, so the HTTP handler answers non-2xx', async () => {
		const { corsair, testDb } = await createClient({ key: API_KEY });
		try {
			await corsair.higgsfield.keys.issue_new_dek();
			const result = await processWebhook(
				corsair,
				signedHeaders(COMPLETED_RAW_BODY),
				COMPLETED_RAW_BODY,
			);
			expect(result.plugin).toBe('higgsfield');
			expect(result.response?.success).toBe(false);
			expect(result.response?.error).toContain('webhook secret');
			const events = await createCorsairOrm(testDb.database).events.findMany({
				where: { event_type: 'higgsfield.webhook.requests.completed' },
			});
			expect(events).toHaveLength(0);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not process a forged, tampered or unsigned delivery', async () => {
		const after = jest.fn();
		const { corsair, testDb } = await createClient({
			key: API_KEY,
			webhookSecret: WEBHOOK_SECRET,
			webhookHooks: { requests: { completed: { after } } },
		});
		try {
			const tampered = COMPLETED_RAW_BODY.replace('boat', 'evil');
			for (const [headers, body] of [
				[signedHeaders(COMPLETED_RAW_BODY), tampered],
				[{ 'content-type': 'application/json' }, COMPLETED_RAW_BODY],
				[
					{
						...signedHeaders(COMPLETED_RAW_BODY),
						'webhook-signature': 'v1,AAAA',
					},
					COMPLETED_RAW_BODY,
				],
			] as const) {
				await processWebhook(corsair, headers, body);
			}
			expect(after).not.toHaveBeenCalled();
			const events = await createCorsairOrm(testDb.database).events.findMany({
				where: { event_type: 'higgsfield.webhook.requests.completed' },
			});
			expect(events).toHaveLength(0);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not verify a body handed over as parsed JSON', async () => {
		const after = jest.fn();
		const { corsair, testDb } = await createClient({
			key: API_KEY,
			webhookSecret: WEBHOOK_SECRET,
			webhookHooks: { requests: { completed: { after } } },
		});
		try {
			await processWebhook(
				corsair,
				signedHeaders(COMPLETED_RAW_BODY),
				JSON.parse(COMPLETED_RAW_BODY),
			);
			expect(after).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('leaves other providers’ deliveries alone', async () => {
		const { corsair, testDb } = await createClient({
			key: API_KEY,
			webhookSecret: WEBHOOK_SECRET,
		});
		try {
			const result = await processWebhook(
				corsair,
				{ 'content-type': 'application/json' },
				JSON.stringify({ request_id: 'x', status: 'OK', payload: {} }),
			);
			expect(result.plugin).toBeNull();
		} finally {
			testDb.cleanup();
		}
	});
});
