import { logEventFromContext } from 'corsair/core';
import type { TallyWebhooks } from '..';
import { safeDbUpsert, toSubmissionRecord } from '../utils';
import { createTallyMatch, verifyTallyWebhookSignature } from './types';

export const formResponse: TallyWebhooks['formResponse'] = {
	match: createTallyMatch('FORM_RESPONSE'),

	handler: async (ctx, request) => {
		const verification = verifyTallyWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		await safeDbUpsert(
			ctx.db.submissions,
			event.data.submissionId,
			toSubmissionRecord({
				id: event.data.submissionId,
				formId: event.data.formId,
				respondentId: event.data.respondentId,
				createdAt: event.data.createdAt,
				fields: event.data.fields,
			}),
			'submission (webhook)',
		);

		await logEventFromContext(
			ctx,
			'tally.webhook.formResponse',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId: event.data.submissionId,
			data: event,
		};
	},
};
