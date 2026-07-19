import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getCompanyInsiderTypes: WorkdayEndpoints['getCompanyInsiderTypes'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getCompanyInsiderTypes']
		>('v1/company/getCompanyInsiderTypes', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.company.getCompanyInsiderTypes',
			input ?? {},
			'completed',
		);
		return response;
	};
