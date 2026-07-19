import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getContingentWorkerTypes: WorkdayEndpoints['getContingentWorkerTypes'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getContingentWorkerTypes']
		>('v1/contingent/getContingentWorkerTypes', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.contingent.getContingentWorkerTypes',
			input ?? {},
			'completed',
		);
		return response;
	};
