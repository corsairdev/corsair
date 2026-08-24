import { logEventFromContext } from 'corsair/core';
import type { UnioneWebhooks } from '..';
import { maybeUpsert } from '../db';
import type { UnioneWebhookEvent, UnioneWebhookPayload } from './types';
import { createUnioneMatch, verifyUnioneWebhookAuth } from './types';

function extractEvents(payload: UnioneWebhookPayload): UnioneWebhookEvent[] {
	return (payload.events_by_user ?? []).flatMap((user) => user.events ?? []);
}

export const emailStatus: UnioneWebhooks['emailStatus'] = {
	match: createUnioneMatch('transactional_email_status'),

	handler: async (ctx, request) => {
		const verification = verifyUnioneWebhookAuth(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Webhook auth failed',
			};
		}

		const payload = request.payload;
		const events = extractEvents(payload).filter(
			(event) => event.event_name === 'transactional_email_status',
		);

		for (const event of events) {
			const jobId = event.event_data?.job_id;
			if (jobId) {
				await maybeUpsert(ctx.db.eventDumps, jobId, {
					dump_id: jobId,
					dump_status: event.event_data?.status,
				});
			}
		}

		await logEventFromContext(
			ctx,
			'unione.webhook.emailStatus',
			{ count: events.length },
			'completed',
		);

		return { success: true, data: payload };
	},
};

export const spamBlock: UnioneWebhooks['spamBlock'] = {
	match: createUnioneMatch('transactional_spam_block'),

	handler: async (ctx, request) => {
		const verification = verifyUnioneWebhookAuth(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Webhook auth failed',
			};
		}

		const payload = request.payload;
		await logEventFromContext(
			ctx,
			'unione.webhook.spamBlock',
			{ user_count: payload.events_by_user?.length ?? 0 },
			'completed',
		);

		return { success: true, data: payload };
	},
};
