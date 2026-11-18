import { z } from 'zod';

// Shared shapes. Responses use `.passthrough()` so additive ClickUp fields
// never break validation; inputs model the documented required parameters.
const NamedEntitySchema = z
	.object({
		id: z.string(),
		name: z.string(),
	})
	.passthrough();

const ViewTypeSchema = z.enum([
	'list',
	'board',
	'calendar',
	'table',
	'timeline',
	'workload',
	'activity',
	'map',
	'chat',
	'gantt',
]);

const CommentPaginationSchema = {
	start: z.number().optional(),
	start_id: z.string().optional(),
};

// ---------------------------------------------------------------------------
// Workspaces
// ---------------------------------------------------------------------------
export const WorkspacesGetInputSchema = z.object({});
export type WorkspacesGetInput = z.infer<typeof WorkspacesGetInputSchema>;

export const WorkspacesGetResponseSchema = z
	.object({
		teams: z.array(NamedEntitySchema).optional(),
	})
	.passthrough();
export type WorkspacesGetResponse = z.infer<typeof WorkspacesGetResponseSchema>;

export const WorkspacesAuthorizedUserInputSchema = z.object({});
export type WorkspacesAuthorizedUserInput = z.infer<
	typeof WorkspacesAuthorizedUserInputSchema
>;

export const WorkspacesAuthorizedUserResponseSchema = z
	.object({
		id: z.number().optional(),
		user: z
			.object({
				id: z.number(),
				username: z.string(),
				email: z.string(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export type WorkspacesAuthorizedUserResponse = z.infer<
	typeof WorkspacesAuthorizedUserResponseSchema
>;

export const WorkspacesPlanInputSchema = z.object({
	team_id: z.string(),
});
export type WorkspacesPlanInput = z.infer<typeof WorkspacesPlanInputSchema>;

export const WorkspacesPlanResponseSchema = z
	.object({
		plan: z.string().optional(),
	})
	.passthrough();
export type WorkspacesPlanResponse = z.infer<
	typeof WorkspacesPlanResponseSchema
>;

export const WorkspacesSeatsInputSchema = z.object({
	workspace_id: z.string(),
});
export type WorkspacesSeatsInput = z.infer<typeof WorkspacesSeatsInputSchema>;

export const WorkspacesSeatsResponseSchema = z
	.object({
		seats: z.array(NamedEntitySchema).optional(),
	})
	.passthrough();
export type WorkspacesSeatsResponse = z.infer<
	typeof WorkspacesSeatsResponseSchema
>;

export const WorkspacesSharedHierarchyInputSchema = z.object({
	team_id: z.string(),
});
export type WorkspacesSharedHierarchyInput = z.infer<
	typeof WorkspacesSharedHierarchyInputSchema
>;

export const WorkspacesSharedHierarchyResponseSchema = z
	.object({
		shared: z.object({}).passthrough().optional(),
	})
	.passthrough();
export type WorkspacesSharedHierarchyResponse = z.infer<
	typeof WorkspacesSharedHierarchyResponseSchema
>;

export const WorkspacesCustomRolesInputSchema = z.object({
	team_id: z.string(),
	include_members: z.boolean().optional(),
});
export type WorkspacesCustomRolesInput = z.infer<
	typeof WorkspacesCustomRolesInputSchema
>;

export const WorkspacesCustomRolesResponseSchema = z
	.object({
		custom_roles: z.array(NamedEntitySchema).optional(),
	})
	.passthrough();
export type WorkspacesCustomRolesResponse = z.infer<
	typeof WorkspacesCustomRolesResponseSchema
>;

export const WorkspacesCustomTaskTypesInputSchema = z.object({
	team_id: z.string(),
});
export type WorkspacesCustomTaskTypesInput = z.infer<
	typeof WorkspacesCustomTaskTypesInputSchema
>;

export const WorkspacesCustomTaskTypesResponseSchema = z
	.object({
		custom_items: z.array(NamedEntitySchema).optional(),
	})
	.passthrough();
export type WorkspacesCustomTaskTypesResponse = z.infer<
	typeof WorkspacesCustomTaskTypesResponseSchema
>;

export const WorkspacesTeamFieldsInputSchema = z.object({
	team_id: z.string(),
});
export type WorkspacesTeamFieldsInput = z.infer<
	typeof WorkspacesTeamFieldsInputSchema
>;

export const WorkspacesTeamFieldsResponseSchema = z
	.object({
		fields: z.array(NamedEntitySchema).optional(),
	})
	.passthrough();
export type WorkspacesTeamFieldsResponse = z.infer<
	typeof WorkspacesTeamFieldsResponseSchema
>;

export const WorkspacesEverythingViewsGetInputSchema = z.object({
	team_id: z.string(),
});
export type WorkspacesEverythingViewsGetInput = z.infer<
	typeof WorkspacesEverythingViewsGetInputSchema
>;

export const WorkspacesEverythingViewsGetResponseSchema = z
	.object({
		views: z.array(NamedEntitySchema).optional(),
	})
	.passthrough();
export type WorkspacesEverythingViewsGetResponse = z.infer<
	typeof WorkspacesEverythingViewsGetResponseSchema
>;

export const WorkspacesEverythingViewsCreateInputSchema = z.object({
	team_id: z.string(),
	name: z.string(),
	type: ViewTypeSchema,
});
export type WorkspacesEverythingViewsCreateInput = z.infer<
	typeof WorkspacesEverythingViewsCreateInputSchema
>;

export const WorkspacesEverythingViewsCreateResponseSchema = NamedEntitySchema;
export type WorkspacesEverythingViewsCreateResponse = z.infer<
	typeof WorkspacesEverythingViewsCreateResponseSchema
>;

// ---------------------------------------------------------------------------
// Spaces
// ---------------------------------------------------------------------------
export const SpacesListInputSchema = z.object({
	team_id: z.string(),
	archived: z.boolean().optional(),
});
export type SpacesListInput = z.infer<typeof SpacesListInputSchema>;

export const SpacesListResponseSchema = z
	.object({
		spaces: z.array(NamedEntitySchema).optional(),
	})
	.passthrough();
export type SpacesListResponse = z.infer<typeof SpacesListResponseSchema>;

export const SpacesGetInputSchema = z.object({
	space_id: z.string(),
});
export type SpacesGetInput = z.infer<typeof SpacesGetInputSchema>;

export const SpacesGetResponseSchema = NamedEntitySchema;
export type SpacesGetResponse = z.infer<typeof SpacesGetResponseSchema>;

const SpaceFeaturesSchema = z.object({}).passthrough();

export const SpacesCreateInputSchema = z.object({
	team_id: z.string(),
	name: z.string(),
	multiple_assignees: z.boolean().optional(),
	features: SpaceFeaturesSchema.optional(),
});
export type SpacesCreateInput = z.infer<typeof SpacesCreateInputSchema>;

export const SpacesCreateResponseSchema = NamedEntitySchema;
export type SpacesCreateResponse = z.infer<typeof SpacesCreateResponseSchema>;

export const SpacesUpdateInputSchema = z.object({
	space_id: z.string(),
	name: z.string().optional(),
	color: z.string().optional(),
	private: z.boolean().optional(),
	admin_can_manage: z.boolean().optional(),
	multiple_assignees: z.boolean().optional(),
	features: SpaceFeaturesSchema.optional(),
});
export type SpacesUpdateInput = z.infer<typeof SpacesUpdateInputSchema>;

export const SpacesUpdateResponseSchema = NamedEntitySchema;
export type SpacesUpdateResponse = z.infer<typeof SpacesUpdateResponseSchema>;

export const SpacesDeleteInputSchema = z.object({
	space_id: z.string(),
});
export type SpacesDeleteInput = z.infer<typeof SpacesDeleteInputSchema>;

export const SpacesDeleteResponseSchema = z.undefined();
export type SpacesDeleteResponse = z.infer<typeof SpacesDeleteResponseSchema>;

export const SpacesAvailableFieldsInputSchema = z.object({
	space_id: z.string(),
});
export type SpacesAvailableFieldsInput = z.infer<
	typeof SpacesAvailableFieldsInputSchema
>;

export const SpacesAvailableFieldsResponseSchema = z
	.object({
		fields: z.array(NamedEntitySchema).optional(),
	})
	.passthrough();
export type SpacesAvailableFieldsResponse = z.infer<
	typeof SpacesAvailableFieldsResponseSchema
>;

export const SpacesTagsGetInputSchema = z.object({
	space_id: z.string(),
});
export type SpacesTagsGetInput = z.infer<typeof SpacesTagsGetInputSchema>;

// Documented GetSpaceTags item shape: { name, tag_fg, tag_bg } with no id.
const SpaceTagSchema = z
	.object({
		name: z.string(),
		tag_fg: z.string().optional(),
		tag_bg: z.string().optional(),
	})
	.passthrough();

export const SpacesTagsGetResponseSchema = z
	.object({
		tags: z.array(SpaceTagSchema).optional(),
	})
	.passthrough();
export type SpacesTagsGetResponse = z.infer<typeof SpacesTagsGetResponseSchema>;

export const SpacesTagsCreateInputSchema = z.object({
	space_id: z.string(),
	name: z.string(),
	tag_fg: z.string().optional(),
	tag_bg: z.string().optional(),
});
export type SpacesTagsCreateInput = z.infer<typeof SpacesTagsCreateInputSchema>;

export const SpacesTagsCreateResponseSchema = z.object({}).passthrough();
export type SpacesTagsCreateResponse = z.infer<
	typeof SpacesTagsCreateResponseSchema
>;

export const SpacesTagsUpdateInputSchema = z.object({
	space_id: z.string(),
	tag_name: z.string(),
	name: z.string(),
	tag_fg: z.string(),
	tag_bg: z.string(),
});
export type SpacesTagsUpdateInput = z.infer<typeof SpacesTagsUpdateInputSchema>;

export const SpacesTagsUpdateResponseSchema = z.object({}).passthrough();
export type SpacesTagsUpdateResponse = z.infer<
	typeof SpacesTagsUpdateResponseSchema
>;

export const SpacesTagsDeleteInputSchema = z.object({
	space_id: z.string(),
	tag_name: z.string(),
	tag_name_1: z.string().optional(),
	tag_tag_fg: z.string().optional(),
	tag_tag_bg: z.string().optional(),
});
export type SpacesTagsDeleteInput = z.infer<typeof SpacesTagsDeleteInputSchema>;

export const SpacesTagsDeleteResponseSchema = z.undefined();
export type SpacesTagsDeleteResponse = z.infer<
	typeof SpacesTagsDeleteResponseSchema
>;

export const SpacesViewsGetInputSchema = z.object({
	space_id: z.string(),
});
export type SpacesViewsGetInput = z.infer<typeof SpacesViewsGetInputSchema>;

export const SpacesViewsGetResponseSchema = z
	.object({
		views: z.array(NamedEntitySchema).optional(),
	})
	.passthrough();
export type SpacesViewsGetResponse = z.infer<
	typeof SpacesViewsGetResponseSchema
>;

export const SpacesViewsCreateInputSchema = z.object({
	space_id: z.string(),
	name: z.string(),
	type: ViewTypeSchema,
});
export type SpacesViewsCreateInput = z.infer<
	typeof SpacesViewsCreateInputSchema
>;

export const SpacesViewsCreateResponseSchema = NamedEntitySchema;
export type SpacesViewsCreateResponse = z.infer<
	typeof SpacesViewsCreateResponseSchema
>;

// ---------------------------------------------------------------------------
// Folders
// ---------------------------------------------------------------------------
export const FoldersListInputSchema = z.object({
	space_id: z.string(),
	archived: z.boolean().optional(),
});
export type FoldersListInput = z.infer<typeof FoldersListInputSchema>;

export const FoldersListResponseSchema = z
	.object({
		folders: z.array(NamedEntitySchema).optional(),
	})
	.passthrough();
export type FoldersListResponse = z.infer<typeof FoldersListResponseSchema>;

export const FoldersGetInputSchema = z.object({
	folder_id: z.string(),
});
export type FoldersGetInput = z.infer<typeof FoldersGetInputSchema>;

export const FoldersGetResponseSchema = NamedEntitySchema;
export type FoldersGetResponse = z.infer<typeof FoldersGetResponseSchema>;

export const FoldersCreateInputSchema = z.object({
	space_id: z.string(),
	name: z.string(),
});
export type FoldersCreateInput = z.infer<typeof FoldersCreateInputSchema>;

export const FoldersCreateResponseSchema = NamedEntitySchema;
export type FoldersCreateResponse = z.infer<typeof FoldersCreateResponseSchema>;

export const FoldersUpdateInputSchema = z.object({
	folder_id: z.string(),
	name: z.string(),
});
export type FoldersUpdateInput = z.infer<typeof FoldersUpdateInputSchema>;

export const FoldersUpdateResponseSchema = NamedEntitySchema;
export type FoldersUpdateResponse = z.infer<typeof FoldersUpdateResponseSchema>;

export const FoldersDeleteInputSchema = z.object({
	folder_id: z.string(),
});
export type FoldersDeleteInput = z.infer<typeof FoldersDeleteInputSchema>;

export const FoldersDeleteResponseSchema = z.undefined();
export type FoldersDeleteResponse = z.infer<typeof FoldersDeleteResponseSchema>;

export const FoldersViewsGetInputSchema = z.object({
	folder_id: z.string(),
});
export type FoldersViewsGetInput = z.infer<typeof FoldersViewsGetInputSchema>;

export const FoldersViewsGetResponseSchema = z
	.object({
		views: z.array(NamedEntitySchema).optional(),
	})
	.passthrough();
export type FoldersViewsGetResponse = z.infer<
	typeof FoldersViewsGetResponseSchema
>;

export const FoldersViewsCreateInputSchema = z.object({
	folder_id: z.string(),
	name: z.string(),
	type: ViewTypeSchema,
});
export type FoldersViewsCreateInput = z.infer<
	typeof FoldersViewsCreateInputSchema
>;

export const FoldersViewsCreateResponseSchema = NamedEntitySchema;
export type FoldersViewsCreateResponse = z.infer<
	typeof FoldersViewsCreateResponseSchema
>;

// ---------------------------------------------------------------------------
// Lists
// ---------------------------------------------------------------------------
export const ListsListInputSchema = z.object({
	folder_id: z.string(),
	archived: z.boolean().optional(),
});
export type ListsListInput = z.infer<typeof ListsListInputSchema>;

export const ListsListResponseSchema = z
	.object({
		lists: z.array(NamedEntitySchema).optional(),
	})
	.passthrough();
export type ListsListResponse = z.infer<typeof ListsListResponseSchema>;

export const ListsFolderlessInputSchema = z.object({
	space_id: z.string(),
	archived: z.boolean().optional(),
});
export type ListsFolderlessInput = z.infer<typeof ListsFolderlessInputSchema>;

export const ListsFolderlessResponseSchema = ListsListResponseSchema;
export type ListsFolderlessResponse = z.infer<
	typeof ListsFolderlessResponseSchema
>;

export const ListsGetInputSchema = z.object({
	list_id: z.string(),
});
export type ListsGetInput = z.infer<typeof ListsGetInputSchema>;

export const ListsGetResponseSchema = NamedEntitySchema;
export type ListsGetResponse = z.infer<typeof ListsGetResponseSchema>;

export const ListsCreateInputSchema = z.object({
	folder_id: z.string(),
	name: z.string(),
	content: z.string().optional(),
	due_date: z.number().optional(),
	priority: z.number().optional(),
	assignee: z.number().optional(),
});
export type ListsCreateInput = z.infer<typeof ListsCreateInputSchema>;

export const ListsCreateResponseSchema = NamedEntitySchema;
export type ListsCreateResponse = z.infer<typeof ListsCreateResponseSchema>;

export const ListsCreateFolderlessInputSchema = z.object({
	space_id: z.string(),
	name: z.string(),
	content: z.string().optional(),
	due_date: z.number().optional(),
	priority: z.number().optional(),
	assignee: z.number().optional(),
});
export type ListsCreateFolderlessInput = z.infer<
	typeof ListsCreateFolderlessInputSchema
>;

export const ListsCreateFolderlessResponseSchema = NamedEntitySchema;
export type ListsCreateFolderlessResponse = z.infer<
	typeof ListsCreateFolderlessResponseSchema
>;

export const ListsCreateFromTemplateInputSchema = z.object({
	folder_id: z.string(),
	template_id: z.string(),
});
export type ListsCreateFromTemplateInput = z.infer<
	typeof ListsCreateFromTemplateInputSchema
>;

export const ListsCreateFromTemplateResponseSchema = NamedEntitySchema;
export type ListsCreateFromTemplateResponse = z.infer<
	typeof ListsCreateFromTemplateResponseSchema
>;

export const ListsUpdateInputSchema = z.object({
	list_id: z.string(),
	name: z.string().optional(),
	content: z.string().optional(),
	due_date: z.number().optional(),
	priority: z.number().optional(),
	assignee: z.number().optional(),
});
export type ListsUpdateInput = z.infer<typeof ListsUpdateInputSchema>;

export const ListsUpdateResponseSchema = NamedEntitySchema;
export type ListsUpdateResponse = z.infer<typeof ListsUpdateResponseSchema>;

export const ListsDeleteInputSchema = z.object({
	list_id: z.string(),
});
export type ListsDeleteInput = z.infer<typeof ListsDeleteInputSchema>;

export const ListsDeleteResponseSchema = z.undefined();
export type ListsDeleteResponse = z.infer<typeof ListsDeleteResponseSchema>;

export const ListsMembersInputSchema = z.object({
	list_id: z.string(),
});
export type ListsMembersInput = z.infer<typeof ListsMembersInputSchema>;

export const ListsMembersResponseSchema = z
	.object({
		members: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();
export type ListsMembersResponse = z.infer<typeof ListsMembersResponseSchema>;

export const ListsCommentsGetInputSchema = z.object({
	list_id: z.string(),
	...CommentPaginationSchema,
});
export type ListsCommentsGetInput = z.infer<typeof ListsCommentsGetInputSchema>;

export const ListsCommentsGetResponseSchema = z
	.object({
		comments: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();
export type ListsCommentsGetResponse = z.infer<
	typeof ListsCommentsGetResponseSchema
>;

export const ListsCommentsCreateInputSchema = z.object({
	list_id: z.string(),
	comment_text: z.string(),
	assignee: z.number().optional(),
	notify_all: z.boolean().optional(),
});
export type ListsCommentsCreateInput = z.infer<
	typeof ListsCommentsCreateInputSchema
>;

export const ListsCommentsCreateResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type ListsCommentsCreateResponse = z.infer<
	typeof ListsCommentsCreateResponseSchema
>;

export const ListsViewsGetInputSchema = z.object({
	list_id: z.string(),
});
export type ListsViewsGetInput = z.infer<typeof ListsViewsGetInputSchema>;

export const ListsViewsGetResponseSchema = z
	.object({
		views: z.array(NamedEntitySchema).optional(),
	})
	.passthrough();
export type ListsViewsGetResponse = z.infer<typeof ListsViewsGetResponseSchema>;

export const ListsViewsCreateInputSchema = z.object({
	list_id: z.string(),
	name: z.string(),
	type: ViewTypeSchema,
});
export type ListsViewsCreateInput = z.infer<typeof ListsViewsCreateInputSchema>;

export const ListsViewsCreateResponseSchema = NamedEntitySchema;
export type ListsViewsCreateResponse = z.infer<
	typeof ListsViewsCreateResponseSchema
>;

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------
export const TasksListInputSchema = z.object({
	list_id: z.string(),
	page: z.number().int().nonnegative().optional(),
	archived: z.boolean().optional(),
	subtasks: z.boolean().optional(),
	include_closed: z.boolean().optional(),
	statuses: z.array(z.string()).optional(),
	assignees: z.array(z.number()).optional(),
	tags: z.array(z.string()).optional(),
	order_by: z.string().optional(),
});
export type TasksListInput = z.infer<typeof TasksListInputSchema>;

export const TasksListResponseSchema = z
	.object({
		tasks: z.array(NamedEntitySchema).optional(),
		last_page: z.boolean().optional(),
	})
	.passthrough();
export type TasksListResponse = z.infer<typeof TasksListResponseSchema>;

export const TasksFilteredTeamInputSchema = z.object({
	team_id: z.string(),
	page: z.number().int().nonnegative().optional(),
	space_ids: z.array(z.string()).optional(),
	project_ids: z.array(z.string()).optional(),
	list_ids: z.array(z.string()).optional(),
	statuses: z.array(z.string()).optional(),
	assignees: z.array(z.number()).optional(),
	tags: z.array(z.string()).optional(),
	parent: z.string().optional(),
	subtasks: z.boolean().optional(),
});
export type TasksFilteredTeamInput = z.infer<
	typeof TasksFilteredTeamInputSchema
>;

export const TasksFilteredTeamResponseSchema = TasksListResponseSchema;
export type TasksFilteredTeamResponse = z.infer<
	typeof TasksFilteredTeamResponseSchema
>;

export const TasksGetInputSchema = z.object({
	task_id: z.string(),
	custom_task_ids: z.boolean().optional(),
	team_id: z.string().optional(),
	include_subtasks: z.boolean().optional(),
});
export type TasksGetInput = z.infer<typeof TasksGetInputSchema>;

export const TasksGetResponseSchema = z
	.object({
		id: z.string(),
		name: z.string(),
	})
	.passthrough();
export type TasksGetResponse = z.infer<typeof TasksGetResponseSchema>;

export const TasksCreateInputSchema = z.object({
	list_id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	markdown_content: z.string().optional(),
	assignees: z.array(z.number()).optional(),
	status: z.string().optional(),
	priority: z.number().optional(),
	due_date: z.number().optional(),
	due_date_time: z.boolean().optional(),
	time_estimate: z.number().optional(),
	start_date: z.number().optional(),
	start_date_time: z.boolean().optional(),
	notify_all: z.boolean().optional(),
	parent: z.string().optional(),
	links_to: z.string().optional(),
	// unknown: ClickUp custom field values are field-type-specific per list definition.
	custom_fields: z.array(z.record(z.string(), z.unknown())).optional(),
});
export type TasksCreateInput = z.infer<typeof TasksCreateInputSchema>;

export const TasksCreateResponseSchema = TasksGetResponseSchema;
export type TasksCreateResponse = z.infer<typeof TasksCreateResponseSchema>;

export const TasksUpdateInputSchema = z
	.object({
		task_id: z.string(),
		name: z.string().optional(),
		description: z.string().optional(),
		status: z.string().optional(),
		priority: z.number().optional(),
		due_date: z.number().optional(),
		due_date_time: z.boolean().optional(),
		time_estimate: z.number().optional(),
		start_date: z.number().optional(),
		start_date_time: z.boolean().optional(),
		assignees: z.array(z.number()).optional(),
		archived: z.boolean().optional(),
		parent: z.string().optional(),
	})
	.refine(
		({ task_id: _taskId, ...changes }) =>
			Object.values(changes).some((value) => value !== undefined),
		{ error: 'Provide at least one field to update' },
	);
export type TasksUpdateInput = z.infer<typeof TasksUpdateInputSchema>;

export const TasksUpdateResponseSchema = TasksGetResponseSchema;
export type TasksUpdateResponse = z.infer<typeof TasksUpdateResponseSchema>;

export const TasksDeleteInputSchema = z.object({
	task_id: z.string(),
	custom_task_ids: z.boolean().optional(),
	team_id: z.string().optional(),
});
export type TasksDeleteInput = z.infer<typeof TasksDeleteInputSchema>;

export const TasksDeleteResponseSchema = z.undefined();
export type TasksDeleteResponse = z.infer<typeof TasksDeleteResponseSchema>;

export const TasksCreateFromTemplateInputSchema = z.object({
	list_id: z.string(),
	template_id: z.string(),
	name: z.string(),
});
export type TasksCreateFromTemplateInput = z.infer<
	typeof TasksCreateFromTemplateInputSchema
>;

export const TasksCreateFromTemplateResponseSchema = TasksGetResponseSchema;
export type TasksCreateFromTemplateResponse = z.infer<
	typeof TasksCreateFromTemplateResponseSchema
>;

export const TasksMoveToHomeListInputSchema = z.object({
	workspace_id: z.string(),
	task_id: z.string(),
	list_id: z.string(),
	move_custom_fields: z.boolean().optional(),
	custom_fields_to_move: z.array(z.string()).optional(),
});
export type TasksMoveToHomeListInput = z.infer<
	typeof TasksMoveToHomeListInputSchema
>;

export const TasksMoveToHomeListResponseSchema = TasksGetResponseSchema;
export type TasksMoveToHomeListResponse = z.infer<
	typeof TasksMoveToHomeListResponseSchema
>;

export const TasksMembersInputSchema = z.object({
	task_id: z.string(),
});
export type TasksMembersInput = z.infer<typeof TasksMembersInputSchema>;

export const TasksMembersResponseSchema = z
	.object({
		members: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();
export type TasksMembersResponse = z.infer<typeof TasksMembersResponseSchema>;

export const TasksTimeInStatusInputSchema = z.object({
	task_id: z.string(),
});
export type TasksTimeInStatusInput = z.infer<
	typeof TasksTimeInStatusInputSchema
>;

export const TasksTimeInStatusResponseSchema = z.object({}).passthrough();
export type TasksTimeInStatusResponse = z.infer<
	typeof TasksTimeInStatusResponseSchema
>;

export const TasksBulkTimeInStatusInputSchema = z.object({
	task_ids: z.array(z.string()),
});
export type TasksBulkTimeInStatusInput = z.infer<
	typeof TasksBulkTimeInStatusInputSchema
>;

export const TasksBulkTimeInStatusResponseSchema = z.object({}).passthrough();
export type TasksBulkTimeInStatusResponse = z.infer<
	typeof TasksBulkTimeInStatusResponseSchema
>;

export const TasksTemplatesInputSchema = z.object({
	team_id: z.string(),
	page: z.number().int().nonnegative().optional(),
});
export type TasksTemplatesInput = z.infer<typeof TasksTemplatesInputSchema>;

export const TasksTemplatesResponseSchema = z
	.object({
		templates: z.array(NamedEntitySchema).optional(),
	})
	.passthrough();
export type TasksTemplatesResponse = z.infer<
	typeof TasksTemplatesResponseSchema
>;

export const TasksTrackedTimeGetInputSchema = z.object({
	task_id: z.string(),
});
export type TasksTrackedTimeGetInput = z.infer<
	typeof TasksTrackedTimeGetInputSchema
>;

export const TasksTrackedTimeGetResponseSchema = z.object({}).passthrough();
export type TasksTrackedTimeGetResponse = z.infer<
	typeof TasksTrackedTimeGetResponseSchema
>;

export const TasksTrackedTimeCreateInputSchema = z.object({
	task_id: z.string(),
	start: z.number().optional(),
	end: z.number().optional(),
	billable: z.boolean().optional(),
	description: z.string().optional(),
	assignee: z.number().optional(),
});
export type TasksTrackedTimeCreateInput = z.infer<
	typeof TasksTrackedTimeCreateInputSchema
>;

export const TasksTrackedTimeCreateResponseSchema = z.object({}).passthrough();
export type TasksTrackedTimeCreateResponse = z.infer<
	typeof TasksTrackedTimeCreateResponseSchema
>;

export const TasksTrackedTimeUpdateInputSchema = z.object({
	task_id: z.string(),
	interval_id: z.string(),
	start: z.number().optional(),
	end: z.number().optional(),
	description: z.string().optional(),
});
export type TasksTrackedTimeUpdateInput = z.infer<
	typeof TasksTrackedTimeUpdateInputSchema
>;

export const TasksTrackedTimeUpdateResponseSchema = z.object({}).passthrough();
export type TasksTrackedTimeUpdateResponse = z.infer<
	typeof TasksTrackedTimeUpdateResponseSchema
>;

export const TasksTrackedTimeDeleteInputSchema = z.object({
	task_id: z.string(),
	interval_id: z.string(),
});
export type TasksTrackedTimeDeleteInput = z.infer<
	typeof TasksTrackedTimeDeleteInputSchema
>;

export const TasksTrackedTimeDeleteResponseSchema = z.undefined();
export type TasksTrackedTimeDeleteResponse = z.infer<
	typeof TasksTrackedTimeDeleteResponseSchema
>;

export const TasksTagsAddInputSchema = z.object({
	task_id: z.string(),
	tag_name: z.string(),
	custom_task_ids: z.boolean().optional(),
	team_id: z.string().optional(),
});
export type TasksTagsAddInput = z.infer<typeof TasksTagsAddInputSchema>;

export const TasksTagsAddResponseSchema = z.object({}).passthrough();
export type TasksTagsAddResponse = z.infer<typeof TasksTagsAddResponseSchema>;

export const TasksTagsRemoveInputSchema = z.object({
	task_id: z.string(),
	tag_name: z.string(),
	custom_task_ids: z.boolean().optional(),
	team_id: z.string().optional(),
});
export type TasksTagsRemoveInput = z.infer<typeof TasksTagsRemoveInputSchema>;

export const TasksTagsRemoveResponseSchema = z.object({}).passthrough();
export type TasksTagsRemoveResponse = z.infer<
	typeof TasksTagsRemoveResponseSchema
>;

export const TasksAttachmentsCreateInputSchema = z.object({
	task_id: z.string(),
	filename: z.string(),
	content_type: z.string().optional(),
	file_base64: z.string(),
});
export type TasksAttachmentsCreateInput = z.infer<
	typeof TasksAttachmentsCreateInputSchema
>;

export const TasksAttachmentsCreateResponseSchema = z
	.object({
		id: z.string().optional(),
	})
	.passthrough();
export type TasksAttachmentsCreateResponse = z.infer<
	typeof TasksAttachmentsCreateResponseSchema
>;

// ---------------------------------------------------------------------------
// Dependencies
// ---------------------------------------------------------------------------
const DependencyFieldsSchema = {
	depends_on: z.string().optional(),
	dependency_of: z.string().optional(),
	custom_task_ids: z.boolean().optional(),
	team_id: z.string().optional(),
};

export const DependenciesAddInputSchema = z
	.object({
		task_id: z.string(),
		...DependencyFieldsSchema,
	})
	.refine(
		({ depends_on, dependency_of }) =>
			(depends_on === undefined) !== (dependency_of === undefined),
		{ error: 'Provide exactly one of depends_on or dependency_of' },
	);
export type DependenciesAddInput = z.infer<typeof DependenciesAddInputSchema>;

export const DependenciesAddResponseSchema = z.object({}).passthrough();
export type DependenciesAddResponse = z.infer<
	typeof DependenciesAddResponseSchema
>;

export const DependenciesDeleteInputSchema = z
	.object({
		task_id: z.string(),
		...DependencyFieldsSchema,
	})
	.refine(
		({ depends_on, dependency_of }) =>
			(depends_on === undefined) !== (dependency_of === undefined),
		{ error: 'Provide exactly one of depends_on or dependency_of' },
	);
export type DependenciesDeleteInput = z.infer<
	typeof DependenciesDeleteInputSchema
>;

export const DependenciesDeleteResponseSchema = z.object({}).passthrough();
export type DependenciesDeleteResponse = z.infer<
	typeof DependenciesDeleteResponseSchema
>;

// ---------------------------------------------------------------------------
// Task links
// ---------------------------------------------------------------------------
export const TaskLinksAddInputSchema = z.object({
	task_id: z.string(),
	links_to: z.string(),
	custom_task_ids: z.boolean().optional(),
	team_id: z.string().optional(),
});
export type TaskLinksAddInput = z.infer<typeof TaskLinksAddInputSchema>;

export const TaskLinksAddResponseSchema = z.object({}).passthrough();
export type TaskLinksAddResponse = z.infer<typeof TaskLinksAddResponseSchema>;

export const TaskLinksDeleteInputSchema = z.object({
	task_id: z.string(),
	links_to: z.string(),
	custom_task_ids: z.boolean().optional(),
	team_id: z.string().optional(),
});
export type TaskLinksDeleteInput = z.infer<typeof TaskLinksDeleteInputSchema>;

export const TaskLinksDeleteResponseSchema = z.object({}).passthrough();
export type TaskLinksDeleteResponse = z.infer<
	typeof TaskLinksDeleteResponseSchema
>;

// ---------------------------------------------------------------------------
// Tasks in multiple lists
// ---------------------------------------------------------------------------
export const TaskListsAddInputSchema = z.object({
	list_id: z.string(),
	task_id: z.string(),
});
export type TaskListsAddInput = z.infer<typeof TaskListsAddInputSchema>;

export const TaskListsAddResponseSchema = z.object({}).passthrough();
export type TaskListsAddResponse = z.infer<typeof TaskListsAddResponseSchema>;

export const TaskListsRemoveInputSchema = z.object({
	list_id: z.string(),
	task_id: z.string(),
});
export type TaskListsRemoveInput = z.infer<typeof TaskListsRemoveInputSchema>;

export const TaskListsRemoveResponseSchema = z.object({}).passthrough();
export type TaskListsRemoveResponse = z.infer<
	typeof TaskListsRemoveResponseSchema
>;

// ---------------------------------------------------------------------------
// Checklists
// ---------------------------------------------------------------------------
export const ChecklistsCreateInputSchema = z.object({
	task_id: z.string(),
	name: z.string(),
	custom_task_ids: z.boolean().optional(),
	team_id: z.string().optional(),
});
export type ChecklistsCreateInput = z.infer<typeof ChecklistsCreateInputSchema>;

export const ChecklistsCreateResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type ChecklistsCreateResponse = z.infer<
	typeof ChecklistsCreateResponseSchema
>;

export const ChecklistsUpdateInputSchema = z.object({
	checklist_id: z.string(),
	name: z.string().optional(),
	position: z.number().optional(),
});
export type ChecklistsUpdateInput = z.infer<typeof ChecklistsUpdateInputSchema>;

export const ChecklistsUpdateResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type ChecklistsUpdateResponse = z.infer<
	typeof ChecklistsUpdateResponseSchema
>;

export const ChecklistsDeleteInputSchema = z.object({
	checklist_id: z.string(),
});
export type ChecklistsDeleteInput = z.infer<typeof ChecklistsDeleteInputSchema>;

export const ChecklistsDeleteResponseSchema = z.undefined();
export type ChecklistsDeleteResponse = z.infer<
	typeof ChecklistsDeleteResponseSchema
>;

export const ChecklistItemsCreateInputSchema = z.object({
	checklist_id: z.string(),
	name: z.string().optional(),
	assignee: z.number().optional(),
});
export type ChecklistItemsCreateInput = z.infer<
	typeof ChecklistItemsCreateInputSchema
>;

export const ChecklistItemsCreateResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type ChecklistItemsCreateResponse = z.infer<
	typeof ChecklistItemsCreateResponseSchema
>;

export const ChecklistItemsUpdateInputSchema = z.object({
	checklist_id: z.string(),
	checklist_item_id: z.string(),
	name: z.string().optional(),
	assignee: z.number().optional(),
	resolved: z.boolean().optional(),
	parent: z.string().optional(),
});
export type ChecklistItemsUpdateInput = z.infer<
	typeof ChecklistItemsUpdateInputSchema
>;

export const ChecklistItemsUpdateResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type ChecklistItemsUpdateResponse = z.infer<
	typeof ChecklistItemsUpdateResponseSchema
>;

export const ChecklistItemsDeleteInputSchema = z.object({
	checklist_id: z.string(),
	checklist_item_id: z.string(),
});
export type ChecklistItemsDeleteInput = z.infer<
	typeof ChecklistItemsDeleteInputSchema
>;

export const ChecklistItemsDeleteResponseSchema = z.undefined();
export type ChecklistItemsDeleteResponse = z.infer<
	typeof ChecklistItemsDeleteResponseSchema
>;

// ---------------------------------------------------------------------------
// Task comments (incl. threaded)
// ---------------------------------------------------------------------------
export const TaskCommentsGetInputSchema = z.object({
	task_id: z.string(),
	...CommentPaginationSchema,
});
export type TaskCommentsGetInput = z.infer<typeof TaskCommentsGetInputSchema>;

export const TaskCommentsGetResponseSchema = z
	.object({
		comments: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();
export type TaskCommentsGetResponse = z.infer<
	typeof TaskCommentsGetResponseSchema
>;

export const TaskCommentsCreateInputSchema = z.object({
	task_id: z.string(),
	comment_text: z.string(),
	assignee: z.number().optional(),
	notify_all: z.boolean().optional(),
	custom_task_ids: z.boolean().optional(),
	team_id: z.string().optional(),
});
export type TaskCommentsCreateInput = z.infer<
	typeof TaskCommentsCreateInputSchema
>;

export const TaskCommentsCreateResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type TaskCommentsCreateResponse = z.infer<
	typeof TaskCommentsCreateResponseSchema
>;

export const TaskCommentsUpdateInputSchema = z.object({
	comment_id: z.string(),
	comment_text: z.string().optional(),
	assignee: z.number().optional(),
	resolved: z.boolean().optional(),
});
export type TaskCommentsUpdateInput = z.infer<
	typeof TaskCommentsUpdateInputSchema
>;

export const TaskCommentsUpdateResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type TaskCommentsUpdateResponse = z.infer<
	typeof TaskCommentsUpdateResponseSchema
>;

export const TaskCommentsDeleteInputSchema = z.object({
	comment_id: z.string(),
});
export type TaskCommentsDeleteInput = z.infer<
	typeof TaskCommentsDeleteInputSchema
>;

export const TaskCommentsDeleteResponseSchema = z.undefined();
export type TaskCommentsDeleteResponse = z.infer<
	typeof TaskCommentsDeleteResponseSchema
>;

export const ThreadedCommentsCreateInputSchema = z.object({
	comment_id: z.string(),
	comment_text: z.string(),
	assignee: z.number().optional(),
	notify_all: z.boolean().optional(),
});
export type ThreadedCommentsCreateInput = z.infer<
	typeof ThreadedCommentsCreateInputSchema
>;

export const ThreadedCommentsCreateResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type ThreadedCommentsCreateResponse = z.infer<
	typeof ThreadedCommentsCreateResponseSchema
>;

export const ThreadedCommentsGetInputSchema = z.object({
	comment_id: z.string(),
});
export type ThreadedCommentsGetInput = z.infer<
	typeof ThreadedCommentsGetInputSchema
>;

export const ThreadedCommentsGetResponseSchema = z
	.object({
		comments: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();
export type ThreadedCommentsGetResponse = z.infer<
	typeof ThreadedCommentsGetResponseSchema
>;

// ---------------------------------------------------------------------------
// Custom fields
// ---------------------------------------------------------------------------
export const CustomFieldsAccessibleInputSchema = z.object({
	list_id: z.string(),
});
export type CustomFieldsAccessibleInput = z.infer<
	typeof CustomFieldsAccessibleInputSchema
>;

export const CustomFieldsAccessibleResponseSchema = z
	.object({
		fields: z.array(NamedEntitySchema).optional(),
	})
	.passthrough();
export type CustomFieldsAccessibleResponse = z.infer<
	typeof CustomFieldsAccessibleResponseSchema
>;

export const CustomFieldsFolderFieldsInputSchema = z.object({
	folder_id: z.string(),
});
export type CustomFieldsFolderFieldsInput = z.infer<
	typeof CustomFieldsFolderFieldsInputSchema
>;

export const CustomFieldsFolderFieldsResponseSchema =
	CustomFieldsAccessibleResponseSchema;
export type CustomFieldsFolderFieldsResponse = z.infer<
	typeof CustomFieldsFolderFieldsResponseSchema
>;

export const CustomFieldsSetValueInputSchema = z.object({
	task_id: z.string(),
	field_id: z.string(),
	custom_task_ids: z.boolean().optional(),
	team_id: z.string().optional(),
	// unknown: value shape depends on the Custom Field type (text, number,
	// currency with value_options, dropdown, date, etc.).
	value: z.unknown(),
});
export type CustomFieldsSetValueInput = z.infer<
	typeof CustomFieldsSetValueInputSchema
>;

export const CustomFieldsSetValueResponseSchema = z.object({}).passthrough();
export type CustomFieldsSetValueResponse = z.infer<
	typeof CustomFieldsSetValueResponseSchema
>;

export const CustomFieldsRemoveValueInputSchema = z.object({
	task_id: z.string(),
	field_id: z.string(),
	custom_task_ids: z.boolean().optional(),
	team_id: z.string().optional(),
});
export type CustomFieldsRemoveValueInput = z.infer<
	typeof CustomFieldsRemoveValueInputSchema
>;

export const CustomFieldsRemoveValueResponseSchema = z.object({}).passthrough();
export type CustomFieldsRemoveValueResponse = z.infer<
	typeof CustomFieldsRemoveValueResponseSchema
>;

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------
export const ViewsGetInputSchema = z.object({
	view_id: z.string(),
});
export type ViewsGetInput = z.infer<typeof ViewsGetInputSchema>;

export const ViewsGetResponseSchema = NamedEntitySchema;
export type ViewsGetResponse = z.infer<typeof ViewsGetResponseSchema>;

export const ViewsUpdateInputSchema = z.object({
	view_id: z.string(),
	name: z.string().optional(),
	type: ViewTypeSchema.optional(),
});
export type ViewsUpdateInput = z.infer<typeof ViewsUpdateInputSchema>;

export const ViewsUpdateResponseSchema = NamedEntitySchema;
export type ViewsUpdateResponse = z.infer<typeof ViewsUpdateResponseSchema>;

export const ViewsDeleteInputSchema = z.object({
	view_id: z.string(),
});
export type ViewsDeleteInput = z.infer<typeof ViewsDeleteInputSchema>;

export const ViewsDeleteResponseSchema = z.undefined();
export type ViewsDeleteResponse = z.infer<typeof ViewsDeleteResponseSchema>;

export const ViewsTasksInputSchema = z.object({
	view_id: z.string(),
	page: z.number().int().nonnegative().optional(),
});
export type ViewsTasksInput = z.infer<typeof ViewsTasksInputSchema>;

export const ViewsTasksResponseSchema = TasksListResponseSchema;
export type ViewsTasksResponse = z.infer<typeof ViewsTasksResponseSchema>;

export const ViewsChatCommentsGetInputSchema = z.object({
	view_id: z.string(),
	...CommentPaginationSchema,
});
export type ViewsChatCommentsGetInput = z.infer<
	typeof ViewsChatCommentsGetInputSchema
>;

export const ViewsChatCommentsGetResponseSchema = z
	.object({
		comments: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();
export type ViewsChatCommentsGetResponse = z.infer<
	typeof ViewsChatCommentsGetResponseSchema
>;

export const ViewsChatCommentsCreateInputSchema = z.object({
	view_id: z.string(),
	comment_text: z.string(),
	assignee: z.number().optional(),
	notify_all: z.boolean().optional(),
});
export type ViewsChatCommentsCreateInput = z.infer<
	typeof ViewsChatCommentsCreateInputSchema
>;

export const ViewsChatCommentsCreateResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type ViewsChatCommentsCreateResponse = z.infer<
	typeof ViewsChatCommentsCreateResponseSchema
>;

// ---------------------------------------------------------------------------
// Goals & key results
// ---------------------------------------------------------------------------
export const GoalsListInputSchema = z.object({
	team_id: z.string(),
});
export type GoalsListInput = z.infer<typeof GoalsListInputSchema>;

export const GoalsListResponseSchema = z
	.object({
		goals: z.array(NamedEntitySchema).optional(),
	})
	.passthrough();
export type GoalsListResponse = z.infer<typeof GoalsListResponseSchema>;

export const GoalsGetInputSchema = z.object({
	goal_id: z.string(),
});
export type GoalsGetInput = z.infer<typeof GoalsGetInputSchema>;

export const GoalsGetResponseSchema = NamedEntitySchema;
export type GoalsGetResponse = z.infer<typeof GoalsGetResponseSchema>;

export const GoalsCreateInputSchema = z.object({
	team_id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	due_date: z.number().optional(),
	color: z.string().optional(),
	owners: z.array(z.number()).optional(),
	multiple_owners: z.boolean().optional(),
});
export type GoalsCreateInput = z.infer<typeof GoalsCreateInputSchema>;

export const GoalsCreateResponseSchema = NamedEntitySchema;
export type GoalsCreateResponse = z.infer<typeof GoalsCreateResponseSchema>;

export const GoalsUpdateInputSchema = z.object({
	goal_id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	due_date: z.number().optional(),
	color: z.string().optional(),
});
export type GoalsUpdateInput = z.infer<typeof GoalsUpdateInputSchema>;

export const GoalsUpdateResponseSchema = NamedEntitySchema;
export type GoalsUpdateResponse = z.infer<typeof GoalsUpdateResponseSchema>;

export const GoalsDeleteInputSchema = z.object({
	goal_id: z.string(),
});
export type GoalsDeleteInput = z.infer<typeof GoalsDeleteInputSchema>;

export const GoalsDeleteResponseSchema = z.undefined();
export type GoalsDeleteResponse = z.infer<typeof GoalsDeleteResponseSchema>;

const KeyResultTypeSchema = z.enum([
	'number',
	'currency',
	'boolean',
	'percentage',
	'automatic',
]);

export const KeyResultsCreateInputSchema = z.object({
	goal_id: z.string(),
	name: z.string(),
	owners: z.array(z.number()),
	type: KeyResultTypeSchema,
	steps_start: z.number().optional(),
	steps_end: z.number().optional(),
	unit: z.string().optional(),
	task_ids: z.array(z.string()).optional(),
	list_ids: z.array(z.string()).optional(),
});
export type KeyResultsCreateInput = z.infer<typeof KeyResultsCreateInputSchema>;

export const KeyResultsCreateResponseSchema = NamedEntitySchema;
export type KeyResultsCreateResponse = z.infer<
	typeof KeyResultsCreateResponseSchema
>;

export const KeyResultsUpdateInputSchema = z.object({
	key_result_id: z.string(),
	steps_current: z.number().optional(),
	note: z.string().optional(),
});
export type KeyResultsUpdateInput = z.infer<typeof KeyResultsUpdateInputSchema>;

export const KeyResultsUpdateResponseSchema = NamedEntitySchema;
export type KeyResultsUpdateResponse = z.infer<
	typeof KeyResultsUpdateResponseSchema
>;

export const KeyResultsDeleteInputSchema = z.object({
	key_result_id: z.string(),
});
export type KeyResultsDeleteInput = z.infer<typeof KeyResultsDeleteInputSchema>;

export const KeyResultsDeleteResponseSchema = z.undefined();
export type KeyResultsDeleteResponse = z.infer<
	typeof KeyResultsDeleteResponseSchema
>;

// ---------------------------------------------------------------------------
// Time entries
// ---------------------------------------------------------------------------
export const TimeEntriesRangeInputSchema = z.object({
	team_id: z.string(),
	start_date: z.number().optional(),
	end_date: z.number().optional(),
	assignee: z.number().optional(),
	space_id: z.string().optional(),
	folder_id: z.string().optional(),
	list_id: z.string().optional(),
	task_id: z.string().optional(),
});
export type TimeEntriesRangeInput = z.infer<typeof TimeEntriesRangeInputSchema>;

export const TimeEntriesRangeResponseSchema = z
	.object({
		data: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();
export type TimeEntriesRangeResponse = z.infer<
	typeof TimeEntriesRangeResponseSchema
>;

export const TimeEntriesGetInputSchema = z.object({
	team_id: z.string(),
	timer_id: z.string(),
});
export type TimeEntriesGetInput = z.infer<typeof TimeEntriesGetInputSchema>;

export const TimeEntriesGetResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type TimeEntriesGetResponse = z.infer<
	typeof TimeEntriesGetResponseSchema
>;

export const TimeEntriesCreateInputSchema = z.object({
	team_id: z.string(),
	start: z.number().optional(),
	end: z.number().optional(),
	duration: z.number().optional(),
	description: z.string().optional(),
	tid: z.string().optional(),
	billable: z.boolean().optional(),
	tags: z.array(z.string()).optional(),
});
export type TimeEntriesCreateInput = z.infer<
	typeof TimeEntriesCreateInputSchema
>;

export const TimeEntriesCreateResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type TimeEntriesCreateResponse = z.infer<
	typeof TimeEntriesCreateResponseSchema
>;

export const TimeEntriesUpdateInputSchema = z.object({
	team_id: z.string(),
	timer_id: z.string(),
	description: z.string().optional(),
	start: z.number().optional(),
	end: z.number().optional(),
	duration: z.number().optional(),
	tid: z.string().optional(),
	billable: z.boolean().optional(),
	tags: z.array(z.string()).optional(),
	tag_action: z.string().optional(),
});
export type TimeEntriesUpdateInput = z.infer<
	typeof TimeEntriesUpdateInputSchema
>;

export const TimeEntriesUpdateResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type TimeEntriesUpdateResponse = z.infer<
	typeof TimeEntriesUpdateResponseSchema
>;

export const TimeEntriesDeleteInputSchema = z.object({
	team_id: z.string(),
	timer_id: z.string(),
});
export type TimeEntriesDeleteInput = z.infer<
	typeof TimeEntriesDeleteInputSchema
>;

export const TimeEntriesDeleteResponseSchema = z.undefined();
export type TimeEntriesDeleteResponse = z.infer<
	typeof TimeEntriesDeleteResponseSchema
>;

export const TimeEntriesRunningInputSchema = z.object({
	team_id: z.string(),
});
export type TimeEntriesRunningInput = z.infer<
	typeof TimeEntriesRunningInputSchema
>;

export const TimeEntriesRunningResponseSchema = z
	.object({
		data: z.object({}).passthrough().nullable().optional(),
	})
	.passthrough();
export type TimeEntriesRunningResponse = z.infer<
	typeof TimeEntriesRunningResponseSchema
>;

export const TimeEntriesStartInputSchema = z.object({
	team_id: z.string(),
	tid: z.string().optional(),
	description: z.string().optional(),
	billable: z.boolean().optional(),
	tags: z.array(z.string()).optional(),
});
export type TimeEntriesStartInput = z.infer<typeof TimeEntriesStartInputSchema>;

export const TimeEntriesStartResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type TimeEntriesStartResponse = z.infer<
	typeof TimeEntriesStartResponseSchema
>;

export const TimeEntriesStopInputSchema = z.object({
	team_id: z.string(),
});
export type TimeEntriesStopInput = z.infer<typeof TimeEntriesStopInputSchema>;

export const TimeEntriesStopResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type TimeEntriesStopResponse = z.infer<
	typeof TimeEntriesStopResponseSchema
>;

export const TimeEntriesHistoryInputSchema = z.object({
	team_id: z.string(),
	timer_id: z.string(),
});
export type TimeEntriesHistoryInput = z.infer<
	typeof TimeEntriesHistoryInputSchema
>;

export const TimeEntriesHistoryResponseSchema = z
	.object({
		data: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();
export type TimeEntriesHistoryResponse = z.infer<
	typeof TimeEntriesHistoryResponseSchema
>;

export const TimeEntryTagsGetAllInputSchema = z.object({
	team_id: z.string(),
});
export type TimeEntryTagsGetAllInput = z.infer<
	typeof TimeEntryTagsGetAllInputSchema
>;

export const TimeEntryTagsGetAllResponseSchema = z
	.object({
		data: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();
export type TimeEntryTagsGetAllResponse = z.infer<
	typeof TimeEntryTagsGetAllResponseSchema
>;

export const TimeEntryTagsAddInputSchema = z.object({
	team_id: z.string(),
	tags: z.array(z.string()),
	timer_ids: z.array(z.string()),
});
export type TimeEntryTagsAddInput = z.infer<typeof TimeEntryTagsAddInputSchema>;

export const TimeEntryTagsAddResponseSchema = z.object({}).passthrough();
export type TimeEntryTagsAddResponse = z.infer<
	typeof TimeEntryTagsAddResponseSchema
>;

export const TimeEntryTagsRemoveInputSchema = z.object({
	team_id: z.string(),
	tags: z.array(z.string()),
	timer_ids: z.array(z.string()),
});
export type TimeEntryTagsRemoveInput = z.infer<
	typeof TimeEntryTagsRemoveInputSchema
>;

export const TimeEntryTagsRemoveResponseSchema = z.object({}).passthrough();
export type TimeEntryTagsRemoveResponse = z.infer<
	typeof TimeEntryTagsRemoveResponseSchema
>;

export const TimeEntryTagsUpdateInputSchema = z.object({
	team_id: z.string(),
	name: z.string(),
	new_name: z.string().optional(),
	background_color: z.string().optional(),
	foreground_color: z.string().optional(),
});
export type TimeEntryTagsUpdateInput = z.infer<
	typeof TimeEntryTagsUpdateInputSchema
>;

export const TimeEntryTagsUpdateResponseSchema = z.object({}).passthrough();
export type TimeEntryTagsUpdateResponse = z.infer<
	typeof TimeEntryTagsUpdateResponseSchema
>;

// ---------------------------------------------------------------------------
// Docs (v3)
// ---------------------------------------------------------------------------
const DocContentFormatSchema = z.enum(['text/md', 'text/plain']);

export const DocsSearchInputSchema = z.object({
	workspace_id: z.string(),
	creator: z.number().optional(),
	limit: z.number().int().positive().optional(),
});
export type DocsSearchInput = z.infer<typeof DocsSearchInputSchema>;

export const DocsSearchResponseSchema = z
	.object({
		docs: z.array(NamedEntitySchema).optional(),
	})
	.passthrough();
export type DocsSearchResponse = z.infer<typeof DocsSearchResponseSchema>;

export const DocsCreateInputSchema = z.object({
	workspace_id: z.string(),
	name: z.string(),
	parent: z.string().optional(),
	visibility: z.enum(['PUBLIC', 'PRIVATE']).optional(),
	create_page: z.boolean().optional(),
});
export type DocsCreateInput = z.infer<typeof DocsCreateInputSchema>;

export const DocsCreateResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type DocsCreateResponse = z.infer<typeof DocsCreateResponseSchema>;

export const DocsContentInputSchema = z.object({
	workspace_id: z.string(),
	doc_id: z.string(),
});
export type DocsContentInput = z.infer<typeof DocsContentInputSchema>;

export const DocsContentResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type DocsContentResponse = z.infer<typeof DocsContentResponseSchema>;

export const DocsPagesInputSchema = z.object({
	workspace_id: z.string(),
	doc_id: z.string(),
	max_page_depth: z.number().int().optional(),
	content_format: DocContentFormatSchema.optional(),
});
export type DocsPagesInput = z.infer<typeof DocsPagesInputSchema>;

export const DocsPagesResponseSchema = z
	.object({
		pages: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();
export type DocsPagesResponse = z.infer<typeof DocsPagesResponseSchema>;

export const DocsPageListingInputSchema = z.object({
	workspace_id: z.string(),
	doc_id: z.string(),
	max_page_depth: z.number().int().optional(),
});
export type DocsPageListingInput = z.infer<typeof DocsPageListingInputSchema>;

export const DocsPageListingResponseSchema = z
	.object({
		pages: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();
export type DocsPageListingResponse = z.infer<
	typeof DocsPageListingResponseSchema
>;

export const DocsPageContentInputSchema = z.object({
	workspace_id: z.string(),
	doc_id: z.string(),
	page_id: z.string(),
	content_format: DocContentFormatSchema.optional(),
});
export type DocsPageContentInput = z.infer<typeof DocsPageContentInputSchema>;

export const DocsPageContentResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type DocsPageContentResponse = z.infer<
	typeof DocsPageContentResponseSchema
>;

export const DocsCreatePageInputSchema = z.object({
	workspace_id: z.string(),
	doc_id: z.string(),
	name: z.string().optional(),
	content: z.string().optional(),
	content_format: DocContentFormatSchema.optional(),
	parent_page_id: z.string().optional(),
});
export type DocsCreatePageInput = z.infer<typeof DocsCreatePageInputSchema>;

export const DocsCreatePageResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type DocsCreatePageResponse = z.infer<
	typeof DocsCreatePageResponseSchema
>;

export const DocsUpdatePageInputSchema = z.object({
	workspace_id: z.string(),
	doc_id: z.string(),
	page_id: z.string(),
	name: z.string().optional(),
	sub_title: z.string().optional(),
	content: z.string().optional(),
	content_format: DocContentFormatSchema.optional(),
	content_edit_mode: z.enum(['replace', 'append', 'prepend']).optional(),
});
export type DocsUpdatePageInput = z.infer<typeof DocsUpdatePageInputSchema>;

export const DocsUpdatePageResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type DocsUpdatePageResponse = z.infer<
	typeof DocsUpdatePageResponseSchema
>;

// ---------------------------------------------------------------------------
// Chat (v3)
// ---------------------------------------------------------------------------
const ChatMessageIdSchema = z.union([z.string(), z.number()]);

export const ChatChannelsListInputSchema = z.object({
	workspace_id: z.string(),
	cursor: z.string().optional(),
	limit: z.number().int().positive().optional(),
	is_follower: z.boolean().optional(),
	include_closed: z.boolean().optional(),
});
export type ChatChannelsListInput = z.infer<typeof ChatChannelsListInputSchema>;

export const ChatChannelsListResponseSchema = z
	.object({
		channels: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();
export type ChatChannelsListResponse = z.infer<
	typeof ChatChannelsListResponseSchema
>;

export const ChatChannelsGetInputSchema = z.object({
	workspace_id: z.string(),
	channel_id: z.string(),
});
export type ChatChannelsGetInput = z.infer<typeof ChatChannelsGetInputSchema>;

export const ChatChannelsGetResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type ChatChannelsGetResponse = z.infer<
	typeof ChatChannelsGetResponseSchema
>;

export const ChatChannelsCreateInputSchema = z.object({
	workspace_id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	topic: z.string().optional(),
	visibility: z.string().optional(),
});
export type ChatChannelsCreateInput = z.infer<
	typeof ChatChannelsCreateInputSchema
>;

export const ChatChannelsCreateResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type ChatChannelsCreateResponse = z.infer<
	typeof ChatChannelsCreateResponseSchema
>;

export const ChatChannelsCreateLocationInputSchema = z.object({
	workspace_id: z.string(),
	space_id: z.string().optional(),
	folder_id: z.string().optional(),
	list_id: z.string().optional(),
	name: z.string().optional(),
});
export type ChatChannelsCreateLocationInput = z.infer<
	typeof ChatChannelsCreateLocationInputSchema
>;

export const ChatChannelsCreateLocationResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type ChatChannelsCreateLocationResponse = z.infer<
	typeof ChatChannelsCreateLocationResponseSchema
>;

export const ChatChannelsCreateDmInputSchema = z.object({
	workspace_id: z.string(),
	user_ids: z.array(z.number()).max(15).optional(),
});
export type ChatChannelsCreateDmInput = z.infer<
	typeof ChatChannelsCreateDmInputSchema
>;

export const ChatChannelsCreateDmResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type ChatChannelsCreateDmResponse = z.infer<
	typeof ChatChannelsCreateDmResponseSchema
>;

export const ChatChannelsUpdateInputSchema = z.object({
	workspace_id: z.string(),
	channel_id: z.string(),
	name: z.string().optional(),
	topic: z.string().optional(),
	description: z.string().optional(),
	visibility: z.string().optional(),
});
export type ChatChannelsUpdateInput = z.infer<
	typeof ChatChannelsUpdateInputSchema
>;

export const ChatChannelsUpdateResponseSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();
export type ChatChannelsUpdateResponse = z.infer<
	typeof ChatChannelsUpdateResponseSchema
>;

export const ChatChannelsDeleteInputSchema = z.object({
	workspace_id: z.string(),
	channel_id: z.string(),
});
export type ChatChannelsDeleteInput = z.infer<
	typeof ChatChannelsDeleteInputSchema
>;

export const ChatChannelsDeleteResponseSchema = z.undefined();
export type ChatChannelsDeleteResponse = z.infer<
	typeof ChatChannelsDeleteResponseSchema
>;

export const ChatChannelsMembersInputSchema = z.object({
	workspace_id: z.string(),
	channel_id: z.string(),
});
export type ChatChannelsMembersInput = z.infer<
	typeof ChatChannelsMembersInputSchema
>;

export const ChatChannelsMembersResponseSchema = z
	.object({
		members: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();
export type ChatChannelsMembersResponse = z.infer<
	typeof ChatChannelsMembersResponseSchema
>;

export const ChatChannelsFollowersInputSchema = z.object({
	workspace_id: z.string(),
	channel_id: z.string(),
	limit: z.number().int().positive().optional(),
});
export type ChatChannelsFollowersInput = z.infer<
	typeof ChatChannelsFollowersInputSchema
>;

export const ChatChannelsFollowersResponseSchema = z
	.object({
		followers: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();
export type ChatChannelsFollowersResponse = z.infer<
	typeof ChatChannelsFollowersResponseSchema
>;

export const ChatMessagesListInputSchema = z.object({
	workspace_id: z.string(),
	channel_id: z.string(),
	cursor: z.string().optional(),
	limit: z.number().int().positive().optional(),
	content_format: DocContentFormatSchema.optional(),
});
export type ChatMessagesListInput = z.infer<typeof ChatMessagesListInputSchema>;

export const ChatMessagesListResponseSchema = z
	.object({
		messages: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();
export type ChatMessagesListResponse = z.infer<
	typeof ChatMessagesListResponseSchema
>;

export const ChatMessagesCreateInputSchema = z.object({
	workspace_id: z.string(),
	channel_id: z.string(),
	type: z.enum(['message', 'post']),
	content: z.string(),
	assignee: z.number().optional(),
	followers: z.array(z.number()).optional(),
	content_format: DocContentFormatSchema.optional(),
});
export type ChatMessagesCreateInput = z.infer<
	typeof ChatMessagesCreateInputSchema
>;

export const ChatMessagesCreateResponseSchema = z.object({}).passthrough();
export type ChatMessagesCreateResponse = z.infer<
	typeof ChatMessagesCreateResponseSchema
>;

export const ChatMessagesUpdateInputSchema = z.object({
	workspace_id: z.string(),
	message_id: ChatMessageIdSchema,
	content: z.string().optional(),
	assignee: z.number().optional(),
	resolved: z.boolean().optional(),
});
export type ChatMessagesUpdateInput = z.infer<
	typeof ChatMessagesUpdateInputSchema
>;

export const ChatMessagesUpdateResponseSchema = z.object({}).passthrough();
export type ChatMessagesUpdateResponse = z.infer<
	typeof ChatMessagesUpdateResponseSchema
>;

export const ChatMessagesDeleteInputSchema = z.object({
	workspace_id: z.string(),
	message_id: ChatMessageIdSchema,
});
export type ChatMessagesDeleteInput = z.infer<
	typeof ChatMessagesDeleteInputSchema
>;

export const ChatMessagesDeleteResponseSchema = z.undefined();
export type ChatMessagesDeleteResponse = z.infer<
	typeof ChatMessagesDeleteResponseSchema
>;

export const ChatRepliesGetInputSchema = z.object({
	workspace_id: z.string(),
	message_id: ChatMessageIdSchema,
	cursor: z.string().optional(),
	limit: z.number().int().positive().optional(),
});
export type ChatRepliesGetInput = z.infer<typeof ChatRepliesGetInputSchema>;

export const ChatRepliesGetResponseSchema = z
	.object({
		replies: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();
export type ChatRepliesGetResponse = z.infer<
	typeof ChatRepliesGetResponseSchema
>;

export const ChatRepliesCreateInputSchema = z.object({
	workspace_id: z.string(),
	message_id: ChatMessageIdSchema,
	type: z.enum(['message', 'post']).optional(),
	content: z.string(),
});
export type ChatRepliesCreateInput = z.infer<
	typeof ChatRepliesCreateInputSchema
>;

export const ChatRepliesCreateResponseSchema = z.object({}).passthrough();
export type ChatRepliesCreateResponse = z.infer<
	typeof ChatRepliesCreateResponseSchema
>;

export const ChatReactionsGetInputSchema = z.object({
	workspace_id: z.string(),
	message_id: ChatMessageIdSchema,
	limit: z.number().int().positive().optional(),
});
export type ChatReactionsGetInput = z.infer<typeof ChatReactionsGetInputSchema>;

export const ChatReactionsGetResponseSchema = z
	.object({
		reactions: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();
export type ChatReactionsGetResponse = z.infer<
	typeof ChatReactionsGetResponseSchema
>;

export const ChatReactionsCreateInputSchema = z.object({
	workspace_id: z.string(),
	message_id: ChatMessageIdSchema,
	reaction: z.string(),
});
export type ChatReactionsCreateInput = z.infer<
	typeof ChatReactionsCreateInputSchema
>;

export const ChatReactionsCreateResponseSchema = z.object({}).passthrough();
export type ChatReactionsCreateResponse = z.infer<
	typeof ChatReactionsCreateResponseSchema
>;

export const ChatReactionsDeleteInputSchema = z.object({
	workspace_id: z.string(),
	message_id: ChatMessageIdSchema,
	reaction: z.string(),
});
export type ChatReactionsDeleteInput = z.infer<
	typeof ChatReactionsDeleteInputSchema
>;

export const ChatReactionsDeleteResponseSchema = z.undefined();
export type ChatReactionsDeleteResponse = z.infer<
	typeof ChatReactionsDeleteResponseSchema
>;

export const ChatTaggedUsersInputSchema = z.object({
	workspace_id: z.string(),
	message_id: ChatMessageIdSchema,
});
export type ChatTaggedUsersInput = z.infer<typeof ChatTaggedUsersInputSchema>;

export const ChatTaggedUsersResponseSchema = z
	.object({
		users: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();
export type ChatTaggedUsersResponse = z.infer<
	typeof ChatTaggedUsersResponseSchema
>;

export const ChatSubtypesInputSchema = z.object({
	workspace_id: z.string(),
	comment_type: z.enum(['post', 'ai', 'syncup', 'ai_via_brain']),
});
export type ChatSubtypesInput = z.infer<typeof ChatSubtypesInputSchema>;

export const ChatSubtypesResponseSchema = z
	.object({
		subtypes: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();
export type ChatSubtypesResponse = z.infer<typeof ChatSubtypesResponseSchema>;

// ---------------------------------------------------------------------------
// Users (Enterprise)
// ---------------------------------------------------------------------------
export const UsersGetInputSchema = z.object({
	team_id: z.string(),
	user_id: z.string(),
});
export type UsersGetInput = z.infer<typeof UsersGetInputSchema>;

export const UsersGetResponseSchema = z
	.object({
		user: z.object({}).passthrough().optional(),
	})
	.passthrough();
export type UsersGetResponse = z.infer<typeof UsersGetResponseSchema>;

export const UsersInviteInputSchema = z.object({
	team_id: z.string(),
	email: z.string(),
	admin: z.boolean().optional(),
	custom_role: z.string().optional(),
});
export type UsersInviteInput = z.infer<typeof UsersInviteInputSchema>;

export const UsersInviteResponseSchema = z
	.object({
		user: z.object({}).passthrough().optional(),
	})
	.passthrough();
export type UsersInviteResponse = z.infer<typeof UsersInviteResponseSchema>;

export const UsersUpdateInputSchema = z.object({
	team_id: z.string(),
	user_id: z.string(),
	username: z.string().optional(),
	admin: z.boolean().optional(),
	custom_role: z.string().optional(),
});
export type UsersUpdateInput = z.infer<typeof UsersUpdateInputSchema>;

export const UsersUpdateResponseSchema = z
	.object({
		user: z.object({}).passthrough().optional(),
	})
	.passthrough();
export type UsersUpdateResponse = z.infer<typeof UsersUpdateResponseSchema>;

export const UsersRemoveInputSchema = z.object({
	team_id: z.string(),
	user_id: z.string(),
});
export type UsersRemoveInput = z.infer<typeof UsersRemoveInputSchema>;

export const UsersRemoveResponseSchema = z.object({}).passthrough();
export type UsersRemoveResponse = z.infer<typeof UsersRemoveResponseSchema>;

// ---------------------------------------------------------------------------
// Guests (Enterprise)
// ---------------------------------------------------------------------------
const GuestFlagsSchema = {
	can_edit_tags: z.boolean().optional(),
	can_see_time_spent: z.boolean().optional(),
	can_see_time_estimated: z.boolean().optional(),
	can_create_views: z.boolean().optional(),
};

export const GuestsGetInputSchema = z.object({
	team_id: z.string(),
	guest_id: z.string(),
});
export type GuestsGetInput = z.infer<typeof GuestsGetInputSchema>;

export const GuestsGetResponseSchema = z
	.object({
		guest: z.object({}).passthrough().optional(),
	})
	.passthrough();
export type GuestsGetResponse = z.infer<typeof GuestsGetResponseSchema>;

export const GuestsInviteInputSchema = z.object({
	team_id: z.string(),
	email: z.string(),
	custom_role: z.string().optional(),
	...GuestFlagsSchema,
});
export type GuestsInviteInput = z.infer<typeof GuestsInviteInputSchema>;

export const GuestsInviteResponseSchema = z
	.object({
		guest: z.object({}).passthrough().optional(),
	})
	.passthrough();
export type GuestsInviteResponse = z.infer<typeof GuestsInviteResponseSchema>;

export const GuestsUpdateInputSchema = z.object({
	team_id: z.string(),
	guest_id: z.string(),
	username: z.string().optional(),
	custom_role: z.string().optional(),
	...GuestFlagsSchema,
});
export type GuestsUpdateInput = z.infer<typeof GuestsUpdateInputSchema>;

export const GuestsUpdateResponseSchema = z
	.object({
		guest: z.object({}).passthrough().optional(),
	})
	.passthrough();
export type GuestsUpdateResponse = z.infer<typeof GuestsUpdateResponseSchema>;

export const GuestsRemoveInputSchema = z.object({
	team_id: z.string(),
	guest_id: z.string(),
});
export type GuestsRemoveInput = z.infer<typeof GuestsRemoveInputSchema>;

export const GuestsRemoveResponseSchema = z.object({}).passthrough();
export type GuestsRemoveResponse = z.infer<typeof GuestsRemoveResponseSchema>;

export const GuestsAddToTaskInputSchema = z.object({
	task_id: z.string(),
	guest_id: z.string(),
	permission_level: z.number().optional(),
	custom_task_ids: z.boolean().optional(),
	team_id: z.string().optional(),
});
export type GuestsAddToTaskInput = z.infer<typeof GuestsAddToTaskInputSchema>;

export const GuestsAddToTaskResponseSchema = z.object({}).passthrough();
export type GuestsAddToTaskResponse = z.infer<
	typeof GuestsAddToTaskResponseSchema
>;

export const GuestsRemoveFromTaskInputSchema = z.object({
	task_id: z.string(),
	guest_id: z.string(),
	custom_task_ids: z.boolean().optional(),
	team_id: z.string().optional(),
});
export type GuestsRemoveFromTaskInput = z.infer<
	typeof GuestsRemoveFromTaskInputSchema
>;

export const GuestsRemoveFromTaskResponseSchema = z.object({}).passthrough();
export type GuestsRemoveFromTaskResponse = z.infer<
	typeof GuestsRemoveFromTaskResponseSchema
>;

export const GuestsAddToListInputSchema = z.object({
	list_id: z.string(),
	guest_id: z.string(),
	permission_level: z.number().optional(),
});
export type GuestsAddToListInput = z.infer<typeof GuestsAddToListInputSchema>;

export const GuestsAddToListResponseSchema = z.object({}).passthrough();
export type GuestsAddToListResponse = z.infer<
	typeof GuestsAddToListResponseSchema
>;

export const GuestsRemoveFromListInputSchema = z.object({
	list_id: z.string(),
	guest_id: z.string(),
});
export type GuestsRemoveFromListInput = z.infer<
	typeof GuestsRemoveFromListInputSchema
>;

export const GuestsRemoveFromListResponseSchema = z.object({}).passthrough();
export type GuestsRemoveFromListResponse = z.infer<
	typeof GuestsRemoveFromListResponseSchema
>;

export const GuestsAddToFolderInputSchema = z.object({
	folder_id: z.string(),
	guest_id: z.string(),
	permission_level: z.number().optional(),
});
export type GuestsAddToFolderInput = z.infer<
	typeof GuestsAddToFolderInputSchema
>;

export const GuestsAddToFolderResponseSchema = z.object({}).passthrough();
export type GuestsAddToFolderResponse = z.infer<
	typeof GuestsAddToFolderResponseSchema
>;

export const GuestsRemoveFromFolderInputSchema = z.object({
	folder_id: z.string(),
	guest_id: z.string(),
});
export type GuestsRemoveFromFolderInput = z.infer<
	typeof GuestsRemoveFromFolderInputSchema
>;

export const GuestsRemoveFromFolderResponseSchema = z.object({}).passthrough();
export type GuestsRemoveFromFolderResponse = z.infer<
	typeof GuestsRemoveFromFolderResponseSchema
>;

// ---------------------------------------------------------------------------
// Teams (user groups)
// ---------------------------------------------------------------------------
export const TeamsListInputSchema = z.object({
	team_id: z.string(),
});
export type TeamsListInput = z.infer<typeof TeamsListInputSchema>;

export const TeamsListResponseSchema = z
	.object({
		groups: z.array(NamedEntitySchema).optional(),
	})
	.passthrough();
export type TeamsListResponse = z.infer<typeof TeamsListResponseSchema>;

export const TeamsCreateInputSchema = z.object({
	team_id: z.string(),
	name: z.string(),
	members: z.array(z.number()).optional(),
	admins: z.array(z.number()).optional(),
});
export type TeamsCreateInput = z.infer<typeof TeamsCreateInputSchema>;

export const TeamsCreateResponseSchema = NamedEntitySchema;
export type TeamsCreateResponse = z.infer<typeof TeamsCreateResponseSchema>;

export const TeamsUpdateInputSchema = z.object({
	group_id: z.string(),
	name: z.string().optional(),
	handle: z.string().optional(),
	add: z.array(z.number()).optional(),
	rem: z.array(z.number()).optional(),
});
export type TeamsUpdateInput = z.infer<typeof TeamsUpdateInputSchema>;

export const TeamsUpdateResponseSchema = NamedEntitySchema;
export type TeamsUpdateResponse = z.infer<typeof TeamsUpdateResponseSchema>;

export const TeamsDeleteInputSchema = z.object({
	group_id: z.string(),
});
export type TeamsDeleteInput = z.infer<typeof TeamsDeleteInputSchema>;

export const TeamsDeleteResponseSchema = z.undefined();
export type TeamsDeleteResponse = z.infer<typeof TeamsDeleteResponseSchema>;

// ---------------------------------------------------------------------------
// Workspace ACL (v3)
// ---------------------------------------------------------------------------
const AclObjectTypeSchema = z.enum([
	'space',
	'folder',
	'list',
	'task',
	'view',
	'doc',
	'goal',
	'dashboard',
	'whiteboard',
]);

const AclGrantSchema = z.object({
	kind: z.enum(['user', 'group']),
	id: z.string(),
	permission_level: z.union([
		z.literal(1),
		z.literal(3),
		z.literal(4),
		z.literal(5),
		z.null(),
	]),
});

export const WorkspaceAclUpdateInputSchema = z.object({
	workspace_id: z.string(),
	object_type: AclObjectTypeSchema,
	object_id: z.string(),
	private: z.boolean().optional(),
	grants: z.array(AclGrantSchema).optional(),
});
export type WorkspaceAclUpdateInput = z.infer<
	typeof WorkspaceAclUpdateInputSchema
>;

export const WorkspaceAclUpdateResponseSchema = z.object({}).passthrough();
export type WorkspaceAclUpdateResponse = z.infer<
	typeof WorkspaceAclUpdateResponseSchema
>;

// ---------------------------------------------------------------------------
// Aggregates (required by validate:plugins)
// ---------------------------------------------------------------------------
export type ClickupEndpointInputs = {
	workspacesGet: WorkspacesGetInput;
	workspacesAuthorizedUser: WorkspacesAuthorizedUserInput;
	workspacesPlan: WorkspacesPlanInput;
	workspacesSeats: WorkspacesSeatsInput;
	workspacesSharedHierarchy: WorkspacesSharedHierarchyInput;
	workspacesCustomRoles: WorkspacesCustomRolesInput;
	workspacesCustomTaskTypes: WorkspacesCustomTaskTypesInput;
	workspacesTeamFields: WorkspacesTeamFieldsInput;
	workspacesEverythingViewsGet: WorkspacesEverythingViewsGetInput;
	workspacesEverythingViewsCreate: WorkspacesEverythingViewsCreateInput;
	spacesList: SpacesListInput;
	spacesGet: SpacesGetInput;
	spacesCreate: SpacesCreateInput;
	spacesUpdate: SpacesUpdateInput;
	spacesDelete: SpacesDeleteInput;
	spacesAvailableFields: SpacesAvailableFieldsInput;
	spacesTagsGet: SpacesTagsGetInput;
	spacesTagsCreate: SpacesTagsCreateInput;
	spacesTagsUpdate: SpacesTagsUpdateInput;
	spacesTagsDelete: SpacesTagsDeleteInput;
	spacesViewsGet: SpacesViewsGetInput;
	spacesViewsCreate: SpacesViewsCreateInput;
	foldersList: FoldersListInput;
	foldersGet: FoldersGetInput;
	foldersCreate: FoldersCreateInput;
	foldersUpdate: FoldersUpdateInput;
	foldersDelete: FoldersDeleteInput;
	foldersViewsGet: FoldersViewsGetInput;
	foldersViewsCreate: FoldersViewsCreateInput;
	listsList: ListsListInput;
	listsFolderless: ListsFolderlessInput;
	listsGet: ListsGetInput;
	listsCreate: ListsCreateInput;
	listsCreateFolderless: ListsCreateFolderlessInput;
	listsCreateFromTemplate: ListsCreateFromTemplateInput;
	listsUpdate: ListsUpdateInput;
	listsDelete: ListsDeleteInput;
	listsMembers: ListsMembersInput;
	listsCommentsGet: ListsCommentsGetInput;
	listsCommentsCreate: ListsCommentsCreateInput;
	listsViewsGet: ListsViewsGetInput;
	listsViewsCreate: ListsViewsCreateInput;
	tasksList: TasksListInput;
	tasksFilteredTeam: TasksFilteredTeamInput;
	tasksGet: TasksGetInput;
	tasksCreate: TasksCreateInput;
	tasksUpdate: TasksUpdateInput;
	tasksDelete: TasksDeleteInput;
	tasksCreateFromTemplate: TasksCreateFromTemplateInput;
	tasksMoveToHomeList: TasksMoveToHomeListInput;
	tasksMembers: TasksMembersInput;
	tasksTimeInStatus: TasksTimeInStatusInput;
	tasksBulkTimeInStatus: TasksBulkTimeInStatusInput;
	tasksTemplates: TasksTemplatesInput;
	tasksTrackedTimeGet: TasksTrackedTimeGetInput;
	tasksTrackedTimeCreate: TasksTrackedTimeCreateInput;
	tasksTrackedTimeUpdate: TasksTrackedTimeUpdateInput;
	tasksTrackedTimeDelete: TasksTrackedTimeDeleteInput;
	tasksTagsAdd: TasksTagsAddInput;
	tasksTagsRemove: TasksTagsRemoveInput;
	tasksAttachmentsCreate: TasksAttachmentsCreateInput;
	dependenciesAdd: DependenciesAddInput;
	dependenciesDelete: DependenciesDeleteInput;
	taskLinksAdd: TaskLinksAddInput;
	taskLinksDelete: TaskLinksDeleteInput;
	taskListsAdd: TaskListsAddInput;
	taskListsRemove: TaskListsRemoveInput;
	checklistsCreate: ChecklistsCreateInput;
	checklistsUpdate: ChecklistsUpdateInput;
	checklistsDelete: ChecklistsDeleteInput;
	checklistItemsCreate: ChecklistItemsCreateInput;
	checklistItemsUpdate: ChecklistItemsUpdateInput;
	checklistItemsDelete: ChecklistItemsDeleteInput;
	taskCommentsGet: TaskCommentsGetInput;
	taskCommentsCreate: TaskCommentsCreateInput;
	taskCommentsUpdate: TaskCommentsUpdateInput;
	taskCommentsDelete: TaskCommentsDeleteInput;
	threadedCommentsCreate: ThreadedCommentsCreateInput;
	threadedCommentsGet: ThreadedCommentsGetInput;
	customFieldsAccessible: CustomFieldsAccessibleInput;
	customFieldsFolderFields: CustomFieldsFolderFieldsInput;
	customFieldsSetValue: CustomFieldsSetValueInput;
	customFieldsRemoveValue: CustomFieldsRemoveValueInput;
	viewsGet: ViewsGetInput;
	viewsUpdate: ViewsUpdateInput;
	viewsDelete: ViewsDeleteInput;
	viewsTasks: ViewsTasksInput;
	viewsChatCommentsGet: ViewsChatCommentsGetInput;
	viewsChatCommentsCreate: ViewsChatCommentsCreateInput;
	goalsList: GoalsListInput;
	goalsGet: GoalsGetInput;
	goalsCreate: GoalsCreateInput;
	goalsUpdate: GoalsUpdateInput;
	goalsDelete: GoalsDeleteInput;
	keyResultsCreate: KeyResultsCreateInput;
	keyResultsUpdate: KeyResultsUpdateInput;
	keyResultsDelete: KeyResultsDeleteInput;
	timeEntriesRange: TimeEntriesRangeInput;
	timeEntriesGet: TimeEntriesGetInput;
	timeEntriesCreate: TimeEntriesCreateInput;
	timeEntriesUpdate: TimeEntriesUpdateInput;
	timeEntriesDelete: TimeEntriesDeleteInput;
	timeEntriesRunning: TimeEntriesRunningInput;
	timeEntriesStart: TimeEntriesStartInput;
	timeEntriesStop: TimeEntriesStopInput;
	timeEntriesHistory: TimeEntriesHistoryInput;
	timeEntryTagsGetAll: TimeEntryTagsGetAllInput;
	timeEntryTagsAdd: TimeEntryTagsAddInput;
	timeEntryTagsRemove: TimeEntryTagsRemoveInput;
	timeEntryTagsUpdate: TimeEntryTagsUpdateInput;
	docsSearch: DocsSearchInput;
	docsCreate: DocsCreateInput;
	docsContent: DocsContentInput;
	docsPages: DocsPagesInput;
	docsPageListing: DocsPageListingInput;
	docsPageContent: DocsPageContentInput;
	docsCreatePage: DocsCreatePageInput;
	docsUpdatePage: DocsUpdatePageInput;
	chatChannelsList: ChatChannelsListInput;
	chatChannelsGet: ChatChannelsGetInput;
	chatChannelsCreate: ChatChannelsCreateInput;
	chatChannelsCreateLocation: ChatChannelsCreateLocationInput;
	chatChannelsCreateDm: ChatChannelsCreateDmInput;
	chatChannelsUpdate: ChatChannelsUpdateInput;
	chatChannelsDelete: ChatChannelsDeleteInput;
	chatChannelsMembers: ChatChannelsMembersInput;
	chatChannelsFollowers: ChatChannelsFollowersInput;
	chatMessagesList: ChatMessagesListInput;
	chatMessagesCreate: ChatMessagesCreateInput;
	chatMessagesUpdate: ChatMessagesUpdateInput;
	chatMessagesDelete: ChatMessagesDeleteInput;
	chatRepliesGet: ChatRepliesGetInput;
	chatRepliesCreate: ChatRepliesCreateInput;
	chatReactionsGet: ChatReactionsGetInput;
	chatReactionsCreate: ChatReactionsCreateInput;
	chatReactionsDelete: ChatReactionsDeleteInput;
	chatTaggedUsers: ChatTaggedUsersInput;
	chatSubtypes: ChatSubtypesInput;
	usersGet: UsersGetInput;
	usersInvite: UsersInviteInput;
	usersUpdate: UsersUpdateInput;
	usersRemove: UsersRemoveInput;
	guestsGet: GuestsGetInput;
	guestsInvite: GuestsInviteInput;
	guestsUpdate: GuestsUpdateInput;
	guestsRemove: GuestsRemoveInput;
	guestsAddToTask: GuestsAddToTaskInput;
	guestsRemoveFromTask: GuestsRemoveFromTaskInput;
	guestsAddToList: GuestsAddToListInput;
	guestsRemoveFromList: GuestsRemoveFromListInput;
	guestsAddToFolder: GuestsAddToFolderInput;
	guestsRemoveFromFolder: GuestsRemoveFromFolderInput;
	teamsList: TeamsListInput;
	teamsCreate: TeamsCreateInput;
	teamsUpdate: TeamsUpdateInput;
	teamsDelete: TeamsDeleteInput;
	workspaceAclUpdate: WorkspaceAclUpdateInput;
};

export type ClickupEndpointOutputs = {
	workspacesGet: WorkspacesGetResponse;
	workspacesAuthorizedUser: WorkspacesAuthorizedUserResponse;
	workspacesPlan: WorkspacesPlanResponse;
	workspacesSeats: WorkspacesSeatsResponse;
	workspacesSharedHierarchy: WorkspacesSharedHierarchyResponse;
	workspacesCustomRoles: WorkspacesCustomRolesResponse;
	workspacesCustomTaskTypes: WorkspacesCustomTaskTypesResponse;
	workspacesTeamFields: WorkspacesTeamFieldsResponse;
	workspacesEverythingViewsGet: WorkspacesEverythingViewsGetResponse;
	workspacesEverythingViewsCreate: WorkspacesEverythingViewsCreateResponse;
	spacesList: SpacesListResponse;
	spacesGet: SpacesGetResponse;
	spacesCreate: SpacesCreateResponse;
	spacesUpdate: SpacesUpdateResponse;
	spacesDelete: SpacesDeleteResponse;
	spacesAvailableFields: SpacesAvailableFieldsResponse;
	spacesTagsGet: SpacesTagsGetResponse;
	spacesTagsCreate: SpacesTagsCreateResponse;
	spacesTagsUpdate: SpacesTagsUpdateResponse;
	spacesTagsDelete: SpacesTagsDeleteResponse;
	spacesViewsGet: SpacesViewsGetResponse;
	spacesViewsCreate: SpacesViewsCreateResponse;
	foldersList: FoldersListResponse;
	foldersGet: FoldersGetResponse;
	foldersCreate: FoldersCreateResponse;
	foldersUpdate: FoldersUpdateResponse;
	foldersDelete: FoldersDeleteResponse;
	foldersViewsGet: FoldersViewsGetResponse;
	foldersViewsCreate: FoldersViewsCreateResponse;
	listsList: ListsListResponse;
	listsFolderless: ListsFolderlessResponse;
	listsGet: ListsGetResponse;
	listsCreate: ListsCreateResponse;
	listsCreateFolderless: ListsCreateFolderlessResponse;
	listsCreateFromTemplate: ListsCreateFromTemplateResponse;
	listsUpdate: ListsUpdateResponse;
	listsDelete: ListsDeleteResponse;
	listsMembers: ListsMembersResponse;
	listsCommentsGet: ListsCommentsGetResponse;
	listsCommentsCreate: ListsCommentsCreateResponse;
	listsViewsGet: ListsViewsGetResponse;
	listsViewsCreate: ListsViewsCreateResponse;
	tasksList: TasksListResponse;
	tasksFilteredTeam: TasksFilteredTeamResponse;
	tasksGet: TasksGetResponse;
	tasksCreate: TasksCreateResponse;
	tasksUpdate: TasksUpdateResponse;
	tasksDelete: TasksDeleteResponse;
	tasksCreateFromTemplate: TasksCreateFromTemplateResponse;
	tasksMoveToHomeList: TasksMoveToHomeListResponse;
	tasksMembers: TasksMembersResponse;
	tasksTimeInStatus: TasksTimeInStatusResponse;
	tasksBulkTimeInStatus: TasksBulkTimeInStatusResponse;
	tasksTemplates: TasksTemplatesResponse;
	tasksTrackedTimeGet: TasksTrackedTimeGetResponse;
	tasksTrackedTimeCreate: TasksTrackedTimeCreateResponse;
	tasksTrackedTimeUpdate: TasksTrackedTimeUpdateResponse;
	tasksTrackedTimeDelete: TasksTrackedTimeDeleteResponse;
	tasksTagsAdd: TasksTagsAddResponse;
	tasksTagsRemove: TasksTagsRemoveResponse;
	tasksAttachmentsCreate: TasksAttachmentsCreateResponse;
	dependenciesAdd: DependenciesAddResponse;
	dependenciesDelete: DependenciesDeleteResponse;
	taskLinksAdd: TaskLinksAddResponse;
	taskLinksDelete: TaskLinksDeleteResponse;
	taskListsAdd: TaskListsAddResponse;
	taskListsRemove: TaskListsRemoveResponse;
	checklistsCreate: ChecklistsCreateResponse;
	checklistsUpdate: ChecklistsUpdateResponse;
	checklistsDelete: ChecklistsDeleteResponse;
	checklistItemsCreate: ChecklistItemsCreateResponse;
	checklistItemsUpdate: ChecklistItemsUpdateResponse;
	checklistItemsDelete: ChecklistItemsDeleteResponse;
	taskCommentsGet: TaskCommentsGetResponse;
	taskCommentsCreate: TaskCommentsCreateResponse;
	taskCommentsUpdate: TaskCommentsUpdateResponse;
	taskCommentsDelete: TaskCommentsDeleteResponse;
	threadedCommentsCreate: ThreadedCommentsCreateResponse;
	threadedCommentsGet: ThreadedCommentsGetResponse;
	customFieldsAccessible: CustomFieldsAccessibleResponse;
	customFieldsFolderFields: CustomFieldsFolderFieldsResponse;
	customFieldsSetValue: CustomFieldsSetValueResponse;
	customFieldsRemoveValue: CustomFieldsRemoveValueResponse;
	viewsGet: ViewsGetResponse;
	viewsUpdate: ViewsUpdateResponse;
	viewsDelete: ViewsDeleteResponse;
	viewsTasks: ViewsTasksResponse;
	viewsChatCommentsGet: ViewsChatCommentsGetResponse;
	viewsChatCommentsCreate: ViewsChatCommentsCreateResponse;
	goalsList: GoalsListResponse;
	goalsGet: GoalsGetResponse;
	goalsCreate: GoalsCreateResponse;
	goalsUpdate: GoalsUpdateResponse;
	goalsDelete: GoalsDeleteResponse;
	keyResultsCreate: KeyResultsCreateResponse;
	keyResultsUpdate: KeyResultsUpdateResponse;
	keyResultsDelete: KeyResultsDeleteResponse;
	timeEntriesRange: TimeEntriesRangeResponse;
	timeEntriesGet: TimeEntriesGetResponse;
	timeEntriesCreate: TimeEntriesCreateResponse;
	timeEntriesUpdate: TimeEntriesUpdateResponse;
	timeEntriesDelete: TimeEntriesDeleteResponse;
	timeEntriesRunning: TimeEntriesRunningResponse;
	timeEntriesStart: TimeEntriesStartResponse;
	timeEntriesStop: TimeEntriesStopResponse;
	timeEntriesHistory: TimeEntriesHistoryResponse;
	timeEntryTagsGetAll: TimeEntryTagsGetAllResponse;
	timeEntryTagsAdd: TimeEntryTagsAddResponse;
	timeEntryTagsRemove: TimeEntryTagsRemoveResponse;
	timeEntryTagsUpdate: TimeEntryTagsUpdateResponse;
	docsSearch: DocsSearchResponse;
	docsCreate: DocsCreateResponse;
	docsContent: DocsContentResponse;
	docsPages: DocsPagesResponse;
	docsPageListing: DocsPageListingResponse;
	docsPageContent: DocsPageContentResponse;
	docsCreatePage: DocsCreatePageResponse;
	docsUpdatePage: DocsUpdatePageResponse;
	chatChannelsList: ChatChannelsListResponse;
	chatChannelsGet: ChatChannelsGetResponse;
	chatChannelsCreate: ChatChannelsCreateResponse;
	chatChannelsCreateLocation: ChatChannelsCreateLocationResponse;
	chatChannelsCreateDm: ChatChannelsCreateDmResponse;
	chatChannelsUpdate: ChatChannelsUpdateResponse;
	chatChannelsDelete: ChatChannelsDeleteResponse;
	chatChannelsMembers: ChatChannelsMembersResponse;
	chatChannelsFollowers: ChatChannelsFollowersResponse;
	chatMessagesList: ChatMessagesListResponse;
	chatMessagesCreate: ChatMessagesCreateResponse;
	chatMessagesUpdate: ChatMessagesUpdateResponse;
	chatMessagesDelete: ChatMessagesDeleteResponse;
	chatRepliesGet: ChatRepliesGetResponse;
	chatRepliesCreate: ChatRepliesCreateResponse;
	chatReactionsGet: ChatReactionsGetResponse;
	chatReactionsCreate: ChatReactionsCreateResponse;
	chatReactionsDelete: ChatReactionsDeleteResponse;
	chatTaggedUsers: ChatTaggedUsersResponse;
	chatSubtypes: ChatSubtypesResponse;
	usersGet: UsersGetResponse;
	usersInvite: UsersInviteResponse;
	usersUpdate: UsersUpdateResponse;
	usersRemove: UsersRemoveResponse;
	guestsGet: GuestsGetResponse;
	guestsInvite: GuestsInviteResponse;
	guestsUpdate: GuestsUpdateResponse;
	guestsRemove: GuestsRemoveResponse;
	guestsAddToTask: GuestsAddToTaskResponse;
	guestsRemoveFromTask: GuestsRemoveFromTaskResponse;
	guestsAddToList: GuestsAddToListResponse;
	guestsRemoveFromList: GuestsRemoveFromListResponse;
	guestsAddToFolder: GuestsAddToFolderResponse;
	guestsRemoveFromFolder: GuestsRemoveFromFolderResponse;
	teamsList: TeamsListResponse;
	teamsCreate: TeamsCreateResponse;
	teamsUpdate: TeamsUpdateResponse;
	teamsDelete: TeamsDeleteResponse;
	workspaceAclUpdate: WorkspaceAclUpdateResponse;
};

export const ClickupEndpointInputSchemas = {
	workspacesGet: WorkspacesGetInputSchema,
	workspacesAuthorizedUser: WorkspacesAuthorizedUserInputSchema,
	workspacesPlan: WorkspacesPlanInputSchema,
	workspacesSeats: WorkspacesSeatsInputSchema,
	workspacesSharedHierarchy: WorkspacesSharedHierarchyInputSchema,
	workspacesCustomRoles: WorkspacesCustomRolesInputSchema,
	workspacesCustomTaskTypes: WorkspacesCustomTaskTypesInputSchema,
	workspacesTeamFields: WorkspacesTeamFieldsInputSchema,
	workspacesEverythingViewsGet: WorkspacesEverythingViewsGetInputSchema,
	workspacesEverythingViewsCreate: WorkspacesEverythingViewsCreateInputSchema,
	spacesList: SpacesListInputSchema,
	spacesGet: SpacesGetInputSchema,
	spacesCreate: SpacesCreateInputSchema,
	spacesUpdate: SpacesUpdateInputSchema,
	spacesDelete: SpacesDeleteInputSchema,
	spacesAvailableFields: SpacesAvailableFieldsInputSchema,
	spacesTagsGet: SpacesTagsGetInputSchema,
	spacesTagsCreate: SpacesTagsCreateInputSchema,
	spacesTagsUpdate: SpacesTagsUpdateInputSchema,
	spacesTagsDelete: SpacesTagsDeleteInputSchema,
	spacesViewsGet: SpacesViewsGetInputSchema,
	spacesViewsCreate: SpacesViewsCreateInputSchema,
	foldersList: FoldersListInputSchema,
	foldersGet: FoldersGetInputSchema,
	foldersCreate: FoldersCreateInputSchema,
	foldersUpdate: FoldersUpdateInputSchema,
	foldersDelete: FoldersDeleteInputSchema,
	foldersViewsGet: FoldersViewsGetInputSchema,
	foldersViewsCreate: FoldersViewsCreateInputSchema,
	listsList: ListsListInputSchema,
	listsFolderless: ListsFolderlessInputSchema,
	listsGet: ListsGetInputSchema,
	listsCreate: ListsCreateInputSchema,
	listsCreateFolderless: ListsCreateFolderlessInputSchema,
	listsCreateFromTemplate: ListsCreateFromTemplateInputSchema,
	listsUpdate: ListsUpdateInputSchema,
	listsDelete: ListsDeleteInputSchema,
	listsMembers: ListsMembersInputSchema,
	listsCommentsGet: ListsCommentsGetInputSchema,
	listsCommentsCreate: ListsCommentsCreateInputSchema,
	listsViewsGet: ListsViewsGetInputSchema,
	listsViewsCreate: ListsViewsCreateInputSchema,
	tasksList: TasksListInputSchema,
	tasksFilteredTeam: TasksFilteredTeamInputSchema,
	tasksGet: TasksGetInputSchema,
	tasksCreate: TasksCreateInputSchema,
	tasksUpdate: TasksUpdateInputSchema,
	tasksDelete: TasksDeleteInputSchema,
	tasksCreateFromTemplate: TasksCreateFromTemplateInputSchema,
	tasksMoveToHomeList: TasksMoveToHomeListInputSchema,
	tasksMembers: TasksMembersInputSchema,
	tasksTimeInStatus: TasksTimeInStatusInputSchema,
	tasksBulkTimeInStatus: TasksBulkTimeInStatusInputSchema,
	tasksTemplates: TasksTemplatesInputSchema,
	tasksTrackedTimeGet: TasksTrackedTimeGetInputSchema,
	tasksTrackedTimeCreate: TasksTrackedTimeCreateInputSchema,
	tasksTrackedTimeUpdate: TasksTrackedTimeUpdateInputSchema,
	tasksTrackedTimeDelete: TasksTrackedTimeDeleteInputSchema,
	tasksTagsAdd: TasksTagsAddInputSchema,
	tasksTagsRemove: TasksTagsRemoveInputSchema,
	tasksAttachmentsCreate: TasksAttachmentsCreateInputSchema,
	dependenciesAdd: DependenciesAddInputSchema,
	dependenciesDelete: DependenciesDeleteInputSchema,
	taskLinksAdd: TaskLinksAddInputSchema,
	taskLinksDelete: TaskLinksDeleteInputSchema,
	taskListsAdd: TaskListsAddInputSchema,
	taskListsRemove: TaskListsRemoveInputSchema,
	checklistsCreate: ChecklistsCreateInputSchema,
	checklistsUpdate: ChecklistsUpdateInputSchema,
	checklistsDelete: ChecklistsDeleteInputSchema,
	checklistItemsCreate: ChecklistItemsCreateInputSchema,
	checklistItemsUpdate: ChecklistItemsUpdateInputSchema,
	checklistItemsDelete: ChecklistItemsDeleteInputSchema,
	taskCommentsGet: TaskCommentsGetInputSchema,
	taskCommentsCreate: TaskCommentsCreateInputSchema,
	taskCommentsUpdate: TaskCommentsUpdateInputSchema,
	taskCommentsDelete: TaskCommentsDeleteInputSchema,
	threadedCommentsCreate: ThreadedCommentsCreateInputSchema,
	threadedCommentsGet: ThreadedCommentsGetInputSchema,
	customFieldsAccessible: CustomFieldsAccessibleInputSchema,
	customFieldsFolderFields: CustomFieldsFolderFieldsInputSchema,
	customFieldsSetValue: CustomFieldsSetValueInputSchema,
	customFieldsRemoveValue: CustomFieldsRemoveValueInputSchema,
	viewsGet: ViewsGetInputSchema,
	viewsUpdate: ViewsUpdateInputSchema,
	viewsDelete: ViewsDeleteInputSchema,
	viewsTasks: ViewsTasksInputSchema,
	viewsChatCommentsGet: ViewsChatCommentsGetInputSchema,
	viewsChatCommentsCreate: ViewsChatCommentsCreateInputSchema,
	goalsList: GoalsListInputSchema,
	goalsGet: GoalsGetInputSchema,
	goalsCreate: GoalsCreateInputSchema,
	goalsUpdate: GoalsUpdateInputSchema,
	goalsDelete: GoalsDeleteInputSchema,
	keyResultsCreate: KeyResultsCreateInputSchema,
	keyResultsUpdate: KeyResultsUpdateInputSchema,
	keyResultsDelete: KeyResultsDeleteInputSchema,
	timeEntriesRange: TimeEntriesRangeInputSchema,
	timeEntriesGet: TimeEntriesGetInputSchema,
	timeEntriesCreate: TimeEntriesCreateInputSchema,
	timeEntriesUpdate: TimeEntriesUpdateInputSchema,
	timeEntriesDelete: TimeEntriesDeleteInputSchema,
	timeEntriesRunning: TimeEntriesRunningInputSchema,
	timeEntriesStart: TimeEntriesStartInputSchema,
	timeEntriesStop: TimeEntriesStopInputSchema,
	timeEntriesHistory: TimeEntriesHistoryInputSchema,
	timeEntryTagsGetAll: TimeEntryTagsGetAllInputSchema,
	timeEntryTagsAdd: TimeEntryTagsAddInputSchema,
	timeEntryTagsRemove: TimeEntryTagsRemoveInputSchema,
	timeEntryTagsUpdate: TimeEntryTagsUpdateInputSchema,
	docsSearch: DocsSearchInputSchema,
	docsCreate: DocsCreateInputSchema,
	docsContent: DocsContentInputSchema,
	docsPages: DocsPagesInputSchema,
	docsPageListing: DocsPageListingInputSchema,
	docsPageContent: DocsPageContentInputSchema,
	docsCreatePage: DocsCreatePageInputSchema,
	docsUpdatePage: DocsUpdatePageInputSchema,
	chatChannelsList: ChatChannelsListInputSchema,
	chatChannelsGet: ChatChannelsGetInputSchema,
	chatChannelsCreate: ChatChannelsCreateInputSchema,
	chatChannelsCreateLocation: ChatChannelsCreateLocationInputSchema,
	chatChannelsCreateDm: ChatChannelsCreateDmInputSchema,
	chatChannelsUpdate: ChatChannelsUpdateInputSchema,
	chatChannelsDelete: ChatChannelsDeleteInputSchema,
	chatChannelsMembers: ChatChannelsMembersInputSchema,
	chatChannelsFollowers: ChatChannelsFollowersInputSchema,
	chatMessagesList: ChatMessagesListInputSchema,
	chatMessagesCreate: ChatMessagesCreateInputSchema,
	chatMessagesUpdate: ChatMessagesUpdateInputSchema,
	chatMessagesDelete: ChatMessagesDeleteInputSchema,
	chatRepliesGet: ChatRepliesGetInputSchema,
	chatRepliesCreate: ChatRepliesCreateInputSchema,
	chatReactionsGet: ChatReactionsGetInputSchema,
	chatReactionsCreate: ChatReactionsCreateInputSchema,
	chatReactionsDelete: ChatReactionsDeleteInputSchema,
	chatTaggedUsers: ChatTaggedUsersInputSchema,
	chatSubtypes: ChatSubtypesInputSchema,
	usersGet: UsersGetInputSchema,
	usersInvite: UsersInviteInputSchema,
	usersUpdate: UsersUpdateInputSchema,
	usersRemove: UsersRemoveInputSchema,
	guestsGet: GuestsGetInputSchema,
	guestsInvite: GuestsInviteInputSchema,
	guestsUpdate: GuestsUpdateInputSchema,
	guestsRemove: GuestsRemoveInputSchema,
	guestsAddToTask: GuestsAddToTaskInputSchema,
	guestsRemoveFromTask: GuestsRemoveFromTaskInputSchema,
	guestsAddToList: GuestsAddToListInputSchema,
	guestsRemoveFromList: GuestsRemoveFromListInputSchema,
	guestsAddToFolder: GuestsAddToFolderInputSchema,
	guestsRemoveFromFolder: GuestsRemoveFromFolderInputSchema,
	teamsList: TeamsListInputSchema,
	teamsCreate: TeamsCreateInputSchema,
	teamsUpdate: TeamsUpdateInputSchema,
	teamsDelete: TeamsDeleteInputSchema,
	workspaceAclUpdate: WorkspaceAclUpdateInputSchema,
} as const;

export const ClickupEndpointOutputSchemas = {
	workspacesGet: WorkspacesGetResponseSchema,
	workspacesAuthorizedUser: WorkspacesAuthorizedUserResponseSchema,
	workspacesPlan: WorkspacesPlanResponseSchema,
	workspacesSeats: WorkspacesSeatsResponseSchema,
	workspacesSharedHierarchy: WorkspacesSharedHierarchyResponseSchema,
	workspacesCustomRoles: WorkspacesCustomRolesResponseSchema,
	workspacesCustomTaskTypes: WorkspacesCustomTaskTypesResponseSchema,
	workspacesTeamFields: WorkspacesTeamFieldsResponseSchema,
	workspacesEverythingViewsGet: WorkspacesEverythingViewsGetResponseSchema,
	workspacesEverythingViewsCreate:
		WorkspacesEverythingViewsCreateResponseSchema,
	spacesList: SpacesListResponseSchema,
	spacesGet: SpacesGetResponseSchema,
	spacesCreate: SpacesCreateResponseSchema,
	spacesUpdate: SpacesUpdateResponseSchema,
	spacesDelete: SpacesDeleteResponseSchema,
	spacesAvailableFields: SpacesAvailableFieldsResponseSchema,
	spacesTagsGet: SpacesTagsGetResponseSchema,
	spacesTagsCreate: SpacesTagsCreateResponseSchema,
	spacesTagsUpdate: SpacesTagsUpdateResponseSchema,
	spacesTagsDelete: SpacesTagsDeleteResponseSchema,
	spacesViewsGet: SpacesViewsGetResponseSchema,
	spacesViewsCreate: SpacesViewsCreateResponseSchema,
	foldersList: FoldersListResponseSchema,
	foldersGet: FoldersGetResponseSchema,
	foldersCreate: FoldersCreateResponseSchema,
	foldersUpdate: FoldersUpdateResponseSchema,
	foldersDelete: FoldersDeleteResponseSchema,
	foldersViewsGet: FoldersViewsGetResponseSchema,
	foldersViewsCreate: FoldersViewsCreateResponseSchema,
	listsList: ListsListResponseSchema,
	listsFolderless: ListsFolderlessResponseSchema,
	listsGet: ListsGetResponseSchema,
	listsCreate: ListsCreateResponseSchema,
	listsCreateFolderless: ListsCreateFolderlessResponseSchema,
	listsCreateFromTemplate: ListsCreateFromTemplateResponseSchema,
	listsUpdate: ListsUpdateResponseSchema,
	listsDelete: ListsDeleteResponseSchema,
	listsMembers: ListsMembersResponseSchema,
	listsCommentsGet: ListsCommentsGetResponseSchema,
	listsCommentsCreate: ListsCommentsCreateResponseSchema,
	listsViewsGet: ListsViewsGetResponseSchema,
	listsViewsCreate: ListsViewsCreateResponseSchema,
	tasksList: TasksListResponseSchema,
	tasksFilteredTeam: TasksFilteredTeamResponseSchema,
	tasksGet: TasksGetResponseSchema,
	tasksCreate: TasksCreateResponseSchema,
	tasksUpdate: TasksUpdateResponseSchema,
	tasksDelete: TasksDeleteResponseSchema,
	tasksCreateFromTemplate: TasksCreateFromTemplateResponseSchema,
	tasksMoveToHomeList: TasksMoveToHomeListResponseSchema,
	tasksMembers: TasksMembersResponseSchema,
	tasksTimeInStatus: TasksTimeInStatusResponseSchema,
	tasksBulkTimeInStatus: TasksBulkTimeInStatusResponseSchema,
	tasksTemplates: TasksTemplatesResponseSchema,
	tasksTrackedTimeGet: TasksTrackedTimeGetResponseSchema,
	tasksTrackedTimeCreate: TasksTrackedTimeCreateResponseSchema,
	tasksTrackedTimeUpdate: TasksTrackedTimeUpdateResponseSchema,
	tasksTrackedTimeDelete: TasksTrackedTimeDeleteResponseSchema,
	tasksTagsAdd: TasksTagsAddResponseSchema,
	tasksTagsRemove: TasksTagsRemoveResponseSchema,
	tasksAttachmentsCreate: TasksAttachmentsCreateResponseSchema,
	dependenciesAdd: DependenciesAddResponseSchema,
	dependenciesDelete: DependenciesDeleteResponseSchema,
	taskLinksAdd: TaskLinksAddResponseSchema,
	taskLinksDelete: TaskLinksDeleteResponseSchema,
	taskListsAdd: TaskListsAddResponseSchema,
	taskListsRemove: TaskListsRemoveResponseSchema,
	checklistsCreate: ChecklistsCreateResponseSchema,
	checklistsUpdate: ChecklistsUpdateResponseSchema,
	checklistsDelete: ChecklistsDeleteResponseSchema,
	checklistItemsCreate: ChecklistItemsCreateResponseSchema,
	checklistItemsUpdate: ChecklistItemsUpdateResponseSchema,
	checklistItemsDelete: ChecklistItemsDeleteResponseSchema,
	taskCommentsGet: TaskCommentsGetResponseSchema,
	taskCommentsCreate: TaskCommentsCreateResponseSchema,
	taskCommentsUpdate: TaskCommentsUpdateResponseSchema,
	taskCommentsDelete: TaskCommentsDeleteResponseSchema,
	threadedCommentsCreate: ThreadedCommentsCreateResponseSchema,
	threadedCommentsGet: ThreadedCommentsGetResponseSchema,
	customFieldsAccessible: CustomFieldsAccessibleResponseSchema,
	customFieldsFolderFields: CustomFieldsFolderFieldsResponseSchema,
	customFieldsSetValue: CustomFieldsSetValueResponseSchema,
	customFieldsRemoveValue: CustomFieldsRemoveValueResponseSchema,
	viewsGet: ViewsGetResponseSchema,
	viewsUpdate: ViewsUpdateResponseSchema,
	viewsDelete: ViewsDeleteResponseSchema,
	viewsTasks: ViewsTasksResponseSchema,
	viewsChatCommentsGet: ViewsChatCommentsGetResponseSchema,
	viewsChatCommentsCreate: ViewsChatCommentsCreateResponseSchema,
	goalsList: GoalsListResponseSchema,
	goalsGet: GoalsGetResponseSchema,
	goalsCreate: GoalsCreateResponseSchema,
	goalsUpdate: GoalsUpdateResponseSchema,
	goalsDelete: GoalsDeleteResponseSchema,
	keyResultsCreate: KeyResultsCreateResponseSchema,
	keyResultsUpdate: KeyResultsUpdateResponseSchema,
	keyResultsDelete: KeyResultsDeleteResponseSchema,
	timeEntriesRange: TimeEntriesRangeResponseSchema,
	timeEntriesGet: TimeEntriesGetResponseSchema,
	timeEntriesCreate: TimeEntriesCreateResponseSchema,
	timeEntriesUpdate: TimeEntriesUpdateResponseSchema,
	timeEntriesDelete: TimeEntriesDeleteResponseSchema,
	timeEntriesRunning: TimeEntriesRunningResponseSchema,
	timeEntriesStart: TimeEntriesStartResponseSchema,
	timeEntriesStop: TimeEntriesStopResponseSchema,
	timeEntriesHistory: TimeEntriesHistoryResponseSchema,
	timeEntryTagsGetAll: TimeEntryTagsGetAllResponseSchema,
	timeEntryTagsAdd: TimeEntryTagsAddResponseSchema,
	timeEntryTagsRemove: TimeEntryTagsRemoveResponseSchema,
	timeEntryTagsUpdate: TimeEntryTagsUpdateResponseSchema,
	docsSearch: DocsSearchResponseSchema,
	docsCreate: DocsCreateResponseSchema,
	docsContent: DocsContentResponseSchema,
	docsPages: DocsPagesResponseSchema,
	docsPageListing: DocsPageListingResponseSchema,
	docsPageContent: DocsPageContentResponseSchema,
	docsCreatePage: DocsCreatePageResponseSchema,
	docsUpdatePage: DocsUpdatePageResponseSchema,
	chatChannelsList: ChatChannelsListResponseSchema,
	chatChannelsGet: ChatChannelsGetResponseSchema,
	chatChannelsCreate: ChatChannelsCreateResponseSchema,
	chatChannelsCreateLocation: ChatChannelsCreateLocationResponseSchema,
	chatChannelsCreateDm: ChatChannelsCreateDmResponseSchema,
	chatChannelsUpdate: ChatChannelsUpdateResponseSchema,
	chatChannelsDelete: ChatChannelsDeleteResponseSchema,
	chatChannelsMembers: ChatChannelsMembersResponseSchema,
	chatChannelsFollowers: ChatChannelsFollowersResponseSchema,
	chatMessagesList: ChatMessagesListResponseSchema,
	chatMessagesCreate: ChatMessagesCreateResponseSchema,
	chatMessagesUpdate: ChatMessagesUpdateResponseSchema,
	chatMessagesDelete: ChatMessagesDeleteResponseSchema,
	chatRepliesGet: ChatRepliesGetResponseSchema,
	chatRepliesCreate: ChatRepliesCreateResponseSchema,
	chatReactionsGet: ChatReactionsGetResponseSchema,
	chatReactionsCreate: ChatReactionsCreateResponseSchema,
	chatReactionsDelete: ChatReactionsDeleteResponseSchema,
	chatTaggedUsers: ChatTaggedUsersResponseSchema,
	chatSubtypes: ChatSubtypesResponseSchema,
	usersGet: UsersGetResponseSchema,
	usersInvite: UsersInviteResponseSchema,
	usersUpdate: UsersUpdateResponseSchema,
	usersRemove: UsersRemoveResponseSchema,
	guestsGet: GuestsGetResponseSchema,
	guestsInvite: GuestsInviteResponseSchema,
	guestsUpdate: GuestsUpdateResponseSchema,
	guestsRemove: GuestsRemoveResponseSchema,
	guestsAddToTask: GuestsAddToTaskResponseSchema,
	guestsRemoveFromTask: GuestsRemoveFromTaskResponseSchema,
	guestsAddToList: GuestsAddToListResponseSchema,
	guestsRemoveFromList: GuestsRemoveFromListResponseSchema,
	guestsAddToFolder: GuestsAddToFolderResponseSchema,
	guestsRemoveFromFolder: GuestsRemoveFromFolderResponseSchema,
	teamsList: TeamsListResponseSchema,
	teamsCreate: TeamsCreateResponseSchema,
	teamsUpdate: TeamsUpdateResponseSchema,
	teamsDelete: TeamsDeleteResponseSchema,
	workspaceAclUpdate: WorkspaceAclUpdateResponseSchema,
} as const;
