import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getHeadcountOptions: WorkdayEndpoints['getHeadcountOptions'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getHeadcountOptions']
		>('v1/headcount/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.headcount.getHeadcountOptions',
			input ?? {},
			'completed',
		);
		return response;
	};
