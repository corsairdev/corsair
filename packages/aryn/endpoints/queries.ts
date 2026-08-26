import { logEventFromContext } from 'corsair/core';
import type { ArynEndpoints } from '..';
import { makeArynRequest } from '../client';
import type { ArynEndpointOutputs } from './types';

export const queryGeneratePlan: ArynEndpoints['queryGeneratePlan'] = async (
	ctx,
	input,
) => {
	const response = await makeArynRequest<
		ArynEndpointOutputs['queryGeneratePlan']
	>('/v1/query/plan', ctx.key, {
		method: 'POST',
		body: {
			query: input.query,
			docset_id: input.docset_id,
			summarize_result: input.summarize_result,
			stream: input.stream,
		},
	});

	await logEventFromContext(
		ctx,
		'aryn.query.generatePlan',
		{ ...input },
		'completed',
	);
	return response;
};
