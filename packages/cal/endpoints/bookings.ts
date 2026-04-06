import { logEventFromContext } from 'corsair/core';
import type { CalEndpoints } from '..';
import { makeCalRequest } from '../client';
import type { CalEndpointOutputs } from './types';

export const list: CalEndpoints['bookingsList'] = async (ctx, input) => {
	const result = await makeCalRequest<CalEndpointOutputs['bookingsList']>(
		'/bookings',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);

	if (result.data && ctx.db.bookings) {
		try {
			for (const booking of result.data) {
				if (booking.uid) {
					await ctx.db.bookings.upsertByEntityId(booking.uid, {
						...booking,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save bookings to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'cal.bookings.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: CalEndpoints['bookingsGet'] = async (ctx, input) => {
	const result = await makeCalRequest<CalEndpointOutputs['bookingsGet']>(
		`/bookings/${input.uid}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	if (result.data && ctx.db.bookings) {
		try {
			await ctx.db.bookings.upsertByEntityId(result.data.uid, {
				...result.data,
			});
		} catch (error) {
			console.warn('Failed to save booking to database:', error);
		}
	}

	await logEventFromContext(ctx, 'cal.bookings.get', { ...input }, 'completed');
	return result;
};

export const create: CalEndpoints['bookingsCreate'] = async (ctx, input) => {
	const result = await makeCalRequest<CalEndpointOutputs['bookingsCreate']>(
		'/bookings',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	if (result.data && ctx.db.bookings) {
		try {
			await ctx.db.bookings.upsertByEntityId(result.data.uid, {
				...result.data,
			});
		} catch (error) {
			console.warn('Failed to save booking to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'cal.bookings.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const cancel: CalEndpoints['bookingsCancel'] = async (ctx, input) => {
	const { uid, ...body } = input;

	const result = await makeCalRequest<CalEndpointOutputs['bookingsCancel']>(
		`/bookings/${uid}/cancel`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	if (result.data && ctx.db.bookings) {
		try {
			await ctx.db.bookings.upsertByEntityId(result.data.uid, {
				...result.data,
			});
		} catch (error) {
			console.warn('Failed to save booking to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'cal.bookings.cancel',
		{ ...input },
		'completed',
	);
	return result;
};

export const reschedule: CalEndpoints['bookingsReschedule'] = async (
	ctx,
	input,
) => {
	const { uid, ...body } = input;

	const result = await makeCalRequest<CalEndpointOutputs['bookingsReschedule']>(
		`/bookings/${uid}/reschedule`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	if (result.data && ctx.db.bookings) {
		try {
			await ctx.db.bookings.upsertByEntityId(result.data.uid, {
				...result.data,
			});
		} catch (error) {
			console.warn('Failed to save booking to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'cal.bookings.reschedule',
		{ ...input },
		'completed',
	);
	return result;
};

export const confirm: CalEndpoints['bookingsConfirm'] = async (ctx, input) => {
	const result = await makeCalRequest<CalEndpointOutputs['bookingsConfirm']>(
		`/bookings/${input.uid}/confirm`,
		ctx.key,
		{
			method: 'POST',
		},
	);

	if (result.data && ctx.db.bookings) {
		try {
			await ctx.db.bookings.upsertByEntityId(result.data.uid, {
				...result.data,
			});
		} catch (error) {
			console.warn('Failed to save booking to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'cal.bookings.confirm',
		{ ...input },
		'completed',
	);
	return result;
};

export const decline: CalEndpoints['bookingsDecline'] = async (ctx, input) => {
	const { uid, ...body } = input;

	const result = await makeCalRequest<CalEndpointOutputs['bookingsDecline']>(
		`/bookings/${uid}/decline`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	if (result.data && ctx.db.bookings) {
		try {
			await ctx.db.bookings.upsertByEntityId(result.data.uid, {
				...result.data,
			});
		} catch (error) {
			console.warn('Failed to save booking to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'cal.bookings.decline',
		{ ...input },
		'completed',
	);
	return result;
};
