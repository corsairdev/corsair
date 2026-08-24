import { ApiError } from 'corsair/http';
import { ASSISTANTS_BETA_HEADERS, makeAimlApiRequest } from './client';
import {
	Assistants,
	Batches,
	Billing,
	Chat,
	Luma,
	Messages,
	Models,
	Responses,
	RunSteps,
	Runs,
	Threads,
} from './endpoints';
import {
	AimlApiEndpointInputSchemas,
	AimlApiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { AimlApiContext } from './index';
import { aimlapi } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeAimlApiRequest: jest.fn(),
	};
});

/** Minimal plugin context for endpoint handler tests. */
function testCtx(key: string): AimlApiContext {
	return {
		key,
	} as AimlApiContext;
}

const TEST_API_KEY = process.env.AIMLAPI_API_KEY;
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;
const beta = { headers: ASSISTANTS_BETA_HEADERS };

describe('AimlApi endpoint input schemas', () => {
	it('validates models.list input', () => {
		expect(AimlApiEndpointInputSchemas.modelsList.safeParse({}).success).toBe(
			true,
		);
	});

	it('validates chat.createCompletion input', () => {
		const valid = AimlApiEndpointInputSchemas.chatCreateCompletion.safeParse({
			model: 'gpt-4o',
			messages: [{ role: 'user', content: 'Hello' }],
		});
		expect(valid.success).toBe(true);
	});

	it('rejects chat.createCompletion without messages', () => {
		const invalid = AimlApiEndpointInputSchemas.chatCreateCompletion.safeParse({
			model: 'gpt-4o',
		});
		expect(invalid.success).toBe(false);
	});

	it('allows assistants.update without model', () => {
		const valid = AimlApiEndpointInputSchemas.assistantsUpdate.safeParse({
			assistantId: 'asst_123',
			name: 'Updated',
		});
		expect(valid.success).toBe(true);
	});

	it('requires batches.list batchId', () => {
		expect(AimlApiEndpointInputSchemas.batchesList.safeParse({}).success).toBe(
			false,
		);
		expect(
			AimlApiEndpointInputSchemas.batchesList.safeParse({
				batchId: 'msgbatch_123',
			}).success,
		).toBe(true);
	});

	it('accepts luma.getGeneration via single generationId or ids', () => {
		expect(
			AimlApiEndpointInputSchemas.lumaGetGeneration.safeParse({
				generationId: 'gen_1',
			}).success,
		).toBe(true);
		expect(
			AimlApiEndpointInputSchemas.lumaGetGeneration.safeParse({
				ids: 'gen_1',
			}).success,
		).toBe(true);
		expect(
			AimlApiEndpointInputSchemas.lumaGetGeneration.safeParse({
				ids: 'gen_1,gen_2',
			}).success,
		).toBe(false);
		expect(
			AimlApiEndpointInputSchemas.lumaGetGeneration.safeParse({}).success,
		).toBe(false);
	});

	it('submitToolOutputs schema has no stream field', () => {
		const keys = Object.keys(
			AimlApiEndpointInputSchemas.runsSubmitToolOutputs.shape,
		);
		expect(keys).not.toContain('stream');
		expect(keys).toContain('toolOutputs');
	});
});

describe('AimlApi endpoint output schemas', () => {
	it('parses chat completion response', () => {
		const output = AimlApiEndpointOutputSchemas.chatCreateCompletion.safeParse({
			id: 'chatcmpl-123',
			object: 'chat.completion',
			choices: [{ index: 0, message: { role: 'assistant', content: 'Hi' } }],
		});
		expect(output.success).toBe(true);
	});

	it('parses models list response shapes', () => {
		expect(
			AimlApiEndpointOutputSchemas.modelsList.safeParse([
				{ id: 'gpt-4o', type: 'chat-completion' },
			]).success,
		).toBe(true);
		expect(
			AimlApiEndpointOutputSchemas.modelsList.safeParse({
				object: 'list',
				data: [{ id: 'gpt-4o' }],
			}).success,
		).toBe(true);
	});

	it('parses billing balance response', () => {
		const output = AimlApiEndpointOutputSchemas.billingGetBalance.safeParse({
			current_balance: 100.5,
			currency: 'USD',
		});
		expect(output.success).toBe(true);
	});

	it('rejects non-object chat completion', () => {
		expect(
			AimlApiEndpointOutputSchemas.chatCreateCompletion.safeParse('nope')
				.success,
		).toBe(false);
	});

	it('rejects empty objects for typed outputs', () => {
		expect(
			AimlApiEndpointOutputSchemas.assistantsCreate.safeParse({}).success,
		).toBe(false);
		expect(
			AimlApiEndpointOutputSchemas.assistantsList.safeParse({}).success,
		).toBe(false);
		expect(
			AimlApiEndpointOutputSchemas.chatCreateCompletion.safeParse({}).success,
		).toBe(false);
		expect(
			AimlApiEndpointOutputSchemas.billingGetBalance.safeParse({}).success,
		).toBe(false);
		expect(
			AimlApiEndpointOutputSchemas.lumaGetGeneration.safeParse({}).success,
		).toBe(false);
	});
});

describe('AimlApi error handlers', () => {
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

describe('AimlApi mocked endpoint handlers', () => {
	const ctx = testCtx('test_key');
	const mockRequest = makeAimlApiRequest as jest.MockedFunction<
		typeof makeAimlApiRequest
	>;

	beforeEach(() => {
		mockRequest.mockClear();
	});

	it('Models.list', async () => {
		mockRequest.mockResolvedValue({ data: [{ id: 'gpt-4o' }] });
		await Models.list(ctx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			'/models',
			'test_key',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('Models.listWithDetails', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		await Models.listWithDetails(ctx, { limit: 10 });
		expect(mockRequest).toHaveBeenCalledWith(
			'/models',
			'test_key',
			expect.objectContaining({
				method: 'GET',
				query: expect.objectContaining({ limit: 10 }),
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

	it('Responses.get', async () => {
		mockRequest.mockResolvedValue({ id: 'resp_123' });
		await Responses.get(ctx, { responseId: 'resp_123' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/responses/resp_123',
			'test_key',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('Assistants.create', async () => {
		mockRequest.mockResolvedValue({ id: 'asst_123' });
		await Assistants.create(ctx, { model: 'gpt-4o', name: 'Test' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/assistants',
			'test_key',
			expect.objectContaining({
				method: 'POST',
				headers: ASSISTANTS_BETA_HEADERS,
				body: expect.objectContaining({ model: 'gpt-4o' }),
			}),
		);
	});

	it('Assistants.list', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		await Assistants.list(ctx, { limit: 20, after: 'asst_123' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/assistants',
			'test_key',
			expect.objectContaining({
				method: 'GET',
				headers: ASSISTANTS_BETA_HEADERS,
				query: expect.objectContaining({ limit: 20, after: 'asst_123' }),
			}),
		);
	});

	it('Assistants.get', async () => {
		mockRequest.mockResolvedValue({ id: 'asst_123' });
		await Assistants.get(ctx, { assistantId: 'asst_123' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/assistants/asst_123',
			'test_key',
			expect.objectContaining({
				method: 'GET',
				headers: ASSISTANTS_BETA_HEADERS,
			}),
		);
	});

	it('Assistants.update uses POST', async () => {
		mockRequest.mockResolvedValue({ id: 'asst_123' });
		await Assistants.update(ctx, { assistantId: 'asst_123', name: 'N' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/assistants/asst_123',
			'test_key',
			expect.objectContaining({
				method: 'POST',
				headers: ASSISTANTS_BETA_HEADERS,
				body: expect.objectContaining({ name: 'N' }),
			}),
		);
	});

	it('Assistants.delete', async () => {
		mockRequest.mockResolvedValue({ deleted: true });
		await Assistants.delete(ctx, { assistantId: 'asst_123' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/assistants/asst_123',
			'test_key',
			expect.objectContaining({
				method: 'DELETE',
				headers: ASSISTANTS_BETA_HEADERS,
			}),
		);
	});

	it('Threads.create/get/update/delete', async () => {
		mockRequest.mockResolvedValue({ id: 'thread_123' });
		await Threads.create(ctx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			'/threads',
			'test_key',
			expect.objectContaining({
				method: 'POST',
				headers: ASSISTANTS_BETA_HEADERS,
			}),
		);
		await Threads.get(ctx, { threadId: 'thread_123' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/threads/thread_123',
			'test_key',
			expect.objectContaining({
				method: 'GET',
				headers: ASSISTANTS_BETA_HEADERS,
			}),
		);
		await Threads.update(ctx, {
			threadId: 'thread_123',
			metadata: { a: '1' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/threads/thread_123',
			'test_key',
			expect.objectContaining({
				method: 'POST',
				headers: ASSISTANTS_BETA_HEADERS,
				body: expect.objectContaining({ metadata: { a: '1' } }),
			}),
		);
		await Threads.delete(ctx, { threadId: 'thread_123' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/threads/thread_123',
			'test_key',
			expect.objectContaining({
				method: 'DELETE',
				headers: ASSISTANTS_BETA_HEADERS,
			}),
		);
	});

	it('Messages.create/list/get/update/delete', async () => {
		mockRequest.mockResolvedValue({ id: 'msg_123' });
		await Messages.create(ctx, {
			threadId: 'thread_123',
			role: 'user',
			content: 'Test',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/threads/thread_123/messages',
			'test_key',
			expect.objectContaining({
				method: 'POST',
				headers: ASSISTANTS_BETA_HEADERS,
				body: expect.objectContaining({ role: 'user' }),
			}),
		);
		await Messages.list(ctx, { threadId: 'thread_123' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/threads/thread_123/messages',
			'test_key',
			expect.objectContaining({
				method: 'GET',
				headers: ASSISTANTS_BETA_HEADERS,
			}),
		);
		await Messages.get(ctx, { threadId: 'thread_123', messageId: 'msg_123' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/threads/thread_123/messages/msg_123',
			'test_key',
			expect.objectContaining({
				method: 'GET',
				headers: ASSISTANTS_BETA_HEADERS,
			}),
		);
		await Messages.update(ctx, {
			threadId: 'thread_123',
			messageId: 'msg_123',
			metadata: { t: '1' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/threads/thread_123/messages/msg_123',
			'test_key',
			expect.objectContaining({
				method: 'POST',
				headers: ASSISTANTS_BETA_HEADERS,
				body: { metadata: { t: '1' } },
			}),
		);
		await Messages.delete(ctx, {
			threadId: 'thread_123',
			messageId: 'msg_123',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/threads/thread_123/messages/msg_123',
			'test_key',
			expect.objectContaining({
				method: 'DELETE',
				headers: ASSISTANTS_BETA_HEADERS,
			}),
		);
	});

	it('Runs.create/list/get/update/cancel/submitToolOutputs', async () => {
		mockRequest.mockResolvedValue({ id: 'run_123' });
		await Runs.create(ctx, {
			threadId: 'thread_123',
			assistantId: 'asst_123',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/threads/thread_123/runs',
			'test_key',
			expect.objectContaining({
				method: 'POST',
				headers: ASSISTANTS_BETA_HEADERS,
				body: expect.objectContaining({ assistant_id: 'asst_123' }),
			}),
		);
		await Runs.list(ctx, { threadId: 'thread_123' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/threads/thread_123/runs',
			'test_key',
			expect.objectContaining({
				method: 'GET',
				headers: ASSISTANTS_BETA_HEADERS,
			}),
		);
		await Runs.get(ctx, { threadId: 'thread_123', runId: 'run_123' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/threads/thread_123/runs/run_123',
			'test_key',
			expect.objectContaining({
				method: 'GET',
				headers: ASSISTANTS_BETA_HEADERS,
			}),
		);
		await Runs.update(ctx, {
			threadId: 'thread_123',
			runId: 'run_123',
			metadata: { x: '1' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/threads/thread_123/runs/run_123',
			'test_key',
			expect.objectContaining({
				method: 'POST',
				headers: ASSISTANTS_BETA_HEADERS,
				body: expect.objectContaining({ metadata: { x: '1' } }),
			}),
		);
		await Runs.cancel(ctx, { threadId: 'thread_123', runId: 'run_123' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/threads/thread_123/runs/run_123/cancel',
			'test_key',
			expect.objectContaining({
				method: 'POST',
				headers: ASSISTANTS_BETA_HEADERS,
			}),
		);
		await Runs.submitToolOutputs(ctx, {
			threadId: 'thread_123',
			runId: 'run_123',
			toolOutputs: [],
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/threads/thread_123/runs/run_123/submit_tool_outputs',
			'test_key',
			expect.objectContaining({
				method: 'POST',
				headers: ASSISTANTS_BETA_HEADERS,
				body: { tool_outputs: [] },
			}),
		);
	});

	it('RunSteps.list/get', async () => {
		mockRequest.mockResolvedValue({ data: [] });
		await RunSteps.list(ctx, { threadId: 'thread_123', runId: 'run_123' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/threads/thread_123/runs/run_123/steps',
			'test_key',
			expect.objectContaining({
				method: 'GET',
				headers: ASSISTANTS_BETA_HEADERS,
			}),
		);
		await RunSteps.get(ctx, {
			threadId: 'thread_123',
			runId: 'run_123',
			stepId: 'step_123',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			'/threads/thread_123/runs/run_123/steps/step_123',
			'test_key',
			expect.objectContaining({
				method: 'GET',
				headers: ASSISTANTS_BETA_HEADERS,
			}),
		);
	});

	it('Billing.getBalance', async () => {
		mockRequest.mockResolvedValue({ current_balance: 100 });
		await Billing.getBalance(ctx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			'/v2/billing',
			'test_key',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('Batches.list requires batchId', async () => {
		mockRequest.mockResolvedValue({ id: 'msgbatch_123' });
		await Batches.list(ctx, { batchId: 'msgbatch_123' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/batches',
			'test_key',
			expect.objectContaining({
				method: 'GET',
				query: { batch_id: 'msgbatch_123' },
			}),
		);
	});

	it('Luma.getGeneration accepts generationId or ids', async () => {
		mockRequest.mockResolvedValue({ id: 'gen_123', status: 'completed' });
		await Luma.getGeneration(ctx, { generationId: 'gen_123' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/v2/video/generations',
			'test_key',
			expect.objectContaining({
				method: 'GET',
				query: { generation_id: 'gen_123' },
			}),
		);
		await Luma.getGeneration(ctx, { ids: 'gen_a' });
		expect(mockRequest).toHaveBeenCalledWith(
			'/v2/video/generations',
			'test_key',
			expect.objectContaining({
				method: 'GET',
				query: { generation_id: 'gen_a' },
			}),
		);
	});
});

describeIfApiKey('AimlApi live endpoint tests', () => {
	const ctx = testCtx(TEST_API_KEY!);
	const realRequest = jest.requireActual('./client')
		.makeAimlApiRequest as typeof makeAimlApiRequest;

	beforeEach(() => {
		(makeAimlApiRequest as jest.Mock).mockImplementation(realRequest);
	});

	it('Models.list works', async () => {
		const response = await Models.list(ctx, {});
		expect(Array.isArray(response) || response.data).toBeTruthy();
	});

	it('Billing.getBalance works', async () => {
		const response = await Billing.getBalance(ctx, {});
		expect(response).toBeDefined();
		expect(
			response.current_balance !== undefined || response.balance !== undefined,
		).toBe(true);
	});
});

describe('AimlApi webhook matcher', () => {
	it('returns false for all webhook requests', () => {
		const plugin = aimlapi({});
		expect(plugin.pluginWebhookMatcher).toBeDefined();
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});
});
