import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getSupervisoryOrgValues: WorkdayEndpoints['getSupervisoryOrgValues'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getSupervisoryOrgValues']
		>('v1/supervisory/getSupervisoryOrgValues', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.supervisory.getSupervisoryOrgValues',
			input ?? {},
			'completed',
		);
		return response;
	};
