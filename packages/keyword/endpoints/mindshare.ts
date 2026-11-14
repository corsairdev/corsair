import type { KeywordEndpoints } from '..';
import { definedQuery, segment } from '../client';
import { call } from './call';
import {
	KeywordEndpointInputSchemas as Inputs,
	KeywordEndpointOutputSchemas as Outputs,
} from './types';

// The history route is scoped by the numeric project ID, not the name.
export const history: KeywordEndpoints['mindshareHistory'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'mindshare.history',
			input: Inputs.mindshareHistory,
			output: Outputs.mindshareHistory,
		},
		input,
		({ projectId, start_date, end_date }) => ({
			method: 'GET',
			path: `/projects/${segment(projectId)}/mindshare/from-cache`,
			query: definedQuery({ start_date, end_date }),
		}),
		{
			log: ({ projectId }, result) => ({
				projectId,
				points: Object.keys(result.data).filter((key) => key !== 'latest')
					.length,
			}),
		},
	);
