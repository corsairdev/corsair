import { logEventFromContext } from 'corsair/core';
import type { InsightoaiEndpoints } from '..';
import { makeInsightoaiRequest } from '../client';
import type { InsightoaiEndpointOutputs } from './types';

export const getAssistantById: InsightoaiEndpoints['getAssistantById'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['getAssistantById']
	>(`/api/v1/assistant/${input.assistant_id}`, ctx.key, {
		method: 'GET',
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.assistants.getAssistantById',
		{ assistantId: input.assistant_id },
		'completed',
	);
	return result;
};

export const deleteAssistantById: InsightoaiEndpoints['deleteAssistantById'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['deleteAssistantById']
		>(`/api/v1/assistant/${input.assistant_id}`, ctx.key, {
			method: 'DELETE',
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.assistants.deleteAssistantById',
			{ assistantId: input.assistant_id },
			'completed',
		);
		return result;
	};

export const addIntentToAssistant: InsightoaiEndpoints['addIntentToAssistant'] =
	async (ctx, input) => {
		const { assistant_id, intent_id, ...body } = input;
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['addIntentToAssistant']
		>(`/api/v1/assistant/${assistant_id}/intent/${intent_id}`, ctx.key, {
			method: 'POST',
			body,
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.assistants.addIntentToAssistant',
			{ assistantId: assistant_id, intentId: intent_id },
			'completed',
		);
		return result;
	};

export const createIntent: InsightoaiEndpoints['createIntent'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['createIntent']
	>('/api/v1/intent', ctx.key, {
		method: 'POST',
		body: input,
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.assistants.createIntent',
		{},
		'completed',
	);
	return result;
};

export const getIntentById: InsightoaiEndpoints['getIntentById'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['getIntentById']
	>(`/api/v1/intent/${input.intent_id}`, ctx.key, {
		method: 'GET',
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.assistants.getIntentById',
		{ intentId: input.intent_id },
		'completed',
	);
	return result;
};

export const readIntentsList: InsightoaiEndpoints['readIntentsList'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['readIntentsList']
	>('/api/v1/intent/list', ctx.key, {
		method: 'GET',
		query: { page: input.page, size: input.size },
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.assistants.readIntentsList',
		{},
		'completed',
	);
	return result;
};

export const createPrompt: InsightoaiEndpoints['createPrompt'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['createPrompt']
	>('/api/v1/prompt', ctx.key, {
		method: 'POST',
		body: input,
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.assistants.createPrompt',
		{},
		'completed',
	);
	return result;
};

export const getPromptById: InsightoaiEndpoints['getPromptById'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['getPromptById']
	>(`/api/v1/prompt/${input.prompt_id}`, ctx.key, {
		method: 'GET',
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.assistants.getPromptById',
		{ promptId: input.prompt_id },
		'completed',
	);
	return result;
};

export const deletePromptById: InsightoaiEndpoints['deletePromptById'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['deletePromptById']
	>(`/api/v1/prompt/${input.prompt_id}`, ctx.key, {
		method: 'DELETE',
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.assistants.deletePromptById',
		{ promptId: input.prompt_id },
		'completed',
	);
	return result;
};
