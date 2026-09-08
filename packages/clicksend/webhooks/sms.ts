import { logEventFromContext } from 'corsair/core';
import type { ClickSendWebhooks } from '../index';
import {
	createClickSendInboundMatcher,
	createClickSendReceiptMatcher,
	verifyClickSendWebhookSignature,
} from './types';

export const inbound: ClickSendWebhooks['inboundSms'] = {
	match: createClickSendInboundMatcher(),
	handler: async (ctx, request) => {
		const verification = verifyClickSendWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Webhook verification failed',
			};
		}

		const payload = request.payload;

		if (ctx.db.messages && payload.message_id) {
			try {
				await ctx.db.messages.upsertByEntityId(payload.message_id, {
					id: payload.message_id,
					message_id: payload.message_id,
					to: payload.to,
					from: payload.from,
					body: payload.body,
					status: 'received',
					direction: 'in',
					date_sent: payload.timestamp
						? new Date(
								typeof payload.timestamp === 'number'
									? payload.timestamp * 1000
									: payload.timestamp,
							).toISOString()
						: new Date().toISOString(),
				});
			} catch (error) {
				console.warn('Failed to save inbound webhook SMS to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'clicksend.webhook.sms.inbound',
			{ message_id: payload.message_id },
			'completed',
		);

		return {
			success: true,
			data: payload,
		};
	},
};

export const deliveryReceipt: ClickSendWebhooks['deliveryReceipt'] = {
	match: createClickSendReceiptMatcher(),
	handler: async (ctx, request) => {
		const verification = verifyClickSendWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Webhook verification failed',
			};
		}

		const payload = request.payload;

		if (ctx.db.messages && payload.message_id) {
			try {
				const existing = await ctx.db.messages.findByEntityId(
					payload.message_id,
				);
				await ctx.db.messages.upsertByEntityId(payload.message_id, {
					id: payload.message_id,
					message_id: payload.message_id,
					to: existing?.data.to ?? '',
					from: existing?.data.from,
					body: existing?.data.body,
					status: payload.status,
					direction: existing?.data.direction ?? 'out',
					date_sent: existing?.data.date_sent,
					price: existing?.data.price,
					currency: existing?.data.currency,
				});
			} catch (error) {
				console.warn('Failed to update delivery receipt in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'clicksend.webhook.sms.deliveryReceipt',
			{ message_id: payload.message_id, status: payload.status },
			'completed',
		);

		return {
			success: true,
			data: payload,
		};
	},
};
