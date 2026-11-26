import type { LoomioEndpoints } from '..';
import { call } from './call';
import {
	LoomioEndpointInputSchemas as Inputs,
	LoomioEndpointOutputSchemas as Outputs,
} from './types';

export const get: LoomioEndpoints['reportsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'reports.get',
			input: Inputs.reportsGet,
			output: Outputs.reportsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/reports',
			query: {
				section: parsed.section,
				group_scope: parsed.group_scope,
				group_ids: parsed.group_ids?.join(','),
				start_month: parsed.start_month,
				end_month: parsed.end_month,
				interval: parsed.interval,
				member_type: parsed.member_type,
			},
		}),
		{ log: ({ section }) => ({ section }) },
	);
