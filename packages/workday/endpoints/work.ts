import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getWorkStudyAwards: WorkdayEndpoints['getWorkStudyAwards'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getWorkStudyAwards']
		>('v1/work/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.work.getWorkStudyAwards',
			input ?? {},
			'completed',
		);
		return response;
	};
