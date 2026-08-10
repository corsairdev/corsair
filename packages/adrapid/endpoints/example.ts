import { logEventFromContext } from 'corsair/core';
import type { AdrapidEndpoints } from '..';
import { makeAdrapidRequest } from '../client';
import type { AdrapidEndpointOutputs } from './types';

export const get: AdrapidEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeAdrapidRequest<
		AdrapidEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'adrapid.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
