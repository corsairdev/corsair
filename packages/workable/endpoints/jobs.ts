import { logEventFromContext } from 'corsair/core';
import { makeWorkableRequest } from '../client';
import type { WorkableEndpoints } from '../index';
import { WorkableJob } from '../schema/database';
import { persistRows } from './persist';
import {
	compactQuery,
	parseEndpointInput,
	parseEndpointOutput,
	resolveAccount,
} from './shared';
import type { WorkableEndpointOutputs } from './types';
import {
	WorkableEndpointInputSchemas,
	WorkableEndpointOutputSchemas,
} from './types';

export const list: WorkableEndpoints['jobsList'] = async (ctx, input) => {
	const valid = parseEndpointInput(
		WorkableEndpointInputSchemas.jobsList,
		input,
	);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<WorkableEndpointOutputs['jobsList']>(
		'/jobs',
		ctx.key,
		account,
		{
			query: compactQuery({
				limit: valid.limit,
				state: valid.state,
				created_after: valid.created_after,
				updated_after: valid.updated_after,
				since_id: valid.since_id,
				max_id: valid.max_id,
				include_fields: valid.include_fields,
			}),
		},
	);
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.jobsList,
		raw,
	);
	await persistRows(ctx.db.jobs, WorkableJob, response.jobs, 'job');
	await logEventFromContext(
		ctx,
		'workable.jobs.list',
		{ state: valid.state },
		'completed',
	);
	return response;
};
