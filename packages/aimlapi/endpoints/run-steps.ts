import { logEventFromContext } from 'corsair/core';
import { ASSISTANTS_BETA_HEADERS, makeAimlApiRequest } from '../client';
import type { AimlApiEndpoints } from '../index';
import type { AimlApiEndpointOutputs } from './types';
import { AimlApiEndpointOutputSchemas } from './types';

export const list: AimlApiEndpoints['runStepsList'] = async (ctx, input) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['runStepsList']
	>(`/threads/${input.threadId}/runs/${input.runId}/steps`, ctx.key, {
		schema: AimlApiEndpointOutputSchemas.runStepsList,
		method: 'GET',
		headers: ASSISTANTS_BETA_HEADERS,
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
			schema: AimlApiEndpointOutputSchemas.runStepsGet,
			method: 'GET',
			headers: ASSISTANTS_BETA_HEADERS,
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
