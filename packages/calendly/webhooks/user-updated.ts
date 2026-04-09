import { logEventFromContext } from 'corsair/core';
import type { CalendlyWebhooks } from '..';
import {
	createCalendlyEventMatch,
	verifyCalendlyWebhookSignature,
} from './types';

export const userUpdated: CalendlyWebhooks['userUpdated'] = {
	match: createCalendlyEventMatch('user.updated'),

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

		if (payload.event !== 'user.updated') {
			return { success: true, data: undefined };
		}

		const user = payload.payload;

		if (ctx.db.users && user.uri) {
			try {
				const uriParts = user.uri.split('/');
				// URI always has at least one segment; last segment is the UUID
				const id = uriParts[uriParts.length - 1]!;
				const existing = await ctx.db.users.findByEntityId(id);
				if (existing) {
					await ctx.db.users.upsertByEntityId(id, {
						...existing.data,
						name: user.name ?? existing.data.name,
						email: user.email ?? existing.data.email,
						slug: user.slug ?? existing.data.slug,
						timezone: user.timezone ?? existing.data.timezone,
						scheduling_url: user.scheduling_url ?? existing.data.scheduling_url,
						updated_at: user.updated_at ? new Date(user.updated_at) : null,
					});
				}
			} catch (error) {
				console.warn('Failed to update user in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'calendly.webhook.userUpdated',
			{ user_uri: user.uri },
			'completed',
		);

		return { success: true, data: payload };
	},
};
