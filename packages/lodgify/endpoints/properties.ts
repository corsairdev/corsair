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
	if (parsedInput.wid !== undefined) query.wid = parsedInput.wid;
	if (parsedInput.updatedSince !== undefined)
		query.updatedSince = parsedInput.updatedSince;
	if (parsedInput.includeCount !== undefined)
		query.includeCount = parsedInput.includeCount;
	if (parsedInput.includeInOut !== undefined)
		query.includeInOut = parsedInput.includeInOut;

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
		{ count: parsed.items?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const get: LodgifyEndpoints['properties.get'] = async (ctx, input) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['properties.get'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.wid !== undefined) query.wid = parsedInput.wid;
	if (parsedInput.includeInOut !== undefined)
		query.includeInOut = parsedInput.includeInOut;

	// `unknown` because provider API response is untrusted until parsed by Zod schema
	const response: unknown = await makeLodgifyRequest(
		`/v2/properties/${encodeURIComponent(String(parsedInput.id))}`,
		ctx.key,
		{
			method: 'GET',
			query,
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
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.wid !== undefined) query.wid = parsedInput.wid;

	// `unknown` because provider API response is untrusted until parsed by Zod schema
	const response: unknown = await makeLodgifyRequest(
		`/v2/properties/${encodeURIComponent(String(parsedInput.id))}/rooms`,
		ctx.key,
		{
			method: 'GET',
			query,
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

export const getDeleted: LodgifyEndpoints['properties.getDeleted'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['properties.getDeleted'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.deletedSince !== undefined)
		query.deletedSince = parsedInput.deletedSince;
	// `unknown` because provider JSON is untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(
		'/v2/deletedproperties',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);
	const parsed =
		LodgifyEndpointOutputSchemas['properties.getDeleted'].parse(response);
	await logEventFromContext(
		ctx,
		'lodgify.properties.getDeleted',
		{ count: parsed.length },
		'completed',
	);
	return parsed;
};

export const getAddons: LodgifyEndpoints['properties.getAddons'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['properties.getAddons'].parse(input);
	const { id, ...filters } = parsedInput;
	const query: Record<string, string | number | boolean | undefined> = {};
	if (filters.start !== undefined) query.start = filters.start;
	if (filters.end !== undefined) query.end = filters.end;
	if (filters.rid !== undefined) query.rid = filters.rid;
	// `unknown` because provider JSON is untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(
		`/v1/properties/${encodeURIComponent(String(id))}/rates/addons`,
		ctx.key,
		{ method: 'GET', query },
	);
	const parsed =
		LodgifyEndpointOutputSchemas['properties.getAddons'].parse(response);
	await logEventFromContext(
		ctx,
		'lodgify.properties.getAddons',
		{
			propertyId: id,
			count: parsed.length,
		},
		'completed',
	);
	return parsed;
};

export const getPayments: LodgifyEndpoints['properties.getPayments'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['properties.getPayments'].parse(input);
	// `unknown` because provider JSON is untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(
		`/v1/properties/${encodeURIComponent(String(parsedInput.id))}/payments`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed =
		LodgifyEndpointOutputSchemas['properties.getPayments'].parse(response);
	await logEventFromContext(
		ctx,
		'lodgify.properties.getPayments',
		{
			propertyId: parsedInput.id,
			count: parsed.length,
		},
		'completed',
	);
	return parsed;
};
