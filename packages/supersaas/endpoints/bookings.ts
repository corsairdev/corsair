import type { SupersaasEndpoints } from '..';
import { segment } from '../client';
import { call, created, deletion, updated } from './shared';
import {
	SupersaasEndpointInputSchemas as Inputs,
	SupersaasEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Every booking route takes the schedule as a top-level `schedule_id` query
 * parameter; inside the `booking` document it is ignored and a read without it
 * answers 404 (checked live 11-16).
 */
export const list: SupersaasEndpoints['bookingsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'bookings.list',
			input: Inputs.bookingsList,
			output: Outputs.bookingsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/bookings', query }),
		{ log: (_, result) => ({ count: result.length }) },
	);

export const get: SupersaasEndpoints['bookingsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'bookings.get',
			input: Inputs.bookingsGet,
			output: Outputs.bookingsGet,
		},
		input,
		({ schedule_id, booking_id }) => ({
			method: 'GET',
			path: `/bookings/${segment(booking_id)}`,
			query: { schedule_id },
		}),
		{ log: ({ booking_id }) => ({ bookingId: booking_id }) },
	);

export const create: SupersaasEndpoints['bookingsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'bookings.create',
			input: Inputs.bookingsCreate,
			output: Outputs.bookingsCreate,
		},
		input,
		({ schedule_id, user_id, webhook, ...booking }) => ({
			method: 'POST',
			path: '/bookings',
			query: { schedule_id, user_id, webhook },
			body: { booking },
			responseHeader: 'Location',
		}),
		{
			shape: (raw) => created(raw),
			// The booking's name, email and address are personal data; only ids
			// are logged.
			log: (parsed, result) => ({
				scheduleId: parsed.schedule_id,
				bookingId: result.id,
			}),
		},
	);

export const update: SupersaasEndpoints['bookingsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'bookings.update',
			input: Inputs.bookingsUpdate,
			output: Outputs.bookingsUpdate,
		},
		input,
		({ schedule_id, booking_id, ...booking }) => ({
			method: 'PUT',
			path: `/bookings/${segment(booking_id)}`,
			query: { schedule_id },
			body: { booking },
		}),
		{
			shape: (raw, { booking_id }) => updated(raw, booking_id),
			log: ({ booking_id }) => ({ bookingId: booking_id }),
		},
	);

export const remove: SupersaasEndpoints['bookingsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'bookings.delete',
			input: Inputs.bookingsDelete,
			output: Outputs.bookingsDelete,
		},
		input,
		({ schedule_id, booking_id }) => ({
			method: 'DELETE',
			path: `/bookings/${segment(booking_id)}`,
			query: { schedule_id },
		}),
		{
			shape: (raw, { booking_id }) => deletion(raw, booking_id),
			log: ({ booking_id }) => ({ bookingId: booking_id }),
		},
	);
