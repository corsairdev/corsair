import { logEventFromContext } from 'corsair/core';
import type { CalWebhooks } from '../index';
import { createCalMatch, verifyCalWebhookSignature } from './types';

export const bookingCreated: CalWebhooks['bookingCreated'] = {
	match: createCalMatch('BOOKING_CREATED'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyCalWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.triggerEvent !== 'BOOKING_CREATED') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';

		if (ctx.db.bookings && event.payload?.uid) {
			try {
				const entity = await ctx.db.bookings.upsertByEntityId(
					event.payload.uid,
					{
						...event.payload,
						createdAt: event.createdAt,
						updatedAt: event.createdAt,
					},
				);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save booking to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'cal.webhook.bookingCreated',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};

export const bookingCancelled: CalWebhooks['bookingCancelled'] = {
	match: createCalMatch('BOOKING_CANCELLED'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyCalWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.triggerEvent !== 'BOOKING_CANCELLED') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';

		if (ctx.db.bookings && event.payload?.uid) {
			try {
				const entity = await ctx.db.bookings.upsertByEntityId(
					event.payload.uid,
					{
						...event.payload,
						createdAt: event.createdAt,
						updatedAt: event.createdAt,
					},
				);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save booking to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'cal.webhook.bookingCancelled',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};

export const bookingRescheduled: CalWebhooks['bookingRescheduled'] = {
	match: createCalMatch('BOOKING_RESCHEDULED'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyCalWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.triggerEvent !== 'BOOKING_RESCHEDULED') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';

		if (ctx.db.bookings && event.payload?.uid) {
			try {
				const entity = await ctx.db.bookings.upsertByEntityId(
					event.payload.uid,
					{
						...event.payload,
						createdAt: event.createdAt,
						updatedAt: event.createdAt,
					},
				);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save booking to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'cal.webhook.bookingRescheduled',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};

export const meetingEnded: CalWebhooks['meetingEnded'] = {
	match: createCalMatch('MEETING_ENDED'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyCalWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.triggerEvent !== 'MEETING_ENDED') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';

		if (ctx.db.bookings && event.payload?.uid) {
			try {
				const entity = await ctx.db.bookings.upsertByEntityId(
					event.payload.uid,
					{
						...event.payload,
						createdAt: event.createdAt,
						updatedAt: event.createdAt,
					},
				);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save booking to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'cal.webhook.meetingEnded',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};
