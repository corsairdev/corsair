import type { CommentGetResponse } from './endpoints/types';
import { convertKeysToCamelCase } from './utils';
import type { Comment, Issue, PullRequest } from './webhooks/types';

type ApiComment = CommentGetResponse & {
	user?: unknown;
};

function persistUser(user: unknown) {
	if (user == null) return user;
	return convertKeysToCamelCase(user);
}

function persistUsers(users: unknown) {
	if (users == null) return users;
	if (!Array.isArray(users)) return undefined;
	return users.map((entry) => convertKeysToCamelCase(entry));
}

function persistLabels(labels: unknown) {
	if (labels == null) return undefined;
	if (!Array.isArray(labels)) return undefined;
	return labels.map((entry) => convertKeysToCamelCase(entry));
}

export function commentRecordFromApi(
	comment: ApiComment,
	extras?: { deletedAt?: Date | null },
) {
	return {
		id: comment.id,
		nodeId: comment.nodeId,
		url: comment.url,
		htmlUrl: comment.htmlUrl,
		issueUrl: comment.issueUrl,
		body: comment.body,
		authorAssociation: comment.authorAssociation,
		user: persistUser(comment.user),
		createdAt: comment.createdAt ? new Date(comment.createdAt) : null,
		updatedAt: comment.updatedAt ? new Date(comment.updatedAt) : null,
		...(extras?.deletedAt !== undefined ? { deletedAt: extras.deletedAt } : {}),
	};
}

export function commentRecordFromWebhook(
	comment: Comment,
	extras?: { deletedAt?: Date | null },
) {
	return {
		id: comment.id,
		nodeId: comment.node_id,
		url: comment.url,
		htmlUrl: comment.html_url,
		issueUrl: comment.issue_url,
		body: comment.body,
		authorAssociation: comment.author_association,
		user: persistUser(comment.user),
		createdAt: comment.created_at ? new Date(comment.created_at) : null,
		updatedAt: comment.updated_at ? new Date(comment.updated_at) : null,
		...(extras?.deletedAt !== undefined ? { deletedAt: extras.deletedAt } : {}),
	};
}

export function issueRecordFromWebhook(
	issue: Issue,
	extras?: { deletedAt?: Date | null },
) {
	return {
		id: issue.id,
		nodeId: issue.node_id,
		url: issue.url,
		repositoryUrl: issue.repository_url,
		htmlUrl: issue.html_url,
		number: issue.number,
		state: issue.state,
		title: issue.title,
		body: issue.body,
		locked: issue.locked,
		comments: issue.comments,
		user: persistUser(issue.user),
		labels: persistLabels(issue.labels),
		assignee: persistUser(issue.assignee),
		assignees: persistUsers(issue.assignees),
		createdAt: issue.created_at ? new Date(issue.created_at) : null,
		updatedAt: issue.updated_at ? new Date(issue.updated_at) : null,
		closedAt: issue.closed_at ? new Date(issue.closed_at) : null,
		...(extras?.deletedAt !== undefined ? { deletedAt: extras.deletedAt } : {}),
	};
}

export function pullRequestRecordFromWebhook(pr: PullRequest) {
	return {
		id: pr.id,
		nodeId: pr.node_id,
		url: pr.url,
		htmlUrl: pr.html_url,
		diffUrl: pr.diff_url,
		patchUrl: pr.patch_url,
		issueUrl: pr.issue_url,
		number: pr.number,
		state: pr.state,
		locked: pr.locked,
		title: pr.title,
		body: pr.body,
		user: persistUser(pr.user),
		assignee: persistUser(pr.assignee),
		assignees: persistUsers(pr.assignees),
		createdAt: new Date(pr.created_at),
		updatedAt: new Date(pr.updated_at),
		closedAt: pr.closed_at ? new Date(pr.closed_at) : null,
		mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
		mergeCommitSha: pr.merge_commit_sha,
		draft: pr.draft,
		merged: pr.merged ?? false,
		mergeable: pr.mergeable,
		comments: pr.comments,
		reviewComments: pr.review_comments,
		commits: pr.commits,
		additions: pr.additions,
		deletions: pr.deletions,
		changedFiles: pr.changed_files,
	};
}
