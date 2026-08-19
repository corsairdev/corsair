import { z } from 'zod';
import {
	CircleCIContextEntity,
	CircleCIGroupEntity,
	CircleCIPipelineDefinitionEntity,
	CircleCIProjectEntity,
	CircleCIProjectEnvVarEntity,
	CircleCIScheduleEntity,
} from '../schema/database';

/**
 * Input and output schemas for every CircleCI operation.
 *
 * This plugin spans four transports (see `client.ts`), and the shape of an
 * output schema follows from which one an operation uses:
 *
 * - **v2** outputs reuse the entity definitions in `schema/database.ts`
 *   directly, so the mirrored shape and the returned shape cannot drift.
 * - **v3** outputs are the already-unwrapped `data` payload - the transport's
 *   `makeCircleCIV3Request` strips the `{"data": ...}` JSON:API envelope, so
 *   schemas here describe the entity itself, not the envelope.
 * - **GraphQL** outputs describe the selection set this plugin actually
 *   requests, not the full type the server exposes - CircleCI's GraphQL
 *   schema is broader than what any one operation asks for.
 * - **v1.1** outputs are declared narrowly: the legacy response is a large,
 *   loosely-typed object, and only the fields this plugin actually surfaces
 *   are named. `all_commit_details` is deliberately **not** exposed as a
 *   typed field - it carries the triggering commit's author email address,
 *   confirmed live - so it is available on the raw response but never
 *   promoted into the schema or logged.
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

/** For a payload this plugin does not model field by field. */
const OpaqueObject = z.record(z.string(), z.unknown());

/** An operation whose response carries nothing the caller needs back. */
const EmptyResult = z.record(z.string(), z.unknown());

/**
 * A v2 REST list response, `{"items": [...], "next_page_token": ...}` per the
 * spec - confirmed on every v2 list route this plugin calls. The field is
 * kept as `next_page_token` rather than normalised to camelCase, matching
 * this file's own convention (see the header comment) that an output mirrors
 * the API's JSON keys. Pass the value straight back as the next call's
 * `pageToken` input to continue.
 */
const PagedListV2 = <T extends z.ZodTypeAny>(item: T) =>
	z.object({ items: z.array(item), next_page_token: S });

/**
 * A REST v3 list response. The real envelope is `{"data": [...], "page":
 * {"next": ..., "prev": ...}}` - confirmed from `circleci-cli`'s own
 * `v3List[T]` struct, since v3 has no published spec. `next` feeds back into
 * the next call's `pageCursor` input.
 */
const PagedListV3 = <T extends z.ZodTypeAny>(item: T) =>
	z.object({
		items: z.array(item),
		page: z.object({ next: S, prev: S }).nullable().optional(),
	});

/**
 * A GraphQL cursor-paginated list, `edges { node }` plus `pageInfo` - the
 * same shape `orbs.queryCategoryId` already reads internally to keep paging.
 * Declares only `hasNextPage`/`endCursor`, the two fields confirmed live
 * (introspection is disabled); `hasPreviousPage`/`startCursor` are not
 * declared because they were never confirmed to exist on this schema.
 */
const GraphQLPagedList = <T extends z.ZodTypeAny>(item: T) =>
	z.object({
		items: z.array(item),
		pageInfo: z
			.object({ hasNextPage: z.boolean(), endCursor: S })
			.nullable()
			.optional(),
	});

/* -------------------------------------------------------------------------- */
/*                          Contexts - REST v2 form                           */
/* -------------------------------------------------------------------------- */

const ContextOwnerType = z.enum(['organization', 'account']);

const ContextsCreateInputSchema = z.object({
	name: z.string(),
	/** The organization (or, on CircleCI Server, account) that owns the context. */
	ownerId: z.string(),
	ownerType: ContextOwnerType.optional(),
});
export type ContextsCreateInput = z.infer<typeof ContextsCreateInputSchema>;

const ContextsGetInputSchema = z.object({ contextId: z.string() });
export type ContextsGetInput = z.infer<typeof ContextsGetInputSchema>;

/**
 * `page-token` confirmed present in the spec's query parameters for this
 * route - an earlier version of this schema omitted it, which meant a caller
 * had no way to request a further page even though the response carries
 * `next_page_token`.
 */
const ContextsListEnvVarsInputSchema = z.object({
	contextId: z.string(),
	pageToken: z.string().optional(),
});
export type ContextsListEnvVarsInput = z.infer<
	typeof ContextsListEnvVarsInputSchema
>;

const ContextsUpsertEnvVarInputSchema = z.object({
	contextId: z.string(),
	variable: z.string(),
	value: z.string(),
});
export type ContextsUpsertEnvVarInput = z.infer<
	typeof ContextsUpsertEnvVarInputSchema
>;

const ContextsCreateRestrictionInputSchema = z.object({
	contextId: z.string(),
	/** `project`, `expression`, or `group`. */
	restrictionType: z.enum(['project', 'expression', 'group']),
	restrictionValue: z.string(),
});
export type ContextsCreateRestrictionInput = z.infer<
	typeof ContextsCreateRestrictionInputSchema
>;

const ContextsDeleteRestrictionInputSchema = z.object({
	contextId: z.string(),
	restrictionId: z.string(),
});
export type ContextsDeleteRestrictionInput = z.infer<
	typeof ContextsDeleteRestrictionInputSchema
>;

const ContextEnvVarSchema = z
	.object({
		variable: S,
		truncated_value: S,
		context_id: S,
		created_at: S,
		updated_at: S,
	})
	.loose();

const ContextsListEnvVarsOutputSchema = PagedListV2(ContextEnvVarSchema);

const ContextRestrictionSchema = z
	.object({
		id: S,
		context_id: S,
		name: S,
		restriction_type: S,
		restriction_value: S,
		project_id: S,
	})
	.loose();

/* -------------------------------------------------------------------------- */
/*                         Contexts - GraphQL form                            */
/* -------------------------------------------------------------------------- */

const ContextsCreateGraphQLInputSchema = z.object({
	contextName: z.string(),
	ownerId: z.string(),
	ownerType: ContextOwnerType,
});
export type ContextsCreateGraphQLInput = z.infer<
	typeof ContextsCreateGraphQLInputSchema
>;

const ContextsDeleteGraphQLInputSchema = z.object({ contextId: z.string() });
export type ContextsDeleteGraphQLInput = z.infer<
	typeof ContextsDeleteGraphQLInputSchema
>;

const ContextsQueryInputSchema = z.object({ contextId: z.string() });
export type ContextsQueryInput = z.infer<typeof ContextsQueryInputSchema>;

const ContextsStoreEnvVarInputSchema = z.object({
	contextId: z.string(),
	variable: z.string(),
	value: z.string(),
});
export type ContextsStoreEnvVarInput = z.infer<
	typeof ContextsStoreEnvVarInputSchema
>;

/**
 * `contextId` may not actually be required server-side: a probe sending only
 * `{variable: "X"}` passed input validation and reached a permission check
 * rather than a missing-key error, where `storeEnvironmentVariable`'s
 * equivalent probe reported `contextId` as missing immediately. Not
 * confirmed either way - the server may resolve an implicit scope, or GraphQL
 * input validation may simply report only the first missing key. `contextId`
 * is required here regardless: supplying it is always safe, and omitting it
 * on an unconfirmed hunch is not worth the risk of removing the wrong
 * context's variable.
 */
const ContextsRemoveEnvVarInputSchema = z.object({
	contextId: z.string(),
	variable: z.string(),
});
export type ContextsRemoveEnvVarInput = z.infer<
	typeof ContextsRemoveEnvVarInputSchema
>;

/** What `query context(id)` returns - the selection set this plugin requests. */
const GraphQLContextSchema = z
	.object({
		id: S,
		name: S,
		createdAt: S,
	})
	.loose();

/* -------------------------------------------------------------------------- */
/*                                 Groups                                     */
/* -------------------------------------------------------------------------- */

const GroupsCreateInputSchema = z.object({
	orgId: z.string(),
	name: z.string(),
	description: z.string().optional(),
});
export type GroupsCreateInput = z.infer<typeof GroupsCreateInputSchema>;

const GroupsDeleteInputSchema = z.object({
	orgId: z.string(),
	groupId: z.string(),
});
export type GroupsDeleteInput = z.infer<typeof GroupsDeleteInputSchema>;

const GroupsGetInputSchema = z.object({
	orgId: z.string(),
	groupId: z.string(),
});
export type GroupsGetInput = z.infer<typeof GroupsGetInputSchema>;

const GroupsListInputSchema = z.object({
	orgId: z.string(),
	limit: z.number().optional(),
	pageToken: z.string().optional(),
});
export type GroupsListInput = z.infer<typeof GroupsListInputSchema>;

/**
 * `{"items": [...], "next_page_token": ..., "total_count": ...}` per the
 * spec - the one v2 list route this plugin calls that also sends
 * `total_count`, so it gets its own schema rather than reusing `PagedListV2`.
 */
const GroupsListOutputSchema = z.object({
	items: z.array(CircleCIGroupEntity),
	next_page_token: S,
	total_count: N,
});

/* -------------------------------------------------------------------------- */
/*                            Orb URL allow-list                              */
/* -------------------------------------------------------------------------- */

const OrbAllowlistCreateInputSchema = z.object({
	orgSlugOrId: z.string(),
	name: z.string(),
	prefix: z.string(),
	auth: z.enum(['github-oauth', 'bitbucket-oauth', 'github-app', 'none']),
});
export type OrbAllowlistCreateInput = z.infer<
	typeof OrbAllowlistCreateInputSchema
>;

const OrbAllowlistDeleteInputSchema = z.object({
	orgSlugOrId: z.string(),
	entryId: z.string(),
});
export type OrbAllowlistDeleteInput = z.infer<
	typeof OrbAllowlistDeleteInputSchema
>;

/**
 * What creating an allow-list entry returns.
 * Confirmed live: `{id, message}` only - the fields supplied are not echoed.
 */
const OrbAllowlistCreateResponseSchema = z
	.object({ id: S, message: S })
	.loose();

/* -------------------------------------------------------------------------- */
/*                                 Projects                                   */
/* -------------------------------------------------------------------------- */

const ProjectsCreateInputSchema = z.object({
	orgSlugOrId: z.string(),
	name: z.string(),
});
export type ProjectsCreateInput = z.infer<typeof ProjectsCreateInputSchema>;

const ProjectsDeleteInputSchema = z.object({ projectSlug: z.string() });
export type ProjectsDeleteInput = z.infer<typeof ProjectsDeleteInputSchema>;

const ProjectsGetInputSchema = z.object({ projectSlug: z.string() });
export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;

/* -------------------------------------------------------------------------- */
/*                            Project env vars                                */
/* -------------------------------------------------------------------------- */

const ProjectEnvVarsCreateInputSchema = z.object({
	projectSlug: z.string(),
	name: z.string(),
	value: z.string(),
});
export type ProjectEnvVarsCreateInput = z.infer<
	typeof ProjectEnvVarsCreateInputSchema
>;

const ProjectEnvVarsDeleteInputSchema = z.object({
	projectSlug: z.string(),
	name: z.string(),
});
export type ProjectEnvVarsDeleteInput = z.infer<
	typeof ProjectEnvVarsDeleteInputSchema
>;

/**
 * No `pageToken` here on purpose - confirmed from the spec's own query
 * parameter list for this route, which declares only `project-slug`. The
 * output still carries `next_page_token` (see `projectEnvVarsList` in the
 * output registry below) even though there is no documented way to supply it
 * back in a request; that mismatch is the API's, not this plugin's, and is
 * surfaced rather than silently matched by inventing an input parameter the
 * route does not accept.
 */
const ProjectEnvVarsListInputSchema = z.object({ projectSlug: z.string() });
export type ProjectEnvVarsListInput = z.infer<
	typeof ProjectEnvVarsListInputSchema
>;

const ProjectEnvVarsListOutputSchema = PagedListV2(CircleCIProjectEnvVarEntity);

/* -------------------------------------------------------------------------- */
/*                                 Schedules                                  */
/* -------------------------------------------------------------------------- */

/**
 * The only schedule operation the catalog claims. The v2 spec has five
 * (create, list, get, patch, delete); this plugin implements the one the
 * catalog lists and does not add the other four, matching the same
 * catalog-defines-the-surface decision as Habitica's partial webhook family.
 *
 * `page-token` confirmed present in the spec's query parameters - an earlier
 * version of this schema omitted it despite the response carrying
 * `next_page_token`.
 */
const SchedulesListInputSchema = z.object({
	projectSlug: z.string(),
	pageToken: z.string().optional(),
});
export type SchedulesListInput = z.infer<typeof SchedulesListInputSchema>;

const SchedulesListOutputSchema = PagedListV2(CircleCIScheduleEntity);

/* -------------------------------------------------------------------------- */
/*                               Usage export                                 */
/* -------------------------------------------------------------------------- */

const UsageExportCreateInputSchema = z.object({
	orgId: z.string(),
	/** ISO 8601 date-times. The catalog documents a 32-day maximum window. */
	start: z.string(),
	end: z.string(),
	sharedOrgIds: z.array(z.string()).optional(),
});
export type UsageExportCreateInput = z.infer<
	typeof UsageExportCreateInputSchema
>;

const UsageExportGetInputSchema = z.object({
	orgId: z.string(),
	usageExportJobId: z.string(),
});
export type UsageExportGetInput = z.infer<typeof UsageExportGetInputSchema>;

/* -------------------------------------------------------------------------- */
/*                                 Pipelines                                  */
/* -------------------------------------------------------------------------- */

const PipelinesListInputSchema = z.object({
	orgSlug: z.string().optional(),
	pageToken: z.string().optional(),
	mine: z.boolean().optional(),
});
export type PipelinesListInput = z.infer<typeof PipelinesListInputSchema>;

const PipelinesListForProjectInputSchema = z.object({
	projectSlug: z.string(),
	branch: z.string().optional(),
	pageToken: z.string().optional(),
});
export type PipelinesListForProjectInput = z.infer<
	typeof PipelinesListForProjectInputSchema
>;

const PipelinesGetConfigInputSchema = z.object({ pipelineId: z.string() });
export type PipelinesGetConfigInput = z.infer<
	typeof PipelinesGetConfigInputSchema
>;

const PipelinesTriggerInputSchema = z.object({
	projectSlug: z.string(),
	/** Mutually exclusive with `tag`. */
	branch: z.string().optional(),
	tag: z.string().optional(),
	parameters: z.record(z.string(), z.unknown()).optional(),
});
export type PipelinesTriggerInput = z.infer<typeof PipelinesTriggerInputSchema>;

const PipelineSchema = z
	.object({
		id: S,
		project_slug: S,
		number: N,
		state: S,
		created_at: S,
		updated_at: S,
		trigger: OpaqueObject.nullable().optional(),
		vcs: OpaqueObject.nullable().optional(),
		errors: z.array(OpaqueObject).nullable().optional(),
	})
	.loose();

const PipelinesListOutputSchema = PagedListV2(PipelineSchema);
const PipelinesListForProjectOutputSchema = PagedListV2(PipelineSchema);

/* -------------------------------------------------------------------------- */
/*                            Pipeline definitions                            */
/* -------------------------------------------------------------------------- */

const PipelineDefinitionsGetInputSchema = z.object({
	projectId: z.string(),
	pipelineDefinitionId: z.string(),
});
export type PipelineDefinitionsGetInput = z.infer<
	typeof PipelineDefinitionsGetInputSchema
>;

/** No pagination param on this route, confirmed from the spec - `project_id` is the only parameter. */
const PipelineDefinitionsListInputSchema = z.object({
	projectId: z.string(),
});
export type PipelineDefinitionsListInput = z.infer<
	typeof PipelineDefinitionsListInputSchema
>;

/* -------------------------------------------------------------------------- */
/*                                  Workflows                                 */
/* -------------------------------------------------------------------------- */

const WorkflowsListByPipelineIdInputSchema = z.object({
	pipelineId: z.string(),
	pageToken: z.string().optional(),
});
export type WorkflowsListByPipelineIdInput = z.infer<
	typeof WorkflowsListByPipelineIdInputSchema
>;

/** No `reporting-window` on this route, confirmed from the spec - only `branch`/`all-branches`. */
const WorkflowsGetSummaryInputSchema = z.object({
	projectSlug: z.string(),
	workflowName: z.string(),
	branch: z.string().optional(),
	allBranches: z.boolean().optional(),
});
export type WorkflowsGetSummaryInput = z.infer<
	typeof WorkflowsGetSummaryInputSchema
>;

const WorkflowsListJobsInputSchema = z.object({
	projectSlug: z.string(),
	workflowName: z.string(),
	reportingWindow: z.string().optional(),
	branch: z.string().optional(),
	allBranches: z.boolean().optional(),
	jobName: z.string().optional(),
	pageToken: z.string().optional(),
});
export type WorkflowsListJobsInput = z.infer<
	typeof WorkflowsListJobsInputSchema
>;

const WorkflowsListTestMetricsInputSchema = z.object({
	projectSlug: z.string(),
	workflowName: z.string(),
	branch: z.string().optional(),
	allBranches: z.boolean().optional(),
});
export type WorkflowsListTestMetricsInput = z.infer<
	typeof WorkflowsListTestMetricsInputSchema
>;

const WorkflowSchema = z
	.object({
		id: S,
		name: S,
		status: S,
		pipeline_id: S,
		pipeline_number: N,
		project_slug: S,
		created_at: S,
		stopped_at: S,
		started_by: S,
	})
	.loose();

const WorkflowsListByPipelineIdOutputSchema = PagedListV2(WorkflowSchema);

/* -------------------------------------------------------------------------- */
/*                                  Insights                                  */
/* -------------------------------------------------------------------------- */

const InsightsFlakyTestsInputSchema = z.object({ projectSlug: z.string() });
export type InsightsFlakyTestsInput = z.infer<
	typeof InsightsFlakyTestsInputSchema
>;

/**
 * Real query params, confirmed from the spec after an earlier draft invented
 * a `branches` array this route does not have: `page-token`, `all-branches`
 * (boolean), `branch` (singular), `reporting-window`.
 */
const InsightsProjectWorkflowsInputSchema = z.object({
	projectSlug: z.string(),
	reportingWindow: z.string().optional(),
	branch: z.string().optional(),
	allBranches: z.boolean().optional(),
	pageToken: z.string().optional(),
});
export type InsightsProjectWorkflowsInput = z.infer<
	typeof InsightsProjectWorkflowsInputSchema
>;

const InsightsPagesSummaryInputSchema = z.object({
	projectSlug: z.string(),
	reportingWindow: z.string().optional(),
	/** Repeated query key (`?branches=a&branches=b`) - confirmed from the spec's own example. */
	branches: z.array(z.string()).optional(),
	workflowNames: z.array(z.string()).optional(),
});
export type InsightsPagesSummaryInput = z.infer<
	typeof InsightsPagesSummaryInputSchema
>;

/** No `page-token` on this route, confirmed from the spec - `workflowName` narrows the scope instead. */
const InsightsBranchesInputSchema = z.object({
	projectSlug: z.string(),
	workflowName: z.string().optional(),
});
export type InsightsBranchesInput = z.infer<typeof InsightsBranchesInputSchema>;

/**
 * The org-wide summary route that `LIST_INSIGHTS_SUMMARY` and
 * `QUERY_PLAN_METRICS` both resolve to - confirmed live to be the same route:
 * credit usage (`org_data.metrics.total_credits_used`) is one field inside
 * the same summary object `org_data.trends`/`org_project_data` return, not a
 * separate concept. Registered as two catalog ids against one route, each
 * with its own audit event, the same shape as Habitica's `GET_GROUP`/
 * `GET_PARTY` alias.
 */
const InsightsOrgSummaryInputSchema = z.object({
	orgSlug: z.string(),
	reportingWindow: z.string().optional(),
	projectNames: z.array(z.string()).optional(),
});
export type InsightsOrgSummaryInput = z.infer<
	typeof InsightsOrgSummaryInputSchema
>;

/* -------------------------------------------------------------------------- */
/*                        Jobs - legacy v1.1 form                             */
/* -------------------------------------------------------------------------- */

/**
 * Identifies a job the way v1.1 does: by VCS provider, org, project and a
 * plain build number - not the v2/v3 job UUID. This is the only input shape
 * available for "job by number," which neither v2's `GET /jobs/{job_id}` nor
 * v3's `GET /api/v3/jobs/{id}` accept (both are strict UUID, confirmed from
 * the v2 spec's `"format": "uuid"` and the v3 Go client).
 */
const JobByNumberInputSchema = z.object({
	/** `gh` or `bb`, matching the v1.1 path segment. */
	vcsType: z.enum(['gh', 'bb']),
	username: z.string(),
	project: z.string(),
	buildNumber: z.number(),
});
export type JobByNumberInput = z.infer<typeof JobByNumberInputSchema>;

/**
 * The job-detail fields this plugin exposes from the v1.1 response.
 *
 * `all_commit_details` is deliberately absent: it carries the triggering
 * commit's author name and **email address**, confirmed live. The raw v1.1
 * response is not typed further than this on purpose, so nothing upstream of
 * this schema can casually reach into that field.
 */
const JobDetailsSchema = z
	.object({
		build_num: N,
		branch: S,
		status: S,
		lifecycle: S,
		outcome: S,
		start_time: S,
		stop_time: S,
		build_time_millis: N,
		workflows: OpaqueObject.nullable().optional(),
	})
	.loose();

const JobArtifactSchema = z
	.object({
		path: S,
		pretty_path: S,
		node_index: N,
		url: S,
	})
	.loose();

const JobTestSchema = z
	.object({
		message: S,
		source: S,
		run_time: N,
		file: S,
		result: S,
		name: S,
		classname: S,
	})
	.loose();

/* -------------------------------------------------------------------------- */
/*                                    User                                    */
/* -------------------------------------------------------------------------- */

const UserGetCurrentInputSchema = z.object({});
export type UserGetCurrentInput = z.infer<typeof UserGetCurrentInputSchema>;

const UserGetInfoInputSchema = z.object({ userId: z.string() });
export type UserGetInfoInput = z.infer<typeof UserGetInfoInputSchema>;

const UserListCollaborationsInputSchema = z.object({});
export type UserListCollaborationsInput = z.infer<
	typeof UserListCollaborationsInputSchema
>;

const CircleCIUserSchema = z
	.object({
		id: S,
		login: S,
		name: S,
		avatar_url: S,
	})
	.loose();

const CircleCICollaborationSchema = z
	.object({
		id: S,
		vcs_type: S,
		name: S,
		slug: S,
		avatar_url: S,
	})
	.loose();

/* -------------------------------------------------------------------------- */
/*                          Organization - GraphQL                            */
/* -------------------------------------------------------------------------- */

const OrganizationGetInputSchema = z.object({
	/**
	 * The org's id resolves reliably; a name+vcsType lookup does not.
	 * Confirmed live: `organization(name:,vcsType:)` failed with a
	 * not-found/no-permission error against this account's own personal
	 * GitHub org, while `organization(id:)` succeeded for both orgs on the
	 * account. Resolve the id from `GET /me/collaborations` first.
	 */
	id: z.string(),
});
export type OrganizationGetInput = z.infer<typeof OrganizationGetInputSchema>;

const GraphQLOrganizationSchema = z
	.object({
		id: S,
		name: S,
	})
	.loose();

/* -------------------------------------------------------------------------- */
/*                              Namespaces - v3                               */
/* -------------------------------------------------------------------------- */

const NamespaceQueryExistsInputSchema = z.object({ name: z.string() });
export type NamespaceQueryExistsInput = z.infer<
	typeof NamespaceQueryExistsInputSchema
>;

const NamespaceDeleteInputSchema = z.object({ name: z.string() });
export type NamespaceDeleteInput = z.infer<typeof NamespaceDeleteInputSchema>;

const NamespaceRenameInputSchema = z.object({
	name: z.string(),
	newName: z.string(),
});
export type NamespaceRenameInput = z.infer<typeof NamespaceRenameInputSchema>;

const NamespaceSchema = z.object({ id: S, name: S }).loose();

/* -------------------------------------------------------------------------- */
/*                               Orbs - GraphQL                               */
/* -------------------------------------------------------------------------- */

const OrbGetDetailsInputSchema = z.object({
	/** Full reference: `namespace/orb-name`. */
	name: z.string(),
});
export type OrbGetDetailsInput = z.infer<typeof OrbGetDetailsInputSchema>;

const OrbGetVersionInputSchema = z.object({
	/** `namespace/orb-name@version`. */
	orbVersionRef: z.string(),
});
export type OrbGetVersionInput = z.infer<typeof OrbGetVersionInputSchema>;

const OrbQueryIdInputSchema = z.object({ name: z.string() });
export type OrbQueryIdInput = z.infer<typeof OrbQueryIdInputSchema>;

const OrbQueryExistsInputSchema = z.object({ name: z.string() });
export type OrbQueryExistsInput = z.infer<typeof OrbQueryExistsInputSchema>;

const OrbQueryLatestVersionInputSchema = z.object({ name: z.string() });
export type OrbQueryLatestVersionInput = z.infer<
	typeof OrbQueryLatestVersionInputSchema
>;

const OrbQuerySourceInputSchema = z.object({ orbVersionRef: z.string() });
export type OrbQuerySourceInput = z.infer<typeof OrbQuerySourceInputSchema>;

const OrbListOrbsInputSchema = z.object({
	first: z.number().optional(),
	after: z.string().optional(),
});
export type OrbListOrbsInput = z.infer<typeof OrbListOrbsInputSchema>;

const OrbListCategoriesInputSchema = z.object({
	first: z.number().optional(),
	after: z.string().optional(),
});
export type OrbListCategoriesInput = z.infer<
	typeof OrbListCategoriesInputSchema
>;

/**
 * The catalog describes this as "fetch the category ID by name," but
 * `orbCategories` only accepts `first`/`after` - confirmed live from the
 * server's own `"defined-arguments":["first","after"]` error. There is no
 * server-side name filter, so a name lookup means paginating the full list
 * and filtering client-side.
 */
const OrbQueryCategoryIdInputSchema = z.object({ name: z.string() });
export type OrbQueryCategoryIdInput = z.infer<
	typeof OrbQueryCategoryIdInputSchema
>;

const GraphQLOrbVersionSchema = z.object({ id: S, version: S }).loose();

const GraphQLOrbSchema = z
	.object({
		id: S,
		name: S,
		isPrivate: B,
		versions: z.array(GraphQLOrbVersionSchema).nullable().optional(),
	})
	.loose();

const GraphQLOrbVersionDetailSchema = z
	.object({ id: S, version: S, source: S })
	.loose();

const GraphQLOrbCategorySchema = z.object({ id: S, name: S }).loose();

const OrbListOrbsOutputSchema = GraphQLPagedList(GraphQLOrbSchema);
const OrbListCategoriesOutputSchema = GraphQLPagedList(
	GraphQLOrbCategorySchema,
);

/* -------------------------------------------------------------------------- */
/*                            Orbs - REST v3 form                             */
/* -------------------------------------------------------------------------- */

const OrbListNamespaceOrbsInputSchema = z.object({
	namespaceId: z.string().optional(),
	certified: z.boolean().optional(),
	private: z.boolean().optional(),
	pageCursor: z.string().optional(),
});
export type OrbListNamespaceOrbsInput = z.infer<
	typeof OrbListNamespaceOrbsInputSchema
>;

const OrbPackageSchema = z
	.object({
		id: S,
		name: S,
		is_private: B,
		is_listed: B,
	})
	.loose();

const OrbListNamespaceOrbsOutputSchema = PagedListV3(OrbPackageSchema);

/* -------------------------------------------------------------------------- */
/*                             Self-hosted runners                            */
/* -------------------------------------------------------------------------- */

/**
 * Both filters are genuinely optional and combinable - `circleci-cli`'s own
 * `ListRunnerInstances` doc comment says so explicitly ("filtered by
 * resource class and/or namespace. Either filter may be empty"), which rules
 * out an exactly-one-of validation a review once suggested adding here.
 *
 * No `pageCursor`: `circleci-cli`'s `ListRunnerInstances` never sends a
 * cursor for this route, unlike its `ListOrbPackages` sibling which does -
 * an earlier version of this schema added one anyway by extending that
 * sibling's shape without checking this route specifically. See
 * `RunnersListOutputSchema` for the same correction on the response side.
 */
const RunnersListInputSchema = z.object({
	namespace: z.string().optional(),
	resourceClass: z.string().optional(),
});
export type RunnersListInput = z.infer<typeof RunnersListInputSchema>;

const RunnerSchema = z
	.object({ id: S, hostname: S, name: S, first_connected: S })
	.loose();

/**
 * `{"items": [...]}` - confirmed from `circleci-cli`'s own
 * `ListRunnerInstances`/`ListRunnerInstancesByOrg`, both of which decode
 * `/api/v3/runner` into `struct { Items []RunnerInstance }`. Flat and
 * v2-shaped, **not** the JSON:API `{"data": [...], "page": {...}}` envelope
 * `orb/packages` uses - a genuinely different route, on the same v3 base.
 * An earlier version of this schema assumed the two routes shared a shape
 * and declared `page` here too; `circleCIV3Call`'s `{"data": T}` unwrap
 * would never have found a `data` key on this route's real response, so
 * that version's `items` would have silently resolved to an empty array on
 * every call, live or mocked with the wrong fixture shape.
 */
const RunnersListOutputSchema = z.object({ items: z.array(RunnerSchema) });

/* -------------------------------------------------------------------------- */
/*                            Orb config validation                           */
/* -------------------------------------------------------------------------- */

const OrbValidateConfigInputSchema = z.object({ orbYaml: z.string() });
export type OrbValidateConfigInput = z.infer<
	typeof OrbValidateConfigInputSchema
>;

const OrbConfigValidationSchema = z
	.object({
		valid: B,
		errors: z
			.array(z.object({ message: S }).loose())
			.nullable()
			.optional(),
		sourceYaml: S,
	})
	.loose();

/* -------------------------------------------------------------------------- */
/*                             Namespace alias                                */
/* -------------------------------------------------------------------------- */

/**
 * `deleteNamespaceAlias` exists nowhere in the current, actively maintained
 * `circleci-cli` - confirmed by searching the whole repository - but the
 * server field is real and live, answering genuine business errors rather
 * than a schema error. Orphaned from official tooling, not from the API.
 */
const NamespaceDeleteAliasInputSchema = z.object({ name: z.string() });
export type NamespaceDeleteAliasInput = z.infer<
	typeof NamespaceDeleteAliasInputSchema
>;

/* -------------------------------------------------------------------------- */
/*                                  Registry                                  */
/* -------------------------------------------------------------------------- */

export type CircleCIEndpointInputs = {
	contextsCreate: ContextsCreateInput;
	contextsGet: ContextsGetInput;
	contextsListEnvVars: ContextsListEnvVarsInput;
	contextsUpsertEnvVar: ContextsUpsertEnvVarInput;
	contextsCreateRestriction: ContextsCreateRestrictionInput;
	contextsDeleteRestriction: ContextsDeleteRestrictionInput;

	contextsCreateGraphQL: ContextsCreateGraphQLInput;
	contextsDeleteGraphQL: ContextsDeleteGraphQLInput;
	contextsQuery: ContextsQueryInput;
	contextsStoreEnvVar: ContextsStoreEnvVarInput;
	contextsRemoveEnvVar: ContextsRemoveEnvVarInput;

	groupsCreate: GroupsCreateInput;
	groupsDelete: GroupsDeleteInput;
	groupsGet: GroupsGetInput;
	groupsList: GroupsListInput;

	orbAllowlistCreate: OrbAllowlistCreateInput;
	orbAllowlistDelete: OrbAllowlistDeleteInput;

	projectsCreate: ProjectsCreateInput;
	projectsDelete: ProjectsDeleteInput;
	projectsGet: ProjectsGetInput;

	projectEnvVarsCreate: ProjectEnvVarsCreateInput;
	projectEnvVarsDelete: ProjectEnvVarsDeleteInput;
	projectEnvVarsList: ProjectEnvVarsListInput;

	schedulesList: SchedulesListInput;

	usageExportCreate: UsageExportCreateInput;
	usageExportGet: UsageExportGetInput;

	pipelinesList: PipelinesListInput;
	pipelinesListForProject: PipelinesListForProjectInput;
	pipelinesGetConfig: PipelinesGetConfigInput;
	pipelinesTrigger: PipelinesTriggerInput;

	pipelineDefinitionsGet: PipelineDefinitionsGetInput;
	pipelineDefinitionsList: PipelineDefinitionsListInput;

	workflowsListByPipelineId: WorkflowsListByPipelineIdInput;
	workflowsGetSummary: WorkflowsGetSummaryInput;
	workflowsListJobs: WorkflowsListJobsInput;
	workflowsListTestMetrics: WorkflowsListTestMetricsInput;

	insightsFlakyTests: InsightsFlakyTestsInput;
	insightsProjectWorkflows: InsightsProjectWorkflowsInput;
	insightsPagesSummary: InsightsPagesSummaryInput;
	insightsBranches: InsightsBranchesInput;
	insightsOrgSummary: InsightsOrgSummaryInput;
	insightsPlanMetrics: InsightsOrgSummaryInput;

	jobsGetDetails: JobByNumberInput;
	jobsGetArtifacts: JobByNumberInput;
	jobsGetTestMetadata: JobByNumberInput;

	userGetCurrent: UserGetCurrentInput;
	userGetInfo: UserGetInfoInput;
	userListCollaborations: UserListCollaborationsInput;

	organizationGet: OrganizationGetInput;

	namespaceQueryExists: NamespaceQueryExistsInput;
	namespaceDelete: NamespaceDeleteInput;
	namespaceRename: NamespaceRenameInput;
	namespaceDeleteAlias: NamespaceDeleteAliasInput;

	orbGetDetails: OrbGetDetailsInput;
	orbGetVersion: OrbGetVersionInput;
	orbQueryId: OrbQueryIdInput;
	orbQueryExists: OrbQueryExistsInput;
	orbQueryLatestVersion: OrbQueryLatestVersionInput;
	orbQuerySource: OrbQuerySourceInput;
	orbListOrbs: OrbListOrbsInput;
	orbListCategories: OrbListCategoriesInput;
	orbQueryCategoryId: OrbQueryCategoryIdInput;
	orbListNamespaceOrbs: OrbListNamespaceOrbsInput;
	orbValidateConfig: OrbValidateConfigInput;

	runnersList: RunnersListInput;
};

export type CircleCIEndpointOutputs = {
	contextsCreate: z.infer<typeof CircleCIContextEntity>;
	contextsGet: z.infer<typeof CircleCIContextEntity>;
	contextsListEnvVars: z.infer<typeof ContextsListEnvVarsOutputSchema>;
	contextsUpsertEnvVar: z.infer<typeof ContextEnvVarSchema>;
	contextsCreateRestriction: z.infer<typeof ContextRestrictionSchema>;
	contextsDeleteRestriction: z.infer<typeof EmptyResult>;

	contextsCreateGraphQL: z.infer<typeof GraphQLContextSchema>;
	contextsDeleteGraphQL: z.infer<typeof EmptyResult>;
	contextsQuery: z.infer<typeof GraphQLContextSchema>;
	contextsStoreEnvVar: z.infer<typeof EmptyResult>;
	contextsRemoveEnvVar: z.infer<typeof EmptyResult>;

	groupsCreate: z.infer<typeof CircleCIGroupEntity>;
	groupsDelete: z.infer<typeof EmptyResult>;
	groupsGet: z.infer<typeof CircleCIGroupEntity>;
	groupsList: z.infer<typeof GroupsListOutputSchema>;

	orbAllowlistCreate: z.infer<typeof OrbAllowlistCreateResponseSchema>;
	orbAllowlistDelete: z.infer<typeof EmptyResult>;

	projectsCreate: z.infer<typeof CircleCIProjectEntity>;
	projectsDelete: z.infer<typeof EmptyResult>;
	projectsGet: z.infer<typeof CircleCIProjectEntity>;

	projectEnvVarsCreate: z.infer<typeof CircleCIProjectEnvVarEntity>;
	projectEnvVarsDelete: z.infer<typeof EmptyResult>;
	projectEnvVarsList: z.infer<typeof ProjectEnvVarsListOutputSchema>;

	schedulesList: z.infer<typeof SchedulesListOutputSchema>;

	usageExportCreate: z.infer<typeof OpaqueObject>;
	usageExportGet: z.infer<typeof OpaqueObject>;

	pipelinesList: z.infer<typeof PipelinesListOutputSchema>;
	pipelinesListForProject: z.infer<typeof PipelinesListForProjectOutputSchema>;
	pipelinesGetConfig: z.infer<typeof OpaqueObject>;
	pipelinesTrigger: z.infer<typeof PipelineSchema>;

	pipelineDefinitionsGet: z.infer<typeof CircleCIPipelineDefinitionEntity>;
	pipelineDefinitionsList: z.infer<typeof CircleCIPipelineDefinitionEntity>[];

	workflowsListByPipelineId: z.infer<
		typeof WorkflowsListByPipelineIdOutputSchema
	>;
	workflowsGetSummary: z.infer<typeof OpaqueObject>;
	workflowsListJobs: z.infer<typeof OpaqueObject>;
	workflowsListTestMetrics: z.infer<typeof OpaqueObject>;

	insightsFlakyTests: z.infer<typeof OpaqueObject>;
	insightsProjectWorkflows: z.infer<typeof OpaqueObject>;
	insightsPagesSummary: z.infer<typeof OpaqueObject>;
	insightsBranches: z.infer<typeof OpaqueObject>;
	insightsOrgSummary: z.infer<typeof OpaqueObject>;
	insightsPlanMetrics: z.infer<typeof OpaqueObject>;

	jobsGetDetails: z.infer<typeof JobDetailsSchema>;
	jobsGetArtifacts: z.infer<typeof JobArtifactSchema>[];
	jobsGetTestMetadata: z.infer<typeof JobTestSchema>[];

	userGetCurrent: z.infer<typeof CircleCIUserSchema>;
	userGetInfo: z.infer<typeof CircleCIUserSchema>;
	userListCollaborations: z.infer<typeof CircleCICollaborationSchema>[];

	organizationGet: z.infer<typeof GraphQLOrganizationSchema>;

	namespaceQueryExists: { exists: boolean };
	namespaceDelete: z.infer<typeof EmptyResult>;
	namespaceRename: z.infer<typeof NamespaceSchema>;
	namespaceDeleteAlias: z.infer<typeof EmptyResult>;

	orbGetDetails: z.infer<typeof GraphQLOrbSchema>;
	orbGetVersion: z.infer<typeof GraphQLOrbVersionDetailSchema>;
	orbQueryId: z.infer<typeof GraphQLOrbSchema>;
	orbQueryExists: { exists: boolean; isPrivate?: boolean | null };
	orbQueryLatestVersion: z.infer<typeof GraphQLOrbVersionSchema>;
	orbQuerySource: z.infer<typeof GraphQLOrbVersionDetailSchema>;
	orbListOrbs: z.infer<typeof OrbListOrbsOutputSchema>;
	orbListCategories: z.infer<typeof OrbListCategoriesOutputSchema>;
	orbQueryCategoryId: z.infer<typeof GraphQLOrbCategorySchema>;
	orbListNamespaceOrbs: z.infer<typeof OrbListNamespaceOrbsOutputSchema>;
	orbValidateConfig: z.infer<typeof OrbConfigValidationSchema>;

	runnersList: z.infer<typeof RunnersListOutputSchema>;
};

export const CircleCIEndpointInputSchemas = {
	contextsCreate: ContextsCreateInputSchema,
	contextsGet: ContextsGetInputSchema,
	contextsListEnvVars: ContextsListEnvVarsInputSchema,
	contextsUpsertEnvVar: ContextsUpsertEnvVarInputSchema,
	contextsCreateRestriction: ContextsCreateRestrictionInputSchema,
	contextsDeleteRestriction: ContextsDeleteRestrictionInputSchema,

	contextsCreateGraphQL: ContextsCreateGraphQLInputSchema,
	contextsDeleteGraphQL: ContextsDeleteGraphQLInputSchema,
	contextsQuery: ContextsQueryInputSchema,
	contextsStoreEnvVar: ContextsStoreEnvVarInputSchema,
	contextsRemoveEnvVar: ContextsRemoveEnvVarInputSchema,

	groupsCreate: GroupsCreateInputSchema,
	groupsDelete: GroupsDeleteInputSchema,
	groupsGet: GroupsGetInputSchema,
	groupsList: GroupsListInputSchema,

	orbAllowlistCreate: OrbAllowlistCreateInputSchema,
	orbAllowlistDelete: OrbAllowlistDeleteInputSchema,

	projectsCreate: ProjectsCreateInputSchema,
	projectsDelete: ProjectsDeleteInputSchema,
	projectsGet: ProjectsGetInputSchema,

	projectEnvVarsCreate: ProjectEnvVarsCreateInputSchema,
	projectEnvVarsDelete: ProjectEnvVarsDeleteInputSchema,
	projectEnvVarsList: ProjectEnvVarsListInputSchema,

	schedulesList: SchedulesListInputSchema,

	usageExportCreate: UsageExportCreateInputSchema,
	usageExportGet: UsageExportGetInputSchema,

	pipelinesList: PipelinesListInputSchema,
	pipelinesListForProject: PipelinesListForProjectInputSchema,
	pipelinesGetConfig: PipelinesGetConfigInputSchema,
	pipelinesTrigger: PipelinesTriggerInputSchema,

	pipelineDefinitionsGet: PipelineDefinitionsGetInputSchema,
	pipelineDefinitionsList: PipelineDefinitionsListInputSchema,

	workflowsListByPipelineId: WorkflowsListByPipelineIdInputSchema,
	workflowsGetSummary: WorkflowsGetSummaryInputSchema,
	workflowsListJobs: WorkflowsListJobsInputSchema,
	workflowsListTestMetrics: WorkflowsListTestMetricsInputSchema,

	insightsFlakyTests: InsightsFlakyTestsInputSchema,
	insightsProjectWorkflows: InsightsProjectWorkflowsInputSchema,
	insightsPagesSummary: InsightsPagesSummaryInputSchema,
	insightsBranches: InsightsBranchesInputSchema,
	insightsOrgSummary: InsightsOrgSummaryInputSchema,
	insightsPlanMetrics: InsightsOrgSummaryInputSchema,

	jobsGetDetails: JobByNumberInputSchema,
	jobsGetArtifacts: JobByNumberInputSchema,
	jobsGetTestMetadata: JobByNumberInputSchema,

	userGetCurrent: UserGetCurrentInputSchema,
	userGetInfo: UserGetInfoInputSchema,
	userListCollaborations: UserListCollaborationsInputSchema,

	organizationGet: OrganizationGetInputSchema,

	namespaceQueryExists: NamespaceQueryExistsInputSchema,
	namespaceDelete: NamespaceDeleteInputSchema,
	namespaceRename: NamespaceRenameInputSchema,
	namespaceDeleteAlias: NamespaceDeleteAliasInputSchema,

	orbGetDetails: OrbGetDetailsInputSchema,
	orbGetVersion: OrbGetVersionInputSchema,
	orbQueryId: OrbQueryIdInputSchema,
	orbQueryExists: OrbQueryExistsInputSchema,
	orbQueryLatestVersion: OrbQueryLatestVersionInputSchema,
	orbQuerySource: OrbQuerySourceInputSchema,
	orbListOrbs: OrbListOrbsInputSchema,
	orbListCategories: OrbListCategoriesInputSchema,
	orbQueryCategoryId: OrbQueryCategoryIdInputSchema,
	orbListNamespaceOrbs: OrbListNamespaceOrbsInputSchema,
	orbValidateConfig: OrbValidateConfigInputSchema,

	runnersList: RunnersListInputSchema,
} as const;

const NamespaceExistsOutputSchema = z.object({ exists: z.boolean() });
const OrbExistsOutputSchema = z.object({
	exists: z.boolean(),
	isPrivate: z.boolean().nullable().optional(),
});

export const CircleCIEndpointOutputSchemas = {
	contextsCreate: CircleCIContextEntity,
	contextsGet: CircleCIContextEntity,
	contextsListEnvVars: ContextsListEnvVarsOutputSchema,
	contextsUpsertEnvVar: ContextEnvVarSchema,
	contextsCreateRestriction: ContextRestrictionSchema,
	contextsDeleteRestriction: EmptyResult,

	contextsCreateGraphQL: GraphQLContextSchema,
	contextsDeleteGraphQL: EmptyResult,
	contextsQuery: GraphQLContextSchema,
	contextsStoreEnvVar: EmptyResult,
	contextsRemoveEnvVar: EmptyResult,

	groupsCreate: CircleCIGroupEntity,
	groupsDelete: EmptyResult,
	groupsGet: CircleCIGroupEntity,
	groupsList: GroupsListOutputSchema,

	orbAllowlistCreate: OrbAllowlistCreateResponseSchema,
	orbAllowlistDelete: EmptyResult,

	projectsCreate: CircleCIProjectEntity,
	projectsDelete: EmptyResult,
	projectsGet: CircleCIProjectEntity,

	projectEnvVarsCreate: CircleCIProjectEnvVarEntity,
	projectEnvVarsDelete: EmptyResult,
	projectEnvVarsList: ProjectEnvVarsListOutputSchema,

	schedulesList: SchedulesListOutputSchema,

	usageExportCreate: OpaqueObject,
	usageExportGet: OpaqueObject,

	pipelinesList: PipelinesListOutputSchema,
	pipelinesListForProject: PipelinesListForProjectOutputSchema,
	pipelinesGetConfig: OpaqueObject,
	pipelinesTrigger: PipelineSchema,

	pipelineDefinitionsGet: CircleCIPipelineDefinitionEntity,
	pipelineDefinitionsList: z.array(CircleCIPipelineDefinitionEntity),

	workflowsListByPipelineId: WorkflowsListByPipelineIdOutputSchema,
	workflowsGetSummary: OpaqueObject,
	workflowsListJobs: OpaqueObject,
	workflowsListTestMetrics: OpaqueObject,

	insightsFlakyTests: OpaqueObject,
	insightsProjectWorkflows: OpaqueObject,
	insightsPagesSummary: OpaqueObject,
	insightsBranches: OpaqueObject,
	insightsOrgSummary: OpaqueObject,
	insightsPlanMetrics: OpaqueObject,

	jobsGetDetails: JobDetailsSchema,
	jobsGetArtifacts: z.array(JobArtifactSchema),
	jobsGetTestMetadata: z.array(JobTestSchema),

	userGetCurrent: CircleCIUserSchema,
	userGetInfo: CircleCIUserSchema,
	userListCollaborations: z.array(CircleCICollaborationSchema),

	organizationGet: GraphQLOrganizationSchema,

	namespaceQueryExists: NamespaceExistsOutputSchema,
	namespaceDelete: EmptyResult,
	namespaceRename: NamespaceSchema,
	namespaceDeleteAlias: EmptyResult,

	orbGetDetails: GraphQLOrbSchema,
	orbGetVersion: GraphQLOrbVersionDetailSchema,
	orbQueryId: GraphQLOrbSchema,
	orbQueryExists: OrbExistsOutputSchema,
	orbQueryLatestVersion: GraphQLOrbVersionSchema,
	orbQuerySource: GraphQLOrbVersionDetailSchema,
	orbListOrbs: OrbListOrbsOutputSchema,
	orbListCategories: OrbListCategoriesOutputSchema,
	orbQueryCategoryId: GraphQLOrbCategorySchema,
	orbListNamespaceOrbs: OrbListNamespaceOrbsOutputSchema,
	orbValidateConfig: OrbConfigValidationSchema,

	runnersList: RunnersListOutputSchema,
} as const;
