import { logEventFromContext } from 'corsair/core';
import type { CalendlyWebhooks } from '..';
import {
	createCalendlyEventMatch,
	verifyCalendlyWebhookSignature,
} from './types';

export const inviteeNoShow: CalendlyWebhooks['inviteeNoShow'] = {
	match: createCalendlyEventMatch('invitee_no_show.created'),

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

		if (payload.event !== 'invitee_no_show.created') {
			return { success: true, data: undefined };
		}

		const noShow = payload.payload;

		// Mark the invitee's no_show field in the database if we have their record
		if (ctx.db.invitees && noShow.invitee) {
			try {
				const inviteeUriParts = noShow.invitee.split('/');
				const inviteeId = inviteeUriParts[inviteeUriParts.length - 1];
				if (!inviteeId) {
					await logEventFromContext(
						ctx,
						'calendly.webhook.inviteeNoShow',
						{ no_show_uri: noShow.uri, error: 'Invalid invitee URI' },
						'failed',
					);
					return {
						success: false,
						statusCode: 400,
						error: 'Invalid invitee URI',
					};
				}
				const existing = await ctx.db.invitees.findByEntityId(inviteeId);
				if (existing) {
					await ctx.db.invitees.upsertByEntityId(inviteeId, {
						...existing.data,
						updated_at: noShow.updated_at ? new Date(noShow.updated_at) : null,
					});
				}
			} catch (error) {
				console.warn('Failed to update invitee no-show in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'calendly.webhook.inviteeNoShow',
			{ no_show_uri: noShow.uri },
			'completed',
		);

		return { success: true, data: payload };
	},
};
