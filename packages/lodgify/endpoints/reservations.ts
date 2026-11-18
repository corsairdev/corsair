import { logEventFromContext } from 'corsair/core';
import type { LodgifyEndpoints } from '..';
import { makeLodgifyRequest } from '../client';
import {
	LodgifyEndpointInputSchemas,
	LodgifyEndpointOutputSchemas,
} from './types';

export const list: LodgifyEndpoints['reservations.list'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['reservations.list'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.page !== undefined) query.page = parsedInput.page;
	if (parsedInput.size !== undefined) query.size = parsedInput.size;
	if (parsedInput.stayFilter !== undefined)
		query.stayFilter = parsedInput.stayFilter;
	if (parsedInput.updatedSince !== undefined)
		query.updatedSince = parsedInput.updatedSince;
	if (parsedInput.includeCount !== undefined)
		query.includeCount = parsedInput.includeCount;
	if (parsedInput.includeExternal !== undefined)
		query.includeExternal = parsedInput.includeExternal;

	// `unknown` because provider API response is untrusted until parsed by Zod schema
	const response: unknown = await makeLodgifyRequest(
		'/v2/reservations/bookings',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const parsed =
		LodgifyEndpointOutputSchemas['reservations.list'].parse(response);

	await logEventFromContext(
		ctx,
		'lodgify.reservations.list',
		{ count: parsed.items.length },
		'completed',
	);

	return parsed;
};

export const get: LodgifyEndpoints['reservations.get'] = async (ctx, input) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['reservations.get'].parse(input);

	// `unknown` because provider API response is untrusted until parsed by Zod schema
	const response: unknown = await makeLodgifyRequest(
		`/v2/reservations/bookings/${encodeURIComponent(String(parsedInput.id))}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	const parsed =
		LodgifyEndpointOutputSchemas['reservations.get'].parse(response);

	await logEventFromContext(
		ctx,
		'lodgify.reservations.get',
		{ reservationId: parsed.id },
		'completed',
	);

	return parsed;
};

export const create: LodgifyEndpoints['reservations.create'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['reservations.create'].parse(input);

	// `unknown` because provider API response is untrusted until parsed by Zod schema
	const response: unknown = await makeLodgifyRequest(
		'/v2/reservations/bookings',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);

	const parsed =
		LodgifyEndpointOutputSchemas['reservations.create'].parse(response);

	await logEventFromContext(
		ctx,
		'lodgify.reservations.create',
		{
			reservationId: parsed.id,
			propertyId: parsed.property_id ?? parsedInput.property_id,
		},
		'completed',
	);

	return parsed;
};
