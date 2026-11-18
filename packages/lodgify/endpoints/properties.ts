import { logEventFromContext } from 'corsair/core';
import type { LodgifyEndpoints } from '..';
import { makeLodgifyRequest } from '../client';
import {
	LodgifyEndpointInputSchemas,
	LodgifyEndpointOutputSchemas,
} from './types';

export const list: LodgifyEndpoints['properties.list'] = async (ctx, input) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['properties.list'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.page !== undefined) query.page = parsedInput.page;
	if (parsedInput.size !== undefined) query.size = parsedInput.size;
	if (parsedInput.includeCount !== undefined)
		query.includeCount = parsedInput.includeCount;

	// `unknown` because provider API response is untrusted until parsed by Zod schema
	const response: unknown = await makeLodgifyRequest(
		'/v2/properties',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const parsed =
		LodgifyEndpointOutputSchemas['properties.list'].parse(response);

	await logEventFromContext(
		ctx,
		'lodgify.properties.list',
		{ count: parsed.items.length },
		'completed',
	);

	return parsed;
};

export const get: LodgifyEndpoints['properties.get'] = async (ctx, input) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['properties.get'].parse(input);

	// `unknown` because provider API response is untrusted until parsed by Zod schema
	const response: unknown = await makeLodgifyRequest(
		`/v2/properties/${encodeURIComponent(String(parsedInput.id))}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	const parsed = LodgifyEndpointOutputSchemas['properties.get'].parse(response);

	await logEventFromContext(
		ctx,
		'lodgify.properties.get',
		{ propertyId: parsed.id },
		'completed',
	);

	return parsed;
};

export const getRooms: LodgifyEndpoints['properties.getRooms'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['properties.getRooms'].parse(input);

	// `unknown` because provider API response is untrusted until parsed by Zod schema
	const response: unknown = await makeLodgifyRequest(
		`/v2/properties/${encodeURIComponent(String(parsedInput.id))}/rooms`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	const parsed =
		LodgifyEndpointOutputSchemas['properties.getRooms'].parse(response);

	await logEventFromContext(
		ctx,
		'lodgify.properties.getRooms',
		{ propertyId: parsedInput.id, count: parsed.length },
		'completed',
	);

	return parsed;
};
