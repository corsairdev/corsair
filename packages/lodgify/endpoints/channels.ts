import { logEventFromContext } from 'corsair/core';
import type { LodgifyEndpoints } from '..';
import { makeLodgifyRequest } from '../client';
import {
	LodgifyEndpointInputSchemas,
	LodgifyEndpointOutputSchemas,
} from './types';

export const inventory: LodgifyEndpoints['channels.inventory'] = async (
	ctx,
	input,
) => {
	LodgifyEndpointInputSchemas['channels.inventory'].parse(input);
	// `unknown` because provider JSON is untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(
		'/v1/channel/xml',
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		LodgifyEndpointOutputSchemas['channels.inventory'].parse(response);
	await logEventFromContext(
		ctx,
		'lodgify.channels.inventory',
		{
			propertyCount: parsed.properties?.property?.length ?? 0,
		},
		'completed',
	);
	return parsed;
};
