import { makeOpenRouterRequest } from './client';
import {
	ChatCompletions,
	Credits,
	Embeddings,
	Generations,
	Key,
	Messages,
	ModelEndpoints,
	Models,
	Providers,
	Zdr,
} from './endpoints';
import type {
	CreateAnthropicMessageResponse,
	CreateChatCompletionResponse,
	CreateCoinbaseChargeResponse,
	CreateEmbeddingOutput,
	GetKeyResponse,
	ListCreditsResponse,
	ListEmbeddingModelsResponse,
	ListModelEndpointsResponse,
	ListModelsCountResponse,
	ListModelsResponse,
	ListProvidersResponse,
	ListUserModelsResponse,
	ListZdrEndpointsResponse,
} from './endpoints/types';
import {
	OpenRouterEndpointInputSchemas,
	OpenRouterEndpointOutputSchemas,
} from './endpoints/types';
import type { OpenrouterContext } from './index';

// Handler tests mock the client; live tests (gated on OPENROUTER_API_KEY)
// fall through to the real implementation via jest.requireActual.
jest.mock('./client', () => ({
	makeOpenRouterRequest: jest.fn().mockImplementation((...args: unknown[]) => {
		const actual = jest.requireActual<typeof import('./client')>('./client');
		return actual.makeOpenRouterRequest(
			args[0] as string,
			args[1] as string,
			args[2] as
				| {
						method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
						body?: Record<string, unknown>;
						query?: Record<string, string | number | boolean | undefined>;
				  }
				| undefined,
		);
	}),
}));

const mockRequest = makeOpenRouterRequest as jest.MockedFunction<
	typeof makeOpenRouterRequest
>;

/** Minimal plugin context for live endpoint-handler tests. */
function testCtx(key: string): OpenrouterContext {
	return { key } as OpenrouterContext;
}

describe('OpenRouter schemas', () => {
	it('parses chatCompletions.create input and response', () => {
		const input =
			OpenRouterEndpointInputSchemas.chatCompletionsCreate.safeParse({
				model: 'openai/gpt-4o-mini',
				messages: [{ role: 'user', content: 'Hello' }],
				provider: { order: ['OpenAI'], allow_fallbacks: false },
			});
		expect(input.success).toBe(true);

		const output =
			OpenRouterEndpointOutputSchemas.chatCompletionsCreate.safeParse({
				id: 'gen-1',
				object: 'chat.completion',
				created: 1700000000,
				model: 'openai/gpt-4o-mini',
				choices: [
					{
						index: 0,
						message: { role: 'assistant', content: 'Hi there' },
						finish_reason: 'stop',
					},
				],
				usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
				provider: 'OpenAI',
			});
		expect(output.success).toBe(true);
	});

	it('parses messages.create input and response', () => {
		const input = OpenRouterEndpointInputSchemas.messagesCreate.safeParse({
			model: 'openai/gpt-4o-mini',
			maxTokens: 1024,
			messages: [{ role: 'user', content: 'Hello' }],
			system: 'Be brief',
		});
		expect(input.success).toBe(true);

		const output = OpenRouterEndpointOutputSchemas.messagesCreate.safeParse({
			id: 'gen-1',
			type: 'message',
			role: 'assistant',
			model: 'openai/gpt-4o-mini',
			stop_reason: 'end_turn',
			content: [{ type: 'text', text: 'Hi there' }],
			usage: { input_tokens: 13, output_tokens: 2 },
			provider: 'OpenAI',
		});
		expect(output.success).toBe(true);
	});

	it('parses models.list input and response', () => {
		const input = OpenRouterEndpointInputSchemas.modelsList.safeParse({});
		expect(input.success).toBe(true);

		const output = OpenRouterEndpointOutputSchemas.modelsList.safeParse({
			data: [
				{
					id: 'openai/gpt-4o-mini',
					name: 'OpenAI: GPT-4o mini',
					created: 1710000000,
					context_length: 128000,
					per_request_limits: null,
					pricing: { prompt: '0.00000015', completion: '0.0000006' },
				},
			],
		});
		expect(output.success).toBe(true);
	});

	it('parses embeddings.create input and response', () => {
		const input = OpenRouterEndpointInputSchemas.embeddingsCreate.safeParse({
			model: 'openai/text-embedding-3-small',
			input: 'Hello world',
		});
		expect(input.success).toBe(true);

		const output = OpenRouterEndpointOutputSchemas.embeddingsCreate.safeParse({
			id: 'emb-1',
			object: 'list',
			data: [{ object: 'embedding', embedding: [0.1, 0.2, 0.3] }],
			model: 'openai/text-embedding-3-small',
			usage: { prompt_tokens: 2, completion_tokens: 0, total_tokens: 2 },
		});
		expect(output.success).toBe(true);
	});

	it('parses modelEndpoints.list input and response', () => {
		const input = OpenRouterEndpointInputSchemas.modelsEndpointsList.safeParse({
			author: 'openai',
			slug: 'gpt-4o-mini',
		});
		expect(input.success).toBe(true);

		const output =
			OpenRouterEndpointOutputSchemas.modelsEndpointsList.safeParse({
				data: {
					id: 'openai/gpt-4o-mini',
					name: 'OpenAI: GPT-4o mini',
					created: 1721260800,
					endpoints: [
						{
							name: 'OpenAI | openai/gpt-4o-mini',
							provider_name: 'OpenAI',
							context_length: 128000,
							pricing: { prompt: '0.00000015', completion: '0.0000006' },
							supported_parameters: ['temperature', 'tools'],
							max_completion_tokens: 16384,
						},
					],
				},
			});
		expect(output.success).toBe(true);
	});

	it('parses providers.list input and response', () => {
		const input = OpenRouterEndpointInputSchemas.providersList.safeParse({});
		expect(input.success).toBe(true);

		const output = OpenRouterEndpointOutputSchemas.providersList.safeParse({
			data: [
				{ name: 'OpenAI', slug: 'openai' },
				{ name: 'Moonshot AI', slug: 'moonshotai', datacenters: ['SG'] },
			],
		});
		expect(output.success).toBe(true);
	});

	it('parses generations.get input and response', () => {
		const input = OpenRouterEndpointInputSchemas.generationsGet.safeParse({
			id: 'gen-1',
		});
		expect(input.success).toBe(true);

		const output = OpenRouterEndpointOutputSchemas.generationsGet.safeParse({
			data: {
				id: 'gen-1',
				model: 'openai/gpt-4o-mini',
				provider: 'OpenAI',
				created_at: '2024-01-01T00:00:00Z',
			},
		});
		expect(output.success).toBe(true);
	});

	it('parses credits.list input and response', () => {
		const input = OpenRouterEndpointInputSchemas.creditsList.safeParse({
			query: '2024-01-01',
		});
		expect(input.success).toBe(true);

		const output = OpenRouterEndpointOutputSchemas.creditsList.safeParse({
			data: { total_credits: 10, total_usage: 3.5 },
		});
		expect(output.success).toBe(true);
	});

	it('parses key.get input and response', () => {
		const input = OpenRouterEndpointInputSchemas.keyGet.safeParse({});
		expect(input.success).toBe(true);

		const output = OpenRouterEndpointOutputSchemas.keyGet.safeParse({
			data: {
				label: 'test-key',
				usage: 0.0000075,
				limit: null,
				is_free_tier: true,
			},
		});
		expect(output.success).toBe(true);
	});

	it('parses models.count input and response', () => {
		const input = OpenRouterEndpointInputSchemas.modelsCount.safeParse({});
		expect(input.success).toBe(true);

		const output = OpenRouterEndpointOutputSchemas.modelsCount.safeParse({
			data: { count: 400 },
		});
		expect(output.success).toBe(true);
	});

	it('parses models.listEmbeddings input and response', () => {
		const input = OpenRouterEndpointInputSchemas.modelsEmbeddingsList.safeParse(
			{ offset: 0, limit: 10 },
		);
		expect(input.success).toBe(true);

		const output =
			OpenRouterEndpointOutputSchemas.modelsEmbeddingsList.safeParse({
				data: [
					{
						id: 'openai/text-embedding-3-small',
						name: 'OpenAI: text-embedding-3-small',
						created: 1700000000,
						context_length: 8191,
						per_request_limits: null,
						pricing: { prompt: '0.00000002' },
					},
				],
			});
		expect(output.success).toBe(true);
	});

	it('parses models.listUser input and response', () => {
		const input = OpenRouterEndpointInputSchemas.modelsUserList.safeParse({});
		expect(input.success).toBe(true);

		const output = OpenRouterEndpointOutputSchemas.modelsUserList.safeParse({
			data: [
				{
					id: 'myorg/custom-model',
					name: 'Custom model',
					created: 1700000000,
				},
			],
		});
		expect(output.success).toBe(true);
	});

	it('parses zdr.list input and response', () => {
		const input = OpenRouterEndpointInputSchemas.zdrEndpointsList.safeParse({});
		expect(input.success).toBe(true);

		const output = OpenRouterEndpointOutputSchemas.zdrEndpointsList.safeParse({
			data: [
				{
					name: 'ZDR region | openai/gpt-4o-mini',
					provider_name: 'OpenAI',
					context_length: 128000,
				},
			],
		});
		expect(output.success).toBe(true);
	});

	it('parses credits.createCoinbaseCharge input and response', () => {
		const input =
			OpenRouterEndpointInputSchemas.creditsCoinbaseCreate.safeParse({
				amount: 50.25,
				sender: '0x1234567890123456789012345678901234567890',
				chainId: 8453,
			});
		expect(input.success).toBe(true);

		const invalid =
			OpenRouterEndpointInputSchemas.creditsCoinbaseCreate.safeParse({
				amount: 10,
				sender: '0x1234',
				chainId: 999,
			});
		expect(invalid.success).toBe(false);

		const output =
			OpenRouterEndpointOutputSchemas.creditsCoinbaseCreate.safeParse({
				data: {
					id: 'charge-id',
					chain_id: 8453,
					sender: '0x1234567890123456789012345678901234567890',
					addresses: {
						'8453:0xcharge123': '0xcharge123',
					},
					calldata: {
						'8453:0xcharge123': '0xdeadbeef',
					},
					created_at: '2026-01-01T00:00:00Z',
					expires_at: '2026-01-08T00:00:00Z',
				},
			});
		expect(output.success).toBe(true);
	});

	it('rejects invalid chatCompletions.create input', () => {
		const invalid =
			OpenRouterEndpointInputSchemas.chatCompletionsCreate.safeParse({
				model: 'openai/gpt-4o-mini',
				// messages required — empty object should fail
			});
		expect(invalid.success).toBe(false);
	});
});

describe('OpenRouter endpoint handlers (mocked client)', () => {
	beforeEach(() => {
		mockRequest.mockClear();
	});

	it('ChatCompletions.createChatCompletion POSTs to chat/completions', async () => {
		const response = {
			id: 'gen-1',
			object: 'chat.completion',
			created: 1700000000,
			model: 'openai/gpt-4o-mini',
			choices: [
				{
					index: 0,
					message: { role: 'assistant', content: 'Hi' },
					finish_reason: 'stop',
				},
			],
			usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
		} as CreateChatCompletionResponse;
		mockRequest.mockResolvedValueOnce(response);

		const result = await ChatCompletions.createChatCompletion(testCtx('k'), {
			model: 'openai/gpt-4o-mini',
			messages: [{ role: 'user', content: 'Hi' }],
			temperature: 0.5,
			provider: { order: ['OpenAI'] },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'chat/completions',
			'k',
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({
					model: 'openai/gpt-4o-mini',
					stream: false,
					temperature: 0.5,
					provider: { order: ['OpenAI'] },
				}),
			}),
		);
		const parsed =
			OpenRouterEndpointOutputSchemas.chatCompletionsCreate.safeParse(result);
		expect(parsed.success).toBe(true);
	});

	it('Messages.createAnthropicMessage POSTs to messages', async () => {
		const response = {
			id: 'gen-2',
			type: 'message',
			role: 'assistant',
			model: 'openai/gpt-4o-mini',
			stop_reason: 'end_turn',
			content: [{ type: 'text', text: 'Hi' }],
			usage: { input_tokens: 13, output_tokens: 2 },
		};
		mockRequest.mockResolvedValueOnce(response);

		const result = await Messages.createAnthropicMessage(testCtx('k'), {
			model: 'openai/gpt-4o-mini',
			maxTokens: 64,
			messages: [{ role: 'user', content: 'Hi' }],
			system: 'Be brief',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'messages',
			'k',
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({
					model: 'openai/gpt-4o-mini',
					max_tokens: 64,
					stream: false,
					system: 'Be brief',
				}),
			}),
		);
		expect(result.content[0]?.text).toBe('Hi');
	});

	it('Models.listModels GETs models', async () => {
		const response = {
			data: [{ id: 'openai/gpt-4o-mini' }],
		} as ListModelsResponse;
		mockRequest.mockResolvedValueOnce(response);

		const result = await Models.listModels(testCtx('k'), {});

		expect(mockRequest).toHaveBeenCalledWith('models', 'k');
		expect(result.data[0]?.id).toBe('openai/gpt-4o-mini');
	});

	it('Embeddings.createEmbedding POSTs to embeddings', async () => {
		const response = {
			object: 'list',
			data: [{ object: 'embedding', embedding: [0.1, 0.2] }],
			model: 'openai/text-embedding-3-small',
			usage: { prompt_tokens: 2, completion_tokens: 0, total_tokens: 2 },
		};
		mockRequest.mockResolvedValueOnce(response);

		const result = await Embeddings.createEmbedding(testCtx('k'), {
			model: 'openai/text-embedding-3-small',
			input: ['a', 'b'],
			encodingFormat: 'float',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'embeddings',
			'k',
			expect.objectContaining({
				method: 'POST',
				body: expect.objectContaining({
					model: 'openai/text-embedding-3-small',
					input: ['a', 'b'],
					encoding_format: 'float',
				}),
			}),
		);
		expect(result.data[0]?.embedding).toEqual([0.1, 0.2]);
	});

	it('ModelEndpoints.listModelEndpoints GETs models/:author/:slug/endpoints', async () => {
		const response = {
			data: { id: 'openai/gpt-4o-mini', name: 'x', endpoints: [] },
		};
		mockRequest.mockResolvedValueOnce(response);

		await ModelEndpoints.listModelEndpoints(testCtx('k'), {
			author: 'openai',
			slug: 'gpt-4o-mini',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'models/openai/gpt-4o-mini/endpoints',
			'k',
		);
	});

	it('Models.listModelsCount GETs models/count', async () => {
		const response = { data: { count: 400 } } as ListModelsCountResponse;
		mockRequest.mockResolvedValueOnce(response);

		const result = await Models.listModelsCount(testCtx('k'), {});

		expect(mockRequest).toHaveBeenCalledWith('models/count', 'k');
		expect(result.data.count).toBe(400);
	});

	it('Models.listEmbeddingModels GETs embeddings/models with pagination', async () => {
		const response = {
			data: [{ id: 'openai/text-embedding-3-small' }],
		} as ListEmbeddingModelsResponse;
		mockRequest.mockResolvedValueOnce(response);

		const result = await Models.listEmbeddingModels(testCtx('k'), {
			offset: 0,
			limit: 10,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'embeddings/models',
			'k',
			expect.objectContaining({ query: { offset: 0, limit: 10 } }),
		);
		expect(result.data[0]?.id).toBe('openai/text-embedding-3-small');
	});

	it('Models.listUserModels GETs models/user', async () => {
		const response = {
			data: [{ id: 'myorg/custom-model' }],
		} as ListUserModelsResponse;
		mockRequest.mockResolvedValueOnce(response);

		const result = await Models.listUserModels(testCtx('k'), {});

		expect(mockRequest).toHaveBeenCalledWith('models/user', 'k');
		expect(result.data[0]?.id).toBe('myorg/custom-model');
	});

	it('Zdr.listZdrEndpoints GETs endpoints/zdr', async () => {
		const response = {
			data: [{ name: 'ZDR region', provider_name: 'OpenAI' }],
		} as ListZdrEndpointsResponse;
		mockRequest.mockResolvedValueOnce(response);

		const result = await Zdr.listZdrEndpoints(testCtx('k'), {});

		expect(mockRequest).toHaveBeenCalledWith('endpoints/zdr', 'k');
		expect(result.data[0]?.provider_name).toBe('OpenAI');
	});

	it('Credits.createCoinbaseCharge POSTs to credits/coinbase', async () => {
		const response = {
			data: {
				id: 'charge-id',
				chain_id: 8453,
				sender: '0x1234567890123456789012345678901234567890',
			},
		} as CreateCoinbaseChargeResponse;
		mockRequest.mockResolvedValueOnce(response);

		const result = await Credits.createCoinbaseCharge(testCtx('k'), {
			amount: 50.25,
			sender: '0x1234567890123456789012345678901234567890',
			chainId: 8453,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'credits/coinbase',
			'k',
			expect.objectContaining({
				method: 'POST',
				body: {
					amount: 50.25,
					sender: '0x1234567890123456789012345678901234567890',
					chain_id: 8453,
				},
			}),
		);
		expect(result.data.id).toBe('charge-id');
	});

	it('Providers.listProviders GETs providers', async () => {
		const response = {
			data: [{ name: 'OpenAI', slug: 'openai' }],
		} as ListProvidersResponse;
		mockRequest.mockResolvedValueOnce(response);

		const result = await Providers.listProviders(testCtx('k'), {});

		expect(mockRequest).toHaveBeenCalledWith('providers', 'k');
		expect(result.data[0]?.slug).toBe('openai');
	});

	it('Generations.getGeneration GETs generation with id query', async () => {
		const response = { data: { id: 'gen-1' } };
		mockRequest.mockResolvedValueOnce(response);

		const result = await Generations.getGeneration(testCtx('k'), {
			id: 'gen-1',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'generation',
			'k',
			expect.objectContaining({ query: { id: 'gen-1' } }),
		);
		expect(result.data.id).toBe('gen-1');
	});

	it('Credits.listCredits GETs credits with optional ZDR params', async () => {
		const response = {
			data: { total_credits: 10, total_usage: 2 },
		} as ListCreditsResponse;
		mockRequest.mockResolvedValueOnce(response);

		const result = await Credits.listCredits(testCtx('k'), {});

		expect(mockRequest).toHaveBeenCalledWith('credits', 'k', {
			query: {
				query: undefined,
				cursor: undefined,
				per_page: undefined,
				max_age: undefined,
			},
		});
		expect(result.data.total_credits).toBe(10);
	});

	it('Key.getKey GETs key', async () => {
		const response = {
			data: { usage: 0.1, is_free_tier: false },
		} as GetKeyResponse;
		mockRequest.mockResolvedValueOnce(response);

		const result = await Key.getKey(testCtx('k'), {});

		expect(mockRequest).toHaveBeenCalledWith('key', 'k');
		expect(result.data.usage).toBe(0.1);
	});
});

const TEST_API_KEY = process.env.OPENROUTER_API_KEY;
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

describeIfApiKey('OpenRouter API type tests (live)', () => {
	it('chat completion returns the expected shape', async () => {
		const response = await makeOpenRouterRequest<CreateChatCompletionResponse>(
			'chat/completions',
			TEST_API_KEY!,
			{
				method: 'POST',
				body: {
					model: 'openai/gpt-4o-mini',
					messages: [{ role: 'user', content: 'Say hello in one word.' }],
					stream: false,
					max_tokens: 16,
				},
			},
		);

		const parsed =
			OpenRouterEndpointOutputSchemas.chatCompletionsCreate.safeParse(response);
		expect(parsed.success).toBe(true);
	});

	it('anthropic messages returns the expected shape', async () => {
		const response =
			await makeOpenRouterRequest<CreateAnthropicMessageResponse>(
				'messages',
				TEST_API_KEY!,
				{
					method: 'POST',
					body: {
						model: 'openai/gpt-4o-mini',
						max_tokens: 32,
						messages: [{ role: 'user', content: 'Say hello in one word.' }],
						stream: false,
					},
				},
			);

		const parsed =
			OpenRouterEndpointOutputSchemas.messagesCreate.safeParse(response);
		expect(parsed.success).toBe(true);
	});

	it('models list returns the expected shape', async () => {
		const response = await makeOpenRouterRequest<ListModelsResponse>(
			'models',
			TEST_API_KEY!,
			{ method: 'GET' },
		);

		const parsed =
			OpenRouterEndpointOutputSchemas.modelsList.safeParse(response);
		expect(parsed.success).toBe(true);
	});

	it('models count returns the expected shape', async () => {
		const response = await makeOpenRouterRequest<ListModelsCountResponse>(
			'models/count',
			TEST_API_KEY!,
			{ method: 'GET' },
		);

		const parsed =
			OpenRouterEndpointOutputSchemas.modelsCount.safeParse(response);
		expect(parsed.success).toBe(true);
	});

	it('embedding models list returns the expected shape', async () => {
		const response = await makeOpenRouterRequest<ListEmbeddingModelsResponse>(
			'embeddings/models',
			TEST_API_KEY!,
			{ method: 'GET' },
		);

		const parsed =
			OpenRouterEndpointOutputSchemas.modelsEmbeddingsList.safeParse(response);
		expect(parsed.success).toBe(true);
	});

	it('user models list returns the expected shape', async () => {
		const response = await makeOpenRouterRequest<ListUserModelsResponse>(
			'models/user',
			TEST_API_KEY!,
			{ method: 'GET' },
		);

		const parsed =
			OpenRouterEndpointOutputSchemas.modelsUserList.safeParse(response);
		expect(parsed.success).toBe(true);
	});

	it('zdr endpoints returns the expected shape', async () => {
		const response = await makeOpenRouterRequest<ListZdrEndpointsResponse>(
			'endpoints/zdr',
			TEST_API_KEY!,
			{ method: 'GET' },
		);

		const parsed =
			OpenRouterEndpointOutputSchemas.zdrEndpointsList.safeParse(response);
		expect(parsed.success).toBe(true);
	});

	it('model endpoints returns the expected shape', async () => {
		const response = await makeOpenRouterRequest<ListModelEndpointsResponse>(
			'models/openai/gpt-4o-mini/endpoints',
			TEST_API_KEY!,
			{ method: 'GET' },
		);

		const parsed =
			OpenRouterEndpointOutputSchemas.modelsEndpointsList.safeParse(response);
		expect(parsed.success).toBe(true);
	});

	it('embeddings returns the expected shape', async () => {
		const response = await makeOpenRouterRequest<CreateEmbeddingOutput>(
			'embeddings',
			TEST_API_KEY!,
			{
				method: 'POST',
				body: {
					model: 'openai/text-embedding-3-small',
					input: 'hello world',
				},
			},
		);

		const parsed =
			OpenRouterEndpointOutputSchemas.embeddingsCreate.safeParse(response);
		expect(parsed.success).toBe(true);
	});

	it('providers returns the expected shape', async () => {
		const response = await makeOpenRouterRequest<ListProvidersResponse>(
			'providers',
			TEST_API_KEY!,
			{ method: 'GET' },
		);

		const parsed =
			OpenRouterEndpointOutputSchemas.providersList.safeParse(response);
		expect(parsed.success).toBe(true);
	});

	it('credits returns the expected shape', async () => {
		const response = await makeOpenRouterRequest<ListCreditsResponse>(
			'credits',
			TEST_API_KEY!,
			{ method: 'GET' },
		);

		const parsed =
			OpenRouterEndpointOutputSchemas.creditsList.safeParse(response);
		expect(parsed.success).toBe(true);
	});

	it('key returns the expected shape', async () => {
		const response = await makeOpenRouterRequest<GetKeyResponse>(
			'key',
			TEST_API_KEY!,
			{ method: 'GET' },
		);

		const parsed = OpenRouterEndpointOutputSchemas.keyGet.safeParse(response);
		expect(parsed.success).toBe(true);
	});
});
