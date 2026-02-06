export interface WebhookData {
	id: string;
	createdAt: string;
	updatedAt: string;
	archivedAt?: string;
	[key: string]: any;
}

export interface Issue {
	id: string;
	identifier: string;
	title: string;
	description?: string;
	priority: 0 | 1 | 2 | 3 | 4;
	estimate?: number;
	sortOrder: number;
	startedAt?: string;
	completedAt?: string;
	canceledAt?: string;
	autoArchivedAt?: string;
	autoClosedAt?: string;
	dueDate?: string;
	trashed?: boolean;
	snoozedUntilAt?: string;
	previousIdentifiers: string[];
	createdAt: string;
	updatedAt: string;
	branchName: string;
	customerTicketCount: number;
	stateId: string;
	teamId: string;
	creatorId: string;
	[key: string]: any;
}

export interface Comment {
	id: string;
	body: string;
	editedAt?: string;
	createdAt: string;
	updatedAt: string;
	issueId: string;
	userId: string;
	[key: string]: any;
}

export interface Project {
	id: string;
	name: string;
	description?: string;
	icon?: string;
	color?: string;
	priority: 0 | 1 | 2 | 3 | 4;
	sortOrder: number;
	state: 'planned' | 'started' | 'paused' | 'completed' | 'canceled';
	progress: number;
	url: string;
	startDate?: string;
	targetDate?: string;
	completedAt?: string;
	canceledAt?: string;
	startedAt?: string;
	completedScopeHistory: number[];
	inProgressScopeHistory: number[];
	scope: number;
	createdAt: string;
	updatedAt: string;
	[key: string]: any;
}

export interface IssueCreatedEvent {
	action: 'create';
	type: 'Issue';
	data: Issue;
	url: string;
	createdAt: string;
	organizationId: string;
	webhookId: string;
}

export interface IssueUpdatedEvent {
	action: 'update';
	type: 'Issue';
	data: Issue;
	updatedFrom?: Partial<Issue>;
	url: string;
	createdAt: string;
	organizationId: string;
	webhookId: string;
}

export interface IssueDeletedEvent {
	action: 'remove';
	type: 'Issue';
	data: Issue;
	url: string;
	createdAt: string;
	organizationId: string;
	webhookId: string;
}

export interface CommentCreatedEvent {
	action: 'create';
	type: 'Comment';
	data: Comment;
	url: string;
	createdAt: string;
	organizationId: string;
	webhookId: string;
}

export interface CommentUpdatedEvent {
	action: 'update';
	type: 'Comment';
	data: Comment;
	updatedFrom?: Partial<Comment>;
	url: string;
	createdAt: string;
	organizationId: string;
	webhookId: string;
}

export interface CommentDeletedEvent {
	action: 'remove';
	type: 'Comment';
	data: Comment;
	url: string;
	createdAt: string;
	organizationId: string;
	webhookId: string;
}

export interface ProjectCreatedEvent {
	action: 'create';
	type: 'Project';
	data: Project;
	url: string;
	createdAt: string;
	organizationId: string;
	webhookId: string;
}

export interface ProjectUpdatedEvent {
	action: 'update';
	type: 'Project';
	data: Project;
	updatedFrom?: Partial<Project>;
	url: string;
	createdAt: string;
	organizationId: string;
	webhookId: string;
}

export interface ProjectDeletedEvent {
	action: 'remove';
	type: 'Project';
	data: Project;
	url: string;
	createdAt: string;
	organizationId: string;
	webhookId: string;
}

export type LinearWebhookEvent =
	| IssueCreatedEvent
	| IssueUpdatedEvent
	| IssueDeletedEvent
	| CommentCreatedEvent
	| CommentUpdatedEvent
	| CommentDeletedEvent
	| ProjectCreatedEvent
	| ProjectUpdatedEvent
	| ProjectDeletedEvent;

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

import { verifyHmacSignature } from '../../../async-core/webhook-utils';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from '../../../core';

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
