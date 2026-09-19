import { z } from 'zod';
import {
	BugsnagBulkUpdateResult,
	BugsnagCollaboratorEntity,
	BugsnagConfiguredIntegration,
	BugsnagError,
	BugsnagEvent,
	BugsnagEventDataDeletion,
	BugsnagEventDataRequest,
	BugsnagEventField,
	BugsnagFeatureFlag,
	BugsnagFeatureFlagSummary,
	BugsnagIntegrationTestResult,
	BugsnagNetworkEndpointGrouping,
	BugsnagOrganizationEntity,
	BugsnagPivot,
	BugsnagPivotValue,
	BugsnagProjectAccess,
	BugsnagProjectAccessCount,
	BugsnagProjectEntity,
	BugsnagRelease,
	BugsnagReleaseGroup,
	BugsnagSavedSearch,
	BugsnagSavedSearchUsageSummary,
	BugsnagSupportedIntegration,
	BugsnagTeamEntity,
	BugsnagTrendBucket,
} from '../schema';

/**
 * Input and output schemas for every BugSnag operation.
 *
 * Output schemas reuse the entity and response definitions in `schema/` rather than
 * restating them, so the persisted shape and the returned shape cannot drift apart.
 *
 * Required inputs are required because the API rejects the call without them, not
 * because they seemed sensible. Each one is noted where it is non-obvious - several
 * BugSnag endpoints answer 400 rather than applying a default, and those 400s were
 * observed rather than assumed.
 */

/* -------------------------------------------------------------------------- */
/*                                  Envelopes                                 */
/* -------------------------------------------------------------------------- */

/**
 * There is no envelope. A BugSnag list response is a **bare JSON array**, verified
 * live, with the paging state in the `Link` and `x-total-count` headers instead of
 * the body.
 *
 * That is why no `withEnvelope` helper appears here, unlike a provider that wraps
 * rows in `{ data, meta }`. See `endpoints/shared.ts` for why the headers cannot be
 * surfaced through the shared transport and how paging works instead.
 */
const listOf = <Item extends z.ZodType>(item: Item) => z.array(item);

/**
 * Paging parameters accepted by every list operation.
 *
 * `per_page` is bounded at 100 here as a deliberate client-side guard rather than
 * an API limit: `per_page=1000` was answered 200, so the API does not enforce a
 * ceiling and an unbounded value would let one call pull an arbitrarily large page.
 * `offset` is how a caller advances, since the `Link` header cannot be read.
 */
const ListQuery = {
	per_page: z.number().int().min(1).max(100).optional(),
	offset: z.number().int().min(0).optional(),
};

/**
 * BugSnag answers a successful DELETE with an empty body - 204, confirmed live on
 * projects, teams, saved searches and event fields - so there is nothing to parse. The
 * operations report the outcome explicitly instead of returning an empty object, which
 * would be indistinguishable from a response that was swallowed.
 */
export const DeleteResultSchema = z.object({
	success: z.boolean(),
	id: z.string(),
	/**
	 * `true` when the record was already gone - the API answered 404 rather than removing
	 * anything.
	 *
	 * Reported rather than hidden because a delete of a named resource is replayed after a
	 * network failure, and the replay legitimately finds nothing. Collapsing that into a
	 * plain `success: true` would leave a caller unable to tell "I removed it" from "it was
	 * not there", and treating it as an error would strand the local mirror holding a
	 * record the API no longer has. See `endpoints/delete-flow.ts`.
	 */
	already_absent: z.boolean(),
});

/**
 * A BugSnag filter object: keyed by event field display id, each holding one or more
 * comparisons such as `{ type: 'eq', value: 'open' }`.
 *
 * Left as an open record rather than modelled, because the valid keys are whatever
 * `event_fields.list` reports for the project - which includes custom fields the
 * account defined - and the comparison types vary by field. A closed schema here would
 * reject filters the API accepts.
 *
 * Filter *values* are a privacy consideration: filtering by `user.email` puts an email
 * address in the input. Nothing from a filter is written to the event log.
 */
const FilterComparison = z
	.object({
		/**
		 * The comparison operator - `eq`, `ne` and so on. Not an enum: the accepted
		 * operators differ by field, and the API reports the valid ones for a field when
		 * it rejects a bad one.
		 */
		type: z.string().min(1),
		/**
		 * Optional because the emptiness filters compare on presence rather than on a
		 * value, so requiring one would reject a filter the API accepts.
		 */
		value: z.unknown().optional(),
	})
	.loose();

/**
 * Modelled rather than left as an open record, because the API itself enforces this
 * shape: a malformed comparison answers
 * `{"errors":["Filters Error status must be of the format {\"type\" : ..., \"value\" : ...}"]}`.
 * Checking it locally turns a round-trip into a validation error.
 *
 * The **keys** stay unconstrained, and that is the deliberate half - see
 * `BugsnagFilters` in `endpoints/shared.ts` for why an unrecognised key is the dangerous
 * case rather than a malformed value.
 */
const FilterObject = z.record(
	z.string(),
	z.union([FilterComparison, z.array(FilterComparison)]),
);

/**
 * An object whose keys are defined by the caller or the account, not by the API.
 *
 * Deliberately unmodelled, and each use below states which of the two reasons applies:
 *
 * - **Caller-defined**: the keys come from the caller's own data or configuration, so a
 *   closed schema would reject valid input. `filter_options`, `configuration` and
 *   `project_roles` are all of this kind.
 * - **Never observed**: the shape could not be produced on the recon account, and
 *   inventing field names is the mistake that put a fabricated `target_stability` shape
 *   past both the type checker and its own test. `reopen_rules` is the one case.
 *
 * `unknown` rather than `any`, so a consumer has to narrow before using a value -
 * `PLUGIN_PR_RULES.md` bans `any` on exported surfaces and this keeps that promise while
 * still accepting a shape the API does not publish.
 */
const OpenRecord = z.record(z.string(), z.unknown());

/* -------------------------------------------------------------------------- */
/*                              Common id inputs                              */
/* -------------------------------------------------------------------------- */

const OrganizationId = z.object({ organization_id: z.string() });
const ProjectId = z.object({ project_id: z.string() });
const OrganizationAndCollaborator = z.object({
	organization_id: z.string(),
	collaborator_id: z.string(),
});

/**
 * Project creation.
 *
 * `type` selects the notifier platform and is required - BugSnag uses it to decide
 * how to group and display errors, and there is no sensible default. Verified live
 * with `android` and `node`; the full list is long and platform-specific, so it is
 * accepted as a string rather than an enum that would reject a platform BugSnag adds
 * later.
 */
const ProjectCreateInput = z.object({
	organization_id: z.string(),
	name: z.string().min(1),
	type: z.string().min(1),
});

/**
 * The operations a bulk error update can apply.
 *
 * An enum rather than a free string, because this is the one place where a typo is
 * silently destructive at scale: the endpoint applies the operation to every error id
 * given, and `{"errors":["Operation is not included in the list"]}` is the only thing
 * standing between a misspelled `discard` and the caller believing it worked.
 *
 * **This list was enumerated from the API, not from documentation**, and that mattered:
 * an earlier version of it was assembled partly by inference and was wrong in two
 * directions at once - it invented `unassign`, which the API rejects by name, and it
 * omitted `snooze`, which is valid. Both versions had exactly twelve entries, so a count
 * check would have agreed with itself while two entries were wrong.
 *
 * How each was confirmed: a PATCH naming the operation against a **non-existent error
 * id**, so nothing could be modified. `{"errors":["Operation is not included in the
 * list"]}` means the name is invalid; any other response means the name is accepted and
 * something else about the request is wrong. `unassign`, `unsnooze`, `reopen` and
 * `archive` were all rejected by name and are deliberately absent.
 */
const BulkErrorOperation = z.enum([
	'fix',
	'open',
	'ignore',
	/** Requires `reopen_rules` - see the refinement on `errorsBulkUpdate`. */
	'snooze',
	'discard',
	'undiscard',
	'delete',
	/** Requires `severity`. */
	'override_severity',
	/** Requires `assigned_collaborator_id` or `assigned_team_id`. */
	'assign',
	/** Answers 404 "No issue tracker configured" unless the project has one. */
	'create_issue',
	/** Requires `issue_url`. */
	'link_issue',
	'unlink_issue',
]);

/* -------------------------------------------------------------------------- */
/*                            Input schema registry                           */
/* -------------------------------------------------------------------------- */

export const BugsnagEndpointInputSchemas = {
	/* ------------------------------ organizations ----------------------------- */
	organizationsList: z.object(ListQuery),
	organizationsGet: OrganizationId,
	organizationsDelete: OrganizationId,

	/* -------------------------------- projects -------------------------------- */
	projectsList: z.object({
		...ListQuery,
		organization_id: z.string(),
		/** Free-text project search, per the documented `q` parameter. */
		q: z.string().optional(),
		sort: z.string().optional(),
		direction: z.enum(['asc', 'desc']).optional(),
	}),
	projectsGet: ProjectId,
	projectsCreate: ProjectCreateInput,
	projectsDelete: ProjectId,
	projectsRegenerateApiKey: ProjectId,
	projectsNetworkGroupingRuleset: ProjectId,

	/* ------------------------------ collaborators ----------------------------- */
	collaboratorsList: z.object({ ...ListQuery, organization_id: z.string() }),
	collaboratorsGet: OrganizationAndCollaborator,
	/**
	 * Inviting a collaborator sends an email to a real person, so `email` is the only
	 * required field and the rest narrow what they can reach. `project_ids` restricts
	 * access to named projects; `admin: true` grants everything instead.
	 */
	collaboratorsInvite: z.object({
		organization_id: z.string(),
		email: z.email(),
		admin: z.boolean().optional(),
		project_ids: z.array(z.string()).optional(),
		team_ids: z.array(z.string()).optional(),
	}),
	/**
	 * Permissions update. The catalog is explicit that `project_ids` and
	 * `project_roles` are alternatives rather than companions, so the refinement below
	 * rejects sending both instead of leaving the API to decide which wins.
	 */
	collaboratorsUpdatePermissions: z
		.object({
			organization_id: z.string(),
			collaborator_id: z.string(),
			admin: z.boolean().optional(),
			project_ids: z.array(z.string()).optional(),
			/**
			 * Caller-defined: keyed by project id, with the role for each, so the valid
			 * keys are whichever projects the organization has.
			 */
			project_roles: OpenRecord.optional(),
		})
		.refine(
			(input) =>
				input.project_ids === undefined || input.project_roles === undefined,
			{
				message:
					'supply project_ids or project_roles, not both - they are alternative ways to express the same change',
			},
		),
	collaboratorsDelete: OrganizationAndCollaborator,
	collaboratorsListOnProject: z.object({
		...ListQuery,
		project_id: z.string(),
	}),
	collaboratorsGetOnProject: z.object({
		project_id: z.string(),
		collaborator_id: z.string(),
	}),
	collaboratorsListProjects: z.object({
		...ListQuery,
		organization_id: z.string(),
		collaborator_id: z.string(),
		sort: z.string().optional(),
		direction: z.enum(['asc', 'desc']).optional(),
	}),
	/**
	 * `collaborator_ids` is required, and must reach the API as an array:
	 * `collaborator_ids=<id>` answers `{"errors":["Collaborator_ids must be an
	 * array"]}` while `collaborator_ids[]=<id>` answers 200. `min(1)` because an empty
	 * array asks nothing.
	 */
	collaboratorsProjectAccessCounts: z.object({
		organization_id: z.string(),
		collaborator_ids: z.array(z.string()).min(1),
	}),
	collaboratorsListProjectAccesses: z.object({
		...ListQuery,
		organization_id: z.string(),
		collaborator_id: z.string(),
		q: z.string().optional(),
		/** Documented filter for projects the collaborator cannot reach. */
		inaccessible: z.boolean().optional(),
	}),
	collaboratorsGetProjectAccess: z.object({
		organization_id: z.string(),
		collaborator_id: z.string(),
		project_id: z.string(),
	}),

	/* --------------------------------- teams ---------------------------------- */
	teamsList: z.object({
		...ListQuery,
		organization_id: z.string(),
		/** Documented team-name filter. */
		q: z.string().optional(),
	}),
	teamsCreate: z.object({
		organization_id: z.string(),
		name: z.string().min(1),
	}),
	teamsGet: z.object({ organization_id: z.string(), team_id: z.string() }),
	teamsDelete: z.object({ organization_id: z.string(), team_id: z.string() }),
	/**
	 * Adding collaborators to a team.
	 *
	 * The API requires one of the two forms and says so:
	 * `{"errors":["Add all collaborators should be true if collaborator_ids is not
	 * specified"]}`. The refinement enforces that here rather than spending a
	 * round-trip to be told.
	 */
	teamsAddMembers: z
		.object({
			organization_id: z.string(),
			team_id: z.string(),
			collaborator_ids: z.array(z.string()).min(1).optional(),
			add_all_collaborators: z.boolean().optional(),
		})
		.refine(
			(input) =>
				(input.collaborator_ids !== undefined) !==
				(input.add_all_collaborators === true),
			{
				message:
					'supply either collaborator_ids or add_all_collaborators: true, not both and not neither',
			},
		),
	/**
	 * The same relationship from the collaborator's side, with the mirrored
	 * requirement: `{"errors":["Team_ids must be supplied when add_all_teams is set to
	 * false"]}`.
	 */
	teamsAddCollaboratorMemberships: z
		.object({
			organization_id: z.string(),
			collaborator_id: z.string(),
			team_ids: z.array(z.string()).min(1).optional(),
			add_all_teams: z.boolean().optional(),
		})
		.refine(
			(input) =>
				(input.team_ids !== undefined) !== (input.add_all_teams === true),
			{
				message:
					'supply either team_ids or add_all_teams: true, not both and not neither',
			},
		),

	/* --------------------------------- errors --------------------------------- */
	errorsList: z.object({
		...ListQuery,
		project_id: z.string(),
		/**
		 * There is no status parameter on this endpoint - the catalog is explicit that
		 * open/fixed/ignored has to be filtered client-side from the `status` field, or
		 * expressed through `filters`.
		 */
		filters: FilterObject.optional(),
		sort: z.string().optional(),
		direction: z.enum(['asc', 'desc']).optional(),
		base: z.string().optional(),
	}),
	/**
	 * Bulk update.
	 *
	 * `error_ids` travels as a **query** parameter while `operation` goes in the body -
	 * an asymmetry confirmed live. `min(1)` because an empty id list combined with a
	 * destructive operation is the worst possible request to send by accident.
	 *
	 * Several operations need a companion field, and the API reports each one separately
	 * (`{"errors":["Reopen rules reopen_rules required when operation is snooze"]}`,
	 * `{"errors":["Issue url must not be blank"]}`). The refinements below enforce them
	 * locally, because finding out after the fact is worse here than elsewhere: the
	 * request applies to every id in the batch.
	 */
	errorsBulkUpdate: z
		.object({
			project_id: z.string(),
			error_ids: z.array(z.string()).min(1),
			operation: BulkErrorOperation,
			severity: z.string().optional(),
			assigned_collaborator_id: z.string().optional(),
			assigned_team_id: z.string().optional(),
			issue_url: z.string().optional(),
			issue_title: z.string().optional(),
			/**
			 * When a snoozed error should come back. Required by `snooze`, and left as an
			 * open record because the rule shapes are not documented and inventing them
			 * would repeat a mistake this plugin has already made once.
			 */
			reopen_rules: OpenRecord.optional(),
		})
		.refine(
			(input) =>
				input.operation !== 'snooze' || input.reopen_rules !== undefined,
			{ message: 'reopen_rules is required when operation is snooze' },
		)
		.refine(
			(input) =>
				input.operation !== 'link_issue' || input.issue_url !== undefined,
			{ message: 'issue_url is required when operation is link_issue' },
		)
		.refine(
			(input) =>
				input.operation !== 'override_severity' || input.severity !== undefined,
			{ message: 'severity is required when operation is override_severity' },
		)
		.refine(
			(input) =>
				input.operation !== 'assign' ||
				input.assigned_collaborator_id !== undefined ||
				input.assigned_team_id !== undefined,
			{
				message:
					'assigned_collaborator_id or assigned_team_id is required when operation is assign',
			},
		),
	errorsDeleteAll: ProjectId,

	/* --------------------------------- events --------------------------------- */
	eventsList: z.object({
		...ListQuery,
		project_id: z.string(),
		filters: FilterObject.optional(),
		sort: z.string().optional(),
		direction: z.enum(['asc', 'desc']).optional(),
		base: z.string().optional(),
		/**
		 * A full report widens an event from 11 fields to 20, and the fields it adds -
		 * `metaData`, `request`, `user`, `breadcrumbs` - are the ones carrying personal
		 * data. Off unless asked for, so the wide shape is a deliberate request.
		 */
		full_reports: z.boolean().optional(),
	}),
	eventsListForError: z.object({
		...ListQuery,
		project_id: z.string(),
		error_id: z.string(),
		filters: FilterObject.optional(),
		sort: z.string().optional(),
		direction: z.enum(['asc', 'desc']).optional(),
		base: z.string().optional(),
		full_reports: z.boolean().optional(),
	}),

	/* ------------------------------ event fields ------------------------------ */
	eventFieldsList: z.object({ ...ListQuery, project_id: z.string() }),
	/**
	 * Creating a custom event field.
	 *
	 * `filter_options` is required - the API answers
	 * `{"errors":["Filter options can't be blank"]}` without it.
	 *
	 * `display_id` is deliberately **absent** from this input. The API derives it from
	 * `path` and ignores any `display_id` sent: a create asking for
	 * `display_id: 'ignored-by-the-api'` with `path: 'metaData.corsair.shape'` returned
	 * `display_id: 'metaData.corsair.shape'`. Accepting a field the API discards would
	 * invite a caller to delete the field by the id they chose and get a 404.
	 */
	eventFieldsCreate: z.object({
		project_id: z.string(),
		path: z.string().min(1),
		/**
		 * Caller-defined: the display name and the comparison types the new field should
		 * support, e.g. `{name: 'Account ID', match_types: ['eq', 'ne']}`. Required - the
		 * API answers `{"errors":["Filter options can't be blank"]}` without it.
		 */
		filter_options: OpenRecord,
	}),
	eventFieldsDelete: z.object({
		project_id: z.string(),
		/** Contains dots (`metaData.user.accountId`) and is URL-encoded on the way out. */
		display_id: z.string().min(1),
	}),

	/* --------------------------------- pivots --------------------------------- */
	pivotsList: z.object({
		...ListQuery,
		project_id: z.string(),
		filters: FilterObject.optional(),
		pivots: z.array(z.string()).optional(),
		summary_size: z.number().int().min(1).optional(),
	}),
	/**
	 * A pivot is addressed by `event_field_display_id`, not by an id - a pivot record
	 * has no `id` field at all. Named after the real key so a caller cannot mistake it.
	 */
	pivotsValues: z.object({
		...ListQuery,
		project_id: z.string(),
		event_field_display_id: z.string().min(1),
		filters: FilterObject.optional(),
		base: z.string().optional(),
		sort: z.string().optional(),
	}),

	/* -------------------------------- releases -------------------------------- */
	releasesList: z.object({
		...ListQuery,
		project_id: z.string(),
		release_stage: z.string().optional(),
		base: z.string().optional(),
		sort: z.string().optional(),
	}),
	/**
	 * `release_stage_name` is required here even though it is optional on the release
	 * list: without it the endpoint answers
	 * `{"errors":["release_stage_name can't be blank"]}`.
	 */
	releasesListGroups: z.object({
		...ListQuery,
		project_id: z.string(),
		release_stage_name: z.string().min(1),
		sort: z.string().optional(),
		top_only: z.boolean().optional(),
	}),

	/* ------------------------------ saved searches ---------------------------- */
	savedSearchesList: z.object({
		...ListQuery,
		project_id: z.string(),
		shared: z.boolean().optional(),
	}),
	/**
	 * Creation is top-level (`POST /saved_searches`), so `project_id` travels in the
	 * body rather than the path. Confirmed live: 201 with the created filterset.
	 */
	savedSearchesCreate: z.object({
		project_id: z.string(),
		name: z.string().min(1),
		filters: FilterObject,
		shared: z.boolean().optional(),
		project_default: z.boolean().optional(),
		sort: z.string().optional(),
	}),
	savedSearchesGet: z.object({ saved_search_id: z.string() }),
	savedSearchesDelete: z.object({ saved_search_id: z.string() }),
	savedSearchesUsageSummary: z.object({ saved_search_id: z.string() }),

	/* --------------------------------- trends --------------------------------- */
	/**
	 * `buckets_count` is required - the endpoint answers 400 rather than picking a
	 * default. Bounded above so one call cannot ask for an unbounded series.
	 */
	trendsProjectBuckets: z.object({
		project_id: z.string(),
		buckets_count: z.number().int().min(1).max(100),
		filters: FilterObject.optional(),
	}),

	/* ------------------------------ integrations ------------------------------ */
	integrationsListSupported: z.object(ListQuery),
	integrationsListConfigured: z.object({
		...ListQuery,
		project_id: z.string(),
	}),
	/**
	 * Configuring an integration.
	 *
	 * The field is `integration_key` here - `{"errors":["Integration key can't be
	 * blank"]}` - while {@link integrationsTest} calls the same value `key`. That
	 * asymmetry is the API's, and it is spelled out because sending the wrong one
	 * produces a blank-field error that reads like the value was missing.
	 *
	 * `configuration` holds the third-party credential, which is why nothing from this
	 * input beyond the project and the integration key is ever logged.
	 */
	integrationsConfigure: z.object({
		project_id: z.string(),
		integration_key: z.string().min(1),
		/**
		 * Caller-defined: the fields differ per integration, and the valid set for one is
		 * published by `integrations.listSupported` as its `fields`. Modelling them would
		 * mean enumerating ninety services. Holds a third-party credential, so only the
		 * field *names* are ever logged.
		 */
		configuration: OpenRecord,
	}),
	integrationsGetConfigured: z.object({ integration_id: z.string() }),
	integrationsDeleteConfigured: z.object({ integration_id: z.string() }),
	/**
	 * Tests a configuration **before** one is created, per the catalog. Hence the
	 * top-level path and no project id: there is nothing configured yet to test.
	 */
	integrationsTest: z.object({
		key: z.string().min(1),
		/** Caller-defined, as in {@link integrationsConfigure}. Never logged. */
		configuration: OpenRecord,
	}),

	/* --------------------------- GDPR data requests --------------------------- */
	/**
	 * `filters` is required on all four create operations - every one answers
	 * `{"errors":["filters must be provided"]}` to an empty body. That is a good
	 * default for an operation of this kind: an unfiltered export or deletion would
	 * address the whole account.
	 */
	dataRequestsCreateForOrganization: z.object({
		organization_id: z.string(),
		filters: FilterObject,
		report_type: z.string().optional(),
	}),
	dataRequestsGetForOrganization: z.object({
		organization_id: z.string(),
		request_id: z.string(),
	}),
	dataRequestsCreateForProject: z.object({
		project_id: z.string(),
		filters: FilterObject,
		report_type: z.string().optional(),
	}),
	dataRequestsGetForProject: z.object({
		project_id: z.string(),
		request_id: z.string(),
	}),

	dataDeletionsCreateForOrganization: z.object({
		organization_id: z.string(),
		filters: FilterObject,
	}),
	dataDeletionsGetForOrganization: z.object({
		organization_id: z.string(),
		deletion_id: z.string(),
	}),
	dataDeletionsCreateForProject: z.object({
		project_id: z.string(),
		filters: FilterObject,
	}),
	dataDeletionsGetForProject: z.object({
		project_id: z.string(),
		deletion_id: z.string(),
	}),
	/**
	 * Confirmation is the step that actually destroys the data. A deletion sits in
	 * `AWAITING_CONFIRMATION` until this is called, which is why it is a separate
	 * operation and marked destructive.
	 */
	dataDeletionsConfirmForProject: z.object({
		project_id: z.string(),
		deletion_id: z.string(),
	}),

	/* ------------------------------ feature flags ----------------------------- */
	/**
	 * `release_stage_name` is required: a flag's activity is only meaningful within a
	 * stage.
	 */
	featureFlagsList: z.object({
		...ListQuery,
		project_id: z.string(),
		release_stage_name: z.string().min(1),
		q: z.string().optional(),
		include_inactive: z.boolean().optional(),
		include_variant_summary: z.boolean().optional(),
		sort: z.string().optional(),
		direction: z.enum(['asc', 'desc']).optional(),
	}),
	featureFlagsListSummaries: z.object({
		...ListQuery,
		project_id: z.string(),
		q: z.string().optional(),
	}),
} as const;

/* -------------------------------------------------------------------------- */
/*                           Output schema registry                           */
/* -------------------------------------------------------------------------- */

export const BugsnagEndpointOutputSchemas = {
	organizationsList: listOf(BugsnagOrganizationEntity),
	organizationsGet: BugsnagOrganizationEntity,
	organizationsDelete: DeleteResultSchema,

	projectsList: listOf(BugsnagProjectEntity),
	projectsGet: BugsnagProjectEntity,
	projectsCreate: BugsnagProjectEntity,
	projectsDelete: DeleteResultSchema,
	/**
	 * Rotation returns the **whole project** with its new `api_key`, not an empty
	 * body - confirmed live on a throwaway project, where the key before and after
	 * differed. A caller can therefore read the new key from the response.
	 */
	projectsRegenerateApiKey: BugsnagProjectEntity,
	projectsNetworkGroupingRuleset: BugsnagNetworkEndpointGrouping,

	collaboratorsList: listOf(BugsnagCollaboratorEntity),
	collaboratorsGet: BugsnagCollaboratorEntity,
	collaboratorsInvite: BugsnagCollaboratorEntity,
	collaboratorsUpdatePermissions: BugsnagCollaboratorEntity,
	collaboratorsDelete: DeleteResultSchema,
	collaboratorsListOnProject: listOf(BugsnagCollaboratorEntity),
	collaboratorsGetOnProject: BugsnagCollaboratorEntity,
	collaboratorsListProjects: listOf(BugsnagProjectEntity),
	collaboratorsProjectAccessCounts: listOf(BugsnagProjectAccessCount),
	collaboratorsListProjectAccesses: listOf(BugsnagProjectAccess),
	collaboratorsGetProjectAccess: BugsnagProjectAccess,

	teamsList: listOf(BugsnagTeamEntity),
	teamsCreate: BugsnagTeamEntity,
	teamsGet: BugsnagTeamEntity,
	teamsDelete: DeleteResultSchema,
	teamsAddMembers: BugsnagTeamEntity,
	teamsAddCollaboratorMemberships: BugsnagCollaboratorEntity,

	errorsList: listOf(BugsnagError),
	errorsBulkUpdate: BugsnagBulkUpdateResult,
	errorsDeleteAll: DeleteResultSchema,

	eventsList: listOf(BugsnagEvent),
	eventsListForError: listOf(BugsnagEvent),

	eventFieldsList: listOf(BugsnagEventField),
	eventFieldsCreate: BugsnagEventField,
	eventFieldsDelete: DeleteResultSchema,

	pivotsList: listOf(BugsnagPivot),
	pivotsValues: listOf(BugsnagPivotValue),

	releasesList: listOf(BugsnagRelease),
	releasesListGroups: listOf(BugsnagReleaseGroup),

	savedSearchesList: listOf(BugsnagSavedSearch),
	savedSearchesCreate: BugsnagSavedSearch,
	savedSearchesGet: BugsnagSavedSearch,
	savedSearchesDelete: DeleteResultSchema,
	savedSearchesUsageSummary: BugsnagSavedSearchUsageSummary,

	trendsProjectBuckets: listOf(BugsnagTrendBucket),

	integrationsListSupported: listOf(BugsnagSupportedIntegration),
	integrationsListConfigured: listOf(BugsnagConfiguredIntegration),
	integrationsConfigure: BugsnagConfiguredIntegration,
	integrationsGetConfigured: BugsnagConfiguredIntegration,
	integrationsDeleteConfigured: DeleteResultSchema,
	integrationsTest: BugsnagIntegrationTestResult,

	dataRequestsCreateForOrganization: BugsnagEventDataRequest,
	dataRequestsGetForOrganization: BugsnagEventDataRequest,
	dataRequestsCreateForProject: BugsnagEventDataRequest,
	dataRequestsGetForProject: BugsnagEventDataRequest,

	dataDeletionsCreateForOrganization: BugsnagEventDataDeletion,
	dataDeletionsGetForOrganization: BugsnagEventDataDeletion,
	dataDeletionsCreateForProject: BugsnagEventDataDeletion,
	dataDeletionsGetForProject: BugsnagEventDataDeletion,
	dataDeletionsConfirmForProject: BugsnagEventDataDeletion,

	featureFlagsList: listOf(BugsnagFeatureFlag),
	featureFlagsListSummaries: listOf(BugsnagFeatureFlagSummary),
} as const;

export type BugsnagEndpointInputs = {
	[K in keyof typeof BugsnagEndpointInputSchemas]: z.infer<
		(typeof BugsnagEndpointInputSchemas)[K]
	>;
};

export type BugsnagEndpointOutputs = {
	[K in keyof typeof BugsnagEndpointOutputSchemas]: z.infer<
		(typeof BugsnagEndpointOutputSchemas)[K]
	>;
};
