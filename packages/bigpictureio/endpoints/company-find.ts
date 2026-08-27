import { logEventFromContext } from 'corsair/core';
import type { BigpictureioEndpoints } from '..';
import { makeBigpictureioRequest } from '../client';
import type { BigpictureioEndpointOutputs } from './types';

export const get: BigpictureioEndpoints['companyFind'] = async (ctx, input) => {
	const response = await makeBigpictureioRequest<
		BigpictureioEndpointOutputs['companyFind']
	>('/v1/companies/find', ctx.key, {
		method: 'GET',
		query: {
			domain: input.domain,
		},
	});

	await logEventFromContext(
		ctx,
		'bigpictureio.company.find',
		{ ...input },
		'completed',
	);

	return response;
};
