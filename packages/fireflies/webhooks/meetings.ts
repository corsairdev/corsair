import { logEventFromContext } from 'corsair/core';
import type { FirefliesWebhooks } from '..';
import { createFirefliesMatch, verifyFirefliesWebhookSignature } from './types';

export const newMeeting: FirefliesWebhooks['newMeeting'] = {
	match: createFirefliesMatch('NewMeeting'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyFirefliesWebhookSignature(
			request,
			webhookSecret,
		);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.eventType !== 'NewMeeting') {
			return {
				success: true,
				data: undefined,
			};
		}

		await logEventFromContext(
			ctx,
			'fireflies.webhook.newMeeting',
			{ meetingId: event.meetingId, eventType: event.eventType },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const inMeeting: FirefliesWebhooks['inMeeting'] = {
	match: createFirefliesMatch('InMeeting'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyFirefliesWebhookSignature(
			request,
			webhookSecret,
		);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.eventType !== 'InMeeting') {
			return {
				success: true,
				data: undefined,
			};
		}

		await logEventFromContext(
			ctx,
			'fireflies.webhook.inMeeting',
			{ meetingId: event.meetingId, eventType: event.eventType },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const meetingDeleted: FirefliesWebhooks['meetingDeleted'] = {
	match: createFirefliesMatch('MeetingDeleted'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyFirefliesWebhookSignature(
			request,
			webhookSecret,
		);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.eventType !== 'MeetingDeleted') {
			return {
				success: true,
				data: undefined,
			};
		}

		if (ctx.db.transcripts && event.meetingId) {
			try {
				await ctx.db.transcripts.deleteByEntityId(event.meetingId);
			} catch (error) {
				console.warn('Failed to delete transcript from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'fireflies.webhook.meetingDeleted',
			{ meetingId: event.meetingId, eventType: event.eventType },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
