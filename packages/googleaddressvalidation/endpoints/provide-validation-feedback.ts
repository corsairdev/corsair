import { logEventFromContext } from 'corsair/core';
import type { GoogleAddressValidationEndpoints } from '..';
import { makeGoogleAddressValidationRequest } from '../client';
import type { GoogleAddressValidationEndpointOutputs } from './types';
import { GoogleAddressValidationEndpointOutputSchemas } from './types';

export const provideFeedback: GoogleAddressValidationEndpoints['provideValidationFeedback'] =
	async (ctx, input) => {
		const response = await makeGoogleAddressValidationRequest<
			GoogleAddressValidationEndpointOutputs['provideValidationFeedback']
		>('v1:provideValidationFeedback', ctx.key, {
			method: 'POST',
			body: input,
		});

		const parsed =
			GoogleAddressValidationEndpointOutputSchemas.provideValidationFeedback.parse(
				response,
			);

		await logEventFromContext(
			ctx,
			'googleaddressvalidation.address.provideFeedback',
			{},
			'completed',
		);
		return parsed;
	};
