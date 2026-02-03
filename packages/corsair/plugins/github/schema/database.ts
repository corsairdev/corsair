import { z } from 'zod';

export const GithubUser = z.object({
	id: z.number(),
	login: z.string(),
	nodeId: z.string().optional(),
	avatarUrl: z.string().optional(),
	gravatarId: z.string().nullable(),
	url: z.string().optional(),
	htmlUrl: z.string().optional(),
	type: z.string(),
	siteAdmin: z.boolean(),
	name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	createdAt: z.any().optional(),
	updatedAt: z.any().optional(),
});

export const GithubRepository = z.object({
	id: z.number(),
	nodeId: z.string().optional(),
	name: z.string(),
	fullName: z.string().optional(),
	private: z.boolean(),
	htmlUrl: z.string().optional(),
	description: z.string().nullable().optional(),
	fork: z.boolean(),
	url: z.string().optional(),
	createdAt: z.any().optional(),
	updatedAt: z.any().optional(),
	pushedAt: z.coerce.date().nullable().optional(),
	defaultBranch: z.string().optional(),
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
	nodeId: z.string().optional(),
	url: z.string().optional(),
	repositoryUrl: z.string().optional(),
	labelsUrl: z.string().optional(),
	commentsUrl: z.string().optional(),
	eventsUrl: z.string().optional(),
	htmlUrl: z.string().optional(),
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
	createdAt: z.any().optional(),
	updatedAt: z.any().optional(),
	closedAt: z.any().optional(),
});

export const GithubPullRequest = z.object({
	id: z.number(),
	nodeId: z.string().optional(),
	url: z.string().optional(),
	htmlUrl: z.string().optional(),
	diffUrl: z.string().optional(),
	patchUrl: z.string().optional(),
	issueUrl: z.string().optional(),
	number: z.number(),
	state: z.enum(['open', 'closed']),
	locked: z.boolean().optional(),
	title: z.string(),
	user: GithubUser.optional(),
	body: z.string().nullable().optional(),
	createdAt: z.any().optional(),
	updatedAt: z.any().optional(),
	closedAt: z.any().optional(),
	mergedAt: z.any().optional(),
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
	nodeId: z.string().optional(),
	url: z.string().optional(),
	htmlUrl: z.string().optional(),
	assetsUrl: z.string().optional(),
	uploadUrl: z.string().optional(),
	tarballUrl: z.string().nullable().optional(),
	zipballUrl: z.string().nullable().optional(),
	tagName: z.string().optional(),
	targetCommitish: z.string().optional(),
	name: z.string().nullable().optional(),
	body: z.string().nullable().optional(),
	draft: z.boolean().optional(),
	prerelease: z.boolean().optional(),
	createdAt: z.any().optional(),
	publishedAt: z.coerce.date().nullable().optional(),
	author: GithubUser.optional(),
});

export const GithubWorkflow = z.object({
	id: z.number(),
	nodeId: z.string().optional(),
	name: z.string(),
	path: z.string(),
	state: z.enum([
		'active',
		'deleted',
		'disabled_fork',
		'disabled_inactivity',
		'disabled_manually',
	]),
	url: z.string().optional(),
	htmlUrl: z.string().optional(),
	badgeUrl: z.string().optional(),
	createdAt: z.any().optional(),
	updatedAt: z.any().optional(),
	deletedAt: z.any().optional(),
});

export type GithubUser = z.infer<typeof GithubUser>;
export type GithubRepository = z.infer<typeof GithubRepository>;
export type GithubIssue = z.infer<typeof GithubIssue>;
export type GithubPullRequest = z.infer<typeof GithubPullRequest>;
export type GithubRelease = z.infer<typeof GithubRelease>;
export type GithubWorkflow = z.infer<typeof GithubWorkflow>;
