import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { LodgifyEndpoints } from '..';
import { makeLodgifyRequest } from '../client';
import {
	LodgifyEndpointInputSchemas,
	LodgifyEndpointOutputSchemas,
} from './types';

async function reservationAction<TInput extends { id: number }, TOutput>(
	ctx: Parameters<LodgifyEndpoints['reservations.get']>[0],
	// `unknown` because caller input must be validated by the operation-specific Zod schema.
	input: unknown,
	inputSchema: z.ZodType<TInput>,
	outputSchema: z.ZodType<TOutput>,
	operation: string,
	method: 'GET' | 'PUT' | 'DELETE',
	path: (id: number) => string,
	query?: Record<string, string | number | boolean | undefined>,
): Promise<TOutput> {
	const parsedInput = inputSchema.parse(input);
	// `unknown` because provider responses are untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(
		path(parsedInput.id),
		ctx.key,
		{ method, query },
	);
	const parsed = outputSchema.parse(response);
	await logEventFromContext(
		ctx,
		operation,
		{ reservationId: parsedInput.id },
		'completed',
	);
	return parsed;
}

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

export const getBookingV1: LodgifyEndpoints['reservations.getBookingV1'] =
	async (ctx, input) =>
		reservationAction(
			ctx,
			input,
			LodgifyEndpointInputSchemas['reservations.getBookingV1'],
			LodgifyEndpointOutputSchemas['reservations.getBookingV1'],
			'lodgify.reservations.getBookingV1',
			'GET',
			(id) => `/v1/reservation/booking/${encodeURIComponent(String(id))}`,
		);

export const updateBooking: LodgifyEndpoints['reservations.updateBooking'] =
	async (ctx, input) => {
		const parsedInput =
			LodgifyEndpointInputSchemas['reservations.updateBooking'].parse(input);
		// `unknown` because provider responses are untrusted until parsed by the output schema.
		const response: unknown = await makeLodgifyRequest(
			`/v1/reservation/booking/${encodeURIComponent(String(parsedInput.id))}`,
			ctx.key,
			{ method: 'PUT', body: parsedInput.booking },
		);
		const parsed =
			LodgifyEndpointOutputSchemas['reservations.updateBooking'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'lodgify.reservations.updateBooking',
			{
				reservationId: parsedInput.id,
			},
			'completed',
		);
		return parsed;
	};

export const deleteBooking: LodgifyEndpoints['reservations.deleteBooking'] =
	async (ctx, input) =>
		reservationAction(
			ctx,
			input,
			LodgifyEndpointInputSchemas['reservations.deleteBooking'],
			LodgifyEndpointOutputSchemas['reservations.deleteBooking'],
			'lodgify.reservations.deleteBooking',
			'DELETE',
			(id) => `/v1/reservation/booking/${encodeURIComponent(String(id))}`,
		);

export const deleteEnquiry: LodgifyEndpoints['reservations.deleteEnquiry'] =
	async (ctx, input) =>
		reservationAction(
			ctx,
			input,
			LodgifyEndpointInputSchemas['reservations.deleteEnquiry'],
			LodgifyEndpointOutputSchemas['reservations.deleteEnquiry'],
			'lodgify.reservations.deleteEnquiry',
			'DELETE',
			(id) => `/v1/reservation/enquiry/${encodeURIComponent(String(id))}`,
		);

export const createCallMeBack: LodgifyEndpoints['reservations.createCallMeBack'] =
	async (ctx, input) => {
		const parsedInput =
			LodgifyEndpointInputSchemas['reservations.createCallMeBack'].parse(input);
		// `unknown` because provider responses are untrusted until parsed by the output schema.
		const response: unknown = await makeLodgifyRequest(
			'/v1/reservation/callmeback',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);
		const parsed =
			LodgifyEndpointOutputSchemas['reservations.createCallMeBack'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'lodgify.reservations.createCallMeBack',
			{
				reservationId: parsed,
				propertyId: parsedInput.property_id,
			},
			'completed',
		);
		return parsed;
	};

export const createQuote: LodgifyEndpoints['reservations.createQuote'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['reservations.createQuote'].parse(input);
	const { id, ...body } = parsedInput;
	// `unknown` because provider responses are untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(
		`/v1/reservation/booking/${encodeURIComponent(String(id))}/quote`,
		ctx.key,
		{ method: 'POST', body },
	);
	const parsed =
		LodgifyEndpointOutputSchemas['reservations.createQuote'].parse(response);
	await logEventFromContext(
		ctx,
		'lodgify.reservations.createQuote',
		{
			reservationId: id,
			quoteId: parsed,
		},
		'completed',
	);
	return parsed;
};

export const getQuote: LodgifyEndpoints['reservations.getQuote'] = async (
	ctx,
	input,
) =>
	reservationAction(
		ctx,
		input,
		LodgifyEndpointInputSchemas['reservations.getQuote'],
		LodgifyEndpointOutputSchemas['reservations.getQuote'],
		'lodgify.reservations.getQuote',
		'GET',
		(id) => `/v1/reservation/booking/${encodeURIComponent(String(id))}/quote`,
	);

export const getPaymentLinkV1: LodgifyEndpoints['reservations.getPaymentLinkV1'] =
	async (ctx, input) =>
		reservationAction(
			ctx,
			input,
			LodgifyEndpointInputSchemas['reservations.getPaymentLinkV1'],
			LodgifyEndpointOutputSchemas['reservations.getPaymentLinkV1'],
			'lodgify.reservations.getPaymentLinkV1',
			'GET',
			(id) =>
				`/v1/reservation/booking/${encodeURIComponent(String(id))}/quote/paymentLink`,
		);

export const getPaymentLink: LodgifyEndpoints['reservations.getPaymentLink'] =
	async (ctx, input) =>
		reservationAction(
			ctx,
			input,
			LodgifyEndpointInputSchemas['reservations.getPaymentLink'],
			LodgifyEndpointOutputSchemas['reservations.getPaymentLink'],
			'lodgify.reservations.getPaymentLink',
			'GET',
			(id) =>
				`/v2/reservations/bookings/${encodeURIComponent(String(id))}/quote/paymentLink`,
		);

function legacyReservationBatch(
	ctx: Parameters<LodgifyEndpoints['reservations.deleteMany']>[0],
	// `unknown` because caller input is parsed by the batch operation's Zod schema.
	input: unknown,
	outputSchema: z.ZodType<undefined>,
	operation: string,
	path: string,
): Promise<undefined> {
	const parsedInput =
		LodgifyEndpointInputSchemas['reservations.deleteMany'].parse(input);
	return (async () => {
		// `unknown` because provider responses are untrusted until parsed by the output schema.
		const response: unknown = await makeLodgifyRequest(path, ctx.key, {
			method: 'POST',
			body: parsedInput,
		});
		const parsed = outputSchema.parse(response);
		await logEventFromContext(
			ctx,
			operation,
			{ count: parsedInput.length },
			'completed',
		);
		return parsed;
	})();
}

export const deleteMany: LodgifyEndpoints['reservations.deleteMany'] = async (
	ctx,
	input,
) =>
	legacyReservationBatch(
		ctx,
		input,
		LodgifyEndpointOutputSchemas['reservations.deleteMany'],
		'lodgify.reservations.deleteMany',
		'/v1/reservation/delete',
	);

export const markManyReplied: LodgifyEndpoints['reservations.markManyReplied'] =
	async (ctx, input) =>
		legacyReservationBatch(
			ctx,
			input,
			LodgifyEndpointOutputSchemas['reservations.markManyReplied'],
			'lodgify.reservations.markManyReplied',
			'/v1/reservation/replied',
		);

export const markManyNotReplied: LodgifyEndpoints['reservations.markManyNotReplied'] =
	async (ctx, input) =>
		legacyReservationBatch(
			ctx,
			input,
			LodgifyEndpointOutputSchemas['reservations.markManyNotReplied'],
			'lodgify.reservations.markManyNotReplied',
			'/v1/reservation/not_replied',
		);

export const recoverBooking: LodgifyEndpoints['reservations.recoverBooking'] =
	async (ctx, input) =>
		reservationAction(
			ctx,
			input,
			LodgifyEndpointInputSchemas['reservations.recoverBooking'],
			LodgifyEndpointOutputSchemas['reservations.recoverBooking'],
			'lodgify.reservations.recoverBooking',
			'PUT',
			(id) =>
				`/v1/reservation/booking/${encodeURIComponent(String(id))}/recover`,
		);

export const recoverEnquiry: LodgifyEndpoints['reservations.recoverEnquiry'] =
	async (ctx, input) =>
		reservationAction(
			ctx,
			input,
			LodgifyEndpointInputSchemas['reservations.recoverEnquiry'],
			LodgifyEndpointOutputSchemas['reservations.recoverEnquiry'],
			'lodgify.reservations.recoverEnquiry',
			'PUT',
			(id) =>
				`/v1/reservation/enquiry/${encodeURIComponent(String(id))}/recover`,
		);

export const reopenBooking: LodgifyEndpoints['reservations.reopenBooking'] =
	async (ctx, input) =>
		reservationAction(
			ctx,
			input,
			LodgifyEndpointInputSchemas['reservations.reopenBooking'],
			LodgifyEndpointOutputSchemas['reservations.reopenBooking'],
			'lodgify.reservations.reopenBooking',
			'PUT',
			(id) =>
				`/v1/reservation/booking/${encodeURIComponent(String(id))}/reopen`,
		);

export const declineBooking: LodgifyEndpoints['reservations.declineBooking'] =
	async (ctx, input) =>
		reservationAction(
			ctx,
			input,
			LodgifyEndpointInputSchemas['reservations.declineBooking'],
			LodgifyEndpointOutputSchemas['reservations.declineBooking'],
			'lodgify.reservations.declineBooking',
			'PUT',
			(id) =>
				`/v1/reservation/booking/${encodeURIComponent(String(id))}/decline`,
		);

export const tentativeBooking: LodgifyEndpoints['reservations.tentativeBooking'] =
	async (ctx, input) => {
		const parsedInput =
			LodgifyEndpointInputSchemas['reservations.tentativeBooking'].parse(input);
		const { id, requestPayment } = parsedInput;
		const query: Record<string, string | number | boolean | undefined> = {};
		if (requestPayment !== undefined) query.requestPayment = requestPayment;
		return reservationAction(
			ctx,
			parsedInput,
			LodgifyEndpointInputSchemas['reservations.tentativeBooking'],
			LodgifyEndpointOutputSchemas['reservations.tentativeBooking'],
			'lodgify.reservations.tentativeBooking',
			'PUT',
			() =>
				`/v1/reservation/booking/${encodeURIComponent(String(id))}/tentative`,
			query,
		);
	};

export const bookBooking: LodgifyEndpoints['reservations.bookBooking'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['reservations.bookBooking'].parse(input);
	const { id, requestPayment } = parsedInput;
	const query: Record<string, string | number | boolean | undefined> = {};
	if (requestPayment !== undefined) query.requestPayment = requestPayment;
	return reservationAction(
		ctx,
		parsedInput,
		LodgifyEndpointInputSchemas['reservations.bookBooking'],
		LodgifyEndpointOutputSchemas['reservations.bookBooking'],
		'lodgify.reservations.bookBooking',
		'PUT',
		() => `/v1/reservation/booking/${encodeURIComponent(String(id))}/book`,
		query,
	);
};

export const declineEnquiry: LodgifyEndpoints['reservations.declineEnquiry'] =
	async (ctx, input) =>
		reservationAction(
			ctx,
			input,
			LodgifyEndpointInputSchemas['reservations.declineEnquiry'],
			LodgifyEndpointOutputSchemas['reservations.declineEnquiry'],
			'lodgify.reservations.declineEnquiry',
			'PUT',
			(id) =>
				`/v1/reservation/enquiry/${encodeURIComponent(String(id))}/decline`,
		);

export const reopenEnquiry: LodgifyEndpoints['reservations.reopenEnquiry'] =
	async (ctx, input) =>
		reservationAction(
			ctx,
			input,
			LodgifyEndpointInputSchemas['reservations.reopenEnquiry'],
			LodgifyEndpointOutputSchemas['reservations.reopenEnquiry'],
			'lodgify.reservations.reopenEnquiry',
			'PUT',
			(id) =>
				`/v1/reservation/enquiry/${encodeURIComponent(String(id))}/reopen`,
		);

export const requestPayment: LodgifyEndpoints['reservations.requestPayment'] =
	async (ctx, input) =>
		reservationAction(
			ctx,
			input,
			LodgifyEndpointInputSchemas['reservations.requestPayment'],
			LodgifyEndpointOutputSchemas['reservations.requestPayment'],
			'lodgify.reservations.requestPayment',
			'PUT',
			(id) =>
				`/v1/reservation/booking/${encodeURIComponent(String(id))}/request_payment`,
		);

export const checkInV1: LodgifyEndpoints['reservations.checkInV1'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['reservations.checkInV1'].parse(input);
	const { id, time } = parsedInput;
	// `unknown` because provider responses are untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(
		`/v1/reservation/booking/${encodeURIComponent(String(id))}/checkin`,
		ctx.key,
		{
			method: 'PUT',
			body: { time },
		},
	);
	const parsed =
		LodgifyEndpointOutputSchemas['reservations.checkInV1'].parse(response);
	await logEventFromContext(
		ctx,
		'lodgify.reservations.checkInV1',
		{ reservationId: id },
		'completed',
	);
	return parsed;
};

export const checkOutV1: LodgifyEndpoints['reservations.checkOutV1'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['reservations.checkOutV1'].parse(input);
	const { id, time } = parsedInput;
	// `unknown` because provider responses are untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(
		`/v1/reservation/booking/${encodeURIComponent(String(id))}/checkout`,
		ctx.key,
		{
			method: 'PUT',
			body: { time },
		},
	);
	const parsed =
		LodgifyEndpointOutputSchemas['reservations.checkOutV1'].parse(response);
	await logEventFromContext(
		ctx,
		'lodgify.reservations.checkOutV1',
		{ reservationId: id },
		'completed',
	);
	return parsed;
};

export const checkIn: LodgifyEndpoints['reservations.checkIn'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['reservations.checkIn'].parse(input);
	const { id, time } = parsedInput;
	// `unknown` because provider responses are untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(
		`/v2/reservations/bookings/${encodeURIComponent(String(id))}/checkin`,
		ctx.key,
		{
			method: 'PUT',
			body: { time },
		},
	);
	const parsed =
		LodgifyEndpointOutputSchemas['reservations.checkIn'].parse(response);
	await logEventFromContext(
		ctx,
		'lodgify.reservations.checkIn',
		{ reservationId: id },
		'completed',
	);
	return parsed;
};

export const checkOut: LodgifyEndpoints['reservations.checkOut'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LodgifyEndpointInputSchemas['reservations.checkOut'].parse(input);
	const { id, time } = parsedInput;
	// `unknown` because provider responses are untrusted until parsed by the output schema.
	const response: unknown = await makeLodgifyRequest(
		`/v2/reservations/bookings/${encodeURIComponent(String(id))}/checkout`,
		ctx.key,
		{
			method: 'PUT',
			body: { time },
		},
	);
	const parsed =
		LodgifyEndpointOutputSchemas['reservations.checkOut'].parse(response);
	await logEventFromContext(
		ctx,
		'lodgify.reservations.checkOut',
		{ reservationId: id },
		'completed',
	);
	return parsed;
};

export const markBookingReplied: LodgifyEndpoints['reservations.markBookingReplied'] =
	async (ctx, input) =>
		reservationAction(
			ctx,
			input,
			LodgifyEndpointInputSchemas['reservations.markBookingReplied'],
			LodgifyEndpointOutputSchemas['reservations.markBookingReplied'],
			'lodgify.reservations.markBookingReplied',
			'PUT',
			(id) =>
				`/v1/reservation/booking/${encodeURIComponent(String(id))}/replied`,
		);

export const markEnquiryReplied: LodgifyEndpoints['reservations.markEnquiryReplied'] =
	async (ctx, input) =>
		reservationAction(
			ctx,
			input,
			LodgifyEndpointInputSchemas['reservations.markEnquiryReplied'],
			LodgifyEndpointOutputSchemas['reservations.markEnquiryReplied'],
			'lodgify.reservations.markEnquiryReplied',
			'PUT',
			(id) =>
				`/v1/reservation/enquiry/${encodeURIComponent(String(id))}/replied`,
		);

export const markBookingNotReplied: LodgifyEndpoints['reservations.markBookingNotReplied'] =
	async (ctx, input) =>
		reservationAction(
			ctx,
			input,
			LodgifyEndpointInputSchemas['reservations.markBookingNotReplied'],
			LodgifyEndpointOutputSchemas['reservations.markBookingNotReplied'],
			'lodgify.reservations.markBookingNotReplied',
			'PUT',
			(id) =>
				`/v1/reservation/booking/${encodeURIComponent(String(id))}/not_replied`,
		);

export const markEnquiryNotReplied: LodgifyEndpoints['reservations.markEnquiryNotReplied'] =
	async (ctx, input) =>
		reservationAction(
			ctx,
			input,
			LodgifyEndpointInputSchemas['reservations.markEnquiryNotReplied'],
			LodgifyEndpointOutputSchemas['reservations.markEnquiryNotReplied'],
			'lodgify.reservations.markEnquiryNotReplied',
			'PUT',
			(id) =>
				`/v1/reservation/enquiry/${encodeURIComponent(String(id))}/not_replied`,
		);

export const getExternalBookings: LodgifyEndpoints['reservations.getExternalBookings'] =
	async (ctx, input) => {
		const parsedInput =
			LodgifyEndpointInputSchemas['reservations.getExternalBookings'].parse(
				input,
			);
		// `unknown` because provider responses are untrusted until parsed by the output schema.
		const response: unknown = await makeLodgifyRequest(
			`/v2/reservations/bookings/${encodeURIComponent(String(parsedInput.id))}/externalBookings`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed =
			LodgifyEndpointOutputSchemas['reservations.getExternalBookings'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'lodgify.reservations.getExternalBookings',
			{
				reservationId: parsedInput.id,
				count: parsed.external_bookings?.length ?? 0,
			},
			'completed',
		);
		return parsed;
	};

export const updateKeyCodes: LodgifyEndpoints['reservations.updateKeyCodes'] =
	async (ctx, input) => {
		const parsedInput =
			LodgifyEndpointInputSchemas['reservations.updateKeyCodes'].parse(input);
		const { id, rooms } = parsedInput;
		// `unknown` because provider responses are untrusted until parsed by the output schema.
		const response: unknown = await makeLodgifyRequest(
			`/v2/reservations/bookings/${encodeURIComponent(String(id))}/keyCodes`,
			ctx.key,
			{
				method: 'PUT',
				body: { rooms },
			},
		);
		const parsed =
			LodgifyEndpointOutputSchemas['reservations.updateKeyCodes'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'lodgify.reservations.updateKeyCodes',
			{
				reservationId: id,
				roomCount: rooms?.length ?? 0,
			},
			'completed',
		);
		return parsed;
	};
