import { logEventFromContext } from 'corsair/core';
import type { AppointoEndpoints } from '..';
import { makeAppointoRequest } from '../client';
import type { AppointoEndpointOutputs } from './types';

export const list: AppointoEndpoints['bookingsList'] = async (ctx, input) => {
	const query: Record<string, string | number | undefined> = {};
	if (input?.limit) query.limit = input.limit;
	if (input?.offset) query.offset = input.offset;
	if (input?.status) query.status = input.status;
	if (input?.booking_id) query.booking_id = input.booking_id;
	if (input?.search_term) query.search_term = input.search_term;

	const response = await makeAppointoRequest<
		AppointoEndpointOutputs['bookingsList']
	>('bookings', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'appointo.bookings.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: AppointoEndpoints['bookingsCreate'] = async (
	ctx,
	input,
) => {
	const body = {
		appointment_id: input.appointment_id,
		timestring: input.timestring,
		email: input.email,
		name: input.name,
		...(input.quantity !== undefined ? { quantity: input.quantity } : {}),
		...(input.phone !== undefined ? { phone: input.phone } : {}),
	};

	const response = await makeAppointoRequest<
		AppointoEndpointOutputs['bookingsCreate']
	>('bookings', ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'appointo.bookings.create',
		{
			appointment_id: input.appointment_id,
			timestring: input.timestring,
			quantity: input.quantity,
		},
		'completed',
	);
	return response;
};

export const reschedule: AppointoEndpoints['bookingsReschedule'] = async (
	ctx,
	input,
) => {
	const body = {
		booking_id: input.booking_id,
		timestring: input.timestring,
		...(input.customer_ids !== undefined
			? { customer_ids: input.customer_ids }
			: {}),
		...(input.override !== undefined ? { override: input.override } : {}),
	};

	const response = await makeAppointoRequest<
		AppointoEndpointOutputs['bookingsReschedule']
	>('bookings/reschedule', ctx.key, {
		method: 'PUT',
		body,
	});

	await logEventFromContext(
		ctx,
		'appointo.bookings.reschedule',
		{ ...input },
		'completed',
	);
	return response;
};

export const cancel: AppointoEndpoints['bookingsCancel'] = async (
	ctx,
	input,
) => {
	const body = {
		booking_id: input.booking_id,
		...(input.customer_ids !== undefined
			? { customer_ids: input.customer_ids }
			: {}),
	};

	const response = await makeAppointoRequest<
		AppointoEndpointOutputs['bookingsCancel']
	>('bookings/cancel', ctx.key, {
		method: 'PUT',
		body,
	});

	await logEventFromContext(
		ctx,
		'appointo.bookings.cancel',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: AppointoEndpoints['bookingsUpdate'] = async (
	ctx,
	input,
) => {
	const body = {
		booking_id: input.booking_id,
		...(input.start_buffer_time !== undefined
			? { start_buffer_time: input.start_buffer_time }
			: {}),
		...(input.end_buffer_time !== undefined
			? { end_buffer_time: input.end_buffer_time }
			: {}),
	};

	const response = await makeAppointoRequest<
		AppointoEndpointOutputs['bookingsUpdate']
	>(`bookings/${input.booking_id}`, ctx.key, {
		method: 'PUT',
		body,
	});

	await logEventFromContext(
		ctx,
		'appointo.bookings.update',
		{ ...input },
		'completed',
	);
	return response;
};
