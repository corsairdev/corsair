import { logEventFromContext } from 'corsair/core';
import { ASSISTANTS_BETA_HEADERS, makeAimlApiRequest } from '../client';
import type { AimlApiEndpoints } from '../index';
import type { AimlApiEndpointOutputs } from './types';
import { AimlApiEndpointOutputSchemas } from './types';

export const create: AimlApiEndpoints['runsCreate'] = async (ctx, input) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['runsCreate']
	>(`/threads/${input.threadId}/runs`, ctx.key, {
		schema: AimlApiEndpointOutputSchemas.runsCreate,
		method: 'POST',
		headers: ASSISTANTS_BETA_HEADERS,
		body: {
			assistant_id: input.assistantId,
			instructions: input.instructions,
			additional_instructions: input.additionalInstructions,
			tools: input.tools,
			metadata: input.metadata,
		},
	});
	await logEventFromContext(
		ctx,
		'aimlapi.api.runs.create',
		{ threadId: input.threadId, assistantId: input.assistantId },
		'completed',
	);
	return response;
};

export const list: AimlApiEndpoints['runsList'] = async (ctx, input) => {
	const response = await makeAimlApiRequest<AimlApiEndpointOutputs['runsList']>(
		`/threads/${input.threadId}/runs`,
		ctx.key,
		{
			schema: AimlApiEndpointOutputSchemas.runsList,
			method: 'GET',
			headers: ASSISTANTS_BETA_HEADERS,
			query: {
				limit: input.limit,
				order: input.order,
				before: input.before,
				after: input.after,
			},
		},
	);
	await logEventFromContext(
		ctx,
		'aimlapi.api.runs.list',
		{ threadId: input.threadId },
		'completed',
	);
	return response;
};

export const get: AimlApiEndpoints['runsGet'] = async (ctx, input) => {
	const response = await makeAimlApiRequest<AimlApiEndpointOutputs['runsGet']>(
		`/threads/${input.threadId}/runs/${input.runId}`,
		ctx.key,
		{
			schema: AimlApiEndpointOutputSchemas.runsGet,
			method: 'GET',
			headers: ASSISTANTS_BETA_HEADERS,
		},
	);
	await logEventFromContext(
		ctx,
		'aimlapi.api.runs.get',
		{ threadId: input.threadId, runId: input.runId },
		'completed',
	);
	return response;
};

export const update: AimlApiEndpoints['runsUpdate'] = async (ctx, input) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['runsUpdate']
	>(`/threads/${input.threadId}/runs/${input.runId}`, ctx.key, {
		schema: AimlApiEndpointOutputSchemas.runsUpdate,
		method: 'POST',
		headers: ASSISTANTS_BETA_HEADERS,
		body: {
			metadata: input.metadata,
			instructions: input.instructions,
		},
	});
	await logEventFromContext(
		ctx,
		'aimlapi.api.runs.update',
		{ threadId: input.threadId, runId: input.runId },
		'completed',
	);
	return response;
};

export const cancel: AimlApiEndpoints['runsCancel'] = async (ctx, input) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['runsCancel']
	>(`/threads/${input.threadId}/runs/${input.runId}/cancel`, ctx.key, {
		schema: AimlApiEndpointOutputSchemas.runsCancel,
		method: 'POST',
		headers: ASSISTANTS_BETA_HEADERS,
	});
	await logEventFromContext(
		ctx,
		'aimlapi.api.runs.cancel',
		{ threadId: input.threadId, runId: input.runId },
		'completed',
	);
	return response;
};

export const submitToolOutputs: AimlApiEndpoints['runsSubmitToolOutputs'] =
	async (ctx, input) => {
		const response = await makeAimlApiRequest<
			AimlApiEndpointOutputs['runsSubmitToolOutputs']
		>(
			`/threads/${input.threadId}/runs/${input.runId}/submit_tool_outputs`,
			ctx.key,
			{
				schema: AimlApiEndpointOutputSchemas.runsSubmitToolOutputs,
				method: 'POST',
				headers: ASSISTANTS_BETA_HEADERS,
				body: {
					tool_outputs: input.toolOutputs,
				},
			},
		);
		await logEventFromContext(
			ctx,
			'aimlapi.api.runs.submitToolOutputs',
			{ threadId: input.threadId, runId: input.runId },
			'completed',
		);
		return response;
	};
