import { logEventFromContext } from 'corsair/core';
import type { CalendlyWebhooks } from '..';
import {
	createCalendlyEventMatch,
	verifyCalendlyWebhookSignature,
} from './types';

export const inviteeCreated: CalendlyWebhooks['inviteeCreated'] = {
	match: createCalendlyEventMatch('invitee.created'),

	handler: async (ctx, request) => {
		const signingKey = ctx.key;
		const verification = verifyCalendlyWebhookSignature(request, signingKey);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const payload = request.payload;

		if (payload.event !== 'invitee.created') {
			return { success: true, data: undefined };
		}

		const invitee = payload.payload;

		if (ctx.db.invitees) {
			try {
				const uriParts = invitee.uri.split('/');
				// URI always has at least one segment; last segment is the UUID
				const id = uriParts[uriParts.length - 1]!;
				await ctx.db.invitees.upsertByEntityId(id, {
					id,
					...invitee,
					created_at: invitee.created_at ? new Date(invitee.created_at) : null,
					updated_at: invitee.updated_at ? new Date(invitee.updated_at) : null,
				});
			} catch (error) {
				console.warn('Failed to save invitee from webhook to database:', error);
			}
		}

		const event = payload.payload.scheduled_event;

		if (ctx.db.scheduledEvents && event?.uri) {
			try {
				const uriParts = event.uri.split('/');
				// URI always has at least one segment; last segment is the UUID
				const id = uriParts[uriParts.length - 1]!;
				await ctx.db.scheduledEvents.upsertByEntityId(id, {
					id,
					...event,
					location: event.location,
					created_at: event.created_at ? new Date(event.created_at) : null,
					updated_at: event.updated_at ? new Date(event.updated_at) : null,
				});
			} catch (error) {
				console.warn(
					'Failed to save scheduled event from webhook to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'calendly.webhook.inviteeCreated',
			{ invitee_uri: invitee.uri },
			'completed',
		);

		return { success: true, data: payload };
	},
};
