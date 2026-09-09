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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import {
	Account,
	Integrations,
	Organizations,
	Projects,
	System,
	Tools,
} from './endpoints';
import type {
	CodacyEndpointInputs,
	CodacyEndpointOutputs,
} from './endpoints/types';
import {
	CodacyEndpointInputSchemas,
	CodacyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CodacySchema } from './schema';

export type CodacyPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCodacyPlugin['hooks'];
	webhookHooks?: InternalCodacyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof codacyEndpointsNested>;
};

export type CodacyContext = CorsairPluginContext<
	typeof CodacySchema,
	CodacyPluginOptions
>;

export type CodacyKeyBuilderContext = KeyBuilderContext<CodacyPluginOptions>;

export type CodacyBoundEndpoints = BindEndpoints<typeof codacyEndpointsNested>;

type CodacyEndpoint<K extends keyof CodacyEndpointOutputs> = CorsairEndpoint<
	CodacyContext,
	CodacyEndpointInputs[K],
	CodacyEndpointOutputs[K]
>;

export type CodacyEndpoints = {
	createApiToken: CodacyEndpoint<'createApiToken'>;
	deleteApiToken: CodacyEndpoint<'deleteApiToken'>;
	getAccountDetails: CodacyEndpoint<'getAccountDetails'>;
	getConfigurationStatus: CodacyEndpoint<'getConfigurationStatus'>;
	getHealth: CodacyEndpoint<'getHealth'>;
	getOrganizationsRepositoriesSettingsLanguages: CodacyEndpoint<'getOrganizationsRepositoriesSettingsLanguages'>;
	getToolPattern: CodacyEndpoint<'getToolPattern'>;
	getUserOrganizations: CodacyEndpoint<'getUserOrganizations'>;
	getVersion: CodacyEndpoint<'getVersion'>;
	listAnalysisOrganizationsRepositories: CodacyEndpoint<'listAnalysisOrganizationsRepositories'>;
	listDuplicationTools: CodacyEndpoint<'listDuplicationTools'>;
	listLanguagesAndTools: CodacyEndpoint<'listLanguagesAndTools'>;
	listLoginIntegrations: CodacyEndpoint<'listLoginIntegrations'>;
	listMetricsTools: CodacyEndpoint<'listMetricsTools'>;
	listProjects: CodacyEndpoint<'listProjects'>;
	listProviderIntegrations: CodacyEndpoint<'listProviderIntegrations'>;
	listTools: CodacyEndpoint<'listTools'>;
	listToolsPatterns: CodacyEndpoint<'listToolsPatterns'>;
};

const codacyEndpointsNested = {
	account: {
		createApiToken: Account.createApiToken,
		deleteApiToken: Account.deleteApiToken,
		getAccountDetails: Account.getAccountDetails,
	},
	system: {
		getConfigurationStatus: System.getConfigurationStatus,
		getHealth: System.getHealth,
		getVersion: System.getVersion,
	},
	organizations: {
		getOrganizationsRepositoriesSettingsLanguages:
			Organizations.getOrganizationsRepositoriesSettingsLanguages,
		getUserOrganizations: Organizations.getUserOrganizations,
		listAnalysisOrganizationsRepositories:
			Organizations.listAnalysisOrganizationsRepositories,
	},
	tools: {
		getToolPattern: Tools.getToolPattern,
		listDuplicationTools: Tools.listDuplicationTools,
		listLanguagesAndTools: Tools.listLanguagesAndTools,
		listMetricsTools: Tools.listMetricsTools,
		listTools: Tools.listTools,
		listToolsPatterns: Tools.listToolsPatterns,
	},
	integrations: {
		listLoginIntegrations: Integrations.listLoginIntegrations,
		listProviderIntegrations: Integrations.listProviderIntegrations,
	},
	projects: {
		listProjects: Projects.listProjects,
	},
} as const;

const codacyWebhooksNested = {} as const;

export const codacyEndpointSchemas = {
	'account.createApiToken': {
		input: CodacyEndpointInputSchemas.createApiToken,
		output: CodacyEndpointOutputSchemas.createApiToken,
	},
	'account.deleteApiToken': {
		input: CodacyEndpointInputSchemas.deleteApiToken,
		output: CodacyEndpointOutputSchemas.deleteApiToken,
	},
	'account.getAccountDetails': {
		input: CodacyEndpointInputSchemas.getAccountDetails,
		output: CodacyEndpointOutputSchemas.getAccountDetails,
	},
	'system.getConfigurationStatus': {
		input: CodacyEndpointInputSchemas.getConfigurationStatus,
		output: CodacyEndpointOutputSchemas.getConfigurationStatus,
	},
	'system.getHealth': {
		input: CodacyEndpointInputSchemas.getHealth,
		output: CodacyEndpointOutputSchemas.getHealth,
	},
	'organizations.getOrganizationsRepositoriesSettingsLanguages': {
		input:
			CodacyEndpointInputSchemas.getOrganizationsRepositoriesSettingsLanguages,
		output:
			CodacyEndpointOutputSchemas.getOrganizationsRepositoriesSettingsLanguages,
	},
	'tools.getToolPattern': {
		input: CodacyEndpointInputSchemas.getToolPattern,
		output: CodacyEndpointOutputSchemas.getToolPattern,
	},
	'organizations.getUserOrganizations': {
		input: CodacyEndpointInputSchemas.getUserOrganizations,
		output: CodacyEndpointOutputSchemas.getUserOrganizations,
	},
	'system.getVersion': {
		input: CodacyEndpointInputSchemas.getVersion,
		output: CodacyEndpointOutputSchemas.getVersion,
	},
	'organizations.listAnalysisOrganizationsRepositories': {
		input: CodacyEndpointInputSchemas.listAnalysisOrganizationsRepositories,
		output: CodacyEndpointOutputSchemas.listAnalysisOrganizationsRepositories,
	},
	'tools.listDuplicationTools': {
		input: CodacyEndpointInputSchemas.listDuplicationTools,
		output: CodacyEndpointOutputSchemas.listDuplicationTools,
	},
	'tools.listLanguagesAndTools': {
		input: CodacyEndpointInputSchemas.listLanguagesAndTools,
		output: CodacyEndpointOutputSchemas.listLanguagesAndTools,
	},
	'integrations.listLoginIntegrations': {
		input: CodacyEndpointInputSchemas.listLoginIntegrations,
		output: CodacyEndpointOutputSchemas.listLoginIntegrations,
	},
	'tools.listMetricsTools': {
		input: CodacyEndpointInputSchemas.listMetricsTools,
		output: CodacyEndpointOutputSchemas.listMetricsTools,
	},
	'projects.listProjects': {
		input: CodacyEndpointInputSchemas.listProjects,
		output: CodacyEndpointOutputSchemas.listProjects,
	},
	'integrations.listProviderIntegrations': {
		input: CodacyEndpointInputSchemas.listProviderIntegrations,
		output: CodacyEndpointOutputSchemas.listProviderIntegrations,
	},
	'tools.listTools': {
		input: CodacyEndpointInputSchemas.listTools,
		output: CodacyEndpointOutputSchemas.listTools,
	},
	'tools.listToolsPatterns': {
		input: CodacyEndpointInputSchemas.listToolsPatterns,
		output: CodacyEndpointOutputSchemas.listToolsPatterns,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof codacyEndpointsNested
>;

const codacyWebhookSchemas = {} as const satisfies RequiredPluginWebhookSchemas<
	typeof codacyWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const codacyEndpointMeta = {
	'account.createApiToken': {
		riskLevel: 'write',
		description: 'Create Api Token',
	},
	'account.deleteApiToken': {
		riskLevel: 'destructive',
		description: 'Delete Api Token',
	},
	'account.getAccountDetails': {
		riskLevel: 'read',
		description: 'Get Account Details',
	},
	'system.getConfigurationStatus': {
		riskLevel: 'read',
		description: 'Get Configuration Status',
	},
	'system.getHealth': {
		riskLevel: 'read',
		description: 'Get Health',
	},
	'organizations.getOrganizationsRepositoriesSettingsLanguages': {
		riskLevel: 'read',
		description: 'Get Organizations Repositories Settings Languages',
	},
	'tools.getToolPattern': {
		riskLevel: 'read',
		description: 'Get Tool Pattern',
	},
	'organizations.getUserOrganizations': {
		riskLevel: 'read',
		description: 'Get User Organizations',
	},
	'system.getVersion': {
		riskLevel: 'read',
		description: 'Get Version',
	},
	'organizations.listAnalysisOrganizationsRepositories': {
		riskLevel: 'read',
		description: 'List Analysis Organizations Repositories',
	},
	'tools.listDuplicationTools': {
		riskLevel: 'read',
		description: 'List Duplication Tools',
	},
	'tools.listLanguagesAndTools': {
		riskLevel: 'read',
		description: 'List Languages And Tools',
	},
	'integrations.listLoginIntegrations': {
		riskLevel: 'read',
		description: 'List Login Integrations',
	},
	'tools.listMetricsTools': {
		riskLevel: 'read',
		description: 'List Metrics Tools',
	},
	'projects.listProjects': {
		riskLevel: 'read',
		description: 'List Projects',
	},
	'integrations.listProviderIntegrations': {
		riskLevel: 'read',
		description: 'List Provider Integrations',
	},
	'tools.listTools': {
		riskLevel: 'read',
		description: 'List Tools',
	},
	'tools.listToolsPatterns': {
		riskLevel: 'read',
		description: 'List Tools Patterns',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof codacyEndpointsNested>;

export const codacyAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCodacyPlugin<T extends CodacyPluginOptions> = CorsairPlugin<
	'codacy',
	typeof CodacySchema,
	typeof codacyEndpointsNested,
	typeof codacyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCodacyPlugin = BaseCodacyPlugin<CodacyPluginOptions>;

export type ExternalCodacyPlugin<T extends CodacyPluginOptions> =
	BaseCodacyPlugin<T>;

export function codacy<const T extends CodacyPluginOptions>(
	incomingOptions: CodacyPluginOptions & T = {} as CodacyPluginOptions & T,
): ExternalCodacyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'codacy',
		authConfig: codacyAuthConfig,
		schema: CodacySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: codacyEndpointsNested,
		webhooks: codacyWebhooksNested,
		endpointMeta: codacyEndpointMeta,
		endpointSchemas: codacyEndpointSchemas,
		webhookSchemas: codacyWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-codacy-signature' in headers;
		},
		pluginTenantWebhookMatcher: () => null,
		oauthWebhookTenantLinkResolver: () => null,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CodacyKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalCodacyPlugin;
}

export type {
	CodacyEndpointInputs,
	CodacyEndpointOutputs,
} from './endpoints/types';
