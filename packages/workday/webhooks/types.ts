import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';

export const WorkdayWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string().optional(),
	data: z.record(z.string(), z.unknown()),
});
export type WorkdayWebhookPayload = z.infer<typeof WorkdayWebhookPayloadSchema>;

const SnapshotEventBase = z.object({
	created_at: z.string().optional(),
	data: z.record(z.string(), z.unknown()),
});

export const WorkdayTriggerEventSchemas = {
	'absenceBalance.changed': SnapshotEventBase.extend({
		type: z.literal('absenceBalance.changed'),
	}),
	'balanceDetails.changed': SnapshotEventBase.extend({
		type: z.literal('balanceDetails.changed'),
	}),
	'interviewFeedback.submitted': SnapshotEventBase.extend({
		type: z.literal('interviewFeedback.submitted'),
	}),
	'jobPosting.changed': SnapshotEventBase.extend({
		type: z.literal('jobPosting.changed'),
	}),
	'jobPostingQuestionnaire.changed': SnapshotEventBase.extend({
		type: z.literal('jobPostingQuestionnaire.changed'),
	}),
	'absenceBalance.created': SnapshotEventBase.extend({
		type: z.literal('absenceBalance.created'),
	}),
	'interview.scheduled': SnapshotEventBase.extend({
		type: z.literal('interview.scheduled'),
	}),
	'jobPosting.created': SnapshotEventBase.extend({
		type: z.literal('jobPosting.created'),
	}),
	'prospectResumeAttachment.added': SnapshotEventBase.extend({
		type: z.literal('prospectResumeAttachment.added'),
	}),
	'prospectProfile.changed': SnapshotEventBase.extend({
		type: z.literal('prospectProfile.changed'),
	}),
	'workerEligibleAbsenceType.changed': SnapshotEventBase.extend({
		type: z.literal('workerEligibleAbsenceType.changed'),
	}),
	'workerLeaveOfAbsence.changed': SnapshotEventBase.extend({
		type: z.literal('workerLeaveOfAbsence.changed'),
	}),
	'workerLeaveOfAbsence.created': SnapshotEventBase.extend({
		type: z.literal('workerLeaveOfAbsence.created'),
	}),
} as const;

export type WorkdayTriggerEventName = keyof typeof WorkdayTriggerEventSchemas;

export type WorkdayWebhookOutputs = {
	[K in WorkdayTriggerEventName]: z.infer<
		(typeof WorkdayTriggerEventSchemas)[K]
	>;
};

function parseBody(body: unknown): unknown {
	if (typeof body !== 'string') return body;
	try {
		return JSON.parse(body);
	} catch {
		return null;
	}
}

function headerValue(
	headers: Record<string, string | string[] | undefined>,
	name: string,
): string | undefined {
	const lower = name.toLowerCase();
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() !== lower) continue;
		if (Array.isArray(value)) return value[0];
		return value;
	}
	return undefined;
}

export function createWorkdayEventMatch(
	eventType: WorkdayTriggerEventName | string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const headerType = headerValue(request.headers, 'x-workday-event');
		if (headerType === eventType) {
			return true;
		}
		const parsed = parseBody(request.body);
		if (!parsed || typeof parsed !== 'object') return false;
		const record = parsed as Record<string, unknown>;
		return typeof record.type === 'string' && record.type === eventType;
	};
}

export function verifyWorkdayWebhookSignature(
	request: WebhookRequest<WorkdayWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) return { valid: false, error: 'No webhook secret configured' };

	const signature = headerValue(request.headers, 'x-workday-signature');
	if (!signature) {
		return { valid: false, error: 'Missing x-workday-signature header' };
	}

	if (typeof request.rawBody !== 'string') {
		return {
			valid: false,
			error: 'Raw request body is required for signature verification',
		};
	}

	const isValid = verifyHmacSignature(request.rawBody, secret, signature);
	if (!isValid) {
		return { valid: false, error: 'Invalid webhook signature' };
	}

	return { valid: true };
}
