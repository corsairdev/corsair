import { logEventFromContext } from 'corsair/core';
import { makeSynthflowAiRequest } from '../client';
import type { SynthflowAiEndpoints } from '../index';
import type { SynthflowAiEndpointOutputs } from './types';

export const create: SynthflowAiEndpoints['assistantsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['assistantsCreate']
	>('assistants', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'synthflowai.assistants.create',
		{ name: input.name },
		'completed',
	);

	return response;
};

export const list: SynthflowAiEndpoints['assistantsList'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | undefined> = {};
	if (input?.limit !== undefined) query.limit = input.limit;
	if (input?.offset !== undefined) query.offset = input.offset;

	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['assistantsList']
	>('assistants/', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'synthflowai.assistants.list',
		input ? { limit: input.limit, offset: input.offset } : {},
		'completed',
	);

	return response;
};

export const get: SynthflowAiEndpoints['assistantsGet'] = async (
	ctx,
	input,
) => {
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['assistantsGet']
	>(`assistants/${input.assistant_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'synthflowai.assistants.get',
		{ assistant_id: input.assistant_id },
		'completed',
	);

	return response;
};

export const update: SynthflowAiEndpoints['assistantsUpdate'] = async (
	ctx,
	input,
) => {
	const { assistant_id, ...body } = input;
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['assistantsUpdate']
	>(`assistants/${assistant_id}`, ctx.key, {
		method: 'PUT',
		body,
	});

	await logEventFromContext(
		ctx,
		'synthflowai.assistants.update',
		{ assistant_id },
		'completed',
	);

	return response;
};

export const deleteAssistant: SynthflowAiEndpoints['assistantsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['assistantsDelete']
	>(`assistants/${input.assistant_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'synthflowai.assistants.delete',
		{ assistant_id: input.assistant_id },
		'completed',
	);

	return response;
};
