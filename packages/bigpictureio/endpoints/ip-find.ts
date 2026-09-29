import { logEventFromContext } from 'corsair/core';
import type { BigpictureioEndpoints } from '..';
import { BIGPICTUREIO_IP_API_BASE, makeBigpictureioRequest } from '../client';
import {
	BigpictureioEndpointInputSchemas,
	BigpictureioEndpointOutputSchemas,
} from './types';

export const find: BigpictureioEndpoints['ipFind'] = async (ctx, input) => {
	const parsed = BigpictureioEndpointInputSchemas.ipFind.parse(input);
	const response = await makeBigpictureioRequest<unknown>(
		'/v2/companies/ip',
		ctx.key,
		{
			method: 'GET',
			query: {
				ip: parsed.ip,
			},
			base: BIGPICTUREIO_IP_API_BASE,
		},
	);
	const output = BigpictureioEndpointOutputSchemas.ipFind.parse(response ?? {});
	await logEventFromContext(
		ctx,
		'bigpictureio.ip.find',
		{ ip: parsed.ip },
		'completed',
	);
	return output;
};
