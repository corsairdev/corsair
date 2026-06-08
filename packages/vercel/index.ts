import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import {
	aliases,
	deployments,
	domains,
	envs,
	projects,
	teams,
	webhooks,
} from './endpoints';
import type {
	VercelEndpointInputs,
	VercelEndpointOutputs,
} from './endpoints/types';
import {
	VercelEndpointInputSchemas,
	VercelEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { VercelSchema } from './schema';
import type { VercelWebhookOutputs } from './webhooks';
import {
	DeploymentCreatedEventSchema,
	DeploymentErrorEventSchema,
	DeploymentSucceededEventSchema,
	ProjectCreatedEventSchema,
	WebhookHandlers,
} from './webhooks';

const defaultAuthType: AuthTypes = 'api_key';

export type VercelPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	teamId?: string;
	webhookSecret?: string;
	hooks?: InternalVercelPlugin['hooks'];
	webhookHooks?: InternalVercelPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof vercelEndpointsNested>;
};

export type VercelContext = CorsairPluginContext<
	typeof VercelSchema,
	VercelPluginOptions
>;

export type VercelKeyBuilderContext = KeyBuilderContext<VercelPluginOptions>;

type VercelEndpoint<K extends keyof VercelEndpointOutputs> = CorsairEndpoint<
	VercelContext,
	VercelEndpointInputs[K],
	VercelEndpointOutputs[K]
>;

export type VercelEndpoints = {
	projectsGetProjects: VercelEndpoint<'projectsGetProjects'>;
	projectsGetProject: VercelEndpoint<'projectsGetProject'>;
	deploymentsGetDeployments: VercelEndpoint<'deploymentsGetDeployments'>;
	deploymentsGetDeployment: VercelEndpoint<'deploymentsGetDeployment'>;
	deploymentsCreateDeployment: VercelEndpoint<'deploymentsCreateDeployment'>;
	domainsGetDomains: VercelEndpoint<'domainsGetDomains'>;
	domainsGetProjectDomains: VercelEndpoint<'domainsGetProjectDomains'>;
	envsGetEnvVariables: VercelEndpoint<'envsGetEnvVariables'>;
	envsCreateEnvVariable: VercelEndpoint<'envsCreateEnvVariable'>;
	aliasesGetAliases: VercelEndpoint<'aliasesGetAliases'>;
	aliasesAssignAlias: VercelEndpoint<'aliasesAssignAlias'>;
	webhooksGetWebhooks: VercelEndpoint<'webhooksGetWebhooks'>;
	webhooksCreateWebhook: VercelEndpoint<'webhooksCreateWebhook'>;
	teamsGetTeams: VercelEndpoint<'teamsGetTeams'>;
};

const vercelEndpointsNested = {
	projects: {
		getProjects: projects.getProjects,
		getProject: projects.getProject,
	},
	deployments: {
		getDeployments: deployments.getDeployments,
		getDeployment: deployments.getDeployment,
		createDeployment: deployments.createDeployment,
	},
	domains: {
		getDomains: domains.getDomains,
		getProjectDomains: domains.getProjectDomains,
	},
	envs: {
		getEnvVariables: envs.getEnvVariables,
		createEnvVariable: envs.createEnvVariable,
	},
	aliases: {
		getAliases: aliases.getAliases,
		assignAlias: aliases.assignAlias,
	},
	webhooks: {
		getWebhooks: webhooks.getWebhooks,
		createWebhook: webhooks.createWebhook,
	},
	teams: {
		getTeams: teams.getTeams,
	},
} as const;

export type VercelBoundEndpoints = BindEndpoints<typeof vercelEndpointsNested>;

export const vercelEndpointSchemas = {
	'projects.getProjects': {
		input: VercelEndpointInputSchemas.projectsGetProjects,
		output: VercelEndpointOutputSchemas.projectsGetProjects,
	},
	'projects.getProject': {
		input: VercelEndpointInputSchemas.projectsGetProject,
		output: VercelEndpointOutputSchemas.projectsGetProject,
	},
	'deployments.getDeployments': {
		input: VercelEndpointInputSchemas.deploymentsGetDeployments,
		output: VercelEndpointOutputSchemas.deploymentsGetDeployments,
	},
	'deployments.getDeployment': {
		input: VercelEndpointInputSchemas.deploymentsGetDeployment,
		output: VercelEndpointOutputSchemas.deploymentsGetDeployment,
	},
	'deployments.createDeployment': {
		input: VercelEndpointInputSchemas.deploymentsCreateDeployment,
		output: VercelEndpointOutputSchemas.deploymentsCreateDeployment,
	},
	'domains.getDomains': {
		input: VercelEndpointInputSchemas.domainsGetDomains,
		output: VercelEndpointOutputSchemas.domainsGetDomains,
	},
	'domains.getProjectDomains': {
		input: VercelEndpointInputSchemas.domainsGetProjectDomains,
		output: VercelEndpointOutputSchemas.domainsGetProjectDomains,
	},
	'envs.getEnvVariables': {
		input: VercelEndpointInputSchemas.envsGetEnvVariables,
		output: VercelEndpointOutputSchemas.envsGetEnvVariables,
	},
	'envs.createEnvVariable': {
		input: VercelEndpointInputSchemas.envsCreateEnvVariable,
		output: VercelEndpointOutputSchemas.envsCreateEnvVariable,
	},
	'aliases.getAliases': {
		input: VercelEndpointInputSchemas.aliasesGetAliases,
		output: VercelEndpointOutputSchemas.aliasesGetAliases,
	},
	'aliases.assignAlias': {
		input: VercelEndpointInputSchemas.aliasesAssignAlias,
		output: VercelEndpointOutputSchemas.aliasesAssignAlias,
	},
	'webhooks.getWebhooks': {
		input: VercelEndpointInputSchemas.webhooksGetWebhooks,
		output: VercelEndpointOutputSchemas.webhooksGetWebhooks,
	},
	'webhooks.createWebhook': {
		input: VercelEndpointInputSchemas.webhooksCreateWebhook,
		output: VercelEndpointOutputSchemas.webhooksCreateWebhook,
	},
	'teams.getTeams': {
		input: VercelEndpointInputSchemas.teamsGetTeams,
		output: VercelEndpointOutputSchemas.teamsGetTeams,
	},
} as const;

const vercelWebhooksNested = {
	deploymentCreated: WebhookHandlers.deploymentCreated,
	deploymentSucceeded: WebhookHandlers.deploymentSucceeded,
	deploymentError: WebhookHandlers.deploymentError,
	projectCreated: WebhookHandlers.projectCreated,
} as const;

const vercelWebhookSchemas = {
	deploymentCreated: DeploymentCreatedEventSchema,
	deploymentSucceeded: DeploymentSucceededEventSchema,
	deploymentError: DeploymentErrorEventSchema,
	projectCreated: ProjectCreatedEventSchema,
};

export type VercelWebhooks = {
	deploymentCreated: CorsairWebhook<
		VercelContext,
		VercelWebhookOutputs['deploymentCreated']
	>;
	deploymentSucceeded: CorsairWebhook<
		VercelContext,
		VercelWebhookOutputs['deploymentSucceeded']
	>;
	deploymentError: CorsairWebhook<
		VercelContext,
		VercelWebhookOutputs['deploymentError']
	>;
	projectCreated: CorsairWebhook<
		VercelContext,
		VercelWebhookOutputs['projectCreated']
	>;
};
export type VercelBoundWebhooks = BindWebhooks<typeof vercelWebhooksNested>;

const vercelEndpointMeta = {
	'projects.getProjects': {
		riskLevel: 'read',
		description: 'Get all projects',
	},
	'projects.getProject': {
		riskLevel: 'read',
		description: 'Get project details',
	},
	'deployments.getDeployments': {
		riskLevel: 'read',
		description: 'Get all deployments',
	},
	'deployments.getDeployment': {
		riskLevel: 'read',
		description: 'Get deployment details',
	},
	'deployments.createDeployment': {
		riskLevel: 'write',
		description: 'Create a deployment',
	},
	'domains.getDomains': { riskLevel: 'read', description: 'Get all domains' },
	'domains.getProjectDomains': {
		riskLevel: 'read',
		description: 'Get project domains',
	},
	'envs.getEnvVariables': {
		riskLevel: 'read',
		description:
			'Get environment variables for a project (may include secret/sensitive values)',
	},
	'envs.createEnvVariable': {
		riskLevel: 'write',
		description:
			'Create an environment variable for a project (supports plain, secret, encrypted, and sensitive types)',
	},
	'aliases.getAliases': { riskLevel: 'read', description: 'Get all aliases' },
	'aliases.assignAlias': { riskLevel: 'write', description: 'Assign an alias' },
	'webhooks.getWebhooks': {
		riskLevel: 'read',
		description: 'Get all webhooks',
	},
	'webhooks.createWebhook': {
		riskLevel: 'write',
		description: 'Create a webhook',
	},
	'teams.getTeams': { riskLevel: 'read', description: 'Get all teams' },
} satisfies RequiredPluginEndpointMeta<typeof vercelEndpointsNested>;

export type BaseVercelPlugin<T extends VercelPluginOptions> = CorsairPlugin<
	'vercel',
	typeof VercelSchema,
	typeof vercelEndpointsNested,
	typeof vercelWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalVercelPlugin = BaseVercelPlugin<VercelPluginOptions>;
export type ExternalVercelPlugin<T extends VercelPluginOptions> =
	BaseVercelPlugin<T>;

export function vercel<const T extends VercelPluginOptions>(
	incomingOptions: VercelPluginOptions & T = {} as VercelPluginOptions & T,
): ExternalVercelPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'vercel',
		schema: VercelSchema,
		options: options,
		oauthConfig: undefined,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: vercelEndpointsNested,
		webhooks: vercelWebhooksNested,
		endpointMeta: vercelEndpointMeta,
		endpointSchemas: vercelEndpointSchemas,
		webhookSchemas: vercelWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-vercel-signature' in headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: VercelKeyBuilderContext, source) => {
			const authType = ctx.authType;

			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) {
					throw new Error(
						'[auth-missing:vercel:webhook_signature]: Vercel webhook signature is missing',
					);
				}
				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new Error(
						'[auth-missing:vercel:api_key]: Vercel API Key is missing',
					);
				}
				return res;
			}

			throw new Error(
				`[auth-missing:vercel:${authType}]: Vercel key is missing`,
			);
		},
	} satisfies InternalVercelPlugin;
}

export * from './client';
export type {
	Alias,
	Deployment,
	Domain,
	EnvVariable,
	Project,
	ProjectDomain,
	Team,
	VercelEndpointInputs,
	VercelEndpointOutputs,
	Webhook,
} from './endpoints/types';
