import crypto from 'crypto';
import { z } from 'zod';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from '../../../core';

// ── Shared sub-schemas ───────────────────────────────────────────────────────

export const SentryActorSchema = z.object({
	type: z.string(),
	id: z.number().optional(),
	name: z.string().optional(),
});
export type SentryActor = z.infer<typeof SentryActorSchema>;

export const SentryInstallationSchema = z.object({
	uuid: z.string(),
});

// ── Issue Webhook Schemas ────────────────────────────────────────────────────

export const IssueCreatedEventSchema = z.object({
	action: z.literal('created'),
	data: z.object({
		issue: z
			.object({
				id: z.string(),
				shortId: z.string(),
				title: z.string(),
				culprit: z.string().nullable().optional(),
				level: z.string().nullable().optional(),
				status: z.string(),
				platform: z.string().nullable().optional(),
				type: z.string().nullable().optional(),
				permalink: z.string().nullable().optional(),
				firstSeen: z.string().nullable().optional(),
				lastSeen: z.string().nullable().optional(),
			})
			.catchall(z.unknown()),
	}),
	actor: SentryActorSchema,
	installation: SentryInstallationSchema.optional(),
});
export type IssueCreatedEvent = z.infer<typeof IssueCreatedEventSchema>;

export const IssueResolvedEventSchema = z.object({
	action: z.literal('resolved'),
	data: z.object({
		issue: z
			.object({
				id: z.string(),
				shortId: z.string(),
				title: z.string(),
				culprit: z.string().nullable().optional(),
				level: z.string().nullable().optional(),
				status: z.string(),
				platform: z.string().nullable().optional(),
				type: z.string().nullable().optional(),
				permalink: z.string().nullable().optional(),
				firstSeen: z.string().nullable().optional(),
				lastSeen: z.string().nullable().optional(),
			})
			.catchall(z.unknown()),
		resolution_type: z.string().optional(),
	}),
	actor: SentryActorSchema,
	installation: SentryInstallationSchema.optional(),
});
export type IssueResolvedEvent = z.infer<typeof IssueResolvedEventSchema>;

export const IssueAssignedEventSchema = z.object({
	action: z.literal('assigned'),
	data: z.object({
		issue: z
			.object({
				id: z.string(),
				shortId: z.string(),
				title: z.string(),
				culprit: z.string().nullable().optional(),
				level: z.string().nullable().optional(),
				status: z.string(),
				platform: z.string().nullable().optional(),
				type: z.string().nullable().optional(),
				permalink: z.string().nullable().optional(),
				firstSeen: z.string().nullable().optional(),
				lastSeen: z.string().nullable().optional(),
				assignedTo: z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						type: z.string().optional(),
					})
					.nullable()
					.optional(),
			})
			.catchall(z.unknown()),
	}),
	actor: SentryActorSchema,
	installation: SentryInstallationSchema.optional(),
});
export type IssueAssignedEvent = z.infer<typeof IssueAssignedEventSchema>;

// ── Alert Webhook Schemas ────────────────────────────────────────────────────

export const EventAlertEventSchema = z.object({
	action: z.literal('triggered'),
	data: z.object({
		event: z
			.object({
				event_id: z.string().optional(),
				title: z.string().optional(),
				message: z.string().optional(),
				platform: z.string().nullable().optional(),
				level: z.string().nullable().optional(),
				url: z.string().optional(),
			})
			.catchall(z.unknown()),
		triggered_rule: z.string().optional(),
	}),
	actor: SentryActorSchema.optional(),
	installation: SentryInstallationSchema.optional(),
});
export type EventAlertEvent = z.infer<typeof EventAlertEventSchema>;

export const MetricAlertEventSchema = z.object({
	action: z.literal('triggered'),
	data: z.object({
		metric_alert: z
			.object({
				id: z.string().optional(),
				title: z.string().optional(),
				alert_rule: z
					.object({
						id: z.number().optional(),
						name: z.string().optional(),
					})
					.optional(),
				status: z.string().optional(),
				date_triggered: z.string().optional(),
			})
			.catchall(z.unknown()),
		description_title: z.string().optional(),
		description_text: z.string().optional(),
	}),
	actor: SentryActorSchema.optional(),
	installation: SentryInstallationSchema.optional(),
});
export type MetricAlertEvent = z.infer<typeof MetricAlertEventSchema>;

// ── Comment Webhook Schemas ──────────────────────────────────────────────────

const SentryCommentDataSchema = z.object({
	comment_id: z.string().optional(),
	issue_id: z.string().optional(),
	project_slug: z.string().optional(),
	comment: z.string().optional(),
	timestamp: z.string().optional(),
});

export const CommentCreatedEventSchema = z.object({
	action: z.literal('created'),
	data: SentryCommentDataSchema.catchall(z.unknown()),
	actor: SentryActorSchema,
	installation: SentryInstallationSchema.optional(),
});
export type CommentCreatedEvent = z.infer<typeof CommentCreatedEventSchema>;

export const CommentUpdatedEventSchema = z.object({
	action: z.literal('updated'),
	data: SentryCommentDataSchema.catchall(z.unknown()),
	actor: SentryActorSchema,
	installation: SentryInstallationSchema.optional(),
});
export type CommentUpdatedEvent = z.infer<typeof CommentUpdatedEventSchema>;

export const CommentDeletedEventSchema = z.object({
	action: z.literal('deleted'),
	data: SentryCommentDataSchema.catchall(z.unknown()),
	actor: SentryActorSchema,
	installation: SentryInstallationSchema.optional(),
});
export type CommentDeletedEvent = z.infer<typeof CommentDeletedEventSchema>;

// ── Union and map types ──────────────────────────────────────────────────────

export const SentryWebhookEventSchema = z.union([
	IssueCreatedEventSchema,
	IssueResolvedEventSchema,
	IssueAssignedEventSchema,
	EventAlertEventSchema,
	MetricAlertEventSchema,
	CommentCreatedEventSchema,
	CommentUpdatedEventSchema,
	CommentDeletedEventSchema,
]);
export type SentryWebhookEvent = z.infer<typeof SentryWebhookEventSchema>;

export type SentryWebhookOutputs = {
	issueCreated: IssueCreatedEvent;
	issueResolved: IssueResolvedEvent;
	issueAssigned: IssueAssignedEvent;
	eventAlert: EventAlertEvent;
	metricAlert: MetricAlertEvent;
	commentCreated: CommentCreatedEvent;
	commentUpdated: CommentUpdatedEvent;
	commentDeleted: CommentDeletedEvent;
};

export type SentryWebhookPayload<TEvent = SentryWebhookEvent> = TEvent;

// ── Utilities ────────────────────────────────────────────────────────────────

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function verifySentryWebhookSignature(
	request: WebhookRequest<unknown>,
	webhookSecret?: string,
): { valid: boolean; error?: string } {
	if (!webhookSecret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers;
	const signature = Array.isArray(headers['sentry-hook-signature'])
		? headers['sentry-hook-signature'][0]
		: headers['sentry-hook-signature'];

	if (!signature) {
		return {
			valid: false,
			error: 'Missing sentry-hook-signature header',
		};
	}

	const hmac = crypto.createHmac('sha256', webhookSecret);
	hmac.update(rawBody, 'utf8');
	const digest = hmac.digest('hex');

	const isValid = digest === signature;
	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}

export function createSentryEventMatch(
	resource: string,
	action: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const headers = request.headers;

		const hookResource = Array.isArray(headers['sentry-hook-resource'])
			? headers['sentry-hook-resource'][0]
			: headers['sentry-hook-resource'];

		if (hookResource !== resource) {
			return false;
		}

		const parsedBody = parseBody(request.body) as Record<string, unknown>;
		return (
			typeof parsedBody.action === 'string' && parsedBody.action === action
		);
	};
}

export const createSentryMatch = createSentryEventMatch;
