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
	const query: Record<string, string | number | boolean | undefined> = {
		arrival: parsedInput.arrival,
		departure: parsedInput.departure,
	};
	parsedInput.roomTypes.forEach((room, index) => {
		query[`roomTypes[${index}].Id`] = room.id;
		if (room.people !== undefined)
			query[`roomTypes[${index}].People`] = room.people;
		for (const [guestType, count] of Object.entries(room.guest_breakdown)) {
			if (count !== undefined)
				query[`roomTypes[${index}].guest_breakdown.${guestType}`] = count;
		}
	});
	parsedInput.addOns?.forEach((addOn, index) => {
		query[`addOns[${index}].Id`] = addOn.id;
		if (addOn.units !== undefined && addOn.units !== null)
			query[`addOns[${index}].Units`] = addOn.units;
	});
	if (parsedInput.promotionCode !== undefined)
		query.promotionCode = parsedInput.promotionCode;

	// `unknown` because provider API response is untrusted until parsed by Zod schema
	const response: unknown = await makeLodgifyRequest(
		`/v2/quote/${encodeURIComponent(String(parsedInput.propertyId))}`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const parsed =
		LodgifyEndpointOutputSchemas['quotes.calculate'].parse(response);

	await logEventFromContext(
		ctx,
		'lodgify.quotes.calculate',
		{ propertyId: parsedInput.propertyId, count: parsed.length },
		'completed',
	);

	return parsed;
};
