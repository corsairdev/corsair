import { logEventFromContext } from 'corsair/core';
import type { BorneoEndpoints } from '..';
import { makeBorneoRequest } from '../client';
import type { BorneoEndpointOutputs } from './types';

export const get: BorneoEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeBorneoRequest<BorneoEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'borneo.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
