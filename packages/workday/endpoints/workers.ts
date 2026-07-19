import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getWorkersCollectionStaffing: WorkdayEndpoints['getWorkersCollectionStaffing'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getWorkersCollectionStaffing']
		>('v1/workers/getWorkersCollectionStaffing', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.workers.getWorkersCollectionStaffing',
			input ?? {},
			'completed',
		);
		return response;
	};
