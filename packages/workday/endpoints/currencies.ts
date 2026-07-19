import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getCurrencies: WorkdayEndpoints['getCurrencies'] = async (
	ctx,
	input,
) => {
	const response = await makeWorkdayRequest<
		WorkdayEndpointOutputs['getCurrencies']
	>('v1/currencies/getCurrencies', ctx.key, {
		method: 'GET',
		query: input as { [key: string]: string | number | boolean | undefined },
	});
	await logEventFromContext(
		ctx,
		'workday.currencies.getCurrencies',
		input ?? {},
		'completed',
	);
	return response;
};
