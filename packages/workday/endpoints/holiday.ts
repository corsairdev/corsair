import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getHolidayEvents: WorkdayEndpoints['getHolidayEvents'] = async (
	ctx,
	input,
) => {
	const response = await makeWorkdayRequest<
		WorkdayEndpointOutputs['getHolidayEvents']
	>('v1/holiday/getHolidayEvents', ctx.key, {
		method: 'GET',
		// Justification: The makeWorkdayRequest client expects a generic unknown record.
		query: input as { [key: string]: string | number | boolean | undefined },
	});
	await logEventFromContext(
		ctx,
		'workday.holiday.getHolidayEvents',
		input ?? {},
		'completed',
	);
	return response;
};
