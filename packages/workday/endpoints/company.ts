import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getCompanyInsiderTypes: WorkdayEndpoints['getCompanyInsiderTypes'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getCompanyInsiderTypes']
		>('v1/company/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.company.getCompanyInsiderTypes',
			input ?? {},
			'completed',
		);
		return response;
	};
