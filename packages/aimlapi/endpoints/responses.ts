import { logEventFromContext } from 'corsair/core';
import { makeAimlApiRequest } from '../client';
import type { AimlApiEndpoints } from '../index';
import type { AimlApiEndpointOutputs } from './types';

export const create: AimlApiEndpoints['responsesCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['responsesCreate']
	>(`/v1/responses`, ctx.key, {
		method: 'POST',
		body: {
			model: input.model,
			input: input.input,
			instructions: input.instructions,
			metadata: input.metadata,
			tools: input.tools,
			temperature: input.temperature,
			top_p: input.topP,
		},
	});

	await logEventFromContext(
		ctx,
		'aimlapi.api.responses.create',
		{ model: input.model },
		'completed',
	);

	return response;
};

export const get: AimlApiEndpoints['responsesGet'] = async (ctx, input) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['responsesGet']
	>(`/v1/responses/${input.responseId}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'aimlapi.api.responses.get',
		{ responseId: input.responseId },
		'completed',
	);

	return response;
};

export const delete_: AimlApiEndpoints['responsesDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['responsesDelete']
	>(`/v1/responses/${input.responseId}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'aimlapi.api.responses.delete',
		{ responseId: input.responseId },
		'completed',
	);

	return response;
};

export { delete_ as delete };

export const cancel: AimlApiEndpoints['responsesCancel'] = async (
	ctx,
	input,
) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['responsesCancel']
	>(`/v1/responses/${input.responseId}/cancel`, ctx.key, {
		method: 'POST',
	});

	await logEventFromContext(
		ctx,
		'aimlapi.api.responses.cancel',
		{ responseId: input.responseId },
		'completed',
	);

	return response;
};
