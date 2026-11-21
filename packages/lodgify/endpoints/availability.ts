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
	query.start = parsedInput.from;
	query.end = parsedInput.to;
	if (parsedInput.includeDetails !== undefined)
		query.includeDetails = parsedInput.includeDetails;

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

export const getAll: LodgifyEndpoints['availability.getAll'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['availability.getAll'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {
		start: parsedInput.from,
		end: parsedInput.to,
	};
	if (parsedInput.includeDetails !== undefined)
		query.includeDetails = parsedInput.includeDetails;
	// `unknown` because provider JSON is untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(
		'/v2/availability',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);
	const parsed =
		LodgifyEndpointOutputSchemas['availability.getAll'].parse(response);
	await logEventFromContext(
		ctx,
		'lodgify.availability.getAll',
		{ count: parsed.length },
		'completed',
	);
	return parsed;
};

export const getRoomType: LodgifyEndpoints['availability.getRoomType'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['availability.getRoomType'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {
		start: parsedInput.from,
		end: parsedInput.to,
	};
	if (parsedInput.includeDetails !== undefined)
		query.includeDetails = parsedInput.includeDetails;
	const path = `/v2/availability/${encodeURIComponent(String(parsedInput.propertyId))}/${encodeURIComponent(String(parsedInput.roomTypeId))}`;
	// `unknown` because provider JSON is untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(path, ctx.key, {
		method: 'GET',
		query,
	});
	const parsed =
		LodgifyEndpointOutputSchemas['availability.getRoomType'].parse(response);
	await logEventFromContext(
		ctx,
		'lodgify.availability.getRoomType',
		{
			propertyId: parsedInput.propertyId,
			roomTypeId: parsedInput.roomTypeId,
			count: parsed.length,
		},
		'completed',
	);
	return parsed;
};

export const set: LodgifyEndpoints['availability.set'] = async (ctx, input) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['availability.set'].parse(input);
	const { propertyId, roomTypeId, ...body } = parsedInput;
	const path = `/v1/availability/${encodeURIComponent(String(propertyId))}/${encodeURIComponent(String(roomTypeId))}/set`;
	// `unknown` because provider JSON is untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(path, ctx.key, {
		method: 'POST',
		body,
	});
	const parsed =
		LodgifyEndpointOutputSchemas['availability.set'].parse(response);
	await logEventFromContext(
		ctx,
		'lodgify.availability.set',
		{
			propertyId,
			roomTypeId,
		},
		'completed',
	);
	return parsed;
};
