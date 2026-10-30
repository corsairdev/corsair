import { logEventFromContext } from 'corsair/core';
import { makeOpenaiRequest } from '../client';
import type { OpenaiEndpoints } from '../index';
import type {
	ChatCompletionsDeleteResponse,
	ChatCompletionsListMessagesResponse,
	ChatCompletionsListResponse,
	ChatCompletionsRetrieveResponse,
	ChatCompletionsUpdateResponse,
	CompletionsCreateResponse,
	ResponsesCancelResponse,
	ResponsesCompactResponse,
	ResponsesCreateResponse,
	ResponsesDeleteResponse,
	ResponsesListInputItemsResponse,
	ResponsesRetrieveResponse,
	TokensCountInputResponse,
} from '../schema/chat-extensions';

// --- Legacy Completions ---

export const createCompletion: OpenaiEndpoints['completionsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<CompletionsCreateResponse>(
		'completions',
		ctx.key,
		{
			method: 'POST',
			body: {
				model: input.model,
				prompt: input.prompt,
				max_tokens: input.maxTokens,
				temperature: input.temperature,
				top_p: input.topP,
				n: input.n,
				stop: input.stop,
				presence_penalty: input.presencePenalty,
				frequency_penalty: input.frequencyPenalty,
				logprobs: input.logprobs,
				echo: input.echo,
				best_of: input.bestOf,
				logit_bias: input.logitBias,
				user: input.user,
				suffix: input.suffix,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.completions.create',
		{ model: input.model },
		'completed',
	);
	return result;
};

// --- Responses API ---

export const createResponse: OpenaiEndpoints['responsesCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ResponsesCreateResponse>(
		'responses',
		ctx.key,
		{
			method: 'POST',
			body: {
				model: input.model,
				input: input.input,
				instructions: input.instructions,
				tools: input.tools,
				tool_choice: input.toolChoice,
				temperature: input.temperature,
				top_p: input.topP,
				max_output_tokens: input.maxOutputTokens,
				previous_response_id: input.previousResponseId,
				store: input.store,
				metadata: input.metadata,
				truncation: input.truncation,
				parallel_tool_calls: input.parallelToolCalls,
				background: input.background,
				reasoning: input.reasoning,
				stream: false,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.responses.create',
		{ model: input.model },
		'completed',
	);
	return result;
};

export const retrieveResponse: OpenaiEndpoints['responsesRetrieve'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ResponsesRetrieveResponse>(
		`responses/${input.responseId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'openai.responses.retrieve',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteResponse: OpenaiEndpoints['responsesDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ResponsesDeleteResponse>(
		`responses/${input.responseId}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'openai.responses.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const cancelResponse: OpenaiEndpoints['responsesCancel'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ResponsesCancelResponse>(
		`responses/${input.responseId}/cancel`,
		ctx.key,
		{ method: 'POST' },
	);

	await logEventFromContext(
		ctx,
		'openai.responses.cancel',
		{ ...input },
		'completed',
	);
	return result;
};

export const compactResponse: OpenaiEndpoints['responsesCompact'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ResponsesCompactResponse>(
		'responses/compact',
		ctx.key,
		{
			method: 'POST',
			body: {
				model: input.model,
				input: input.input,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.responses.compact',
		{ model: input.model },
		'completed',
	);
	return result;
};

export const listResponseInputItems: OpenaiEndpoints['responsesListInputItems'] =
	async (ctx, input) => {
		const { responseId, ...query } = input;
		const result = await makeOpenaiRequest<ResponsesListInputItemsResponse>(
			`responses/${responseId}/input_items`,
			ctx.key,
			{ method: 'GET', query: { ...query } },
		);

		await logEventFromContext(
			ctx,
			'openai.responses.listInputItems',
			{ ...input },
			'completed',
		);
		return result;
	};

// --- Chat Completions storage CRUD ---

export const listChatCompletions: OpenaiEndpoints['chatCompletionsList'] =
	async (ctx, input) => {
		const { metadata, ...query } = input;
		const metadataQuery: Record<string, string> = {};
		if (metadata) {
			for (const [key, value] of Object.entries(metadata)) {
				metadataQuery[`metadata[${key}]`] = value;
			}
		}

		const result = await makeOpenaiRequest<ChatCompletionsListResponse>(
			'chat/completions',
			ctx.key,
			{ method: 'GET', query: { ...query, ...metadataQuery } },
		);

		await logEventFromContext(
			ctx,
			'openai.chatCompletions.list',
			{ ...input },
			'completed',
		);
		return result;
	};

export const retrieveChatCompletion: OpenaiEndpoints['chatCompletionsRetrieve'] =
	async (ctx, input) => {
		const result = await makeOpenaiRequest<ChatCompletionsRetrieveResponse>(
			`chat/completions/${input.completionId}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'openai.chatCompletions.retrieve',
			{ ...input },
			'completed',
		);
		return result;
	};

export const updateChatCompletion: OpenaiEndpoints['chatCompletionsUpdate'] =
	async (ctx, input) => {
		const result = await makeOpenaiRequest<ChatCompletionsUpdateResponse>(
			`chat/completions/${input.completionId}`,
			ctx.key,
			{
				method: 'POST',
				body: { metadata: input.metadata },
			},
		);

		await logEventFromContext(
			ctx,
			'openai.chatCompletions.update',
			{ completionId: input.completionId },
			'completed',
		);
		return result;
	};

export const deleteChatCompletion: OpenaiEndpoints['chatCompletionsDelete'] =
	async (ctx, input) => {
		const result = await makeOpenaiRequest<ChatCompletionsDeleteResponse>(
			`chat/completions/${input.completionId}`,
			ctx.key,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'openai.chatCompletions.delete',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listChatCompletionMessages: OpenaiEndpoints['chatCompletionsListMessages'] =
	async (ctx, input) => {
		const { completionId, ...query } = input;
		const result = await makeOpenaiRequest<ChatCompletionsListMessagesResponse>(
			`chat/completions/${completionId}/messages`,
			ctx.key,
			{ method: 'GET', query: { ...query } },
		);

		await logEventFromContext(
			ctx,
			'openai.chatCompletions.listMessages',
			{ ...input },
			'completed',
		);
		return result;
	};

// --- Token counting ---

// Path best-effort — verify against live OpenAI API reference before relying on this in production.
export const countInputTokens: OpenaiEndpoints['tokensCountInput'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<TokensCountInputResponse>(
		'responses/input_tokens',
		ctx.key,
		{
			method: 'POST',
			body: {
				model: input.model,
				input: input.input,
				tools: input.tools,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.tokens.countInput',
		{ model: input.model },
		'completed',
	);
	return result;
};
