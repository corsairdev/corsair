import type { HoneybadgerEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	HoneybadgerEndpointInputSchemas as Inputs,
	HoneybadgerEndpointOutputSchemas as Outputs,
} from './types';

export const streamsList: HoneybadgerEndpoints['streamsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'streams.list',
			input: Inputs['streams.list'],
			output: Outputs['streams.list'],
		},
		input,
		({ project_id, page, per_page }) => ({
			method: 'GET',
			path: `/projects/${segment(project_id)}/streams`,
			query: { page, per_page },
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

/**
 * A BadgerQL query is a POST that changes nothing, so it stays a read and a
 * replay is safe. It is the one operation where the method alone would call a
 * repeat unsafe, which is what `replayable` is for.
 */
export const query: HoneybadgerEndpoints['insightsQuery'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'insights.query',
			input: Inputs['insights.query'],
			output: Outputs['insights.query'],
		},
		input,
		({ project_id, query: badgerQuery, stream_ids, ts, timezone }) => ({
			method: 'POST',
			path: `/projects/${segment(project_id)}/insights/queries`,
			body: { query: badgerQuery, stream_ids, ts, timezone },
			replayable: true,
		}),
		{ log: ({ project_id }) => ({ projectId: project_id }) },
	);
