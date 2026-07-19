import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getCountryInfo: WorkdayEndpoints['getCountryInfo'] = async (
	ctx,
	input,
) => {
	const response = await makeWorkdayRequest<
		WorkdayEndpointOutputs['getCountryInfo']
	>('v1/country/getCountryInfo', ctx.key, {
		method: 'GET',
		query: input as { [key: string]: string | number | boolean | undefined },
	});
	await logEventFromContext(
		ctx,
		'workday.country.getCountryInfo',
		input ?? {},
		'completed',
	);
	return response;
};
