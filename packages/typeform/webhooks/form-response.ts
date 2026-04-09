import { logEventFromContext } from 'corsair/core';
import type { TypeformWebhooks } from '..';
import { createTypeformMatch, verifyTypeformWebhookSignature } from './types';

export const formResponse: TypeformWebhooks['formResponse'] = {
	match: createTypeformMatch('form_response'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyTypeformWebhookSignature(request, webhookSecret);

		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.event_type !== 'form_response') {
			return {
				success: true,
				data: undefined,
			};
		}

		const { form_id, token, submitted_at } = event.form_response;

		if (ctx.db.responses) {
			try {
				await ctx.db.responses.upsertByEntityId(token, {
					response_id: token,
					form_id,
					submitted_at,
					landed_at: event.form_response.landed_at,
					answers: event.form_response.answers,
					calculated: event.form_response.calculated,
					metadata: event.form_response.metadata,
					hidden: event.form_response.hidden,
				});
			} catch (error) {
				console.warn('Failed to save form response to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'typeform.webhook.form_response',
			{ form_id, token, submitted_at },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
