import { ApiError } from 'corsair/http';
import { makeApipieRequest } from './client';
import { Chat, Embeddings, Images, Models } from './endpoints';
import {
	ApipieEndpointInputSchemas,
	ApipieEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { ApipieContext } from './index';
import { apipie } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeApipieRequest: jest.fn(),
	};
});

/** Minimal plugin context for endpoint handler tests. */
function testCtx(key: string): ApipieContext {
	return {
		key,
	} as ApipieContext;
}

describe('Apipie endpoint input schemas', () => {
	it('validates models.list input', () => {
		expect(ApipieEndpointInputSchemas.modelsList.safeParse({}).success).toBe(
			true,
		);
		expect(
			ApipieEndpointInputSchemas.modelsList.safeParse({
				type: 'llm',
				provider: 'openai',
			}).success,
		).toBe(true);
	});

	it('validates models.listDetailed input', () => {
		expect(
			ApipieEndpointInputSchemas.modelsListDetailed.safeParse({}).success,
		).toBe(true);
		expect(
			ApipieEndpointInputSchemas.modelsListDetailed.safeParse({
				model: 'gpt-4o',
			}).success,
		).toBe(true);
	});

	it('validates chat.createCompletion input', () => {
		const valid = ApipieEndpointInputSchemas.chatCreateCompletion.safeParse({
			model: 'gpt-4o',
			messages: [{ role: 'user', content: 'Hello' }],
		});
		expect(valid.success).toBe(true);
	});

	it('rejects chat.createCompletion without messages', () => {
		const invalid = ApipieEndpointInputSchemas.chatCreateCompletion.safeParse({
			model: 'gpt-4o',
		});
		expect(invalid.success).toBe(false);
	});

	it('rejects chat.createCompletion with unknown routing', () => {
		const invalid = ApipieEndpointInputSchemas.chatCreateCompletion.safeParse({
			model: 'gpt-4o',
			messages: [{ role: 'user', content: 'Hello' }],
			routing: 'cheapest',
		});
		expect(invalid.success).toBe(false);
	});

	it('validates embeddings.create with string or array input', () => {
		expect(
			ApipieEndpointInputSchemas.embeddingsCreate.safeParse({
				model: 'text-embedding-3-small',
				input: 'hello',
			}).success,
		).toBe(true);
		expect(
			ApipieEndpointInputSchemas.embeddingsCreate.safeParse({
				model: 'text-embedding-3-small',
				input: ['hello', 'world'],
			}).success,
		).toBe(true);
		expect(
			ApipieEndpointInputSchemas.embeddingsCreate.safeParse({
				model: 'text-embedding-3-small',
			}).success,
		).toBe(false);
	});

	it('requires images.generate prompt', () => {
		expect(
			ApipieEndpointInputSchemas.imagesGenerate.safeParse({
				model: 'dall-e-3',
			}).success,
		).toBe(false);
		expect(
			ApipieEndpointInputSchemas.imagesGenerate.safeParse({
				model: 'dall-e-3',
				prompt: 'a cat',
			}).success,
		).toBe(true);
	});
});

describe('Apipie endpoint output schemas', () => {
	it('parses chat completion response', () => {
		const output = ApipieEndpointOutputSchemas.chatCreateCompletion.safeParse({
			id: 'chatcmpl-123',
			object: 'chat.completion',
			choices: [{ index: 0, message: { role: 'assistant', content: 'Hi' } }],
		});
		expect(output.success).toBe(true);
	});

	it('parses models list response shapes', () => {
		expect(
			ApipieEndpointOutputSchemas.modelsList.safeParse([
				{ id: 'gpt-4o', provider: 'openai' },
			]).success,
		).toBe(true);
		expect(
			ApipieEndpointOutputSchemas.modelsList.safeParse({
				object: 'list',
				data: [{ id: 'gpt-4o' }],
			}).success,
		).toBe(true);
	});

	it('parses models detailed response', () => {
		const output = ApipieEndpointOutputSchemas.modelsListDetailed.safeParse({
			object: 'list',
			data: [
				{
					id: 'gpt-4o',
					enabled: true,
					pricing: { input_cost_per_token: 0.001 },
				},
			],
		});
		expect(output.success).toBe(true);
	});

	it('parses embeddings response', () => {
		const output = ApipieEndpointOutputSchemas.embeddingsCreate.safeParse({
			object: 'list',
			data: [{ object: 'embedding', index: 0, embedding: [0.1, 0.2] }],
		});
		expect(output.success).toBe(true);
	});

	it('rejects images response items without url or b64_json', () => {
		expect(
			ApipieEndpointOutputSchemas.imagesGenerate.safeParse({
				created: 1700000000,
				data: [{ revised_prompt: 'no image data' }],
			}).success,
		).toBe(false);
		expect(
			ApipieEndpointOutputSchemas.imagesGenerate.safeParse({
				created: 1700000000,
				data: [{ url: 'https://example.com/img.png' }],
			}).success,
		).toBe(true);
	});
});

describe('Apipie error handlers', () => {
	it('matches 429 rate limit errors by message', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('rate_limited')),
		).toBe(true);
	});

	it('matches 429 via ApiError status', () => {
		const error = new ApiError(
			{} as never,
			{ url: '', status: 429, statusText: '', body: {} } as never,
			'Too Many Requests',
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	});

	it('matches auth errors via ApiError status', () => {
		const error = new ApiError(
			{} as never,
			{ url: '', status: 401, statusText: '', body: {} } as never,
			'Unauthorized',
		);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	it('leaves rate-limit retries to the transport', async () => {
		// corsair/http already retries 429 internally and returns the attempt
		// that succeeds. Re-driving it from the binder would multiply the two
		// budgets and replay billable completions.
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			new Error('rate_limited'),
		);
		expect(result.maxRetries).toBe(0);
	});

	it('surfaces Retry-After from a 429 without re-driving it', async () => {
		const error = new ApiError(
			{} as never,
			{ url: '', status: 429, statusText: '', body: {} } as never,
			'Too Many Requests',
		);
		(error as { retryAfter?: number }).retryAfter = 2000;
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.headersRetryAfterMs).toBe(2000);
		expect(result.maxRetries).toBe(0);
	});

	it('matches a 402 out-of-credit response', () => {
		const error = new ApiError(
			{} as never,
			{
				url: '',
				status: 402,
				statusText: '',
				body: {
					code: 'ACCOUNT_ERROR',
					message: 'Your account appears to be out of credit',
				},
			} as never,
			'Payment Required',
		);
		expect(errorHandlers.ACCOUNT_ERROR.match(error)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
	});

	it('never retries an out-of-credit account', async () => {
		const result = await errorHandlers.ACCOUNT_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('does not replay billable POSTs after a 5xx', async () => {
		const result = await errorHandlers.SERVER_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('DEFAULT handler matches any error', () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});
});

describe('Apipie mocked endpoint handlers', () => {
	const ctx = testCtx('test_key');
	const mockRequest = makeApipieRequest as jest.MockedFunction<
		typeof makeApipieRequest
	>;

	beforeEach(() => {
		mockRequest.mockClear();
	});

	it('Models.list', async () => {
		mockRequest.mockResolvedValue({ object: 'list', data: [] });
		await Models.list(ctx, { type: 'llm' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/models',
			'test_key',
			expect.objectContaining({
				method: 'GET',
				query: expect.objectContaining({ type: 'llm' }),
			}),
		);
	});

	it('Models.listDetailed', async () => {
		mockRequest.mockResolvedValue({ object: 'list', data: [] });
		await Models.listDetailed(ctx, { provider: 'openai' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/models/detailed',
			'test_key',
			expect.objectContaining({
				method: 'GET',
				query: expect.objectContaining({ provider: 'openai' }),
			}),
		);
	});

	it('Chat.createCompletion', async () => {
		mockRequest.mockResolvedValue({ id: 'chatcmpl-123', choices: [] });
		await Chat.createCompletion(ctx, {
			model: 'gpt-4o',
			messages: [{ role: 'user', content: 'Hello' }],
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/chat/completions',
			'test_key',
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({
					model: 'gpt-4o',
					messages: [{ role: 'user', content: 'Hello' }],
				}),
			}),
		);
	});

	it('Chat.createCompletion maps APIpie extras to snake_case', async () => {
		mockRequest.mockResolvedValue({ id: 'chatcmpl-123', choices: [] });
		await Chat.createCompletion(ctx, {
			model: 'gpt-4o',
			messages: [{ role: 'user', content: 'Remember this' }],
			routing: 'price',
			maxTokens: 100,
			memSession: 'session-1',
			memExpire: 60,
			integrityModel: 'gpt-4o-mini',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/chat/completions',
			'test_key',
			expect.objectContaining({
				body: expect.objectContaining({
					routing: 'price',
					max_tokens: 100,
					mem_session: 'session-1',
					mem_expire: 60,
					integrity_model: 'gpt-4o-mini',
				}),
			}),
		);
	});

	it('Embeddings.create', async () => {
		mockRequest.mockResolvedValue({
			object: 'list',
			data: [{ embedding: [0.1] }],
		});
		await Embeddings.create(ctx, {
			model: 'text-embedding-3-small',
			input: 'hello',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/embeddings',
			'test_key',
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({
					model: 'text-embedding-3-small',
					input: 'hello',
				}),
			}),
		);
	});

	it('Images.generate', async () => {
		mockRequest.mockResolvedValue({
			created: 1700000000,
			data: [{ url: 'https://example.com/img.png' }],
		});
		await Images.generate(ctx, { model: 'dall-e-3', prompt: 'a cat' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/images/generations',
			'test_key',
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({
					model: 'dall-e-3',
					prompt: 'a cat',
				}),
			}),
		);
	});
});

describe('apipie plugin factory', () => {
	it('creates a plugin with the expected id and auth type', () => {
		const plugin = apipie({});
		expect(plugin.id).toBe('apipie');
		const options = plugin.options as { authType?: string } | undefined;
		expect(options?.authType).toBe('api_key');
	});

	it('exposes all endpoints', () => {
		const plugin = apipie({});
		const endpoints = plugin.endpoints as
			| {
					models: { list: unknown; listDetailed: unknown };
					chat: { createCompletion: unknown };
					embeddings: { create: unknown };
					images: { generate: unknown };
			  }
			| undefined;
		expect(endpoints?.models.list).toBeDefined();
		expect(endpoints?.models.listDetailed).toBeDefined();
		expect(endpoints?.chat.createCompletion).toBeDefined();
		expect(endpoints?.embeddings.create).toBeDefined();
		expect(endpoints?.images.generate).toBeDefined();
	});

	it('does not match webhooks', () => {
		const plugin = apipie({});
		const matcher = plugin.pluginWebhookMatcher as
			| ((request: unknown) => boolean)
			| undefined;
		expect(matcher?.({ headers: {}, body: '' })).toBe(false);
	});
});

describe('Apipie models list response shapes', () => {
	it('accepts an empty bare array as a valid empty catalogue', () => {
		// A filter that matches nothing is a legitimate result, not an error.
		const parsed = ApipieEndpointOutputSchemas.modelsList.safeParse([]);
		expect(parsed.success).toBe(true);
	});

	it('accepts an empty wrapped catalogue', () => {
		const parsed = ApipieEndpointOutputSchemas.modelsList.safeParse({
			object: 'list',
			data: [],
		});
		expect(parsed.success).toBe(true);
	});
});

describe('Apipie streaming rejection', () => {
	const mockRequest = makeApipieRequest as jest.MockedFunction<
		typeof makeApipieRequest
	>;

	beforeEach(() => {
		mockRequest.mockClear();
	});

	it('rejects a forced stream instead of sending it upstream', async () => {
		// The transport buffers the response and parses it as one JSON object,
		// so an event stream would come back as unparseable text.
		await expect(
			Chat.createCompletion(testCtx('test_key'), {
				model: 'openai/gpt-4o',
				messages: [{ role: 'user', content: 'hi' }],
				stream: true,
			} as never),
		).rejects.toThrow(/streaming is not supported/i);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('never puts stream in the request body', async () => {
		mockRequest.mockResolvedValue({ choices: [] });
		await Chat.createCompletion(testCtx('test_key'), {
			model: 'openai/gpt-4o',
			messages: [{ role: 'user', content: 'hi' }],
		});
		const call = mockRequest.mock.calls[0];
		expect(call).toBeDefined();
		const body = call?.[2]?.body as Record<string, unknown>;
		expect(body).toBeDefined();
		expect('stream' in body).toBe(false);
	});
});

describe('Apipie entity caching', () => {
	const mockRequest = makeApipieRequest as jest.MockedFunction<
		typeof makeApipieRequest
	>;

	/** Context carrying an in-memory stand-in for the entity store. */
	function ctxWithDb() {
		const models = new Map<string, unknown>();
		const modelDetails = new Map<string, unknown>();
		const images = new Map<string, unknown>();
		const ctx = {
			key: 'test_key',
			db: {
				models: {
					upsertByEntityId: jest.fn(async (id: string, data: unknown) => {
						models.set(id, data);
					}),
				},
				modelDetails: {
					upsertByEntityId: jest.fn(async (id: string, data: unknown) => {
						modelDetails.set(id, data);
					}),
				},
				images: {
					upsertByEntityId: jest.fn(async (id: string, data: unknown) => {
						images.set(id, data);
					}),
				},
			},
		} as unknown as ApipieContext;
		return { ctx, models, modelDetails, images };
	}

	beforeEach(() => {
		mockRequest.mockClear();
	});

	it('mirrors listed models into the cache', async () => {
		const { ctx, models } = ctxWithDb();
		mockRequest.mockResolvedValue({
			object: 'list',
			data: [
				{
					id: 'openai/gpt-4o',
					model: 'openai/gpt-4o',
					provider: 'openai',
					type: 'llm',
					route: 'openai/gpt-4o',
					latency: '1.2',
					query_count: '42',
					max_tokens: 128000,
				},
			],
		});

		await Models.list(ctx, {});

		expect(models.size).toBe(1);
		expect(models.get('openai/gpt-4o')).toMatchObject({
			id: 'openai/gpt-4o',
			provider: 'openai',
			type: 'llm',
			// Numeric strings are preserved as strings, matching the API.
			latency: '1.2',
			query_count: '42',
			max_tokens: 128000,
		});
	});

	it('mirrors detailed models into their own table', async () => {
		const { ctx, modelDetails } = ctxWithDb();
		mockRequest.mockResolvedValue({
			object: 'list',
			data: [{ id: 'anthropic/claude-3', provider: 'anthropic', type: 'llm' }],
		});

		await Models.listDetailed(ctx, {});

		expect(modelDetails.get('anthropic/claude-3')).toMatchObject({
			id: 'anthropic/claude-3',
			provider: 'anthropic',
		});
	});

	it('keeps a detailed refresh from erasing cached pricing', async () => {
		const { ctx, models, modelDetails } = ctxWithDb();

		mockRequest.mockResolvedValue({
			object: 'list',
			data: [{ id: 'openai/gpt-4o', avg_cost: '0.005', price_type: 'per_1k' }],
		});
		await Models.list(ctx, {});

		// The detailed response carries no cost fields. Because the entity store
		// replaces the stored payload wholesale, writing it over the same row
		// would drop them — so it goes to a separate table instead.
		mockRequest.mockResolvedValue({
			object: 'list',
			data: [{ id: 'openai/gpt-4o', max_tokens: 128000 }],
		});
		await Models.listDetailed(ctx, {});

		expect(models.get('openai/gpt-4o')).toMatchObject({
			avg_cost: '0.005',
			price_type: 'per_1k',
		});
		expect(modelDetails.get('openai/gpt-4o')).toMatchObject({
			max_tokens: 128000,
		});
	});

	it('skips catalogue entries with no id', async () => {
		const { ctx, models } = ctxWithDb();
		mockRequest.mockResolvedValue({
			object: 'list',
			data: [{ provider: 'openai' }],
		});

		await Models.list(ctx, {});

		expect(models.size).toBe(0);
	});

	it('keys generated images uniquely per request and batch index', async () => {
		const { ctx, images } = ctxWithDb();
		mockRequest.mockResolvedValue({
			created: 1700000000,
			data: [
				{ url: 'https://example.com/a.png' },
				{ url: 'https://example.com/b.png', revised_prompt: 'a red cube' },
			],
		});

		await Images.generate(ctx, { model: 'dall-e-3', prompt: 'a cube' });

		expect(images.size).toBe(2);
		const secondKey = [...images.keys()][1];
		expect(secondKey).toBeDefined();
		expect(images.get(secondKey ?? '')).toMatchObject({
			id: secondKey,
			model: 'dall-e-3',
			prompt: 'a cube',
			url: 'https://example.com/b.png',
			revised_prompt: 'a red cube',
			created: 1700000000,
		});
	});

	it('caches images even when the API returns no timestamp', async () => {
		const { ctx, images } = ctxWithDb();
		mockRequest.mockResolvedValue({
			data: [{ url: 'https://example.com/a.png' }],
		});

		await Images.generate(ctx, { model: 'dall-e-3', prompt: 'a cube' });

		expect(images.size).toBe(1);
	});

	it('does not let two generations in the same second collide', async () => {
		const { ctx, images } = ctxWithDb();
		const payload = {
			created: 1700000000,
			data: [{ url: 'https://example.com/a.png' }],
		};

		mockRequest.mockResolvedValue(payload);
		await Images.generate(ctx, { model: 'dall-e-3', prompt: 'first' });
		await Images.generate(ctx, { model: 'dall-e-3', prompt: 'second' });

		// Keyed on the response timestamp alone these would share an id and the
		// second would overwrite the first.
		expect(images.size).toBe(2);
		const prompts = [...images.values()].map(
			(row) => (row as { prompt?: string }).prompt,
		);
		expect(prompts).toEqual(expect.arrayContaining(['first', 'second']));
	});

	it('never fails the call when the cache write throws', async () => {
		const ctx = {
			key: 'test_key',
			db: {
				models: {
					upsertByEntityId: jest.fn(async () => {
						throw new Error('store unavailable');
					}),
				},
			},
		} as unknown as ApipieContext;
		mockRequest.mockResolvedValue({ object: 'list', data: [{ id: 'a/b' }] });
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

		await expect(Models.list(ctx, {})).resolves.toBeDefined();
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});

	it('works when no entity store is configured', async () => {
		mockRequest.mockResolvedValue({ object: 'list', data: [{ id: 'a/b' }] });
		await expect(Models.list(testCtx('test_key'), {})).resolves.toBeDefined();
	});
});
