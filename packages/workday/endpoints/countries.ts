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
	>('v1/countries/listCountries', ctx.key, {
		method: 'GET',
		// Justification: The makeWorkdayRequest client expects a generic unknown record.
		query: input as { [key: string]: string | number | boolean | undefined },
	});
	await logEventFromContext(
		ctx,
		'workday.countries.listCountries',
		input ?? {},
		'completed',
	);
	return response;
};
