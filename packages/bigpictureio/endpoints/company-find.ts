import { logEventFromContext } from 'corsair/core';
import type { BigpictureioEndpoints } from '..';
import { makeBigpictureioRequest } from '../client';
import {
	BigpictureioEndpointInputSchemas,
	BigpictureioEndpointOutputSchemas,
} from './types';

export const get: BigpictureioEndpoints['companyFind'] = async (ctx, input) => {
	const parsed = BigpictureioEndpointInputSchemas.companyFind.parse(input);
	const response = await makeBigpictureioRequest<unknown>(
		'/v1/companies/find',
		ctx.key,
		{
			method: 'GET',
			query: {
				domain: parsed.domain,
			},
		},
	);
	const output = BigpictureioEndpointOutputSchemas.companyFind.parse(
		response ?? {},
	);
	await logEventFromContext(
		ctx,
		'bigpictureio.company.find',
		{ domain: parsed.domain },
		'completed',
	);
	return output;
};
