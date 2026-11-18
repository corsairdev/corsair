import { logEventFromContext } from 'corsair/core';
import type { LodgifyEndpoints } from '..';
import { makeLodgifyRequest } from '../client';
import {
	LodgifyEndpointInputSchemas,
	LodgifyEndpointOutputSchemas,
} from './types';

export const calculate: LodgifyEndpoints['quotes.calculate'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['quotes.calculate'].parse(input);

	// `unknown` because provider API response is untrusted until parsed by Zod schema
	const response: unknown = await makeLodgifyRequest('/v2/quote', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});

	const parsed =
		LodgifyEndpointOutputSchemas['quotes.calculate'].parse(response);

	await logEventFromContext(
		ctx,
		'lodgify.quotes.calculate',
		{ propertyId: parsedInput.property_id },
		'completed',
	);

	return parsed;
};
