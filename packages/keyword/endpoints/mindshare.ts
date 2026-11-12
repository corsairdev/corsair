import type { KeywordEndpoints } from '..';
import { definedQuery, projectSegment, segment } from '../client';
import { call } from './call';
import {
	KeywordEndpointInputSchemas as Inputs,
	KeywordEndpointOutputSchemas as Outputs,
} from './types';

export const latest: KeywordEndpoints['mindshareLatest'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'mindshare.latest',
			input: Inputs.mindshareLatest,
			output: Outputs.mindshareLatest,
		},
		input,
		({ projectName }) => ({
			method: 'GET',
			path: `/metrics/${projectSegment(projectName)}/mindshare/latest`,
		}),
		{ log: (_, result) => ({ entries: result.data.length }) },
	);

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
				entries: result.data.length,
			}),
		},
	);
