import { logEventFromContext } from 'corsair/core';
import type { ArynEndpoints } from '..';
import { makeArynRequest } from '../client';
import {
	ArynEndpointInputSchemas,
	ArynEndpointOutputSchemas,
	ASYNC_LIST_PATH_FILTER,
} from './types';

export const asyncTasksList: ArynEndpoints['asyncTasksList'] = async (
	ctx,
	input,
) => {
	const parsed = ArynEndpointInputSchemas.asyncTasksList.parse(input);
	const response = await makeArynRequest<unknown>('/v1/async/list', ctx.key, {
		method: 'GET',
		query: {
			path_filter: parsed.path_filter ?? ASYNC_LIST_PATH_FILTER,
		},
	});
	const output = ArynEndpointOutputSchemas.asyncTasksList.parse(response ?? {});
	await logEventFromContext(ctx, 'aryn.asyncTasks.list', {}, 'completed');
	return output;
};
