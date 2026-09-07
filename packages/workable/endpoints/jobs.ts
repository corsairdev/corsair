import { logEventFromContext } from 'corsair/core';
import { makeWorkableRequest } from '../client';
import type { WorkableEndpoints } from '../index';
import { WorkableJob } from '../schema/database';
import { persistRows } from './persist';
import { compactQuery, resolveAccount } from './shared';
import type { WorkableEndpointOutputs } from './types';

export const list: WorkableEndpoints['jobsList'] = async (ctx, input) => {
	const account = await resolveAccount(ctx);
	const response = await makeWorkableRequest<
		WorkableEndpointOutputs['jobsList']
	>('/jobs', ctx.key, account, {
		query: compactQuery({
			limit: input.limit,
			state: input.state,
			created_after: input.created_after,
			updated_after: input.updated_after,
			since_id: input.since_id,
			max_id: input.max_id,
			include_fields: input.include_fields,
		}),
	});
	await persistRows(ctx.db.jobs, WorkableJob, response.jobs, 'job');
	await logEventFromContext(
		ctx,
		'workable.jobs.list',
		{ state: input.state },
		'completed',
	);
	return response;
};
