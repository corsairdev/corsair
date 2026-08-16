import { logEventFromContext } from 'corsair/core';
import type { BigmlEndpoints } from '..';
import { makeBigmlRequest } from '../client';
import type { BigmlEndpointOutputs } from './types';

export const get: BigmlEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeBigmlRequest<BigmlEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		(await ctx.keys.get_username()) ?? '',
		ctx.key,
	);

	await logEventFromContext(
		ctx,
		'bigml.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
