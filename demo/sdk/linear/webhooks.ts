import type { Issue, Comment, Project } from './models';

export interface WebhookData {
  id: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
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

