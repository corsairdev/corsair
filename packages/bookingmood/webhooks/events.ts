import type { BookingmoodWebhooksType } from '../index';
import {
	createBookingmoodMatch,
	verifyBookingmoodWebhookSignature,
} from './types';

export const bookingCreated: BookingmoodWebhooksType['bookingCreated'] = {
	match: createBookingmoodMatch('booking.created'),
	handler: async (ctx, request) => {
		const verification = verifyBookingmoodWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}
		const data = request.payload.data;
		if (data.id && typeof data.id === 'string' && ctx.db.bookings) {
			try {
				await ctx.db.bookings.upsertByEntityId(data.id, {
					id: data.id,
					product_id:
						typeof data.product_id === 'string' ? data.product_id : undefined,
					start_date:
						typeof data.start_date === 'string' ? data.start_date : undefined,
					end_date:
						typeof data.end_date === 'string' ? data.end_date : undefined,
					status: typeof data.status === 'string' ? data.status : undefined,
				});
			} catch (error) {
				console.warn('Failed to upsert booking from webhook:', error);
			}
		}
		return { success: true, data: request.payload };
	},
};

export const bookingUpdated: BookingmoodWebhooksType['bookingUpdated'] = {
	match: createBookingmoodMatch('booking.updated'),
	handler: async (ctx, request) => {
		const verification = verifyBookingmoodWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}
		const data = request.payload.data;
		if (data.id && typeof data.id === 'string' && ctx.db.bookings) {
			try {
				await ctx.db.bookings.upsertByEntityId(data.id, {
					id: data.id,
					product_id:
						typeof data.product_id === 'string' ? data.product_id : undefined,
					start_date:
						typeof data.start_date === 'string' ? data.start_date : undefined,
					end_date:
						typeof data.end_date === 'string' ? data.end_date : undefined,
					status: typeof data.status === 'string' ? data.status : undefined,
				});
			} catch (error) {
				console.warn('Failed to update booking from webhook:', error);
			}
		}
		return { success: true, data: request.payload };
	},
};

export const bookingDeleted: BookingmoodWebhooksType['bookingDeleted'] = {
	match: createBookingmoodMatch('booking.deleted'),
	handler: async (ctx, request) => {
		const verification = verifyBookingmoodWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}
		const data = request.payload.data;
		if (data.id && typeof data.id === 'string' && ctx.db.bookings) {
			try {
				await ctx.db.bookings.deleteByEntityId(data.id);
			} catch (error) {
				console.warn('Failed to delete booking from webhook:', error);
			}
		}
		return { success: true, data: request.payload };
	},
};

export const productCreated: BookingmoodWebhooksType['productCreated'] = {
	match: createBookingmoodMatch('product.created'),
	handler: async (ctx, request) => {
		const verification = verifyBookingmoodWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}
		const data = request.payload.data;
		if (data.id && typeof data.id === 'string' && ctx.db.products) {
			try {
				await ctx.db.products.upsertByEntityId(data.id, {
					id: data.id,
					name: typeof data.name === 'string' ? data.name : undefined,
				});
			} catch (error) {
				console.warn('Failed to upsert product from webhook:', error);
			}
		}
		return { success: true, data: request.payload };
	},
};

export const productUpdated: BookingmoodWebhooksType['productUpdated'] = {
	match: createBookingmoodMatch('product.updated'),
	handler: async (ctx, request) => {
		const verification = verifyBookingmoodWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}
		const data = request.payload.data;
		if (data.id && typeof data.id === 'string' && ctx.db.products) {
			try {
				await ctx.db.products.upsertByEntityId(data.id, {
					id: data.id,
					name: typeof data.name === 'string' ? data.name : undefined,
				});
			} catch (error) {
				console.warn('Failed to update product from webhook:', error);
			}
		}
		return { success: true, data: request.payload };
	},
};
