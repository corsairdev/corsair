import { logEventFromContext } from 'corsair/core';
import type { VeriphoneEndpoints } from '..';
import { makeVeriphoneRequest } from '../client';
import type { VeriphoneEndpointOutputs } from './types';

export const verify: VeriphoneEndpoints['verify'] = async (ctx, input) => {
	const response = await makeVeriphoneRequest<
		VeriphoneEndpointOutputs['verify']
	>('v3/verify', ctx.key, {
		method: 'GET',
		query: {
			phone: input.phone,
			default_country: input.default_country,
			mode: input.mode,
			record: input.record,
		},
	});

	await logEventFromContext(
		ctx,
		'veriphone.verify',
		{ mode: input.mode },
		'completed',
	);

	return response;
};
