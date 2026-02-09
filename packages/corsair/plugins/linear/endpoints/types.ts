import { z } from 'zod';

// Base schemas
export const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().optional().nullable(),
	displayName: z.string(),
	avatarUrl: z.string().optional().nullable(),
	active: z.boolean(),
	admin: z.boolean(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const TeamSchema = z.object({
	id: z.string(),
	name: z.string(),
	key: z.string(),
	description: z.string().optional().nullable(),
	icon: z.string().optional().nullable(),
	color: z.string().optional().nullable(),
	private: z.boolean(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
	archivedAt: z.coerce.date().nullable().optional(),
});

export const WorkflowStateTypeSchema = z.enum([
	'backlog',
	'unstarted',
	'started',
	'completed',
	'canceled',
]);

export const WorkflowStateSchema = z.object({
	id: z.string(),
	names: z.string(),
	type: WorkflowStateTypeSchema,
	color: z.string(),
	position: z.number(),
	description: z.string().optional().nullable(),
	team: TeamSchema,
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const LabelSchema: z.ZodType<any> = z.lazy(() =>
	z.object({
		id: z.string(),
		name: z.string(),
		description: z.string().optional().nullable(),
		color: z.string(),
		team: TeamSchema.optional().nullable(),
		parent: LabelSchema.optional().nullable(),
		createdAt: z.coerce.date().nullable().optional(),
		updatedAt: z.coerce.date().nullable().optional(),
	}),
);

export const ProjectStateSchema = z.enum([
	'backlog',
	'planned',
	'started',
	'paused',
	'completed',
	'canceled',
]);

export const ProjectSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional().nullable(),
	icon: z.string().optional().nullable(),
	color: z.string().optional().nullable(),
	state: ProjectStateSchema,
	priority: z.number(),
	sortOrder: z.number(),
	startDate: z.coerce.date().nullable().optional(),
	targetDate: z.coerce.date().nullable().optional(),
	completedAt: z.coerce.date().nullable().optional(),
	canceledAt: z.coerce.date().nullable().optional(),
	lead: UserSchema.optional().nullable(),
	teams: z.array(TeamSchema),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
	archivedAt: z.coerce.date().nullable().optional(),
});

export const CycleSchema = z.object({
	id: z.string(),
	number: z.number(),
	name: z.string().optional().nullable(),
	description: z.string().optional().nullable(),
	startsAt: z.coerce.date().nullable().optional(),
	endsAt: z.coerce.date().nullable().optional(),
	completedAt: z.coerce.date().nullable().optional(),
	team: TeamSchema,
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
	archivedAt: z.coerce.date().nullable().optional(),
});

export const IssuePrioritySchema = z.union([
	z.literal(0),
	z.literal(1),
	z.literal(2),
	z.literal(3),
	z.literal(4),
]);

export const IssueSchema: z.ZodType<any> = z.lazy(() =>
	z.object({
		id: z.string(),
		title: z.string(),
		description: z.string().optional().nullable(),
		priority: IssuePrioritySchema,
		estimate: z.number().optional().nullable(),
		sortOrder: z.number(),
		number: z.number(),
		identifier: z.string(),
		url: z.string(),
		state: WorkflowStateSchema,
		team: TeamSchema,
		assignee: UserSchema.optional().nullable(),
		creator: UserSchema,
		project: ProjectSchema.optional().nullable(),
		cycle: CycleSchema.optional().nullable(),
		parent: IssueSchema.optional().nullable(),
		labels: z.array(LabelSchema),
		subscribers: z.array(UserSchema),
		dueDate: z.coerce.date().nullable().optional(),
		startedAt: z.coerce.date().nullable().optional(),
		completedAt: z.coerce.date().nullable().optional(),
		canceledAt: z.coerce.date().nullable().optional(),
		triagedAt: z.coerce.date().nullable().optional(),
		snoozedUntilAt: z.coerce.date().nullable().optional(),
		createdAt: z.coerce.date().nullable().optional(),
		updatedAt: z.coerce.date().nullable().optional(),
		archivedAt: z.coerce.date().nullable().optional(),
	}),
);

export const CommentSchema: z.ZodType<any> = z.lazy(() =>
	z.object({
		id: z.string(),
		body: z.string(),
		issue: IssueSchema,
		user: UserSchema,
		parent: CommentSchema.optional().nullable(),
		editedAt: z.coerce.date().nullable().optional(),
		createdAt: z.coerce.date().nullable().optional(),
		updatedAt: z.coerce.date().nullable().optional(),
		archivedAt: z.coerce.date().nullable().optional(),
	}),
);

export const PageInfoSchema = z.object({
	hasNextPage: z.boolean(),
	hasPreviousPage: z.boolean(),
	startCursor: z.string().optional().nullable(),
	endCursor: z.string().optional().nullable(),
});

export const IssueConnectionSchema = z.object({
	nodes: z.array(IssueSchema),
	pageInfo: PageInfoSchema,
});

export const TeamConnectionSchema = z.object({
	nodes: z.array(TeamSchema),
	pageInfo: PageInfoSchema,
});

export const ProjectConnectionSchema = z.object({
	nodes: z.array(ProjectSchema),
	pageInfo: PageInfoSchema,
});

export const CommentConnectionSchema = z.object({
	nodes: z.array(CommentSchema),
	pageInfo: PageInfoSchema,
});

// Input schemas
export const CreateIssueInputSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	teamId: z.string(),
	assigneeId: z.string().optional(),
	priority: IssuePrioritySchema.optional(),
	estimate: z.number().optional(),
	stateId: z.string().optional(),
	projectId: z.string().optional(),
	cycleId: z.string().optional(),
	parentId: z.string().optional(),
	labelIds: z.array(z.string()).optional(),
	subscriberIds: z.array(z.string()).optional(),
	dueDate: z.coerce.date().nullable().optional(),
});

export const UpdateIssueInputSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	assigneeId: z.string().optional(),
	priority: IssuePrioritySchema.optional(),
	estimate: z.number().optional(),
	stateId: z.string().optional(),
	projectId: z.string().optional(),
	cycleId: z.string().optional(),
	parentId: z.string().optional(),
	labelIds: z.array(z.string()).optional(),
	subscriberIds: z.array(z.string()).optional(),
	dueDate: z.coerce.date().nullable().optional(),
});

export const CreateProjectInputSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	icon: z.string().optional(),
	color: z.string().optional(),
	teamIds: z.array(z.string()),
	leadId: z.string().optional(),
	state: ProjectStateSchema.optional(),
	priority: z.number().optional(),
	startDate: z.coerce.date().nullable().optional(),
	targetDate: z.coerce.date().nullable().optional(),
});

export const UpdateProjectInputSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	icon: z.string().optional(),
	color: z.string().optional(),
	teamIds: z.array(z.string()).optional(),
	leadId: z.string().optional(),
	state: ProjectStateSchema.optional(),
	priority: z.number().optional(),
	startDate: z.coerce.date().nullable().optional(),
	targetDate: z.coerce.date().nullable().optional(),
});

export const CreateCommentInputSchema = z.object({
	issueId: z.string(),
	body: z.string(),
	parentId: z.string().optional(),
});

export const UpdateCommentInputSchema = z.object({
	body: z.string().optional(),
});

// Response schemas
export const IssuesListResponseSchema = z.object({
	issues: IssueConnectionSchema,
});

export const IssueGetResponseSchema = z.object({
	issue: IssueSchema,
});

export const IssueCreateResponseSchema = z.object({
	issueCreate: z.object({
		success: z.boolean(),
		issue: IssueSchema,
	}),
});

export const IssueUpdateResponseSchema = z.object({
	issueUpdate: z.object({
		success: z.boolean(),
		issue: IssueSchema,
	}),
});

export const IssueDeleteResponseSchema = z.object({
	issueDelete: z.object({
		success: z.boolean(),
	}),
});

export const TeamsListResponseSchema = z.object({
	teams: TeamConnectionSchema,
});

export const TeamGetResponseSchema = z.object({
	team: TeamSchema,
});

export const ProjectsListResponseSchema = z.object({
	projects: ProjectConnectionSchema,
});

export const ProjectGetResponseSchema = z.object({
	project: ProjectSchema,
});

export const ProjectCreateResponseSchema = z.object({
	projectCreate: z.object({
		success: z.boolean(),
		project: ProjectSchema,
	}),
});

export const ProjectUpdateResponseSchema = z.object({
	projectUpdate: z.object({
		success: z.boolean(),
		project: ProjectSchema,
	}),
});

export const ProjectDeleteResponseSchema = z.object({
	projectDelete: z.object({
		success: z.boolean(),
	}),
});

export const CommentsListResponseSchema = z.object({
	issue: z.object({
		comments: CommentConnectionSchema,
	}),
});

export const CommentCreateResponseSchema = z.object({
	commentCreate: z.object({
		success: z.boolean(),
		comment: CommentSchema,
	}),
});

export const CommentUpdateResponseSchema = z.object({
	commentUpdate: z.object({
		success: z.boolean(),
		comment: CommentSchema,
	}),
});

export const CommentDeleteResponseSchema = z.object({
	commentDelete: z.object({
		success: z.boolean(),
	}),
});

const MinimalUserSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string(),
	email: z.string().optional().nullable(),
});

const MinimalTeamSchema = z.object({
	id: z.string(),
	name: z.string(),
	key: z.string(),
});

const MinimalWorkflowStateSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: WorkflowStateTypeSchema,
	color: z.string().optional(),
	position: z.number().optional(),
});

const MinimalLabelSchema = z.object({
	id: z.string(),
	name: z.string(),
	color: z.string(),
});

const LabelConnectionSchema = z.object({
	nodes: z.array(MinimalLabelSchema),
});

const SubscriberConnectionSchema = z.object({
	nodes: z.array(MinimalUserSchema),
});

const MinimalIssueSchema = z.object({
	id: z.string(),
});

const ProjectTeamsConnectionSchema = z.object({
	nodes: z.array(MinimalTeamSchema),
});

const IssueListGetSchema: z.ZodType<unknown> = z.lazy(() =>
	z.object({
		id: z.string(),
		title: z.string(),
		description: z.string().optional().nullable(),
		priority: IssuePrioritySchema,
		estimate: z.number().optional().nullable(),
		sortOrder: z.number(),
		number: z.number(),
		identifier: z.string(),
		url: z.string(),
		state: MinimalWorkflowStateSchema,
		team: MinimalTeamSchema,
		assignee: MinimalUserSchema.optional().nullable(),
		creator: MinimalUserSchema,
		project: z
			.object({
				id: z.string(),
				name: z.string(),
				state: ProjectStateSchema,
			})
			.optional()
			.nullable(),
		cycle: z
			.object({
				id: z.string(),
				number: z.number(),
				name: z.string().optional().nullable(),
			})
			.optional()
			.nullable(),
		parent: IssueListGetSchema.optional().nullable(),
		labels: LabelConnectionSchema,
		subscribers: SubscriberConnectionSchema.nullish(),
		dueDate: z.coerce.date().nullable().optional(),
		startedAt: z.coerce.date().nullable().optional(),
		completedAt: z.coerce.date().nullable().optional(),
		canceledAt: z.coerce.date().nullable().optional(),
		triagedAt: z.coerce.date().nullable().optional(),
		snoozedUntilAt: z.coerce.date().nullable().optional(),
		createdAt: z.coerce.date().nullable().optional(),
		updatedAt: z.coerce.date().nullable().optional(),
		archivedAt: z.coerce.date().nullable().optional(),
	}),
);

const IssueListGetConnectionSchema = z.object({
	nodes: z.array(IssueListGetSchema),
	pageInfo: PageInfoSchema,
});

const PartialIssueSchema = z.object({
	id: z.string(),
	title: z.string().optional(),
	description: z.string().optional().nullable(),
	priority: IssuePrioritySchema.optional(),
	estimate: z.number().optional().nullable(),
	sortOrder: z.number().optional(),
	number: z.number().optional(),
	identifier: z.string().optional(),
	url: z.string().optional(),
	state: MinimalWorkflowStateSchema.optional(),
	team: MinimalTeamSchema.optional(),
	assignee: MinimalUserSchema.optional().nullable(),
	creator: MinimalUserSchema.optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

const MinimalProjectSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional().nullable(),
	icon: z.string().optional().nullable(),
	color: z.string().optional().nullable(),
	state: ProjectStateSchema,
	priority: z.number(),
	sortOrder: z.number().optional(),
	startDate: z.coerce.date().nullable().optional(),
	targetDate: z.coerce.date().nullable().optional(),
	completedAt: z.coerce.date().nullable().optional(),
	canceledAt: z.coerce.date().nullable().optional(),
	lead: MinimalUserSchema.optional().nullable(),
	teams: ProjectTeamsConnectionSchema,
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
	archivedAt: z.coerce.date().nullable().optional(),
});

const MinimalProjectUpdateSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional().nullable(),
	icon: z.string().optional().nullable(),
	color: z.string().optional().nullable(),
	state: ProjectStateSchema,
	priority: z.number(),
	sortOrder: z.number().optional(),
	startDate: z.coerce.date().nullable().optional(),
	targetDate: z.coerce.date().nullable().optional(),
	completedAt: z.coerce.date().nullable().optional(),
	canceledAt: z.coerce.date().nullable().optional(),
	lead: MinimalUserSchema.optional().nullable(),
	teams: ProjectTeamsConnectionSchema.optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
	archivedAt: z.coerce.date().nullable().optional(),
});

const ProjectListGetSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional().nullable(),
	icon: z.string().optional().nullable(),
	color: z.string().optional().nullable(),
	state: ProjectStateSchema,
	priority: z.number(),
	sortOrder: z.number(),
	startDate: z.coerce.date().nullable().optional(),
	targetDate: z.coerce.date().nullable().optional(),
	completedAt: z.coerce.date().nullable().optional(),
	canceledAt: z.coerce.date().nullable().optional(),
	lead: MinimalUserSchema.optional().nullable(),
	teams: ProjectTeamsConnectionSchema,
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

const ProjectListGetConnectionSchema = z.object({
	nodes: z.array(ProjectListGetSchema),
	pageInfo: PageInfoSchema,
});

const CommentTestSchema = z.lazy(() =>
	z.object({
		id: z.string(),
		body: z.string(),
		issue: MinimalIssueSchema,
		user: MinimalUserSchema,
		parent: z.object({ id: z.string() }).optional().nullable(),
		editedAt: z.coerce.date().nullable().optional(),
		createdAt: z.coerce.date().nullable().optional(),
		updatedAt: z.coerce.date().nullable().optional(),
		archivedAt: z.coerce.date().nullable().optional(),
	}),
);

export const LinearEndpointOutputSchemas = {
	issuesList: IssueListGetConnectionSchema,
	issuesGet: IssueListGetSchema,
	issuesCreate: PartialIssueSchema,
	issuesUpdate: PartialIssueSchema,
	issuesDelete: z.boolean(),
	teamsList: TeamConnectionSchema,
	teamsGet: TeamSchema,
	projectsList: ProjectListGetConnectionSchema,
	projectsGet: ProjectListGetSchema,
	projectsCreate: MinimalProjectSchema,
	projectsUpdate: MinimalProjectUpdateSchema,
	projectsDelete: z.boolean(),
	commentsList: CommentConnectionSchema,
	commentsCreate: CommentTestSchema,
	commentsUpdate: CommentTestSchema,
	commentsDelete: z.boolean(),
} as const;

export type LinearEndpointOutputs = {
	[K in keyof typeof LinearEndpointOutputSchemas]: z.infer<
		(typeof LinearEndpointOutputSchemas)[K]
	>;
};

// TypeScript types inferred from Zod schemas
export type User = z.infer<typeof UserSchema>;
export type Team = z.infer<typeof TeamSchema>;
export type WorkflowStateType = z.infer<typeof WorkflowStateTypeSchema>;
export type WorkflowState = z.infer<typeof WorkflowStateSchema>;
export type Label = z.infer<typeof LabelSchema>;
export type ProjectState = z.infer<typeof ProjectStateSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Cycle = z.infer<typeof CycleSchema>;
export type IssuePriority = z.infer<typeof IssuePrioritySchema>;
export type Issue = z.infer<typeof IssueSchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type PageInfo = z.infer<typeof PageInfoSchema>;
export type IssueConnection = z.infer<typeof IssueConnectionSchema>;
export type TeamConnection = z.infer<typeof TeamConnectionSchema>;
export type ProjectConnection = z.infer<typeof ProjectConnectionSchema>;
export type CommentConnection = z.infer<typeof CommentConnectionSchema>;

export type CreateIssueInput = z.infer<typeof CreateIssueInputSchema>;
export type UpdateIssueInput = z.infer<typeof UpdateIssueInputSchema>;
export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectInputSchema>;
export type CreateCommentInput = z.infer<typeof CreateCommentInputSchema>;
export type UpdateCommentInput = z.infer<typeof UpdateCommentInputSchema>;

export type IssuesListResponse = z.infer<
	typeof LinearEndpointOutputSchemas.issuesList
>;
export type IssueGetResponse = z.infer<
	typeof LinearEndpointOutputSchemas.issuesGet
>;
export type IssueCreateResponse = z.infer<
	typeof LinearEndpointOutputSchemas.issuesCreate
>;
export type IssueUpdateResponse = z.infer<
	typeof LinearEndpointOutputSchemas.issuesUpdate
>;
export type IssueDeleteResponse = z.infer<
	typeof LinearEndpointOutputSchemas.issuesDelete
>;

export type TeamsListResponse = z.infer<
	typeof LinearEndpointOutputSchemas.teamsList
>;
export type TeamGetResponse = z.infer<
	typeof LinearEndpointOutputSchemas.teamsGet
>;

export type ProjectsListResponse = z.infer<
	typeof LinearEndpointOutputSchemas.projectsList
>;
export type ProjectGetResponse = z.infer<
	typeof LinearEndpointOutputSchemas.projectsGet
>;
export type ProjectCreateResponse = z.infer<
	typeof LinearEndpointOutputSchemas.projectsCreate
>;
export type ProjectUpdateResponse = z.infer<
	typeof LinearEndpointOutputSchemas.projectsUpdate
>;
export type ProjectDeleteResponse = z.infer<
	typeof LinearEndpointOutputSchemas.projectsDelete
>;

export type CommentsListResponse = z.infer<
	typeof LinearEndpointOutputSchemas.commentsList
>;
export type CommentCreateResponse = z.infer<
	typeof LinearEndpointOutputSchemas.commentsCreate
>;
export type CommentUpdateResponse = z.infer<
	typeof LinearEndpointOutputSchemas.commentsUpdate
>;
export type CommentDeleteResponse = z.infer<
	typeof LinearEndpointOutputSchemas.commentsDelete
>;
