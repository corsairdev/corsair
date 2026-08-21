import type {
	AuthTypes,
	BindEndpoints,
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
} from 'corsair/core';
import {
	Contexts,
	ContextsGraphQL,
	Groups,
	Insights,
	Jobs,
	Namespaces,
	OrbAllowlist,
	Orbs,
	Organization,
	PipelineDefinitions,
	Pipelines,
	ProjectEnvVars,
	Projects,
	Runners,
	Schedules,
	Usage,
	User,
	Workflows,
} from './endpoints';
import type {
	CircleCIEndpointInputs,
	CircleCIEndpointOutputs,
} from './endpoints/types';
import {
	CircleCIEndpointInputSchemas,
	CircleCIEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CircleCISchema } from './schema';

export type CircleCIPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCircleCIPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof circleCIEndpointsNested>;
};

/** CircleCI authenticates with a single personal API token across all four transports. */
export const circleCIAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type CircleCIContext = CorsairPluginContext<
	typeof CircleCISchema,
	CircleCIPluginOptions,
	undefined,
	typeof circleCIAuthConfig
>;

export type CircleCIKeyBuilderContext =
	KeyBuilderContext<CircleCIPluginOptions>;

export type CircleCIBoundEndpoints = BindEndpoints<
	typeof circleCIEndpointsNested
>;

type CircleCIEndpoint<K extends keyof CircleCIEndpointOutputs> =
	CorsairEndpoint<
		CircleCIContext,
		CircleCIEndpointInputs[K],
		CircleCIEndpointOutputs[K]
	>;

export type CircleCIEndpoints = {
	contextsCreate: CircleCIEndpoint<'contextsCreate'>;
	contextsGet: CircleCIEndpoint<'contextsGet'>;
	contextsListEnvVars: CircleCIEndpoint<'contextsListEnvVars'>;
	contextsUpsertEnvVar: CircleCIEndpoint<'contextsUpsertEnvVar'>;
	contextsCreateRestriction: CircleCIEndpoint<'contextsCreateRestriction'>;
	contextsDeleteRestriction: CircleCIEndpoint<'contextsDeleteRestriction'>;

	contextsCreateGraphQL: CircleCIEndpoint<'contextsCreateGraphQL'>;
	contextsDeleteGraphQL: CircleCIEndpoint<'contextsDeleteGraphQL'>;
	contextsQuery: CircleCIEndpoint<'contextsQuery'>;
	contextsStoreEnvVar: CircleCIEndpoint<'contextsStoreEnvVar'>;
	contextsRemoveEnvVar: CircleCIEndpoint<'contextsRemoveEnvVar'>;

	groupsCreate: CircleCIEndpoint<'groupsCreate'>;
	groupsDelete: CircleCIEndpoint<'groupsDelete'>;
	groupsGet: CircleCIEndpoint<'groupsGet'>;
	groupsList: CircleCIEndpoint<'groupsList'>;

	orbAllowlistCreate: CircleCIEndpoint<'orbAllowlistCreate'>;
	orbAllowlistDelete: CircleCIEndpoint<'orbAllowlistDelete'>;

	projectsCreate: CircleCIEndpoint<'projectsCreate'>;
	projectsDelete: CircleCIEndpoint<'projectsDelete'>;
	projectsGet: CircleCIEndpoint<'projectsGet'>;

	projectEnvVarsCreate: CircleCIEndpoint<'projectEnvVarsCreate'>;
	projectEnvVarsDelete: CircleCIEndpoint<'projectEnvVarsDelete'>;
	projectEnvVarsList: CircleCIEndpoint<'projectEnvVarsList'>;

	schedulesList: CircleCIEndpoint<'schedulesList'>;

	usageExportCreate: CircleCIEndpoint<'usageExportCreate'>;
	usageExportGet: CircleCIEndpoint<'usageExportGet'>;

	pipelinesList: CircleCIEndpoint<'pipelinesList'>;
	pipelinesListForProject: CircleCIEndpoint<'pipelinesListForProject'>;
	pipelinesGetConfig: CircleCIEndpoint<'pipelinesGetConfig'>;
	pipelinesTrigger: CircleCIEndpoint<'pipelinesTrigger'>;

	pipelineDefinitionsGet: CircleCIEndpoint<'pipelineDefinitionsGet'>;
	pipelineDefinitionsList: CircleCIEndpoint<'pipelineDefinitionsList'>;

	workflowsListByPipelineId: CircleCIEndpoint<'workflowsListByPipelineId'>;
	workflowsGetSummary: CircleCIEndpoint<'workflowsGetSummary'>;
	workflowsListJobs: CircleCIEndpoint<'workflowsListJobs'>;
	workflowsListTestMetrics: CircleCIEndpoint<'workflowsListTestMetrics'>;

	insightsFlakyTests: CircleCIEndpoint<'insightsFlakyTests'>;
	insightsProjectWorkflows: CircleCIEndpoint<'insightsProjectWorkflows'>;
	insightsPagesSummary: CircleCIEndpoint<'insightsPagesSummary'>;
	insightsBranches: CircleCIEndpoint<'insightsBranches'>;
	insightsOrgSummary: CircleCIEndpoint<'insightsOrgSummary'>;
	insightsPlanMetrics: CircleCIEndpoint<'insightsPlanMetrics'>;

	jobsGetDetails: CircleCIEndpoint<'jobsGetDetails'>;
	jobsGetArtifacts: CircleCIEndpoint<'jobsGetArtifacts'>;
	jobsGetTestMetadata: CircleCIEndpoint<'jobsGetTestMetadata'>;

	userGetCurrent: CircleCIEndpoint<'userGetCurrent'>;
	userGetInfo: CircleCIEndpoint<'userGetInfo'>;
	userListCollaborations: CircleCIEndpoint<'userListCollaborations'>;

	organizationGet: CircleCIEndpoint<'organizationGet'>;

	namespaceQueryExists: CircleCIEndpoint<'namespaceQueryExists'>;
	namespaceDelete: CircleCIEndpoint<'namespaceDelete'>;
	namespaceRename: CircleCIEndpoint<'namespaceRename'>;
	namespaceDeleteAlias: CircleCIEndpoint<'namespaceDeleteAlias'>;

	orbGetDetails: CircleCIEndpoint<'orbGetDetails'>;
	orbGetVersion: CircleCIEndpoint<'orbGetVersion'>;
	orbQueryId: CircleCIEndpoint<'orbQueryId'>;
	orbQueryExists: CircleCIEndpoint<'orbQueryExists'>;
	orbQueryLatestVersion: CircleCIEndpoint<'orbQueryLatestVersion'>;
	orbQuerySource: CircleCIEndpoint<'orbQuerySource'>;
	orbListOrbs: CircleCIEndpoint<'orbListOrbs'>;
	orbListCategories: CircleCIEndpoint<'orbListCategories'>;
	orbQueryCategoryId: CircleCIEndpoint<'orbQueryCategoryId'>;
	orbListNamespaceOrbs: CircleCIEndpoint<'orbListNamespaceOrbs'>;
	orbValidateConfig: CircleCIEndpoint<'orbValidateConfig'>;

	runnersList: CircleCIEndpoint<'runnersList'>;
};

const circleCIEndpointsNested = {
	contexts: {
		create: Contexts.create,
		get: Contexts.get,
		listEnvVars: Contexts.listEnvVars,
		upsertEnvVar: Contexts.upsertEnvVar,
		createRestriction: Contexts.createRestriction,
		deleteRestriction: Contexts.deleteRestriction,
	},
	contextsGraphQL: {
		create: ContextsGraphQL.create,
		delete: ContextsGraphQL.remove,
		query: ContextsGraphQL.query,
		storeEnvVar: ContextsGraphQL.storeEnvVar,
		removeEnvVar: ContextsGraphQL.removeEnvVar,
	},
	groups: {
		create: Groups.create,
		delete: Groups.remove,
		get: Groups.get,
		list: Groups.list,
	},
	orbAllowlist: {
		create: OrbAllowlist.create,
		delete: OrbAllowlist.remove,
	},
	projects: {
		create: Projects.create,
		delete: Projects.remove,
		get: Projects.get,
	},
	projectEnvVars: {
		create: ProjectEnvVars.create,
		delete: ProjectEnvVars.remove,
		list: ProjectEnvVars.list,
	},
	schedules: {
		list: Schedules.list,
	},
	usageExport: {
		create: Usage.create,
		get: Usage.get,
	},
	pipelines: {
		list: Pipelines.list,
		listForProject: Pipelines.listForProject,
		getConfig: Pipelines.getConfig,
		trigger: Pipelines.trigger,
	},
	pipelineDefinitions: {
		get: PipelineDefinitions.get,
		list: PipelineDefinitions.list,
	},
	workflows: {
		listByPipelineId: Workflows.listByPipelineId,
		getSummary: Workflows.getSummary,
		listJobs: Workflows.listJobs,
		listTestMetrics: Workflows.listTestMetrics,
	},
	insights: {
		flakyTests: Insights.flakyTests,
		projectWorkflows: Insights.projectWorkflows,
		pagesSummary: Insights.pagesSummary,
		branches: Insights.branches,
		orgSummary: Insights.orgSummaryList,
		planMetrics: Insights.planMetrics,
	},
	jobs: {
		getDetails: Jobs.getDetails,
		getArtifacts: Jobs.getArtifacts,
		getTestMetadata: Jobs.getTestMetadata,
	},
	user: {
		getCurrent: User.getCurrent,
		getInfo: User.getInfo,
		listCollaborations: User.listCollaborations,
	},
	organization: {
		get: Organization.get,
	},
	namespace: {
		queryExists: Namespaces.queryExists,
		delete: Namespaces.remove,
		rename: Namespaces.rename,
		deleteAlias: Namespaces.deleteAlias,
	},
	orbs: {
		getDetails: Orbs.getDetails,
		getVersion: Orbs.getVersion,
		queryId: Orbs.queryId,
		queryExists: Orbs.queryExists,
		queryLatestVersion: Orbs.queryLatestVersion,
		querySource: Orbs.querySource,
		listOrbs: Orbs.listOrbs,
		listCategories: Orbs.listCategories,
		queryCategoryId: Orbs.queryCategoryId,
		listNamespaceOrbs: Orbs.listNamespaceOrbs,
		validateConfig: Orbs.validateConfig,
	},
	runners: {
		list: Runners.list,
	},
} as const;

export const circleCIEndpointSchemas = {
	'contexts.create': {
		input: CircleCIEndpointInputSchemas.contextsCreate,
		output: CircleCIEndpointOutputSchemas.contextsCreate,
	},
	'contexts.get': {
		input: CircleCIEndpointInputSchemas.contextsGet,
		output: CircleCIEndpointOutputSchemas.contextsGet,
	},
	'contexts.listEnvVars': {
		input: CircleCIEndpointInputSchemas.contextsListEnvVars,
		output: CircleCIEndpointOutputSchemas.contextsListEnvVars,
	},
	'contexts.upsertEnvVar': {
		input: CircleCIEndpointInputSchemas.contextsUpsertEnvVar,
		output: CircleCIEndpointOutputSchemas.contextsUpsertEnvVar,
	},
	'contexts.createRestriction': {
		input: CircleCIEndpointInputSchemas.contextsCreateRestriction,
		output: CircleCIEndpointOutputSchemas.contextsCreateRestriction,
	},
	'contexts.deleteRestriction': {
		input: CircleCIEndpointInputSchemas.contextsDeleteRestriction,
		output: CircleCIEndpointOutputSchemas.contextsDeleteRestriction,
	},

	'contextsGraphQL.create': {
		input: CircleCIEndpointInputSchemas.contextsCreateGraphQL,
		output: CircleCIEndpointOutputSchemas.contextsCreateGraphQL,
	},
	'contextsGraphQL.delete': {
		input: CircleCIEndpointInputSchemas.contextsDeleteGraphQL,
		output: CircleCIEndpointOutputSchemas.contextsDeleteGraphQL,
	},
	'contextsGraphQL.query': {
		input: CircleCIEndpointInputSchemas.contextsQuery,
		output: CircleCIEndpointOutputSchemas.contextsQuery,
	},
	'contextsGraphQL.storeEnvVar': {
		input: CircleCIEndpointInputSchemas.contextsStoreEnvVar,
		output: CircleCIEndpointOutputSchemas.contextsStoreEnvVar,
	},
	'contextsGraphQL.removeEnvVar': {
		input: CircleCIEndpointInputSchemas.contextsRemoveEnvVar,
		output: CircleCIEndpointOutputSchemas.contextsRemoveEnvVar,
	},

	'groups.create': {
		input: CircleCIEndpointInputSchemas.groupsCreate,
		output: CircleCIEndpointOutputSchemas.groupsCreate,
	},
	'groups.delete': {
		input: CircleCIEndpointInputSchemas.groupsDelete,
		output: CircleCIEndpointOutputSchemas.groupsDelete,
	},
	'groups.get': {
		input: CircleCIEndpointInputSchemas.groupsGet,
		output: CircleCIEndpointOutputSchemas.groupsGet,
	},
	'groups.list': {
		input: CircleCIEndpointInputSchemas.groupsList,
		output: CircleCIEndpointOutputSchemas.groupsList,
	},

	'orbAllowlist.create': {
		input: CircleCIEndpointInputSchemas.orbAllowlistCreate,
		output: CircleCIEndpointOutputSchemas.orbAllowlistCreate,
	},
	'orbAllowlist.delete': {
		input: CircleCIEndpointInputSchemas.orbAllowlistDelete,
		output: CircleCIEndpointOutputSchemas.orbAllowlistDelete,
	},

	'projects.create': {
		input: CircleCIEndpointInputSchemas.projectsCreate,
		output: CircleCIEndpointOutputSchemas.projectsCreate,
	},
	'projects.delete': {
		input: CircleCIEndpointInputSchemas.projectsDelete,
		output: CircleCIEndpointOutputSchemas.projectsDelete,
	},
	'projects.get': {
		input: CircleCIEndpointInputSchemas.projectsGet,
		output: CircleCIEndpointOutputSchemas.projectsGet,
	},

	'projectEnvVars.create': {
		input: CircleCIEndpointInputSchemas.projectEnvVarsCreate,
		output: CircleCIEndpointOutputSchemas.projectEnvVarsCreate,
	},
	'projectEnvVars.delete': {
		input: CircleCIEndpointInputSchemas.projectEnvVarsDelete,
		output: CircleCIEndpointOutputSchemas.projectEnvVarsDelete,
	},
	'projectEnvVars.list': {
		input: CircleCIEndpointInputSchemas.projectEnvVarsList,
		output: CircleCIEndpointOutputSchemas.projectEnvVarsList,
	},

	'schedules.list': {
		input: CircleCIEndpointInputSchemas.schedulesList,
		output: CircleCIEndpointOutputSchemas.schedulesList,
	},

	'usageExport.create': {
		input: CircleCIEndpointInputSchemas.usageExportCreate,
		output: CircleCIEndpointOutputSchemas.usageExportCreate,
	},
	'usageExport.get': {
		input: CircleCIEndpointInputSchemas.usageExportGet,
		output: CircleCIEndpointOutputSchemas.usageExportGet,
	},

	'pipelines.list': {
		input: CircleCIEndpointInputSchemas.pipelinesList,
		output: CircleCIEndpointOutputSchemas.pipelinesList,
	},
	'pipelines.listForProject': {
		input: CircleCIEndpointInputSchemas.pipelinesListForProject,
		output: CircleCIEndpointOutputSchemas.pipelinesListForProject,
	},
	'pipelines.getConfig': {
		input: CircleCIEndpointInputSchemas.pipelinesGetConfig,
		output: CircleCIEndpointOutputSchemas.pipelinesGetConfig,
	},
	'pipelines.trigger': {
		input: CircleCIEndpointInputSchemas.pipelinesTrigger,
		output: CircleCIEndpointOutputSchemas.pipelinesTrigger,
	},

	'pipelineDefinitions.get': {
		input: CircleCIEndpointInputSchemas.pipelineDefinitionsGet,
		output: CircleCIEndpointOutputSchemas.pipelineDefinitionsGet,
	},
	'pipelineDefinitions.list': {
		input: CircleCIEndpointInputSchemas.pipelineDefinitionsList,
		output: CircleCIEndpointOutputSchemas.pipelineDefinitionsList,
	},

	'workflows.listByPipelineId': {
		input: CircleCIEndpointInputSchemas.workflowsListByPipelineId,
		output: CircleCIEndpointOutputSchemas.workflowsListByPipelineId,
	},
	'workflows.getSummary': {
		input: CircleCIEndpointInputSchemas.workflowsGetSummary,
		output: CircleCIEndpointOutputSchemas.workflowsGetSummary,
	},
	'workflows.listJobs': {
		input: CircleCIEndpointInputSchemas.workflowsListJobs,
		output: CircleCIEndpointOutputSchemas.workflowsListJobs,
	},
	'workflows.listTestMetrics': {
		input: CircleCIEndpointInputSchemas.workflowsListTestMetrics,
		output: CircleCIEndpointOutputSchemas.workflowsListTestMetrics,
	},

	'insights.flakyTests': {
		input: CircleCIEndpointInputSchemas.insightsFlakyTests,
		output: CircleCIEndpointOutputSchemas.insightsFlakyTests,
	},
	'insights.projectWorkflows': {
		input: CircleCIEndpointInputSchemas.insightsProjectWorkflows,
		output: CircleCIEndpointOutputSchemas.insightsProjectWorkflows,
	},
	'insights.pagesSummary': {
		input: CircleCIEndpointInputSchemas.insightsPagesSummary,
		output: CircleCIEndpointOutputSchemas.insightsPagesSummary,
	},
	'insights.branches': {
		input: CircleCIEndpointInputSchemas.insightsBranches,
		output: CircleCIEndpointOutputSchemas.insightsBranches,
	},
	'insights.orgSummary': {
		input: CircleCIEndpointInputSchemas.insightsOrgSummary,
		output: CircleCIEndpointOutputSchemas.insightsOrgSummary,
	},
	'insights.planMetrics': {
		input: CircleCIEndpointInputSchemas.insightsPlanMetrics,
		output: CircleCIEndpointOutputSchemas.insightsPlanMetrics,
	},

	'jobs.getDetails': {
		input: CircleCIEndpointInputSchemas.jobsGetDetails,
		output: CircleCIEndpointOutputSchemas.jobsGetDetails,
	},
	'jobs.getArtifacts': {
		input: CircleCIEndpointInputSchemas.jobsGetArtifacts,
		output: CircleCIEndpointOutputSchemas.jobsGetArtifacts,
	},
	'jobs.getTestMetadata': {
		input: CircleCIEndpointInputSchemas.jobsGetTestMetadata,
		output: CircleCIEndpointOutputSchemas.jobsGetTestMetadata,
	},

	'user.getCurrent': {
		input: CircleCIEndpointInputSchemas.userGetCurrent,
		output: CircleCIEndpointOutputSchemas.userGetCurrent,
	},
	'user.getInfo': {
		input: CircleCIEndpointInputSchemas.userGetInfo,
		output: CircleCIEndpointOutputSchemas.userGetInfo,
	},
	'user.listCollaborations': {
		input: CircleCIEndpointInputSchemas.userListCollaborations,
		output: CircleCIEndpointOutputSchemas.userListCollaborations,
	},

	'organization.get': {
		input: CircleCIEndpointInputSchemas.organizationGet,
		output: CircleCIEndpointOutputSchemas.organizationGet,
	},

	'namespace.queryExists': {
		input: CircleCIEndpointInputSchemas.namespaceQueryExists,
		output: CircleCIEndpointOutputSchemas.namespaceQueryExists,
	},
	'namespace.delete': {
		input: CircleCIEndpointInputSchemas.namespaceDelete,
		output: CircleCIEndpointOutputSchemas.namespaceDelete,
	},
	'namespace.rename': {
		input: CircleCIEndpointInputSchemas.namespaceRename,
		output: CircleCIEndpointOutputSchemas.namespaceRename,
	},
	'namespace.deleteAlias': {
		input: CircleCIEndpointInputSchemas.namespaceDeleteAlias,
		output: CircleCIEndpointOutputSchemas.namespaceDeleteAlias,
	},

	'orbs.getDetails': {
		input: CircleCIEndpointInputSchemas.orbGetDetails,
		output: CircleCIEndpointOutputSchemas.orbGetDetails,
	},
	'orbs.getVersion': {
		input: CircleCIEndpointInputSchemas.orbGetVersion,
		output: CircleCIEndpointOutputSchemas.orbGetVersion,
	},
	'orbs.queryId': {
		input: CircleCIEndpointInputSchemas.orbQueryId,
		output: CircleCIEndpointOutputSchemas.orbQueryId,
	},
	'orbs.queryExists': {
		input: CircleCIEndpointInputSchemas.orbQueryExists,
		output: CircleCIEndpointOutputSchemas.orbQueryExists,
	},
	'orbs.queryLatestVersion': {
		input: CircleCIEndpointInputSchemas.orbQueryLatestVersion,
		output: CircleCIEndpointOutputSchemas.orbQueryLatestVersion,
	},
	'orbs.querySource': {
		input: CircleCIEndpointInputSchemas.orbQuerySource,
		output: CircleCIEndpointOutputSchemas.orbQuerySource,
	},
	'orbs.listOrbs': {
		input: CircleCIEndpointInputSchemas.orbListOrbs,
		output: CircleCIEndpointOutputSchemas.orbListOrbs,
	},
	'orbs.listCategories': {
		input: CircleCIEndpointInputSchemas.orbListCategories,
		output: CircleCIEndpointOutputSchemas.orbListCategories,
	},
	'orbs.queryCategoryId': {
		input: CircleCIEndpointInputSchemas.orbQueryCategoryId,
		output: CircleCIEndpointOutputSchemas.orbQueryCategoryId,
	},
	'orbs.listNamespaceOrbs': {
		input: CircleCIEndpointInputSchemas.orbListNamespaceOrbs,
		output: CircleCIEndpointOutputSchemas.orbListNamespaceOrbs,
	},
	'orbs.validateConfig': {
		input: CircleCIEndpointInputSchemas.orbValidateConfig,
		output: CircleCIEndpointOutputSchemas.orbValidateConfig,
	},

	'runners.list': {
		input: CircleCIEndpointInputSchemas.runnersList,
		output: CircleCIEndpointOutputSchemas.runnersList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof circleCIEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

/**
 * Risk levels.
 *
 * `destructive` for anything CircleCI cannot undo: deleting a context,
 * project, group, namespace (and all its orbs), or a chat/restriction row -
 * none of these have a soft-delete or a trash. `write` covers everything else
 * that changes state. `pipelines.trigger` is `write` rather than `read`
 * despite looking like it just "kicks off" something - it is the one
 * operation whose replay changes the outcome (starts another run), the same
 * reasoning as Habitica's task-score endpoint.
 */
export const circleCIEndpointMeta = {
	'contexts.create': {
		riskLevel: 'write',
		description: 'Create a context (REST)',
	},
	'contexts.get': {
		riskLevel: 'read',
		description: 'Retrieve a context by id',
	},
	'contexts.listEnvVars': {
		riskLevel: 'read',
		description: "List a context's environment variables",
	},
	'contexts.upsertEnvVar': {
		riskLevel: 'write',
		description: 'Add or update a context environment variable (REST)',
	},
	'contexts.createRestriction': {
		riskLevel: 'write',
		description: 'Add a restriction to a context',
	},
	'contexts.deleteRestriction': {
		riskLevel: 'destructive',
		description: 'Remove a restriction from a context',
	},

	'contextsGraphQL.create': {
		riskLevel: 'write',
		description: 'Create a context (GraphQL)',
	},
	'contextsGraphQL.delete': {
		riskLevel: 'destructive',
		description:
			'Permanently delete a context and its environment variables (GraphQL)',
	},
	'contextsGraphQL.query': {
		riskLevel: 'read',
		description: 'Retrieve a context by id (GraphQL)',
	},
	'contextsGraphQL.storeEnvVar': {
		riskLevel: 'write',
		description: 'Add or update a context environment variable (GraphQL)',
	},
	'contextsGraphQL.removeEnvVar': {
		riskLevel: 'destructive',
		description: 'Remove a context environment variable (GraphQL)',
	},

	'groups.create': {
		riskLevel: 'write',
		description: 'Create an organization group',
	},
	'groups.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete an organization group',
	},
	'groups.get': {
		riskLevel: 'read',
		description: 'Retrieve an organization group',
	},
	'groups.list': {
		riskLevel: 'read',
		description: "List an organization's groups",
	},

	'orbAllowlist.create': {
		riskLevel: 'write',
		description: 'Add a URL orb allow-list entry',
	},
	'orbAllowlist.delete': {
		riskLevel: 'destructive',
		description: 'Remove a URL orb allow-list entry',
	},

	'projects.create': {
		riskLevel: 'write',
		description: 'Follow a repository as a new project',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		description: 'Permanently remove a project and its settings',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Retrieve a project by slug',
	},

	'projectEnvVars.create': {
		riskLevel: 'write',
		description: 'Create a project environment variable',
	},
	'projectEnvVars.delete': {
		riskLevel: 'destructive',
		description: 'Delete a project environment variable',
	},
	'projectEnvVars.list': {
		riskLevel: 'read',
		description: "List a project's environment variables",
	},

	'schedules.list': {
		riskLevel: 'read',
		description: "List a project's scheduled pipeline triggers",
	},

	'usageExport.create': {
		riskLevel: 'write',
		description: 'Create a usage export job',
	},
	'usageExport.get': {
		riskLevel: 'read',
		description: 'Retrieve a usage export job',
	},

	'pipelines.list': {
		riskLevel: 'read',
		description: 'List pipelines for an organization',
	},
	'pipelines.listForProject': {
		riskLevel: 'read',
		description: "List a project's pipelines",
	},
	'pipelines.getConfig': {
		riskLevel: 'read',
		description: "Fetch a pipeline's config",
	},
	'pipelines.trigger': {
		riskLevel: 'write',
		description: 'Start a new pipeline run on a branch or tag',
	},

	'pipelineDefinitions.get': {
		riskLevel: 'read',
		description: 'Retrieve a pipeline definition',
	},
	'pipelineDefinitions.list': {
		riskLevel: 'read',
		description: "List a project's pipeline definitions",
	},

	'workflows.listByPipelineId': {
		riskLevel: 'read',
		description: "List a pipeline's workflows",
	},
	'workflows.getSummary': {
		riskLevel: 'read',
		description: 'Get metrics and trends for a workflow',
	},
	'workflows.listJobs': {
		riskLevel: 'read',
		description: "Get summary metrics for a workflow's jobs",
	},
	'workflows.listTestMetrics': {
		riskLevel: 'read',
		description: 'Get test metrics for a workflow',
	},

	'insights.flakyTests': {
		riskLevel: 'read',
		description: 'Get flaky tests for a project',
	},
	'insights.projectWorkflows': {
		riskLevel: 'read',
		description: "Get summary metrics for all of a project's workflows",
	},
	'insights.pagesSummary': {
		riskLevel: 'read',
		description: 'Get summary metrics and trends for a project',
	},
	'insights.branches': {
		riskLevel: 'read',
		description: 'List branches with workflow runs',
	},
	'insights.orgSummary': {
		riskLevel: 'read',
		description: 'Get org-wide summary metrics with trends',
	},
	'insights.planMetrics': {
		riskLevel: 'read',
		description:
			'Get plan/credit-usage metrics by project and org for a date range (same route as insights.orgSummary)',
	},

	'jobs.getDetails': {
		riskLevel: 'read',
		description: "Fetch a job's status, timing and executor by number",
	},
	'jobs.getArtifacts': {
		riskLevel: 'read',
		description: "List a job's stored artifacts by number",
	},
	'jobs.getTestMetadata': {
		riskLevel: 'read',
		description: "Fetch a job's stored test results by number",
	},

	'user.getCurrent': {
		riskLevel: 'read',
		description: "Read the authenticated user's own profile",
	},
	'user.getInfo': {
		riskLevel: 'read',
		description: "Read another user's profile by id",
	},
	'user.listCollaborations': {
		riskLevel: 'read',
		description: 'List organizations the caller can collaborate on',
	},

	'organization.get': {
		riskLevel: 'read',
		description: 'Retrieve an organization by id (GraphQL)',
	},

	'namespace.queryExists': {
		riskLevel: 'read',
		description: 'Check whether a namespace name exists',
	},
	'namespace.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a namespace and all its orbs',
	},
	'namespace.rename': { riskLevel: 'write', description: 'Rename a namespace' },
	'namespace.deleteAlias': {
		riskLevel: 'destructive',
		description: 'Remove a namespace alias (GraphQL)',
	},

	'orbs.getDetails': {
		riskLevel: 'read',
		description: "Fetch an orb's metadata and versions",
	},
	'orbs.getVersion': {
		riskLevel: 'read',
		description: 'Fetch one orb version',
	},
	'orbs.queryId': {
		riskLevel: 'read',
		description: "Fetch an orb's id by name",
	},
	'orbs.queryExists': {
		riskLevel: 'read',
		description: 'Check whether an orb exists',
	},
	'orbs.queryLatestVersion': {
		riskLevel: 'read',
		description: "Fetch an orb's latest published version",
	},
	'orbs.querySource': {
		riskLevel: 'read',
		description: "Fetch an orb version's source YAML",
	},
	'orbs.listOrbs': {
		riskLevel: 'read',
		description: 'List orbs across the registry',
	},
	'orbs.listCategories': {
		riskLevel: 'read',
		description: 'List orb categories',
	},
	'orbs.queryCategoryId': {
		riskLevel: 'read',
		description: "Fetch a category's id by name",
	},
	'orbs.listNamespaceOrbs': {
		riskLevel: 'read',
		description: 'List orbs in a namespace',
	},
	'orbs.validateConfig': {
		riskLevel: 'read',
		description: 'Validate orb YAML',
	},

	'runners.list': {
		riskLevel: 'read',
		description: 'List self-hosted runners',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof circleCIEndpointsNested>;

export type BaseCircleCIPlugin<T extends CircleCIPluginOptions> = CorsairPlugin<
	'circleci',
	typeof CircleCISchema,
	typeof circleCIEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalCircleCIPlugin = BaseCircleCIPlugin<CircleCIPluginOptions>;

export type ExternalCircleCIPlugin<T extends CircleCIPluginOptions> =
	BaseCircleCIPlugin<T>;

/**
 * The CircleCI plugin.
 *
 * **No webhooks.** The catalog lists no triggers, and CircleCI's own webhook
 * feature (event delivery for pipeline/workflow completion) is not part of
 * the 65 catalog operations at all - unlike Habitica, this integration does
 * not even expose webhook management as ordinary operations, because the
 * catalog never asked for it.
 *
 * **Four transports, one credential.** See `client.ts` for the full account:
 * REST v2 (documented), REST v3 (orbs/namespaces/jobs/runners, undocumented
 * but confirmed live from `circleci-cli`'s own source), GraphQL
 * (`graphql-unstable`, introspection disabled, confirmed live by reading
 * error messages), and legacy v1.1 (the only transport that resolves a job by
 * its plain number). One personal API token authenticates all four.
 */
export function circleci<const T extends CircleCIPluginOptions>(
	incomingOptions: CircleCIPluginOptions & T = {} as CircleCIPluginOptions & T,
): ExternalCircleCIPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'circleci',
		authConfig: circleCIAuthConfig,
		schema: CircleCISchema,
		options: options,
		hooks: options.hooks,
		endpoints: circleCIEndpointsNested,
		webhooks: {},
		endpointMeta: circleCIEndpointMeta,
		endpointSchemas: circleCIEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CircleCIKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}
			return '';
		},
	} satisfies InternalCircleCIPlugin;
}

export type {
	CircleCIEndpointInputs,
	CircleCIEndpointOutputs,
} from './endpoints/types';
