import { logEventFromContext } from 'corsair/core';
import { makeAimlApiRequest } from '../client';
import type { AimlApiEndpoints } from '../index';
import type { AimlApiEndpointOutputs } from './types';

export const list: AimlApiEndpoints['runStepsList'] = async (ctx, input) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['runStepsList']
	>(`/threads/${input.threadId}/runs/${input.runId}/steps`, ctx.key, {
		method: 'GET',
		query: {
			limit: input.limit,
			order: input.order,
			before: input.before,
			after: input.after,
		},
	});
	await logEventFromContext(
		ctx,
		'aimlapi.api.runSteps.list',
		{ threadId: input.threadId, runId: input.runId },
		'completed',
	);
	return response;
};

export const get: AimlApiEndpoints['runStepsGet'] = async (ctx, input) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['runStepsGet']
	>(
		`/threads/${input.threadId}/runs/${input.runId}/steps/${input.stepId}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	await logEventFromContext(
		ctx,
		'aimlapi.api.runSteps.get',
		{ threadId: input.threadId, runId: input.runId, stepId: input.stepId },
		'completed',
	);
	return response;
};
