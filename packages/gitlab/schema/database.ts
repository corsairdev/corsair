import { z } from 'zod';

export const GitlabUser = z
	.object({
		id: z.number(),
		username: z.string(),
		name: z.string().nullable().optional(),
		state: z.string().optional(),
		avatar_url: z.string().nullable().optional(),
		web_url: z.string().optional(),
		email: z.string().nullable().optional(),
		bio: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		created_at: z.string().optional(),
		is_admin: z.boolean().optional(),
		bot: z.boolean().optional(),
	})
	.passthrough();

export const GitlabProject = z
	.object({
		id: z.number(),
		name: z.string(),
		path: z.string().optional(),
		path_with_namespace: z.string().optional(),
		description: z.string().nullable().optional(),
		default_branch: z.string().nullable().optional(),
		visibility: z.string().optional(),
		ssh_url_to_repo: z.string().optional(),
		http_url_to_repo: z.string().optional(),
		web_url: z.string().optional(),
		archived: z.boolean().optional(),
		created_at: z.string().optional(),
		last_activity_at: z.string().optional(),
		creator_id: z.number().optional(),
		namespace_id: z.number().nullable().optional(),
		star_count: z.number().optional(),
		forks_count: z.number().optional(),
		open_issues_count: z.number().optional(),
		topics: z.array(z.string()).optional(),
	})
	.passthrough();

export const GitlabIssue = z
	.object({
		id: z.number(),
		iid: z.number(),
		project_id: z.number(),
		title: z.string(),
		description: z.string().nullable().optional(),
		state: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		closed_at: z.string().nullable().optional(),
		labels: z.array(z.string()).optional(),
		milestone_id: z.number().nullable().optional(),
		author_id: z.number().nullable().optional(),
		assignee_id: z.number().nullable().optional(),
		web_url: z.string().optional(),
		confidential: z.boolean().optional(),
		due_date: z.string().nullable().optional(),
	})
	.passthrough();

export const GitlabMergeRequest = z
	.object({
		id: z.number(),
		iid: z.number(),
		project_id: z.number(),
		title: z.string(),
		description: z.string().nullable().optional(),
		state: z.string().optional(),
		source_branch: z.string().optional(),
		target_branch: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		merged_at: z.string().nullable().optional(),
		closed_at: z.string().nullable().optional(),
		merge_commit_sha: z.string().nullable().optional(),
		sha: z.string().optional(),
		author_id: z.number().nullable().optional(),
		assignee_id: z.number().nullable().optional(),
		web_url: z.string().optional(),
		labels: z.array(z.string()).optional(),
		has_conflicts: z.boolean().optional(),
		draft: z.boolean().optional(),
	})
	.passthrough();

export const GitlabPipeline = z
	.object({
		id: z.number(),
		iid: z.number().optional(),
		project_id: z.number(),
		status: z.string().optional(),
		source: z.string().optional(),
		ref: z.string().optional(),
		sha: z.string().optional(),
		web_url: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		started_at: z.string().nullable().optional(),
		finished_at: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
	})
	.passthrough();

export const GitlabGroup = z
	.object({
		id: z.number(),
		name: z.string(),
		path: z.string().optional(),
		full_path: z.string().optional(),
		description: z.string().nullable().optional(),
		visibility: z.string().optional(),
		parent_id: z.number().nullable().optional(),
		web_url: z.string().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

export const GitlabBranch = z
	.object({
		name: z.string(),
		merged: z.boolean().optional(),
		protected: z.boolean().optional(),
		default: z.boolean().optional(),
		developers_can_push: z.boolean().optional(),
		developers_can_merge: z.boolean().optional(),
		can_push: z.boolean().optional(),
		web_url: z.string().optional(),
	})
	.passthrough();

export const GitlabCommit = z
	.object({
		id: z.string(),
		short_id: z.string().optional(),
		title: z.string().optional(),
		message: z.string().optional(),
		author_name: z.string().optional(),
		author_email: z.string().optional(),
		authored_date: z.string().optional(),
		committed_date: z.string().optional(),
		committer_name: z.string().optional(),
		committer_email: z.string().optional(),
		parent_ids: z.array(z.string()).optional(),
		web_url: z.string().optional(),
	})
	.passthrough();

export const GitlabLabel = z
	.object({
		id: z.number(),
		name: z.string(),
		color: z.string().optional(),
		text_color: z.string().optional(),
		description: z.string().nullable().optional(),
		open_issues_count: z.number().optional(),
		closed_issues_count: z.number().optional(),
		subscribed: z.boolean().optional(),
		is_project_label: z.boolean().optional(),
	})
	.passthrough();

export const GitlabMilestone = z
	.object({
		id: z.number(),
		iid: z.number().optional(),
		project_id: z.number().optional(),
		title: z.string(),
		description: z.string().nullable().optional(),
		state: z.string().optional(),
		due_date: z.string().nullable().optional(),
		start_date: z.string().nullable().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		web_url: z.string().optional(),
	})
	.passthrough();

export const GitlabRelease = z
	.object({
		tag_name: z.string(),
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		created_at: z.string().optional(),
		released_at: z.string().optional(),
		upcoming_release: z.boolean().optional(),
	})
	.passthrough();

export type GitlabUser = z.infer<typeof GitlabUser>;
export type GitlabProject = z.infer<typeof GitlabProject>;
export type GitlabIssue = z.infer<typeof GitlabIssue>;
export type GitlabMergeRequest = z.infer<typeof GitlabMergeRequest>;
export type GitlabPipeline = z.infer<typeof GitlabPipeline>;
export type GitlabGroup = z.infer<typeof GitlabGroup>;
export type GitlabBranch = z.infer<typeof GitlabBranch>;
export type GitlabCommit = z.infer<typeof GitlabCommit>;
export type GitlabLabel = z.infer<typeof GitlabLabel>;
export type GitlabMilestone = z.infer<typeof GitlabMilestone>;
export type GitlabRelease = z.infer<typeof GitlabRelease>;
