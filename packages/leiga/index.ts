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
import type { LeigaAuthContext } from './auth';
import { resolveLeigaAccessToken } from './auth';
import {
	IssuesEndpoints,
	MembersEndpoints,
	ProjectsEndpoints,
	SprintsEndpoints,
	TagsEndpoints,
	WorkflowsEndpoints,
} from './endpoints';
import type {
	LeigaEndpointInputs,
	LeigaEndpointOutputs,
} from './endpoints/types';
import {
	LeigaEndpointInputSchemas,
	LeigaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { LeigaSchema } from './schema';

export type LeigaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * A ready access token. Useful for a short-lived smoke test; normal use
	 * stores the client pair instead and lets the plugin mint a token.
	 */
	key?: string;
	hooks?: InternalLeigaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof leigaEndpointsNested>;
};

export type LeigaContext = CorsairPluginContext<
	typeof LeigaSchema,
	LeigaPluginOptions,
	undefined,
	typeof leigaAuthConfig
>;

export type LeigaKeyBuilderContext = KeyBuilderContext<
	LeigaPluginOptions,
	typeof leigaAuthConfig
>;

export type LeigaBoundEndpoints = BindEndpoints<typeof leigaEndpointsNested>;

type LeigaEndpoint<K extends keyof LeigaEndpointOutputs> = CorsairEndpoint<
	LeigaContext,
	LeigaEndpointInputs[K],
	LeigaEndpointOutputs[K]
>;

export type LeigaEndpoints = {
	projectsList: LeigaEndpoint<'projectsList'>;
	projectsGet: LeigaEndpoint<'projectsGet'>;
	projectsGetByKey: LeigaEndpoint<'projectsGetByKey'>;
	projectsTemplates: LeigaEndpoint<'projectsTemplates'>;
	issuesList: LeigaEndpoint<'issuesList'>;
	issuesGet: LeigaEndpoint<'issuesGet'>;
	issuesGetByNumber: LeigaEndpoint<'issuesGetByNumber'>;
	issuesTypes: LeigaEndpoint<'issuesTypes'>;
	issuesFields: LeigaEndpoint<'issuesFields'>;
	sprintsList: LeigaEndpoint<'sprintsList'>;
	sprintsGet: LeigaEndpoint<'sprintsGet'>;
	workflowsList: LeigaEndpoint<'workflowsList'>;
	workflowsNextStates: LeigaEndpoint<'workflowsNextStates'>;
	tagsList: LeigaEndpoint<'tagsList'>;
	membersList: LeigaEndpoint<'membersList'>;
};

const leigaEndpointsNested = {
	projects: ProjectsEndpoints,
	issues: IssuesEndpoints,
	sprints: SprintsEndpoints,
	workflows: WorkflowsEndpoints,
	tags: TagsEndpoints,
	members: MembersEndpoints,
} as const;

export const leigaEndpointSchemas = {
	'projects.list': {
		input: LeigaEndpointInputSchemas.projectsList,
		output: LeigaEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: LeigaEndpointInputSchemas.projectsGet,
		output: LeigaEndpointOutputSchemas.projectsGet,
	},
	'projects.getByKey': {
		input: LeigaEndpointInputSchemas.projectsGetByKey,
		output: LeigaEndpointOutputSchemas.projectsGetByKey,
	},
	'projects.templates': {
		input: LeigaEndpointInputSchemas.projectsTemplates,
		output: LeigaEndpointOutputSchemas.projectsTemplates,
	},
	'issues.list': {
		input: LeigaEndpointInputSchemas.issuesList,
		output: LeigaEndpointOutputSchemas.issuesList,
	},
	'issues.get': {
		input: LeigaEndpointInputSchemas.issuesGet,
		output: LeigaEndpointOutputSchemas.issuesGet,
	},
	'issues.getByNumber': {
		input: LeigaEndpointInputSchemas.issuesGetByNumber,
		output: LeigaEndpointOutputSchemas.issuesGetByNumber,
	},
	'issues.types': {
		input: LeigaEndpointInputSchemas.issuesTypes,
		output: LeigaEndpointOutputSchemas.issuesTypes,
	},
	'issues.fields': {
		input: LeigaEndpointInputSchemas.issuesFields,
		output: LeigaEndpointOutputSchemas.issuesFields,
	},
	'sprints.list': {
		input: LeigaEndpointInputSchemas.sprintsList,
		output: LeigaEndpointOutputSchemas.sprintsList,
	},
	'sprints.get': {
		input: LeigaEndpointInputSchemas.sprintsGet,
		output: LeigaEndpointOutputSchemas.sprintsGet,
	},
	'workflows.list': {
		input: LeigaEndpointInputSchemas.workflowsList,
		output: LeigaEndpointOutputSchemas.workflowsList,
	},
	'workflows.nextStates': {
		input: LeigaEndpointInputSchemas.workflowsNextStates,
		output: LeigaEndpointOutputSchemas.workflowsNextStates,
	},
	'tags.list': {
		input: LeigaEndpointInputSchemas.tagsList,
		output: LeigaEndpointOutputSchemas.tagsList,
	},
	'members.list': {
		input: LeigaEndpointInputSchemas.membersList,
		output: LeigaEndpointOutputSchemas.membersList,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof leigaEndpointsNested>;

const defaultAuthType: 'api_key' = 'api_key';

/**
 * `client_id` and `client_secret` are **account** fields, not integration ones.
 * The account key manager is what `keyBuilder` receives, and it only generates
 * accessors for account-level fields: `get_integration_credentials` exists
 * solely on `oauth_2` managers, so reading an integration-level pair through an
 * `api_key` account would throw before any request was sent.
 *
 * `api_key` is the auth type because the minted token is what every resource
 * call sends. The exchange happens in the key builder, so a caller stores the
 * pair once and never handles a token.
 */
export const leigaAuthConfig = {
	api_key: {
		account: [
			'client_id',
			'client_secret',
			'access_token',
			'expires_at',
		] as const,
	},
} as const satisfies PluginAuthConfig;

const leigaEndpointMeta = {
	'projects.list': {
		riskLevel: 'read',
		description: 'List the projects in the organization',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get one project by id, with its metadata',
	},
	'projects.getByKey': {
		riskLevel: 'read',
		description: 'Get one project by its key, such as LGC',
	},
	'projects.templates': {
		riskLevel: 'read',
		description: 'List the project templates available for new projects',
	},
	'issues.list': {
		riskLevel: 'read',
		description: 'Query the issues in a project, with filters and paging',
	},
	'issues.get': {
		riskLevel: 'read',
		description: 'Get one issue by id, with its fields and tags',
	},
	'issues.getByNumber': {
		riskLevel: 'read',
		description: 'Get one issue by its human-readable number, such as LGC-12',
	},
	'issues.types': {
		riskLevel: 'read',
		description: 'List the issue types a project offers, such as bug or task',
	},
	'issues.fields': {
		riskLevel: 'read',
		description:
			'List the fields one issue type exposes, including custom ones',
	},
	'sprints.list': {
		riskLevel: 'read',
		description: 'List a project sprints with per-issue-type counts',
	},
	'sprints.get': {
		riskLevel: 'read',
		description: 'Get one sprint by id',
	},
	'workflows.list': {
		riskLevel: 'read',
		description: 'List the workflow steps a project uses',
	},
	'workflows.nextStates': {
		riskLevel: 'read',
		description: 'List the states an issue can move to from its current one',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List the tags defined in a project',
	},
	'members.list': {
		riskLevel: 'read',
		description: 'List the members of a project with their roles',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof leigaEndpointsNested>;

export type BaseLeigaPlugin<T extends LeigaPluginOptions> = CorsairPlugin<
	'leiga',
	typeof LeigaSchema,
	typeof leigaEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof leigaAuthConfig
>;

export type InternalLeigaPlugin = BaseLeigaPlugin<LeigaPluginOptions>;

export type ExternalLeigaPlugin<T extends LeigaPluginOptions> =
	BaseLeigaPlugin<T>;

/**
 * Resolves the `accessToken` header. Two sources, in order:
 *
 * 1. an explicit `key`, which is already a token;
 * 2. the account, through `resolveLeigaAccessToken`, which reuses a stored
 *    token until it is nearly expired and otherwise exchanges the stored client
 *    pair for a fresh one.
 *
 * A missing pair and a missing token both mean the account is not connected,
 * which has to throw rather than send an empty header.
 */
async function resolveLeigaKey(
	ctx: LeigaKeyBuilderContext,
	options: LeigaPluginOptions,
): Promise<string> {
	if (options.key) return options.key;
	// Safe: the resolver reads only keys/tenantId, and the key manager on an
	// api_key account does not expose `get_integration_credentials` in its type
	// even though the runtime manager answers it for extra integration fields.
	return resolveLeigaAccessToken(ctx as unknown as LeigaAuthContext);
}

export function leiga<const T extends LeigaPluginOptions>(
	incomingOptions: LeigaPluginOptions & T = {} as LeigaPluginOptions & T,
): ExternalLeigaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	} as LeigaPluginOptions & T;
	return {
		id: 'leiga',
		authConfig: leigaAuthConfig,
		schema: LeigaSchema,
		options,
		hooks: options.hooks,
		endpoints: leigaEndpointsNested,
		webhooks: {},
		endpointMeta: leigaEndpointMeta,
		endpointSchemas: leigaEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('leiga', 'api_key');
			}
			return resolveLeigaKey(ctx, options);
		},
	} satisfies InternalLeigaPlugin;
}

export type {
	LeigaEndpointInputs,
	LeigaEndpointOutputs,
	LeigaIssue,
	LeigaIssueField,
	LeigaIssueSummary,
	LeigaIssueType,
	LeigaProject,
	LeigaProjectMember,
	LeigaProjectSummary,
	LeigaProjectTemplate,
	LeigaSprint,
	LeigaTag,
	LeigaWorkflow,
} from './endpoints/types';
