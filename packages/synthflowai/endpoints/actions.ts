import { logEventFromContext } from 'corsair/core';
import { makeSynthflowAiRequest } from '../client';
import type { SynthflowAiEndpoints } from '../index';
import type { SynthflowAiEndpointOutputs } from './types';

export const create: SynthflowAiEndpoints['actionsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['actionsCreate']
	>('actions', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(ctx, 'synthflowai.actions.create', {}, 'completed');

	return response;
};

export const list: SynthflowAiEndpoints['actionsList'] = async (ctx, input) => {
	const query: Record<string, string | number | undefined> = {};
	if (input?.limit !== undefined) query.limit = input.limit;
	if (input?.offset !== undefined) query.offset = input.offset;

	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['actionsList']
	>('actions', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'synthflowai.actions.list',
		input ? { limit: input.limit, offset: input.offset } : {},
		'completed',
	);

	return response;
};

export const get: SynthflowAiEndpoints['actionsGet'] = async (ctx, input) => {
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['actionsGet']
	>(`actions/${input.action_id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'synthflowai.actions.get',
		{ action_id: input.action_id },
		'completed',
	);

	return response;
};

export const update: SynthflowAiEndpoints['actionsUpdate'] = async (
	ctx,
	input,
) => {
	const { action_id, ...body } = input;
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['actionsUpdate']
	>(`actions/${action_id}`, ctx.key, {
		method: 'PUT',
		body,
	});

	await logEventFromContext(
		ctx,
		'synthflowai.actions.update',
		{ action_id },
		'completed',
	);

	return response;
};

export const deleteAction: SynthflowAiEndpoints['actionsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['actionsDelete']
	>(`actions/${input.action_id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'synthflowai.actions.delete',
		{ action_id: input.action_id },
		'completed',
	);

	return response;
};

export const attach: SynthflowAiEndpoints['actionsAttach'] = async (
	ctx,
	input,
) => {
	const { action_ids, actions, items, model_id, ...rest } = input;
	const body = {
		...rest,
		model_id,
		...(items ? { items } : { actions: actions ?? action_ids }),
	};
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['actionsAttach']
	>(`actions/attach`, ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'synthflowai.actions.attach',
		{ model_id: input.model_id },
		'completed',
	);

	return response;
};

export const detach: SynthflowAiEndpoints['actionsDetach'] = async (
	ctx,
	input,
) => {
	const { action_ids, actions, model_id, ...rest } = input;
	const response = await makeSynthflowAiRequest<
		SynthflowAiEndpointOutputs['actionsDetach']
	>(`actions/detach`, ctx.key, {
		method: 'POST',
		body: {
			...rest,
			model_id,
			actions: actions ?? action_ids,
		},
	});

	await logEventFromContext(
		ctx,
		'synthflowai.actions.detach',
		{ model_id: input.model_id },
		'completed',
	);

	return response;
};
