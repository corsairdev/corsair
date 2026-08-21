import { logEventFromContext } from 'corsair/core';
import type { GoogleAddressValidationEndpoints } from '..';
import { makeGoogleAddressValidationRequest } from '../client';
import type { GoogleAddressValidationEndpointOutputs } from './types';
import {
	GoogleAddressValidationEndpointInputSchemas,
	GoogleAddressValidationEndpointOutputSchemas,
} from './types';

export const provideFeedback: GoogleAddressValidationEndpoints['provideValidationFeedback'] =
	async (ctx, input) => {
		const parsedInput =
			GoogleAddressValidationEndpointInputSchemas.provideValidationFeedback.parse(
				input,
			);

		const response = await makeGoogleAddressValidationRequest<
			GoogleAddressValidationEndpointOutputs['provideValidationFeedback']
		>('v1:provideValidationFeedback', ctx.key, {
			method: 'POST',
			body: parsedInput,
		});

		const parsed =
			GoogleAddressValidationEndpointOutputSchemas.provideValidationFeedback.parse(
				response === undefined ? {} : response,
			);

		await logEventFromContext(
			ctx,
			'googleaddressvalidation.address.provideFeedback',
			{},
			'completed',
		);
		return parsed;
	};
