import { logEventFromContext } from 'corsair/core';
import type { ZoomWebhooks } from '..';
import { createZoomEventMatch, verifyZoomWebhookSignature } from './types';

export const created: ZoomWebhooks['meetingCreated'] = {
	match: createZoomEventMatch('meeting.created'),

	handler: async (ctx, request) => {
		const signingSecret = ctx.key;
		const verification = verifyZoomWebhookSignature(request, signingSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.event !== 'meeting.created') {
			return { success: true, data: undefined };
		}

		let corsairEntityId = '';

		const meeting = event.payload.object;
		if (ctx.db.meetings && meeting.id) {
			try {
				const entity = await ctx.db.meetings.upsertByEntityId(
					String(meeting.id),
					{
						...meeting,
						id: meeting.id ? Number(meeting.id) : undefined,
					},
				);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save meeting to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'zoom.webhook.meeting.created',
			{ ...event },
			'completed',
		);

		return { success: true, corsairEntityId, data: event };
	},
};

export const cancelled: ZoomWebhooks['meetingCancelled'] = {
	match: createZoomEventMatch('meeting.deleted'),

	handler: async (ctx, request) => {
		const signingSecret = ctx.key;
		const verification = verifyZoomWebhookSignature(request, signingSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.event !== 'meeting.deleted') {
			return { success: true, data: undefined };
		}

		let corsairEntityId = '';

		const meeting = event.payload.object;
		if (ctx.db.meetings && meeting.id) {
			try {
				const existing = await ctx.db.meetings.findByEntityId(
					String(meeting.id),
				);
				if (existing) {
					const entity = await ctx.db.meetings.upsertByEntityId(
						String(meeting.id),
						{
							...existing.data,
							status: 'cancelled',
						},
					);
					corsairEntityId = entity?.id || '';
				}
			} catch (error) {
				console.warn('Failed to update meeting in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'zoom.webhook.meeting.cancelled',
			{ ...event },
			'completed',
		);

		return { success: true, corsairEntityId, data: event };
	},
};

export const started: ZoomWebhooks['meetingStarted'] = {
	match: createZoomEventMatch('meeting.started'),

	handler: async (ctx, request) => {
		const signingSecret = ctx.key;
		const verification = verifyZoomWebhookSignature(request, signingSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.event !== 'meeting.started') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';

		const meeting = event.payload.object;
		if (ctx.db.meetings && meeting.id) {
			try {
				const entity = await ctx.db.meetings.upsertByEntityId(
					String(meeting.id),
					{
						...meeting,
						id: meeting.id ? Number(meeting.id) : undefined,
						status: 'started',
					},
				);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save meeting to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'zoom.webhook.meeting.started',
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

export const ended: ZoomWebhooks['meetingEnded'] = {
	match: createZoomEventMatch('meeting.ended'),

	handler: async (ctx, request) => {
		const signingSecret = ctx.key;
		const verification = verifyZoomWebhookSignature(request, signingSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.event !== 'meeting.ended') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';

		const meeting = event.payload.object;
		if (ctx.db.meetings && meeting.id) {
			try {
				const entity = await ctx.db.meetings.upsertByEntityId(
					String(meeting.id),
					{
						...meeting,
						id: meeting.id ? Number(meeting.id) : undefined,
						status: 'ended',
					},
				);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update meeting in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'zoom.webhook.meeting.ended',
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

export const participantJoined: ZoomWebhooks['meetingParticipantJoined'] = {
	match: createZoomEventMatch('meeting.participant_joined'),

	handler: async (ctx, request) => {
		const signingSecret = ctx.key;
		const verification = verifyZoomWebhookSignature(request, signingSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.event !== 'meeting.participant_joined') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';

		const participant = event.payload.object.participant;
		if (ctx.db.participants && participant && participant.user_id) {
			try {
				const entity = await ctx.db.participants.upsertByEntityId(
					participant.user_id,
					{
						...participant,
					},
				);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save participant to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'zoom.webhook.meeting.participantJoined',
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

export const participantLeft: ZoomWebhooks['meetingParticipantLeft'] = {
	match: createZoomEventMatch('meeting.participant_left'),

	handler: async (ctx, request) => {
		const signingSecret = ctx.key;
		const verification = verifyZoomWebhookSignature(request, signingSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.event !== 'meeting.participant_left') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';

		const participant = event.payload.object.participant;
		if (ctx.db.participants && participant && participant.user_id) {
			try {
				const entity = await ctx.db.participants.upsertByEntityId(
					participant.user_id,
					{
						...participant,
					},
				);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update participant in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'zoom.webhook.meeting.participantLeft',
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
