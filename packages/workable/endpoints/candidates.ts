import { logEventFromContext } from 'corsair/core';
import { makeWorkableRequest } from '../client';
import type { WorkableEndpoints } from '../index';
import { WorkableCandidate } from '../schema/database';
import { persistRows } from './persist';
import { compactQuery, resolveAccount } from './shared';
import type { WorkableEndpointOutputs } from './types';

export const list: WorkableEndpoints['candidatesList'] = async (ctx, input) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['candidatesList']
	>('/candidates', ctx.key, account, {
		query: compactQuery({
			email: input.email,
			shortcode: input.shortcode,
			stage: input.stage,
			limit: input.limit,
			since_id: input.since_id,
			max_id: input.max_id,
			created_after: input.created_after,
			updated_after: input.updated_after,
		}),
	});
	await persistRows(
		ctx.db.candidates,
		WorkableCandidate,
		response.candidates,
		'candidate',
	);
	await logEventFromContext(
		ctx,
		'workable.candidates.list',
		{ shortcode: input.shortcode, stage: input.stage },
		'completed',
	);
	return response;
};
