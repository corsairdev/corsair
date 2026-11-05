import { logEventFromContext } from 'corsair/core';
import type { ArynEndpoints } from '..';
import { makeArynRequest } from '../client';
import { ArynEndpointInputSchemas, ArynEndpointOutputSchemas } from './types';

export const queryGeneratePlan: ArynEndpoints['queryGeneratePlan'] = async (
	ctx,
	input,
) => {
	const parsed = ArynEndpointInputSchemas.queryGeneratePlan.parse(input);
	const response = await makeArynRequest<unknown>('/v1/query/plan', ctx.key, {
		method: 'POST',
		body: {
			query: parsed.query,
			docset_id: parsed.docset_id,
			summarize_result: parsed.summarize_result,
			stream: parsed.stream,
		},
	});
	const output = ArynEndpointOutputSchemas.queryGeneratePlan.parse(
		response ?? {},
	);
	await logEventFromContext(ctx, 'aryn.query.generatePlan', {}, 'completed');
	return output;
};
