import { logEventFromContext } from 'corsair/core';
import type { LodgifyEndpoints } from '..';
import { makeLodgifyRequest } from '../client';
import {
	LodgifyEndpointInputSchemas,
	LodgifyEndpointOutputSchemas,
} from './types';

export const calendar: LodgifyEndpoints['rates.calendar'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['rates.calendar'].parse(input);
	// `unknown` because provider JSON is untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(
		'/v2/rates/calendar',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
		},
	);
	const parsed = LodgifyEndpointOutputSchemas['rates.calendar'].parse(response);
	await logEventFromContext(
		ctx,
		'lodgify.rates.calendar',
		{
			houseId: parsedInput.houseId,
			roomTypeId: parsedInput.roomTypeId,
			count: parsed.calendar_items?.length ?? 0,
		},
		'completed',
	);
	return parsed;
};

export const calendarSimple: LodgifyEndpoints['rates.calendarSimple'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['rates.calendarSimple'].parse(input);
	// `unknown` because provider JSON is untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(
		'/v1/rates/calendar',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
		},
	);
	const parsed =
		LodgifyEndpointOutputSchemas['rates.calendarSimple'].parse(response);
	await logEventFromContext(
		ctx,
		'lodgify.rates.calendarSimple',
		{
			houseId: parsedInput.houseId,
			roomTypeId: parsedInput.roomTypeId,
			count: parsed.length,
		},
		'completed',
	);
	return parsed;
};

export const settings: LodgifyEndpoints['rates.settings'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['rates.settings'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.houseId !== undefined) query.houseId = parsedInput.houseId;
	// `unknown` because provider JSON is untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(
		'/v2/rates/settings',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);
	const parsed = LodgifyEndpointOutputSchemas['rates.settings'].parse(response);
	await logEventFromContext(
		ctx,
		'lodgify.rates.settings',
		{
			houseId: parsedInput.houseId,
		},
		'completed',
	);
	return parsed;
};

export const update: LodgifyEndpoints['rates.update'] = async (ctx, input) => {
	const parsedInput = LodgifyEndpointInputSchemas['rates.update'].parse(input);
	// `unknown` because provider JSON is untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(
		'/v1/rates/savewithoutavailability',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);
	const parsed = LodgifyEndpointOutputSchemas['rates.update'].parse(response);
	await logEventFromContext(
		ctx,
		'lodgify.rates.update',
		{
			propertyId: parsedInput.property_id,
			roomTypeId: parsedInput.room_type_id,
			success: parsed,
		},
		'completed',
	);
	return parsed;
};
