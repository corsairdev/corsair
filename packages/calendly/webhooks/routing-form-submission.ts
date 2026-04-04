import { logEventFromContext } from 'corsair/core';
import type { CalendlyWebhooks } from '..';
import {
	createCalendlyEventMatch,
	verifyCalendlyWebhookSignature,
} from './types';

export const routingFormSubmission: CalendlyWebhooks['routingFormSubmission'] =
	{
		match: createCalendlyEventMatch('routing_form_submission.created'),

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

			if (payload.event !== 'routing_form_submission.created') {
				return { success: true, data: undefined };
			}

			await logEventFromContext(
				ctx,
				'calendly.webhook.routingFormSubmission',
				{ routing_form: payload.payload.routing_form },
				'completed',
			);

			return { success: true, data: payload };
		},
	};
