import { logEventFromContext } from '../../utils/events';
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
					uri: invitee.uri,
					email: invitee.email,
					name: invitee.name,
					status: invitee.status,
					event: invitee.event,
					timezone: invitee.timezone,
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
					uri: event.uri,
					name: event.name,
					status: event.status,
					start_time: event.start_time,
					end_time: event.end_time,
					event_type: event.event_type,
					location: event.location as { type: string; location?: string; join_url?: string } | undefined,
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
