import { logEventFromContext } from 'corsair/core';
import type { AeroLeadsEndpoints } from '..';
import type { AeroLeadsEndpointOutputs } from './types';
import { makeAeroLeadsRequest } from '../client';

export const getCompanyEmail: AeroLeadsEndpoints['emailGetCompanyEmail'] = async (ctx, input) => {
	const response = await makeAeroLeadsRequest<AeroLeadsEndpointOutputs['emailGetCompanyEmail']>(
		'get_company_email',
		ctx.key,
		{ method: 'GET', query: { email: input.email } },
	);

	await logEventFromContext(ctx, 'aeroleads.email.getCompanyEmail', { ...input }, 'completed');
	return response;
};
