import { logEventFromContext } from 'corsair/core';
import { makeAimlApiRequest } from '../client';
import type { AimlApiEndpoints } from '../index';
import type { AimlApiEndpointOutputs } from './types';
import { AimlApiEndpointOutputSchemas } from './types';

export const get: AimlApiEndpoints['responsesGet'] = async (ctx, input) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['responsesGet']
	>(`/v1/responses/${input.responseId}`, ctx.key, {
		schema: AimlApiEndpointOutputSchemas.responsesGet,
		method: 'GET',
		query: {
			starting_after: input.startingAfter,
			include_obfuscation: input.includeObfuscation,
			...(input.include?.length ? { include: input.include.join(',') } : {}),
		},
	});

	await logEventFromContext(
		ctx,
		'aimlapi.api.responses.get',
		{ responseId: input.responseId },
		'completed',
	);

	return response;
};
