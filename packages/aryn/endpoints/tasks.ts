import { logEventFromContext } from 'corsair/core';
import type { ArynEndpoints } from '..';
import { makeArynRequest } from '../client';
import type { ArynEndpointOutputs } from './types';

export const asyncTasksList: ArynEndpoints['asyncTasksList'] = async (
	ctx,
	input,
) => {
	const response = await makeArynRequest<ArynEndpointOutputs['asyncTasksList']>(
		'/v1/async/list',
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'aryn.asyncTasks.list',
		{ ...input },
		'completed',
	);
	return response;
};
