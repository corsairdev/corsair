import { logEventFromContext } from 'corsair/core';
import type { FacebookWebhooks } from '..';
import type { FacebookWebhookPayload } from './types';
import { verifyFacebookWebhookSignature } from './types';

export const delivery: FacebookWebhooks['delivery'] = {
	match: (request) => {
		const body = request.body as {
			object?: string;
			entry?: Array<{
				messaging?: Array<{ delivery?: unknown; read?: unknown }>;
				standby?: Array<{ delivery?: unknown; read?: unknown }>;
			}>;
		};

		if (body.object !== 'page' || !Array.isArray(body.entry)) {
			return false;
		}

		return body.entry.some((entry) => {
			const events = Array.isArray(entry.messaging)
				? entry.messaging
				: Array.isArray(entry.standby)
					? entry.standby
					: [];
			return events.some((event) => Boolean(event.delivery) || Boolean(event.read));
		});
	},

	handler: async (ctx, request) => {
		const messengerRequest = request as typeof request & {
			payload: FacebookWebhookPayload;
		};
		const verification = verifyFacebookWebhookSignature(messengerRequest, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Signature verification failed',
			};
		}

		const payload = messengerRequest.payload;
		let corsairEntityId = '';
		const updates: Array<Record<string, unknown>> = [];

		for (const entry of payload.entry) {
			const events = Array.isArray(entry.messaging)
				? entry.messaging
				: Array.isArray(entry.standby)
					? entry.standby
					: [];

			for (const event of events) {
				if (!event.delivery && !event.read) {
					continue;
				}

				const mids = event.delivery?.mids ?? [];
				const watermark = event.delivery?.watermark ?? event.read?.watermark;
				const status = event.read ? 'read' : 'delivered';

				updates.push({
					pageId: entry.id,
					mids,
					status,
					watermark,
				});

				if (ctx.db.messages && mids.length > 0) {
					for (const mid of mids) {
						try {
							const entity = await ctx.db.messages.upsertByEntityId(mid, {
								id: mid,
								mid,
								page_id: entry.id,
								delivery: event.delivery,
								read: event.read,
								status,
								direction: 'outbound',
								timestamp: watermark,
								createdAt: watermark ? new Date(watermark) : new Date(),
								raw: event,
							});
							corsairEntityId = entity?.id || corsairEntityId;
						} catch (error) {
							console.warn('Failed to save Facebook delivery event:', error);
						}
					}
				}
			}
		}

		await logEventFromContext(
			ctx,
			'facebook.webhook.delivery',
			{ object: payload.object, updates },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: payload,
		};
	},
};
