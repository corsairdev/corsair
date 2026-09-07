import { logEventFromContext } from 'corsair/core';
import type { SemanticScholarEndpoints } from '..';
import type { SemanticScholarEndpointOutputs } from './types';
import { makeSemanticScholarRequest } from '../client';

export const get: SemanticScholarEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeSemanticScholarRequest<SemanticScholarEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'semanticscholar.example.get', { ...input }, 'completed');
	return response;
};
