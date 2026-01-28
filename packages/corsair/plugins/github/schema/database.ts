import { z } from 'zod';

export const GithubUser = z.object({
	id: z.number(),
	login: z.string(),
	nodeId: z.string(),
	avatarUrl: z.string(),
	gravatarId: z.string().nullable(),
	url: z.string(),
	htmlUrl: z.string(),
	type: z.string(),
	siteAdmin: z.boolean(),
	name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date().optional(),
});

export const GithubRepository = z.object({
	id: z.number(),
	nodeId: z.string(),
	name: z.string(),
	fullName: z.string(),
	private: z.boolean(),
	htmlUrl: z.string(),
	description: z.string().nullable(),
	fork: z.boolean(),
	url: z.string(),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date().optional(),
	pushedAt: z.coerce.date().nullable().optional(),
	defaultBranch: z.string(),
	language: z.string().nullable().optional(),
	stargazersCount: z.number().optional(),
	watchersCount: z.number().optional(),
	forksCount: z.number().optional(),
	openIssuesCount: z.number().optional(),
	archived: z.boolean().optional(),
	disabled: z.boolean().optional(),
});

export const GithubIssue = z.object({
	id: z.number(),
	nodeId: z.string(),
	url: z.string(),
	repositoryUrl: z.string(),
	labelsUrl: z.string(),
	commentsUrl: z.string(),
	eventsUrl: z.string(),
	htmlUrl: z.string(),
	number: z.number(),
	state: z.string(),
	stateReason: z
		.enum(['completed', 'reopened', 'not_planned', 'duplicate'])
		.nullable()
		.optional(),
	title: z.string(),
	body: z.string().nullable().optional(),
	user: GithubUser.nullable().optional(),
	labels: z.array(z.any()).optional(),
	assignee: GithubUser.nullable().optional(),
	assignees: z.array(GithubUser).nullable().optional(),
	locked: z.boolean().optional(),
	comments: z.number().optional(),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date().optional(),
	closedAt: z.coerce.date().nullable().optional(),
});

export const GithubPullRequest = z.object({
	id: z.number(),
	nodeId: z.string(),
	url: z.string(),
	htmlUrl: z.string(),
	diffUrl: z.string(),
	patchUrl: z.string(),
	issueUrl: z.string(),
	number: z.number(),
	state: z.enum(['open', 'closed']),
	locked: z.boolean().optional(),
	title: z.string(),
	user: GithubUser.optional(),
	body: z.string().nullable().optional(),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date().optional(),
	closedAt: z.coerce.date().nullable().optional(),
	mergedAt: z.coerce.date().nullable().optional(),
	mergeCommitSha: z.string().nullable().optional(),
	assignee: GithubUser.nullable().optional(),
	assignees: z.array(GithubUser).nullable().optional(),
	draft: z.boolean().optional(),
	merged: z.boolean().optional(),
	mergeable: z.boolean().nullable().optional(),
	comments: z.number().optional(),
	reviewComments: z.number().optional(),
	commits: z.number().optional(),
	additions: z.number().optional(),
	deletions: z.number().optional(),
	changedFiles: z.number().optional(),
});

export const GithubRelease = z.object({
	id: z.number(),
	nodeId: z.string(),
	url: z.string(),
	htmlUrl: z.string(),
	assetsUrl: z.string(),
	uploadUrl: z.string(),
	tarballUrl: z.string().nullable().optional(),
	zipballUrl: z.string().nullable().optional(),
	tagName: z.string(),
	targetCommitish: z.string(),
	name: z.string().nullable().optional(),
	body: z.string().nullable().optional(),
	draft: z.boolean().optional(),
	prerelease: z.boolean().optional(),
	createdAt: z.coerce.date().optional(),
	publishedAt: z.coerce.date().nullable().optional(),
	author: GithubUser.optional(),
});

export const GithubWorkflow = z.object({
	id: z.number(),
	nodeId: z.string(),
	name: z.string(),
	path: z.string(),
	state: z.enum([
		'active',
		'deleted',
		'disabled_fork',
		'disabled_inactivity',
		'disabled_manually',
	]),
	url: z.string(),
	htmlUrl: z.string(),
	badgeUrl: z.string(),
	createdAt: z.coerce.date().optional(),
	updatedAt: z.coerce.date().optional(),
	deletedAt: z.coerce.date().nullable().optional(),
});

export type GithubUser = z.infer<typeof GithubUser>;
export type GithubRepository = z.infer<typeof GithubRepository>;
export type GithubIssue = z.infer<typeof GithubIssue>;
export type GithubPullRequest = z.infer<typeof GithubPullRequest>;
export type GithubRelease = z.infer<typeof GithubRelease>;
export type GithubWorkflow = z.infer<typeof GithubWorkflow>;
