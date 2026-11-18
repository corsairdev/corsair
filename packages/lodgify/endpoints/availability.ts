import { logEventFromContext } from 'corsair/core';
import type { LodgifyEndpoints } from '..';
import { makeLodgifyRequest } from '../client';
import {
	LodgifyEndpointInputSchemas,
	LodgifyEndpointOutputSchemas,
} from './types';

export const get: LodgifyEndpoints['availability.get'] = async (ctx, input) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['availability.get'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.from !== undefined) query.start = parsedInput.from;
	if (parsedInput.to !== undefined) query.end = parsedInput.to;

	// `unknown` because provider API response is untrusted until parsed by Zod schema
	const response: unknown = await makeLodgifyRequest(
		`/v2/availability/${encodeURIComponent(String(parsedInput.propertyId))}`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const parsed =
		LodgifyEndpointOutputSchemas['availability.get'].parse(response);

	await logEventFromContext(
		ctx,
		'lodgify.availability.get',
		{ propertyId: parsedInput.propertyId, count: parsed.length },
		'completed',
	);

	return parsed;
};
