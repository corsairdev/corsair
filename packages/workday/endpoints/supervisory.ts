import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getSupervisoryOrgValues: WorkdayEndpoints['getSupervisoryOrgValues'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getSupervisoryOrgValues']
		>('v1/supervisory/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.supervisory.getSupervisoryOrgValues',
			input ?? {},
			'completed',
		);
		return response;
	};
