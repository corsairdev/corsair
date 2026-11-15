import type { SupersaasEndpoints } from '..';
import { segment } from '../client';
import { call, created, deletion } from './shared';
import {
	SupersaasEndpointInputSchemas as Inputs,
	SupersaasEndpointOutputSchemas as Outputs,
} from './types';

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
		({ booking_id }) => ({
			method: 'GET',
			path: `/bookings/${segment(booking_id)}`,
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
		({ user_id, ...booking }) => ({
			method: 'POST',
			path: '/bookings',
			query: { user_id },
			body: { booking },
		}),
		{
			shape: (raw, parsed) => created(raw, String(parsed.schedule_id)),
			log: (parsed) => ({
				scheduleId: parsed.schedule_id,
				// The booking's start is not personal data; the name and email are.
				start: parsed.start,
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
		({ booking_id, ...booking }) => ({
			method: 'PUT',
			path: `/bookings/${segment(booking_id)}`,
			body: { booking },
		}),
		{ log: ({ booking_id }) => ({ bookingId: booking_id }) },
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
		({ booking_id }) => ({
			method: 'DELETE',
			path: `/bookings/${segment(booking_id)}`,
		}),
		{
			shape: (raw, { booking_id }) => deletion(raw, booking_id),
			log: ({ booking_id }) => ({ bookingId: booking_id }),
		},
	);
