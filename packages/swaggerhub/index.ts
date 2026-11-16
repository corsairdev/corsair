import type {
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
	ApiSettingsEndpoints,
	ApisEndpoints,
	CommentsEndpoints,
	DomainsEndpoints,
	IntegrationsEndpoints,
	ProjectsEndpoints,
	SpecsEndpoints,
	SwaggerhubEndpointInputSchemas,
	SwaggerhubEndpointOutputSchemas,
	TemplatesEndpoints,
} from './endpoints';
import type {
	SwaggerhubEndpointInputs,
	SwaggerhubEndpointOutputs,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { SwaggerhubSchema } from './schema';

export type SwaggerhubPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** An API key from the account's settings page, sent as `Authorization`. */
	key?: string;
	hooks?: InternalSwaggerhubPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof swaggerhubEndpointsNested>;
};

export type SwaggerhubContext = CorsairPluginContext<
	typeof SwaggerhubSchema,
	SwaggerhubPluginOptions,
	undefined,
	typeof swaggerhubAuthConfig
>;

export type SwaggerhubKeyBuilderContext = KeyBuilderContext<
	SwaggerhubPluginOptions,
	typeof swaggerhubAuthConfig
>;

export type SwaggerhubBoundEndpoints = BindEndpoints<
	typeof swaggerhubEndpointsNested
>;

type SwaggerhubEndpoint<K extends keyof SwaggerhubEndpointOutputs> =
	CorsairEndpoint<
		SwaggerhubContext,
		SwaggerhubEndpointInputs[K],
		SwaggerhubEndpointOutputs[K]
	>;

export type SwaggerhubEndpoints = {
	specsList: SwaggerhubEndpoint<'specsList'>;
	specsValidate: SwaggerhubEndpoint<'specsValidate'>;
	apisList: SwaggerhubEndpoint<'apisList'>;
	apisListVersions: SwaggerhubEndpoint<'apisListVersions'>;
	apisGetDefinition: SwaggerhubEndpoint<'apisGetDefinition'>;
	apisSave: SwaggerhubEndpoint<'apisSave'>;
	apisDelete: SwaggerhubEndpoint<'apisDelete'>;
	apisDeleteVersion: SwaggerhubEndpoint<'apisDeleteVersion'>;
	apisCloneVersion: SwaggerhubEndpoint<'apisCloneVersion'>;
	apisForkVersion: SwaggerhubEndpoint<'apisForkVersion'>;
	apisCompare: SwaggerhubEndpoint<'apisCompare'>;
	apisGetCapabilities: SwaggerhubEndpoint<'apisGetCapabilities'>;
	apisGetDefaultVersion: SwaggerhubEndpoint<'apisGetDefaultVersion'>;
	apisSetDefaultVersion: SwaggerhubEndpoint<'apisSetDefaultVersion'>;
	apisRename: SwaggerhubEndpoint<'apisRename'>;
	apisGetNotifications: SwaggerhubEndpoint<'apisGetNotifications'>;
	apisSetNotifications: SwaggerhubEndpoint<'apisSetNotifications'>;
	apisDisableNotifications: SwaggerhubEndpoint<'apisDisableNotifications'>;
	apiSettingsGetLifecycle: SwaggerhubEndpoint<'apiSettingsGetLifecycle'>;
	apiSettingsSetLifecycle: SwaggerhubEndpoint<'apiSettingsSetLifecycle'>;
	apiSettingsGetVisibility: SwaggerhubEndpoint<'apiSettingsGetVisibility'>;
	apiSettingsSetVisibility: SwaggerhubEndpoint<'apiSettingsSetVisibility'>;
	commentsList: SwaggerhubEndpoint<'commentsList'>;
	commentsCreate: SwaggerhubEndpoint<'commentsCreate'>;
	commentsUpdate: SwaggerhubEndpoint<'commentsUpdate'>;
	commentsDelete: SwaggerhubEndpoint<'commentsDelete'>;
	commentsReply: SwaggerhubEndpoint<'commentsReply'>;
	domainsList: SwaggerhubEndpoint<'domainsList'>;
	domainsGetVersions: SwaggerhubEndpoint<'domainsGetVersions'>;
	domainsGetDefinition: SwaggerhubEndpoint<'domainsGetDefinition'>;
	domainsSave: SwaggerhubEndpoint<'domainsSave'>;
	domainsDelete: SwaggerhubEndpoint<'domainsDelete'>;
	domainsDeleteVersion: SwaggerhubEndpoint<'domainsDeleteVersion'>;
	templatesList: SwaggerhubEndpoint<'templatesList'>;
	templatesGet: SwaggerhubEndpoint<'templatesGet'>;
	templatesSave: SwaggerhubEndpoint<'templatesSave'>;
	templatesDelete: SwaggerhubEndpoint<'templatesDelete'>;
	projectsList: SwaggerhubEndpoint<'projectsList'>;
	projectsGet: SwaggerhubEndpoint<'projectsGet'>;
	projectsCreate: SwaggerhubEndpoint<'projectsCreate'>;
	projectsUpdate: SwaggerhubEndpoint<'projectsUpdate'>;
	projectsDelete: SwaggerhubEndpoint<'projectsDelete'>;
	integrationsList: SwaggerhubEndpoint<'integrationsList'>;
	integrationsExecute: SwaggerhubEndpoint<'integrationsExecute'>;
};

const swaggerhubEndpointsNested = {
	specs: SpecsEndpoints,
	apis: ApisEndpoints,
	apiSettings: ApiSettingsEndpoints,
	comments: CommentsEndpoints,
	domains: DomainsEndpoints,
	templates: TemplatesEndpoints,
	projects: ProjectsEndpoints,
	integrations: IntegrationsEndpoints,
} as const;

export const swaggerhubEndpointSchemas = {
	'specs.list': {
		input: SwaggerhubEndpointInputSchemas.specsList,
		output: SwaggerhubEndpointOutputSchemas.specsList,
	},
	'specs.validate': {
		input: SwaggerhubEndpointInputSchemas.specsValidate,
		output: SwaggerhubEndpointOutputSchemas.specsValidate,
	},
	'apis.list': {
		input: SwaggerhubEndpointInputSchemas.apisList,
		output: SwaggerhubEndpointOutputSchemas.apisList,
	},
	'apis.listVersions': {
		input: SwaggerhubEndpointInputSchemas.apisListVersions,
		output: SwaggerhubEndpointOutputSchemas.apisListVersions,
	},
	'apis.getDefinition': {
		input: SwaggerhubEndpointInputSchemas.apisGetDefinition,
		output: SwaggerhubEndpointOutputSchemas.apisGetDefinition,
	},
	'apis.save': {
		input: SwaggerhubEndpointInputSchemas.apisSave,
		output: SwaggerhubEndpointOutputSchemas.apisSave,
	},
	'apis.delete': {
		input: SwaggerhubEndpointInputSchemas.apisDelete,
		output: SwaggerhubEndpointOutputSchemas.apisDelete,
	},
	'apis.deleteVersion': {
		input: SwaggerhubEndpointInputSchemas.apisDeleteVersion,
		output: SwaggerhubEndpointOutputSchemas.apisDeleteVersion,
	},
	'apis.cloneVersion': {
		input: SwaggerhubEndpointInputSchemas.apisCloneVersion,
		output: SwaggerhubEndpointOutputSchemas.apisCloneVersion,
	},
	'apis.forkVersion': {
		input: SwaggerhubEndpointInputSchemas.apisForkVersion,
		output: SwaggerhubEndpointOutputSchemas.apisForkVersion,
	},
	'apis.compare': {
		input: SwaggerhubEndpointInputSchemas.apisCompare,
		output: SwaggerhubEndpointOutputSchemas.apisCompare,
	},
	'apis.getCapabilities': {
		input: SwaggerhubEndpointInputSchemas.apisGetCapabilities,
		output: SwaggerhubEndpointOutputSchemas.apisGetCapabilities,
	},
	'apis.getDefaultVersion': {
		input: SwaggerhubEndpointInputSchemas.apisGetDefaultVersion,
		output: SwaggerhubEndpointOutputSchemas.apisGetDefaultVersion,
	},
	'apis.setDefaultVersion': {
		input: SwaggerhubEndpointInputSchemas.apisSetDefaultVersion,
		output: SwaggerhubEndpointOutputSchemas.apisSetDefaultVersion,
	},
	'apis.rename': {
		input: SwaggerhubEndpointInputSchemas.apisRename,
		output: SwaggerhubEndpointOutputSchemas.apisRename,
	},
	'apis.getNotifications': {
		input: SwaggerhubEndpointInputSchemas.apisGetNotifications,
		output: SwaggerhubEndpointOutputSchemas.apisGetNotifications,
	},
	'apis.setNotifications': {
		input: SwaggerhubEndpointInputSchemas.apisSetNotifications,
		output: SwaggerhubEndpointOutputSchemas.apisSetNotifications,
	},
	'apis.disableNotifications': {
		input: SwaggerhubEndpointInputSchemas.apisDisableNotifications,
		output: SwaggerhubEndpointOutputSchemas.apisDisableNotifications,
	},
	'apiSettings.getLifecycle': {
		input: SwaggerhubEndpointInputSchemas.apiSettingsGetLifecycle,
		output: SwaggerhubEndpointOutputSchemas.apiSettingsGetLifecycle,
	},
	'apiSettings.setLifecycle': {
		input: SwaggerhubEndpointInputSchemas.apiSettingsSetLifecycle,
		output: SwaggerhubEndpointOutputSchemas.apiSettingsSetLifecycle,
	},
	'apiSettings.getVisibility': {
		input: SwaggerhubEndpointInputSchemas.apiSettingsGetVisibility,
		output: SwaggerhubEndpointOutputSchemas.apiSettingsGetVisibility,
	},
	'apiSettings.setVisibility': {
		input: SwaggerhubEndpointInputSchemas.apiSettingsSetVisibility,
		output: SwaggerhubEndpointOutputSchemas.apiSettingsSetVisibility,
	},
	'comments.list': {
		input: SwaggerhubEndpointInputSchemas.commentsList,
		output: SwaggerhubEndpointOutputSchemas.commentsList,
	},
	'comments.create': {
		input: SwaggerhubEndpointInputSchemas.commentsCreate,
		output: SwaggerhubEndpointOutputSchemas.commentsCreate,
	},
	'comments.update': {
		input: SwaggerhubEndpointInputSchemas.commentsUpdate,
		output: SwaggerhubEndpointOutputSchemas.commentsUpdate,
	},
	'comments.delete': {
		input: SwaggerhubEndpointInputSchemas.commentsDelete,
		output: SwaggerhubEndpointOutputSchemas.commentsDelete,
	},
	'comments.reply': {
		input: SwaggerhubEndpointInputSchemas.commentsReply,
		output: SwaggerhubEndpointOutputSchemas.commentsReply,
	},
	'domains.list': {
		input: SwaggerhubEndpointInputSchemas.domainsList,
		output: SwaggerhubEndpointOutputSchemas.domainsList,
	},
	'domains.getVersions': {
		input: SwaggerhubEndpointInputSchemas.domainsGetVersions,
		output: SwaggerhubEndpointOutputSchemas.domainsGetVersions,
	},
	'domains.getDefinition': {
		input: SwaggerhubEndpointInputSchemas.domainsGetDefinition,
		output: SwaggerhubEndpointOutputSchemas.domainsGetDefinition,
	},
	'domains.save': {
		input: SwaggerhubEndpointInputSchemas.domainsSave,
		output: SwaggerhubEndpointOutputSchemas.domainsSave,
	},
	'domains.delete': {
		input: SwaggerhubEndpointInputSchemas.domainsDelete,
		output: SwaggerhubEndpointOutputSchemas.domainsDelete,
	},
	'domains.deleteVersion': {
		input: SwaggerhubEndpointInputSchemas.domainsDeleteVersion,
		output: SwaggerhubEndpointOutputSchemas.domainsDeleteVersion,
	},
	'templates.list': {
		input: SwaggerhubEndpointInputSchemas.templatesList,
		output: SwaggerhubEndpointOutputSchemas.templatesList,
	},
	'templates.get': {
		input: SwaggerhubEndpointInputSchemas.templatesGet,
		output: SwaggerhubEndpointOutputSchemas.templatesGet,
	},
	'templates.save': {
		input: SwaggerhubEndpointInputSchemas.templatesSave,
		output: SwaggerhubEndpointOutputSchemas.templatesSave,
	},
	'templates.delete': {
		input: SwaggerhubEndpointInputSchemas.templatesDelete,
		output: SwaggerhubEndpointOutputSchemas.templatesDelete,
	},
	'projects.list': {
		input: SwaggerhubEndpointInputSchemas.projectsList,
		output: SwaggerhubEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: SwaggerhubEndpointInputSchemas.projectsGet,
		output: SwaggerhubEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: SwaggerhubEndpointInputSchemas.projectsCreate,
		output: SwaggerhubEndpointOutputSchemas.projectsCreate,
	},
	'projects.update': {
		input: SwaggerhubEndpointInputSchemas.projectsUpdate,
		output: SwaggerhubEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: SwaggerhubEndpointInputSchemas.projectsDelete,
		output: SwaggerhubEndpointOutputSchemas.projectsDelete,
	},
	'integrations.list': {
		input: SwaggerhubEndpointInputSchemas.integrationsList,
		output: SwaggerhubEndpointOutputSchemas.integrationsList,
	},
	'integrations.execute': {
		input: SwaggerhubEndpointInputSchemas.integrationsExecute,
		output: SwaggerhubEndpointOutputSchemas.integrationsExecute,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof swaggerhubEndpointsNested
>;

const defaultAuthType: 'api_key' = 'api_key';

/**
 * SwaggerHub authenticates with one **API key**, sent as the `Authorization`
 * header with no prefix. There is no per-account host or second credential, so
 * this is the simplest possible auth config.
 */
export const swaggerhubAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

const swaggerhubEndpointMeta = {
	'specs.list': {
		riskLevel: 'read',
		description:
			'List the specs visible to the account, filtered by type, owner, visibility, state or free text',
	},
	'specs.validate': {
		riskLevel: 'read',
		description:
			'Validate an OpenAPI or AsyncAPI definition and get findings with line and column positions. Nothing is saved',
	},
	'apis.list': {
		riskLevel: 'read',
		description:
			'List the APIs under one owner, with paging, sorting and a filter for the token user own APIs',
	},
	'apis.listVersions': {
		riskLevel: 'read',
		description:
			'List every version of one API, with its default version and metadata',
	},
	'apis.getDefinition': {
		riskLevel: 'read',
		description:
			'Read the stored definition of one API version as text, optionally resolved or flattened',
	},
	'apis.save': {
		riskLevel: 'write',
		description:
			'Save a definition to one API, creating the version or updating it. Answers 409 on a published version unless force is set',
	},
	'apis.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an API and every version of it. There is no undo and the comments go with it',
	},
	'apis.deleteVersion': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete one version of an API. The other versions stay, and there is no undo',
	},
	'apis.cloneVersion': {
		riskLevel: 'write',
		description: 'Create a version that starts as a copy of an existing one',
	},
	'apis.forkVersion': {
		riskLevel: 'write',
		description:
			'Fork a version into another owner and name, including another organisation',
	},
	'apis.compare': {
		riskLevel: 'read',
		description:
			'Compare a definition against the stored version and list the differences',
	},
	'apis.getCapabilities': {
		riskLevel: 'read',
		description:
			'Read what the token may do with one API version, such as seeing standardization errors',
	},
	'apis.getDefaultVersion': {
		riskLevel: 'read',
		description:
			'Read which version the API shows by default. Null when none is set',
	},
	'apis.setDefaultVersion': {
		riskLevel: 'write',
		description:
			'Change which version the API shows by default. The version has to exist',
	},
	'apis.rename': {
		riskLevel: 'write',
		description:
			'Rename an API. Its published URLs change, so anything pointing at the old name breaks',
	},
	'apis.getNotifications': {
		riskLevel: 'read',
		description:
			'Read which notification scopes are enabled for one API, and for the caller',
	},
	'apis.setNotifications': {
		riskLevel: 'write',
		description:
			'Turn on notification scopes for one API. The body is the bare list of scopes',
	},
	'apis.disableNotifications': {
		riskLevel: 'write',
		description:
			'Disable every notification the caller has on one API. Nothing else about the API changes',
	},
	'apiSettings.getLifecycle': {
		riskLevel: 'read',
		description: 'Read whether one API version is published',
	},
	'apiSettings.setLifecycle': {
		riskLevel: 'write',
		description:
			'Publish or unpublish one API version. Publishing exposes it to everyone it is visible to',
	},
	'apiSettings.getVisibility': {
		riskLevel: 'read',
		description: 'Read whether one API version is private',
	},
	'apiSettings.setVisibility': {
		riskLevel: 'write',
		description:
			'Make one API version private or public. A private version leaves public view immediately',
	},
	'comments.list': {
		riskLevel: 'read',
		description:
			'List the comments on one API version with their replies and open or resolved status',
	},
	'comments.create': {
		riskLevel: 'destructive',
		description:
			'Post a comment on one API version, optionally anchored to a line range. Collaborators with notifications on are told about it',
	},
	'comments.update': {
		riskLevel: 'write',
		description: 'Change the text of one comment',
	},
	'comments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete one comment and its replies. There is no undo',
	},
	'comments.reply': {
		riskLevel: 'destructive',
		description:
			'Post a reply to an existing comment. Collaborators with notifications on are told about it',
	},
	'domains.list': {
		riskLevel: 'read',
		description: 'List the domains under one owner',
	},
	'domains.getVersions': {
		riskLevel: 'read',
		description: 'List every version of one domain',
	},
	'domains.getDefinition': {
		riskLevel: 'read',
		description: 'Read the stored definition of one domain version as text',
	},
	'domains.save': {
		riskLevel: 'write',
		description:
			'Save a definition to one domain, creating the version or updating it',
	},
	'domains.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a domain and every version of it. There is no undo',
	},
	'domains.deleteVersion': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete one version of a domain. The other versions stay, and there is no undo',
	},
	'templates.list': {
		riskLevel: 'read',
		description:
			'List the template catalog, optionally narrowed to one owner, including the built-in templates',
	},
	'templates.get': {
		riskLevel: 'read',
		description:
			'Read one template definition as text, optionally a built-in template',
	},
	'templates.save': {
		riskLevel: 'write',
		description: 'Create or update a template and its version',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete one template version, or the whole template when no version is given. There is no undo',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List the projects in one organisation',
	},
	'projects.get': {
		riskLevel: 'read',
		description:
			'Read one project with the APIs, domains and templates it groups',
	},
	'projects.create': {
		riskLevel: 'write',
		description:
			'Create a project from a list of API, domain and template names that already exist in the organisation',
	},
	'projects.update': {
		riskLevel: 'write',
		description:
			'Replace a project definition. A collection left out is cleared, so send all three',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a project. The APIs, domains and templates it grouped stay on the account',
	},
	'integrations.list': {
		riskLevel: 'read',
		description:
			'List the integrations configured on one API version, with their ids and enabled state',
	},
	'integrations.execute': {
		riskLevel: 'destructive',
		description:
			'Run one integration once, which pushes the stored definition to its target such as a repository or gateway',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof swaggerhubEndpointsNested
>;

export type BaseSwaggerhubPlugin<T extends SwaggerhubPluginOptions> =
	CorsairPlugin<
		'swaggerhub',
		typeof SwaggerhubSchema,
		typeof swaggerhubEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof swaggerhubAuthConfig
	>;

export type InternalSwaggerhubPlugin =
	BaseSwaggerhubPlugin<SwaggerhubPluginOptions>;

export type ExternalSwaggerhubPlugin<T extends SwaggerhubPluginOptions> =
	BaseSwaggerhubPlugin<T>;

export function swaggerhub<const T extends SwaggerhubPluginOptions>(
	incomingOptions: SwaggerhubPluginOptions & T = {} as SwaggerhubPluginOptions &
		T,
): ExternalSwaggerhubPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	} as SwaggerhubPluginOptions & T;
	return {
		id: 'swaggerhub',
		authConfig: swaggerhubAuthConfig,
		schema: SwaggerhubSchema,
		options,
		hooks: options.hooks,
		endpoints: swaggerhubEndpointsNested,
		webhooks: {},
		endpointMeta: swaggerhubEndpointMeta,
		endpointSchemas: swaggerhubEndpointSchemas,
		// SwaggerHub can call a URL when an API changes, but the subscription is
		// made through its own webhook integration, it signs nothing this plugin
		// can verify, so it does not receive any.
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('swaggerhub', 'api_key');
			}
			if (options.key) return options.key;
			// A context built without a key manager (a bare `key` option, a unit
			// test) has no `keys` at all, so this is guarded before reading it.
			if (!ctx.keys) throw new AuthMissingError('swaggerhub', 'api_key');
			const stored = await ctx.keys.get_api_key();
			if (!stored) throw new AuthMissingError('swaggerhub', 'api_key');
			return stored;
		},
	} satisfies InternalSwaggerhubPlugin;
}

export type {
	ApiSettingsGetLifecycleInput,
	ApiSettingsGetLifecycleResponse,
	ApiSettingsGetVisibilityInput,
	ApiSettingsGetVisibilityResponse,
	ApiSettingsSetLifecycleInput,
	ApiSettingsSetLifecycleResponse,
	ApiSettingsSetVisibilityInput,
	ApiSettingsSetVisibilityResponse,
	ApisCloneVersionInput,
	ApisCloneVersionResponse,
	ApisCompareInput,
	ApisCompareResponse,
	ApisDeleteInput,
	ApisDeleteResponse,
	ApisDeleteVersionInput,
	ApisDeleteVersionResponse,
	ApisDisableNotificationsInput,
	ApisDisableNotificationsResponse,
	ApisForkVersionInput,
	ApisForkVersionResponse,
	ApisGetCapabilitiesInput,
	ApisGetCapabilitiesResponse,
	ApisGetDefaultVersionInput,
	ApisGetDefaultVersionResponse,
	ApisGetDefinitionInput,
	ApisGetDefinitionResponse,
	ApisGetNotificationsInput,
	ApisGetNotificationsResponse,
	ApisListInput,
	ApisListResponse,
	ApisListVersionsInput,
	ApisListVersionsResponse,
	ApisRenameInput,
	ApisRenameResponse,
	ApisSaveInput,
	ApisSaveResponse,
	ApisSetDefaultVersionInput,
	ApisSetDefaultVersionResponse,
	ApisSetNotificationsInput,
	ApisSetNotificationsResponse,
	CommentsCreateInput,
	CommentsCreateResponse,
	CommentsDeleteInput,
	CommentsDeleteResponse,
	CommentsListInput,
	CommentsListResponse,
	CommentsReplyInput,
	CommentsReplyResponse,
	CommentsUpdateInput,
	CommentsUpdateResponse,
	DomainsDeleteInput,
	DomainsDeleteResponse,
	DomainsDeleteVersionInput,
	DomainsDeleteVersionResponse,
	DomainsGetDefinitionInput,
	DomainsGetDefinitionResponse,
	DomainsGetVersionsInput,
	DomainsGetVersionsResponse,
	DomainsListInput,
	DomainsListResponse,
	DomainsSaveInput,
	DomainsSaveResponse,
	IntegrationsExecuteInput,
	IntegrationsExecuteResponse,
	IntegrationsListInput,
	IntegrationsListResponse,
	ProjectsCreateInput,
	ProjectsCreateResponse,
	ProjectsDeleteInput,
	ProjectsDeleteResponse,
	ProjectsGetInput,
	ProjectsGetResponse,
	ProjectsListInput,
	ProjectsListResponse,
	ProjectsUpdateInput,
	ProjectsUpdateResponse,
	SpecsListInput,
	SpecsListResponse,
	SpecsValidateInput,
	SpecsValidateResponse,
	SwaggerhubEndpointInputs,
	SwaggerhubEndpointOutputs,
	TemplatesDeleteInput,
	TemplatesDeleteResponse,
	TemplatesGetInput,
	TemplatesGetResponse,
	TemplatesListInput,
	TemplatesListResponse,
	TemplatesSaveInput,
	TemplatesSaveResponse,
} from './endpoints/types';
