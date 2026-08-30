import { logEventFromContext } from 'corsair/core';
import type { FilloutFormsWebhooks } from '../index';
import {
	createFilloutFormSubmissionMatch,
	verifyFilloutWebhookSignature,
} from './types';

export const formSubmission: FilloutFormsWebhooks['formSubmission'] = {
	match: createFilloutFormSubmissionMatch(),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyFilloutWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const payload = request.payload;

		if (
			!payload ||
			typeof payload !== 'object' ||
			!('formId' in payload) ||
			!('submissionId' in payload)
		) {
			return {
				success: true,
				data: undefined,
			};
		}

		const event = {
			formId: payload.formId as string,
			submissionId: payload.submissionId as string,
			submissionTime:
				(payload.submissionTime as string) ?? new Date().toISOString(),
			submission: payload.submission ?? payload,
		};

		await logEventFromContext(
			ctx,
			'filloutforms.webhook.formSubmission',
			{ formId: event.formId, submissionId: event.submissionId },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
