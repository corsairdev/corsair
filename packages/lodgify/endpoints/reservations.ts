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
	if (parsedInput.includeTransactions !== undefined)
		query.includeTransactions = parsedInput.includeTransactions;
	if (parsedInput.includeExternal !== undefined)
		query.includeExternal = parsedInput.includeExternal;
	if (parsedInput.includeQuoteDetails !== undefined)
		query.includeQuoteDetails = parsedInput.includeQuoteDetails;
	if (parsedInput.trash !== undefined) query.trash = parsedInput.trash;
	if (parsedInput.stayFilterDate !== undefined)
		query.stayFilterDate = parsedInput.stayFilterDate;

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
		{ count: parsed.items?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const listInbox: LodgifyEndpoints['reservations.listInbox'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['reservations.listInbox'].parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	for (const key of [
		'offset',
		'limit',
		'status',
		'trash',
		'propertyId',
		'periodStart',
		'periodEnd',
		'modifiedSince',
	] as const) {
		const value = parsedInput[key];
		if (value !== undefined) query[key] = value;
	}
	// `unknown` because provider JSON is untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(
		'/v1/reservation',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);
	const parsed =
		LodgifyEndpointOutputSchemas['reservations.listInbox'].parse(response);
	await logEventFromContext(
		ctx,
		'lodgify.reservations.listInbox',
		{
			count: parsed.items?.length ?? 0,
			total: parsed.total,
		},
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

export const getEnquiry: LodgifyEndpoints['reservations.getEnquiry'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['reservations.getEnquiry'].parse(input);
	// `unknown` because provider JSON is untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(
		`/v1/reservation/enquiry/${encodeURIComponent(String(parsedInput.id))}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed =
		LodgifyEndpointOutputSchemas['reservations.getEnquiry'].parse(response);
	await logEventFromContext(
		ctx,
		'lodgify.reservations.getEnquiry',
		{
			reservationId: parsed.id,
		},
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
	const { from, ...body } = parsedInput;
	const query: Record<string, string | number | boolean | undefined> = {};
	if (from !== undefined) query.from = from;

	// `unknown` because provider API response is untrusted until parsed by Zod schema
	const response: unknown = await makeLodgifyRequest(
		'/v1/reservation/booking',
		ctx.key,
		{
			method: 'POST',
			body,
			query,
		},
	);

	const parsed =
		LodgifyEndpointOutputSchemas['reservations.create'].parse(response);

	await logEventFromContext(
		ctx,
		'lodgify.reservations.create',
		{
			reservationId: parsed,
			propertyId: parsedInput.property_id,
		},
		'completed',
	);

	return parsed;
};

export const createEnquiry: LodgifyEndpoints['reservations.createEnquiry'] =
	async (ctx, input) => {
		const parsedInput =
			LodgifyEndpointInputSchemas['reservations.createEnquiry'].parse(input);
		// `unknown` because provider JSON is untrusted until parsed by the output schema.
		const response: unknown = await makeLodgifyRequest(
			'/v1/reservation/enquiry',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);
		const parsed =
			LodgifyEndpointOutputSchemas['reservations.createEnquiry'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'lodgify.reservations.createEnquiry',
			{
				reservationId: parsed,
				propertyId: parsedInput.property_id,
			},
			'completed',
		);
		return parsed;
	};

export const unreadCount: LodgifyEndpoints['reservations.unreadCount'] = async (
	ctx,
	input,
) => {
	LodgifyEndpointInputSchemas['reservations.unreadCount'].parse(input);
	// `unknown` because provider JSON is untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(
		'/v1/reservation/not_read',
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		LodgifyEndpointOutputSchemas['reservations.unreadCount'].parse(response);
	await logEventFromContext(
		ctx,
		'lodgify.reservations.unreadCount',
		{ count: parsed },
		'completed',
	);
	return parsed;
};
