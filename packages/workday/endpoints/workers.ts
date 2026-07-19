import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getWorkersCollectionStaffing: WorkdayEndpoints['getWorkersCollectionStaffing'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getWorkersCollectionStaffing']
		>('v1/workers/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.workers.getWorkersCollectionStaffing',
			input ?? {},
			'completed',
		);
		return response;
	};
