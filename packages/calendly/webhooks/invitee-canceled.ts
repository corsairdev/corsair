import { logEventFromContext } from 'corsair/core';
import type { CalendlyWebhooks } from '..';
import {
	createCalendlyEventMatch,
	verifyCalendlyWebhookSignature,
} from './types';

export const inviteeCanceled: CalendlyWebhooks['inviteeCanceled'] = {
	match: createCalendlyEventMatch('invitee.canceled'),

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

		if (payload.event !== 'invitee.canceled') {
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
					status: 'canceled',
					created_at: invitee.created_at ? new Date(invitee.created_at) : null,
					updated_at: invitee.updated_at ? new Date(invitee.updated_at) : null,
				});
			} catch (error) {
				console.warn('Failed to update canceled invitee in database:', error);
			}
		}

		const event = payload.payload.scheduled_event;

		if (ctx.db.scheduledEvents && event?.uri) {
			try {
				const uriParts = event.uri.split('/');
				// URI always has at least one segment; last segment is the UUID
				const id = uriParts[uriParts.length - 1]!;
				const existing = await ctx.db.scheduledEvents.findByEntityId(id);
				await ctx.db.scheduledEvents.upsertByEntityId(id, {
					...(existing?.data ?? {}),
					id,
					uri: event.uri,
					status: event.status,
					updated_at: event.updated_at ? new Date(event.updated_at) : null,
				});
			} catch (error) {
				console.warn(
					'Failed to update scheduled event status in database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'calendly.webhook.inviteeCanceled',
			{ invitee_uri: invitee.uri },
			'completed',
		);

		return { success: true, data: payload };
	},
};
