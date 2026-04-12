import { logEventFromContext } from 'corsair/core';
import type { WhatsAppWebhooks } from '..';
import { createWhatsAppMatch, verifyWhatsAppWebhookSignature } from './types';

export const status: WhatsAppWebhooks['status'] = {
	match: createWhatsAppMatch('status'),

	handler: async (ctx, request) => {
		const verification = verifyWhatsAppWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const payload = request.payload;
		let corsairEntityId = '';
		const persistedStatuses: Array<Record<string, unknown>> = [];

		for (const entry of payload.entry) {
			for (const change of entry.changes) {
				if (change.field !== 'messages' || !change.value.statuses?.length) {
					continue;
				}

				for (const statusEvent of change.value.statuses) {
					const normalizedStatus = {
						...statusEvent,
						id: statusEvent.id,
						messaging_product: change.value.messaging_product,
						recipient_id: statusEvent.recipient_id,
						wa_id: statusEvent.recipient_id,
						phone_number_id: change.value.metadata?.phone_number_id,
						display_phone_number: change.value.metadata?.display_phone_number,
						direction: 'outbound' as const,
						status: statusEvent.status,
						conversation: statusEvent.conversation,
						pricing: statusEvent.pricing,
						createdAt: statusEvent.timestamp
							? new Date(Number(statusEvent.timestamp) * 1000)
							: new Date(),
						raw: statusEvent,
					};

					persistedStatuses.push(normalizedStatus);

					if (ctx.db.messages) {
						try {
							const existing = await ctx.db.messages.findByEntityId(statusEvent.id);
							const entity = await ctx.db.messages.upsertByEntityId(statusEvent.id, {
								...(existing?.data ?? {}),
								...normalizedStatus,
							});
							corsairEntityId = entity?.id || corsairEntityId;
						} catch (error) {
							console.warn('Failed to save WhatsApp status update:', error);
						}
					}

					if (statusEvent.conversation?.id && ctx.db.conversations) {
						try {
							await ctx.db.conversations.upsertByEntityId(statusEvent.conversation.id, {
								id: statusEvent.conversation.id,
								expiration_timestamp: statusEvent.conversation.expiration_timestamp,
								origin: statusEvent.conversation.origin,
								category: statusEvent.pricing?.category,
								createdAt: statusEvent.timestamp
									? new Date(Number(statusEvent.timestamp) * 1000)
									: new Date(),
							});
						} catch (error) {
							console.warn('Failed to save WhatsApp conversation:', error);
						}
					}
				}
			}
		}

		await logEventFromContext(
			ctx,
			'whatsapp.webhook.status',
			{ object: payload.object, statuses: persistedStatuses },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: payload,
		};
	},
};
