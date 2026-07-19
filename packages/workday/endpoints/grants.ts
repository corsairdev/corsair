import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getGrants: WorkdayEndpoints['getGrants'] = async (ctx, input) => {
	const response = await makeWorkdayRequest<
		WorkdayEndpointOutputs['getGrants']
	>('v1/grants/getGrants', ctx.key, {
		method: 'GET',
		query: input as { [key: string]: string | number | boolean | undefined },
	});
	await logEventFromContext(
		ctx,
		'workday.grants.getGrants',
		input ?? {},
		'completed',
	);
	return response;
};
