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
	>('v1/balances/listBalances', ctx.key, {
		method: 'GET',
		query: input as { [key: string]: string | number | boolean | undefined },
	});
	await logEventFromContext(
		ctx,
		'workday.balances.listBalances',
		input ?? {},
		'completed',
	);
	return response;
};
