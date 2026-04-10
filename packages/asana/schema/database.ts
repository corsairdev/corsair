import { z } from 'zod';

const UserCompactSchema = z.object({
	gid: z.string(),
	name: z.string().optional(),
	resource_type: z.string().optional(),
});

const ProjectCompactSchema = z.object({
	gid: z.string(),
	name: z.string().optional(),
	resource_type: z.string().optional(),
});

const TeamCompactSchema = z.object({
	gid: z.string(),
	name: z.string().optional(),
	resource_type: z.string().optional(),
});

const SectionCompactSchema = z.object({
	gid: z.string(),
	name: z.string().optional(),
	resource_type: z.string().optional(),
});

const WorkspaceCompactSchema = z.object({
	gid: z.string(),
	name: z.string().optional(),
	resource_type: z.string().optional(),
});

const TagCompactSchema = z.object({
	gid: z.string(),
	name: z.string().optional(),
	resource_type: z.string().optional(),
});

const TaskCompactSchema = z.object({
	gid: z.string(),
	name: z.string().optional(),
	resource_type: z.string().optional(),
});

export const AsanaTask = z.object({
	gid: z.string(),
	name: z.string().optional(),
	notes: z.string().optional(),
	html_notes: z.string().optional(),
	completed: z.boolean().optional(),
	due_on: z.string().nullable().optional(),
	due_at: z.string().nullable().optional(),
	start_on: z.string().nullable().optional(),
	start_at: z.string().nullable().optional(),
	assignee: UserCompactSchema.nullable().optional(),
	assignee_status: z.string().optional(),
	assignee_section: SectionCompactSchema.nullable().optional(),
	workspace: WorkspaceCompactSchema.nullable().optional(),
	projects: z.array(ProjectCompactSchema).optional(),
	tags: z.array(TagCompactSchema).optional(),
	followers: z.array(UserCompactSchema).optional(),
	parent: TaskCompactSchema.nullable().optional(),
	resource_type: z.string().optional(),
	resource_subtype: z.string().optional(),
	created_at: z.string().optional(),
	modified_at: z.string().optional(),
	completed_at: z.string().nullable().optional(),
	liked: z.boolean().optional(),
	num_likes: z.number().optional(),
	num_subtasks: z.number().optional(),
	permalink_url: z.string().optional(),
	approval_status: z.string().optional(),
	// any/unknown for custom_fields since they vary per workspace
	custom_fields: z.array(z.record(z.unknown())).optional(),
});

export const AsanaProject = z.object({
	gid: z.string(),
	name: z.string().optional(),
	notes: z.string().optional(),
	html_notes: z.string().optional(),
	color: z.string().nullable().optional(),
	archived: z.boolean().optional(),
	completed: z.boolean().optional(),
	due_on: z.string().nullable().optional(),
	start_on: z.string().nullable().optional(),
	owner: UserCompactSchema.nullable().optional(),
	team: TeamCompactSchema.nullable().optional(),
	workspace: WorkspaceCompactSchema.nullable().optional(),
	members: z.array(UserCompactSchema).optional(),
	followers: z.array(UserCompactSchema).optional(),
	public: z.boolean().optional(),
	resource_type: z.string().optional(),
	created_at: z.string().optional(),
	modified_at: z.string().optional(),
	permalink_url: z.string().optional(),
	default_view: z.string().optional(),
	privacy_setting: z.string().optional(),
	icon: z.string().nullable().optional(),
	// any/unknown for custom_fields since they vary per workspace
	custom_fields: z.array(z.record(z.unknown())).optional(),
});

export const AsanaSection = z.object({
	gid: z.string(),
	name: z.string().optional(),
	resource_type: z.string().optional(),
	created_at: z.string().optional(),
	project: ProjectCompactSchema.nullable().optional(),
	projects: z.array(ProjectCompactSchema).optional(),
});

export const AsanaUser = z.object({
	gid: z.string(),
	name: z.string().optional(),
	email: z.string().optional(),
	resource_type: z.string().optional(),
	photo: z.record(z.string()).nullable().optional(),
	workspaces: z.array(WorkspaceCompactSchema).optional(),
});

export const AsanaTeam = z.object({
	gid: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	html_description: z.string().optional(),
	visibility: z.string().optional(),
	permalink_url: z.string().optional(),
	resource_type: z.string().optional(),
	organization: WorkspaceCompactSchema.nullable().optional(),
});

export const AsanaTag = z.object({
	gid: z.string(),
	name: z.string().optional(),
	color: z.string().nullable().optional(),
	notes: z.string().optional(),
	resource_type: z.string().optional(),
	created_at: z.string().optional(),
	workspace: WorkspaceCompactSchema.nullable().optional(),
	followers: z.array(UserCompactSchema).optional(),
	permalink_url: z.string().optional(),
});

export const AsanaStory = z.object({
	gid: z.string(),
	text: z.string().optional(),
	html_text: z.string().optional(),
	type: z.string().optional(),
	resource_type: z.string().optional(),
	resource_subtype: z.string().optional(),
	created_at: z.string().optional(),
	created_by: UserCompactSchema.nullable().optional(),
	liked: z.boolean().optional(),
	num_likes: z.number().optional(),
	is_edited: z.boolean().optional(),
	is_pinned: z.boolean().optional(),
	target: z
		.object({ gid: z.string(), name: z.string().optional() })
		.nullable()
		.optional(),
});

export type AsanaTask = z.infer<typeof AsanaTask>;
export type AsanaProject = z.infer<typeof AsanaProject>;
export type AsanaSection = z.infer<typeof AsanaSection>;
export type AsanaUser = z.infer<typeof AsanaUser>;
export type AsanaTeam = z.infer<typeof AsanaTeam>;
export type AsanaTag = z.infer<typeof AsanaTag>;
export type AsanaStory = z.infer<typeof AsanaStory>;
