import { z } from 'zod';
import { B, Id, N, NumId, Obj, S, UnknownArray } from './primitives';

/**
 * Field names match official JSON keys.
 * https://developer.atlassian.com/cloud/bitbucket/swagger.v3.json
 * Live extras on repository/workspace confirmed against GET /2.0 public objects.
 *
 * Source blobs, comments, email addresses, and pipeline-variable values are
 * not persisted.
 */

export const BitbucketLinks = z
	.record(z.string(), z.unknown())
	.nullable()
	.optional();

export const BitbucketAccount = z.object({
	type: S,
	uuid: S,
	display_name: S,
	nickname: S,
	username: S,
	account_id: S,
	account_status: S,
	created_on: S,
	has_2fa_enabled: B,
	is_staff: B,
	links: BitbucketLinks,
});
export type BitbucketAccount = z.infer<typeof BitbucketAccount>;

export const BitbucketRendered = z.object({
	raw: S,
	markup: S,
	html: S,
});
export type BitbucketRendered = z.infer<typeof BitbucketRendered>;

export const BitbucketBranchTarget = z.object({
	hash: S,
	type: S,
});
export type BitbucketBranchTarget = z.infer<typeof BitbucketBranchTarget>;

export const BitbucketWorkspaceEntity = z.object({
	uuid: Id,
	type: S,
	name: S,
	slug: S,
	is_private: B,
	is_personal: B,
	is_privacy_enforced: B,
	forking_mode: S,
	sign_system_commits: B,
	created_on: S,
	updated_on: S,
	links: BitbucketLinks,
});
export type BitbucketWorkspaceEntity = z.infer<typeof BitbucketWorkspaceEntity>;

export const BitbucketUserEntity = z.object({
	uuid: Id,
	type: S,
	display_name: S,
	nickname: S,
	username: S,
	account_id: S,
	account_status: S,
	created_on: S,
	has_2fa_enabled: B,
	is_staff: B,
	links: BitbucketLinks,
});
export type BitbucketUserEntity = z.infer<typeof BitbucketUserEntity>;

export const BitbucketProjectEntity = z.object({
	uuid: Id,
	type: S,
	key: S,
	name: S,
	description: S,
	is_private: B,
	created_on: S,
	updated_on: S,
	has_publicly_visible_repos: B,
	owner: BitbucketAccount.nullable().optional(),
	links: BitbucketLinks,
});
export type BitbucketProjectEntity = z.infer<typeof BitbucketProjectEntity>;

export const BitbucketRepositoryEntity = z.object({
	uuid: Id,
	type: S,
	name: S,
	full_name: S,
	slug: S,
	description: S,
	scm: S,
	website: S,
	language: S,
	size: N,
	is_private: B,
	has_issues: B,
	has_wiki: B,
	fork_policy: S,
	enforced_signed_commits: B,
	created_on: S,
	updated_on: S,
	owner: BitbucketAccount.nullable().optional(),
	workspace: BitbucketWorkspaceEntity.nullable().optional(),
	project: BitbucketProjectEntity.nullable().optional(),
	parent: z
		.object({
			uuid: S,
			type: S,
			name: S,
			full_name: S,
			slug: S,
		})
		.nullable()
		.optional(),
	mainbranch: z
		.object({
			type: S,
			name: S,
		})
		.nullable()
		.optional(),
	override_settings: Obj,
	links: BitbucketLinks,
});
export type BitbucketRepositoryEntity = z.infer<
	typeof BitbucketRepositoryEntity
>;

export const BitbucketPullRequestEndpoint = z.object({
	repository: BitbucketRepositoryEntity.nullable().optional(),
	branch: z
		.object({
			name: S,
		})
		.nullable()
		.optional(),
	commit: z
		.object({
			hash: S,
		})
		.nullable()
		.optional(),
});
export type BitbucketPullRequestEndpoint = z.infer<
	typeof BitbucketPullRequestEndpoint
>;

export const BitbucketPullRequestEntity = z.object({
	id: NumId,
	type: S,
	title: S,
	state: S,
	draft: B,
	queued: B,
	reason: S,
	comment_count: N,
	task_count: N,
	close_source_branch: B,
	created_on: S,
	updated_on: S,
	author: BitbucketAccount.nullable().optional(),
	closed_by: BitbucketAccount.nullable().optional(),
	source: BitbucketPullRequestEndpoint.nullable().optional(),
	destination: BitbucketPullRequestEndpoint.nullable().optional(),
	merge_commit: z
		.object({
			hash: S,
		})
		.nullable()
		.optional(),
	reviewers: UnknownArray,
	participants: UnknownArray,
	summary: BitbucketRendered.nullable().optional(),
	rendered: Obj,
	links: BitbucketLinks,
});
export type BitbucketPullRequestEntity = z.infer<
	typeof BitbucketPullRequestEntity
>;

export const BitbucketIssueEntity = z.object({
	id: NumId,
	type: S,
	title: S,
	state: S,
	kind: S,
	priority: S,
	votes: N,
	created_on: S,
	updated_on: S,
	edited_on: S,
	reporter: BitbucketAccount.nullable().optional(),
	assignee: BitbucketAccount.nullable().optional(),
	repository: BitbucketRepositoryEntity.nullable().optional(),
	milestone: Obj,
	version: Obj,
	component: Obj,
	content: BitbucketRendered.nullable().optional(),
	links: BitbucketLinks,
});
export type BitbucketIssueEntity = z.infer<typeof BitbucketIssueEntity>;

export const BitbucketSnippetEntity = z.object({
	id: NumId,
	type: S,
	title: S,
	scm: S,
	is_private: B,
	created_on: S,
	updated_on: S,
	owner: BitbucketAccount.nullable().optional(),
	creator: BitbucketAccount.nullable().optional(),
});
export type BitbucketSnippetEntity = z.infer<typeof BitbucketSnippetEntity>;

export const BitbucketPipelineEntity = z.object({
	uuid: Id,
	type: S,
	build_number: N,
	created_on: S,
	completed_on: S,
	build_seconds_used: N,
	creator: BitbucketAccount.nullable().optional(),
	repository: BitbucketRepositoryEntity.nullable().optional(),
	target: Obj,
	trigger: Obj,
	state: Obj,
	configuration_sources: UnknownArray,
	links: BitbucketLinks,
});
export type BitbucketPipelineEntity = z.infer<typeof BitbucketPipelineEntity>;

/** Commit author/committer/tagger without `raw` (that field embeds email). */
export const BitbucketCommitAuthor = z.object({
	type: S,
	user: BitbucketAccount.nullable().optional(),
});
export type BitbucketCommitAuthor = z.infer<typeof BitbucketCommitAuthor>;

export const BitbucketCommitEntity = z.object({
	hash: Id,
	type: S,
	date: S,
	message: S,
	author: BitbucketCommitAuthor.nullable().optional(),
	committer: BitbucketCommitAuthor.nullable().optional(),
	summary: BitbucketRendered.nullable().optional(),
	rendered: Obj,
	parents: UnknownArray,
	repository: BitbucketRepositoryEntity.nullable().optional(),
	participants: UnknownArray,
	links: BitbucketLinks,
});
export type BitbucketCommitEntity = z.infer<typeof BitbucketCommitEntity>;

export const BitbucketBranchEntity = z.object({
	name: Id,
	type: S,
	target: BitbucketCommitEntity.nullable().optional(),
	merge_strategies: z.array(z.string()).nullable().optional(),
	sync_strategies: UnknownArray,
	default_merge_strategy: S,
	links: BitbucketLinks,
});
export type BitbucketBranchEntity = z.infer<typeof BitbucketBranchEntity>;

export const BitbucketTagEntity = z.object({
	name: Id,
	type: S,
	message: S,
	date: S,
	target: BitbucketCommitEntity.nullable().optional(),
	tagger: BitbucketCommitAuthor.nullable().optional(),
	links: BitbucketLinks,
});
export type BitbucketTagEntity = z.infer<typeof BitbucketTagEntity>;
