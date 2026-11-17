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
import { AuthMissingError } from 'corsair/core';
import {
	AccessTokens,
	AccountMembers,
	AuditLog,
	Contexts,
	CustomRoles,
	Environments,
	FeatureFlags,
	Projects,
	Root,
	Segments,
	Tags,
	Teams,
	Users,
} from './endpoints';
import type {
	LaunchDarklyEndpointInputs,
	LaunchDarklyEndpointOutputs,
} from './endpoints/types';
import {
	LaunchDarklyEndpointInputSchemas,
	LaunchDarklyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { LaunchDarklySchema } from './schema';

export type LaunchDarklyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalLaunchDarklyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof launchdarklyEndpointsNested>;
};

export type LaunchDarklyContext = CorsairPluginContext<
	typeof LaunchDarklySchema,
	LaunchDarklyPluginOptions
>;

export type LaunchDarklyKeyBuilderContext =
	KeyBuilderContext<LaunchDarklyPluginOptions>;

export type LaunchDarklyBoundEndpoints = BindEndpoints<
	typeof launchdarklyEndpointsNested
>;

type LaunchDarklyEndpoint<K extends keyof LaunchDarklyEndpointOutputs> =
	CorsairEndpoint<
		LaunchDarklyContext,
		LaunchDarklyEndpointInputs[K],
		LaunchDarklyEndpointOutputs[K]
	>;

export type LaunchDarklyEndpoints = {
	projectsList: LaunchDarklyEndpoint<'projectsList'>;
	projectsGet: LaunchDarklyEndpoint<'projectsGet'>;
	projectsCreate: LaunchDarklyEndpoint<'projectsCreate'>;
	projectsUpdate: LaunchDarklyEndpoint<'projectsUpdate'>;
	projectsDelete: LaunchDarklyEndpoint<'projectsDelete'>;

	environmentsList: LaunchDarklyEndpoint<'environmentsList'>;
	environmentsGet: LaunchDarklyEndpoint<'environmentsGet'>;
	environmentsCreate: LaunchDarklyEndpoint<'environmentsCreate'>;
	environmentsUpdate: LaunchDarklyEndpoint<'environmentsUpdate'>;
	environmentsDelete: LaunchDarklyEndpoint<'environmentsDelete'>;
	environmentsResetSdkKey: LaunchDarklyEndpoint<'environmentsResetSdkKey'>;
	environmentsResetMobileKey: LaunchDarklyEndpoint<'environmentsResetMobileKey'>;

	featureFlagsList: LaunchDarklyEndpoint<'featureFlagsList'>;
	featureFlagsGet: LaunchDarklyEndpoint<'featureFlagsGet'>;
	featureFlagsCreate: LaunchDarklyEndpoint<'featureFlagsCreate'>;
	featureFlagsUpdate: LaunchDarklyEndpoint<'featureFlagsUpdate'>;
	featureFlagsDelete: LaunchDarklyEndpoint<'featureFlagsDelete'>;
	featureFlagsGetStatus: LaunchDarklyEndpoint<'featureFlagsGetStatus'>;
	featureFlagsListStatuses: LaunchDarklyEndpoint<'featureFlagsListStatuses'>;

	segmentsList: LaunchDarklyEndpoint<'segmentsList'>;
	segmentsGet: LaunchDarklyEndpoint<'segmentsGet'>;
	segmentsCreate: LaunchDarklyEndpoint<'segmentsCreate'>;
	segmentsUpdate: LaunchDarklyEndpoint<'segmentsUpdate'>;
	segmentsDelete: LaunchDarklyEndpoint<'segmentsDelete'>;

	auditLogList: LaunchDarklyEndpoint<'auditLogList'>;
	auditLogGet: LaunchDarklyEndpoint<'auditLogGet'>;

	accountMembersList: LaunchDarklyEndpoint<'accountMembersList'>;
	accountMembersGet: LaunchDarklyEndpoint<'accountMembersGet'>;
	accountMembersInvite: LaunchDarklyEndpoint<'accountMembersInvite'>;
	accountMembersUpdate: LaunchDarklyEndpoint<'accountMembersUpdate'>;
	accountMembersDelete: LaunchDarklyEndpoint<'accountMembersDelete'>;

	teamsList: LaunchDarklyEndpoint<'teamsList'>;
	teamsGet: LaunchDarklyEndpoint<'teamsGet'>;
	teamsCreate: LaunchDarklyEndpoint<'teamsCreate'>;
	teamsUpdate: LaunchDarklyEndpoint<'teamsUpdate'>;
	teamsDelete: LaunchDarklyEndpoint<'teamsDelete'>;

	customRolesList: LaunchDarklyEndpoint<'customRolesList'>;
	customRolesGet: LaunchDarklyEndpoint<'customRolesGet'>;
	customRolesCreate: LaunchDarklyEndpoint<'customRolesCreate'>;
	customRolesUpdate: LaunchDarklyEndpoint<'customRolesUpdate'>;
	customRolesDelete: LaunchDarklyEndpoint<'customRolesDelete'>;

	contextsSearch: LaunchDarklyEndpoint<'contextsSearch'>;
	contextsGet: LaunchDarklyEndpoint<'contextsGet'>;
	contextsListKinds: LaunchDarklyEndpoint<'contextsListKinds'>;

	usersList: LaunchDarklyEndpoint<'usersList'>;
	usersGet: LaunchDarklyEndpoint<'usersGet'>;
	usersSearch: LaunchDarklyEndpoint<'usersSearch'>;

	accessTokensList: LaunchDarklyEndpoint<'accessTokensList'>;
	accessTokensGet: LaunchDarklyEndpoint<'accessTokensGet'>;
	accessTokensCreate: LaunchDarklyEndpoint<'accessTokensCreate'>;
	accessTokensDelete: LaunchDarklyEndpoint<'accessTokensDelete'>;

	tagsList: LaunchDarklyEndpoint<'tagsList'>;

	rootGet: LaunchDarklyEndpoint<'rootGet'>;
};

export const launchdarklyEndpointsNested = {
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		update: Projects.update,
		delete: Projects.delete,
	},
	environments: {
		list: Environments.list,
		get: Environments.get,
		create: Environments.create,
		update: Environments.update,
		delete: Environments.delete,
		resetSdkKey: Environments.resetSdkKey,
		resetMobileKey: Environments.resetMobileKey,
	},
	featureFlags: {
		list: FeatureFlags.list,
		get: FeatureFlags.get,
		create: FeatureFlags.create,
		update: FeatureFlags.update,
		delete: FeatureFlags.delete,
		getStatus: FeatureFlags.getStatus,
		listStatuses: FeatureFlags.listStatuses,
	},
	segments: {
		list: Segments.list,
		get: Segments.get,
		create: Segments.create,
		update: Segments.update,
		delete: Segments.delete,
	},
	auditLog: {
		list: AuditLog.list,
		get: AuditLog.get,
	},
	accountMembers: {
		list: AccountMembers.list,
		get: AccountMembers.get,
		invite: AccountMembers.invite,
		update: AccountMembers.update,
		delete: AccountMembers.delete,
	},
	teams: {
		list: Teams.list,
		get: Teams.get,
		create: Teams.create,
		update: Teams.update,
		delete: Teams.delete,
	},
	customRoles: {
		list: CustomRoles.list,
		get: CustomRoles.get,
		create: CustomRoles.create,
		update: CustomRoles.update,
		delete: CustomRoles.delete,
	},
	contexts: {
		search: Contexts.search,
		get: Contexts.get,
		listKinds: Contexts.listKinds,
	},
	users: {
		list: Users.list,
		get: Users.get,
		search: Users.search,
	},
	accessTokens: {
		list: AccessTokens.list,
		get: AccessTokens.get,
		create: AccessTokens.create,
		delete: AccessTokens.delete,
	},
	tags: {
		list: Tags.list,
	},
	root: {
		get: Root.get,
	},
} as const;

export const launchdarklyEndpointSchemas = {
	'projects.list': {
		input: LaunchDarklyEndpointInputSchemas.projectsList,
		output: LaunchDarklyEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: LaunchDarklyEndpointInputSchemas.projectsGet,
		output: LaunchDarklyEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: LaunchDarklyEndpointInputSchemas.projectsCreate,
		output: LaunchDarklyEndpointOutputSchemas.projectsCreate,
	},
	'projects.update': {
		input: LaunchDarklyEndpointInputSchemas.projectsUpdate,
		output: LaunchDarklyEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: LaunchDarklyEndpointInputSchemas.projectsDelete,
		output: LaunchDarklyEndpointOutputSchemas.projectsDelete,
	},

	'environments.list': {
		input: LaunchDarklyEndpointInputSchemas.environmentsList,
		output: LaunchDarklyEndpointOutputSchemas.environmentsList,
	},
	'environments.get': {
		input: LaunchDarklyEndpointInputSchemas.environmentsGet,
		output: LaunchDarklyEndpointOutputSchemas.environmentsGet,
	},
	'environments.create': {
		input: LaunchDarklyEndpointInputSchemas.environmentsCreate,
		output: LaunchDarklyEndpointOutputSchemas.environmentsCreate,
	},
	'environments.update': {
		input: LaunchDarklyEndpointInputSchemas.environmentsUpdate,
		output: LaunchDarklyEndpointOutputSchemas.environmentsUpdate,
	},
	'environments.delete': {
		input: LaunchDarklyEndpointInputSchemas.environmentsDelete,
		output: LaunchDarklyEndpointOutputSchemas.environmentsDelete,
	},
	'environments.resetSdkKey': {
		input: LaunchDarklyEndpointInputSchemas.environmentsResetSdkKey,
		output: LaunchDarklyEndpointOutputSchemas.environmentsResetSdkKey,
	},
	'environments.resetMobileKey': {
		input: LaunchDarklyEndpointInputSchemas.environmentsResetMobileKey,
		output: LaunchDarklyEndpointOutputSchemas.environmentsResetMobileKey,
	},

	'featureFlags.list': {
		input: LaunchDarklyEndpointInputSchemas.featureFlagsList,
		output: LaunchDarklyEndpointOutputSchemas.featureFlagsList,
	},
	'featureFlags.get': {
		input: LaunchDarklyEndpointInputSchemas.featureFlagsGet,
		output: LaunchDarklyEndpointOutputSchemas.featureFlagsGet,
	},
	'featureFlags.create': {
		input: LaunchDarklyEndpointInputSchemas.featureFlagsCreate,
		output: LaunchDarklyEndpointOutputSchemas.featureFlagsCreate,
	},
	'featureFlags.update': {
		input: LaunchDarklyEndpointInputSchemas.featureFlagsUpdate,
		output: LaunchDarklyEndpointOutputSchemas.featureFlagsUpdate,
	},
	'featureFlags.delete': {
		input: LaunchDarklyEndpointInputSchemas.featureFlagsDelete,
		output: LaunchDarklyEndpointOutputSchemas.featureFlagsDelete,
	},
	'featureFlags.getStatus': {
		input: LaunchDarklyEndpointInputSchemas.featureFlagsGetStatus,
		output: LaunchDarklyEndpointOutputSchemas.featureFlagsGetStatus,
	},
	'featureFlags.listStatuses': {
		input: LaunchDarklyEndpointInputSchemas.featureFlagsListStatuses,
		output: LaunchDarklyEndpointOutputSchemas.featureFlagsListStatuses,
	},

	'segments.list': {
		input: LaunchDarklyEndpointInputSchemas.segmentsList,
		output: LaunchDarklyEndpointOutputSchemas.segmentsList,
	},
	'segments.get': {
		input: LaunchDarklyEndpointInputSchemas.segmentsGet,
		output: LaunchDarklyEndpointOutputSchemas.segmentsGet,
	},
	'segments.create': {
		input: LaunchDarklyEndpointInputSchemas.segmentsCreate,
		output: LaunchDarklyEndpointOutputSchemas.segmentsCreate,
	},
	'segments.update': {
		input: LaunchDarklyEndpointInputSchemas.segmentsUpdate,
		output: LaunchDarklyEndpointOutputSchemas.segmentsUpdate,
	},
	'segments.delete': {
		input: LaunchDarklyEndpointInputSchemas.segmentsDelete,
		output: LaunchDarklyEndpointOutputSchemas.segmentsDelete,
	},

	'auditLog.list': {
		input: LaunchDarklyEndpointInputSchemas.auditLogList,
		output: LaunchDarklyEndpointOutputSchemas.auditLogList,
	},
	'auditLog.get': {
		input: LaunchDarklyEndpointInputSchemas.auditLogGet,
		output: LaunchDarklyEndpointOutputSchemas.auditLogGet,
	},

	'accountMembers.list': {
		input: LaunchDarklyEndpointInputSchemas.accountMembersList,
		output: LaunchDarklyEndpointOutputSchemas.accountMembersList,
	},
	'accountMembers.get': {
		input: LaunchDarklyEndpointInputSchemas.accountMembersGet,
		output: LaunchDarklyEndpointOutputSchemas.accountMembersGet,
	},
	'accountMembers.invite': {
		input: LaunchDarklyEndpointInputSchemas.accountMembersInvite,
		output: LaunchDarklyEndpointOutputSchemas.accountMembersInvite,
	},
	'accountMembers.update': {
		input: LaunchDarklyEndpointInputSchemas.accountMembersUpdate,
		output: LaunchDarklyEndpointOutputSchemas.accountMembersUpdate,
	},
	'accountMembers.delete': {
		input: LaunchDarklyEndpointInputSchemas.accountMembersDelete,
		output: LaunchDarklyEndpointOutputSchemas.accountMembersDelete,
	},

	'teams.list': {
		input: LaunchDarklyEndpointInputSchemas.teamsList,
		output: LaunchDarklyEndpointOutputSchemas.teamsList,
	},
	'teams.get': {
		input: LaunchDarklyEndpointInputSchemas.teamsGet,
		output: LaunchDarklyEndpointOutputSchemas.teamsGet,
	},
	'teams.create': {
		input: LaunchDarklyEndpointInputSchemas.teamsCreate,
		output: LaunchDarklyEndpointOutputSchemas.teamsCreate,
	},
	'teams.update': {
		input: LaunchDarklyEndpointInputSchemas.teamsUpdate,
		output: LaunchDarklyEndpointOutputSchemas.teamsUpdate,
	},
	'teams.delete': {
		input: LaunchDarklyEndpointInputSchemas.teamsDelete,
		output: LaunchDarklyEndpointOutputSchemas.teamsDelete,
	},

	'customRoles.list': {
		input: LaunchDarklyEndpointInputSchemas.customRolesList,
		output: LaunchDarklyEndpointOutputSchemas.customRolesList,
	},
	'customRoles.get': {
		input: LaunchDarklyEndpointInputSchemas.customRolesGet,
		output: LaunchDarklyEndpointOutputSchemas.customRolesGet,
	},
	'customRoles.create': {
		input: LaunchDarklyEndpointInputSchemas.customRolesCreate,
		output: LaunchDarklyEndpointOutputSchemas.customRolesCreate,
	},
	'customRoles.update': {
		input: LaunchDarklyEndpointInputSchemas.customRolesUpdate,
		output: LaunchDarklyEndpointOutputSchemas.customRolesUpdate,
	},
	'customRoles.delete': {
		input: LaunchDarklyEndpointInputSchemas.customRolesDelete,
		output: LaunchDarklyEndpointOutputSchemas.customRolesDelete,
	},

	'contexts.search': {
		input: LaunchDarklyEndpointInputSchemas.contextsSearch,
		output: LaunchDarklyEndpointOutputSchemas.contextsSearch,
	},
	'contexts.get': {
		input: LaunchDarklyEndpointInputSchemas.contextsGet,
		output: LaunchDarklyEndpointOutputSchemas.contextsGet,
	},
	'contexts.listKinds': {
		input: LaunchDarklyEndpointInputSchemas.contextsListKinds,
		output: LaunchDarklyEndpointOutputSchemas.contextsListKinds,
	},

	'users.list': {
		input: LaunchDarklyEndpointInputSchemas.usersList,
		output: LaunchDarklyEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: LaunchDarklyEndpointInputSchemas.usersGet,
		output: LaunchDarklyEndpointOutputSchemas.usersGet,
	},
	'users.search': {
		input: LaunchDarklyEndpointInputSchemas.usersSearch,
		output: LaunchDarklyEndpointOutputSchemas.usersSearch,
	},

	'accessTokens.list': {
		input: LaunchDarklyEndpointInputSchemas.accessTokensList,
		output: LaunchDarklyEndpointOutputSchemas.accessTokensList,
	},
	'accessTokens.get': {
		input: LaunchDarklyEndpointInputSchemas.accessTokensGet,
		output: LaunchDarklyEndpointOutputSchemas.accessTokensGet,
	},
	'accessTokens.create': {
		input: LaunchDarklyEndpointInputSchemas.accessTokensCreate,
		output: LaunchDarklyEndpointOutputSchemas.accessTokensCreate,
	},
	'accessTokens.delete': {
		input: LaunchDarklyEndpointInputSchemas.accessTokensDelete,
		output: LaunchDarklyEndpointOutputSchemas.accessTokensDelete,
	},

	'tags.list': {
		input: LaunchDarklyEndpointInputSchemas.tagsList,
		output: LaunchDarklyEndpointOutputSchemas.tagsList,
	},

	'root.get': {
		input: LaunchDarklyEndpointInputSchemas.rootGet,
		output: LaunchDarklyEndpointOutputSchemas.rootGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof launchdarklyEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const launchdarklyEndpointMeta = {
	'projects.list': {
		riskLevel: 'read',
		description: 'List all projects in the account',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get details of a specific project by project key',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a new project',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Update project configuration via JSON Patch',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a project',
	},

	'environments.list': {
		riskLevel: 'read',
		description: 'List all environments in a project',
	},
	'environments.get': {
		riskLevel: 'read',
		description: 'Get details of a specific environment',
	},
	'environments.create': {
		riskLevel: 'write',
		description: 'Create a new environment in a project',
	},
	'environments.update': {
		// Environment settings (approvals, secure mode, TTL) change how live SDKs behave.
		riskLevel: 'destructive',
		description: 'Update environment configuration via JSON Patch',
	},
	'environments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete an environment',
	},
	'environments.resetSdkKey': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Reset the SDK key for an environment',
	},
	'environments.resetMobileKey': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Reset the mobile key for an environment',
	},

	'featureFlags.list': {
		riskLevel: 'read',
		description: 'List feature flags in a project',
	},
	'featureFlags.get': {
		riskLevel: 'read',
		description: 'Get details of a feature flag',
	},
	'featureFlags.create': {
		riskLevel: 'write',
		description: 'Create a new feature flag in a project',
	},
	'featureFlags.update': {
		// Toggling a flag or changing its targeting changes what the customer's production app serves.
		riskLevel: 'destructive',
		description:
			'Update feature flag rules and variations via JSON Patch (turning a flag on or off, or changing targeting, changes what live apps serve)',
	},
	'featureFlags.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a feature flag',
	},
	'featureFlags.getStatus': {
		riskLevel: 'read',
		description: 'Get the status of a feature flag in an environment',
	},
	'featureFlags.listStatuses': {
		riskLevel: 'read',
		description: 'List statuses for all feature flags in an environment',
	},

	'segments.list': {
		riskLevel: 'read',
		description: 'List user segments in an environment',
	},
	'segments.get': {
		riskLevel: 'read',
		description: 'Get details of a user segment',
	},
	'segments.create': {
		riskLevel: 'write',
		description: 'Create a new user segment',
	},
	'segments.update': {
		// Segments feed flag targeting, so editing one changes who gets which variation.
		riskLevel: 'destructive',
		description:
			'Update user segment rules via JSON Patch (changes who flags that use the segment target)',
	},
	'segments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a user segment',
	},

	'auditLog.list': {
		riskLevel: 'read',
		description: 'List recent audit log entries in the account',
	},
	'auditLog.get': {
		riskLevel: 'read',
		description: 'Get a specific audit log entry by ID',
	},

	'accountMembers.list': {
		riskLevel: 'read',
		description: 'List all account members',
	},
	'accountMembers.get': {
		riskLevel: 'read',
		description: 'Get details of an account member by ID',
	},
	'accountMembers.invite': {
		riskLevel: 'destructive',
		description: 'Invite new members to the account',
	},
	'accountMembers.update': {
		riskLevel: 'write',
		description: 'Update an account member role or permissions via JSON Patch',
	},
	'accountMembers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove an account member from the account',
	},

	'teams.list': {
		riskLevel: 'read',
		description: 'List teams in the account',
	},
	'teams.get': {
		riskLevel: 'read',
		description: 'Get details of a team by key',
	},
	'teams.create': {
		riskLevel: 'write',
		description: 'Create a new team',
	},
	'teams.update': {
		riskLevel: 'write',
		description: 'Update a team via semantic instructions',
	},
	'teams.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a team',
	},

	'customRoles.list': {
		riskLevel: 'read',
		description: 'List custom roles in the account',
	},
	'customRoles.get': {
		riskLevel: 'read',
		description: 'Get a custom role by key',
	},
	'customRoles.create': {
		riskLevel: 'write',
		description: 'Create a new custom role',
	},
	'customRoles.update': {
		riskLevel: 'write',
		description: 'Update a custom role policy via JSON Patch',
	},
	'customRoles.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a custom role',
	},

	'contexts.search': {
		riskLevel: 'read',
		description: 'Search for evaluation contexts in an environment',
	},
	'contexts.get': {
		riskLevel: 'read',
		description: 'Get evaluation context by kind and key',
	},
	'contexts.listKinds': {
		riskLevel: 'read',
		description: 'List context kinds defined in a project',
	},

	'users.list': {
		riskLevel: 'read',
		description:
			'List users in an environment (deprecated by LaunchDarkly; accounts on contexts answer 404, use contexts.search)',
	},
	'users.get': {
		riskLevel: 'read',
		description:
			'Get user record in an environment by user key (deprecated by LaunchDarkly; accounts on contexts answer 404, use contexts.get)',
	},
	'users.search': {
		riskLevel: 'read',
		description:
			'Search users in an environment by query string (deprecated by LaunchDarkly; accounts on contexts answer 404, use contexts.search)',
	},

	'accessTokens.list': {
		riskLevel: 'read',
		description: 'List access tokens in the account',
	},
	'accessTokens.get': {
		riskLevel: 'read',
		description: 'Get details of an access token by ID',
	},
	'accessTokens.create': {
		// Returns a new API credential with up to the caller's own permissions.
		riskLevel: 'destructive',
		description: 'Create a new personal or service access token',
	},
	'accessTokens.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Revoke and delete an access token',
	},

	'tags.list': {
		riskLevel: 'read',
		description: 'List tags across resources in the account',
	},

	'root.get': {
		riskLevel: 'read',
		description: 'Get LaunchDarkly root API metadata and resource links',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof launchdarklyEndpointsNested
>;

export const launchdarklyAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseLaunchDarklyPlugin<T extends LaunchDarklyPluginOptions> =
	CorsairPlugin<
		'launchdarkly',
		typeof LaunchDarklySchema,
		typeof launchdarklyEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalLaunchDarklyPlugin =
	BaseLaunchDarklyPlugin<LaunchDarklyPluginOptions>;

export type ExternalLaunchDarklyPlugin<T extends LaunchDarklyPluginOptions> =
	BaseLaunchDarklyPlugin<T>;

const PUBLIC_ENDPOINTS = new Set(['root.get']);

export function launchdarkly<const T extends LaunchDarklyPluginOptions>(
	incomingOptions: LaunchDarklyPluginOptions &
		T = {} as LaunchDarklyPluginOptions & T,
): ExternalLaunchDarklyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'launchdarkly',
		authConfig: launchdarklyAuthConfig,
		schema: LaunchDarklySchema,
		options,
		hooks: options.hooks,
		endpoints: launchdarklyEndpointsNested,
		webhooks: {},
		endpointMeta: launchdarklyEndpointMeta,
		endpointSchemas: launchdarklyEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: LaunchDarklyKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (PUBLIC_ENDPOINTS.has(ctx.meteredOperationId ?? '')) return '';
			if (!ctx.keys) throw new AuthMissingError('launchdarkly', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('launchdarkly', 'api_key');
			return apiKey;
		},
	} satisfies InternalLaunchDarklyPlugin;
}

export * from './endpoints/types';
