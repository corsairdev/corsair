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
	const body: Record<string, unknown> = {
		appointment_id: input.appointment_id,
		timestring: input.timestring,
		email: input.email,
		name: input.name,
	};
	if (input.quantity !== undefined) body.quantity = input.quantity;
	if (input.phone !== undefined) body.phone = input.phone;

	const response = await makeAppointoRequest<
		AppointoEndpointOutputs['bookingsCreate']
	>('bookings', ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'appointo.bookings.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const reschedule: AppointoEndpoints['bookingsReschedule'] = async (
	ctx,
	input,
) => {
	const body: Record<string, unknown> = {
		booking_id: input.booking_id,
		timestring: input.timestring,
	};
	if (input.customer_ids !== undefined) body.customer_ids = input.customer_ids;
	if (input.override !== undefined) body.override = input.override;

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
	const body: Record<string, unknown> = {
		booking_id: input.booking_id,
	};
	if (input.customer_ids !== undefined) body.customer_ids = input.customer_ids;

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
	const body: Record<string, unknown> = {
		booking_id: input.booking_id,
	};
	if (input.start_buffer_time !== undefined)
		body.start_buffer_time = input.start_buffer_time;
	if (input.end_buffer_time !== undefined)
		body.end_buffer_time = input.end_buffer_time;

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
