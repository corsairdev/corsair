import { logEventFromContext } from 'corsair/core';
import type { WhatsAppWebhooks } from '..';
import { createWhatsAppMatch, verifyWhatsAppWebhookSignature } from './types';

export const message: WhatsAppWebhooks['message'] = {
	match: createWhatsAppMatch('message'),

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
		const persistedMessages: Array<Record<string, unknown>> = [];

		for (const entry of payload.entry) {
			for (const change of entry.changes) {
				if (change.field !== 'messages' || !change.value.messages?.length) {
					continue;
				}

				for (const incomingMessage of change.value.messages) {
					const normalizedMessage = {
						...incomingMessage,
						id: incomingMessage.id,
						messaging_product: change.value.messaging_product,
						from: incomingMessage.from,
						wa_id: incomingMessage.from,
						phone_number_id: change.value.metadata?.phone_number_id,
						display_phone_number: change.value.metadata?.display_phone_number,
						contacts: change.value.contacts,
						profile: change.value.contacts?.[0]?.profile,
						direction: 'inbound' as const,
						authorId: incomingMessage.from,
						createdAt: incomingMessage.timestamp
							? new Date(Number(incomingMessage.timestamp) * 1000)
							: new Date(),
						// raw preserves the original inbound message payload because interactive and media message variants differ across WhatsApp webhook events.
						raw: incomingMessage,
					};

					persistedMessages.push(normalizedMessage);

					if (ctx.db.messages) {
						try {
							const entity = await ctx.db.messages.upsertByEntityId(
								incomingMessage.id,
								normalizedMessage,
							);
							corsairEntityId = entity?.id || corsairEntityId;
						} catch (error) {
							console.warn('Failed to save WhatsApp webhook message:', error);
						}
					}
				}
			}
		}

		await logEventFromContext(
			ctx,
			'whatsapp.webhook.message',
			{ object: payload.object, messages: persistedMessages },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: payload,
		};
	},
};
