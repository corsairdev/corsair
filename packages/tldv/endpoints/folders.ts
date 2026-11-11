import type { TldvEndpoints } from '..';
import { call, queryOf } from './call';
import {
	TldvEndpointInputSchemas as Inputs,
	TldvEndpointOutputSchemas as Outputs,
} from './types';

export const list: TldvEndpoints['foldersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.list',
			input: Inputs.foldersList,
			output: Outputs.foldersList,
		},
		input,
		({ query, meetingIds, meetingIdsOp, space, page, limit }) => ({
			method: 'GET',
			path: '/v1alpha1/folders',
			query: queryOf({
				query,
				// Documented as a repeated parameter or a comma-separated list.
				meetingIds: meetingIds?.join(','),
				meetingIdsOp,
				space,
				page,
				limit,
			}),
		}),
		{
			log: (_, result) => ({
				count: result.results.length,
				total: result.total,
			}),
		},
	);
