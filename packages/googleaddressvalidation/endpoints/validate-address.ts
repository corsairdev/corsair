import { logEventFromContext } from 'corsair/core';
import type { GoogleAddressValidationEndpoints } from '..';
import { makeGoogleAddressValidationRequest } from '../client';
import type { GoogleAddressValidationEndpointOutputs } from './types';
import { GoogleAddressValidationEndpointOutputSchemas } from './types';

export const validate: GoogleAddressValidationEndpoints['validateAddress'] =
	async (ctx, input) => {
		const response = await makeGoogleAddressValidationRequest<
			GoogleAddressValidationEndpointOutputs['validateAddress']
		>('v1:validateAddress', ctx.key, {
			method: 'POST',
			body: input,
		});

		const parsed =
			GoogleAddressValidationEndpointOutputSchemas.validateAddress.parse(
				response,
			);

		await logEventFromContext(
			ctx,
			'googleaddressvalidation.address.validate',
			{},
			'completed',
		);
		return parsed;
	};
