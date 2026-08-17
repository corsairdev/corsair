import { logEventFromContext } from 'corsair/core';
import type { NextDNSEndpoints } from '..';
import { makeNextDNSRequest } from '../client';
import type { NextDNSEndpointOutputs } from './types';

export const get: NextDNSEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeNextDNSRequest<
		NextDNSEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'nextdns.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
