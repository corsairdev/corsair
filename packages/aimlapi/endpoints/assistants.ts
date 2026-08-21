import { logEventFromContext } from 'corsair/core';
import { ASSISTANTS_BETA_HEADERS, makeAimlApiRequest } from '../client';
import type { AimlApiEndpoints } from '../index';
import type { AimlApiEndpointOutputs } from './types';
import { AimlApiEndpointOutputSchemas } from './types';

export const create: AimlApiEndpoints['assistantsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['assistantsCreate']
	>(`/assistants`, ctx.key, {
		schema: AimlApiEndpointOutputSchemas.assistantsCreate,
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
	});

	await logEventFromContext(
		ctx,
		'aimlapi.api.assistants.create',
		{ model: input.model, assistantId: response.id },
		'completed',
	);

	return response;
};

export const get: AimlApiEndpoints['assistantsGet'] = async (ctx, input) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['assistantsGet']
	>(`/assistants/${input.assistantId}`, ctx.key, {
		schema: AimlApiEndpointOutputSchemas.assistantsGet,
		method: 'GET',
		headers: ASSISTANTS_BETA_HEADERS,
	});

	await logEventFromContext(
		ctx,
		'aimlapi.api.assistants.get',
		{ assistantId: input.assistantId },
		'completed',
	);

	return response;
};

export const list: AimlApiEndpoints['assistantsList'] = async (ctx, input) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['assistantsList']
	>(`/assistants`, ctx.key, {
		schema: AimlApiEndpointOutputSchemas.assistantsList,
		method: 'GET',
		headers: ASSISTANTS_BETA_HEADERS,
		query: {
			limit: input.limit,
			order: input.order,
			before: input.before,
			after: input.after,
		},
	});

	const resultCount = Array.isArray(response?.data) ? response.data.length : 0;

	await logEventFromContext(
		ctx,
		'aimlapi.api.assistants.list',
		{ resultCount },
		'completed',
	);

	return response;
};

export const update: AimlApiEndpoints['assistantsUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['assistantsUpdate']
	>(`/assistants/${input.assistantId}`, ctx.key, {
		schema: AimlApiEndpointOutputSchemas.assistantsUpdate,
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
	});

	await logEventFromContext(
		ctx,
		'aimlapi.api.assistants.update',
		{ assistantId: input.assistantId },
		'completed',
	);

	return response;
};

export const delete_: AimlApiEndpoints['assistantsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['assistantsDelete']
	>(`/assistants/${input.assistantId}`, ctx.key, {
		schema: AimlApiEndpointOutputSchemas.assistantsDelete,
		method: 'DELETE',
		headers: ASSISTANTS_BETA_HEADERS,
	});

	await logEventFromContext(
		ctx,
		'aimlapi.api.assistants.delete',
		{ assistantId: input.assistantId },
		'completed',
	);

	return response;
};

export { delete_ as delete };
