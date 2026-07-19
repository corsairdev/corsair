import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const listCountries: WorkdayEndpoints['listCountries'] = async (
	ctx,
	input,
) => {
	const response = await makeWorkdayRequest<
		WorkdayEndpointOutputs['listCountries']
	>('v1/countries/api', ctx.key, {
		method: 'POST',
		body: input as { [key: string]: unknown },
	});
	await logEventFromContext(
		ctx,
		'workday.countries.listCountries',
		input ?? {},
		'completed',
	);
	return response;
};
