import { z } from 'zod';

// ── Shared sub-schemas ────────────────────────────────────────────────────────

const JiraUserSchema = z.object({
	accountId: z.string().optional(),
	displayName: z.string().optional(),
	emailAddress: z.string().optional(),
	active: z.boolean().optional(),
	avatarUrls: z.record(z.string()).optional(),
});

const JiraStatusSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	statusCategory: z
		.object({
			id: z.number().optional(),
			key: z.string().optional(),
			name: z.string().optional(),
		})
		.optional(),
});

const JiraPrioritySchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	iconUrl: z.string().optional(),
});

const JiraIssueTypeSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	subtask: z.boolean().optional(),
});

const JiraProjectRefSchema = z.object({
	id: z.string().optional(),
	key: z.string().optional(),
	name: z.string().optional(),
});

const JiraIssueFieldsSchema = z.object({
	summary: z.string().optional(),
	description: z.unknown().optional(),
	status: JiraStatusSchema.optional(),
	assignee: JiraUserSchema.nullable().optional(),
	reporter: JiraUserSchema.optional(),
	priority: JiraPrioritySchema.nullable().optional(),
	issuetype: JiraIssueTypeSchema.optional(),
	project: JiraProjectRefSchema.optional(),
	labels: z.array(z.string()).optional(),
	created: z.string().optional(),
	updated: z.string().optional(),
	comment: z
		.object({
			total: z.number().optional(),
			comments: z.array(z.unknown()).optional(),
		})
		.optional(),
});

const JiraIssueSchema = z.object({
	id: z.string(),
	// key may be absent in /search/jql responses when fields are not explicitly requested
	key: z.string().optional(),
	self: z.string().optional(),
	fields: JiraIssueFieldsSchema.optional(),
});

const JiraCommentSchema = z.object({
	id: z.string().optional(),
	self: z.string().optional(),
	author: JiraUserSchema.optional(),
	// ADF body is an arbitrary object structure
	body: z.unknown().optional(),
	renderedBody: z.string().optional(),
	created: z.string().optional(),
	updated: z.string().optional(),
});

const JiraProjectSchema = z.object({
	id: z.string().optional(),
	key: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	projectTypeKey: z.string().optional(),
	lead: JiraUserSchema.optional(),
	self: z.string().optional(),
});

const JiraSprintSchema = z.object({
	id: z.number().optional(),
	name: z.string().optional(),
	state: z.string().optional(),
	goal: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	completeDate: z.string().optional(),
	createdDate: z.string().optional(),
	originBoardId: z.number().optional(),
	self: z.string().optional(),
});

const JiraBoardSchema = z.object({
	id: z.number().optional(),
	name: z.string().optional(),
	type: z.string().optional(),
	self: z.string().optional(),
	location: z
		.object({
			projectId: z.number().optional(),
			projectKey: z.string().optional(),
			projectName: z.string().optional(),
		})
		.optional(),
});

const JiraTransitionSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	to: JiraStatusSchema.optional(),
});

// ── Issues ────────────────────────────────────────────────────────────────────

const IssuesCreateInputSchema = z.object({
	project_key: z.string(),
	summary: z.string(),
	issue_type: z.string().optional(),
	description: z.string().optional(),
	assignee: z.string().optional(),
	priority: z.string().optional(),
	labels: z.array(z.string()).optional(),
	due_date: z.string().optional(),
	parent: z.string().optional(),
});
export type IssuesCreateInput = z.infer<typeof IssuesCreateInputSchema>;

const IssuesCreateResponseSchema = z.object({
	id: z.string().optional(),
	key: z.string().optional(),
	self: z.string().optional(),
});
export type IssuesCreateResponse = z.infer<typeof IssuesCreateResponseSchema>;

const IssuesGetInputSchema = z.object({
	issue_id_or_key: z.string(),
	fields: z.string().optional(),
	expand: z.string().optional(),
});
export type IssuesGetInput = z.infer<typeof IssuesGetInputSchema>;

const IssuesGetResponseSchema = JiraIssueSchema;
export type IssuesGetResponse = z.infer<typeof IssuesGetResponseSchema>;

const IssuesEditInputSchema = z.object({
	issue_id_or_key: z.string(),
	summary: z.string().optional(),
	description: z.string().optional(),
	assignee: z.string().optional(),
	priority: z.string().optional(),
	labels: z.array(z.string()).optional(),
	due_date: z.string().optional(),
	notify_users: z.boolean().optional(),
});
export type IssuesEditInput = z.infer<typeof IssuesEditInputSchema>;

const IssuesEditResponseSchema = z.object({
	success: z.boolean(),
	issue_key: z.string().optional(),
});
export type IssuesEditResponse = z.infer<typeof IssuesEditResponseSchema>;

const IssuesDeleteInputSchema = z.object({
	issue_id_or_key: z.string(),
	delete_subtasks: z.boolean().optional(),
});
export type IssuesDeleteInput = z.infer<typeof IssuesDeleteInputSchema>;

const IssuesDeleteResponseSchema = z.object({
	success: z.boolean(),
	message: z.string().optional(),
});
export type IssuesDeleteResponse = z.infer<typeof IssuesDeleteResponseSchema>;

const IssuesSearchInputSchema = z.object({
	jql: z.string(),
	start_at: z.number().optional(),
	max_results: z.number().optional(),
	fields: z.string().optional(),
	expand: z.string().optional(),
});
export type IssuesSearchInput = z.infer<typeof IssuesSearchInputSchema>;

const IssuesSearchResponseSchema = z.object({
	total: z.number().optional(),
	startAt: z.number().optional(),
	maxResults: z.number().optional(),
	issues: z.array(JiraIssueSchema).optional(),
});
export type IssuesSearchResponse = z.infer<typeof IssuesSearchResponseSchema>;

const IssuesAssignInputSchema = z.object({
	issue_id_or_key: z.string(),
	account_id: z.string().nullable().optional(),
});
export type IssuesAssignInput = z.infer<typeof IssuesAssignInputSchema>;

const IssuesAssignResponseSchema = z.object({
	success: z.boolean(),
});
export type IssuesAssignResponse = z.infer<typeof IssuesAssignResponseSchema>;

const IssuesGetTransitionsInputSchema = z.object({
	issue_id_or_key: z.string(),
});
export type IssuesGetTransitionsInput = z.infer<
	typeof IssuesGetTransitionsInputSchema
>;

const IssuesGetTransitionsResponseSchema = z.object({
	transitions: z.array(JiraTransitionSchema).optional(),
});
export type IssuesGetTransitionsResponse = z.infer<
	typeof IssuesGetTransitionsResponseSchema
>;

const IssuesTransitionInputSchema = z.object({
	issue_id_or_key: z.string(),
	transition_id: z.string(),
	comment: z.string().optional(),
});
export type IssuesTransitionInput = z.infer<typeof IssuesTransitionInputSchema>;

const IssuesTransitionResponseSchema = z.object({
	success: z.boolean(),
});
export type IssuesTransitionResponse = z.infer<
	typeof IssuesTransitionResponseSchema
>;

const IssuesBulkCreateInputSchema = z.object({
	issues: z.array(
		z.object({
			project_key: z.string(),
			summary: z.string(),
			issue_type: z.string().optional(),
			description: z.string().optional(),
			assignee: z.string().optional(),
			priority: z.string().optional(),
		}),
	),
});
export type IssuesBulkCreateInput = z.infer<typeof IssuesBulkCreateInputSchema>;

const IssuesBulkCreateResponseSchema = z.object({
	issues: z
		.array(
			z.object({
				id: z.string().optional(),
				key: z.string().optional(),
				self: z.string().optional(),
			}),
		)
		.optional(),
	errors: z.array(z.unknown()).optional(),
});
export type IssuesBulkCreateResponse = z.infer<
	typeof IssuesBulkCreateResponseSchema
>;

const IssuesBulkFetchInputSchema = z.object({
	issue_ids_or_keys: z.array(z.string()),
	fields: z.array(z.string()).optional(),
	expand: z.string().optional(),
});
export type IssuesBulkFetchInput = z.infer<typeof IssuesBulkFetchInputSchema>;

const IssuesBulkFetchResponseSchema = z.object({
	issues: z.array(JiraIssueSchema).optional(),
	issueErrors: z.array(z.unknown()).optional(),
});
export type IssuesBulkFetchResponse = z.infer<
	typeof IssuesBulkFetchResponseSchema
>;

const IssuesAddAttachmentInputSchema = z.object({
	issue_id_or_key: z.string(),
	file_name: z.string(),
	file_content: z.string(),
	mime_type: z.string().optional(),
});
export type IssuesAddAttachmentInput = z.infer<
	typeof IssuesAddAttachmentInputSchema
>;

const IssuesAddAttachmentResponseSchema = z.object({
	attachments: z
		.array(
			z.object({
				id: z.string().optional(),
				self: z.string().optional(),
				filename: z.string().optional(),
				mimeType: z.string().optional(),
				size: z.number().optional(),
				content: z.string().optional(),
				created: z.string().optional(),
			}),
		)
		.optional(),
});
export type IssuesAddAttachmentResponse = z.infer<
	typeof IssuesAddAttachmentResponseSchema
>;

const IssuesAddWatcherInputSchema = z.object({
	issue_id_or_key: z.string(),
	account_id: z.string(),
});
export type IssuesAddWatcherInput = z.infer<typeof IssuesAddWatcherInputSchema>;

const IssuesAddWatcherResponseSchema = z.object({
	success: z.boolean(),
});
export type IssuesAddWatcherResponse = z.infer<
	typeof IssuesAddWatcherResponseSchema
>;

const IssuesRemoveWatcherInputSchema = z.object({
	issue_id_or_key: z.string(),
	account_id: z.string(),
});
export type IssuesRemoveWatcherInput = z.infer<
	typeof IssuesRemoveWatcherInputSchema
>;

const IssuesRemoveWatcherResponseSchema = z.object({
	success: z.boolean(),
});
export type IssuesRemoveWatcherResponse = z.infer<
	typeof IssuesRemoveWatcherResponseSchema
>;

const IssuesLinkIssuesInputSchema = z.object({
	link_type: z.string(),
	inward_issue_key: z.string(),
	outward_issue_key: z.string(),
	comment: z.string().optional(),
});
export type IssuesLinkIssuesInput = z.infer<typeof IssuesLinkIssuesInputSchema>;

const IssuesLinkIssuesResponseSchema = z.object({
	success: z.boolean(),
});
export type IssuesLinkIssuesResponse = z.infer<
	typeof IssuesLinkIssuesResponseSchema
>;

// ── Comments ──────────────────────────────────────────────────────────────────

const CommentsAddInputSchema = z.object({
	issue_id_or_key: z.string(),
	comment: z.string(),
	visibility_type: z.string().optional(),
	visibility_value: z.string().optional(),
});
export type CommentsAddInput = z.infer<typeof CommentsAddInputSchema>;

const CommentsAddResponseSchema = z.object({
	id: z.string().optional(),
	self: z.string().optional(),
	author: JiraUserSchema.optional(),
	created: z.string().optional(),
});
export type CommentsAddResponse = z.infer<typeof CommentsAddResponseSchema>;

const CommentsGetInputSchema = z.object({
	issue_id_or_key: z.string(),
	comment_id: z.string(),
});
export type CommentsGetInput = z.infer<typeof CommentsGetInputSchema>;

const CommentsGetResponseSchema = JiraCommentSchema;
export type CommentsGetResponse = z.infer<typeof CommentsGetResponseSchema>;

const CommentsListInputSchema = z.object({
	issue_id_or_key: z.string(),
	start_at: z.number().optional(),
	max_results: z.number().optional(),
	order_by: z.string().optional(),
});
export type CommentsListInput = z.infer<typeof CommentsListInputSchema>;

const CommentsListResponseSchema = z.object({
	total: z.number().optional(),
	startAt: z.number().optional(),
	maxResults: z.number().optional(),
	comments: z.array(JiraCommentSchema).optional(),
});
export type CommentsListResponse = z.infer<typeof CommentsListResponseSchema>;

const CommentsUpdateInputSchema = z.object({
	issue_id_or_key: z.string(),
	comment_id: z.string(),
	comment: z.string(),
});
export type CommentsUpdateInput = z.infer<typeof CommentsUpdateInputSchema>;

const CommentsUpdateResponseSchema = JiraCommentSchema;
export type CommentsUpdateResponse = z.infer<
	typeof CommentsUpdateResponseSchema
>;

const CommentsDeleteInputSchema = z.object({
	issue_id_or_key: z.string(),
	comment_id: z.string(),
});
export type CommentsDeleteInput = z.infer<typeof CommentsDeleteInputSchema>;

const CommentsDeleteResponseSchema = z.object({
	success: z.boolean(),
});
export type CommentsDeleteResponse = z.infer<
	typeof CommentsDeleteResponseSchema
>;

// ── Projects ──────────────────────────────────────────────────────────────────

const ProjectsCreateInputSchema = z.object({
	key: z.string(),
	name: z.string(),
	project_type_key: z.string().optional(),
	description: z.string().optional(),
	lead_account_id: z.string().optional(),
	assignee_type: z.string().optional(),
});
export type ProjectsCreateInput = z.infer<typeof ProjectsCreateInputSchema>;

const ProjectsCreateResponseSchema = z.object({
	// Jira Cloud returns project id as a number from the create endpoint
	id: z.union([z.string(), z.number()]).optional(),
	key: z.string().optional(),
	self: z.string().optional(),
});
export type ProjectsCreateResponse = z.infer<
	typeof ProjectsCreateResponseSchema
>;

const ProjectsGetInputSchema = z.object({
	project_id_or_key: z.string(),
	expand: z.string().optional(),
});
export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;

const ProjectsGetResponseSchema = JiraProjectSchema;
export type ProjectsGetResponse = z.infer<typeof ProjectsGetResponseSchema>;

const ProjectsListInputSchema = z.object({
	query: z.string().optional(),
	order_by: z.string().optional(),
	start_at: z.number().optional(),
	max_results: z.number().optional(),
	expand: z.string().optional(),
});
export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;

const ProjectsListResponseSchema = z.object({
	total: z.number().optional(),
	startAt: z.number().optional(),
	maxResults: z.number().optional(),
	isLast: z.boolean().optional(),
	values: z.array(JiraProjectSchema).optional(),
});
export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;

const ProjectsGetRolesInputSchema = z.object({
	project_id_or_key: z.string(),
});
export type ProjectsGetRolesInput = z.infer<typeof ProjectsGetRolesInputSchema>;

const ProjectsGetRolesResponseSchema = z.record(z.string());
export type ProjectsGetRolesResponse = z.infer<
	typeof ProjectsGetRolesResponseSchema
>;

// ── Sprints ───────────────────────────────────────────────────────────────────

const SprintsCreateInputSchema = z.object({
	origin_board_id: z.number(),
	name: z.string(),
	goal: z.string().optional(),
	start_date: z.string().optional(),
	end_date: z.string().optional(),
});
export type SprintsCreateInput = z.infer<typeof SprintsCreateInputSchema>;

const SprintsCreateResponseSchema = JiraSprintSchema;
export type SprintsCreateResponse = z.infer<typeof SprintsCreateResponseSchema>;

const SprintsListInputSchema = z.object({
	board_id: z.number(),
	state: z.string().optional(),
	start_at: z.number().optional(),
	max_results: z.number().optional(),
});
export type SprintsListInput = z.infer<typeof SprintsListInputSchema>;

const SprintsListResponseSchema = z.object({
	maxResults: z.number().optional(),
	startAt: z.number().optional(),
	isLast: z.boolean().optional(),
	values: z.array(JiraSprintSchema).optional(),
});
export type SprintsListResponse = z.infer<typeof SprintsListResponseSchema>;

const SprintsMoveIssuesInputSchema = z.object({
	sprint_id: z.number(),
	issue_keys: z.array(z.string()),
});
export type SprintsMoveIssuesInput = z.infer<
	typeof SprintsMoveIssuesInputSchema
>;

const SprintsMoveIssuesResponseSchema = z.object({
	success: z.boolean(),
});
export type SprintsMoveIssuesResponse = z.infer<
	typeof SprintsMoveIssuesResponseSchema
>;

const SprintsListBoardsInputSchema = z.object({
	project_key_or_id: z.string().optional(),
	type: z.string().optional(),
	name: z.string().optional(),
	start_at: z.number().optional(),
	max_results: z.number().optional(),
});
export type SprintsListBoardsInput = z.infer<
	typeof SprintsListBoardsInputSchema
>;

const SprintsListBoardsResponseSchema = z.object({
	maxResults: z.number().optional(),
	startAt: z.number().optional(),
	isLast: z.boolean().optional(),
	total: z.number().optional(),
	values: z.array(JiraBoardSchema).optional(),
});
export type SprintsListBoardsResponse = z.infer<
	typeof SprintsListBoardsResponseSchema
>;

// ── Users ─────────────────────────────────────────────────────────────────────

const UsersGetCurrentInputSchema = z.object({});
export type UsersGetCurrentInput = z.infer<typeof UsersGetCurrentInputSchema>;

const UsersGetCurrentResponseSchema = JiraUserSchema.extend({
	accountId: z.string(),
	displayName: z.string().optional(),
	emailAddress: z.string().optional(),
	timeZone: z.string().optional(),
	locale: z.string().optional(),
});
export type UsersGetCurrentResponse = z.infer<
	typeof UsersGetCurrentResponseSchema
>;

const UsersFindInputSchema = z.object({
	query: z.string().optional(),
	account_id: z.string().optional(),
	start_at: z.number().optional(),
	max_results: z.number().optional(),
});
export type UsersFindInput = z.infer<typeof UsersFindInputSchema>;

const UsersFindResponseSchema = z.array(JiraUserSchema);
export type UsersFindResponse = z.infer<typeof UsersFindResponseSchema>;

const UsersGetAllInputSchema = z.object({
	start_at: z.number().optional(),
	max_results: z.number().optional(),
});
export type UsersGetAllInput = z.infer<typeof UsersGetAllInputSchema>;

const UsersGetAllResponseSchema = z.array(JiraUserSchema);
export type UsersGetAllResponse = z.infer<typeof UsersGetAllResponseSchema>;

// ── Groups ────────────────────────────────────────────────────────────────────

const GroupsGetAllInputSchema = z.object({
	start_at: z.number().optional(),
	max_results: z.number().optional(),
});
export type GroupsGetAllInput = z.infer<typeof GroupsGetAllInputSchema>;

const GroupsGetAllResponseSchema = z.object({
	total: z.number().optional(),
	header: z.string().optional(),
	groups: z
		.array(
			z.object({
				groupId: z.string().optional(),
				name: z.string().optional(),
				html: z.string().optional(),
			}),
		)
		.optional(),
});
export type GroupsGetAllResponse = z.infer<typeof GroupsGetAllResponseSchema>;

const GroupsCreateInputSchema = z.object({
	name: z.string(),
});
export type GroupsCreateInput = z.infer<typeof GroupsCreateInputSchema>;

const GroupsCreateResponseSchema = z.object({
	groupId: z.string().optional(),
	name: z.string().optional(),
	self: z.string().optional(),
});
export type GroupsCreateResponse = z.infer<typeof GroupsCreateResponseSchema>;

// ── Endpoint I/O Maps ─────────────────────────────────────────────────────────

export type JiraEndpointInputs = {
	issuesCreate: IssuesCreateInput;
	issuesGet: IssuesGetInput;
	issuesEdit: IssuesEditInput;
	issuesDelete: IssuesDeleteInput;
	issuesSearch: IssuesSearchInput;
	issuesAssign: IssuesAssignInput;
	issuesGetTransitions: IssuesGetTransitionsInput;
	issuesTransition: IssuesTransitionInput;
	issuesBulkCreate: IssuesBulkCreateInput;
	issuesBulkFetch: IssuesBulkFetchInput;
	issuesAddAttachment: IssuesAddAttachmentInput;
	issuesAddWatcher: IssuesAddWatcherInput;
	issuesRemoveWatcher: IssuesRemoveWatcherInput;
	issuesLinkIssues: IssuesLinkIssuesInput;
	commentsAdd: CommentsAddInput;
	commentsGet: CommentsGetInput;
	commentsList: CommentsListInput;
	commentsUpdate: CommentsUpdateInput;
	commentsDelete: CommentsDeleteInput;
	projectsCreate: ProjectsCreateInput;
	projectsGet: ProjectsGetInput;
	projectsList: ProjectsListInput;
	projectsGetRoles: ProjectsGetRolesInput;
	sprintsCreate: SprintsCreateInput;
	sprintsList: SprintsListInput;
	sprintsMoveIssues: SprintsMoveIssuesInput;
	sprintsListBoards: SprintsListBoardsInput;
	usersGetCurrent: UsersGetCurrentInput;
	usersFind: UsersFindInput;
	usersGetAll: UsersGetAllInput;
	groupsGetAll: GroupsGetAllInput;
	groupsCreate: GroupsCreateInput;
};

export type JiraEndpointOutputs = {
	issuesCreate: IssuesCreateResponse;
	issuesGet: IssuesGetResponse;
	issuesEdit: IssuesEditResponse;
	issuesDelete: IssuesDeleteResponse;
	issuesSearch: IssuesSearchResponse;
	issuesAssign: IssuesAssignResponse;
	issuesGetTransitions: IssuesGetTransitionsResponse;
	issuesTransition: IssuesTransitionResponse;
	issuesBulkCreate: IssuesBulkCreateResponse;
	issuesBulkFetch: IssuesBulkFetchResponse;
	issuesAddAttachment: IssuesAddAttachmentResponse;
	issuesAddWatcher: IssuesAddWatcherResponse;
	issuesRemoveWatcher: IssuesRemoveWatcherResponse;
	issuesLinkIssues: IssuesLinkIssuesResponse;
	commentsAdd: CommentsAddResponse;
	commentsGet: CommentsGetResponse;
	commentsList: CommentsListResponse;
	commentsUpdate: CommentsUpdateResponse;
	commentsDelete: CommentsDeleteResponse;
	projectsCreate: ProjectsCreateResponse;
	projectsGet: ProjectsGetResponse;
	projectsList: ProjectsListResponse;
	projectsGetRoles: ProjectsGetRolesResponse;
	sprintsCreate: SprintsCreateResponse;
	sprintsList: SprintsListResponse;
	sprintsMoveIssues: SprintsMoveIssuesResponse;
	sprintsListBoards: SprintsListBoardsResponse;
	usersGetCurrent: UsersGetCurrentResponse;
	usersFind: UsersFindResponse;
	usersGetAll: UsersGetAllResponse;
	groupsGetAll: GroupsGetAllResponse;
	groupsCreate: GroupsCreateResponse;
};

export const JiraEndpointInputSchemas = {
	issuesCreate: IssuesCreateInputSchema,
	issuesGet: IssuesGetInputSchema,
	issuesEdit: IssuesEditInputSchema,
	issuesDelete: IssuesDeleteInputSchema,
	issuesSearch: IssuesSearchInputSchema,
	issuesAssign: IssuesAssignInputSchema,
	issuesGetTransitions: IssuesGetTransitionsInputSchema,
	issuesTransition: IssuesTransitionInputSchema,
	issuesBulkCreate: IssuesBulkCreateInputSchema,
	issuesBulkFetch: IssuesBulkFetchInputSchema,
	issuesAddAttachment: IssuesAddAttachmentInputSchema,
	issuesAddWatcher: IssuesAddWatcherInputSchema,
	issuesRemoveWatcher: IssuesRemoveWatcherInputSchema,
	issuesLinkIssues: IssuesLinkIssuesInputSchema,
	commentsAdd: CommentsAddInputSchema,
	commentsGet: CommentsGetInputSchema,
	commentsList: CommentsListInputSchema,
	commentsUpdate: CommentsUpdateInputSchema,
	commentsDelete: CommentsDeleteInputSchema,
	projectsCreate: ProjectsCreateInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsGetRoles: ProjectsGetRolesInputSchema,
	sprintsCreate: SprintsCreateInputSchema,
	sprintsList: SprintsListInputSchema,
	sprintsMoveIssues: SprintsMoveIssuesInputSchema,
	sprintsListBoards: SprintsListBoardsInputSchema,
	usersGetCurrent: UsersGetCurrentInputSchema,
	usersFind: UsersFindInputSchema,
	usersGetAll: UsersGetAllInputSchema,
	groupsGetAll: GroupsGetAllInputSchema,
	groupsCreate: GroupsCreateInputSchema,
} as const;

export const JiraEndpointOutputSchemas = {
	issuesCreate: IssuesCreateResponseSchema,
	issuesGet: IssuesGetResponseSchema,
	issuesEdit: IssuesEditResponseSchema,
	issuesDelete: IssuesDeleteResponseSchema,
	issuesSearch: IssuesSearchResponseSchema,
	issuesAssign: IssuesAssignResponseSchema,
	issuesGetTransitions: IssuesGetTransitionsResponseSchema,
	issuesTransition: IssuesTransitionResponseSchema,
	issuesBulkCreate: IssuesBulkCreateResponseSchema,
	issuesBulkFetch: IssuesBulkFetchResponseSchema,
	issuesAddAttachment: IssuesAddAttachmentResponseSchema,
	issuesAddWatcher: IssuesAddWatcherResponseSchema,
	issuesRemoveWatcher: IssuesRemoveWatcherResponseSchema,
	issuesLinkIssues: IssuesLinkIssuesResponseSchema,
	commentsAdd: CommentsAddResponseSchema,
	commentsGet: CommentsGetResponseSchema,
	commentsList: CommentsListResponseSchema,
	commentsUpdate: CommentsUpdateResponseSchema,
	commentsDelete: CommentsDeleteResponseSchema,
	projectsCreate: ProjectsCreateResponseSchema,
	projectsGet: ProjectsGetResponseSchema,
	projectsList: ProjectsListResponseSchema,
	projectsGetRoles: ProjectsGetRolesResponseSchema,
	sprintsCreate: SprintsCreateResponseSchema,
	sprintsList: SprintsListResponseSchema,
	sprintsMoveIssues: SprintsMoveIssuesResponseSchema,
	sprintsListBoards: SprintsListBoardsResponseSchema,
	usersGetCurrent: UsersGetCurrentResponseSchema,
	usersFind: UsersFindResponseSchema,
	usersGetAll: UsersGetAllResponseSchema,
	groupsGetAll: GroupsGetAllResponseSchema,
	groupsCreate: GroupsCreateResponseSchema,
} as const;
