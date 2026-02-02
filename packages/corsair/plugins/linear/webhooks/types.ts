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
	[key: string]: any;
}

export interface Comment {
	id: string;
	body: string;
	editedAt?: string;
	createdAt: string;
	updatedAt: string;
	[key: string]: any;
}

export interface Project {
	id: string;
	name: string;
	description?: string;
	icon?: string;
	color?: string;
	state: string;
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

export type LinearWebhookAck = {
	success?: boolean;
};

export type LinearWebhookOutputs = {
	issueCreate: LinearWebhookAck;
	issueUpdate: LinearWebhookAck;
	issueRemove: LinearWebhookAck;
	commentCreate: LinearWebhookAck;
	commentUpdate: LinearWebhookAck;
	commentRemove: LinearWebhookAck;
	projectCreate: LinearWebhookAck;
	projectUpdate: LinearWebhookAck;
	projectRemove: LinearWebhookAck;
};

import type { CorsairWebhookMatcher, RawWebhookRequest } from '../../../core';

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

/**
 * Creates a webhook matcher for a specific Linear event type and action.
 * Returns a matcher function that checks if the incoming webhook matches.
 */
export function createLinearMatch(
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
