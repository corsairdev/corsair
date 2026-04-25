import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { z } from 'zod';

// ============================================================================
// Base webhook payload
// ============================================================================

export interface GitlabWebhookPayload {
	object_kind: string;
	event_name?: string;
	[key: string]: unknown;
}

function parseBody(body: unknown): Record<string, unknown> {
	if (typeof body === 'string') {
		return JSON.parse(body) as Record<string, unknown>;
	}
	return (body ?? {}) as Record<string, unknown>;
}

export function createGitlabMatch(objectKind: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody.object_kind === objectKind;
	};
}

export function verifyGitlabWebhookSignature(
	request: WebhookRequest<GitlabWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: true };
	}

	const token = request.headers['x-gitlab-token'];

	if (!token) {
		return { valid: false, error: 'Missing X-Gitlab-Token header' };
	}

	if (token !== secret) {
		return { valid: false, error: 'X-Gitlab-Token does not match configured secret' };
	}

	return { valid: true };
}

// ============================================================================
// Push Event
// ============================================================================

const GitlabPushCommitSchema = z.object({
	id: z.string(),
	message: z.string().optional(),
	title: z.string().optional(),
	timestamp: z.string().optional(),
	url: z.string().optional(),
	author: z.object({
		name: z.string().optional(),
		email: z.string().optional(),
	}).optional(),
	added: z.array(z.string()).optional(),
	modified: z.array(z.string()).optional(),
	removed: z.array(z.string()).optional(),
}).passthrough();

export const PushEventSchema = z.object({
	object_kind: z.literal('push'),
	event_name: z.string().optional(),
	before: z.string().optional(),
	after: z.string().optional(),
	ref: z.string().optional(),
	checkout_sha: z.string().nullable().optional(),
	user_id: z.number().optional(),
	user_name: z.string().optional(),
	user_username: z.string().optional(),
	user_avatar: z.string().optional(),
	project_id: z.number().optional(),
	project: z.object({
		id: z.number().optional(),
		name: z.string().optional(),
		web_url: z.string().optional(),
		path_with_namespace: z.string().optional(),
		default_branch: z.string().optional(),
	}).passthrough().optional(),
	commits: z.array(GitlabPushCommitSchema).optional(),
	total_commits_count: z.number().optional(),
}).passthrough();

export interface PushEvent extends GitlabWebhookPayload {
	object_kind: 'push';
	before?: string;
	after?: string;
	ref?: string;
	commits?: Array<Record<string, unknown>>;
	total_commits_count?: number;
	project_id?: number;
}

// ============================================================================
// Merge Request Event
// ============================================================================

export const MergeRequestEventSchema = z.object({
	object_kind: z.literal('merge_request'),
	event_type: z.string().optional(),
	user: z.object({
		id: z.number().optional(),
		name: z.string().optional(),
		username: z.string().optional(),
		avatar_url: z.string().optional(),
	}).passthrough().optional(),
	project: z.object({
		id: z.number().optional(),
		name: z.string().optional(),
		web_url: z.string().optional(),
		path_with_namespace: z.string().optional(),
	}).passthrough().optional(),
	object_attributes: z.object({
		id: z.number().optional(),
		iid: z.number().optional(),
		title: z.string().optional(),
		state: z.string().optional(),
		source_branch: z.string().optional(),
		target_branch: z.string().optional(),
		action: z.string().optional(),
		url: z.string().optional(),
		description: z.string().nullable().optional(),
		merge_status: z.string().optional(),
		draft: z.boolean().optional(),
	}).passthrough().optional(),
}).passthrough();

export interface MergeRequestEvent extends GitlabWebhookPayload {
	object_kind: 'merge_request';
	event_type?: string;
	object_attributes?: Record<string, unknown>;
}

// ============================================================================
// Issue Event
// ============================================================================

export const IssueEventSchema = z.object({
	object_kind: z.literal('issue'),
	event_type: z.string().optional(),
	user: z.object({
		id: z.number().optional(),
		name: z.string().optional(),
		username: z.string().optional(),
		avatar_url: z.string().optional(),
	}).passthrough().optional(),
	project: z.object({
		id: z.number().optional(),
		name: z.string().optional(),
		web_url: z.string().optional(),
		path_with_namespace: z.string().optional(),
	}).passthrough().optional(),
	object_attributes: z.object({
		id: z.number().optional(),
		iid: z.number().optional(),
		title: z.string().optional(),
		state: z.string().optional(),
		action: z.string().optional(),
		url: z.string().optional(),
		description: z.string().nullable().optional(),
		confidential: z.boolean().optional(),
	}).passthrough().optional(),
}).passthrough();

export interface IssueEvent extends GitlabWebhookPayload {
	object_kind: 'issue';
	event_type?: string;
	object_attributes?: Record<string, unknown>;
}

// ============================================================================
// Pipeline Event
// ============================================================================

export const PipelineEventSchema = z.object({
	object_kind: z.literal('pipeline'),
	object_attributes: z.object({
		id: z.number().optional(),
		iid: z.number().optional(),
		ref: z.string().optional(),
		status: z.string().optional(),
		source: z.string().optional(),
		created_at: z.string().optional(),
		finished_at: z.string().nullable().optional(),
		duration: z.number().nullable().optional(),
	}).passthrough().optional(),
	user: z.object({
		id: z.number().optional(),
		name: z.string().optional(),
		username: z.string().optional(),
		avatar_url: z.string().optional(),
	}).passthrough().optional(),
	project: z.object({
		id: z.number().optional(),
		name: z.string().optional(),
		web_url: z.string().optional(),
		path_with_namespace: z.string().optional(),
	}).passthrough().optional(),
	builds: z.array(z.object({
		id: z.number().optional(),
		stage: z.string().optional(),
		name: z.string().optional(),
		status: z.string().optional(),
	}).passthrough()).optional(),
}).passthrough();

export interface PipelineEvent extends GitlabWebhookPayload {
	object_kind: 'pipeline';
	object_attributes?: Record<string, unknown>;
	builds?: Array<Record<string, unknown>>;
}

// ============================================================================
// Note (Comment) Event
// ============================================================================

export const NoteEventSchema = z.object({
	object_kind: z.literal('note'),
	event_type: z.string().optional(),
	user: z.object({
		id: z.number().optional(),
		name: z.string().optional(),
		username: z.string().optional(),
		avatar_url: z.string().optional(),
	}).passthrough().optional(),
	project: z.object({
		id: z.number().optional(),
		name: z.string().optional(),
		web_url: z.string().optional(),
		path_with_namespace: z.string().optional(),
	}).passthrough().optional(),
	object_attributes: z.object({
		id: z.number().optional(),
		note: z.string().optional(),
		noteable_type: z.string().optional(),
		noteable_id: z.number().optional(),
		url: z.string().optional(),
		action: z.string().optional(),
	}).passthrough().optional(),
	issue: z.object({
		id: z.number().optional(),
		iid: z.number().optional(),
		title: z.string().optional(),
	}).passthrough().optional(),
	merge_request: z.object({
		id: z.number().optional(),
		iid: z.number().optional(),
		title: z.string().optional(),
	}).passthrough().optional(),
	commit: z.object({
		id: z.string().optional(),
		message: z.string().optional(),
	}).passthrough().optional(),
}).passthrough();

export interface NoteEvent extends GitlabWebhookPayload {
	object_kind: 'note';
	event_type?: string;
	object_attributes?: Record<string, unknown>;
}

// ============================================================================
// Webhook output types
// ============================================================================

export type GitlabWebhookOutputs = {
	push: PushEvent;
	mergeRequest: MergeRequestEvent;
	issue: IssueEvent;
	pipeline: PipelineEvent;
	note: NoteEvent;
};
