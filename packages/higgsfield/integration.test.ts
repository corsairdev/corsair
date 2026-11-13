import { processWebhook } from 'corsair';
import type { CorsairErrorHandler } from 'corsair/core';
import { createCorsair } from 'corsair/core';
import { ApiError } from 'corsair/http';
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

async function createClient(
	options: Parameters<typeof higgsfield>[0],
	rootErrorHandlers?: CorsairErrorHandler,
) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'higgsfield', 'default');
	const corsair = createCorsair({
		plugins: [higgsfield(options)],
		database: testDb.db,
		errorHandlers: rootErrorHandlers,
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

		it('concurrent calls with one object send different keys, and the failed one retries with its own', async () => {
			const { corsair, testDb } = await createClient({ key: API_KEY });
			try {
				fetchMock
					.mockResolvedValueOnce(jsonResponse(acceptedBody))
					.mockRejectedValueOnce(new TypeError('fetch failed'))
					.mockResolvedValueOnce(jsonResponse(acceptedBody));
				const args = { modelPath: MODEL, input: INPUT };
				const [one, two] = await Promise.all([
					corsair.higgsfield.api.generations.submit(args),
					corsair.higgsfield.api.generations.submit(args),
				]);
				const keys = keysSent();
				expect(keys).toHaveLength(3);
				expect(keys[0]).not.toBe(keys[1]);
				expect(keys[2]).toBe(keys[1]);
				expect(new Set([one.idempotency_key, two.idempotency_key])).toEqual(
					new Set([keys[0], keys[1]]),
				);
			} finally {
				testDb.cleanup();
			}
		}, 20_000);

		it('does not retry input it cannot serialize', async () => {
			const { corsair, testDb } = await createClient({ key: API_KEY });
			try {
				await expect(
					corsair.higgsfield.api.generations.submit({
						modelPath: MODEL,
						input: { seed: BigInt(1) },
					}),
				).rejects.toMatchObject({ code: 'invalid_input' });
				expect(fetchMock).not.toHaveBeenCalled();
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

describe('higgsfield error handlers', () => {
	const notFound = (error: Error) =>
		error instanceof ApiError && error.status === 404;
	const retryOnce = () =>
		jest.fn(async () => ({ maxRetries: 1, headersRetryAfterMs: 1 }));
	const answerNotFoundThenStatus = () => {
		fetchMock
			.mockResolvedValueOnce(jsonResponse({ detail: 'Not found' }, 404))
			.mockResolvedValueOnce(jsonResponse(completedStatusBody));
	};

	it('runs a new handler passed in the plugin options', async () => {
		const handler = retryOnce();
		const { corsair, testDb } = await createClient({
			key: API_KEY,
			errorHandlers: { CUSTOM_NOT_FOUND: { match: notFound, handler } },
		});
		try {
			answerNotFoundThenStatus();
			const response = await corsair.higgsfield.api.requests.status({
				requestId: REQUEST_ID,
			});
			expect(handler).toHaveBeenCalledTimes(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(response.status).toBe('completed');
		} finally {
			testDb.cleanup();
		}
	});

	it('keeps DEFAULT last, with a custom one replacing its own', () => {
		const custom = {
			match: () => true,
			handler: async () => ({ maxRetries: 0 }),
		};
		const handlers = higgsfield({
			errorHandlers: {
				DEFAULT: custom,
				CUSTOM_NOT_FOUND: { match: notFound, handler: retryOnce() },
			},
		}).errorHandlers as CorsairErrorHandler;
		const names = Object.keys(handlers);
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('CUSTOM_NOT_FOUND');
		expect(handlers.DEFAULT).toBe(custom);
	});

	it('runs a new handler even beside a match-everything custom DEFAULT', async () => {
		const handler = retryOnce();
		const { corsair, testDb } = await createClient({
			key: API_KEY,
			errorHandlers: {
				DEFAULT: {
					match: () => true,
					handler: async () => ({ maxRetries: 0 }),
				},
				CUSTOM_NOT_FOUND: { match: notFound, handler },
			},
		});
		try {
			answerNotFoundThenStatus();
			await corsair.higgsfield.api.requests.status({ requestId: REQUEST_ID });
			expect(handler).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('lets the plugin options replace a handler by name', async () => {
		const handler = jest.fn(async () => ({ maxRetries: 0 }));
		const { corsair, testDb } = await createClient({
			key: API_KEY,
			errorHandlers: {
				SERVER_ERROR: {
					match: (error: Error) =>
						error instanceof ApiError && error.status >= 500,
					handler,
				},
			},
		});
		try {
			fetchMock.mockResolvedValueOnce(jsonResponse({ detail: 'boom' }, 500));
			await expect(
				corsair.higgsfield.api.requests.status({ requestId: REQUEST_ID }),
			).rejects.toThrow('boom');
			expect(handler).toHaveBeenCalledTimes(1);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('runs a root handler for an error the plugin has no handler for', async () => {
		const handler = retryOnce();
		const { corsair, testDb } = await createClient(
			{ key: API_KEY },
			{ NOT_FOUND_ERROR: { match: notFound, handler } },
		);
		try {
			answerNotFoundThenStatus();
			await corsair.higgsfield.api.requests.status({ requestId: REQUEST_ID });
			expect(handler).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('still retries and runs root handlers when the root config has a DEFAULT', async () => {
		const rootDefault = jest.fn(async () => ({ maxRetries: 0 }));
		const rootNotFound = retryOnce();
		const { corsair, testDb } = await createClient(
			{ key: API_KEY },
			{
				DEFAULT: { match: () => true, handler: rootDefault },
				NOT_FOUND_ERROR: { match: notFound, handler: rootNotFound },
			},
		);
		try {
			fetchMock
				.mockResolvedValueOnce(
					jsonResponse({ detail: 'queue full' }, 429, { 'Retry-After': '0' }),
				)
				.mockResolvedValueOnce(jsonResponse(acceptedBody));
			await corsair.higgsfield.api.generations.submit({
				modelPath: MODEL,
				input: INPUT,
			});
			const keys = keysSent();
			expect(keys).toHaveLength(2);
			expect(keys[0]).toBe(keys[1]);

			fetchMock.mockClear();
			answerNotFoundThenStatus();
			await corsair.higgsfield.api.requests.status({ requestId: REQUEST_ID });
			expect(rootNotFound).toHaveBeenCalledTimes(1);
			expect(rootDefault).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	}, 20_000);
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

	it('reports a failure for a signed body that is not the envelope', async () => {
		const after = jest.fn();
		const { corsair, testDb } = await createClient({
			key: API_KEY,
			webhookSecret: WEBHOOK_SECRET,
			webhookHooks: { requests: { completed: { after } } },
		});
		try {
			const raw = `{"request_id": "${REQUEST_ID}", "status": "completed", "payload": "not an object"}`;
			const result = await processWebhook(corsair, signedHeaders(raw), raw);
			expect(result.response?.success).toBe(false);
			expect(after).not.toHaveBeenCalled();
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

	it('routes a signed failure with no payload key', async () => {
		const after = jest.fn();
		const { corsair, testDb } = await createClient({
			key: API_KEY,
			webhookSecret: WEBHOOK_SECRET,
			webhookHooks: { requests: { completed: { after } } },
		});
		try {
			const raw = `{"request_id": "${REQUEST_ID}", "status": "failed", "error": "Generation failed"}`;
			const result = await processWebhook(corsair, signedHeaders(raw), raw);
			expect(result.action).toBe('requests.completed');
			expect(result.response?.success).toBe(true);
			expect(after.mock.calls[0][1].data.status).toBe('failed');
		} finally {
			testDb.cleanup();
		}
	});

	it('reports a failure for a forged, tampered or unsigned delivery, so the sender retries', async () => {
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
				const result = await processWebhook(corsair, headers, body);
				expect(result.plugin).toBe('higgsfield');
				expect(result.response?.success).toBe(false);
				expect(result.response?.error).toContain('Higgsfield webhook refused');
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
			const result = await processWebhook(
				corsair,
				signedHeaders(COMPLETED_RAW_BODY),
				JSON.parse(COMPLETED_RAW_BODY),
			);
			expect(result.response?.success).toBe(false);
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

describe('a log entry that can’t be written', () => {
	it('keeps an accepted submit and warns once', async () => {
		// With encryptDataAtRest and no KEK, core's logger throws instead of
		// warning itself, so this goes through the real helper to logQuietly.
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'higgsfield', 'default');
		const corsair = createCorsair({
			plugins: [higgsfield({ key: API_KEY })],
			database: testDb.db,
			encryptDataAtRest: true,
			kek: '',
		});
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		try {
			fetchMock.mockResolvedValueOnce(jsonResponse(acceptedBody));
			const outcome = await corsair.higgsfield.api.generations
				.submit({ modelPath: MODEL, input: INPUT })
				.then(
					(response) => ({ response }),
					(error: Error) => ({ error }),
				);
			if ('error' in outcome) {
				// Newer core refuses before the request, so nothing is submitted.
				expect(outcome.error.name).toBe('CorsairKekMissingError');
				expect(posts()).toHaveLength(0);
				return;
			}
			expect(outcome.response.request_id).toBe(REQUEST_ID);
			expect(posts()).toHaveLength(1);
			expect(warn).toHaveBeenCalledTimes(1);
			expect(warn).toHaveBeenCalledWith(
				'Failed to log event:',
				expect.objectContaining({ message: 'encryptDataAtRest requires kek' }),
			);
		} finally {
			testDb.cleanup();
		}
	});
});
