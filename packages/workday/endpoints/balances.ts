import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const listBalances: WorkdayEndpoints['listBalances'] = async (
	ctx,
	input,
) => {
	const response = await makeWorkdayRequest<
		WorkdayEndpointOutputs['listBalances']
	>('v1/balances/api', ctx.key, {
		method: 'POST',
		body: input as { [key: string]: unknown },
	});
	await logEventFromContext(
		ctx,
		'workday.balances.listBalances',
		input ?? {},
		'completed',
	);
	return response;
};
