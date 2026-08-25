import type { CorsairErrorHandler } from 'corsair/core';
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
	CreateChatCompletionResponse,
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
	ChatMessageSchema,
	OpenRouterEndpointInputSchemas,
	OpenRouterEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { OpenrouterContext } from './index';

const typedErrorHandlers: CorsairErrorHandler = errorHandlers;

jest.mock('./client', () => ({
	makeOpenRouterRequest: jest.fn(),
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

	it('validates optional Anthropic maxTokens bounds', () => {
		const base = {
			model: 'anthropic/claude-sonnet-4',
			messages: [{ role: 'user' as const, content: 'Hello' }],
		};

		expect(
			OpenRouterEndpointInputSchemas.messagesCreate.safeParse(base).success,
		).toBe(true);
		expect(
			OpenRouterEndpointInputSchemas.messagesCreate.safeParse({
				...base,
				maxTokens: 0,
			}).success,
		).toBe(false);
		expect(
			OpenRouterEndpointInputSchemas.messagesCreate.safeParse({
				...base,
				maxTokens: 1.5,
			}).success,
		).toBe(false);
		expect(
			OpenRouterEndpointInputSchemas.messagesCreate.safeParse({
				...base,
				maxTokens: 1,
			}).success,
		).toBe(true);
	});

	it('validates optional chat maxTokens and maxCompletionTokens bounds', () => {
		const base = {
			model: 'openai/gpt-4o-mini',
			messages: [{ role: 'user' as const, content: 'Hello' }],
		};

		expect(
			OpenRouterEndpointInputSchemas.chatCompletionsCreate.safeParse(base)
				.success,
		).toBe(true);
		expect(
			OpenRouterEndpointInputSchemas.chatCompletionsCreate.safeParse({
				...base,
				maxTokens: 0,
			}).success,
		).toBe(false);
		expect(
			OpenRouterEndpointInputSchemas.chatCompletionsCreate.safeParse({
				...base,
				maxTokens: 1.5,
			}).success,
		).toBe(false);
		expect(
			OpenRouterEndpointInputSchemas.chatCompletionsCreate.safeParse({
				...base,
				maxCompletionTokens: -1,
			}).success,
		).toBe(false);
		expect(
			OpenRouterEndpointInputSchemas.chatCompletionsCreate.safeParse({
				...base,
				maxTokens: 1,
				maxCompletionTokens: 16,
			}).success,
		).toBe(true);
	});

	it('supports multi-turn chat tool calls', () => {
		const parsed = ChatMessageSchema.safeParse({
			role: 'assistant',
			content: null,
			tool_calls: [
				{
					id: 'call-1',
					type: 'function',
					function: { name: 'lookup', arguments: '{"id":"1"}' },
				},
			],
		});

		expect(parsed.success).toBe(true);
	});

	it('rejects unsupported streaming requests', () => {
		const parsed =
			OpenRouterEndpointInputSchemas.chatCompletionsCreate.safeParse({
				model: 'openai/gpt-4o-mini',
				messages: [{ role: 'user', content: 'Hello' }],
				stream: true,
			});

		expect(parsed.success).toBe(false);
	});

	it('supports Anthropic image, tool, and thinking blocks', () => {
		const input = OpenRouterEndpointInputSchemas.messagesCreate.safeParse({
			model: 'anthropic/claude-sonnet-4',
			maxTokens: 1024,
			messages: [
				{
					role: 'user',
					content: [
						{
							type: 'image',
							source: {
								type: 'base64',
								media_type: 'image/png',
								data: 'aW1hZ2U=',
							},
						},
						{
							type: 'document',
							source: {
								type: 'text',
								media_type: 'text/plain',
								data: 'Document text',
							},
						},
						{
							type: 'document',
							source: {
								type: 'file',
								file_id: 'file-1',
							},
						},
						{
							type: 'document',
							title: null,
							context: null,
							source: {
								type: 'content',
								content: [{ type: 'text', text: 'Nested text' }],
							},
						},
						{
							type: 'tool_result',
							tool_use_id: 'tool-1',
							content: [{ type: 'text', text: 'done' }],
						},
					],
				},
			],
			tools: [
				{
					name: 'lookup',
					description: 'Look up a record',
					input_schema: { type: 'object' },
				},
			],
			thinking: { type: 'enabled', budget_tokens: 1024 },
		});
		expect(input.success).toBe(true);

		const invalidToolChoice =
			OpenRouterEndpointInputSchemas.messagesCreate.safeParse({
				model: 'anthropic/claude-sonnet-4',
				maxTokens: 1024,
				messages: [{ role: 'user', content: 'Hello' }],
				toolChoice: { type: 'tool' },
			});
		expect(invalidToolChoice.success).toBe(false);

		const output = OpenRouterEndpointOutputSchemas.messagesCreate.safeParse({
			id: 'msg-1',
			type: 'message',
			role: 'assistant',
			model: 'anthropic/claude-sonnet-4',
			stop_reason: 'tool_use',
			content: [
				{ type: 'thinking', thinking: 'Need a lookup', signature: 'sig' },
				{
					type: 'tool_use',
					id: 'tool-1',
					name: 'lookup',
					input: { id: '1' },
				},
			],
			usage: {
				input_tokens: 10,
				output_tokens: 20,
				output_tokens_details: null,
			},
		});
		expect(output.success).toBe(true);

		const nullableTextOutput =
			OpenRouterEndpointOutputSchemas.messagesCreate.safeParse({
				id: 'msg-2',
				type: 'message',
				role: 'assistant',
				model: 'anthropic/claude-sonnet-4',
				stop_reason: 'end_turn',
				content: [{ type: 'text', text: 'Hi', citations: null }],
				usage: { input_tokens: 1, output_tokens: 1 },
			});
		expect(nullableTextOutput.success).toBe(true);
	});

	it('supports reasoning output and per-request ZDR', () => {
		const input =
			OpenRouterEndpointInputSchemas.chatCompletionsCreate.safeParse({
				model: 'openai/o4-mini',
				messages: [{ role: 'user', content: 'Reason about this' }],
				reasoning: { effort: 'xhigh', summary: 'detailed' },
				provider: { zdr: true },
			});
		expect(input.success).toBe(true);

		const output =
			OpenRouterEndpointOutputSchemas.chatCompletionsCreate.safeParse({
				id: 'gen-1',
				object: 'chat.completion',
				created: 1700000000,
				model: 'openai/o4-mini',
				choices: [
					{
						index: 0,
						message: {
							role: 'assistant',
							content: 'Answer',
							reasoning: 'Reasoning text',
							reasoning_details: [{ type: 'reasoning.text', text: 'detail' }],
						},
						finish_reason: 'stop',
					},
				],
				usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
			});
		expect(output.success).toBe(true);
	});

	it('parses models.list input and response', () => {
		const input = OpenRouterEndpointInputSchemas.modelsList.safeParse({
			offset: 10,
			limit: 25,
		});
		expect(input.success).toBe(true);
		if (input.success) {
			expect(input.data).toMatchObject({ offset: 10, limit: 25 });
		}

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

	it('preserves model pagination metadata', () => {
		const output = OpenRouterEndpointOutputSchemas.modelsList.safeParse({
			data: [],
			links: { next: 'https://openrouter.ai/api/v1/models?cursor=next' },
			total_count: 42,
		});

		expect(output.success).toBe(true);
		if (output.success) {
			expect(output.data).toMatchObject({
				links: { next: 'https://openrouter.ai/api/v1/models?cursor=next' },
				total_count: 42,
			});
		}
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

	it('accepts token embedding input and responses without usage', () => {
		const input = OpenRouterEndpointInputSchemas.embeddingsCreate.safeParse({
			model: 'openai/text-embedding-3-small',
			input: [12, 34, 56],
		});
		expect(input.success).toBe(true);

		const output = OpenRouterEndpointOutputSchemas.embeddingsCreate.safeParse({
			object: 'list',
			data: [{ object: 'embedding', embedding: [0.1, 0.2] }],
			model: 'openai/text-embedding-3-small',
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

	it('parses the official numeric generation usage field', () => {
		const output = OpenRouterEndpointOutputSchemas.generationsGet.safeParse({
			data: {
				id: 'gen-1',
				provider_name: null,
				usage: 0.0025,
				streamed: null,
				tokens_prompt: null,
				tokens_completion: null,
				provider_responses: null,
			},
		});

		expect(output.success).toBe(true);
	});

	it('parses credits.list input and response', () => {
		const input = OpenRouterEndpointInputSchemas.creditsList.safeParse({});
		expect(input.success).toBe(true);

		const unsupportedFilters =
			OpenRouterEndpointInputSchemas.creditsList.safeParse({
				query: '2024-01-01',
			});
		expect(unsupportedFilters.success).toBe(false);

		const output = OpenRouterEndpointOutputSchemas.creditsList.safeParse({
			data: { total_credits: 10, total_usage: 3.5 },
		});
		expect(output.success).toBe(true);

		const missingUsage = OpenRouterEndpointOutputSchemas.creditsList.safeParse({
			data: { total_credits: 10 },
		});
		expect(missingUsage.success).toBe(false);
	});

	it('parses key.get input and response', () => {
		const input = OpenRouterEndpointInputSchemas.keyGet.safeParse({});
		expect(input.success).toBe(true);

		const output = OpenRouterEndpointOutputSchemas.keyGet.safeParse({
			data: {
				label: 'test-key',
				usage: 0.0000075,
				usage_daily: 0.000001,
				byok_usage: 0,
				limit: null,
				limit_reset: null,
				include_byok_in_limit: false,
				creator_user_id: 'user-1',
				is_free_tier: true,
			},
		});
		expect(output.success).toBe(true);
		if (output.success) {
			expect(output.data.data.usage_daily).toBe(0.000001);
			expect(output.data.data.include_byok_in_limit).toBe(false);
		}
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
		const input = OpenRouterEndpointInputSchemas.modelsUserList.safeParse({
			offset: 5,
			limit: 50,
		});
		expect(input.success).toBe(true);
		if (input.success) {
			expect(input.data).toMatchObject({ offset: 5, limit: 50 });
		}

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

	it('exposes exactly 13 supported operations', () => {
		expect(Object.keys(OpenRouterEndpointInputSchemas)).toHaveLength(13);
		expect('creditsCoinbaseCreate' in OpenRouterEndpointInputSchemas).toBe(
			false,
		);
		expect('embeddingsCreate' in OpenRouterEndpointInputSchemas).toBe(true);
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
		mockRequest.mockReset();
		mockRequest.mockRejectedValue(
			new Error('Unexpected unmocked OpenRouter request in offline test'),
		);
	});

	it('does not fall through to the live API', async () => {
		await expect(Models.listModels(testCtx('k'), {})).rejects.toThrow(
			'Unexpected unmocked OpenRouter request',
		);
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
			tools: [{ name: 'lookup', input_schema: { type: 'object' } }],
			thinking: { type: 'enabled', budget_tokens: 1024 },
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
					tools: [{ name: 'lookup', input_schema: { type: 'object' } }],
					thinking: { type: 'enabled', budget_tokens: 1024 },
				}),
			}),
		);
		expect(result.content[0]).toMatchObject({ type: 'text', text: 'Hi' });
	});

	it('Models.listModels GETs models', async () => {
		const response = {
			data: [{ id: 'openai/gpt-4o-mini' }],
		} as ListModelsResponse;
		mockRequest.mockResolvedValueOnce(response);

		const result = await Models.listModels(testCtx('k'), {
			offset: 10,
			limit: 25,
		});

		expect(mockRequest).toHaveBeenCalledWith('models', 'k', {
			query: { offset: 10, limit: 25 },
		});
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

	it('encodes model endpoint path segments', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { id: 'author/model', name: 'Model', endpoints: [] },
		});

		await ModelEndpoints.listModelEndpoints(testCtx('k'), {
			author: 'author/name',
			slug: 'model?variant=free',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'models/author%2Fname/model%3Fvariant%3Dfree/endpoints',
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

		const result = await Models.listUserModels(testCtx('k'), {
			offset: 5,
			limit: 50,
		});

		expect(mockRequest).toHaveBeenCalledWith('models/user', 'k', {
			query: { offset: 5, limit: 50 },
		});
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

	it('Credits.listCredits GETs credits', async () => {
		const response = {
			data: { total_credits: 10, total_usage: 2 },
		} as ListCreditsResponse;
		mockRequest.mockResolvedValueOnce(response);

		const result = await Credits.listCredits(testCtx('k'), {});

		expect(mockRequest).toHaveBeenCalledWith('credits', 'k');
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

	function cacheCtx() {
		const models = { upsertByEntityId: jest.fn().mockResolvedValue(undefined) };
		const providers = {
			upsertByEntityId: jest.fn().mockResolvedValue(undefined),
		};
		const generations = {
			upsertByEntityId: jest.fn().mockResolvedValue(undefined),
		};
		return {
			ctx: { key: 'k', db: { models, providers, generations } } as never,
			models,
			providers,
			generations,
		};
	}

	it('listModels caches each model', async () => {
		mockRequest.mockResolvedValueOnce({
			data: [
				{
					id: 'openai/gpt-4o-mini',
					name: 'GPT-4o mini',
					context_length: 128000,
				},
			],
		});
		const { ctx, models } = cacheCtx();
		await Models.listModels(ctx, {});
		expect(models.upsertByEntityId).toHaveBeenCalledWith(
			'openai/gpt-4o-mini',
			expect.objectContaining({
				id: 'openai/gpt-4o-mini',
				name: 'GPT-4o mini',
				context_length: 128000,
			}),
		);
	});

	it('listEmbeddingModels caches each model', async () => {
		mockRequest.mockResolvedValueOnce({
			data: [{ id: 'openai/text-embedding-3-small' }],
		});
		const { ctx, models } = cacheCtx();
		await Models.listEmbeddingModels(ctx, {});
		expect(models.upsertByEntityId).toHaveBeenCalledWith(
			'openai/text-embedding-3-small',
			expect.objectContaining({ id: 'openai/text-embedding-3-small' }),
		);
	});

	it('listUserModels caches each model', async () => {
		mockRequest.mockResolvedValueOnce({
			data: [{ id: 'myorg/custom-model' }],
		});
		const { ctx, models } = cacheCtx();
		await Models.listUserModels(ctx, {});
		expect(models.upsertByEntityId).toHaveBeenCalledWith(
			'myorg/custom-model',
			expect.objectContaining({ id: 'myorg/custom-model' }),
		);
	});

	it('listProviders caches each provider', async () => {
		mockRequest.mockResolvedValueOnce({
			data: [{ name: 'OpenAI', slug: 'openai', headquarters: 'US' }],
		});
		const { ctx, providers } = cacheCtx();
		await Providers.listProviders(ctx, {});
		expect(providers.upsertByEntityId).toHaveBeenCalledWith(
			'openai',
			expect.objectContaining({ slug: 'openai', name: 'OpenAI' }),
		);
	});

	it('getGeneration caches the generation', async () => {
		mockRequest.mockResolvedValueOnce({
			data: { id: 'gen-1', model: 'openai/gpt-4o-mini', total_cost: 0.01 },
		});
		const { ctx, generations } = cacheCtx();
		await Generations.getGeneration(ctx, { id: 'gen-1' });
		expect(generations.upsertByEntityId).toHaveBeenCalledWith(
			'gen-1',
			expect.objectContaining({ id: 'gen-1', model: 'openai/gpt-4o-mini' }),
		);
	});

	it('cache write failures do not fail the API call', async () => {
		mockRequest.mockResolvedValueOnce({
			data: [{ id: 'openai/gpt-4o-mini' }],
		});
		const { ctx, models } = cacheCtx();
		models.upsertByEntityId.mockRejectedValueOnce(new Error('db down'));
		await expect(Models.listModels(ctx, {})).resolves.toMatchObject({
			data: [{ id: 'openai/gpt-4o-mini' }],
		});
	});
});

describe('OpenRouter error handlers', () => {
	const writeContext = {
		pluginId: 'openrouter',
		operation: 'chatCompletions.create',
		input: {},
		originalError: new Error('server error'),
	};
	const readContext = {
		...writeContext,
		operation: 'models.list',
	};

	it('does not retry paid write operations on server errors', async () => {
		const strategy = await typedErrorHandlers.SERVER_ERROR!.handler(
			new Error('server error'),
			writeContext,
		);
		expect(strategy.maxRetries).toBe(0);
	});

	it('retries read operations on server errors', async () => {
		const strategy = await typedErrorHandlers.SERVER_ERROR!.handler(
			new Error('server error'),
			readContext,
		);
		expect(strategy.maxRetries).toBe(3);
	});

	it('does not retry paid writes after timeouts', async () => {
		expect(
			typedErrorHandlers.TIMEOUT_ERROR!.match(
				new Error('request timed out'),
				writeContext,
			),
		).toBe(true);

		const strategy = await typedErrorHandlers.TIMEOUT_ERROR!.handler(
			new Error('request timed out'),
			writeContext,
		);
		expect(strategy.maxRetries).toBe(0);
	});

	it('does not classify unrelated numeric messages as rate limits', () => {
		expect(
			typedErrorHandlers.RATE_LIMIT_ERROR!.match(
				new Error('model-4290 completed in 4290ms'),
				readContext,
			),
		).toBe(false);
	});
});

const TEST_API_KEY = process.env.OPENROUTER_API_KEY;
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

describeIfApiKey('OpenRouter API type tests (live)', () => {
	const makeOpenRouterRequest =
		jest.requireActual<typeof import('./client')>(
			'./client',
		).makeOpenRouterRequest;

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
