import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const updateAnExistingPayroll: WorkdayEndpoints['updateAnExistingPayroll'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['updateAnExistingPayroll']
		>('v1/an/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.an.updateAnExistingPayroll',
			input ?? {},
			'completed',
		);
		return response;
	};
