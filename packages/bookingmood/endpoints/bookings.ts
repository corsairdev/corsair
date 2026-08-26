import { logEventFromContext } from 'corsair/core';
import { makeBookingmoodRequest } from '../client';
import type { BookingmoodEndpoints } from '../index';
import type {
	BookingsCreateResponse,
	BookingsDeleteResponse,
	BookingsGetResponse,
	BookingsListResponse,
	BookingsUpdateResponse,
} from './types';

export const get: BookingmoodEndpoints['bookingsGet'] = async (ctx, input) => {
	const res = await makeBookingmoodRequest<
		BookingsGetResponse | BookingsListResponse
	>('bookings', ctx.key, {
		method: 'GET',
		query: { id: `eq.${input.id}`, select: '*' },
	});

	const booking = Array.isArray(res) ? res[0] : res;
	if (booking && ctx.db.bookings) {
		try {
			await ctx.db.bookings.upsertByEntityId(booking.id, {
				id: booking.id,
				product_id: booking.product_id || booking.rental_id,
				start_date: booking.start_date,
				end_date: booking.end_date,
				status: booking.status,
				customer_name: booking.customer_name,
				customer_email: booking.customer_email,
				price: booking.price,
				created_at: booking.created_at ? new Date(booking.created_at) : null,
				updated_at: booking.updated_at ? new Date(booking.updated_at) : null,
			});
		} catch (error) {
			console.warn('Failed to save booking to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'bookingmood.bookings.get',
		{ ...input },
		'completed',
	);
	return booking ?? { id: input.id };
};

export const list: BookingmoodEndpoints['bookingsList'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {
		select: '*',
	};
	if (input?.product_id) query.product_id = `eq.${input.product_id}`;
	if (input?.rental_id) query.rental_id = `eq.${input.rental_id}`;
	if (input?.status) query.status = `eq.${input.status}`;
	if (input?.limit) query.limit = input.limit;
	if (input?.offset) query.offset = input.offset;

	const res = await makeBookingmoodRequest<BookingsListResponse>(
		'bookings',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const bookings = Array.isArray(res) ? res : [];
	if (ctx.db.bookings) {
		try {
			for (const booking of bookings) {
				await ctx.db.bookings.upsertByEntityId(booking.id, {
					id: booking.id,
					product_id: booking.product_id || booking.rental_id,
					start_date: booking.start_date,
					end_date: booking.end_date,
					status: booking.status,
					customer_name: booking.customer_name,
					customer_email: booking.customer_email,
					price: booking.price,
					created_at: booking.created_at ? new Date(booking.created_at) : null,
					updated_at: booking.updated_at ? new Date(booking.updated_at) : null,
				});
			}
		} catch (error) {
			console.warn('Failed to save bookings to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'bookingmood.bookings.list',
		{ ...input },
		'completed',
	);
	return bookings;
};

export const create: BookingmoodEndpoints['bookingsCreate'] = async (
	ctx,
	input,
) => {
	const res = await makeBookingmoodRequest<
		BookingsCreateResponse | BookingsCreateResponse[]
	>('bookings', ctx.key, {
		method: 'POST',
		body: input,
	});

	const created = Array.isArray(res) ? res[0]! : res;
	if (created && ctx.db.bookings) {
		try {
			await ctx.db.bookings.upsertByEntityId(created.id, {
				id: created.id,
				product_id: created.product_id || created.rental_id,
				start_date: created.start_date,
				end_date: created.end_date,
				status: created.status,
				customer_name: created.customer_name,
				customer_email: created.customer_email,
				price: created.price,
				created_at: created.created_at ? new Date(created.created_at) : null,
				updated_at: created.updated_at ? new Date(created.updated_at) : null,
			});
		} catch (error) {
			console.warn('Failed to save created booking to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'bookingmood.bookings.create',
		{ ...input },
		'completed',
	);
	return created;
};

export const update: BookingmoodEndpoints['bookingsUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const res = await makeBookingmoodRequest<
		BookingsUpdateResponse | BookingsUpdateResponse[]
	>('bookings', ctx.key, {
		method: 'PATCH',
		query: { id: `eq.${id}` },
		body,
	});

	const updated = Array.isArray(res) ? res[0]! : (res ?? { id, ...body });
	if (updated && ctx.db.bookings) {
		try {
			await ctx.db.bookings.upsertByEntityId(updated.id, {
				id: updated.id,
				product_id: updated.product_id || updated.rental_id,
				start_date: updated.start_date,
				end_date: updated.end_date,
				status: updated.status,
				customer_name: updated.customer_name,
				customer_email: updated.customer_email,
				price: updated.price,
				created_at: updated.created_at ? new Date(updated.created_at) : null,
				updated_at: updated.updated_at ? new Date(updated.updated_at) : null,
			});
		} catch (error) {
			console.warn('Failed to save updated booking to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'bookingmood.bookings.update',
		{ ...input },
		'completed',
	);
	return updated;
};

export const deleteBooking: BookingmoodEndpoints['bookingsDelete'] = async (
	ctx,
	input,
) => {
	await makeBookingmoodRequest<BookingsDeleteResponse>('bookings', ctx.key, {
		method: 'DELETE',
		query: { id: `eq.${input.id}` },
	});

	if (ctx.db.bookings) {
		try {
			await ctx.db.bookings.deleteByEntityId(input.id);
		} catch (error) {
			console.warn('Failed to delete booking from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'bookingmood.bookings.delete',
		{ ...input },
		'completed',
	);
	return { success: true, id: input.id };
};
