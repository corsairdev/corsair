import { logEventFromContext } from 'corsair/core';
import { makeWorkableRequest } from '../client';
import type { WorkableEndpoints } from '../index';
import { WorkableCandidate } from '../schema/database';
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

export const list: WorkableEndpoints['candidatesList'] = async (ctx, input) => {
	const valid = parseEndpointInput(
		WorkableEndpointInputSchemas.candidatesList,
		input,
	);
	const account = await resolveAccount(ctx);
	const raw = await makeWorkableRequest<
		WorkableEndpointOutputs['candidatesList']
	>('/candidates', ctx.key, account, {
		query: compactQuery({
			email: valid.email,
			shortcode: valid.shortcode,
			stage: valid.stage,
			limit: valid.limit,
			since_id: valid.since_id,
			max_id: valid.max_id,
			created_after: valid.created_after,
			updated_after: valid.updated_after,
		}),
	});
	const response = parseEndpointOutput(
		WorkableEndpointOutputSchemas.candidatesList,
		raw,
	);
	await persistRows(
		ctx.db.candidates,
		WorkableCandidate,
		response.candidates,
		'candidate',
	);
	await logEventFromContext(
		ctx,
		'workable.candidates.list',
		{ shortcode: valid.shortcode, stage: valid.stage },
		'completed',
	);
	return response;
};
