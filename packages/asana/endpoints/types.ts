import { z } from 'zod';

// ── Shared Sub-Schemas ────────────────────────────────────────────────────────

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

const TagCompactSchema = z.object({
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

const NextPageSchema = z
	.object({
		offset: z.string().optional(),
		path: z.string().optional(),
		uri: z.string().optional(),
	})
	.nullable()
	.optional();

const TaskCompactSchema = z.object({
	gid: z.string(),
	name: z.string().optional(),
	resource_type: z.string().optional(),
});

const TaskFullSchema = z.object({
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
	permalink_url: z.string().optional(),
	num_subtasks: z.number().optional(),
	approval_status: z.string().optional(),
	// any/unknown for custom_fields since they vary per workspace
	custom_fields: z.array(z.record(z.unknown())).optional(),
});

const ProjectFullSchema = z.object({
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

const SectionFullSchema = z.object({
	gid: z.string(),
	name: z.string().optional(),
	resource_type: z.string().optional(),
	created_at: z.string().optional(),
	project: ProjectCompactSchema.nullable().optional(),
	projects: z.array(ProjectCompactSchema).optional(),
});

const UserFullSchema = z.object({
	gid: z.string(),
	name: z.string().optional(),
	email: z.string().optional(),
	resource_type: z.string().optional(),
	photo: z.record(z.string()).nullable().optional(),
	workspaces: z.array(WorkspaceCompactSchema).optional(),
});

const TeamFullSchema = z.object({
	gid: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	html_description: z.string().optional(),
	visibility: z.string().optional(),
	permalink_url: z.string().optional(),
	resource_type: z.string().optional(),
	organization: WorkspaceCompactSchema.nullable().optional(),
});

const TagFullSchema = z.object({
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

const StoryFullSchema = z.object({
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

const TeamMembershipSchema = z.object({
	gid: z.string(),
	resource_type: z.string().optional(),
	is_admin: z.boolean().optional(),
	is_guest: z.boolean().optional(),
	is_limited_access: z.boolean().optional(),
	team: TeamCompactSchema.optional(),
	user: UserCompactSchema.optional(),
});

const WorkspaceMembershipSchema = z.object({
	gid: z.string(),
	resource_type: z.string().optional(),
	is_active: z.boolean().optional(),
	is_admin: z.boolean().optional(),
	is_guest: z.boolean().optional(),
	workspace: WorkspaceCompactSchema.optional(),
	user: UserCompactSchema.optional(),
	user_task_list: z
		.object({ gid: z.string(), name: z.string().optional() })
		.optional(),
});

const WebhookFullSchema = z.object({
	gid: z.string(),
	resource_type: z.string().optional(),
	active: z.boolean().optional(),
	created_at: z.string().optional(),
	target: z.string().optional(),
	resource: z
		.object({ gid: z.string(), name: z.string().optional() })
		.optional(),
	filters: z
		.array(
			z.object({
				resource_type: z.string().optional(),
				resource_subtype: z.string().optional(),
				action: z.string().optional(),
				fields: z.array(z.string()).optional(),
			}),
		)
		.optional(),
});

const JobSchema = z.object({
	gid: z.string(),
	resource_type: z.string().optional(),
	status: z.string().optional(),
	new_project: ProjectCompactSchema.optional(),
	new_task: TaskCompactSchema.optional(),
});

const UserTaskListSchema = z.object({
	gid: z.string(),
	name: z.string().optional(),
	resource_type: z.string().optional(),
	owner: UserCompactSchema.optional(),
	workspace: WorkspaceCompactSchema.optional(),
});

// ── Task Input Schemas ────────────────────────────────────────────────────────

const TasksGetInputSchema = z.object({
	task_gid: z.string(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TasksListInputSchema = z.object({
	assignee: z.string().optional(),
	project: z.string().optional(),
	section: z.string().optional(),
	workspace: z.string().optional(),
	tag: z.string().optional(),
	user_task_list: z.string().optional(),
	completed_since: z.string().optional(),
	modified_since: z.string().optional(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TasksCreateInputSchema = z.object({
	data: z.object({
		name: z.string().optional(),
		notes: z.string().optional(),
		html_notes: z.string().optional(),
		due_on: z.string().optional(),
		due_at: z.string().optional(),
		start_on: z.string().optional(),
		start_at: z.string().optional(),
		assignee: z.string().optional(),
		projects: z.array(z.string()).optional(),
		tags: z.array(z.string()).optional(),
		followers: z.array(z.string()).optional(),
		workspace: z.string().optional(),
		parent: z.string().optional(),
		completed: z.boolean().optional(),
		liked: z.boolean().optional(),
		resource_subtype: z.string().optional(),
		// any/unknown for custom_fields since they vary per workspace
		custom_fields: z.record(z.unknown()).optional(),
		assignee_section: z.string().optional(),
	}),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TasksUpdateInputSchema = z.object({
	task_gid: z.string(),
	data: z.object({
		name: z.string().optional(),
		notes: z.string().optional(),
		html_notes: z.string().optional(),
		due_on: z.string().optional(),
		due_at: z.string().optional(),
		start_on: z.string().optional(),
		start_at: z.string().optional(),
		assignee: z.string().optional(),
		completed: z.boolean().optional(),
		liked: z.boolean().optional(),
		resource_subtype: z.string().optional(),
		approval_status: z.string().optional(),
		assignee_status: z.string().optional(),
		assignee_section: z.string().optional(),
		workspace: z.string().optional(),
		// any/unknown for custom_fields since they vary per workspace
		custom_fields: z.record(z.unknown()).optional(),
	}),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TasksDeleteInputSchema = z.object({
	task_gid: z.string(),
	opt_pretty: z.boolean().optional(),
});

const TasksDuplicateInputSchema = z.object({
	task_gid: z.string(),
	data: z
		.object({
			name: z.string().optional(),
			include: z.string().optional(),
		})
		.optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TasksSearchInputSchema = z.object({
	workspace_gid: z.string(),
	text: z.string().optional(),
	resource_subtype: z.string().optional(),
	assignee: z.string().optional(),
	project: z.string().optional(),
	section: z.string().optional(),
	tag: z.string().optional(),
	team: z.string().optional(),
	completed: z.boolean().optional(),
	is_subtask: z.boolean().optional(),
	has_attachment: z.boolean().optional(),
	is_blocked: z.boolean().optional(),
	is_blocking: z.boolean().optional(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
});

const TasksAddFollowersInputSchema = z.object({
	task_gid: z.string(),
	followers: z.array(z.string()),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TasksRemoveFollowerInputSchema = z.object({
	task_gid: z.string(),
	followers: z.array(z.string()),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TasksAddProjectInputSchema = z.object({
	task_gid: z.string(),
	project: z.string(),
	section: z.string().optional(),
	insert_after: z.string().optional(),
	insert_before: z.string().optional(),
	opt_pretty: z.boolean().optional(),
});

const TasksRemoveProjectInputSchema = z.object({
	task_gid: z.string(),
	project: z.string(),
	opt_pretty: z.boolean().optional(),
});

const TasksAddTagInputSchema = z.object({
	task_gid: z.string(),
	tag: z.string(),
	opt_pretty: z.boolean().optional(),
});

const TasksRemoveTagInputSchema = z.object({
	task_gid: z.string(),
	tag: z.string(),
	opt_pretty: z.boolean().optional(),
});

const TasksAddDependenciesInputSchema = z.object({
	task_gid: z.string(),
	dependencies: z.array(z.string()),
	opt_pretty: z.boolean().optional(),
});

const TasksCreateSubtaskInputSchema = z.object({
	task_gid: z.string(),
	data: z.object({
		name: z.string().optional(),
		notes: z.string().optional(),
		assignee: z.string().optional(),
		due_on: z.string().optional(),
		due_at: z.string().optional(),
		completed: z.boolean().optional(),
	}),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TasksGetSubtasksInputSchema = z.object({
	task_gid: z.string(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TasksSetParentInputSchema = z.object({
	task_gid: z.string(),
	parent: z.string().nullable(),
	insert_after: z.string().optional(),
	insert_before: z.string().optional(),
	opt_pretty: z.boolean().optional(),
});

const TasksGetStoriesInputSchema = z.object({
	task_gid: z.string(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
});

const TasksGetAttachmentsInputSchema = z.object({
	task_gid: z.string(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
});

const TasksGetTagsInputSchema = z.object({
	task_gid: z.string(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
});

const TasksAddToSectionInputSchema = z.object({
	section_gid: z.string(),
	task: z.string(),
	insert_before: z.string().optional(),
	insert_after: z.string().optional(),
	opt_pretty: z.boolean().optional(),
});

// ── Task Output Schemas ───────────────────────────────────────────────────────

const TasksGetResponseSchema = z.object({
	data: TaskFullSchema.optional(),
});

const TasksListResponseSchema = z.object({
	data: z.array(TaskFullSchema).optional(),
	next_page: NextPageSchema,
});

const TasksCreateResponseSchema = z.object({
	data: TaskFullSchema.optional(),
});

const TasksUpdateResponseSchema = z.object({
	data: TaskFullSchema.optional(),
});

const TasksDeleteResponseSchema = z.object({
	data: z.object({}).optional(),
});

const TasksDuplicateResponseSchema = z.object({
	data: JobSchema.optional(),
});

const TasksAddFollowersResponseSchema = z.object({
	data: TaskCompactSchema.optional(),
});

const TasksRemoveFollowerResponseSchema = z.object({
	data: TaskCompactSchema.optional(),
});

const TasksAddProjectResponseSchema = z.object({
	data: z.object({}).optional(),
});

const TasksRemoveProjectResponseSchema = z.object({
	data: z.object({}).optional(),
});

const TasksAddTagResponseSchema = z.object({
	data: z.object({}).optional(),
});

const TasksRemoveTagResponseSchema = z.object({
	data: z.object({}).optional(),
});

const TasksAddDependenciesResponseSchema = z.object({
	data: z.array(TaskCompactSchema).optional(),
});

const TasksCreateSubtaskResponseSchema = z.object({
	data: TaskFullSchema.optional(),
});

const TasksGetSubtasksResponseSchema = z.object({
	data: z.array(TaskFullSchema).optional(),
	next_page: NextPageSchema,
});

const TasksSetParentResponseSchema = z.object({
	data: TaskFullSchema.optional(),
});

const TasksGetStoriesResponseSchema = z.object({
	data: z.array(StoryFullSchema).optional(),
	next_page: NextPageSchema,
});

const AttachmentCompactSchema = z.object({
	gid: z.string(),
	name: z.string().optional(),
	resource_type: z.string().optional(),
});

const TasksGetAttachmentsResponseSchema = z.object({
	data: z.array(AttachmentCompactSchema).optional(),
	next_page: NextPageSchema,
});

const TasksGetTagsResponseSchema = z.object({
	data: z.array(TagFullSchema).optional(),
	next_page: NextPageSchema,
});

const TasksAddToSectionResponseSchema = z.object({
	data: z.object({}).optional(),
});

const TasksSearchResponseSchema = z.object({
	data: z.array(TaskFullSchema).optional(),
	next_page: NextPageSchema,
});

// ── Project Input Schemas ─────────────────────────────────────────────────────

const ProjectsGetInputSchema = z.object({
	project_gid: z.string(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const ProjectsListInputSchema = z.object({
	workspace: z.string().optional(),
	team: z.string().optional(),
	archived: z.boolean().optional(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const ProjectsCreateInputSchema = z.object({
	data: z.object({
		name: z.string().optional(),
		team: z.string().optional(),
		workspace: z.string().optional(),
		notes: z.string().optional(),
		html_notes: z.string().optional(),
		color: z.string().optional(),
		due_on: z.string().optional(),
		start_on: z.string().optional(),
		archived: z.boolean().optional(),
		followers: z.array(z.string()).optional(),
		owner: z.string().optional(),
		public: z.boolean().optional(),
		default_view: z.string().optional(),
		privacy_setting: z.string().optional(),
	}),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const ProjectsCreateForTeamInputSchema = z.object({
	team_gid: z.string(),
	data: z.object({
		name: z.string().optional(),
		notes: z.string().optional(),
		color: z.string().optional(),
		due_on: z.string().optional(),
		start_on: z.string().optional(),
		archived: z.boolean().optional(),
		followers: z.array(z.string()).optional(),
		owner: z.string().optional(),
		public: z.boolean().optional(),
		default_view: z.string().optional(),
	}),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const ProjectsCreateForWorkspaceInputSchema = z.object({
	workspace_gid: z.string(),
	data: z.object({
		name: z.string().optional(),
		team: z.string().optional(),
		notes: z.string().optional(),
		color: z.string().optional(),
		due_on: z.string().optional(),
		start_on: z.string().optional(),
		archived: z.boolean().optional(),
		followers: z.array(z.string()).optional(),
		owner: z.string().optional(),
		public: z.boolean().optional(),
		default_view: z.string().optional(),
	}),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const ProjectsUpdateInputSchema = z.object({
	project_gid: z.string(),
	data: z.object({
		name: z.string().optional(),
		notes: z.string().optional(),
		html_notes: z.string().optional(),
		color: z.string().optional(),
		due_on: z.string().optional(),
		start_on: z.string().optional(),
		archived: z.boolean().optional(),
		owner: z.string().optional(),
		public: z.boolean().optional(),
		default_view: z.string().optional(),
		privacy_setting: z.string().optional(),
	}),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const ProjectsDeleteInputSchema = z.object({
	project_gid: z.string(),
	opt_pretty: z.boolean().optional(),
});

const ProjectsDuplicateInputSchema = z.object({
	project_gid: z.string(),
	data: z.object({
		name: z.string(),
		team: z.string().optional(),
		include: z.string().optional(),
		schedule_dates: z
			.object({
				should_skip_weekends: z.boolean(),
				due_on: z.string().optional(),
				start_on: z.string().optional(),
			})
			.optional(),
	}),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const ProjectsAddFollowersInputSchema = z.object({
	project_gid: z.string(),
	followers: z.array(z.string()),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const ProjectsRemoveFollowersInputSchema = z.object({
	project_gid: z.string(),
	followers: z.array(z.string()),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const ProjectsAddMembersInputSchema = z.object({
	project_gid: z.string(),
	members: z.array(z.string()),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const ProjectsRemoveMembersInputSchema = z.object({
	project_gid: z.string(),
	members: z.array(z.string()),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const ProjectsGetTasksInputSchema = z.object({
	project_gid: z.string(),
	completed_since: z.string().optional(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const ProjectsGetTaskCountsInputSchema = z.object({
	project_gid: z.string(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const WorkspaceProjectsListInputSchema = z.object({
	workspace_gid: z.string(),
	archived: z.boolean().optional(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

// ── Project Output Schemas ────────────────────────────────────────────────────

const ProjectsGetResponseSchema = z.object({
	data: ProjectFullSchema.optional(),
});

const ProjectsListResponseSchema = z.object({
	data: z.array(ProjectFullSchema).optional(),
	next_page: NextPageSchema,
});

const ProjectsCreateResponseSchema = z.object({
	data: ProjectFullSchema.optional(),
});

const ProjectsUpdateResponseSchema = z.object({
	data: ProjectFullSchema.optional(),
});

const ProjectsDeleteResponseSchema = z.object({
	data: z.object({}).optional(),
});

const ProjectsDuplicateResponseSchema = z.object({
	data: JobSchema.optional(),
});

const ProjectsAddFollowersResponseSchema = z.object({
	data: z
		.object({
			gid: z.string(),
			name: z.string().optional(),
			followers: z.array(UserCompactSchema).optional(),
		})
		.optional(),
});

const ProjectsRemoveFollowersResponseSchema = z.object({
	data: z.object({ gid: z.string(), name: z.string().optional() }).optional(),
});

const ProjectsAddMembersResponseSchema = z.object({
	data: z
		.object({
			gid: z.string(),
			name: z.string().optional(),
			members: z.array(UserCompactSchema).optional(),
		})
		.optional(),
});

const ProjectsRemoveMembersResponseSchema = z.object({
	data: z.object({ gid: z.string(), name: z.string().optional() }).optional(),
});

const ProjectsGetTasksResponseSchema = z.object({
	data: z.array(TaskFullSchema).optional(),
	next_page: NextPageSchema,
});

const ProjectsGetTaskCountsResponseSchema = z.object({
	data: z
		.object({
			num_tasks: z.number().optional(),
			num_completed_tasks: z.number().optional(),
			num_incomplete_tasks: z.number().optional(),
			num_milestones: z.number().optional(),
			num_completed_milestones: z.number().optional(),
			num_incomplete_milestones: z.number().optional(),
		})
		.optional(),
});

// ── Section Input Schemas ─────────────────────────────────────────────────────

const SectionsGetInputSchema = z.object({
	section_gid: z.string(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const SectionsListInputSchema = z.object({
	project_gid: z.string(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const SectionsCreateInputSchema = z.object({
	project_gid: z.string(),
	data: z.object({
		name: z.string(),
		insert_before: z.string().optional(),
		insert_after: z.string().optional(),
	}),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const SectionsUpdateInputSchema = z.object({
	section_gid: z.string(),
	data: z.object({
		name: z.string().optional(),
	}),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const SectionsDeleteInputSchema = z.object({
	section_gid: z.string(),
	opt_pretty: z.boolean().optional(),
});

const SectionsInsertInputSchema = z.object({
	project_gid: z.string(),
	data: z.object({
		section: z.string(),
		before_section: z.string().optional(),
		after_section: z.string().optional(),
	}),
	opt_pretty: z.boolean().optional(),
});

// ── Section Output Schemas ────────────────────────────────────────────────────

const SectionsGetResponseSchema = z.object({
	data: SectionFullSchema.optional(),
});

const SectionsListResponseSchema = z.object({
	data: z.array(SectionFullSchema).optional(),
	next_page: NextPageSchema,
});

const SectionsCreateResponseSchema = z.object({
	data: SectionFullSchema.optional(),
});

const SectionsUpdateResponseSchema = z.object({
	data: SectionFullSchema.optional(),
});

const SectionsDeleteResponseSchema = z.object({
	data: z.object({}).optional(),
});

const SectionsInsertResponseSchema = z.object({
	data: z.object({}).optional(),
});

// ── User Input Schemas ────────────────────────────────────────────────────────

const UsersGetInputSchema = z.object({
	user_gid: z.string(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const UsersListInputSchema = z.object({
	workspace: z.string().optional(),
	team: z.string().optional(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const UsersGetCurrentInputSchema = z.object({
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const UsersListForWorkspaceInputSchema = z.object({
	workspace_gid: z.string(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const UsersListForTeamInputSchema = z.object({
	team_gid: z.string(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const UsersGetTaskListInputSchema = z.object({
	user_gid: z.string(),
	workspace: z.string(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const UsersGetUserTaskListInputSchema = z.object({
	user_task_list_gid: z.string(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const UsersGetFavoritesInputSchema = z.object({
	user_gid: z.string(),
	resource_type: z.string(),
	workspace: z.string(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

// ── User Output Schemas ───────────────────────────────────────────────────────

const UsersGetResponseSchema = z.object({
	data: UserFullSchema.optional(),
});

const UsersListResponseSchema = z.object({
	data: z.array(UserFullSchema).optional(),
	next_page: NextPageSchema,
});

const UsersGetTaskListResponseSchema = z.object({
	data: UserTaskListSchema.optional(),
});

const UsersGetUserTaskListResponseSchema = z.object({
	data: UserTaskListSchema.optional(),
});

const UsersGetFavoritesResponseSchema = z.object({
	data: z
		.array(
			z.object({
				gid: z.string(),
				name: z.string().optional(),
				resource_type: z.string().optional(),
			}),
		)
		.optional(),
});

// ── Team Input Schemas ────────────────────────────────────────────────────────

const TeamsGetInputSchema = z.object({
	team_gid: z.string(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TeamsListForUserInputSchema = z.object({
	user_gid: z.string(),
	organization: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TeamsListForWorkspaceInputSchema = z.object({
	workspace_gid: z.string(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TeamsCreateInputSchema = z.object({
	workspace_gid: z.string(),
	data: z.object({
		name: z.string(),
		description: z.string().optional(),
		html_description: z.string().optional(),
		visibility: z.string().optional(),
	}),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TeamsUpdateInputSchema = z.object({
	team_gid: z.string(),
	data: z.object({
		name: z.string().optional(),
		description: z.string().optional(),
		html_description: z.string().optional(),
		visibility: z.string().optional(),
	}),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TeamsAddUserInputSchema = z.object({
	team_gid: z.string(),
	user: z.string(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TeamsRemoveUserInputSchema = z.object({
	team_gid: z.string(),
	user: z.string(),
	opt_pretty: z.boolean().optional(),
});

const TeamMembershipsListInputSchema = z.object({
	team: z.string().optional(),
	user: z.string().optional(),
	workspace: z.string().optional(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TeamMembershipsGetInputSchema = z.object({
	team_membership_gid: z.string(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TeamMembershipsListForTeamInputSchema = z.object({
	team_gid: z.string(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TeamMembershipsListForUserInputSchema = z.object({
	user_gid: z.string(),
	workspace: z.string(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

// ── Team Output Schemas ───────────────────────────────────────────────────────

const TeamsGetResponseSchema = z.object({
	data: TeamFullSchema.optional(),
});

const TeamsListResponseSchema = z.object({
	data: z.array(TeamFullSchema).optional(),
	next_page: NextPageSchema,
});

const TeamsCreateResponseSchema = z.object({
	data: TeamFullSchema.optional(),
});

const TeamsUpdateResponseSchema = z.object({
	data: TeamFullSchema.optional(),
});

const TeamsAddUserResponseSchema = z.object({
	data: TeamMembershipSchema.optional(),
});

const TeamsRemoveUserResponseSchema = z.object({
	data: z.object({}).optional(),
});

const TeamMembershipsListResponseSchema = z.object({
	data: z.array(TeamMembershipSchema).optional(),
	next_page: NextPageSchema,
});

const TeamMembershipsGetResponseSchema = z.object({
	data: TeamMembershipSchema.optional(),
});

// ── Tag Input Schemas ─────────────────────────────────────────────────────────

const TagsGetInputSchema = z.object({
	tag_gid: z.string(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TagsListInputSchema = z.object({
	workspace: z.string().optional(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TagsListForWorkspaceInputSchema = z.object({
	workspace_gid: z.string(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TagsListForTaskInputSchema = z.object({
	task_gid: z.string(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TagsCreateInputSchema = z.object({
	data: z.object({
		name: z.string(),
		color: z.string().optional(),
		notes: z.string().optional(),
		workspace: z.string().optional(),
		followers: z.array(z.string()).optional(),
	}),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TagsCreateInWorkspaceInputSchema = z.object({
	workspace_gid: z.string(),
	data: z.object({
		name: z.string(),
		color: z.string().optional(),
		notes: z.string().optional(),
		followers: z.array(z.string()).optional(),
	}),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TagsUpdateInputSchema = z.object({
	tag_gid: z.string(),
	data: z.object({
		name: z.string().optional(),
		color: z.string().optional(),
		notes: z.string().optional(),
	}),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const TagsDeleteInputSchema = z.object({
	tag_gid: z.string(),
	opt_pretty: z.boolean().optional(),
});

const TagsGetTasksInputSchema = z.object({
	tag_gid: z.string(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

// ── Tag Output Schemas ────────────────────────────────────────────────────────

const TagsGetResponseSchema = z.object({
	data: TagFullSchema.optional(),
});

const TagsListResponseSchema = z.object({
	data: z.array(TagFullSchema).optional(),
	next_page: NextPageSchema,
});

const TagsCreateResponseSchema = z.object({
	data: TagFullSchema.optional(),
});

const TagsUpdateResponseSchema = z.object({
	data: TagFullSchema.optional(),
});

const TagsDeleteResponseSchema = z.object({
	data: z.object({}).optional(),
});

const TagsGetTasksResponseSchema = z.object({
	data: z.array(TaskFullSchema).optional(),
	next_page: NextPageSchema,
});

// ── Story Input Schemas ───────────────────────────────────────────────────────

const StoriesGetInputSchema = z.object({
	story_gid: z.string(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const StoriesListForTaskInputSchema = z.object({
	task_gid: z.string(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
});

const StoriesCreateCommentInputSchema = z.object({
	task_gid: z.string(),
	data: z.object({
		text: z.string().optional(),
		html_text: z.string().optional(),
		is_pinned: z.boolean().optional(),
	}),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const StoriesUpdateInputSchema = z.object({
	story_gid: z.string(),
	data: z.object({
		text: z.string().optional(),
		html_text: z.string().optional(),
		is_pinned: z.boolean().optional(),
	}),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const StoriesDeleteInputSchema = z.object({
	story_gid: z.string(),
	opt_pretty: z.boolean().optional(),
});

// ── Story Output Schemas ──────────────────────────────────────────────────────

const StoriesGetResponseSchema = z.object({
	data: StoryFullSchema.optional(),
});

const StoriesListForTaskResponseSchema = z.object({
	data: z.array(StoryFullSchema).optional(),
	next_page: NextPageSchema,
});

const StoriesCreateCommentResponseSchema = z.object({
	data: StoryFullSchema.optional(),
});

const StoriesUpdateResponseSchema = z.object({
	data: StoryFullSchema.optional(),
});

const StoriesDeleteResponseSchema = z.object({
	data: z.object({}).optional(),
});

// ── Webhook Management Input Schemas ─────────────────────────────────────────

const WebhooksGetListInputSchema = z.object({
	workspace: z.string(),
	resource: z.string().optional(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const WebhooksUpdateInputSchema = z.object({
	webhook_gid: z.string(),
	data: z.object({
		filters: z
			.array(
				z.object({
					resource_type: z.string().optional(),
					resource_subtype: z.string().optional(),
					action: z.string().optional(),
					fields: z.array(z.string()).optional(),
				}),
			)
			.optional(),
	}),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const WebhooksCreateInputSchema = z.object({
	data: z.object({
		resource: z.string(),
		target: z.string(),
		filters: z
			.array(
				z.object({
					resource_type: z.string().optional(),
					resource_subtype: z.string().optional(),
					action: z.string().optional(),
					fields: z.array(z.string()).optional(),
				}),
			)
			.optional(),
	}),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const WebhooksDeleteInputSchema = z.object({
	webhook_gid: z.string(),
	opt_pretty: z.boolean().optional(),
});

// ── Webhook Management Output Schemas ────────────────────────────────────────

const WebhooksGetListResponseSchema = z.object({
	data: z.array(WebhookFullSchema).optional(),
	next_page: NextPageSchema,
});

const WebhooksCreateResponseSchema = z.object({
	data: WebhookFullSchema.optional(),
});

const WebhooksDeleteResponseSchema = z.object({});

const WebhooksUpdateResponseSchema = z.object({
	data: WebhookFullSchema.optional(),
});

// ── Workspace Input Schemas ───────────────────────────────────────────────────

const WorkspacesGetInputSchema = z.object({
	workspace_gid: z.string(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const WorkspacesListInputSchema = z.object({
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const WorkspaceMembershipsGetInputSchema = z.object({
	workspace_membership_gid: z.string(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const WorkspaceMembershipsListInputSchema = z.object({
	workspace_gid: z.string(),
	user: z.string().optional(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

const WorkspaceMembershipsListForUserInputSchema = z.object({
	user_gid: z.string(),
	limit: z.number().optional(),
	offset: z.string().optional(),
	opt_fields: z.array(z.string()).optional(),
	opt_pretty: z.boolean().optional(),
});

// ── Workspace Output Schemas ──────────────────────────────────────────────────

const WorkspaceFullSchema = z.object({
	gid: z.string(),
	name: z.string().optional(),
	resource_type: z.string().optional(),
	is_organization: z.boolean().optional(),
	email_domains: z.array(z.string()).optional(),
});

const WorkspacesGetResponseSchema = z.object({
	data: WorkspaceFullSchema.optional(),
});

const WorkspacesListResponseSchema = z.object({
	data: z.array(WorkspaceFullSchema).optional(),
	next_page: NextPageSchema,
});

const WorkspaceMembershipsGetResponseSchema = z.object({
	data: WorkspaceMembershipSchema.optional(),
});

const WorkspaceMembershipsListResponseSchema = z.object({
	data: z.array(WorkspaceMembershipSchema).optional(),
	next_page: NextPageSchema,
});

// ── Endpoint I/O Maps ─────────────────────────────────────────────────────────

export type AsanaEndpointInputs = {
	// Tasks
	tasksGet: z.infer<typeof TasksGetInputSchema>;
	tasksList: z.infer<typeof TasksListInputSchema>;
	tasksCreate: z.infer<typeof TasksCreateInputSchema>;
	tasksUpdate: z.infer<typeof TasksUpdateInputSchema>;
	tasksDelete: z.infer<typeof TasksDeleteInputSchema>;
	tasksDuplicate: z.infer<typeof TasksDuplicateInputSchema>;
	tasksSearch: z.infer<typeof TasksSearchInputSchema>;
	tasksAddFollowers: z.infer<typeof TasksAddFollowersInputSchema>;
	tasksRemoveFollower: z.infer<typeof TasksRemoveFollowerInputSchema>;
	tasksAddProject: z.infer<typeof TasksAddProjectInputSchema>;
	tasksRemoveProject: z.infer<typeof TasksRemoveProjectInputSchema>;
	tasksAddTag: z.infer<typeof TasksAddTagInputSchema>;
	tasksRemoveTag: z.infer<typeof TasksRemoveTagInputSchema>;
	tasksAddDependencies: z.infer<typeof TasksAddDependenciesInputSchema>;
	tasksCreateSubtask: z.infer<typeof TasksCreateSubtaskInputSchema>;
	tasksGetSubtasks: z.infer<typeof TasksGetSubtasksInputSchema>;
	tasksSetParent: z.infer<typeof TasksSetParentInputSchema>;
	tasksGetStories: z.infer<typeof TasksGetStoriesInputSchema>;
	tasksGetAttachments: z.infer<typeof TasksGetAttachmentsInputSchema>;
	tasksGetTags: z.infer<typeof TasksGetTagsInputSchema>;
	tasksAddToSection: z.infer<typeof TasksAddToSectionInputSchema>;
	// Projects
	projectsGet: z.infer<typeof ProjectsGetInputSchema>;
	projectsList: z.infer<typeof ProjectsListInputSchema>;
	projectsCreate: z.infer<typeof ProjectsCreateInputSchema>;
	projectsCreateForTeam: z.infer<typeof ProjectsCreateForTeamInputSchema>;
	projectsCreateForWorkspace: z.infer<
		typeof ProjectsCreateForWorkspaceInputSchema
	>;
	projectsUpdate: z.infer<typeof ProjectsUpdateInputSchema>;
	projectsDelete: z.infer<typeof ProjectsDeleteInputSchema>;
	projectsDuplicate: z.infer<typeof ProjectsDuplicateInputSchema>;
	projectsAddFollowers: z.infer<typeof ProjectsAddFollowersInputSchema>;
	projectsRemoveFollowers: z.infer<typeof ProjectsRemoveFollowersInputSchema>;
	projectsAddMembers: z.infer<typeof ProjectsAddMembersInputSchema>;
	projectsRemoveMembers: z.infer<typeof ProjectsRemoveMembersInputSchema>;
	projectsGetTasks: z.infer<typeof ProjectsGetTasksInputSchema>;
	projectsGetTaskCounts: z.infer<typeof ProjectsGetTaskCountsInputSchema>;
	workspaceProjectsList: z.infer<typeof WorkspaceProjectsListInputSchema>;
	// Sections
	sectionsGet: z.infer<typeof SectionsGetInputSchema>;
	sectionsList: z.infer<typeof SectionsListInputSchema>;
	sectionsCreate: z.infer<typeof SectionsCreateInputSchema>;
	sectionsUpdate: z.infer<typeof SectionsUpdateInputSchema>;
	sectionsDelete: z.infer<typeof SectionsDeleteInputSchema>;
	sectionsInsert: z.infer<typeof SectionsInsertInputSchema>;
	// Users
	usersGet: z.infer<typeof UsersGetInputSchema>;
	usersList: z.infer<typeof UsersListInputSchema>;
	usersGetCurrent: z.infer<typeof UsersGetCurrentInputSchema>;
	usersListForWorkspace: z.infer<typeof UsersListForWorkspaceInputSchema>;
	usersListForTeam: z.infer<typeof UsersListForTeamInputSchema>;
	usersGetTaskList: z.infer<typeof UsersGetTaskListInputSchema>;
	usersGetUserTaskList: z.infer<typeof UsersGetUserTaskListInputSchema>;
	usersGetFavorites: z.infer<typeof UsersGetFavoritesInputSchema>;
	// Teams
	teamsGet: z.infer<typeof TeamsGetInputSchema>;
	teamsListForUser: z.infer<typeof TeamsListForUserInputSchema>;
	teamsListForWorkspace: z.infer<typeof TeamsListForWorkspaceInputSchema>;
	teamsCreate: z.infer<typeof TeamsCreateInputSchema>;
	teamsUpdate: z.infer<typeof TeamsUpdateInputSchema>;
	teamsAddUser: z.infer<typeof TeamsAddUserInputSchema>;
	teamsRemoveUser: z.infer<typeof TeamsRemoveUserInputSchema>;
	teamMembershipsList: z.infer<typeof TeamMembershipsListInputSchema>;
	teamMembershipsGet: z.infer<typeof TeamMembershipsGetInputSchema>;
	teamMembershipsListForTeam: z.infer<
		typeof TeamMembershipsListForTeamInputSchema
	>;
	teamMembershipsListForUser: z.infer<
		typeof TeamMembershipsListForUserInputSchema
	>;
	// Tags
	tagsGet: z.infer<typeof TagsGetInputSchema>;
	tagsList: z.infer<typeof TagsListInputSchema>;
	tagsListForWorkspace: z.infer<typeof TagsListForWorkspaceInputSchema>;
	tagsListForTask: z.infer<typeof TagsListForTaskInputSchema>;
	tagsCreate: z.infer<typeof TagsCreateInputSchema>;
	tagsCreateInWorkspace: z.infer<typeof TagsCreateInWorkspaceInputSchema>;
	tagsUpdate: z.infer<typeof TagsUpdateInputSchema>;
	tagsDelete: z.infer<typeof TagsDeleteInputSchema>;
	tagsGetTasks: z.infer<typeof TagsGetTasksInputSchema>;
	// Stories
	storiesGet: z.infer<typeof StoriesGetInputSchema>;
	storiesListForTask: z.infer<typeof StoriesListForTaskInputSchema>;
	storiesCreateComment: z.infer<typeof StoriesCreateCommentInputSchema>;
	storiesUpdate: z.infer<typeof StoriesUpdateInputSchema>;
	storiesDelete: z.infer<typeof StoriesDeleteInputSchema>;
	// Webhook management
	webhooksGetList: z.infer<typeof WebhooksGetListInputSchema>;
	webhooksCreate: z.infer<typeof WebhooksCreateInputSchema>;
	webhooksDelete: z.infer<typeof WebhooksDeleteInputSchema>;
	webhooksUpdate: z.infer<typeof WebhooksUpdateInputSchema>;
	// Workspaces
	workspacesGet: z.infer<typeof WorkspacesGetInputSchema>;
	workspacesList: z.infer<typeof WorkspacesListInputSchema>;
	workspaceMembershipsGet: z.infer<typeof WorkspaceMembershipsGetInputSchema>;
	workspaceMembershipsList: z.infer<typeof WorkspaceMembershipsListInputSchema>;
	workspaceMembershipsListForUser: z.infer<
		typeof WorkspaceMembershipsListForUserInputSchema
	>;
};

export type AsanaEndpointOutputs = {
	// Tasks
	tasksGet: z.infer<typeof TasksGetResponseSchema>;
	tasksList: z.infer<typeof TasksListResponseSchema>;
	tasksCreate: z.infer<typeof TasksCreateResponseSchema>;
	tasksUpdate: z.infer<typeof TasksUpdateResponseSchema>;
	tasksDelete: z.infer<typeof TasksDeleteResponseSchema>;
	tasksDuplicate: z.infer<typeof TasksDuplicateResponseSchema>;
	tasksSearch: z.infer<typeof TasksSearchResponseSchema>;
	tasksAddFollowers: z.infer<typeof TasksAddFollowersResponseSchema>;
	tasksRemoveFollower: z.infer<typeof TasksRemoveFollowerResponseSchema>;
	tasksAddProject: z.infer<typeof TasksAddProjectResponseSchema>;
	tasksRemoveProject: z.infer<typeof TasksRemoveProjectResponseSchema>;
	tasksAddTag: z.infer<typeof TasksAddTagResponseSchema>;
	tasksRemoveTag: z.infer<typeof TasksRemoveTagResponseSchema>;
	tasksAddDependencies: z.infer<typeof TasksAddDependenciesResponseSchema>;
	tasksCreateSubtask: z.infer<typeof TasksCreateSubtaskResponseSchema>;
	tasksGetSubtasks: z.infer<typeof TasksGetSubtasksResponseSchema>;
	tasksSetParent: z.infer<typeof TasksSetParentResponseSchema>;
	tasksGetStories: z.infer<typeof TasksGetStoriesResponseSchema>;
	tasksGetAttachments: z.infer<typeof TasksGetAttachmentsResponseSchema>;
	tasksGetTags: z.infer<typeof TasksGetTagsResponseSchema>;
	tasksAddToSection: z.infer<typeof TasksAddToSectionResponseSchema>;
	// Projects
	projectsGet: z.infer<typeof ProjectsGetResponseSchema>;
	projectsList: z.infer<typeof ProjectsListResponseSchema>;
	projectsCreate: z.infer<typeof ProjectsCreateResponseSchema>;
	projectsCreateForTeam: z.infer<typeof ProjectsCreateResponseSchema>;
	projectsCreateForWorkspace: z.infer<typeof ProjectsCreateResponseSchema>;
	projectsUpdate: z.infer<typeof ProjectsUpdateResponseSchema>;
	projectsDelete: z.infer<typeof ProjectsDeleteResponseSchema>;
	projectsDuplicate: z.infer<typeof ProjectsDuplicateResponseSchema>;
	projectsAddFollowers: z.infer<typeof ProjectsAddFollowersResponseSchema>;
	projectsRemoveFollowers: z.infer<
		typeof ProjectsRemoveFollowersResponseSchema
	>;
	projectsAddMembers: z.infer<typeof ProjectsAddMembersResponseSchema>;
	projectsRemoveMembers: z.infer<typeof ProjectsRemoveMembersResponseSchema>;
	projectsGetTasks: z.infer<typeof ProjectsGetTasksResponseSchema>;
	projectsGetTaskCounts: z.infer<typeof ProjectsGetTaskCountsResponseSchema>;
	workspaceProjectsList: z.infer<typeof ProjectsListResponseSchema>;
	// Sections
	sectionsGet: z.infer<typeof SectionsGetResponseSchema>;
	sectionsList: z.infer<typeof SectionsListResponseSchema>;
	sectionsCreate: z.infer<typeof SectionsCreateResponseSchema>;
	sectionsUpdate: z.infer<typeof SectionsUpdateResponseSchema>;
	sectionsDelete: z.infer<typeof SectionsDeleteResponseSchema>;
	sectionsInsert: z.infer<typeof SectionsInsertResponseSchema>;
	// Users
	usersGet: z.infer<typeof UsersGetResponseSchema>;
	usersList: z.infer<typeof UsersListResponseSchema>;
	usersGetCurrent: z.infer<typeof UsersGetResponseSchema>;
	usersListForWorkspace: z.infer<typeof UsersListResponseSchema>;
	usersListForTeam: z.infer<typeof UsersListResponseSchema>;
	usersGetTaskList: z.infer<typeof UsersGetTaskListResponseSchema>;
	usersGetUserTaskList: z.infer<typeof UsersGetUserTaskListResponseSchema>;
	usersGetFavorites: z.infer<typeof UsersGetFavoritesResponseSchema>;
	// Teams
	teamsGet: z.infer<typeof TeamsGetResponseSchema>;
	teamsListForUser: z.infer<typeof TeamsListResponseSchema>;
	teamsListForWorkspace: z.infer<typeof TeamsListResponseSchema>;
	teamsCreate: z.infer<typeof TeamsCreateResponseSchema>;
	teamsUpdate: z.infer<typeof TeamsUpdateResponseSchema>;
	teamsAddUser: z.infer<typeof TeamsAddUserResponseSchema>;
	teamsRemoveUser: z.infer<typeof TeamsRemoveUserResponseSchema>;
	teamMembershipsList: z.infer<typeof TeamMembershipsListResponseSchema>;
	teamMembershipsGet: z.infer<typeof TeamMembershipsGetResponseSchema>;
	teamMembershipsListForTeam: z.infer<typeof TeamMembershipsListResponseSchema>;
	teamMembershipsListForUser: z.infer<typeof TeamMembershipsListResponseSchema>;
	// Tags
	tagsGet: z.infer<typeof TagsGetResponseSchema>;
	tagsList: z.infer<typeof TagsListResponseSchema>;
	tagsListForWorkspace: z.infer<typeof TagsListResponseSchema>;
	tagsListForTask: z.infer<typeof TagsListResponseSchema>;
	tagsCreate: z.infer<typeof TagsCreateResponseSchema>;
	tagsCreateInWorkspace: z.infer<typeof TagsCreateResponseSchema>;
	tagsUpdate: z.infer<typeof TagsUpdateResponseSchema>;
	tagsDelete: z.infer<typeof TagsDeleteResponseSchema>;
	tagsGetTasks: z.infer<typeof TagsGetTasksResponseSchema>;
	// Stories
	storiesGet: z.infer<typeof StoriesGetResponseSchema>;
	storiesListForTask: z.infer<typeof StoriesListForTaskResponseSchema>;
	storiesCreateComment: z.infer<typeof StoriesCreateCommentResponseSchema>;
	storiesUpdate: z.infer<typeof StoriesUpdateResponseSchema>;
	storiesDelete: z.infer<typeof StoriesDeleteResponseSchema>;
	// Webhook management
	webhooksGetList: z.infer<typeof WebhooksGetListResponseSchema>;
	webhooksCreate: z.infer<typeof WebhooksCreateResponseSchema>;
	webhooksDelete: z.infer<typeof WebhooksDeleteResponseSchema>;
	webhooksUpdate: z.infer<typeof WebhooksUpdateResponseSchema>;
	// Workspaces
	workspacesGet: z.infer<typeof WorkspacesGetResponseSchema>;
	workspacesList: z.infer<typeof WorkspacesListResponseSchema>;
	workspaceMembershipsGet: z.infer<
		typeof WorkspaceMembershipsGetResponseSchema
	>;
	workspaceMembershipsList: z.infer<
		typeof WorkspaceMembershipsListResponseSchema
	>;
	workspaceMembershipsListForUser: z.infer<
		typeof WorkspaceMembershipsListResponseSchema
	>;
};

export const AsanaEndpointInputSchemas = {
	// Tasks
	tasksGet: TasksGetInputSchema,
	tasksList: TasksListInputSchema,
	tasksCreate: TasksCreateInputSchema,
	tasksUpdate: TasksUpdateInputSchema,
	tasksDelete: TasksDeleteInputSchema,
	tasksDuplicate: TasksDuplicateInputSchema,
	tasksSearch: TasksSearchInputSchema,
	tasksAddFollowers: TasksAddFollowersInputSchema,
	tasksRemoveFollower: TasksRemoveFollowerInputSchema,
	tasksAddProject: TasksAddProjectInputSchema,
	tasksRemoveProject: TasksRemoveProjectInputSchema,
	tasksAddTag: TasksAddTagInputSchema,
	tasksRemoveTag: TasksRemoveTagInputSchema,
	tasksAddDependencies: TasksAddDependenciesInputSchema,
	tasksCreateSubtask: TasksCreateSubtaskInputSchema,
	tasksGetSubtasks: TasksGetSubtasksInputSchema,
	tasksSetParent: TasksSetParentInputSchema,
	tasksGetStories: TasksGetStoriesInputSchema,
	tasksGetAttachments: TasksGetAttachmentsInputSchema,
	tasksGetTags: TasksGetTagsInputSchema,
	tasksAddToSection: TasksAddToSectionInputSchema,
	// Projects
	projectsGet: ProjectsGetInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsCreate: ProjectsCreateInputSchema,
	projectsCreateForTeam: ProjectsCreateForTeamInputSchema,
	projectsCreateForWorkspace: ProjectsCreateForWorkspaceInputSchema,
	projectsUpdate: ProjectsUpdateInputSchema,
	projectsDelete: ProjectsDeleteInputSchema,
	projectsDuplicate: ProjectsDuplicateInputSchema,
	projectsAddFollowers: ProjectsAddFollowersInputSchema,
	projectsRemoveFollowers: ProjectsRemoveFollowersInputSchema,
	projectsAddMembers: ProjectsAddMembersInputSchema,
	projectsRemoveMembers: ProjectsRemoveMembersInputSchema,
	projectsGetTasks: ProjectsGetTasksInputSchema,
	projectsGetTaskCounts: ProjectsGetTaskCountsInputSchema,
	workspaceProjectsList: WorkspaceProjectsListInputSchema,
	// Sections
	sectionsGet: SectionsGetInputSchema,
	sectionsList: SectionsListInputSchema,
	sectionsCreate: SectionsCreateInputSchema,
	sectionsUpdate: SectionsUpdateInputSchema,
	sectionsDelete: SectionsDeleteInputSchema,
	sectionsInsert: SectionsInsertInputSchema,
	// Users
	usersGet: UsersGetInputSchema,
	usersList: UsersListInputSchema,
	usersGetCurrent: UsersGetCurrentInputSchema,
	usersListForWorkspace: UsersListForWorkspaceInputSchema,
	usersListForTeam: UsersListForTeamInputSchema,
	usersGetTaskList: UsersGetTaskListInputSchema,
	usersGetUserTaskList: UsersGetUserTaskListInputSchema,
	usersGetFavorites: UsersGetFavoritesInputSchema,
	// Teams
	teamsGet: TeamsGetInputSchema,
	teamsListForUser: TeamsListForUserInputSchema,
	teamsListForWorkspace: TeamsListForWorkspaceInputSchema,
	teamsCreate: TeamsCreateInputSchema,
	teamsUpdate: TeamsUpdateInputSchema,
	teamsAddUser: TeamsAddUserInputSchema,
	teamsRemoveUser: TeamsRemoveUserInputSchema,
	teamMembershipsList: TeamMembershipsListInputSchema,
	teamMembershipsGet: TeamMembershipsGetInputSchema,
	teamMembershipsListForTeam: TeamMembershipsListForTeamInputSchema,
	teamMembershipsListForUser: TeamMembershipsListForUserInputSchema,
	// Tags
	tagsGet: TagsGetInputSchema,
	tagsList: TagsListInputSchema,
	tagsListForWorkspace: TagsListForWorkspaceInputSchema,
	tagsListForTask: TagsListForTaskInputSchema,
	tagsCreate: TagsCreateInputSchema,
	tagsCreateInWorkspace: TagsCreateInWorkspaceInputSchema,
	tagsUpdate: TagsUpdateInputSchema,
	tagsDelete: TagsDeleteInputSchema,
	tagsGetTasks: TagsGetTasksInputSchema,
	// Stories
	storiesGet: StoriesGetInputSchema,
	storiesListForTask: StoriesListForTaskInputSchema,
	storiesCreateComment: StoriesCreateCommentInputSchema,
	storiesUpdate: StoriesUpdateInputSchema,
	storiesDelete: StoriesDeleteInputSchema,
	// Webhook management
	webhooksGetList: WebhooksGetListInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksDelete: WebhooksDeleteInputSchema,
	webhooksUpdate: WebhooksUpdateInputSchema,
	// Workspaces
	workspacesGet: WorkspacesGetInputSchema,
	workspacesList: WorkspacesListInputSchema,
	workspaceMembershipsGet: WorkspaceMembershipsGetInputSchema,
	workspaceMembershipsList: WorkspaceMembershipsListInputSchema,
	workspaceMembershipsListForUser: WorkspaceMembershipsListForUserInputSchema,
} as const;

export const AsanaEndpointOutputSchemas = {
	// Tasks
	tasksGet: TasksGetResponseSchema,
	tasksList: TasksListResponseSchema,
	tasksCreate: TasksCreateResponseSchema,
	tasksUpdate: TasksUpdateResponseSchema,
	tasksDelete: TasksDeleteResponseSchema,
	tasksDuplicate: TasksDuplicateResponseSchema,
	tasksSearch: TasksSearchResponseSchema,
	tasksAddFollowers: TasksAddFollowersResponseSchema,
	tasksRemoveFollower: TasksRemoveFollowerResponseSchema,
	tasksAddProject: TasksAddProjectResponseSchema,
	tasksRemoveProject: TasksRemoveProjectResponseSchema,
	tasksAddTag: TasksAddTagResponseSchema,
	tasksRemoveTag: TasksRemoveTagResponseSchema,
	tasksAddDependencies: TasksAddDependenciesResponseSchema,
	tasksCreateSubtask: TasksCreateSubtaskResponseSchema,
	tasksGetSubtasks: TasksGetSubtasksResponseSchema,
	tasksSetParent: TasksSetParentResponseSchema,
	tasksGetStories: TasksGetStoriesResponseSchema,
	tasksGetAttachments: TasksGetAttachmentsResponseSchema,
	tasksGetTags: TasksGetTagsResponseSchema,
	tasksAddToSection: TasksAddToSectionResponseSchema,
	// Projects
	projectsGet: ProjectsGetResponseSchema,
	projectsList: ProjectsListResponseSchema,
	projectsCreate: ProjectsCreateResponseSchema,
	projectsCreateForTeam: ProjectsCreateResponseSchema,
	projectsCreateForWorkspace: ProjectsCreateResponseSchema,
	projectsUpdate: ProjectsUpdateResponseSchema,
	projectsDelete: ProjectsDeleteResponseSchema,
	projectsDuplicate: ProjectsDuplicateResponseSchema,
	projectsAddFollowers: ProjectsAddFollowersResponseSchema,
	projectsRemoveFollowers: ProjectsRemoveFollowersResponseSchema,
	projectsAddMembers: ProjectsAddMembersResponseSchema,
	projectsRemoveMembers: ProjectsRemoveMembersResponseSchema,
	projectsGetTasks: ProjectsGetTasksResponseSchema,
	projectsGetTaskCounts: ProjectsGetTaskCountsResponseSchema,
	workspaceProjectsList: ProjectsListResponseSchema,
	// Sections
	sectionsGet: SectionsGetResponseSchema,
	sectionsList: SectionsListResponseSchema,
	sectionsCreate: SectionsCreateResponseSchema,
	sectionsUpdate: SectionsUpdateResponseSchema,
	sectionsDelete: SectionsDeleteResponseSchema,
	sectionsInsert: SectionsInsertResponseSchema,
	// Users
	usersGet: UsersGetResponseSchema,
	usersList: UsersListResponseSchema,
	usersGetCurrent: UsersGetResponseSchema,
	usersListForWorkspace: UsersListResponseSchema,
	usersListForTeam: UsersListResponseSchema,
	usersGetTaskList: UsersGetTaskListResponseSchema,
	usersGetUserTaskList: UsersGetUserTaskListResponseSchema,
	usersGetFavorites: UsersGetFavoritesResponseSchema,
	// Teams
	teamsGet: TeamsGetResponseSchema,
	teamsListForUser: TeamsListResponseSchema,
	teamsListForWorkspace: TeamsListResponseSchema,
	teamsCreate: TeamsCreateResponseSchema,
	teamsUpdate: TeamsUpdateResponseSchema,
	teamsAddUser: TeamsAddUserResponseSchema,
	teamsRemoveUser: TeamsRemoveUserResponseSchema,
	teamMembershipsList: TeamMembershipsListResponseSchema,
	teamMembershipsGet: TeamMembershipsGetResponseSchema,
	teamMembershipsListForTeam: TeamMembershipsListResponseSchema,
	teamMembershipsListForUser: TeamMembershipsListResponseSchema,
	// Tags
	tagsGet: TagsGetResponseSchema,
	tagsList: TagsListResponseSchema,
	tagsListForWorkspace: TagsListResponseSchema,
	tagsListForTask: TagsListResponseSchema,
	tagsCreate: TagsCreateResponseSchema,
	tagsCreateInWorkspace: TagsCreateResponseSchema,
	tagsUpdate: TagsUpdateResponseSchema,
	tagsDelete: TagsDeleteResponseSchema,
	tagsGetTasks: TagsGetTasksResponseSchema,
	// Stories
	storiesGet: StoriesGetResponseSchema,
	storiesListForTask: StoriesListForTaskResponseSchema,
	storiesCreateComment: StoriesCreateCommentResponseSchema,
	storiesUpdate: StoriesUpdateResponseSchema,
	storiesDelete: StoriesDeleteResponseSchema,
	// Webhook management
	webhooksGetList: WebhooksGetListResponseSchema,
	webhooksCreate: WebhooksCreateResponseSchema,
	webhooksDelete: WebhooksDeleteResponseSchema,
	webhooksUpdate: WebhooksUpdateResponseSchema,
	// Workspaces
	workspacesGet: WorkspacesGetResponseSchema,
	workspacesList: WorkspacesListResponseSchema,
	workspaceMembershipsGet: WorkspaceMembershipsGetResponseSchema,
	workspaceMembershipsList: WorkspaceMembershipsListResponseSchema,
	workspaceMembershipsListForUser: WorkspaceMembershipsListResponseSchema,
} as const;

// ── Named Type Exports ────────────────────────────────────────────────────────

export type TasksGetResponse = z.infer<typeof TasksGetResponseSchema>;
export type TasksListResponse = z.infer<typeof TasksListResponseSchema>;
export type TasksCreateResponse = z.infer<typeof TasksCreateResponseSchema>;
export type TasksUpdateResponse = z.infer<typeof TasksUpdateResponseSchema>;
export type TasksDeleteResponse = z.infer<typeof TasksDeleteResponseSchema>;
export type TasksDuplicateResponse = z.infer<
	typeof TasksDuplicateResponseSchema
>;
export type TasksSearchResponse = z.infer<typeof TasksSearchResponseSchema>;
export type TasksGetSubtasksResponse = z.infer<
	typeof TasksGetSubtasksResponseSchema
>;
export type TasksGetStoriesResponse = z.infer<
	typeof TasksGetStoriesResponseSchema
>;
export type ProjectsGetResponse = z.infer<typeof ProjectsGetResponseSchema>;
export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;
export type ProjectsCreateResponse = z.infer<
	typeof ProjectsCreateResponseSchema
>;
export type ProjectsUpdateResponse = z.infer<
	typeof ProjectsUpdateResponseSchema
>;
export type ProjectsDeleteResponse = z.infer<
	typeof ProjectsDeleteResponseSchema
>;
export type ProjectsDuplicateResponse = z.infer<
	typeof ProjectsDuplicateResponseSchema
>;
export type ProjectsGetTasksResponse = z.infer<
	typeof ProjectsGetTasksResponseSchema
>;
export type ProjectsGetTaskCountsResponse = z.infer<
	typeof ProjectsGetTaskCountsResponseSchema
>;
export type SectionsGetResponse = z.infer<typeof SectionsGetResponseSchema>;
export type SectionsListResponse = z.infer<typeof SectionsListResponseSchema>;
export type SectionsCreateResponse = z.infer<
	typeof SectionsCreateResponseSchema
>;
export type SectionsUpdateResponse = z.infer<
	typeof SectionsUpdateResponseSchema
>;
export type UsersGetResponse = z.infer<typeof UsersGetResponseSchema>;
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;
export type TeamsGetResponse = z.infer<typeof TeamsGetResponseSchema>;
export type TeamsListResponse = z.infer<typeof TeamsListResponseSchema>;
export type TeamsCreateResponse = z.infer<typeof TeamsCreateResponseSchema>;
export type TeamsAddUserResponse = z.infer<typeof TeamsAddUserResponseSchema>;
export type TeamMembershipsListResponse = z.infer<
	typeof TeamMembershipsListResponseSchema
>;
export type TeamMembershipsGetResponse = z.infer<
	typeof TeamMembershipsGetResponseSchema
>;
export type TagsGetResponse = z.infer<typeof TagsGetResponseSchema>;
export type TagsListResponse = z.infer<typeof TagsListResponseSchema>;
export type TagsCreateResponse = z.infer<typeof TagsCreateResponseSchema>;
export type TagsGetTasksResponse = z.infer<typeof TagsGetTasksResponseSchema>;
export type StoriesGetResponse = z.infer<typeof StoriesGetResponseSchema>;
export type StoriesListForTaskResponse = z.infer<
	typeof StoriesListForTaskResponseSchema
>;
export type StoriesCreateCommentResponse = z.infer<
	typeof StoriesCreateCommentResponseSchema
>;
export type WebhooksGetListResponse = z.infer<
	typeof WebhooksGetListResponseSchema
>;
export type WebhooksCreateResponse = z.infer<
	typeof WebhooksCreateResponseSchema
>;
export type WebhooksDeleteResponse = z.infer<
	typeof WebhooksDeleteResponseSchema
>;
export type WebhooksUpdateResponse = z.infer<
	typeof WebhooksUpdateResponseSchema
>;
export type WorkspacesGetResponse = z.infer<typeof WorkspacesGetResponseSchema>;
export type WorkspacesListResponse = z.infer<
	typeof WorkspacesListResponseSchema
>;
export type WorkspaceMembershipsGetResponse = z.infer<
	typeof WorkspaceMembershipsGetResponseSchema
>;
export type WorkspaceMembershipsListResponse = z.infer<
	typeof WorkspaceMembershipsListResponseSchema
>;
