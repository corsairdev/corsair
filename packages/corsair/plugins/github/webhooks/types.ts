export type User = {
	login: string;
	id: number;
	node_id: string;
	name?: string;
	email?: string | null;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: 'Bot' | 'User' | 'Organization';
	site_admin: boolean;
};

export type Repository = {
	id: number;
	node_id: string;
	name: string;
	full_name: string;
	private: boolean;
	owner: User;
	html_url: string;
	description: string | null;
	fork: boolean;
	url: string;
	created_at: number | string;
	updated_at: string;
	pushed_at: number | string | null;
	default_branch: string;
};

export type PullRequest = {
	url: string;
	id: number;
	node_id: string;
	html_url: string;
	diff_url: string;
	patch_url: string;
	issue_url: string;
	number: number;
	state: 'open' | 'closed';
	locked: boolean;
	title: string;
	user: User;
	body: string | null;
	created_at: string;
	updated_at: string;
	closed_at: string | null;
	merged_at: string | null;
	merge_commit_sha: string | null;
	assignee: User | null;
	assignees: User[];
	draft?: boolean;
	merged: boolean | null;
	mergeable: boolean | null;
	comments: number;
	review_comments: number;
	commits: number;
	additions: number;
	deletions: number;
	changed_files: number;
	active_lock_reason?: string | null;
	merged_by?: User | null;
};

export type Commit = {
	id: string;
	tree_id: string;
	distinct: boolean;
	message: string;
	timestamp: string;
	url: string;
	author: {
		name: string;
		email: string | null;
		username?: string;
		date?: string;
	};
	committer: {
		name: string;
		email: string | null;
		username?: string;
		date?: string;
	};
	added: string[];
	modified: string[];
	removed: string[];
};

export type Committer = {
	name: string;
	email: string | null;
	username?: string;
	date?: string;
};

export interface PullRequestOpenedEvent {
	action: 'opened';
	number: number;
	pull_request: PullRequest & {
		state: 'open';
		closed_at: null;
		merged_at: null;
		active_lock_reason: null;
		merged_by: null;
	};
	repository: Repository;
	installation?: { id: number; node_id: string };
	organization?: {
		login: string;
		id: number;
		node_id: string;
		url: string;
		html_url?: string;
		repos_url: string;
		events_url: string;
		hooks_url: string;
		issues_url: string;
		members_url: string;
		public_members_url: string;
		avatar_url: string;
		description: string | null;
	};
	sender: User;
}

export interface PullRequestClosedEvent {
	action: 'closed';
	number: number;
	pull_request: PullRequest & {
		state: 'closed';
		closed_at: string;
		merged: boolean;
	};
	repository: Repository;
	installation?: { id: number; node_id: string };
	organization?: {
		login: string;
		id: number;
		node_id: string;
		url: string;
		html_url?: string;
		repos_url: string;
		events_url: string;
		hooks_url: string;
		issues_url: string;
		members_url: string;
		public_members_url: string;
		avatar_url: string;
		description: string | null;
	};
	sender: User;
}

export interface PullRequestSynchronizeEvent {
	action: 'synchronize';
	number: number;
	before: string;
	after: string;
	pull_request: PullRequest;
	repository: Repository;
	installation?: { id: number; node_id: string };
	organization?: {
		login: string;
		id: number;
		node_id: string;
		url: string;
		html_url?: string;
		repos_url: string;
		events_url: string;
		hooks_url: string;
		issues_url: string;
		members_url: string;
		public_members_url: string;
		avatar_url: string;
		description: string | null;
	};
	sender: User;
}

export interface PushEvent {
	ref: string;
	before: string;
	after: string;
	created: boolean;
	deleted: boolean;
	forced: boolean;
	base_ref: string | null;
	compare: string;
	commits: Commit[];
	head_commit: Commit | null;
	repository: Repository;
	pusher: Committer;
	sender: User;
	installation?: { id: number; node_id: string };
	organization?: {
		login: string;
		id: number;
		node_id: string;
		url: string;
		html_url?: string;
		repos_url: string;
		events_url: string;
		hooks_url: string;
		issues_url: string;
		members_url: string;
		public_members_url: string;
		avatar_url: string;
		description: string | null;
	};
}

export interface StarCreatedEvent {
	action: 'created';
	starred_at: string;
	repository: Repository;
	sender: User;
	organization?: {
		login: string;
		id: number;
		node_id: string;
		url: string;
		html_url?: string;
		repos_url: string;
		events_url: string;
		hooks_url: string;
		issues_url: string;
		members_url: string;
		public_members_url: string;
		avatar_url: string;
		description: string | null;
	};
	installation?: { id: number; node_id: string };
}

export interface StarDeletedEvent {
	action: 'deleted';
	starred_at: null;
	repository: Repository;
	sender: User;
	organization?: {
		login: string;
		id: number;
		node_id: string;
		url: string;
		html_url?: string;
		repos_url: string;
		events_url: string;
		hooks_url: string;
		issues_url: string;
		members_url: string;
		public_members_url: string;
		avatar_url: string;
		description: string | null;
	};
	installation?: { id: number; node_id: string };
}

export type GithubWebhookEvent =
	| PullRequestOpenedEvent
	| PullRequestClosedEvent
	| PullRequestSynchronizeEvent
	| PushEvent
	| StarCreatedEvent
	| StarDeletedEvent;

export type GithubWebhookPayload = GithubWebhookEvent;

export type GithubWebhookOutputs = {
	pullRequestOpened: PullRequestOpenedEvent;
	pullRequestClosed: PullRequestClosedEvent;
	pullRequestSynchronize: PullRequestSynchronizeEvent;
	push: PushEventType;
	starCreated: StarCreatedEvent;
	starDeleted: StarDeletedEvent;
};

export type PushEventType = PushEvent;

import { verifyHmacSignatureWithPrefix } from '../../../async-core/webhook-utils';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from '../../../core';

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
