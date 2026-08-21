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

const TEST_API_KEY = process.env.APIPIE_API_KEY;
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

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

	it('returns retry config for rate limit errors', async () => {
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			new Error('rate_limited'),
		);
		expect(result.maxRetries).toBe(5);
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

describeIfApiKey('Apipie live API (requires APIPIE_API_KEY)', () => {
	const ctx = testCtx(TEST_API_KEY ?? '');

	it('lists models live', async () => {
		const result = await Models.list(ctx, {});
		const count = Array.isArray(result)
			? result.length
			: (result?.data?.length ?? 0);
		expect(count).toBeGreaterThan(0);
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
