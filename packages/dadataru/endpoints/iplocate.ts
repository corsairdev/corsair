import { logEventFromContext } from 'corsair/core';
import { makeDadataruRequest } from '../client';
import type { DadataruEndpoints } from '../index';
import type { IpLocateResponse } from './types';

export const address: DadataruEndpoints['ipLocateAddress'] = async (
	ctx,
	input,
) => {
	const response = await makeDadataruRequest<IpLocateResponse>(
		'iplocate/address',
		ctx.key,
		{
			method: 'GET',
			query: input.ip ? { ip: input.ip } : {},
			apiType: 'suggest',
		},
	);

	await logEventFromContext(
		ctx,
		'dadataru.iplocate.address',
		{ ip: input.ip },
		'completed',
	);
	return response;
};
