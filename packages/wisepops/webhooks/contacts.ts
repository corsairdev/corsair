import { logEventFromContext } from 'corsair/core';
import type { WisepopsContext, WisepopsWebhooks } from '../index';
import {
	createWisepopsMatch,
	detectWisepopsEventType,
	verifyWisepopsWebhookSignature,
	WisepopsWebhookPayloadSchema,
} from './types';

function createContactWebhook(
	eventType: 'collected' | 'email' | 'phone' | 'survey',
): WisepopsWebhooks[typeof eventType] {
	return {
		match: createWisepopsMatch(eventType),

		handler: async (ctx: WisepopsContext, request) => {
			if (request.hubVerified !== true) {
				const verification = verifyWisepopsWebhookSignature(request, ctx.key);
				if (!verification.valid) {
					return {
						success: false,
						statusCode: 401,
						error: verification.error || 'Signature verification failed',
					};
				}
			}

			let rawPayload = request.payload;
			if (typeof rawPayload === 'string') {
				try {
					rawPayload = JSON.parse(rawPayload);
				} catch {
					return {
						success: false,
						statusCode: 400,
						error: 'Payload is malformed JSON',
					};
				}
			}

			const parseResult = WisepopsWebhookPayloadSchema.safeParse(rawPayload);
			if (!parseResult.success) {
				return {
					success: false,
					statusCode: 400,
					error: `Payload validation failed: ${parseResult.error.message}`,
				};
			}

			const contacts = parseResult.data;

			if (eventType !== 'collected') {
				const detected = detectWisepopsEventType(request);
				if (detected !== eventType && detected !== 'collected') {
					return {
						success: true,
						data: undefined,
					};
				}
			}

			await logEventFromContext(
				ctx,
				`wisepops.webhook.contacts.${eventType}`,
				{
					count: contacts.length,
					wisepop_ids: contacts.map((c) => c.wisepop_id),
				},
				'completed',
			);

			const first = contacts[0];
			const corsairEntityId = first ? String(first.wisepop_id) : undefined;

			return {
				success: true,
				corsairEntityId,
				data: contacts,
			};
		},
	};
}

export const collected = createContactWebhook('collected');
export const email = createContactWebhook('email');
export const phone = createContactWebhook('phone');
export const survey = createContactWebhook('survey');
