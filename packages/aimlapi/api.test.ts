import { ApiError } from 'corsair/http';
import { makeAimlApiRequest } from './client';
import {
	Assistants,
	Billing,
	Chat,
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

/** Minimal plugin context for endpoint handler tests. */
function testCtx(key: string): AimlApiContext {
	return {
		key,
		// logEventFromContext only needs enough of ctx to no-op safely in tests
	} as AimlApiContext;
}

const TEST_API_KEY = process.env.AIMLAPI_API_KEY;
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

describe('AimlApi endpoint input schemas', () => {
	it('validates models.list input', () => {
		const valid = AimlApiEndpointInputSchemas.modelsList.safeParse({});
		expect(valid.success).toBe(true);
	});

	it('validates models.listWithDetails input', () => {
		const valid = AimlApiEndpointInputSchemas.modelsListWithDetails.safeParse({
			limit: 10,
			order: 'desc',
		});
		expect(valid.success).toBe(true);
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

	it('validates responses.create input', () => {
		const valid = AimlApiEndpointInputSchemas.responsesCreate.safeParse({
			model: 'o3-mini',
			instructions: 'Test instructions',
		});
		expect(valid.success).toBe(true);
	});

	it('validates responses.get input', () => {
		const valid = AimlApiEndpointInputSchemas.responsesGet.safeParse({
			responseId: 'resp_123',
		});
		expect(valid.success).toBe(true);
	});

	it('validates assistants.create input', () => {
		const valid = AimlApiEndpointInputSchemas.assistantsCreate.safeParse({
			model: 'gpt-4o',
			name: 'Test Assistant',
			instructions: 'You are a helpful assistant',
		});
		expect(valid.success).toBe(true);
	});

	it('validates assistants.list input with pagination', () => {
		const valid = AimlApiEndpointInputSchemas.assistantsList.safeParse({
			limit: 20,
			order: 'desc',
			after: 'asst_123',
		});
		expect(valid.success).toBe(true);
	});

	it('validates threads.create input', () => {
		const valid = AimlApiEndpointInputSchemas.threadsCreate.safeParse({
			messages: [{ role: 'user', content: 'Hello' }],
			metadata: { userId: '123' },
		});
		expect(valid.success).toBe(true);
	});

	it('validates messages.create input', () => {
		const valid = AimlApiEndpointInputSchemas.messagesCreate.safeParse({
			threadId: 'thread_123',
			role: 'user',
			content: 'Test message',
		});
		expect(valid.success).toBe(true);
	});

	it('validates runs.create input', () => {
		const valid = AimlApiEndpointInputSchemas.runsCreate.safeParse({
			threadId: 'thread_123',
			assistantId: 'asst_123',
		});
		expect(valid.success).toBe(true);
	});

	it('validates runs.submitToolOutputs input', () => {
		const valid = AimlApiEndpointInputSchemas.runsSubmitToolOutputs.safeParse({
			threadId: 'thread_123',
			runId: 'run_123',
			toolOutputs: [
				{
					tool_call_id: 'call_123',
					output: 'Result data',
				},
			],
		});
		expect(valid.success).toBe(true);
	});

	it('validates runSteps.list input', () => {
		const valid = AimlApiEndpointInputSchemas.runStepsList.safeParse({
			threadId: 'thread_123',
			runId: 'run_123',
			limit: 10,
		});
		expect(valid.success).toBe(true);
	});

	it('validates billing.getBalance input', () => {
		const valid = AimlApiEndpointInputSchemas.billingGetBalance.safeParse({});
		expect(valid.success).toBe(true);
	});

	it('validates batches.list input', () => {
		const valid = AimlApiEndpointInputSchemas.batchesList.safeParse({
			batchId: 'batch_123',
		});
		expect(valid.success).toBe(true);
	});

	it('validates luma.getGeneration input', () => {
		const valid = AimlApiEndpointInputSchemas.lumaGetGeneration.safeParse({
			generationId: 'gen_123',
		});
		expect(valid.success).toBe(true);
	});

	it('validates luma.listGenerations input', () => {
		const valid = AimlApiEndpointInputSchemas.lumaListGenerations.safeParse({
			limit: 10,
			offset: 0,
		});
		expect(valid.success).toBe(true);
	});
});

describe('AimlApi endpoint output schemas', () => {
	it('parses chat completion response', () => {
		const output = AimlApiEndpointOutputSchemas.chatCreateCompletion.safeParse({
			id: 'chatcmpl-123',
			object: 'chat.completion',
			created: 1700000000,
			model: 'gpt-4o',
			choices: [
				{
					index: 0,
					message: { role: 'assistant', content: 'Hello!' },
					finish_reason: 'stop',
				},
			],
		});
		expect(output.success).toBe(true);
	});

	it('parses models list response', () => {
		const output = AimlApiEndpointOutputSchemas.modelsList.safeParse([
			{
				id: 'gpt-4o',
				type: 'chat-completion',
			},
		]);
		expect(output.success).toBe(true);
	});

	it('parses assistant response', () => {
		const output = AimlApiEndpointOutputSchemas.assistantsCreate.safeParse({
			id: 'asst_123',
			object: 'assistant',
			model: 'gpt-4o',
			name: 'Test Assistant',
		});
		expect(output.success).toBe(true);
	});

	it('parses thread response', () => {
		const output = AimlApiEndpointOutputSchemas.threadsCreate.safeParse({
			id: 'thread_123',
			object: 'thread',
			created_at: 1700000000,
		});
		expect(output.success).toBe(true);
	});

	it('parses billing balance response', () => {
		const output = AimlApiEndpointOutputSchemas.billingGetBalance.safeParse({
			current_balance: 100.5,
			currency: 'USD',
		});
		expect(output.success).toBe(true);
	});
});

describe('AimlApi error handlers', () => {
	it('matches 429 rate limit errors by message', () => {
		const error = new Error('rate_limited');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	});

	it('matches 429 rate limit errors by 429 in message', () => {
		const error = new Error('Error 429');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	});

	it('returns retry config for rate limit errors', async () => {
		const error = new Error('rate_limited');
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.maxRetries).toBe(5);
	});

	it('matches auth errors by message', () => {
		const error = new Error('unauthorized');
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
	});

	it('returns no retry for auth errors', async () => {
		const result = await errorHandlers.AUTH_ERROR.handler();
		expect(result.maxRetries).toBe(0);
	});

	it('matches not found errors by message', () => {
		const error = new Error('not found');
		expect(errorHandlers.NOT_FOUND_ERROR.match(error)).toBe(true);
	});

	it('matches server errors by message', () => {
		const error = new Error('internal server error');
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
	});

	it('returns retry config for server errors', async () => {
		const result = await errorHandlers.SERVER_ERROR.handler();
		expect(result.maxRetries).toBe(3);
	});

	it('matches validation errors by message', () => {
		const error = new Error('bad request');
		expect(errorHandlers.VALIDATION_ERROR.match(error)).toBe(true);
	});

	it('DEFAULT handler matches any error', () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});
});

describeIfApiKey('AimlApi live endpoint tests', () => {
	const ctx = testCtx(TEST_API_KEY!);

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

	it('Chat.createCompletion works', async () => {
		const response = await Chat.createCompletion(ctx, {
			model: 'gpt-4o-mini',
			messages: [{ role: 'user', content: 'Say hello in one word.' }],
			maxTokens: 10,
		});
		expect(response).toBeDefined();
		// Response structure validation
		const hasChoices = 'choices' in response;
		expect(hasChoices).toBe(true);
	});
});

describe('AimlApi webhook matcher', () => {
	it('returns false for all webhook requests', () => {
		// AIMLAPI has zero webhook operations
		const { aimlapi } = require('./index');
		const plugin = aimlapi({});
		const result = plugin.pluginWebhookMatcher({
			headers: {},
			body: {},
			method: 'POST',
			path: '/webhooks/test',
		});
		expect(result).toBe(false);
	});
});
