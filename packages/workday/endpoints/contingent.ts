import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getContingentWorkerTypes: WorkdayEndpoints['getContingentWorkerTypes'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getContingentWorkerTypes']
		>('v1/contingent/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.contingent.getContingentWorkerTypes',
			input ?? {},
			'completed',
		);
		return response;
	};
