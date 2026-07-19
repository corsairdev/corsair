import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getHeadcountOptions: WorkdayEndpoints['getHeadcountOptions'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getHeadcountOptions']
		>('v1/headcount/getHeadcountOptions', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.headcount.getHeadcountOptions',
			input ?? {},
			'completed',
		);
		return response;
	};
