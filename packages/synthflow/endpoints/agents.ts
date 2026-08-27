import { logEventFromContext } from 'corsair/core';
import { makeSynthflowRequest } from '../client';
import type { SynthflowEndpoints } from '../index';
import type { SynthflowEndpointOutputs } from './types';

export const create: SynthflowEndpoints['agentsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeSynthflowRequest<
		SynthflowEndpointOutputs['agentsCreate']
	>('assistants', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'synthflow.agents.create',
		{ name: input.name },
		'completed',
	);

	return response;
};

export const list: SynthflowEndpoints['agentsList'] = async (ctx, input) => {
	const query: Record<string, string | number | undefined> = {};
	if (input?.limit !== undefined) query.limit = input.limit;
	if (input?.offset !== undefined) query.offset = input.offset;

	const response = await makeSynthflowRequest<
		SynthflowEndpointOutputs['agentsList']
	>('assistants/', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'synthflow.agents.list',
		input ? { limit: input.limit, offset: input.offset } : {},
		'completed',
	);

	return response;
};
