import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getLeaveStatusValues: WorkdayEndpoints['getLeaveStatusValues'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getLeaveStatusValues']
		>('v1/leave/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.leave.getLeaveStatusValues',
			input ?? {},
			'completed',
		);
		return response;
	};
