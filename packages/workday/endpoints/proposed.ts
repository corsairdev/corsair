import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getProposedPositionValues: WorkdayEndpoints['getProposedPositionValues'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getProposedPositionValues']
		>('v1/proposed/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.proposed.getProposedPositionValues',
			input ?? {},
			'completed',
		);
		return response;
	};
