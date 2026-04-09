import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-schemas
// ─────────────────────────────────────────────────────────────────────────────

export const WebhookDataSchema = z
	.object({
		id: z.string(),
		createdAt: z.string(),
		updatedAt: z.string(),
		archivedAt: z.string().optional(),
	})
	.catchall(z.any());
export type WebhookData = z.infer<typeof WebhookDataSchema>;

export const IssueSchema = z
	.object({
		id: z.string(),
		identifier: z.string(),
		title: z.string(),
		description: z.string().optional(),
		priority: z.union([
			z.literal(0),
			z.literal(1),
			z.literal(2),
			z.literal(3),
			z.literal(4),
		]),
		estimate: z.number().optional(),
		sortOrder: z.number(),
		startedAt: z.string().optional(),
		completedAt: z.string().optional(),
		canceledAt: z.string().optional(),
		autoArchivedAt: z.string().optional(),
		autoClosedAt: z.string().optional(),
		dueDate: z.string().optional(),
		trashed: z.boolean().optional(),
		snoozedUntilAt: z.string().optional(),
		previousIdentifiers: z.array(z.string()),
		createdAt: z.string(),
		updatedAt: z.string(),
		branchName: z.string(),
		customerTicketCount: z.number(),
		stateId: z.string(),
		teamId: z.string(),
		creatorId: z.string(),
	})
	.catchall(z.any());
export type Issue = z.infer<typeof IssueSchema>;

export const CommentSchema = z
	.object({
		id: z.string(),
		body: z.string(),
		editedAt: z.string().optional(),
		createdAt: z.string(),
		updatedAt: z.string(),
		issueId: z.string(),
		userId: z.string(),
	})
	.catchall(z.any());
export type Comment = z.infer<typeof CommentSchema>;

export const ProjectSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().optional(),
		icon: z.string().optional(),
		color: z.string().optional(),
		priority: z.union([
			z.literal(0),
			z.literal(1),
			z.literal(2),
			z.literal(3),
			z.literal(4),
		]),
		sortOrder: z.number(),
		state: z.enum(['planned', 'started', 'paused', 'completed', 'canceled']),
		progress: z.number(),
		url: z.string(),
		startDate: z.string().optional(),
		targetDate: z.string().optional(),
		completedAt: z.string().optional(),
		canceledAt: z.string().optional(),
		startedAt: z.string().optional(),
		completedScopeHistory: z.array(z.number()),
		inProgressScopeHistory: z.array(z.number()),
		scope: z.number(),
		createdAt: z.string(),
		updatedAt: z.string(),
	})
	.catchall(z.any());
export type Project = z.infer<typeof ProjectSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Issue event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const IssueCreatedEventSchema = z.object({
	action: z.literal('create'),
	type: z.literal('Issue'),
	data: IssueSchema,
	url: z.string(),
	createdAt: z.string(),
	organizationId: z.string(),
	webhookId: z.string(),
});
export type IssueCreatedEvent = z.infer<typeof IssueCreatedEventSchema>;

export const IssueUpdatedEventSchema = z.object({
	action: z.literal('update'),
	type: z.literal('Issue'),
	data: IssueSchema,
	updatedFrom: IssueSchema.partial().optional(),
	url: z.string(),
	createdAt: z.string(),
	organizationId: z.string(),
	webhookId: z.string(),
});
export type IssueUpdatedEvent = z.infer<typeof IssueUpdatedEventSchema>;

export const IssueDeletedEventSchema = z.object({
	action: z.literal('remove'),
	type: z.literal('Issue'),
	data: IssueSchema,
	url: z.string(),
	createdAt: z.string(),
	organizationId: z.string(),
	webhookId: z.string(),
});
export type IssueDeletedEvent = z.infer<typeof IssueDeletedEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Comment event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const CommentCreatedEventSchema = z.object({
	action: z.literal('create'),
	type: z.literal('Comment'),
	data: CommentSchema,
	url: z.string(),
	createdAt: z.string(),
	organizationId: z.string(),
	webhookId: z.string(),
});
export type CommentCreatedEvent = z.infer<typeof CommentCreatedEventSchema>;

export const CommentUpdatedEventSchema = z.object({
	action: z.literal('update'),
	type: z.literal('Comment'),
	data: CommentSchema,
	updatedFrom: CommentSchema.partial().optional(),
	url: z.string(),
	createdAt: z.string(),
	organizationId: z.string(),
	webhookId: z.string(),
});
export type CommentUpdatedEvent = z.infer<typeof CommentUpdatedEventSchema>;

export const CommentDeletedEventSchema = z.object({
	action: z.literal('remove'),
	type: z.literal('Comment'),
	data: CommentSchema,
	url: z.string(),
	createdAt: z.string(),
	organizationId: z.string(),
	webhookId: z.string(),
});
export type CommentDeletedEvent = z.infer<typeof CommentDeletedEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Project event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const ProjectCreatedEventSchema = z.object({
	action: z.literal('create'),
	type: z.literal('Project'),
	data: ProjectSchema,
	url: z.string(),
	createdAt: z.string(),
	organizationId: z.string(),
	webhookId: z.string(),
});
export type ProjectCreatedEvent = z.infer<typeof ProjectCreatedEventSchema>;

export const ProjectUpdatedEventSchema = z.object({
	action: z.literal('update'),
	type: z.literal('Project'),
	data: ProjectSchema,
	updatedFrom: ProjectSchema.partial().optional(),
	url: z.string(),
	createdAt: z.string(),
	organizationId: z.string(),
	webhookId: z.string(),
});
export type ProjectUpdatedEvent = z.infer<typeof ProjectUpdatedEventSchema>;

export const ProjectDeletedEventSchema = z.object({
	action: z.literal('remove'),
	type: z.literal('Project'),
	data: ProjectSchema,
	url: z.string(),
	createdAt: z.string(),
	organizationId: z.string(),
	webhookId: z.string(),
});
export type ProjectDeletedEvent = z.infer<typeof ProjectDeletedEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Union and map types
// ─────────────────────────────────────────────────────────────────────────────

export const LinearWebhookEventSchema = z.union([
	IssueCreatedEventSchema,
	IssueUpdatedEventSchema,
	IssueDeletedEventSchema,
	CommentCreatedEventSchema,
	CommentUpdatedEventSchema,
	CommentDeletedEventSchema,
	ProjectCreatedEventSchema,
	ProjectUpdatedEventSchema,
	ProjectDeletedEventSchema,
]);
export type LinearWebhookEvent = z.infer<typeof LinearWebhookEventSchema>;

export type LinearEventName =
	| 'Issue'
	| 'IssueCreate'
	| 'IssueUpdate'
	| 'IssueRemove'
	| 'Comment'
	| 'CommentCreate'
	| 'CommentUpdate'
	| 'CommentRemove'
	| 'Project'
	| 'ProjectCreate'
	| 'ProjectUpdate'
	| 'ProjectRemove';

export interface LinearEventMap {
	Issue: IssueCreatedEvent | IssueUpdatedEvent | IssueDeletedEvent;
	IssueCreate: IssueCreatedEvent;
	IssueUpdate: IssueUpdatedEvent;
	IssueRemove: IssueDeletedEvent;
	Comment: CommentCreatedEvent | CommentUpdatedEvent | CommentDeletedEvent;
	CommentCreate: CommentCreatedEvent;
	CommentUpdate: CommentUpdatedEvent;
	CommentRemove: CommentDeletedEvent;
	Project: ProjectCreatedEvent | ProjectUpdatedEvent | ProjectDeletedEvent;
	ProjectCreate: ProjectCreatedEvent;
	ProjectUpdate: ProjectUpdatedEvent;
	ProjectRemove: ProjectDeletedEvent;
}

export type LinearWebhookPayload<TEvent = LinearWebhookEvent> = TEvent;

export type LinearWebhookOutputs = {
	issueCreate: IssueCreatedEvent;
	issueUpdate: IssueUpdatedEvent;
	issueRemove: IssueDeletedEvent;
	commentCreate: CommentCreatedEvent;
	commentUpdate: CommentUpdatedEvent;
	commentRemove: CommentDeletedEvent;
	projectCreate: ProjectCreatedEvent;
	projectUpdate: ProjectUpdatedEvent;
	projectRemove: ProjectDeletedEvent;
};

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function verifyLinearWebhookSignature(
	request: WebhookRequest<unknown>,
	webhookSecret?: string,
): { valid: boolean; error?: string } {
	if (!webhookSecret) {
		return { valid: false };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers;
	const signature = Array.isArray(headers['linear-signature'])
		? headers['linear-signature'][0]
		: headers['linear-signature'];

	if (!signature) {
		return {
			valid: false,
			error: 'Missing linear-signature header',
		};
	}

	const isValid = verifyHmacSignature(rawBody, webhookSecret, signature);
	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}

export function createLinearEventMatch(
	type: string,
	action: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body) as Record<string, unknown>;
		return (
			typeof parsedBody.type === 'string' &&
			parsedBody.type === type &&
			typeof parsedBody.action === 'string' &&
			parsedBody.action === action
		);
	};
}

export const createLinearMatch = createLinearEventMatch;
