import type { RetentlyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	RetentlyEndpointInputSchemas as Inputs,
	RetentlyEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The campaign ID is a query parameter on `/reports` (`?Campaign ID=…` in the
 * docs) and a path segment on `/reports/{id}`. Both examples are documented, so
 * the path form is used and the parameter is dropped from the query.
 */
export const get: RetentlyEndpoints['reportsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'reports.get',
			input: Inputs.reportsGet,
			output: Outputs.reportsGet,
		},
		input,
		({ campaignId, startDate, endDate }) => ({
			method: 'GET',
			path: campaignId ? `/reports/${segment(campaignId)}` : '/reports/',
			query: { startDate, endDate },
			replayable: true,
		}),
		{
			log: (_, result) => ({ campaigns: result.data?.length ?? 0 }),
		},
	);
