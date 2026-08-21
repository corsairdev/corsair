import { logEventFromContext } from 'corsair/core';
import { makeApipieRequest } from '../client';
import type { ApipieEndpoints } from '../index';
import type { ApipieEndpointOutputs } from './types';
import { ApipieEndpointOutputSchemas } from './types';

export const create: ApipieEndpoints['embeddingsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeApipieRequest<
		ApipieEndpointOutputs['embeddingsCreate']
	>(`/v1/embeddings`, ctx.key, {
		schema: ApipieEndpointOutputSchemas.embeddingsCreate,
		method: 'POST',
		body: {
			model: input.model,
			input: input.input,
			user: input.user,
		},
	});

	await logEventFromContext(
		ctx,
		'apipie.api.embeddings.create',
		{
			model: input.model,
			inputCount: Array.isArray(input.input) ? input.input.length : 1,
		},
		'completed',
	);

	return response;
};
