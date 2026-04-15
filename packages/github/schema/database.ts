import { z } from 'zod';

export const GithubUser = z.object({
	id: z.number(),
	login: z.string(),
	nodeId: z.string().optional(),
	avatarUrl: z.string().optional(),
	gravatarId: z.string().nullable().optional(),
	url: z.string().optional(),
	htmlUrl: z.string().optional(),
	type: z.string().optional(),
	siteAdmin: z.boolean().optional(),
	name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const GithubRepository = z.object({
	id: z.number(),
	nodeId: z.string().optional(),
	name: z.string(),
	fullName: z.string().optional(),
	private: z.boolean().optional(),
	htmlUrl: z.string().optional(),
	description: z.string().nullable().optional(),
	fork: z.boolean().optional(),
	url: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
	pushedAt: z.coerce.date().nullable().optional(),
	defaultBranch: z.string().optional(),
	language: z.string().nullable().optional(),
	stargazersCount: z.number().optional(),
	watchersCount: z.number().optional(),
	forksCount: z.number().optional(),
	openIssuesCount: z.number().optional(),
	archived: z.boolean().optional(),
	disabled: z.boolean().optional(),
	deletedAt: z.coerce.date().nullable().optional(),
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
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
	closedAt: z.coerce.date().nullable().optional(),
	deletedAt: z.coerce.date().nullable().optional(),
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
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
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
	createdAt: z.coerce.date().nullable().optional(),
	publishedAt: z.coerce.date().nullable().optional(),
	author: GithubUser.optional(),
	deletedAt: z.coerce.date().nullable().optional(),
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
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
	deletedAt: z.coerce.date().nullable().optional(),
});

export const GithubDiscussion = z.object({
	id: z.number(),
	nodeId: z.string().optional(),
	htmlUrl: z.string().optional(),
	repositoryUrl: z.string().optional(),
	number: z.number(),
	title: z.string(),
	body: z.string().nullable().optional(),
	state: z.string().optional(),
	locked: z.boolean().optional(),
	comments: z.number().optional(),
	authorAssociation: z.string().optional(),
	categoryId: z.number().optional(),
	categoryName: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
	answerChosenAt: z.coerce.date().nullable().optional(),
	deletedAt: z.coerce.date().nullable().optional(),
});

export const GithubComment = z.object({
	id: z.number(),
	nodeId: z.string().optional(),
	url: z.string().optional(),
	htmlUrl: z.string().optional(),
	issueUrl: z.string().optional(),
	body: z.string().optional(),
	authorAssociation: z.string().optional(),
	user: GithubUser.nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
	deletedAt: z.coerce.date().nullable().optional(),
});

// Branches use a composite entity ID: `{repositoryId}:{branchName}`
export const GithubBranch = z.object({
	repositoryId: z.number(),
	repositoryFullName: z.string().optional(),
	name: z.string(),
	sha: z.string().optional(),
	protected: z.boolean().optional(),
	deletedAt: z.coerce.date().nullable().optional(),
});

// Forks use the forked repo's ID as the entity ID
export const GithubFork = z.object({
	id: z.number(),
	nodeId: z.string().optional(),
	fullName: z.string(),
	htmlUrl: z.string().optional(),
	description: z.string().nullable().optional(),
	private: z.boolean().optional(),
	fork: z.boolean().optional(),
	url: z.string().optional(),
	sourceRepoId: z.number(),
	sourceRepoFullName: z.string(),
	defaultBranch: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
	pushedAt: z.coerce.date().nullable().optional(),
});

export type GithubUser = z.infer<typeof GithubUser>;
export type GithubRepository = z.infer<typeof GithubRepository>;
export type GithubIssue = z.infer<typeof GithubIssue>;
export type GithubPullRequest = z.infer<typeof GithubPullRequest>;
export type GithubRelease = z.infer<typeof GithubRelease>;
export type GithubWorkflow = z.infer<typeof GithubWorkflow>;
export type GithubDiscussion = z.infer<typeof GithubDiscussion>;
export type GithubBranch = z.infer<typeof GithubBranch>;
export type GithubFork = z.infer<typeof GithubFork>;
export type GithubComment = z.infer<typeof GithubComment>;
