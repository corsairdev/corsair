import type { WacheteEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	WacheteEndpointInputSchemas as Inputs,
	WacheteEndpointOutputSchemas as Outputs,
} from './types';

/** The check history of one monitor: what it read, and when it changed. */
export const list: WacheteEndpoints['dataList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'data.list',
			input: Inputs.dataList,
			output: Outputs.dataList,
		},
		input,
		({ id, from, to, count, returnDiff, continuationToken }) => ({
			method: 'GET',
			path: `/thirdparty/v1/data/list/${segment(id)}`,
			query: { from, to, count, returnDiff, continuationToken },
		}),
		{
			log: (parsed, result) => ({
				id: parsed.id,
				count: result.data?.length ?? 0,
				hasMore: result.continuationToken != null,
				diff: parsed.returnDiff ?? false,
			}),
		},
	);
