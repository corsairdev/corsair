import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import crypto from 'crypto';
import { z } from 'zod';

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
			// Sentry may send additional issue fields not covered by the schema above;
			// catchall(unknown) passes them through without stripping or failing validation.
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
			// Sentry may send additional issue fields not covered by the schema above;
			// catchall(unknown) passes them through without stripping or failing validation.
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
			// Sentry may send additional issue fields not covered by the schema above;
			// catchall(unknown) passes them through without stripping or failing validation.
			.catchall(z.unknown()),
	}),
	actor: SentryActorSchema,
	installation: SentryInstallationSchema.optional(),
});
export type IssueAssignedEvent = z.infer<typeof IssueAssignedEventSchema>;

// ── Error Webhook Schemas ────────────────────────────────────────────────────

export const ErrorCreatedEventSchema = z.object({
	action: z.literal('created'),
	data: z.object({
		error: z
			.object({
				event_id: z.string().optional(),
				title: z.string().optional(),
				platform: z.string().nullable().optional(),
				level: z.string().nullable().optional(),
				url: z.string().optional(),
				culprit: z.string().nullable().optional(),
				project: z.string().nullable().optional(),
				message: z.string().nullable().optional(),
			})
			// Sentry error events carry platform-specific fields (stacktrace, breadcrumbs,
			// sdk info, etc.) not enumerated here; catchall(unknown) preserves them.
			.catchall(z.unknown()),
	}),
	actor: SentryActorSchema.optional(),
	installation: SentryInstallationSchema.optional(),
});
export type ErrorCreatedEvent = z.infer<typeof ErrorCreatedEventSchema>;

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
			// Alert event payloads embed the triggering error event which may carry
			// arbitrary platform-specific fields; catchall(unknown) preserves them.
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
			// Metric alert objects include rule-type-specific fields (thresholds,
			// query details, etc.) that vary by configuration; catchall(unknown) keeps them.
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
	// catchall(unknown) allows Sentry to add future comment fields without breaking parsing.
	data: SentryCommentDataSchema.catchall(z.unknown()),
	actor: SentryActorSchema,
	installation: SentryInstallationSchema.optional(),
});
export type CommentCreatedEvent = z.infer<typeof CommentCreatedEventSchema>;

export const CommentUpdatedEventSchema = z.object({
	action: z.literal('updated'),
	// catchall(unknown) allows Sentry to add future comment fields without breaking parsing.
	data: SentryCommentDataSchema.catchall(z.unknown()),
	actor: SentryActorSchema,
	installation: SentryInstallationSchema.optional(),
});
export type CommentUpdatedEvent = z.infer<typeof CommentUpdatedEventSchema>;

export const CommentDeletedEventSchema = z.object({
	action: z.literal('deleted'),
	// catchall(unknown) allows Sentry to add future comment fields without breaking parsing.
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
	ErrorCreatedEventSchema,
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
	errorCreated: ErrorCreatedEvent;
	eventAlert: EventAlertEvent;
	metricAlert: MetricAlertEvent;
	commentCreated: CommentCreatedEvent;
	commentUpdated: CommentUpdatedEvent;
	commentDeleted: CommentDeletedEvent;
};

export type SentryWebhookPayload<TEvent = SentryWebhookEvent> = TEvent;

// ── Utilities ────────────────────────────────────────────────────────────────

// Body arrives as either a pre-parsed object or a raw JSON string depending on
// the HTTP framework; both parameter and return are unknown until narrowed by callers.
function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function verifySentryWebhookSignature(
	// The body type is not inspected during signature verification; unknown
	// avoids forcing callers to narrow it before passing the request in.
	request: WebhookRequest<unknown>,
	webhookSecret?: string,
): { valid: boolean; error?: string } {
	if (!webhookSecret) {
		return { valid: false, error: 'Missing webhook secret' };
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

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
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

		// parseBody returns unknown; cast to a string-keyed map so we can read
		// the 'action' field without a lengthy type-guard chain.
		const parsedBody = parseBody(request.body) as Record<string, unknown>;
		return (
			typeof parsedBody.action === 'string' && parsedBody.action === action
		);
	};
}

export const createSentryMatch = createSentryEventMatch;
