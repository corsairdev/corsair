import { logEventFromContext } from 'corsair/core';
import type { GoogleAddressValidationEndpoints } from '..';
import { makeGoogleAddressValidationRequest } from '../client';
import type { GoogleAddressValidationEndpointOutputs } from './types';
import {
	GoogleAddressValidationEndpointInputSchemas,
	GoogleAddressValidationEndpointOutputSchemas,
} from './types';

export const validate: GoogleAddressValidationEndpoints['validateAddress'] =
	async (ctx, input) => {
		const parsedInput =
			GoogleAddressValidationEndpointInputSchemas.validateAddress.parse(input);

		const response = await makeGoogleAddressValidationRequest<
			GoogleAddressValidationEndpointOutputs['validateAddress']
		>('v1:validateAddress', ctx.key, {
			method: 'POST',
			body: parsedInput,
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
