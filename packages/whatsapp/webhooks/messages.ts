import { logEventFromContext } from 'corsair/core';
import type { WhatsappWebhooks } from '../index';
import type { WhatsappIncomingMessage } from './types';
import {
	createWhatsappMatch,
	extractWhatsappMessageEvents,
	extractWhatsappStatusEvents,
	verifyWhatsappWebhookSignature,
} from './types';

function extractMessageText(
	message: WhatsappIncomingMessage,
): string | undefined {
	if (message.text?.body) return message.text.body;
	if (message.image?.caption) return message.image.caption;
	if (message.document?.caption) return message.document.caption;
	if (message.video?.caption) return message.video.caption;
	if (message.interactive?.button_reply?.title) {
		return message.interactive.button_reply.title;
	}
	if (message.interactive?.list_reply?.title) {
		return message.interactive.list_reply.title;
	}
	if (message.button?.text) return message.button.text;
	if (message.type === 'audio') return '[Audio]';
	if (message.type === 'image') return '[Image]';
	if (message.type === 'document') return '[Document]';
	if (message.type === 'video') return '[Video]';
	if (message.type === 'sticker') return '[Sticker]';
	if (message.type === 'location') return '[Location]';
	return undefined;
}

export const messages: WhatsappWebhooks['messages'] = {
	match: createWhatsappMatch('messages'),
	handler: async (ctx, request) => {
		const verification = verifyWhatsappWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error,
			};
		}

		const events = extractWhatsappMessageEvents(request.payload);
		let corsairEntityId = '';
		for (const event of events) {
			for (const contact of event.contacts) {
				try {
					await ctx.db.contacts.upsertByEntityId(contact.wa_id, {
						id: contact.wa_id,
						waId: contact.wa_id,
						name: contact.profile?.name,
						createdAt: new Date(),
					});
				} catch (error) {
					console.warn('Failed to save WhatsApp contact to database:', error);
				}
			}
			for (const message of event.messages) {
				try {
					const existing = await ctx.db.messages.findByEntityId(message.id);
					const entity = await ctx.db.messages.upsertByEntityId(message.id, {
						...existing?.data,
						id: message.id,
						from: message.from,
						type: message.type,
						text: extractMessageText(message),
						status: 'received',
						direction: 'inbound',
						timestamp: message.timestamp,
						phoneNumberId: event.phoneNumberId,
						businessAccountId: event.businessAccountId,
						raw: message,
						createdAt: existing?.data.createdAt ?? new Date(),
					});
					corsairEntityId ||= entity.id;
				} catch (error) {
					console.warn(
						'Failed to save incoming WhatsApp message to database:',
						error,
					);
				}
			}
			await logEventFromContext(
				ctx,
				'whatsapp.webhook.messages',
				event,
				'completed',
			);
		}

		return { success: true, corsairEntityId, data: events[0] };
	},
};

export const statuses: WhatsappWebhooks['statuses'] = {
	match: createWhatsappMatch('statuses'),
	handler: async (ctx, request) => {
		const verification = verifyWhatsappWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error,
			};
		}

		const events = extractWhatsappStatusEvents(request.payload);
		let corsairEntityId = '';
		for (const event of events) {
			for (const status of event.statuses) {
				try {
					const existing = await ctx.db.messages.findByEntityId(status.id);
					const entity = await ctx.db.messages.upsertByEntityId(status.id, {
						...existing?.data,
						id: status.id,
						to: status.recipient_id ?? existing?.data.to,
						status: status.status,
						timestamp: status.timestamp,
						phoneNumberId: event.phoneNumberId,
						businessAccountId: event.businessAccountId,
						errors: status.errors,
						conversation: status.conversation,
						pricing: status.pricing,
						rawStatus: status,
						createdAt: existing?.data.createdAt ?? new Date(),
					});
					corsairEntityId ||= entity.id;
				} catch (error) {
					console.warn('Failed to reconcile WhatsApp message status:', error);
				}
			}
			await logEventFromContext(
				ctx,
				'whatsapp.webhook.statuses',
				event,
				'completed',
			);
		}

		return { success: true, corsairEntityId, data: events[0] };
	},
};
