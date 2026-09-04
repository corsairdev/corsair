import type { CorsairWebhook } from 'corsair/core';
import type { WorkdayContext } from '../index';
import type { WorkdayTriggerEventName, WorkdayWebhookOutputs } from './types';
import {
	createWorkdayEventMatch,
	verifyWorkdayWebhookSignature,
} from './types';

function createTriggerWebhook<K extends WorkdayTriggerEventName>(
	eventType: K,
): CorsairWebhook<WorkdayContext, WorkdayWebhookOutputs[K]> {
	return {
		match: createWorkdayEventMatch(eventType),
		handler: async (ctx, request) => {
			const secret =
				ctx.options?.webhookSecret ||
				// Justification: keyBuilder may place the webhook secret on ctx.key for webhook source.
				(typeof (ctx as { key?: string }).key === 'string'
					? (ctx as { key: string }).key
					: '');
			const v = verifyWorkdayWebhookSignature(
				// Justification: matcher already constrained the payload type; cast for shared verifier.
				request as Parameters<typeof verifyWorkdayWebhookSignature>[0],
				secret,
			);
			if (!v.valid) {
				return {
					success: false,
					statusCode: 401,
					error: v.error || 'Signature verification failed',
				};
			}
			return { success: true };
		},
	};
}

/**
 * Workday webhook triggers (13).
 * Workday does not push these natively — deliver via a poller/Event Notification
 * bridge that POSTs `{ type, data }` with `x-workday-signature`.
 */
export const workdayWebhooksNested = {
	'absenceBalance.changed': createTriggerWebhook('absenceBalance.changed'),
	'balanceDetails.changed': createTriggerWebhook('balanceDetails.changed'),
	'interviewFeedback.submitted': createTriggerWebhook(
		'interviewFeedback.submitted',
	),
	'jobPosting.changed': createTriggerWebhook('jobPosting.changed'),
	'jobPostingQuestionnaire.changed': createTriggerWebhook(
		'jobPostingQuestionnaire.changed',
	),
	'absenceBalance.created': createTriggerWebhook('absenceBalance.created'),
	'interview.scheduled': createTriggerWebhook('interview.scheduled'),
	'jobPosting.created': createTriggerWebhook('jobPosting.created'),
	'prospectResumeAttachment.added': createTriggerWebhook(
		'prospectResumeAttachment.added',
	),
	'prospectProfile.changed': createTriggerWebhook('prospectProfile.changed'),
	'workerEligibleAbsenceType.changed': createTriggerWebhook(
		'workerEligibleAbsenceType.changed',
	),
	'workerLeaveOfAbsence.changed': createTriggerWebhook(
		'workerLeaveOfAbsence.changed',
	),
	'workerLeaveOfAbsence.created': createTriggerWebhook(
		'workerLeaveOfAbsence.created',
	),
} as const;
