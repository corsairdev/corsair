import { z } from 'zod';

// ── Shared ────────────────────────────────────────────────────────────────
//
// Leiga returns epoch milliseconds for timestamps and numbers for ids. A
// missing numeric field comes back as an absent key rather than null, so output
// fields are `.nullish()` throughout.

const id = z.number().int().describe('Leiga numeric id');

/** Unix epoch milliseconds. */
const timestamp = z.number().int().describe('Unix epoch milliseconds');

const userRef = z
	.object({
		userId: id.nullish(),
		userName: z.string().nullish(),
		profilePicture: z.string().nullish(),
		accountEnabled: z.number().nullish(),
	})
	.loose();

// ── projects.list ─────────────────────────────────────────────────────────

const ProjectsListInputSchema = z.object({});

export type ProjectsListInput = z.input<typeof ProjectsListInputSchema>;

const ProjectSummarySchema = z
	.object({
		id,
		pname: z.string().describe('Project name'),
		pkey: z.string().describe('Project key, e.g. LGC'),
		archived: z
			.number()
			.nullish()
			.describe('1 when the project is archived, 0 otherwise'),
	})
	.loose();

export type LeigaProjectSummary = z.infer<typeof ProjectSummarySchema>;

const ProjectsListResponseSchema = z.object({
	projects: z.array(ProjectSummarySchema),
});

export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;

// ── projects.get ──────────────────────────────────────────────────────────

const ProjectsGetInputSchema = z.object({
	projectId: id,
});

export type ProjectsGetInput = z.input<typeof ProjectsGetInputSchema>;

const ProjectSchema = z
	.object({
		id,
		projectName: z.string(),
		projectKey: z.string(),
		description: z.string().nullish(),
		leader: z.string().nullish().describe('Leader display name'),
		leaderId: id.nullish(),
		avatar: z.number().nullish(),
		url: z.string().nullish().describe('Console URL for the project'),
		archived: z.number().nullish(),
		status: z.number().nullish(),
		projectCategory: z.number().nullish(),
		createBy: id.nullish(),
		createTime: timestamp.nullish(),
		updateTime: timestamp.nullish(),
	})
	.loose();

export type LeigaProject = z.infer<typeof ProjectSchema>;

const ProjectsGetResponseSchema = ProjectSchema;

export type ProjectsGetResponse = z.infer<typeof ProjectsGetResponseSchema>;

// ── projects.getByKey ─────────────────────────────────────────────────────

const ProjectsGetByKeyInputSchema = z.object({
	projectKey: z.string().min(1).describe('Project key, e.g. LGC'),
});

export type ProjectsGetByKeyInput = z.input<typeof ProjectsGetByKeyInputSchema>;

const ProjectsGetByKeyResponseSchema = ProjectSchema;

export type ProjectsGetByKeyResponse = z.infer<
	typeof ProjectsGetByKeyResponseSchema
>;

// ── projects.templates ────────────────────────────────────────────────────

const ProjectsTemplatesInputSchema = z.object({});

export type ProjectsTemplatesInput = z.input<
	typeof ProjectsTemplatesInputSchema
>;

const ProjectTemplateSchema = z
	.object({
		code: z.string().describe('Template code; pass it to projects.create'),
		name: z.string().nullish(),
	})
	.loose();

export type LeigaProjectTemplate = z.infer<typeof ProjectTemplateSchema>;

const ProjectsTemplatesResponseSchema = z.object({
	templates: z.array(ProjectTemplateSchema),
});

export type ProjectsTemplatesResponse = z.infer<
	typeof ProjectsTemplatesResponseSchema
>;

// ── issues.list ───────────────────────────────────────────────────────────

const IssuesListInputSchema = z.object({
	projectId: id.describe('Project to query'),
	pageNumber: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number, from 1'),
	pageSize: z.number().int().min(1).max(100).optional().describe('Page size'),
	summary: z.string().optional().describe('Filter on summary text'),
	orderBy: z
		.enum(['createTime', 'updateTime'])
		.optional()
		.describe('Field to sort by'),
	sort: z.enum(['ASC', 'DESC']).optional().describe('Sort direction'),
	statusTypes: z
		.array(z.number().int())
		.optional()
		.describe('Status types to include: 2 not started, 3 in progress, 4 done'),
});

export type IssuesListInput = z.input<typeof IssuesListInputSchema>;

const IssueTypeRefSchema = z
	.object({
		id: id.nullish(),
		code: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

const TagRefSchema = z
	.object({
		id: id.nullish(),
		tagName: z.string().nullish(),
	})
	.loose();

const IssueSummarySchema = z
	.object({
		id,
		summary: z.string(),
		issueTypeId: id.nullish(),
		issueTypeName: z.string().nullish(),
		issueTypeVO: IssueTypeRefSchema.nullish(),
		priorityId: id.nullish(),
		priorityName: z.string().nullish(),
		statusType: z
			.number()
			.nullish()
			.describe('2 not started, 3 in progress, 4 done'),
		statusName: z.string().nullish(),
		assigneeId: id.nullish(),
		assigneeName: z.string().nullish(),
		assigneeVO: userRef.nullish(),
		updateBy: id.nullish(),
		updateByVO: userRef.nullish(),
		updateTime: timestamp.nullish(),
		dueDate: timestamp.nullish(),
		sprintName: z.string().nullish(),
		tags: z.array(TagRefSchema).nullish(),
		// unknown: custom field values are account-defined, so the shape is not
		// knowable here.
		customFieldData: z
			.record(z.string(), z.unknown())
			.nullish()
			.describe(
				'Custom field values keyed by field code, e.g. customfield_213979997',
			),
	})
	.loose();

export type LeigaIssueSummary = z.infer<typeof IssueSummarySchema>;

const IssuesListResponseSchema = z.object({
	issues: z.array(IssueSummarySchema),
	total: z.number().int(),
});

export type IssuesListResponse = z.infer<typeof IssuesListResponseSchema>;

// ── issues.get ────────────────────────────────────────────────────────────

const IssuesGetInputSchema = z.object({
	issueId: id.describe('Issue id'),
});

export type IssuesGetInput = z.input<typeof IssuesGetInputSchema>;

/**
 * A single issue. Leiga wraps the detail **twice**: the envelope's `data` holds
 * `{ data: {...}, id, projectId, createTime, updateTime }`, and the interesting
 * fields live in the inner `data`. The endpoint flattens that before parsing,
 * keeping the outer audit fields, so callers get one object rather than two
 * levels of `.data`.
 *
 * Every field past `id` stays optional: the detail response carries far more
 * than the list does (`docsVO`, `figmaVO`, `priorityVO`, labour totals), and
 * rejecting a field we did not enumerate would break the call.
 */
const IssueSchema = z
	.object({
		id,
		issueNumber: z.string().nullish().describe('Human-readable, e.g. SAMPL-23'),
		summary: z.string().nullish(),
		projectId: id.nullish(),
		issueTypeId: id.nullish(),
		issueTypeName: z.string().nullish(),
		statusId: id.nullish(),
		statusName: z.string().nullish(),
		statusType: z.number().nullish(),
		priorityId: id.nullish(),
		priorityName: z.string().nullish(),
		assigneeId: id.nullish(),
		assigneeName: z.string().nullish(),
		assigneeVO: userRef.nullish(),
		createBy: id.nullish(),
		createByVO: userRef.nullish(),
		createTime: timestamp.nullish(),
		updateBy: id.nullish(),
		updateByVO: userRef.nullish(),
		updateTime: timestamp.nullish(),
		dueDate: timestamp.nullish(),
		startDate: timestamp.nullish(),
		description: z.string().nullish().describe('HTML'),
		sprint: z
			.union([z.string(), z.number()])
			.nullish()
			.describe('Sprint id, absent when the issue is not in one'),
		estimateLabour: z.number().nullish(),
		totalRemainingLabour: z.number().nullish(),
		isArchived: z.number().nullish(),
		issueNumberOrAlias: z.string().nullish(),
		tags: z.array(TagRefSchema).nullish(),
		// unknown: custom field values are account-defined; `issues.fields` lists
		// the codes for one issue type, so the set is not knowable here.
		customFieldData: z
			.record(z.string(), z.unknown())
			.nullish()
			.describe(
				'Custom field values keyed by field code, e.g. customfield_213979997',
			),
	})
	.loose();

export type LeigaIssue = z.infer<typeof IssueSchema>;

const IssuesGetResponseSchema = IssueSchema;

export type IssuesGetResponse = z.infer<typeof IssuesGetResponseSchema>;

// ── issues.getByNumber ────────────────────────────────────────────────────

const IssuesGetByNumberInputSchema = z.object({
	issueNumber: z.string().min(1).describe('Issue number, e.g. LGC-12'),
});

export type IssuesGetByNumberInput = z.input<
	typeof IssuesGetByNumberInputSchema
>;

const IssuesGetByNumberResponseSchema = IssueSchema;

export type IssuesGetByNumberResponse = z.infer<
	typeof IssuesGetByNumberResponseSchema
>;

// ── issues.types ──────────────────────────────────────────────────────────

const IssuesTypesInputSchema = z.object({
	projectId: id,
});

export type IssuesTypesInput = z.input<typeof IssuesTypesInputSchema>;

const IssueTypeSchema = z
	.object({
		id,
		code: z.string().nullish().describe('Stable code, e.g. bug or story'),
		name: z.string().nullish(),
		workflowId: id
			.nullish()
			.describe('Workflow this type uses; pass it to workflows.nextStates'),
	})
	.loose();

export type LeigaIssueType = z.infer<typeof IssueTypeSchema>;

const IssuesTypesResponseSchema = z.object({
	issueTypes: z.array(IssueTypeSchema),
});

export type IssuesTypesResponse = z.infer<typeof IssuesTypesResponseSchema>;

// ── issues.fields ─────────────────────────────────────────────────────────

const IssuesFieldsInputSchema = z.object({
	projectId: id,
	issueTypeId: id,
});

export type IssuesFieldsInput = z.input<typeof IssuesFieldsInputSchema>;

// Leiga answers `{ fieldName, fieldCode }`, not `{ name, code, fieldType }`.
const IssueFieldSchema = z
	.object({
		fieldName: z.string().describe('Display name, e.g. Passed The Review'),
		fieldCode: z
			.string()
			.describe('Code used in an issue, e.g. customfield_213979997'),
	})
	.loose();

export type LeigaIssueField = z.infer<typeof IssueFieldSchema>;

const IssuesFieldsResponseSchema = z.object({
	fields: z.array(IssueFieldSchema),
});

export type IssuesFieldsResponse = z.infer<typeof IssuesFieldsResponseSchema>;

// ── sprints.list ──────────────────────────────────────────────────────────

const SprintsListInputSchema = z.object({
	projectId: id,
});

export type SprintsListInput = z.input<typeof SprintsListInputSchema>;

const SprintSchema = z
	.object({
		id,
		name: z.string().nullish(),
		goal: z.string().nullish(),
		// Documented as a string in the example, and also seen as a number.
		projectId: z.union([z.string(), z.number()]).nullish(),
		assignee: id.nullish(),
		assigneeName: z.string().nullish(),
		startDate: timestamp.nullish(),
		endDate: timestamp.nullish(),
		started: z.number().nullish().describe('1 once the sprint has started'),
		status: z.number().nullish().describe('1 planned, 2 active, 3 closed'),
		estimatePointTotal: z.number().nullish(),
		// unknown: Leiga groups issue counts by issue-type *name* ("Story", "Bug"),
		// which is account data rather than a fixed set.
		issueTypeCountMap: z.record(z.string(), z.number()).nullish(),
	})
	.loose();

export type LeigaSprint = z.infer<typeof SprintSchema>;

const SprintsListResponseSchema = z.object({
	sprints: z.array(SprintSchema),
});

export type SprintsListResponse = z.infer<typeof SprintsListResponseSchema>;

// ── sprints.get ───────────────────────────────────────────────────────────

const SprintsGetInputSchema = z.object({
	sprintId: id,
});

export type SprintsGetInput = z.input<typeof SprintsGetInputSchema>;

const SprintsGetResponseSchema = SprintSchema;

export type SprintsGetResponse = z.infer<typeof SprintsGetResponseSchema>;

// ── workflows.list ────────────────────────────────────────────────────────

const WorkflowsListInputSchema = z.object({
	projectId: id,
});

export type WorkflowsListInput = z.input<typeof WorkflowsListInputSchema>;

/**
 * Leiga answers a workflow as `{ id, workflowName, defaultValue, issueTypes,
 * states }`, not the flat `{ name, statusType }` its example suggests. Each
 * `states` entry carries `stateCategory`, which is the status type (`2` not
 * started, `3` in progress, `4` done) that `issues.list` filters on.
 */
const WorkflowStateSchema = z
	.object({
		stateId: id,
		stateName: z.string().nullish(),
		stateCategory: z.number().nullish(),
	})
	.loose();

const WorkflowIssueTypeSchema = z
	.object({
		id: id.nullish(),
		code: z.string().nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
	})
	.loose();

const WorkflowSchema = z
	.object({
		id,
		workflowName: z.string(),
		workflowDesc: z.string().nullish(),
		defaultValue: z
			.boolean()
			.nullish()
			.describe('True for the workflow a new issue gets by default'),
		issueTypes: z.array(WorkflowIssueTypeSchema).nullish(),
		states: z.array(WorkflowStateSchema).nullish(),
	})
	.loose();

export type LeigaWorkflow = z.infer<typeof WorkflowSchema>;

const WorkflowsListResponseSchema = z.object({
	workflows: z.array(WorkflowSchema),
});

export type WorkflowsListResponse = z.infer<typeof WorkflowsListResponseSchema>;

// ── workflows.nextStates ──────────────────────────────────────────────────

const WorkflowsNextStatesInputSchema = z.object({
	projectId: id,
	stateId: id.describe('Current state id, from a workflow states entry'),
	defId: id.describe('Workflow definition id, the workflow itself'),
});

export type WorkflowsNextStatesInput = z.input<
	typeof WorkflowsNextStatesInputSchema
>;

const WorkflowsNextStatesResponseSchema = z.object({
	states: z.array(WorkflowStateSchema),
});

export type WorkflowsNextStatesResponse = z.infer<
	typeof WorkflowsNextStatesResponseSchema
>;

// ── tags.list ─────────────────────────────────────────────────────────────

const TagsListInputSchema = z.object({
	projectId: id,
});

export type TagsListInput = z.input<typeof TagsListInputSchema>;

const TagSchema = z
	.object({
		id,
		tagName: z.string(),
	})
	.loose();

export type LeigaTag = z.infer<typeof TagSchema>;

const TagsListResponseSchema = z.object({
	tags: z.array(TagSchema),
});

export type TagsListResponse = z.infer<typeof TagsListResponseSchema>;

// ── members.list ──────────────────────────────────────────────────────────

const MembersListInputSchema = z.object({
	projectId: id,
	keyword: z.string().optional().describe('Filter on a name or email'),
});

export type MembersListInput = z.input<typeof MembersListInputSchema>;

const DepartmentSchema = z
	.object({
		id: id.nullish(),
		deptName: z.string().nullish(),
	})
	.loose();

const RoleSchema = z
	.object({
		id: id.nullish(),
		roleCode: z.string().nullish(),
		roleName: z.string().nullish(),
	})
	.loose();

const ProjectMemberSchema = z
	.object({
		userId: id.describe('Member user id'),
		userName: z.string().nullish(),
		orgEmail: z.string().nullish(),
		head: z.string().nullish().describe('Avatar URL'),
		departmentVOList: z.array(DepartmentSchema).nullish(),
		roleVOList: z.array(RoleSchema).nullish(),
	})
	.loose();

export type LeigaProjectMember = z.infer<typeof ProjectMemberSchema>;

const MembersListResponseSchema = z.object({
	members: z.array(ProjectMemberSchema),
});

export type MembersListResponse = z.infer<typeof MembersListResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type LeigaEndpointInputs = {
	projectsList: ProjectsListInput;
	projectsGet: ProjectsGetInput;
	projectsGetByKey: ProjectsGetByKeyInput;
	projectsTemplates: ProjectsTemplatesInput;
	issuesList: IssuesListInput;
	issuesGet: IssuesGetInput;
	issuesGetByNumber: IssuesGetByNumberInput;
	issuesTypes: IssuesTypesInput;
	issuesFields: IssuesFieldsInput;
	sprintsList: SprintsListInput;
	sprintsGet: SprintsGetInput;
	workflowsList: WorkflowsListInput;
	workflowsNextStates: WorkflowsNextStatesInput;
	tagsList: TagsListInput;
	membersList: MembersListInput;
};

export type LeigaEndpointOutputs = {
	projectsList: ProjectsListResponse;
	projectsGet: ProjectsGetResponse;
	projectsGetByKey: ProjectsGetByKeyResponse;
	projectsTemplates: ProjectsTemplatesResponse;
	issuesList: IssuesListResponse;
	issuesGet: IssuesGetResponse;
	issuesGetByNumber: IssuesGetByNumberResponse;
	issuesTypes: IssuesTypesResponse;
	issuesFields: IssuesFieldsResponse;
	sprintsList: SprintsListResponse;
	sprintsGet: SprintsGetResponse;
	workflowsList: WorkflowsListResponse;
	workflowsNextStates: WorkflowsNextStatesResponse;
	tagsList: TagsListResponse;
	membersList: MembersListResponse;
};

export const LeigaEndpointInputSchemas = {
	projectsList: ProjectsListInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsGetByKey: ProjectsGetByKeyInputSchema,
	projectsTemplates: ProjectsTemplatesInputSchema,
	issuesList: IssuesListInputSchema,
	issuesGet: IssuesGetInputSchema,
	issuesGetByNumber: IssuesGetByNumberInputSchema,
	issuesTypes: IssuesTypesInputSchema,
	issuesFields: IssuesFieldsInputSchema,
	sprintsList: SprintsListInputSchema,
	sprintsGet: SprintsGetInputSchema,
	workflowsList: WorkflowsListInputSchema,
	workflowsNextStates: WorkflowsNextStatesInputSchema,
	tagsList: TagsListInputSchema,
	membersList: MembersListInputSchema,
} as const;

export const LeigaEndpointOutputSchemas = {
	projectsList: ProjectsListResponseSchema,
	projectsGet: ProjectsGetResponseSchema,
	projectsGetByKey: ProjectsGetByKeyResponseSchema,
	projectsTemplates: ProjectsTemplatesResponseSchema,
	issuesList: IssuesListResponseSchema,
	issuesGet: IssuesGetResponseSchema,
	issuesGetByNumber: IssuesGetByNumberResponseSchema,
	issuesTypes: IssuesTypesResponseSchema,
	issuesFields: IssuesFieldsResponseSchema,
	sprintsList: SprintsListResponseSchema,
	sprintsGet: SprintsGetResponseSchema,
	workflowsList: WorkflowsListResponseSchema,
	workflowsNextStates: WorkflowsNextStatesResponseSchema,
	tagsList: TagsListResponseSchema,
	membersList: MembersListResponseSchema,
} as const;
