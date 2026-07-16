import { logEventFromContext } from 'corsair/core';
import { makeOpenaiRequest } from '../client';
import type { OpenaiEndpoints } from '../index';
import type {
	AssistantsCreateResponse,
	AssistantsDeleteResponse,
	AssistantsListResponse,
	AssistantsModifyResponse,
	AssistantsRetrieveResponse,
	MessagesCreateResponse,
	MessagesDeleteResponse,
	MessagesListResponse,
	MessagesModifyResponse,
	MessagesRetrieveResponse,
	RunStepsListResponse,
	RunStepsRetrieveResponse,
	RunsCancelResponse,
	RunsCreateResponse,
	RunsListResponse,
	RunsModifyResponse,
	RunsRetrieveResponse,
	RunsSubmitToolOutputsResponse,
	ThreadsCreateAndRunResponse,
	ThreadsCreateResponse,
	ThreadsDeleteResponse,
	ThreadsModifyResponse,
	ThreadsRetrieveResponse,
} from '../schema/assistants';

// The (deprecated, shuts down 2026-08-26) Assistants API requires this beta header on every call.
const ASSISTANTS_BETA_HEADERS = { 'OpenAI-Beta': 'assistants=v2' };

// --- Assistants ---

export const create: OpenaiEndpoints['assistantsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<AssistantsCreateResponse>(
		'assistants',
		ctx.key,
		{
			method: 'POST',
			headers: ASSISTANTS_BETA_HEADERS,
			body: {
				model: input.model,
				name: input.name,
				description: input.description,
				instructions: input.instructions,
				tools: input.tools,
				tool_resources: input.toolResources,
				metadata: input.metadata,
				temperature: input.temperature,
				top_p: input.topP,
			},
		},
	);

	if (ctx.db.assistants) {
		try {
			await ctx.db.assistants.upsertByEntityId(result.id, {
				id: result.id,
				name: result.name,
				model: result.model,
				description: result.description,
				createdAt: new Date(result.created_at * 1000),
			});
		} catch (error) {
			console.warn('Failed to save assistant to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'openai.assistants.create',
		{ model: input.model },
		'completed',
	);
	return result;
};

export const list: OpenaiEndpoints['assistantsList'] = async (ctx, input) => {
	const result = await makeOpenaiRequest<AssistantsListResponse>(
		'assistants',
		ctx.key,
		{ method: 'GET', headers: ASSISTANTS_BETA_HEADERS, query: { ...input } },
	);

	await logEventFromContext(
		ctx,
		'openai.assistants.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const retrieve: OpenaiEndpoints['assistantsRetrieve'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<AssistantsRetrieveResponse>(
		`assistants/${input.assistantId}`,
		ctx.key,
		{ method: 'GET', headers: ASSISTANTS_BETA_HEADERS },
	);

	await logEventFromContext(
		ctx,
		'openai.assistants.retrieve',
		{ ...input },
		'completed',
	);
	return result;
};

export const modify: OpenaiEndpoints['assistantsModify'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<AssistantsModifyResponse>(
		`assistants/${input.assistantId}`,
		ctx.key,
		{
			method: 'POST',
			headers: ASSISTANTS_BETA_HEADERS,
			body: {
				model: input.model,
				name: input.name,
				description: input.description,
				instructions: input.instructions,
				tools: input.tools,
				tool_resources: input.toolResources,
				metadata: input.metadata,
				temperature: input.temperature,
				top_p: input.topP,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.assistants.modify',
		{ assistantId: input.assistantId },
		'completed',
	);
	return result;
};

export const deleteAssistant: OpenaiEndpoints['assistantsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<AssistantsDeleteResponse>(
		`assistants/${input.assistantId}`,
		ctx.key,
		{ method: 'DELETE', headers: ASSISTANTS_BETA_HEADERS },
	);

	await logEventFromContext(
		ctx,
		'openai.assistants.delete',
		{ ...input },
		'completed',
	);
	return result;
};

// --- Threads ---

export const createThread: OpenaiEndpoints['threadsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ThreadsCreateResponse>(
		'threads',
		ctx.key,
		{
			method: 'POST',
			headers: ASSISTANTS_BETA_HEADERS,
			body: {
				messages: input.messages,
				tool_resources: input.toolResources,
				metadata: input.metadata,
			},
		},
	);

	if (ctx.db.threads) {
		try {
			await ctx.db.threads.upsertByEntityId(result.id, {
				id: result.id,
				createdAt: new Date(result.created_at * 1000),
			});
		} catch (error) {
			console.warn('Failed to save thread to database:', error);
		}
	}

	await logEventFromContext(ctx, 'openai.threads.create', {}, 'completed');
	return result;
};

export const retrieveThread: OpenaiEndpoints['threadsRetrieve'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ThreadsRetrieveResponse>(
		`threads/${input.threadId}`,
		ctx.key,
		{ method: 'GET', headers: ASSISTANTS_BETA_HEADERS },
	);

	await logEventFromContext(
		ctx,
		'openai.threads.retrieve',
		{ ...input },
		'completed',
	);
	return result;
};

export const modifyThread: OpenaiEndpoints['threadsModify'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ThreadsModifyResponse>(
		`threads/${input.threadId}`,
		ctx.key,
		{
			method: 'POST',
			headers: ASSISTANTS_BETA_HEADERS,
			body: {
				tool_resources: input.toolResources,
				metadata: input.metadata,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.threads.modify',
		{ threadId: input.threadId },
		'completed',
	);
	return result;
};

export const deleteThread: OpenaiEndpoints['threadsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ThreadsDeleteResponse>(
		`threads/${input.threadId}`,
		ctx.key,
		{ method: 'DELETE', headers: ASSISTANTS_BETA_HEADERS },
	);

	await logEventFromContext(
		ctx,
		'openai.threads.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const createThreadAndRun: OpenaiEndpoints['threadsCreateAndRun'] =
	async (ctx, input) => {
		const result = await makeOpenaiRequest<ThreadsCreateAndRunResponse>(
			'threads/runs',
			ctx.key,
			{
				method: 'POST',
				headers: ASSISTANTS_BETA_HEADERS,
				body: {
					assistant_id: input.assistantId,
					thread: input.thread,
					model: input.model,
					instructions: input.instructions,
					tools: input.tools,
					tool_resources: input.toolResources,
					metadata: input.metadata,
					temperature: input.temperature,
					top_p: input.topP,
					truncation_strategy: input.truncationStrategy,
					tool_choice: input.toolChoice,
					parallel_tool_calls: input.parallelToolCalls,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'openai.threads.createAndRun',
			{ assistantId: input.assistantId },
			'completed',
		);
		return result;
	};

// --- Messages ---

export const createMessage: OpenaiEndpoints['messagesCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<MessagesCreateResponse>(
		`threads/${input.threadId}/messages`,
		ctx.key,
		{
			method: 'POST',
			headers: ASSISTANTS_BETA_HEADERS,
			body: {
				role: input.role,
				content: input.content,
				attachments: input.attachments,
				metadata: input.metadata,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.messages.create',
		{ threadId: input.threadId },
		'completed',
	);
	return result;
};

export const listMessages: OpenaiEndpoints['messagesList'] = async (
	ctx,
	input,
) => {
	// Pull path + camelCase filters out of the remainder so the query only
	// contains OpenAI wire keys (run_id), not a duplicated runId.
	const { threadId, runId, ...query } = input;
	const result = await makeOpenaiRequest<MessagesListResponse>(
		`threads/${threadId}/messages`,
		ctx.key,
		{
			method: 'GET',
			headers: ASSISTANTS_BETA_HEADERS,
			query: { ...query, run_id: runId },
		},
	);

	await logEventFromContext(
		ctx,
		'openai.messages.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const retrieveMessage: OpenaiEndpoints['messagesRetrieve'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<MessagesRetrieveResponse>(
		`threads/${input.threadId}/messages/${input.messageId}`,
		ctx.key,
		{ method: 'GET', headers: ASSISTANTS_BETA_HEADERS },
	);

	await logEventFromContext(
		ctx,
		'openai.messages.retrieve',
		{ ...input },
		'completed',
	);
	return result;
};

export const modifyMessage: OpenaiEndpoints['messagesModify'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<MessagesModifyResponse>(
		`threads/${input.threadId}/messages/${input.messageId}`,
		ctx.key,
		{
			method: 'POST',
			headers: ASSISTANTS_BETA_HEADERS,
			body: { metadata: input.metadata },
		},
	);

	await logEventFromContext(
		ctx,
		'openai.messages.modify',
		{ threadId: input.threadId, messageId: input.messageId },
		'completed',
	);
	return result;
};

export const deleteMessage: OpenaiEndpoints['messagesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<MessagesDeleteResponse>(
		`threads/${input.threadId}/messages/${input.messageId}`,
		ctx.key,
		{ method: 'DELETE', headers: ASSISTANTS_BETA_HEADERS },
	);

	await logEventFromContext(
		ctx,
		'openai.messages.delete',
		{ ...input },
		'completed',
	);
	return result;
};

// --- Runs ---

export const createRun: OpenaiEndpoints['runsCreate'] = async (ctx, input) => {
	const result = await makeOpenaiRequest<RunsCreateResponse>(
		`threads/${input.threadId}/runs`,
		ctx.key,
		{
			method: 'POST',
			headers: ASSISTANTS_BETA_HEADERS,
			body: {
				assistant_id: input.assistantId,
				model: input.model,
				instructions: input.instructions,
				additional_instructions: input.additionalInstructions,
				tools: input.tools,
				metadata: input.metadata,
				temperature: input.temperature,
				top_p: input.topP,
				max_prompt_tokens: input.maxPromptTokens,
				max_completion_tokens: input.maxCompletionTokens,
				truncation_strategy: input.truncationStrategy,
				tool_choice: input.toolChoice,
				parallel_tool_calls: input.parallelToolCalls,
				stream: false,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.runs.create',
		{ threadId: input.threadId, assistantId: input.assistantId },
		'completed',
	);
	return result;
};

export const listRuns: OpenaiEndpoints['runsList'] = async (ctx, input) => {
	const { threadId, ...query } = input;
	const result = await makeOpenaiRequest<RunsListResponse>(
		`threads/${threadId}/runs`,
		ctx.key,
		{ method: 'GET', headers: ASSISTANTS_BETA_HEADERS, query: { ...query } },
	);

	await logEventFromContext(ctx, 'openai.runs.list', { ...input }, 'completed');
	return result;
};

export const retrieveRun: OpenaiEndpoints['runsRetrieve'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<RunsRetrieveResponse>(
		`threads/${input.threadId}/runs/${input.runId}`,
		ctx.key,
		{ method: 'GET', headers: ASSISTANTS_BETA_HEADERS },
	);

	await logEventFromContext(
		ctx,
		'openai.runs.retrieve',
		{ ...input },
		'completed',
	);
	return result;
};

export const modifyRun: OpenaiEndpoints['runsModify'] = async (ctx, input) => {
	const result = await makeOpenaiRequest<RunsModifyResponse>(
		`threads/${input.threadId}/runs/${input.runId}`,
		ctx.key,
		{
			method: 'POST',
			headers: ASSISTANTS_BETA_HEADERS,
			body: { metadata: input.metadata },
		},
	);

	await logEventFromContext(
		ctx,
		'openai.runs.modify',
		{ threadId: input.threadId, runId: input.runId },
		'completed',
	);
	return result;
};

export const cancelRun: OpenaiEndpoints['runsCancel'] = async (ctx, input) => {
	const result = await makeOpenaiRequest<RunsCancelResponse>(
		`threads/${input.threadId}/runs/${input.runId}/cancel`,
		ctx.key,
		{ method: 'POST', headers: ASSISTANTS_BETA_HEADERS },
	);

	await logEventFromContext(
		ctx,
		'openai.runs.cancel',
		{ ...input },
		'completed',
	);
	return result;
};

export const submitToolOutputs: OpenaiEndpoints['runsSubmitToolOutputs'] =
	async (ctx, input) => {
		const result = await makeOpenaiRequest<RunsSubmitToolOutputsResponse>(
			`threads/${input.threadId}/runs/${input.runId}/submit_tool_outputs`,
			ctx.key,
			{
				method: 'POST',
				headers: ASSISTANTS_BETA_HEADERS,
				body: {
					tool_outputs: input.toolOutputs.map((output) => ({
						tool_call_id: output.toolCallId,
						output: output.output,
					})),
					stream: false,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'openai.runs.submitToolOutputs',
			{ threadId: input.threadId, runId: input.runId },
			'completed',
		);
		return result;
	};

// --- Run Steps ---

export const listRunSteps: OpenaiEndpoints['runStepsList'] = async (
	ctx,
	input,
) => {
	const { threadId, runId, ...query } = input;
	const result = await makeOpenaiRequest<RunStepsListResponse>(
		`threads/${threadId}/runs/${runId}/steps`,
		ctx.key,
		{ method: 'GET', headers: ASSISTANTS_BETA_HEADERS, query: { ...query } },
	);

	await logEventFromContext(
		ctx,
		'openai.runSteps.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const retrieveRunStep: OpenaiEndpoints['runStepsRetrieve'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<RunStepsRetrieveResponse>(
		`threads/${input.threadId}/runs/${input.runId}/steps/${input.stepId}`,
		ctx.key,
		{ method: 'GET', headers: ASSISTANTS_BETA_HEADERS },
	);

	await logEventFromContext(
		ctx,
		'openai.runSteps.retrieve',
		{ ...input },
		'completed',
	);
	return result;
};
