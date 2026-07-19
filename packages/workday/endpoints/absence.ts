import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getAbsenceBalance: WorkdayEndpoints['getAbsenceBalance'] = async (
	ctx,
	input,
) => {
	const response = await makeWorkdayRequest<
		WorkdayEndpointOutputs['getAbsenceBalance']
	>('v1/absence/api', ctx.key, {
		method: 'POST',
		body: input as { [key: string]: unknown },
	});
	await logEventFromContext(
		ctx,
		'workday.absence.getAbsenceBalance',
		input ?? {},
		'completed',
	);
	return response;
};
