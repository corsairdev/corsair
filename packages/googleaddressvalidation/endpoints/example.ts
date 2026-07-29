import { logEventFromContext } from 'corsair/core';
import type { GoogleAddressValidationEndpoints } from '..';
import { makeGoogleAddressValidationRequest } from '../client';
import type { GoogleAddressValidationEndpointOutputs } from './types';

export const get: GoogleAddressValidationEndpoints['exampleGet'] = async (
	ctx,
	input,
) => {
	const response = await makeGoogleAddressValidationRequest<
		GoogleAddressValidationEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'googleaddressvalidation.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
