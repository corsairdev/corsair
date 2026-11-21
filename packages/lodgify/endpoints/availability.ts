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

function legacyAvailabilityQuery(input: {
	periodStart: string;
	periodEnd: string;
	combineRoomTypes?: boolean;
	bookingsOnly?: boolean;
	includeBookingIds?: boolean;
	modifiedSince?: string;
}): Record<string, string | number | boolean | undefined> {
	return {
		periodStart: input.periodStart,
		periodEnd: input.periodEnd,
		CombineRoomTypes: input.combineRoomTypes,
		BookingsOnly: input.bookingsOnly,
		IncludeBookingIds: input.includeBookingIds,
		ModifiedSince: input.modifiedSince,
	};
}

export const getLegacyAll: LodgifyEndpoints['availability.getLegacyAll'] =
	async (ctx, input) => {
		const parsedInput =
			LodgifyEndpointInputSchemas['availability.getLegacyAll'].parse(input);
		// `unknown` because provider JSON is untrusted until parsed by the output schema.
		const response: unknown = await makeLodgifyRequest(
			'/v1/availability',
			ctx.key,
			{
				method: 'GET',
				query: legacyAvailabilityQuery(parsedInput),
			},
		);
		const parsed =
			LodgifyEndpointOutputSchemas['availability.getLegacyAll'].parse(response);
		await logEventFromContext(
			ctx,
			'lodgify.availability.getLegacyAll',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	};

export const getLegacyProperty: LodgifyEndpoints['availability.getLegacyProperty'] =
	async (ctx, input) => {
		const parsedInput =
			LodgifyEndpointInputSchemas['availability.getLegacyProperty'].parse(
				input,
			);
		const { propertyId, ...range } = parsedInput;
		const path = `/v1/availability/${encodeURIComponent(String(propertyId))}`;
		// `unknown` because provider JSON is untrusted until parsed by the output schema.
		const response: unknown = await makeLodgifyRequest(path, ctx.key, {
			method: 'GET',
			query: legacyAvailabilityQuery(range),
		});
		const parsed =
			LodgifyEndpointOutputSchemas['availability.getLegacyProperty'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'lodgify.availability.getLegacyProperty',
			{
				propertyId,
				count: parsed.length,
			},
			'completed',
		);
		return parsed;
	};

export const getLegacyRoomType: LodgifyEndpoints['availability.getLegacyRoomType'] =
	async (ctx, input) => {
		const parsedInput =
			LodgifyEndpointInputSchemas['availability.getLegacyRoomType'].parse(
				input,
			);
		const { propertyId, roomTypeId, ...range } = parsedInput;
		const path = `/v1/availability/${encodeURIComponent(String(propertyId))}/${encodeURIComponent(String(roomTypeId))}`;
		// `unknown` because provider JSON is untrusted until parsed by the output schema.
		const response: unknown = await makeLodgifyRequest(path, ctx.key, {
			method: 'GET',
			query: legacyAvailabilityQuery(range),
		});
		const parsed =
			LodgifyEndpointOutputSchemas['availability.getLegacyRoomType'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'lodgify.availability.getLegacyRoomType',
			{
				propertyId,
				roomTypeId,
				count: parsed.length,
			},
			'completed',
		);
		return parsed;
	};
