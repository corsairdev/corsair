import type { HoneybadgerEndpoints } from '..';
import { call } from './call';
import {
	HoneybadgerEndpointInputSchemas as Inputs,
	HoneybadgerEndpointOutputSchemas as Outputs,
} from './types';

export const occurrences: HoneybadgerEndpoints['occurrencesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'occurrences.list',
			input: Inputs['occurrences.list'],
			output: Outputs['occurrences.list'],
		},
		input,
		({ period, environment, page, per_page }) => ({
			method: 'GET',
			path: '/projects/occurrences',
			query: { period, environment, page, per_page },
		}),
		{ log: (_, result) => ({ projects: result.data.length }) },
	);
