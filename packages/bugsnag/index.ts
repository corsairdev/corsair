import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import {
	Collaborators,
	DataDeletions,
	DataRequests,
	Errors,
	EventFields,
	Events,
	FeatureFlags,
	Integrations,
	Organizations,
	Pivots,
	Projects,
	Releases,
	SavedSearches,
	Teams,
	Trends,
} from './endpoints';
import type {
	BugsnagEndpointInputs,
	BugsnagEndpointOutputs,
} from './endpoints/types';
import {
	BugsnagEndpointInputSchemas,
	BugsnagEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BugsnagSchema } from './schema';

export type BugsnagPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBugsnagPlugin['hooks'];
	webhookHooks?: InternalBugsnagPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof bugsnagEndpointsNested>;
};

/**
 * BugSnag authenticates with a personal auth token presented as
 * `Authorization: token <value>`.
 *
 * There is no second credential: unlike Harvest's account id or Zendesk's subdomain,
 * the token alone identifies the user and the organizations they can reach, so no
 * `account` keys are declared and there is no resolution chain.
 */
export const bugsnagAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BugsnagContext = CorsairPluginContext<
	typeof BugsnagSchema,
	BugsnagPluginOptions,
	undefined,
	typeof bugsnagAuthConfig
>;

export type BugsnagKeyBuilderContext = KeyBuilderContext<BugsnagPluginOptions>;

export type BugsnagBoundEndpoints = BindEndpoints<
	typeof bugsnagEndpointsNested
>;

type BugsnagEndpoint<K extends keyof BugsnagEndpointOutputs> = CorsairEndpoint<
	BugsnagContext,
	BugsnagEndpointInputs[K],
	BugsnagEndpointOutputs[K]
>;

export type BugsnagEndpoints = {
	[K in keyof BugsnagEndpointOutputs]: BugsnagEndpoint<K>;
};

/**
 * BugSnag can send webhooks for events such as a new error or a new release, but
 * they are configured per project in the dashboard and are not part of the Data
 * Access API surface the OSS catalog describes - none of its 60 operations manages a
 * subscription. The catalog lists zero triggers accordingly, and none is registered.
 */
export type BugsnagWebhooks = Record<string, never>;

export type BugsnagBoundWebhooks = BindWebhooks<BugsnagWebhooks>;

/**
 * The endpoint registry.
 *
 * 61 operations: the catalog's 60, plus `projects.get`. That last one is not a catalog
 * operation - the catalog lists no get-single-project - and it is registered anyway
 * because `GET /projects/{id}` is real, returns all 32 fields, and every project-scoped
 * operation needs an id from somewhere. It is recorded as a deliberate orphan by the
 * surface verifier rather than allowed to inflate the count.
 */
const bugsnagEndpointsNested = {
	organizations: {
		list: Organizations.list,
		get: Organizations.get,
		delete: Organizations.remove,
	},
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		delete: Projects.remove,
		regenerateApiKey: Projects.regenerateApiKey,
		networkGroupingRuleset: Projects.networkGroupingRuleset,
	},
	collaborators: {
		list: Collaborators.list,
		get: Collaborators.get,
		invite: Collaborators.invite,
		updatePermissions: Collaborators.updatePermissions,
		delete: Collaborators.remove,
		listOnProject: Collaborators.listOnProject,
		getOnProject: Collaborators.getOnProject,
		listProjects: Collaborators.listProjects,
		projectAccessCounts: Collaborators.projectAccessCounts,
		listProjectAccesses: Collaborators.listProjectAccesses,
		getProjectAccess: Collaborators.getProjectAccess,
	},
	teams: {
		list: Teams.list,
		create: Teams.create,
		get: Teams.get,
		delete: Teams.remove,
		addMembers: Teams.addMembers,
		addCollaboratorMemberships: Teams.addCollaboratorMemberships,
	},
	errors: {
		list: Errors.list,
		bulkUpdate: Errors.bulkUpdate,
		deleteAll: Errors.deleteAll,
	},
	events: {
		list: Events.list,
		listForError: Events.listForError,
	},
	eventFields: {
		list: EventFields.list,
		create: EventFields.create,
		delete: EventFields.remove,
	},
	pivots: {
		list: Pivots.list,
		values: Pivots.values,
	},
	releases: {
		list: Releases.list,
		listGroups: Releases.listGroups,
	},
	savedSearches: {
		list: SavedSearches.list,
		create: SavedSearches.create,
		get: SavedSearches.get,
		delete: SavedSearches.remove,
		usageSummary: SavedSearches.usageSummary,
	},
	trends: {
		projectBuckets: Trends.projectBuckets,
	},
	integrations: {
		listSupported: Integrations.listSupported,
		listConfigured: Integrations.listConfigured,
		configure: Integrations.configure,
		getConfigured: Integrations.getConfigured,
		deleteConfigured: Integrations.deleteConfigured,
		test: Integrations.test,
	},
	dataRequests: {
		createForOrganization: DataRequests.createForOrganization,
		getForOrganization: DataRequests.getForOrganization,
		createForProject: DataRequests.createForProject,
		getForProject: DataRequests.getForProject,
	},
	dataDeletions: {
		createForOrganization: DataDeletions.createForOrganization,
		getForOrganization: DataDeletions.getForOrganization,
		createForProject: DataDeletions.createForProject,
		getForProject: DataDeletions.getForProject,
		confirmForProject: DataDeletions.confirmForProject,
	},
	featureFlags: {
		list: FeatureFlags.list,
		listSummaries: FeatureFlags.listSummaries,
	},
} as const;

const bugsnagWebhooksNested = {} as const;

export const bugsnagEndpointSchemas = {
	'organizations.list': {
		input: BugsnagEndpointInputSchemas.organizationsList,
		output: BugsnagEndpointOutputSchemas.organizationsList,
	},
	'organizations.get': {
		input: BugsnagEndpointInputSchemas.organizationsGet,
		output: BugsnagEndpointOutputSchemas.organizationsGet,
	},
	'organizations.delete': {
		input: BugsnagEndpointInputSchemas.organizationsDelete,
		output: BugsnagEndpointOutputSchemas.organizationsDelete,
	},

	'projects.list': {
		input: BugsnagEndpointInputSchemas.projectsList,
		output: BugsnagEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: BugsnagEndpointInputSchemas.projectsGet,
		output: BugsnagEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: BugsnagEndpointInputSchemas.projectsCreate,
		output: BugsnagEndpointOutputSchemas.projectsCreate,
	},
	'projects.delete': {
		input: BugsnagEndpointInputSchemas.projectsDelete,
		output: BugsnagEndpointOutputSchemas.projectsDelete,
	},
	'projects.regenerateApiKey': {
		input: BugsnagEndpointInputSchemas.projectsRegenerateApiKey,
		output: BugsnagEndpointOutputSchemas.projectsRegenerateApiKey,
	},
	'projects.networkGroupingRuleset': {
		input: BugsnagEndpointInputSchemas.projectsNetworkGroupingRuleset,
		output: BugsnagEndpointOutputSchemas.projectsNetworkGroupingRuleset,
	},

	'collaborators.list': {
		input: BugsnagEndpointInputSchemas.collaboratorsList,
		output: BugsnagEndpointOutputSchemas.collaboratorsList,
	},
	'collaborators.get': {
		input: BugsnagEndpointInputSchemas.collaboratorsGet,
		output: BugsnagEndpointOutputSchemas.collaboratorsGet,
	},
	'collaborators.invite': {
		input: BugsnagEndpointInputSchemas.collaboratorsInvite,
		output: BugsnagEndpointOutputSchemas.collaboratorsInvite,
	},
	'collaborators.updatePermissions': {
		input: BugsnagEndpointInputSchemas.collaboratorsUpdatePermissions,
		output: BugsnagEndpointOutputSchemas.collaboratorsUpdatePermissions,
	},
	'collaborators.delete': {
		input: BugsnagEndpointInputSchemas.collaboratorsDelete,
		output: BugsnagEndpointOutputSchemas.collaboratorsDelete,
	},
	'collaborators.listOnProject': {
		input: BugsnagEndpointInputSchemas.collaboratorsListOnProject,
		output: BugsnagEndpointOutputSchemas.collaboratorsListOnProject,
	},
	'collaborators.getOnProject': {
		input: BugsnagEndpointInputSchemas.collaboratorsGetOnProject,
		output: BugsnagEndpointOutputSchemas.collaboratorsGetOnProject,
	},
	'collaborators.listProjects': {
		input: BugsnagEndpointInputSchemas.collaboratorsListProjects,
		output: BugsnagEndpointOutputSchemas.collaboratorsListProjects,
	},
	'collaborators.projectAccessCounts': {
		input: BugsnagEndpointInputSchemas.collaboratorsProjectAccessCounts,
		output: BugsnagEndpointOutputSchemas.collaboratorsProjectAccessCounts,
	},
	'collaborators.listProjectAccesses': {
		input: BugsnagEndpointInputSchemas.collaboratorsListProjectAccesses,
		output: BugsnagEndpointOutputSchemas.collaboratorsListProjectAccesses,
	},
	'collaborators.getProjectAccess': {
		input: BugsnagEndpointInputSchemas.collaboratorsGetProjectAccess,
		output: BugsnagEndpointOutputSchemas.collaboratorsGetProjectAccess,
	},

	'teams.list': {
		input: BugsnagEndpointInputSchemas.teamsList,
		output: BugsnagEndpointOutputSchemas.teamsList,
	},
	'teams.create': {
		input: BugsnagEndpointInputSchemas.teamsCreate,
		output: BugsnagEndpointOutputSchemas.teamsCreate,
	},
	'teams.get': {
		input: BugsnagEndpointInputSchemas.teamsGet,
		output: BugsnagEndpointOutputSchemas.teamsGet,
	},
	'teams.delete': {
		input: BugsnagEndpointInputSchemas.teamsDelete,
		output: BugsnagEndpointOutputSchemas.teamsDelete,
	},
	'teams.addMembers': {
		input: BugsnagEndpointInputSchemas.teamsAddMembers,
		output: BugsnagEndpointOutputSchemas.teamsAddMembers,
	},
	'teams.addCollaboratorMemberships': {
		input: BugsnagEndpointInputSchemas.teamsAddCollaboratorMemberships,
		output: BugsnagEndpointOutputSchemas.teamsAddCollaboratorMemberships,
	},

	'errors.list': {
		input: BugsnagEndpointInputSchemas.errorsList,
		output: BugsnagEndpointOutputSchemas.errorsList,
	},
	'errors.bulkUpdate': {
		input: BugsnagEndpointInputSchemas.errorsBulkUpdate,
		output: BugsnagEndpointOutputSchemas.errorsBulkUpdate,
	},
	'errors.deleteAll': {
		input: BugsnagEndpointInputSchemas.errorsDeleteAll,
		output: BugsnagEndpointOutputSchemas.errorsDeleteAll,
	},

	'events.list': {
		input: BugsnagEndpointInputSchemas.eventsList,
		output: BugsnagEndpointOutputSchemas.eventsList,
	},
	'events.listForError': {
		input: BugsnagEndpointInputSchemas.eventsListForError,
		output: BugsnagEndpointOutputSchemas.eventsListForError,
	},

	'eventFields.list': {
		input: BugsnagEndpointInputSchemas.eventFieldsList,
		output: BugsnagEndpointOutputSchemas.eventFieldsList,
	},
	'eventFields.create': {
		input: BugsnagEndpointInputSchemas.eventFieldsCreate,
		output: BugsnagEndpointOutputSchemas.eventFieldsCreate,
	},
	'eventFields.delete': {
		input: BugsnagEndpointInputSchemas.eventFieldsDelete,
		output: BugsnagEndpointOutputSchemas.eventFieldsDelete,
	},

	'pivots.list': {
		input: BugsnagEndpointInputSchemas.pivotsList,
		output: BugsnagEndpointOutputSchemas.pivotsList,
	},
	'pivots.values': {
		input: BugsnagEndpointInputSchemas.pivotsValues,
		output: BugsnagEndpointOutputSchemas.pivotsValues,
	},

	'releases.list': {
		input: BugsnagEndpointInputSchemas.releasesList,
		output: BugsnagEndpointOutputSchemas.releasesList,
	},
	'releases.listGroups': {
		input: BugsnagEndpointInputSchemas.releasesListGroups,
		output: BugsnagEndpointOutputSchemas.releasesListGroups,
	},

	'savedSearches.list': {
		input: BugsnagEndpointInputSchemas.savedSearchesList,
		output: BugsnagEndpointOutputSchemas.savedSearchesList,
	},
	'savedSearches.create': {
		input: BugsnagEndpointInputSchemas.savedSearchesCreate,
		output: BugsnagEndpointOutputSchemas.savedSearchesCreate,
	},
	'savedSearches.get': {
		input: BugsnagEndpointInputSchemas.savedSearchesGet,
		output: BugsnagEndpointOutputSchemas.savedSearchesGet,
	},
	'savedSearches.delete': {
		input: BugsnagEndpointInputSchemas.savedSearchesDelete,
		output: BugsnagEndpointOutputSchemas.savedSearchesDelete,
	},
	'savedSearches.usageSummary': {
		input: BugsnagEndpointInputSchemas.savedSearchesUsageSummary,
		output: BugsnagEndpointOutputSchemas.savedSearchesUsageSummary,
	},

	'trends.projectBuckets': {
		input: BugsnagEndpointInputSchemas.trendsProjectBuckets,
		output: BugsnagEndpointOutputSchemas.trendsProjectBuckets,
	},

	'integrations.listSupported': {
		input: BugsnagEndpointInputSchemas.integrationsListSupported,
		output: BugsnagEndpointOutputSchemas.integrationsListSupported,
	},
	'integrations.listConfigured': {
		input: BugsnagEndpointInputSchemas.integrationsListConfigured,
		output: BugsnagEndpointOutputSchemas.integrationsListConfigured,
	},
	'integrations.configure': {
		input: BugsnagEndpointInputSchemas.integrationsConfigure,
		output: BugsnagEndpointOutputSchemas.integrationsConfigure,
	},
	'integrations.getConfigured': {
		input: BugsnagEndpointInputSchemas.integrationsGetConfigured,
		output: BugsnagEndpointOutputSchemas.integrationsGetConfigured,
	},
	'integrations.deleteConfigured': {
		input: BugsnagEndpointInputSchemas.integrationsDeleteConfigured,
		output: BugsnagEndpointOutputSchemas.integrationsDeleteConfigured,
	},
	'integrations.test': {
		input: BugsnagEndpointInputSchemas.integrationsTest,
		output: BugsnagEndpointOutputSchemas.integrationsTest,
	},

	'dataRequests.createForOrganization': {
		input: BugsnagEndpointInputSchemas.dataRequestsCreateForOrganization,
		output: BugsnagEndpointOutputSchemas.dataRequestsCreateForOrganization,
	},
	'dataRequests.getForOrganization': {
		input: BugsnagEndpointInputSchemas.dataRequestsGetForOrganization,
		output: BugsnagEndpointOutputSchemas.dataRequestsGetForOrganization,
	},
	'dataRequests.createForProject': {
		input: BugsnagEndpointInputSchemas.dataRequestsCreateForProject,
		output: BugsnagEndpointOutputSchemas.dataRequestsCreateForProject,
	},
	'dataRequests.getForProject': {
		input: BugsnagEndpointInputSchemas.dataRequestsGetForProject,
		output: BugsnagEndpointOutputSchemas.dataRequestsGetForProject,
	},

	'dataDeletions.createForOrganization': {
		input: BugsnagEndpointInputSchemas.dataDeletionsCreateForOrganization,
		output: BugsnagEndpointOutputSchemas.dataDeletionsCreateForOrganization,
	},
	'dataDeletions.getForOrganization': {
		input: BugsnagEndpointInputSchemas.dataDeletionsGetForOrganization,
		output: BugsnagEndpointOutputSchemas.dataDeletionsGetForOrganization,
	},
	'dataDeletions.createForProject': {
		input: BugsnagEndpointInputSchemas.dataDeletionsCreateForProject,
		output: BugsnagEndpointOutputSchemas.dataDeletionsCreateForProject,
	},
	'dataDeletions.getForProject': {
		input: BugsnagEndpointInputSchemas.dataDeletionsGetForProject,
		output: BugsnagEndpointOutputSchemas.dataDeletionsGetForProject,
	},
	'dataDeletions.confirmForProject': {
		input: BugsnagEndpointInputSchemas.dataDeletionsConfirmForProject,
		output: BugsnagEndpointOutputSchemas.dataDeletionsConfirmForProject,
	},

	'featureFlags.list': {
		input: BugsnagEndpointInputSchemas.featureFlagsList,
		output: BugsnagEndpointOutputSchemas.featureFlagsList,
	},
	'featureFlags.listSummaries': {
		input: BugsnagEndpointInputSchemas.featureFlagsListSummaries,
		output: BugsnagEndpointOutputSchemas.featureFlagsListSummaries,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof bugsnagEndpointsNested
>;

export const bugsnagWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof bugsnagWebhooksNested
	>;

/**
 * Risk levels follow what an operation can destroy, not what HTTP method it uses.
 *
 * `read` is a plain read. `write` creates or changes something recoverable.
 * `destructive` is for anything irreversible or with a blast radius beyond the record
 * named - which is why some of the assignments are worth stating:
 *
 * - `projects.regenerateApiKey` deletes no data, but it silently stops every deployed
 *   notifier from reporting until each one is redeployed with the new key.
 * - `errors.bulkUpdate` is destructive because `delete` and `discard` are among the
 *   operations it can apply, to an arbitrary number of errors at once.
 * - `integrations.deleteConfigured` cannot be undone without the third-party
 *   credentials again, which the caller may no longer hold.
 * - `dataDeletions.*` destroy real user data. The creates are destructive as well as the
 *   confirmation, because a created deletion is a loaded instruction awaiting one call.
 * - `dataRequests.*` creates are `write`, not `read`: they produce a downloadable export
 *   of an identified person's data, which is not a side-effect-free operation even
 *   though it destroys nothing.
 */
export const bugsnagEndpointMeta = {
	'organizations.list': {
		riskLevel: 'read',
		description: "List the organizations the token's owner belongs to",
	},
	'organizations.get': {
		riskLevel: 'read',
		description: 'Get a single organization',
	},
	'organizations.delete': {
		riskLevel: 'destructive',
		description:
			'Delete an organization with all of its projects, errors and collaborator access',
	},

	'projects.list': {
		riskLevel: 'read',
		description: 'List the projects in an organization',
	},
	'projects.get': { riskLevel: 'read', description: 'Get a single project' },
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a project in an organization',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		description: 'Delete a project and its entire error history',
	},
	'projects.regenerateApiKey': {
		riskLevel: 'destructive',
		description:
			"Rotate a project's notifier API key, stopping every deployed notifier until redeployed",
	},
	'projects.networkGroupingRuleset': {
		riskLevel: 'read',
		description: "Get a project's network span grouping ruleset",
	},

	'collaborators.list': {
		riskLevel: 'read',
		description: 'List the collaborators on an organization',
	},
	'collaborators.get': {
		riskLevel: 'read',
		description: 'Get a single collaborator',
	},
	'collaborators.invite': {
		riskLevel: 'write',
		description: 'Invite a collaborator to an organization by email address',
	},
	'collaborators.updatePermissions': {
		riskLevel: 'write',
		description: "Change a collaborator's project access or admin status",
	},
	'collaborators.delete': {
		riskLevel: 'destructive',
		description:
			'Remove a collaborator, revoking access to every project in the organization',
	},
	'collaborators.listOnProject': {
		riskLevel: 'read',
		description: 'List the collaborators who can reach a project',
	},
	'collaborators.getOnProject': {
		riskLevel: 'read',
		description: 'Get a collaborator in the context of a project',
	},
	'collaborators.listProjects': {
		riskLevel: 'read',
		description: 'List the projects a collaborator can reach',
	},
	'collaborators.projectAccessCounts': {
		riskLevel: 'read',
		description: 'Count how many projects each named collaborator can reach',
	},
	'collaborators.listProjectAccesses': {
		riskLevel: 'read',
		description:
			'List how a collaborator reaches each project, with the granting role',
	},
	'collaborators.getProjectAccess': {
		riskLevel: 'read',
		description: 'Get how one collaborator reaches one project',
	},

	'teams.list': {
		riskLevel: 'read',
		description: 'List the teams in an organization',
	},
	'teams.create': {
		riskLevel: 'write',
		description: 'Create a team in an organization',
	},
	'teams.get': { riskLevel: 'read', description: 'Get a single team' },
	'teams.delete': {
		riskLevel: 'destructive',
		description: 'Delete a team, removing the grouping but not its members',
	},
	'teams.addMembers': {
		riskLevel: 'write',
		description: 'Add collaborators to a team, or add all of them',
	},
	'teams.addCollaboratorMemberships': {
		riskLevel: 'write',
		description: 'Add a collaborator to teams, or to all of them',
	},

	'errors.list': {
		riskLevel: 'read',
		description: 'List the error groups on a project',
	},
	'errors.bulkUpdate': {
		riskLevel: 'destructive',
		description:
			'Apply one operation to many errors at once, including delete and discard',
	},
	'errors.deleteAll': {
		riskLevel: 'destructive',
		description: 'Permanently delete every error and event in a project',
	},

	'events.list': {
		riskLevel: 'read',
		description: 'List the individual event occurrences on a project',
	},
	'events.listForError': {
		riskLevel: 'read',
		description: 'List the individual events belonging to one error',
	},

	'eventFields.list': {
		riskLevel: 'read',
		description: 'List the fields a project can filter and pivot on',
	},
	'eventFields.create': {
		riskLevel: 'write',
		description:
			'Create a custom event field from a path inside event metadata',
	},
	'eventFields.delete': {
		riskLevel: 'destructive',
		description: 'Delete a custom event field',
	},

	'pivots.list': {
		riskLevel: 'read',
		description: 'List the pivot definitions available on a project',
	},
	'pivots.values': {
		riskLevel: 'read',
		description: "List one pivot's values with each value's share of events",
	},

	'releases.list': {
		riskLevel: 'read',
		description: 'List the releases of a project',
	},
	'releases.listGroups': {
		riskLevel: 'read',
		description: 'List the release groups of a project within a release stage',
	},

	'savedSearches.list': {
		riskLevel: 'read',
		description: 'List the saved searches on a project',
	},
	'savedSearches.create': {
		riskLevel: 'write',
		description: 'Create a saved search from a filter configuration',
	},
	'savedSearches.get': {
		riskLevel: 'read',
		description: 'Get a single saved search',
	},
	'savedSearches.delete': {
		riskLevel: 'destructive',
		description: 'Delete a saved search',
	},
	'savedSearches.usageSummary': {
		riskLevel: 'read',
		description:
			'Report what depends on a saved search, to check before deleting it',
	},

	'trends.projectBuckets': {
		riskLevel: 'read',
		description: "Get a project's event counts split into time buckets",
	},

	'integrations.listSupported': {
		riskLevel: 'read',
		description: 'List every integration BugSnag supports',
	},
	'integrations.listConfigured': {
		riskLevel: 'read',
		description: 'List the integrations configured on a project',
	},
	'integrations.configure': {
		riskLevel: 'write',
		description: 'Configure an integration on a project',
	},
	'integrations.getConfigured': {
		riskLevel: 'read',
		description: 'Get a single configured integration',
	},
	'integrations.deleteConfigured': {
		riskLevel: 'destructive',
		description: 'Delete a configured integration',
	},
	'integrations.test': {
		riskLevel: 'read',
		description: 'Test an integration configuration before creating it',
	},

	'dataRequests.createForOrganization': {
		riskLevel: 'write',
		description:
			"Request an export of an organization's event data for a subject access request",
	},
	'dataRequests.getForOrganization': {
		riskLevel: 'read',
		description: 'Check the status of an organization event data export',
	},
	'dataRequests.createForProject': {
		riskLevel: 'write',
		description:
			"Request an export of a project's event data for a subject access request",
	},
	'dataRequests.getForProject': {
		riskLevel: 'read',
		description: 'Check the status of a project event data export',
	},

	'dataDeletions.createForOrganization': {
		riskLevel: 'destructive',
		description:
			'Create a request to erase matching event data across an organization',
	},
	'dataDeletions.getForOrganization': {
		riskLevel: 'read',
		description: 'Check the status of an organization event data deletion',
	},
	'dataDeletions.createForProject': {
		riskLevel: 'destructive',
		description: 'Create a request to erase matching event data in a project',
	},
	'dataDeletions.getForProject': {
		riskLevel: 'read',
		description: 'Check the status of a project event data deletion',
	},
	'dataDeletions.confirmForProject': {
		riskLevel: 'destructive',
		description:
			'Confirm a project event data deletion, irreversibly erasing the matched data',
	},

	'featureFlags.list': {
		riskLevel: 'read',
		description: 'List the feature flags seen on a project in a release stage',
	},
	'featureFlags.listSummaries': {
		riskLevel: 'read',
		description: 'List feature flag summaries for a project',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof bugsnagEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseBugsnagPlugin<T extends BugsnagPluginOptions> = CorsairPlugin<
	'bugsnag',
	typeof BugsnagSchema,
	typeof bugsnagEndpointsNested,
	typeof bugsnagWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalBugsnagPlugin = BaseBugsnagPlugin<BugsnagPluginOptions>;

export type ExternalBugsnagPlugin<T extends BugsnagPluginOptions> =
	BaseBugsnagPlugin<T>;

/**
 * Builds the BugSnag plugin.
 *
 * BugSnag authenticates with a personal auth token, presented as the literal scheme
 * `token` rather than `Bearer`. Nothing else is required.
 */
export function bugsnag<const T extends BugsnagPluginOptions>(
	incomingOptions: BugsnagPluginOptions & T = {} as BugsnagPluginOptions & T,
): ExternalBugsnagPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'bugsnag',
		authConfig: bugsnagAuthConfig,
		schema: BugsnagSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: bugsnagEndpointsNested,
		webhooks: bugsnagWebhooksNested,
		endpointMeta: bugsnagEndpointMeta,
		endpointSchemas: bugsnagEndpointSchemas,
		webhookSchemas: bugsnagWebhookSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BugsnagKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalBugsnagPlugin;
}

export type {
	BugsnagEndpointInputs,
	BugsnagEndpointOutputs,
} from './endpoints/types';
export type {
	BugsnagCollaboratorEntity,
	BugsnagOrganizationEntity,
	BugsnagProjectEntity,
	BugsnagTeamEntity,
} from './schema/database';
