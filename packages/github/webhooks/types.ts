import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignatureWithPrefix } from 'corsair/http';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-schemas
// ─────────────────────────────────────────────────────────────────────────────

export const UserSchema = z.object({
	login: z.string(),
	id: z.number(),
	node_id: z.string(),
	name: z.string().optional(),
	email: z.string().nullable().optional(),
	avatar_url: z.string(),
	gravatar_id: z.string(),
	url: z.string(),
	html_url: z.string(),
	followers_url: z.string(),
	following_url: z.string(),
	gists_url: z.string(),
	starred_url: z.string(),
	subscriptions_url: z.string(),
	organizations_url: z.string(),
	repos_url: z.string(),
	events_url: z.string(),
	received_events_url: z.string(),
	type: z.enum(['Bot', 'User', 'Organization']),
	site_admin: z.boolean(),
});
export type User = z.infer<typeof UserSchema>;

export const RepositorySchema = z.object({
	id: z.number(),
	node_id: z.string(),
	name: z.string(),
	full_name: z.string(),
	private: z.boolean(),
	owner: UserSchema,
	html_url: z.string(),
	description: z.string().nullable(),
	fork: z.boolean(),
	url: z.string(),
	created_at: z.union([z.number(), z.string()]),
	updated_at: z.string(),
	pushed_at: z.union([z.number(), z.string()]).nullable(),
	default_branch: z.string(),
});
export type Repository = z.infer<typeof RepositorySchema>;

export const PullRequestSchema = z.object({
	url: z.string(),
	id: z.number(),
	node_id: z.string(),
	html_url: z.string(),
	diff_url: z.string(),
	patch_url: z.string(),
	issue_url: z.string(),
	number: z.number(),
	state: z.enum(['open', 'closed']),
	locked: z.boolean(),
	title: z.string(),
	user: UserSchema,
	body: z.string().nullable(),
	created_at: z.string(),
	updated_at: z.string(),
	closed_at: z.string().nullable(),
	merged_at: z.string().nullable(),
	merge_commit_sha: z.string().nullable(),
	assignee: UserSchema.nullable(),
	assignees: z.array(UserSchema),
	draft: z.boolean().optional(),
	merged: z.boolean().nullable(),
	mergeable: z.boolean().nullable(),
	comments: z.number(),
	review_comments: z.number(),
	commits: z.number(),
	additions: z.number(),
	deletions: z.number(),
	changed_files: z.number(),
	active_lock_reason: z.string().nullable().optional(),
	merged_by: UserSchema.nullable().optional(),
});
export type PullRequest = z.infer<typeof PullRequestSchema>;

const CommitterSchema = z.object({
	name: z.string(),
	email: z.string().nullable(),
	username: z.string().optional(),
	date: z.string().optional(),
});
export type Committer = z.infer<typeof CommitterSchema>;

export const CommitSchema = z.object({
	id: z.string(),
	tree_id: z.string(),
	distinct: z.boolean(),
	message: z.string(),
	timestamp: z.string(),
	url: z.string(),
	author: CommitterSchema,
	committer: CommitterSchema,
	added: z.array(z.string()),
	modified: z.array(z.string()),
	removed: z.array(z.string()),
});
export type Commit = z.infer<typeof CommitSchema>;

const OrganizationSchema = z.object({
	login: z.string(),
	id: z.number(),
	node_id: z.string(),
	url: z.string(),
	html_url: z.string().optional(),
	repos_url: z.string(),
	events_url: z.string(),
	hooks_url: z.string(),
	issues_url: z.string(),
	members_url: z.string(),
	public_members_url: z.string(),
	avatar_url: z.string(),
	description: z.string().nullable(),
});

const InstallationSchema = z.object({
	id: z.number(),
	node_id: z.string(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const PullRequestOpenedEventSchema = z.object({
	action: z.literal('opened'),
	number: z.number(),
	pull_request: PullRequestSchema.extend({
		state: z.literal('open'),
		closed_at: z.null(),
		merged_at: z.null(),
		active_lock_reason: z.null(),
		merged_by: z.null(),
	}),
	repository: RepositorySchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
	sender: UserSchema,
});
export type PullRequestOpenedEvent = z.infer<
	typeof PullRequestOpenedEventSchema
>;

export const PullRequestClosedEventSchema = z.object({
	action: z.literal('closed'),
	number: z.number(),
	pull_request: PullRequestSchema.extend({
		state: z.literal('closed'),
		closed_at: z.string(),
		merged: z.boolean(),
	}),
	repository: RepositorySchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
	sender: UserSchema,
});
export type PullRequestClosedEvent = z.infer<
	typeof PullRequestClosedEventSchema
>;

export const PullRequestSynchronizeEventSchema = z.object({
	action: z.literal('synchronize'),
	number: z.number(),
	before: z.string(),
	after: z.string(),
	pull_request: PullRequestSchema,
	repository: RepositorySchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
	sender: UserSchema,
});
export type PullRequestSynchronizeEvent = z.infer<
	typeof PullRequestSynchronizeEventSchema
>;

export const PushEventSchema = z.object({
	ref: z.string(),
	before: z.string(),
	after: z.string(),
	created: z.boolean(),
	deleted: z.boolean(),
	forced: z.boolean(),
	base_ref: z.string().nullable(),
	compare: z.string(),
	commits: z.array(CommitSchema),
	head_commit: CommitSchema.nullable(),
	repository: RepositorySchema,
	pusher: CommitterSchema,
	sender: UserSchema,
	installation: InstallationSchema.optional(),
	organization: OrganizationSchema.optional(),
});
export type PushEvent = z.infer<typeof PushEventSchema>;

export const StarCreatedEventSchema = z.object({
	action: z.literal('created'),
	starred_at: z.string(),
	repository: RepositorySchema,
	sender: UserSchema,
	organization: OrganizationSchema.optional(),
	installation: InstallationSchema.optional(),
});
export type StarCreatedEvent = z.infer<typeof StarCreatedEventSchema>;

export const StarDeletedEventSchema = z.object({
	action: z.literal('deleted'),
	starred_at: z.null(),
	repository: RepositorySchema,
	sender: UserSchema,
	organization: OrganizationSchema.optional(),
	installation: InstallationSchema.optional(),
});
export type StarDeletedEvent = z.infer<typeof StarDeletedEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Union and map types
// ─────────────────────────────────────────────────────────────────────────────

export const GithubWebhookEventSchema = z.union([
	PullRequestOpenedEventSchema,
	PullRequestClosedEventSchema,
	PullRequestSynchronizeEventSchema,
	PushEventSchema,
	StarCreatedEventSchema,
	StarDeletedEventSchema,
]);
export type GithubWebhookEvent = z.infer<typeof GithubWebhookEventSchema>;

export type GithubWebhookPayload<
	TEvent extends GithubWebhookEvent = GithubWebhookEvent,
> = TEvent;

export type GithubWebhookOutputs = {
	pullRequestOpened: PullRequestOpenedEvent;
	pullRequestClosed: PullRequestClosedEvent;
	pullRequestSynchronize: PullRequestSynchronizeEvent;
	push: PushEventType;
	starCreated: StarCreatedEvent;
	starDeleted: StarDeletedEvent;
};

export type PushEventType = PushEvent;

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function verifyGithubWebhookSignature(
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
	const signature = Array.isArray(headers['x-hub-signature-256'])
		? headers['x-hub-signature-256'][0]
		: headers['x-hub-signature-256'];

	if (!signature) {
		return {
			valid: false,
			error: 'Missing x-hub-signature-256 header',
		};
	}

	const isValid = verifyHmacSignatureWithPrefix(
		rawBody,
		webhookSecret,
		signature,
		'sha256=',
	);
	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}

export function createGithubEventMatch(
	eventType: string,
	action?: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const headers = request.headers as Record<string, string | undefined>;
		const githubEvent = headers['x-github-event'];
		if (githubEvent !== eventType) {
			return false;
		}
		if (action) {
			const parsedBody = parseBody(request.body) as Record<string, unknown>;
			return (parsedBody.action as string) === action;
		}
		return true;
	};
}
