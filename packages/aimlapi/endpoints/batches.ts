import { logEventFromContext } from 'corsair/core';
import { makeAimlApiRequest } from '../client';
import type { AimlApiEndpoints } from '../index';
import type { AimlApiEndpointOutputs } from './types';
import { AimlApiEndpointOutputSchemas } from './types';

export const list: AimlApiEndpoints['batchesList'] = async (ctx, input) => {
	const response = await makeAimlApiRequest<
		AimlApiEndpointOutputs['batchesList']
	>(`/v1/batches`, ctx.key, {
		schema: AimlApiEndpointOutputSchemas.batchesList,
		method: 'GET',
		query: {
			batch_id: input.batchId,
		},
	});

	await logEventFromContext(
		ctx,
		'aimlapi.api.batches.list',
		{ batchId: input.batchId },
		'completed',
	);

	return response;
};
